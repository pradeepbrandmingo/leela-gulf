"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MailCheck,
  History,
  Code2,
  Settings,
  Menu,
  X,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/verify", label: "Verify Email", icon: MailCheck },
  { href: "/history", label: "Verification History", icon: History },
  { href: "/api-docs", label: "API", icon: Code2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen md:flex">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            M
          </span>
          MailCheck
        </Link>
        <button
          type="button"
          aria-label={drawerOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setDrawerOpen((v) => !v)}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
        >
          {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar (drawer on mobile, static on desktop) */}
      <aside
        className={cn(
          "z-20 w-64 shrink-0 border-r border-slate-200 bg-white",
          "md:sticky md:top-0 md:block md:h-screen",
          drawerOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex h-full flex-col justify-between p-4" aria-label="Primary">
          <div>
            <Link
              href="/dashboard"
              className="mb-6 hidden items-center gap-2 px-2 text-lg font-semibold text-slate-900 md:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
                M
              </span>
              MailCheck
            </Link>

            <ul className="space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname?.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-1 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600">
              <UserCircle2 className="h-8 w-8 text-slate-400" aria-hidden="true" />
              <div>
                <p className="font-medium text-slate-900">Demo User</p>
                <p className="text-xs text-slate-500">demo@mailcheck.test</p>
              </div>
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
