import type { SmtpClassification } from "./types";

/**
 * Classifies a single SMTP reply code (as returned to RCPT TO) into a
 * deliverability verdict.
 *
 * Reasoning (documented per the spec requirement):
 *
 * - 2xx: the server accepted the recipient. This is the strongest signal
 *   we can get without actually sending mail -> "deliverable".
 *
 * - 5xx: a *permanent* negative completion reply. RFC 5321 §4.2.1 defines
 *   5xx as "the command was not accepted and the requested action did not
 *   occur." For RCPT TO specifically, 550/551/553 typically mean "no such
 *   user" or "mailbox unavailable" -> "undeliverable". We do NOT special
 *   case individual 5xx codes beyond this because greylisting and
 *   anti-spam systems vary too much between providers to hand-pick further
 *   distinctions safely; treating all 5xx on RCPT TO as a permanent
 *   rejection is the conservative, standard interpretation.
 *
 * - 4xx: a *transient* negative completion reply (RFC 5321 §4.2.1) — the
 *   server is asking us to try again later (mailbox temporarily over
 *   quota, greylisting, temporary local error, etc.). This tells us
 *   nothing definitive about deliverability, so it must map to "unknown",
 *   never "undeliverable".
 *
 * - Anything else (malformed/unparseable code, or no code at all because
 *   the connection dropped before a reply arrived) is conservatively
 *   "unknown" — we never guess.
 */
export function classifySmtpResponse(code: number | undefined, message: string | undefined): SmtpClassification {
  if (typeof code !== "number" || Number.isNaN(code)) {
    return { status: "unknown", reason: "No parseable SMTP response code was received." };
  }

  if (code >= 200 && code < 300) {
    return { status: "deliverable", reason: `SMTP server accepted the recipient (${code}).` };
  }

  if (code >= 500 && code < 600) {
    return {
      status: "undeliverable",
      reason: `SMTP server permanently rejected the recipient (${code}): ${message ?? "no message"}.`,
    };
  }

  if (code >= 400 && code < 500) {
    return {
      status: "unknown",
      reason: `SMTP server returned a temporary failure (${code}); this does not confirm the mailbox is invalid.`,
    };
  }

  // 1xx or 3xx on RCPT TO is not meaningful in this context (SMTP command
  // replies are 2xx/4xx/5xx by RFC 5321; anything else is non-standard).
  return { status: "unknown", reason: `Unexpected SMTP response code (${code}).` };
}
