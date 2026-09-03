import { describe, it, expect } from "vitest";
import { classifySmtpResponse } from "@/lib/email/classify-smtp-response";

describe("classifySmtpResponse", () => {
  it("classifies 2xx as deliverable", () => {
    expect(classifySmtpResponse(250, "2.1.5 OK").status).toBe("deliverable");
    expect(classifySmtpResponse(251, "User not local; forward").status).toBe("deliverable");
  });

  it("classifies 5xx as undeliverable", () => {
    expect(classifySmtpResponse(550, "No such user").status).toBe("undeliverable");
    expect(classifySmtpResponse(553, "Mailbox unavailable").status).toBe("undeliverable");
  });

  it("classifies 4xx as unknown, never undeliverable", () => {
    const result = classifySmtpResponse(450, "Greylisted");
    expect(result.status).toBe("unknown");
    expect(result.status).not.toBe("undeliverable");
  });

  it("classifies a missing code as unknown", () => {
    expect(classifySmtpResponse(undefined, undefined).status).toBe("unknown");
  });

  it("classifies malformed / unexpected codes as unknown", () => {
    expect(classifySmtpResponse(100, "unexpected").status).toBe("unknown");
    expect(classifySmtpResponse(999, "bogus").status).toBe("unknown");
  });
});
