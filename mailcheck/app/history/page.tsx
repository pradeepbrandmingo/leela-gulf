import { VerificationHistoryTable } from "@/components/dashboard/verification-history";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Verification History</h1>
        <p className="mt-1 text-sm text-slate-500">Every check performed, searchable and filterable.</p>
      </div>
      <VerificationHistoryTable />
    </div>
  );
}
