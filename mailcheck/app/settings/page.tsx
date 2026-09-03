import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Demo workspace settings.</p>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-slate-900">Verification behavior</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between border-b border-slate-100 py-2">
            <dt className="text-slate-500">SMTP timeout</dt>
            <dd className="font-mono text-slate-700">{process.env.SMTP_TIMEOUT_MS ?? "10000"} ms</dd>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2">
            <dt className="text-slate-500">Result cache window</dt>
            <dd className="font-mono text-slate-700">{process.env.VERIFICATION_CACHE_HOURS ?? "24"} hours</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-slate-500">Rate limit</dt>
            <dd className="font-mono text-slate-700">{process.env.RATE_LIMIT_PER_MINUTE ?? "20"} req/min/IP</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-slate-400">
          These are configured via environment variables — see .env.example in the project root.
        </p>
      </Card>
    </div>
  );
}
