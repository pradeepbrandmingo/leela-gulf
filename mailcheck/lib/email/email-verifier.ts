import { validateFormat } from "./format-validator";
import { validateDomain } from "./dns-validator";
import { resolveMxRecords } from "./mx-resolver";
import { verifySmtpRecipient, classifySmtpResponse } from "./smtp-verifier";
import type { EmailVerificationResult, VerificationStatus } from "./types";

/**
 * MailCheck verification engine.
 *
 * IMPORTANT — what this deliberately does NOT do:
 *   - It never sends the SMTP `DATA` command, so no message content is ever
 *     transmitted and no email is ever actually sent.
 *   - It never asks the recipient to click a link, enter an OTP, or take
 *     any action. There is no ownership/possession proof here at all.
 *   - It only tells you whether the mail *server* is currently willing to
 *     accept a message for that address — a purely technical, point-in-time
 *     signal, not a guarantee.
 *
 * Pipeline: format -> domain -> MX -> SMTP RCPT TO, short-circuiting as
 * soon as an earlier stage makes a later one meaningless (e.g. there is no
 * point doing an MX lookup for a syntactically invalid address).
 */
export async function runEmailVerification(rawEmail: string): Promise<EmailVerificationResult> {
  const checkedAt = new Date().toISOString();

  const { result: formatResult, normalized } = validateFormat(rawEmail);

  if (formatResult.status !== "pass" || !normalized) {
    return {
      email: typeof rawEmail === "string" ? rawEmail : "",
      normalizedEmail: typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "",
      status: "undeliverable",
      checks: {
        format: formatResult,
        domain: { status: "unknown", domain: "" },
        mx: { status: "unknown", records: [] },
        smtp: { connectionStatus: "skipped", recipientStatus: "unknown", reason: "Skipped — invalid format." },
      },
      checkedAt,
      fromCache: false,
    };
  }

  const domainResult = await validateDomain(normalized.domain);

  if (domainResult.status === "fail") {
    return {
      email: normalized.email,
      normalizedEmail: normalized.normalized,
      status: "undeliverable",
      checks: {
        format: formatResult,
        domain: domainResult,
        mx: { status: "unknown", records: [] },
        smtp: { connectionStatus: "skipped", recipientStatus: "unknown", reason: "Skipped — domain does not exist." },
      },
      checkedAt,
      fromCache: false,
    };
  }

  const mxResult = await resolveMxRecords(normalized.domain);

  if (mxResult.status === "not_found") {
    return {
      email: normalized.email,
      normalizedEmail: normalized.normalized,
      status: "undeliverable",
      checks: {
        format: formatResult,
        domain: domainResult,
        mx: mxResult,
        smtp: { connectionStatus: "skipped", recipientStatus: "unknown", reason: "Skipped — no mail servers for this domain." },
      },
      checkedAt,
      fromCache: false,
    };
  }

  if (mxResult.status === "unknown") {
    return {
      email: normalized.email,
      normalizedEmail: normalized.normalized,
      status: "unknown",
      checks: {
        format: formatResult,
        domain: domainResult,
        mx: mxResult,
        smtp: { connectionStatus: "skipped", recipientStatus: "unknown", reason: "Skipped — MX lookup inconclusive." },
      },
      checkedAt,
      fromCache: false,
    };
  }

  const smtpResult = await verifySmtpRecipient(normalized.normalized, normalized.domain, mxResult.records);

  const overallStatus = deriveOverallStatus(smtpResult.connectionStatus, smtpResult.code, smtpResult.catchAllSuspected);

  return {
    email: normalized.email,
    normalizedEmail: normalized.normalized,
    status: overallStatus,
    checks: {
      format: formatResult,
      domain: domainResult,
      mx: mxResult,
      smtp: smtpResult,
    },
    checkedAt,
    fromCache: false,
  };
}

function deriveOverallStatus(
  connectionStatus: string,
  code: number | undefined,
  catchAllSuspected: boolean | undefined
): VerificationStatus {
  if (connectionStatus !== "success") {
    // failed / timeout / skipped -> we never learned anything definitive.
    return "unknown";
  }
  if (catchAllSuspected) {
    // Server accepts everything -> can't confirm this specific mailbox.
    return "unknown";
  }
  return classifySmtpResponse(code, undefined).status;
}
