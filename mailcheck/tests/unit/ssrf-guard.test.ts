import { describe, it, expect } from "vitest";
import { isPublicAddress, isBlockedHostname } from "@/lib/email/ssrf-guard";

describe("isPublicAddress", () => {
  it("blocks loopback", () => {
    expect(isPublicAddress("127.0.0.1")).toBe(false);
    expect(isPublicAddress("::1")).toBe(false);
  });

  it("blocks private IPv4 ranges", () => {
    expect(isPublicAddress("10.0.0.5")).toBe(false);
    expect(isPublicAddress("172.16.0.5")).toBe(false);
    expect(isPublicAddress("192.168.1.1")).toBe(false);
  });

  it("blocks the cloud metadata address", () => {
    expect(isPublicAddress("169.254.169.254")).toBe(false);
  });

  it("blocks IPv4-mapped IPv6 private addresses", () => {
    expect(isPublicAddress("::ffff:127.0.0.1")).toBe(false);
    expect(isPublicAddress("::ffff:10.0.0.1")).toBe(false);
  });

  it("blocks unique-local and link-local IPv6", () => {
    expect(isPublicAddress("fd00::1")).toBe(false);
    expect(isPublicAddress("fe80::1")).toBe(false);
  });

  it("allows plausible public IPv4 addresses", () => {
    expect(isPublicAddress("8.8.8.8")).toBe(true);
    expect(isPublicAddress("142.250.72.14")).toBe(true);
  });

  it("rejects garbage input", () => {
    expect(isPublicAddress("not-an-ip")).toBe(false);
  });
});

describe("isBlockedHostname", () => {
  it("blocks localhost and .local/.internal suffixes", () => {
    expect(isBlockedHostname("localhost")).toBe(true);
    expect(isBlockedHostname("printer.local")).toBe(true);
    expect(isBlockedHostname("db.internal")).toBe(true);
  });

  it("allows ordinary public domains", () => {
    expect(isBlockedHostname("gmail-smtp-in.l.google.com")).toBe(false);
  });
});
