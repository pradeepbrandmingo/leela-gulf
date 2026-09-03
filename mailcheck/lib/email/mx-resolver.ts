import dns from "node:dns/promises";
import type { MxCheckResult, MxRecord } from "./types";

const DNS_TIMEOUT_MS = Number(process.env.DNS_TIMEOUT_MS ?? 5000);

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms);
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
 * Resolves MX records for a domain, sorted ascending by priority (lower
 * priority number = more preferred, per RFC 5321 §5).
 *
 * RFC 5321 §5.1 defines "implicit MX" fallback: if a domain has no MX
 * records but does have an A/AAAA record, mail is routed directly to that
 * host at priority 0. Many legitimately-configured small domains rely on
 * this. We implement that fallback here so such domains aren't incorrectly
 * marked "not found" — this mirrors what real MTAs do, it is not a
 * heuristic we invented.
 */
export async function resolveMxRecords(domain: string): Promise<MxCheckResult> {
  try {
    const records = await withTimeout(dns.resolveMx(domain), DNS_TIMEOUT_MS, "MX_TIMEOUT");

    if (records.length > 0) {
      const sorted: MxRecord[] = [...records]
        .sort((a, b) => a.priority - b.priority)
        .map((r) => ({ exchange: r.exchange, priority: r.priority }));
      return { status: "found", records: sorted };
    }

    // Empty MX array (rare, but distinct from NXDOMAIN) -> try implicit MX.
    return await implicitMxFallback(domain);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    const message = (err as Error)?.message;

    if (code === "ENODATA") {
      // Domain exists, explicitly has no MX records -> try implicit MX.
      return await implicitMxFallback(domain);
    }
    if (code === "ENOTFOUND" || code === "NXDOMAIN") {
      return { status: "not_found", records: [], reason: "Domain does not exist." };
    }
    if (message === "MX_TIMEOUT") {
      return { status: "unknown", records: [], reason: "MX lookup timed out." };
    }
    if (code === "SERVFAIL" || code === "ETIMEOUT" || code === "ECONNREFUSED") {
      return { status: "unknown", records: [], reason: "MX lookup was inconclusive (DNS server error)." };
    }
    return { status: "unknown", records: [], reason: "MX lookup failed unexpectedly." };
  }
}

async function implicitMxFallback(domain: string): Promise<MxCheckResult> {
  try {
    await withTimeout(dns.resolve4(domain), DNS_TIMEOUT_MS, "A_TIMEOUT");
    return { status: "found", records: [{ exchange: domain, priority: 0 }] };
  } catch {
    try {
      await withTimeout(dns.resolve6(domain), DNS_TIMEOUT_MS, "AAAA_TIMEOUT");
      return { status: "found", records: [{ exchange: domain, priority: 0 }] };
    } catch {
      return { status: "not_found", records: [], reason: "No MX records and no implicit A/AAAA fallback." };
    }
  }
}
