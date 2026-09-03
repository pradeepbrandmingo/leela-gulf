import type { FormatCheckResult } from "./types";

/**
 * Format validation.
 *
 * We deliberately do NOT try to hand-roll a full RFC 5322 grammar — that
 * grammar technically allows addresses (quoted local parts, comments,
 * folding whitespace) that essentially no real mail system accepts in
 * practice, and a "more correct" regex is not more useful here.
 *
 * Instead we use the same pragmatic pattern browsers use for
 * `<input type="email">` (the WHATWG HTML Living Standard's email regex),
 * plus explicit length limits from RFC 5321 (local part <= 64 octets,
 * domain <= 255 octets, whole address <= 254 octets). This is the
 * "well-tested" approach referenced by the spec: it's the same validation
 * billions of browser form fields already rely on.
 */
const HTML5_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const MAX_LOCAL_PART_LENGTH = 64;
const MAX_DOMAIN_LENGTH = 255;
const MAX_TOTAL_LENGTH = 254;

export interface NormalizedEmail {
  /** Original input with only leading/trailing whitespace removed. */
  email: string;
  /** local part unchanged (case is significant per RFC), domain lowercased. */
  normalized: string;
  localPart: string;
  domain: string;
}

/**
 * Validates and normalizes a raw email string.
 *
 * Normalization is intentionally minimal and safe:
 *  - trims surrounding whitespace
 *  - lowercases the domain only (domains are case-insensitive; local parts
 *    are technically case-sensitive per RFC 5321, so we leave them as-is)
 *
 * We never rewrite or "fix" the local part.
 */
export function validateFormat(rawEmail: unknown): {
  result: FormatCheckResult;
  normalized: NormalizedEmail | null;
} {
  if (typeof rawEmail !== "string") {
    return {
      result: { status: "fail", reason: "Email must be a string." },
      normalized: null,
    };
  }

  const trimmed = rawEmail.trim();

  if (trimmed.length === 0) {
    return {
      result: { status: "fail", reason: "Email address is required." },
      normalized: null,
    };
  }

  if (trimmed.length > MAX_TOTAL_LENGTH) {
    return {
      result: { status: "fail", reason: "Email address is too long." },
      normalized: null,
    };
  }

  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === trimmed.length - 1) {
    return {
      result: { status: "fail", reason: "Email address is missing a local part or domain." },
      normalized: null,
    };
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);

  if (localPart.length > MAX_LOCAL_PART_LENGTH) {
    return {
      result: { status: "fail", reason: "Local part exceeds 64 characters." },
      normalized: null,
    };
  }

  if (domainPart.length > MAX_DOMAIN_LENGTH) {
    return {
      result: { status: "fail", reason: "Domain exceeds 255 characters." },
      normalized: null,
    };
  }

  if (!domainPart.includes(".")) {
    return {
      result: { status: "fail", reason: "Domain must contain at least one dot." },
      normalized: null,
    };
  }

  if (!HTML5_EMAIL_REGEX.test(trimmed)) {
    return {
      result: { status: "fail", reason: "Email address is not syntactically valid." },
      normalized: null,
    };
  }

  const lowerDomain = domainPart.toLowerCase();
  const normalized = `${localPart}@${lowerDomain}`;

  return {
    result: { status: "pass" },
    normalized: {
      email: trimmed,
      normalized,
      localPart,
      domain: lowerDomain,
    },
  };
}
