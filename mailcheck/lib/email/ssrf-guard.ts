import { isIP } from "node:net";

/**
 * SSRF protection.
 *
 * The verification endpoint accepts only `{ email }` from the client (see
 * lib/validation/schemas.ts) — the server alone decides which host/port to
 * connect to, by resolving MX records for the email's domain. This module
 * is the last line of defense: before we ever open a TCP socket, every
 * resolved IP address is checked against known-private / reserved ranges
 * so a maliciously crafted domain (e.g. one whose MX record points at
 * 169.254.169.254 or 127.0.0.1) cannot turn this endpoint into an internal
 * port scanner or metadata-service proxy.
 *
 * Only port 25 (SMTP) is ever dialed — see smtp-verifier.ts — and it is not
 * configurable via any request parameter.
 */

// IPv4 CIDR blocks we refuse to connect to.
const BLOCKED_IPV4_RANGES: Array<{ base: number[]; bits: number }> = [
  { base: [0, 0, 0, 0], bits: 8 }, // "this" network
  { base: [10, 0, 0, 0], bits: 8 }, // private
  { base: [100, 64, 0, 0], bits: 10 }, // carrier-grade NAT
  { base: [127, 0, 0, 0], bits: 8 }, // loopback
  { base: [169, 254, 0, 0], bits: 16 }, // link-local / cloud metadata
  { base: [172, 16, 0, 0], bits: 12 }, // private
  { base: [192, 0, 0, 0], bits: 24 }, // IETF protocol assignments
  { base: [192, 0, 2, 0], bits: 24 }, // TEST-NET-1
  { base: [192, 88, 99, 0], bits: 24 }, // 6to4 relay anycast
  { base: [192, 168, 0, 0], bits: 16 }, // private
  { base: [198, 18, 0, 0], bits: 15 }, // benchmarking
  { base: [198, 51, 100, 0], bits: 24 }, // TEST-NET-2
  { base: [203, 0, 113, 0], bits: 24 }, // TEST-NET-3
  { base: [224, 0, 0, 0], bits: 4 }, // multicast
  { base: [240, 0, 0, 0], bits: 4 }, // reserved / broadcast
];

function ipv4ToInt(parts: number[]): number {
  return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
}

function isBlockedIpv4(address: string): boolean {
  const octets = address.split(".").map((n) => Number.parseInt(n, 10));
  if (octets.length !== 4 || octets.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return true; // malformed -> treat as blocked
  }
  const addrInt = ipv4ToInt(octets);
  return BLOCKED_IPV4_RANGES.some(({ base, bits }) => {
    const baseInt = ipv4ToInt(base);
    const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
    return (addrInt & mask) === (baseInt & mask);
  });
}

function isBlockedIpv6(address: string): boolean {
  const normalized = address.toLowerCase();

  // IPv4-mapped IPv6 (::ffff:127.0.0.1) — extract and check the IPv4 part.
  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) {
    return isBlockedIpv4(mapped[1]!);
  }

  if (normalized === "::1") return true; // loopback
  if (normalized === "::") return true; // unspecified
  if (normalized.startsWith("fe80:")) return true; // link-local
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true; // unique local (fc00::/7)
  if (normalized.startsWith("ff")) return true; // multicast
  if (normalized.startsWith("2001:db8:")) return true; // documentation
  if (normalized.startsWith("64:ff9b::")) return true; // NAT64 — can tunnel to IPv4 private space

  return false;
}

/**
 * Returns true if the given resolved IP address is safe to open an outbound
 * SMTP connection to (i.e. it is a public, non-reserved address).
 */
export function isPublicAddress(address: string): boolean {
  const version = isIP(address);
  if (version === 4) return !isBlockedIpv4(address);
  if (version === 6) return !isBlockedIpv6(address);
  return false; // not a valid IP at all
}

/** Hostnames we refuse to resolve/connect to regardless of what DNS says. */
const BLOCKED_HOSTNAME_SUFFIXES = ["localhost", ".local", ".internal"];

export function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => lower === suffix || lower.endsWith(suffix));
}
