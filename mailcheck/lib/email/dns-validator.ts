import dns from "node:dns/promises";
import type { DomainCheckResult } from "./types";
import { isBlockedHostname } from "./ssrf-guard";

const DNS_TIMEOUT_MS = Number(process.env.DNS_TIMEOUT_MS ?? 5000);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("DNS_TIMEOUT")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/**
 * Confirms the domain itself resolves (A or AAAA). This is a lighter-weight
 * sanity check that runs before the MX lookup — a domain with no DNS
 * presence at all is almost certainly not going to have a working MX
 * either, and failing fast here gives a clearer "domain" failure reason
 * rather than an opaque MX failure.
 *
 * Note: a domain can validly have MX records but no A/AAAA record (mail is
 * often the only service some domains run), so this check alone never
 * marks a domain "fail" just because A/AAAA is missing — that decision is
 * deferred to the MX lookup, which is authoritative for mail routing.
 */
export async function validateDomain(domain: string): Promise<DomainCheckResult> {
  if (isBlockedHostname(domain)) {
    return { status: "fail", domain, reason: "Domain is not eligible for verification." };
  }

  try {
    await withTimeout(dns.resolve4(domain), DNS_TIMEOUT_MS);
    return { status: "pass", domain };
  } catch (ipv4Error) {
    // Some domains are IPv6-only. Try AAAA before giving up.
    try {
      await withTimeout(dns.resolve6(domain), DNS_TIMEOUT_MS);
      return { status: "pass", domain };
    } catch (ipv6Error) {
      const code = (ipv4Error as NodeJS.ErrnoException)?.code;
      if (code === "ENOTFOUND" || code === "NXDOMAIN") {
        return { status: "fail", domain, reason: "Domain does not exist." };
      }
      // SERVFAIL, ETIMEOUT, network hiccups etc. — inconclusive, not a fail.
      return { status: "unknown", domain, reason: "Domain lookup was inconclusive." };
    }
  }
}
