"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { VerificationDetailDrawer } from "./verification-detail-drawer";
import type { VerificationStatus } from "@/lib/email/types";

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
  isDemoData: boolean;
  checkedAt: string;
}

const PAGE_SIZE = 10;
const STATUS_OPTIONS: { value: VerificationStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "deliverable", label: "Deliverable" },
  { value: "undeliverable", label: "Undeliverable" },
  { value: "unknown", label: "Unknown" },
];

export function VerificationHistoryTable() {
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<VerificationStatus | "">("");
  const [dateFilter, setDateFilter] = useState<"" | "today" | "7d" | "30d">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Row | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    if (dateFilter) {
      const days = dateFilter === "today" ? 1 : dateFilter === "7d" ? 7 : 30;
      params.set("from", new Date(Date.now() - days * 86_400_000).toISOString());
    }
    params.set("page", String(page));
    params.set("pageSize", String(PAGE_SIZE));

    try {
      const res = await fetch(`/api/verifications?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setRows(json.data);
        setTotalPages(json.pagination.totalPages || 1);
      }
    } finally {
      setLoading(false);
    }
  }, [search, status, dateFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [search, status, dateFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Card className="p-0">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none"
            aria-label="Search verification history by email"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as VerificationStatus | "")}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
            aria-label="Filter by date"
          >
            <option value="">All time</option>
            <option value="today">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Domain</th>
              <th className="px-4 py-3 font-medium">MX</th>
              <th className="px-4 py-3 font-medium">SMTP</th>
              <th className="px-4 py-3 font-medium">Checked At</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  No verifications match these filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelected(row)}
                  className="cursor-pointer border-b border-slate-50 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-mono text-slate-700">
                    {row.email}
                    {row.isDemoData && (
                      <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-sans uppercase text-slate-400">
                        demo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={row.status as VerificationStatus} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.email.split("@")[1]}</td>
                  <td className="px-4 py-3 text-slate-500">{row.mxStatus === "found" ? "✓" : row.mxStatus === "not_found" ? "✕" : "?"}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {row.smtpStatus === "success" ? "✓" : row.smtpStatus === "skipped" ? "—" : "?"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {new Date(row.checkedAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(row);
                      }}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Prev
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <VerificationDetailDrawer row={selected} onClose={() => setSelected(null)} />
    </Card>
  );
}
