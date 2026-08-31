"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Loader2 } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { apiRequest } from "@/config/api";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authenticate Admin session on layout mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await apiRequest("/admin/me", { method: "GET" });
        if (data.success && data.admin) {
          setAdminUser(data.admin);
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          router.push("/admin-login");
        }
      } catch (err) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        router.push("/admin-login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-gold-main animate-spin mb-4" />
        <p className="font-heading text-sm text-gray-600">Verifying Admin Session...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 text-gray-900 flex flex-col lg:flex-row font-subheading overflow-hidden">
      {/* Fixed Sticky Sidebar Component (Left Side Viewport Anchored) */}
      <AdminSidebar
        adminUser={adminUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Right Content Panel (Independent Viewport Scrolling) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-700 hover:text-black p-1"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6 text-gray-800" />
          </button>
          <span className="font-heading font-bold text-sm text-gray-900 uppercase tracking-wider">
            Leela Gulf Admin
          </span>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
