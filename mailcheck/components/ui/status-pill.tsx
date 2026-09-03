import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/lib/email/types";

const CONFIG: Record<VerificationStatus, { label: string; icon: typeof CheckCircle2; classes: string }> = {
  deliverable: {
    label: "Deliverable",
    icon: CheckCircle2,
    classes: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  },
  undeliverable: {
    label: "Undeliverable",
    icon: XCircle,
    classes: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  },
  unknown: {
    label: "Unknown",
    icon: AlertTriangle,
    classes: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  },
};

export function StatusPill({ status, size = "md" }: { status: VerificationStatus; size?: "sm" | "md" | "lg" }) {
  const { label, icon: Icon, classes } = CONFIG[status];
  const sizeClasses =
    size === "lg" ? "px-4 py-2 text-base gap-2" : size === "sm" ? "px-2 py-0.5 text-xs gap-1" : "px-3 py-1 text-sm gap-1.5";

  return (
    <span className={cn("inline-flex items-center rounded-full font-medium", sizeClasses, classes)}>
      <Icon className={size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5"} aria-hidden="true" />
      {label}
    </span>
  );
}
