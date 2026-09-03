"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { VerificationResult } from "@/components/email/verification-result";
import type { ApiVerifyResponse } from "@/lib/email/types";

interface Row {
  id: string;
  email: string;
  status: string;
  formatStatus: string;
  domainStatus: string;
  mxStatus: string;
  smtpStatus: string;
  smtpRecipientStatus: string | null;
  smtpCode: number | null;
  smtpMessage: string | null;
  mxHost: string | null;
  catchAllSuspected: boolean;
  checkedAt: string;
  fromCache?: boolean;
}

function rowToApiResponse(row: Row): ApiVerifyResponse {
  return {
    success: true,
    email: row.email,
    status: row.status as ApiVerifyResponse["status"],
    fromCache: false,
    checks: {
      format: { status: row.formatStatus as ApiVerifyResponse["checks"]["format"]["status"] },
      domain: { status: row.domainStatus as ApiVerifyResponse["checks"]["domain"]["status"] },
      mx: { status: row.mxStatus as ApiVerifyResponse["checks"]["mx"]["status"] },
      smtp: {
        status: row.smtpStatus as ApiVerifyResponse["checks"]["smtp"]["status"],
        recipientStatus: row.smtpRecipientStatus as ApiVerifyResponse["checks"]["smtp"]["recipientStatus"],
        code: row.smtpCode ?? undefined,
        message: row.smtpMessage ?? undefined,
        mxHost: row.mxHost ?? undefined,
        catchAllSuspected: row.catchAllSuspected,
      },
    },
    checkedAt: row.checkedAt,
  };
}

export function VerificationDetailDrawer({ row, onClose }: { row: Row | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (row) closeButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [row, onClose]);

  if (!row) return null;

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-slate-900/30" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Verification details for ${row.email}`}
        className="h-full w-full max-w-lg overflow-y-auto bg-[#fafafc] p-4 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Verification detail</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close detail panel"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <VerificationResult result={rowToApiResponse(row)} />
      </div>
    </div>
  );
}
