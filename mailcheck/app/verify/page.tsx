import { EmailVerifier } from "@/components/email/email-verifier";

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Verify Email</h1>
        <p className="mt-1 text-sm text-slate-500">
          Runs live format, DNS/MX, and SMTP recipient checks. No email is ever sent.
        </p>
      </div>
      <EmailVerifier />
    </div>
  );
}
