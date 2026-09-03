import { describe, it, expect, vi, beforeEach } from "vitest";

const resolveMx = vi.fn();
const resolve4 = vi.fn();
const resolve6 = vi.fn();

vi.mock("node:dns/promises", () => ({
  default: {
    resolveMx: (...args: unknown[]) => resolveMx(...args),
    resolve4: (...args: unknown[]) => resolve4(...args),
    resolve6: (...args: unknown[]) => resolve6(...args),
  },
}));

// Imported after the mock so it picks up the mocked module.
const { resolveMxRecords } = await import("@/lib/email/mx-resolver");

beforeEach(() => {
  resolveMx.mockReset();
  resolve4.mockReset();
  resolve6.mockReset();
});

describe("resolveMxRecords", () => {
  it("sorts multiple MX records by ascending priority", async () => {
    resolveMx.mockResolvedValue([
      { exchange: "mx2.example.com", priority: 20 },
      { exchange: "mx1.example.com", priority: 10 },
      { exchange: "mx3.example.com", priority: 30 },
    ]);

    const result = await resolveMxRecords("example.com");

    expect(result.status).toBe("found");
    expect(result.records.map((r) => r.exchange)).toEqual([
      "mx1.example.com",
      "mx2.example.com",
      "mx3.example.com",
    ]);
  });

  it("falls back to implicit MX (A record) when there are no MX records", async () => {
    const enodata = Object.assign(new Error("no data"), { code: "ENODATA" });
    resolveMx.mockRejectedValue(enodata);
    resolve4.mockResolvedValue(["93.184.216.34"]);

    const result = await resolveMxRecords("small-domain.com");

    expect(result.status).toBe("found");
    expect(result.records).toEqual([{ exchange: "small-domain.com", priority: 0 }]);
  });

  it("returns not_found for NXDOMAIN", async () => {
    const nxdomain = Object.assign(new Error("nx"), { code: "ENOTFOUND" });
    resolveMx.mockRejectedValue(nxdomain);

    const result = await resolveMxRecords("randomdomain123xyz.test");

    expect(result.status).toBe("not_found");
  });

  it("returns unknown (not undeliverable) on SERVFAIL", async () => {
    const servfail = Object.assign(new Error("servfail"), { code: "SERVFAIL" });
    resolveMx.mockRejectedValue(servfail);

    const result = await resolveMxRecords("flaky-dns.example");

    expect(result.status).toBe("unknown");
  });

  it("returns not_found when neither MX nor implicit A/AAAA exist", async () => {
    const enodata = Object.assign(new Error("no data"), { code: "ENODATA" });
    resolveMx.mockRejectedValue(enodata);
    resolve4.mockRejectedValue(new Error("no a record"));
    resolve6.mockRejectedValue(new Error("no aaaa record"));

    const result = await resolveMxRecords("mail-free-domain.test");

    expect(result.status).toBe("not_found");
  });
});
