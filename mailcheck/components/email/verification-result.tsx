import { CheckCircle2, XCircle, AlertTriangle, RotateCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { VerificationChecks } from "./verification-checks";
import type { ApiVerifyResponse } from "@/lib/email/types";

const SUMMARY: Record<
  ApiVerifyResponse["status"],
  { icon: typeof CheckCircle2; iconClass: string; bgClass: string; title: string; description: string }
> = {
  deliverable: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    title: "DELIVERABLE",
    description: "The receiving mail server accepted the recipient during SMTP verification.",
  },
  undeliverable: {
    icon: XCircle,
    iconClass: "text-red-600",
    bgClass: "bg-red-50",
    title: "UNDELIVERABLE",
    description: "The receiving mail server rejected the recipient, or the domain/address does not exist.",
  },
  unknown: {
    icon: AlertTriangle,
    iconClass: "text-amber-600",
    bgClass: "bg-amber-50",
    title: "UNKNOWN",
    description: "The mail server could not provide a definitive response.",
  },
};

export function VerificationResult({
  result,
  onRecheck,
  isRechecking,
}: {
  result: ApiVerifyResponse;
  onRecheck?: () => void;
  isRechecking?: boolean;
}) {
  const summary = SUMMARY[result.status];
  const Icon = summary.icon;
  const checkedAtLabel = new Date(result.checkedAt).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card>
      <div className={`-m-6 mb-6 rounded-t-2xl ${summary.bgClass} p-6`}>
        <div className="flex items-center gap-3">
          <Icon className={`h-8 w-8 ${summary.iconClass}`} aria-hidden="true" />
          <div>
            <p className={`text-xl font-bold tracking-wide ${summary.iconClass}`}>{summary.title}</p>
            <p className="font-mono text-sm text-slate-700">{result.email}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">{summary.description}</p>
      </div>

      <VerificationChecks result={result} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Checked: {checkedAtLabel}
          {result.fromCache && " · cached result"}
        </p>
        {onRecheck && (
          <button
            type="button"
            onClick={onRecheck}
            disabled={isRechecking}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRechecking ? "animate-spin" : ""}`} aria-hidden="true" />
            Re-check
          </button>
        )}
      </div>
    </Card>
  );
}
