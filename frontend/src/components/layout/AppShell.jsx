"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import FooterWrapper from "./FooterWrapper";
import FloatingSidebar from "../common/FloatingSidebar";

/**
 * AppShell - Client-side Layout Wrapper.
 * Hides public Header, FloatingSidebar, and Footer on Admin Portal pages (/admin-login, /admin/*).
 */
export default function AppShell({ children }) {
  const pathname = usePathname();

  // Check if route belongs to Admin Portal
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname === "/admin-login";

  if (isAdminRoute) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <>
      <Header />
      <FloatingSidebar />
      <div className="flex-grow">{children}</div>
      <FooterWrapper />
    </>
  );
}
