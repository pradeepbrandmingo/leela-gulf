/**
 * Shared types for the MailCheck verification engine.
 *
 * These are intentionally decoupled from the Prisma enums in
 * prisma/schema.prisma — the engine should be usable without a database,
 * and the API layer maps between the two.
 */

export type CheckStatus = "pass" | "fail" | "unknown";

export type VerificationStatus = "deliverable" | "undeliverable" | "unknown";

export interface FormatCheckResult {
  status: CheckStatus;
  /** Human-readable reason, safe to show to the caller. */
  reason?: string;
}

export interface DomainCheckResult {
  status: CheckStatus;
  domain: string;
  reason?: string;
}

export interface MxRecord {
  exchange: string;
  priority: number;
}

export type MxCheckStatus = "found" | "not_found" | "unknown";

export interface MxCheckResult {
  status: MxCheckStatus;
  records: MxRecord[];
  reason?: string;
}

export type SmtpConnectionStatus = "success" | "failed" | "timeout" | "skipped";
export type SmtpRecipientStatus = "accepted" | "rejected" | "unknown";

export interface SmtpCheckResult {
  connectionStatus: SmtpConnectionStatus;
  recipientStatus: SmtpRecipientStatus;
  /** Final numeric SMTP response code for the RCPT TO step, if we got one. */
  code?: number;
  /** Final SMTP response line/message for the RCPT TO step, if we got one. */
  message?: string;
  mxHost?: string;
  /** True if the same server also accepted an obviously bogus recipient. */
  catchAllSuspected?: boolean;
  reason?: string;
}

export interface EmailVerificationResult {
  email: string;
  normalizedEmail: string;
  status: VerificationStatus;
  checks: {
    format: FormatCheckResult;
    domain: DomainCheckResult;
    mx: MxCheckResult;
    smtp: SmtpCheckResult;
  };
  checkedAt: string; // ISO timestamp
  fromCache: boolean;
}

/**
 * Classification of a single SMTP status/reply — used for both the RCPT TO
 * response and (internally) the catch-all probe response.
 */
export interface SmtpClassification {
  status: VerificationStatus;
  reason: string;
}

/** Shape returned by POST /api/verify-email — consumed by client components. */
export interface ApiVerifyResponse {
  success: true;
  email: string;
  status: VerificationStatus;
  fromCache: boolean;
  checks: {
    format: { status: CheckStatus };
    domain: { status: CheckStatus };
    mx: { status: MxCheckStatus };
    smtp: {
      status: SmtpConnectionStatus;
      recipientStatus: SmtpRecipientStatus | null;
      code?: number;
      message?: string;
      mxHost?: string;
      catchAllSuspected: boolean;
    };
  };
  checkedAt: string;
}

/** Structured, user-safe error surfaced by the API. Never leak raw exceptions. */
export interface PublicApiError {
  code:
    | "INVALID_REQUEST"
    | "RATE_LIMITED"
    | "DNS_LOOKUP_FAILED"
    | "SMTP_CONNECTION_FAILED"
    | "INTERNAL_ERROR";
  message: string;
}
