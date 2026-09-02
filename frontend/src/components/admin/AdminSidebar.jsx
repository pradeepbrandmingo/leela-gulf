"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Package,
  FileEdit,
  Users,
  Eye,
  Tag,
  Image as ImageIcon,
  Briefcase,
  LogOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { apiRequest } from "@/config/api";

const sidebarMenuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutGrid,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FileEdit,
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: Users,
  },
  {
    name: "Visitors",
    href: "/admin/visitors",
    icon: Eye,
  },
  {
    name: "Events / Gallery",
    href: "/admin/events-gallery",
    icon: ImageIcon,
  },
  {
    name: "Careers",
    href: "/admin/careers",
    icon: Briefcase,
  },
];

export default function AdminSidebar({ adminUser, isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Collapsible Sidebar State (Desktop)

  const handleLogout = async () => {
    try {
      await apiRequest("/admin/logout", { method: "POST" });
    } catch (e) {
      console.log("Logout processed");
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      router.push("/admin-login");
    }
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white text-gray-900 border-r border-gray-200/90 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
    >
      {/* ── TOP: LOGO & TOGGLE COLLAPSE BUTTON ── */}
      <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
        <div
          className={`py-5 border-b border-gray-100 flex items-center shrink-0 transition-all duration-300 ${
            isCollapsed ? "px-3 justify-center" : "px-6 justify-between"
          }`}
        >
          {/* Logo (Expanded vs Collapsed) */}
          <Link href="/admin/dashboard" className="block">
            {isCollapsed ? (
              <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-gold-main/40 flex items-center justify-center text-gold-main font-heading font-extrabold text-lg shadow-sm">
                L
              </div>
            ) : (
              <Image
                src="/logos/logowhite.png"
                alt="Leela Gulf FZC"
                width={200}
                height={60}
                className="h-11 sm:h-12 w-auto object-contain mix-blend-multiply contrast-105"
                priority
              />
            )}
          </Link>

          {/* Desktop Toggle Collapse Arrow (< or >) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer ml-1"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Mobile close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-gray-900 p-1"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          )}
        </div>

        {/* Menu Items List */}
        <nav className={`py-3 space-y-1.5 flex-1 overflow-y-auto ${isCollapsed ? "px-2" : "px-3"}`}>
          {sidebarMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center rounded-xl font-heading text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3.5 py-2.5"
                } ${
                  isActive
                    ? "bg-[#fdfaf0] text-gold-dark border border-gold-main/40 shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-gold-dark" : "text-gray-400 group-hover:text-gray-700"
                  }`}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── BOTTOM: ADMIN PROFILE & LOGOUT POPUP BLOCK ── */}
      <div className={`p-3 border-t border-gray-100 relative shrink-0 ${isCollapsed ? "px-2 text-center" : "px-4"}`}>
        {/* Sign Out Popover Menu */}
        {showProfileMenu && (
          <div className="absolute bottom-full left-2 right-2 mb-2.5 bg-white border border-gray-200 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 text-xs font-heading font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-600 shrink-0" />
              {!isCollapsed && <span>Sign Out Admin</span>}
            </button>
          </div>
        )}

        {/* Admin Info Card */}
        <div
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className={`flex items-center rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-gold-main/40 cursor-pointer transition-all select-none shadow-xs ${
            isCollapsed ? "justify-center p-2.5" : "justify-between p-3"
          }`}
          title={isCollapsed ? adminUser?.name || "Admin" : undefined}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Avatar Circle */}
            <div className="w-9 h-9 rounded-xl bg-[#0a0a0a] border border-gold-main/40 flex items-center justify-center text-gold-main font-heading font-bold text-sm shrink-0 shadow-sm">
              A
            </div>
            {/* Admin Name & Email (Hidden when Collapsed) */}
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-heading font-bold text-xs text-gray-900 truncate">
                  {adminUser?.name || "Admin"}
                </span>
                <span className="font-subheading text-[11px] text-gray-500 truncate">
                  {adminUser?.email || "admin@leelagulf.com"}
                </span>
              </div>
            )}
          </div>

          {/* Toggle Chevron Arrow (Hidden when Collapsed) */}
          {!isCollapsed && (
            showProfileMenu ? (
              <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
            )
          )}
        </div>
      </div>
    </aside>
  );
}
