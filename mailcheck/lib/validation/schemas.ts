import { z } from "zod";

/**
 * The ONLY thing a client may send. Deliberately does not allow a host,
 * port, or any connection parameter — the server always determines the
 * mail server itself via MX lookup. See lib/email/ssrf-guard.ts.
 */
export const verifyEmailRequestSchema = z.object({
  email: z.string().min(3).max(320),
  /** If true, ignore any cached result and force a fresh SMTP check. */
  recheck: z.boolean().optional().default(false),
});

export type VerifyEmailRequest = z.infer<typeof verifyEmailRequestSchema>;

export const historyQuerySchema = z.object({
  search: z.string().max(320).optional(),
  status: z.enum(["deliverable", "undeliverable", "unknown"]).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
