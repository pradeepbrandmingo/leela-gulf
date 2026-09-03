import { NextRequest, NextResponse } from "next/server";
import { verifyEmailRequestSchema } from "@/lib/validation/schemas";
import { runEmailVerification } from "@/lib/email/email-verifier";
import { prisma } from "@/lib/db/prisma";
import { getRateLimiter, getClientIp } from "@/lib/rate-limit/rate-limiter";
import type { PublicApiError, VerificationStatus } from "@/lib/email/types";
import type { Prisma } from "@prisma/client";

// The verifier opens raw TCP sockets to talk SMTP — this is NOT possible on
// the Edge runtime, so this route must run on Node.js.
export const runtime = "nodejs";
// Never cache a live verification result at the platform/CDN level.
export const dynamic = "force-dynamic";

const CACHE_HOURS = Number(process.env.VERIFICATION_CACHE_HOURS ?? 24);

function errorResponse(status: number, error: PublicApiError) {
  return NextResponse.json({ success: false, status: "unknown", error }, { status });
}

export async function POST(req: NextRequest) {
  // --- Rate limiting -----------------------------------------------------
  const ip = getClientIp(req.headers);
  const limiter = getRateLimiter();
  const rateResult = await limiter.check(`verify-email:${ip}`);

  if (!rateResult.allowed) {
    return errorResponse(429, {
      code: "RATE_LIMITED",
      message: "Too many verification requests. Please try again shortly.",
    });
  }

  // --- Request validation --------------------------------------------------
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, { code: "INVALID_REQUEST", message: "Request body must be valid JSON." });
  }

  const parsed = verifyEmailRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, {
      code: "INVALID_REQUEST",
      message: "A valid 'email' field is required.",
    });
  }

  const { email, recheck } = parsed.data;
  const normalizedForLookup = email.trim().toLowerCase();

  try {
    // --- Cache lookup ------------------------------------------------------
    if (!recheck) {
      const cutoff = new Date(Date.now() - CACHE_HOURS * 60 * 60 * 1000);
      const cached = await prisma.verification.findFirst({
        where: { normalizedEmail: normalizedForLookup, checkedAt: { gte: cutoff } },
        orderBy: { checkedAt: "desc" },
      });

      if (cached) {
        return NextResponse.json(toApiResponse(cached, true));
      }
    }

    // --- Run the actual verification pipeline ------------------------------
    const result = await runEmailVerification(email);

    const saved = await prisma.verification.create({
      data: {
        email: result.email,
        normalizedEmail: result.normalizedEmail,
        status: result.status,
        formatStatus: result.checks.format.status,
        domainStatus: result.checks.domain.status,
        mxStatus: result.checks.mx.status,
        smtpStatus: result.checks.smtp.connectionStatus,
        smtpRecipientStatus: result.checks.smtp.recipientStatus,
        smtpCode: result.checks.smtp.code,
        smtpMessage: result.checks.smtp.message,
        mxHost: result.checks.smtp.mxHost,
        catchAllSuspected: result.checks.smtp.catchAllSuspected ?? false,
        checkedAt: new Date(result.checkedAt),
      },
    });

    return NextResponse.json(toApiResponse(saved, false));
  } catch (err) {
    // Never leak raw exceptions to the client.
    console.error("[verify-email] unexpected error", { ip, message: (err as Error)?.message });
    return errorResponse(500, {
      code: "INTERNAL_ERROR",
      message: "Verification could not be completed. Please try again.",
    });
  }
}

/** Shapes a Verification DB row into the public API response contract. */
function toApiResponse(row: Prisma.VerificationGetPayload<Record<string, never>>, fromCache: boolean) {
  return {
    success: true,
    email: row.email,
    status: row.status as VerificationStatus,
    fromCache,
    checks: {
      format: { status: row.formatStatus },
      domain: { status: row.domainStatus },
      mx: { status: row.mxStatus },
      smtp: {
        status: row.smtpStatus,
        recipientStatus: row.smtpRecipientStatus,
        code: row.smtpCode ?? undefined,
        message: row.smtpMessage ?? undefined,
        mxHost: row.mxHost ?? undefined,
        catchAllSuspected: row.catchAllSuspected,
      },
    },
    checkedAt: row.checkedAt.toISOString(),
  };
}
