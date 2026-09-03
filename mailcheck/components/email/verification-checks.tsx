import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiVerifyResponse } from "@/lib/email/types";

function Row({
  label,
  ok,
  text,
}: {
  label: string;
  ok: "yes" | "no" | "unknown";
  text: string;
}) {
  const Icon = ok === "yes" ? Check : ok === "no" ? X : HelpCircle;
  const colorClass = ok === "yes" ? "text-emerald-600" : ok === "no" ? "text-red-600" : "text-amber-600";

  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={cn("flex items-center gap-1.5 text-sm font-medium", colorClass)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {text}
      </span>
    </div>
  );
}

export function VerificationChecks({ result }: { result: ApiVerifyResponse }) {
  const { checks } = result;

  const smtpConnLabel =
    checks.smtp.status === "success"
      ? "yes"
      : checks.smtp.status === "skipped"
        ? "unknown"
        : "no";

  const smtpConnText =
    checks.smtp.status === "success"
      ? "Successful"
      : checks.smtp.status === "timeout"
        ? "Timeout"
        : checks.smtp.status === "skipped"
          ? "Skipped"
          : "Failed";

  const recipientOk =
    checks.smtp.recipientStatus === "accepted" ? "yes" : checks.smtp.recipientStatus === "rejected" ? "no" : "unknown";
  const recipientText =
    checks.smtp.recipientStatus === "accepted"
      ? checks.smtp.catchAllSuspected
        ? "Accepted (catch-all suspected)"
        : "Accepted"
      : checks.smtp.recipientStatus === "rejected"
        ? "Rejected"
        : "Unknown";

  return (
    <div>
      <Row label="Email Format" ok={checks.format.status === "pass" ? "yes" : "no"} text={checks.format.status === "pass" ? "Valid" : "Invalid"} />
      <Row label="Domain" ok={checks.domain.status === "pass" ? "yes" : checks.domain.status === "fail" ? "no" : "unknown"} text={checks.domain.status === "pass" ? "Valid" : checks.domain.status === "fail" ? "Invalid" : "Unknown"} />
      <Row label="MX Records" ok={checks.mx.status === "found" ? "yes" : checks.mx.status === "not_found" ? "no" : "unknown"} text={checks.mx.status === "found" ? "Found" : checks.mx.status === "not_found" ? "Not found" : "Unknown"} />
      <Row label="SMTP Connection" ok={smtpConnLabel} text={smtpConnText} />
      <Row label="SMTP Recipient" ok={recipientOk} text={recipientText} />

      {(checks.smtp.code || checks.smtp.message || checks.smtp.mxHost) && (
        <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          {checks.smtp.code && (
            <div className="flex justify-between">
              <span className="text-slate-400">SMTP Response Code</span>
              <span className="font-mono">{checks.smtp.code}</span>
            </div>
          )}
          {checks.smtp.message && (
            <div className="flex justify-between gap-4">
              <span className="shrink-0 text-slate-400">SMTP Response</span>
              <span className="truncate font-mono" title={checks.smtp.message}>
                &ldquo;{checks.smtp.message}&rdquo;
              </span>
            </div>
          )}
          {checks.smtp.mxHost && (
            <div className="flex justify-between gap-4">
              <span className="shrink-0 text-slate-400">Mail Server</span>
              <span className="truncate font-mono" title={checks.smtp.mxHost}>
                {checks.smtp.mxHost}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
