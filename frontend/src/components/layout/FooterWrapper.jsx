"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Hide Footer strictly ONLY on the Home Page ("/")
  if (pathname === "/") {
    return null;
  }

  return <Footer />;
}
