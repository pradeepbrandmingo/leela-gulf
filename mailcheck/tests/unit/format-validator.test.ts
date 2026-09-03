import { describe, it, expect } from "vitest";
import { validateFormat } from "@/lib/email/format-validator";

describe("validateFormat", () => {
  it("accepts a normal address", () => {
    const { result, normalized } = validateFormat("John.Doe@Example.COM");
    expect(result.status).toBe("pass");
    expect(normalized?.domain).toBe("example.com");
    expect(normalized?.localPart).toBe("John.Doe"); // local part case preserved
  });

  it("rejects empty input", () => {
    expect(validateFormat("").result.status).toBe("fail");
    expect(validateFormat("   ").result.status).toBe("fail");
  });

  it("rejects addresses missing @", () => {
    expect(validateFormat("johnexample.com").result.status).toBe("fail");
  });

  it("rejects addresses missing a domain", () => {
    expect(validateFormat("john@").result.status).toBe("fail");
  });

  it("rejects a domain with no dot", () => {
    expect(validateFormat("john@localhost").result.status).toBe("fail");
  });

  it("rejects non-string input", () => {
    expect(validateFormat(undefined).result.status).toBe("fail");
    expect(validateFormat(12345).result.status).toBe("fail");
  });

  it("rejects a local part over 64 characters", () => {
    const longLocal = "a".repeat(65);
    expect(validateFormat(`${longLocal}@example.com`).result.status).toBe("fail");
  });

  it("trims surrounding whitespace without altering the address", () => {
    const { normalized } = validateFormat("  jane@example.com  ");
    expect(normalized?.normalized).toBe("jane@example.com");
  });
});
