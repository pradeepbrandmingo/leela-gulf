import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { historyQuerySchema } from "@/lib/validation/schemas";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = historyQuerySchema.safeParse({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_REQUEST", message: "Invalid query parameters." } },
      { status: 400 }
    );
  }

  const { search, status, from, to, page, pageSize } = parsed.data;

  const where: Prisma.VerificationWhereInput = {
    ...(status ? { status } : {}),
    ...(search ? { normalizedEmail: { contains: search.trim().toLowerCase() } } : {}),
    ...(from || to
      ? {
          checkedAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
  };

  try {
    const [rows, total] = await Promise.all([
      prisma.verification.findMany({
        where,
        orderBy: { checkedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.verification.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (err) {
    console.error("[verifications] list error", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Could not load verification history." } },
      { status: 500 }
    );
  }
}
