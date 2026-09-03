"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { VerificationResult } from "./verification-result";
import type { ApiVerifyResponse, PublicApiError } from "@/lib/email/types";

type Phase = "idle" | "format" | "domain" | "mx" | "smtp" | "done" | "error";

const PROGRESS_STEPS: { phase: Phase; label: string }[] = [
  { phase: "format", label: "Checking format" },
  { phase: "domain", label: "Checking domain" },
  { phase: "mx", label: "Checking mail server" },
  { phase: "smtp", label: "Finalizing" },
];

export function EmailVerifier() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<ApiVerifyResponse | null>(null);
  const [error, setError] = useState<PublicApiError | null>(null);
  const [isRechecking, setIsRechecking] = useState(false);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
  }, []);

  function startFakeProgress() {
    // The API does a single round trip, but we still want the person to see
    // *which* stage is roughly happening, not just an inert spinner. This
    // steps through the same stage labels the engine actually runs in,
    // purely as a UI affordance — it never claims false precision.
    let i = 0;
    setPhase("format");
    progressTimer.current = setInterval(() => {
      i += 1;
      if (i < PROGRESS_STEPS.length) {
        setPhase(PROGRESS_STEPS[i]!.phase);
      } else if (progressTimer.current) {
        clearInterval(progressTimer.current);
      }
    }, 900);
  }

  function stopFakeProgress() {
    if (progressTimer.current) clearInterval(progressTimer.current);
  }

  async function verify(recheck: boolean) {
    setError(null);
    if (recheck) setIsRechecking(true);
    else {
      setResult(null);
      startFakeProgress();
    }

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, recheck }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? { code: "INTERNAL_ERROR", message: "Unable to complete verification. Please try again." });
        setPhase("error");
        setResult(null);
      } else {
        setResult(json as ApiVerifyResponse);
        setPhase("done");
      }
    } catch {
      setError({ code: "INTERNAL_ERROR", message: "Unable to complete verification. Please try again." });
      setPhase("error");
    } finally {
      stopFakeProgress();
      setIsRechecking(false);
    }
  }

  const isChecking = phase !== "idle" && phase !== "done" && phase !== "error" && !isRechecking;

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Verify an email address</h2>
        <p className="mt-1 text-sm text-slate-500">
          Check email syntax, DNS/MX records and SMTP recipient acceptance.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim() && !isChecking) verify(false);
          }}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="email-input" className="sr-only">
            Email address
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isChecking || !email.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChecking && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {isChecking ? "Checking..." : "Verify Email"}
          </button>
        </form>

        {isChecking && (
          <ul className="mt-4 space-y-1.5" aria-live="polite" aria-label="Verification progress">
            {PROGRESS_STEPS.map((step) => {
              const stepIndex = PROGRESS_STEPS.findIndex((s) => s.phase === step.phase);
              const currentIndex = PROGRESS_STEPS.findIndex((s) => s.phase === phase);
              const state = stepIndex < currentIndex ? "done" : stepIndex === currentIndex ? "active" : "pending";
              return (
                <li key={step.phase} className="flex items-center gap-2 text-sm text-slate-500">
                  <span aria-hidden="true">{state === "done" ? "✓" : state === "active" ? "●" : "○"}</span>
                  {step.label}
                </li>
              );
            })}
          </ul>
        )}

        {!isChecking && phase === "idle" && (
          <p className="mt-4 text-sm text-slate-400">Enter an email address to check.</p>
        )}

        {error && (
          <div role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </div>
        )}

        <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-400">
          This check estimates email deliverability using DNS and SMTP signals. Some mail providers
          intentionally hide mailbox existence, so an &ldquo;Unknown&rdquo; result does not necessarily mean the
          address is invalid.
        </p>
      </Card>

      {result && <VerificationResult result={result} onRecheck={() => verify(true)} isRechecking={isRechecking} />}
    </div>
  );
}
