import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import type { VerificationStatus } from "@/lib/email/types";

export const dynamic = "force-dynamic";

async function getStats() {
  const [total, deliverable, undeliverable, unknown] = await Promise.all([
    prisma.verification.count(),
    prisma.verification.count({ where: { status: "deliverable" } }),
    prisma.verification.count({ where: { status: "undeliverable" } }),
    prisma.verification.count({ where: { status: "unknown" } }),
  ]);
  return { total, deliverable, undeliverable, unknown };
}

async function getRecent() {
  return prisma.verification.findMany({ orderBy: { checkedAt: "desc" }, take: 5 });
}

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([getStats(), getRecent()]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Email Verification</h1>
          <p className="mt-1 text-sm text-slate-500">
            Check whether an email address appears technically deliverable without sending an email.
          </p>
        </div>
        <Link
          href="/verify"
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Verify Email
        </Link>
      </div>

      <StatsCards {...stats} />

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Recent verifications</h2>
          <Link href="/history" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No verifications yet — run your first check.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recent.map((row: Awaited<ReturnType<typeof getRecent>>[number]) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-3">
                <span className="truncate font-mono text-sm text-slate-700">{row.email}</span>
                <StatusPill status={row.status as VerificationStatus} size="sm" />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
