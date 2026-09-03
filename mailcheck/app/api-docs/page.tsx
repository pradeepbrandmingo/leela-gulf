import { Card } from "@/components/ui/card";

const CODE_BLOCK_CLASS =
  "mt-2 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-slate-100";

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">API</h1>
        <p className="mt-1 text-sm text-slate-500">Programmatic access to email verification.</p>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-slate-900">POST /api/verify-email</h2>
        <p className="mt-1 text-sm text-slate-500">
          Runs format, DNS/MX, and SMTP recipient checks for a single address. The server determines
          the mail host itself — you cannot pass a host or port.
        </p>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Request</p>
        <pre className={CODE_BLOCK_CLASS}>
{`POST /api/verify-email
Content-Type: application/json

{
  "email": "john@gmail.com",
  "recheck": false
}`}
        </pre>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Response</p>
        <pre className={CODE_BLOCK_CLASS}>
{`{
  "success": true,
  "email": "john@gmail.com",
  "status": "deliverable",
  "fromCache": false,
  "checks": {
    "format": { "status": "pass" },
    "domain": { "status": "pass" },
    "mx": { "status": "found" },
    "smtp": {
      "status": "success",
      "recipientStatus": "accepted",
      "code": 250,
      "message": "2.1.5 OK",
      "mxHost": "gmail-smtp-in.l.google.com",
      "catchAllSuspected": false
    }
  },
  "checkedAt": "2026-09-03T12:00:00.000Z"
}`}
        </pre>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Error response</p>
        <pre className={CODE_BLOCK_CLASS}>
{`{
  "success": false,
  "status": "unknown",
  "error": {
    "code": "SMTP_CONNECTION_FAILED",
    "message": "The mail server could not be verified."
  }
}`}
        </pre>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-slate-900">Rate limits</h2>
        <p className="mt-1 text-sm text-slate-500">
          20 requests per minute per IP by default (configurable via <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">RATE_LIMIT_PER_MINUTE</code>).
          Exceeding it returns HTTP 429 with error code <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">RATE_LIMITED</code>.
        </p>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-slate-900">Caching</h2>
        <p className="mt-1 text-sm text-slate-500">
          Repeat checks of the same address within 24 hours return the cached result instantly
          instead of re-running SMTP verification. Set <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">&quot;recheck&quot;: true</code> to force a fresh check.
        </p>
      </Card>
    </div>
  );
}
