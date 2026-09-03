import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    verification: {
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({ id: "test-id", createdAt: new Date(), updatedAt: new Date(), ...data })
      ),
    },
  },
}));

vi.mock("@/lib/email/email-verifier", () => ({
  runEmailVerification: vi.fn().mockResolvedValue({
    email: "john@gmail.com",
    normalizedEmail: "john@gmail.com",
    status: "deliverable",
    checks: {
      format: { status: "pass" },
      domain: { status: "pass" },
      mx: { status: "found", records: [{ exchange: "gmail-smtp-in.l.google.com", priority: 5 }] },
      smtp: {
        connectionStatus: "success",
        recipientStatus: "accepted",
        code: 250,
        message: "2.1.5 OK",
        mxHost: "gmail-smtp-in.l.google.com",
        catchAllSuspected: false,
      },
    },
    checkedAt: new Date().toISOString(),
    fromCache: false,
  }),
}));

const { POST } = await import("@/app/api/verify-email/route");

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/verify-email", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/verify-email", () => {
  it("rejects a request with no email field", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("INVALID_REQUEST");
  });

  it("rejects a request that supplies host/port instead of email", async () => {
    const res = await POST(makeRequest({ host: "evil.internal", port: 25 }));
    expect(res.status).toBe(400);
  });

  it("returns a deliverable result for a valid request", async () => {
    const res = await POST(makeRequest({ email: "john@gmail.com" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.status).toBe("deliverable");
    expect(json.checks.smtp.code).toBe(250);
  });

  it("never leaks a raw error message to the client on failure", async () => {
    const { prisma } = await import("@/lib/db/prisma");
    (prisma.verification.create as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("ECONNREFUSED 142.250.1.1:25 super secret internal detail")
    );

    const res = await POST(makeRequest({ email: "jane@example.com" }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
    expect(JSON.stringify(json)).not.toContain("ECONNREFUSED");
    expect(JSON.stringify(json)).not.toContain("142.250.1.1");
  });
});
