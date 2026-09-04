import { LanguageProvider } from "@/context/LanguageContext";
import AppShell from "@/components/layout/AppShell";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import { Suspense } from "react";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata = {
  title: "Leela Gulf FZC | Global Chemical Sourcing & Supply Chain Partner",
  description: "Global chemical distribution, logistics, and supply-chain partner headquartered in UAE.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${raleway.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-[#1a1a1a] text-white">
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}

