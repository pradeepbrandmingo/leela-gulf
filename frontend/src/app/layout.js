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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://leela-gulf.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Leela Gulf FZC | Global Chemical Sourcing & Supply Chain Partner",
    template: "%s | Leela Gulf FZC",
  },
  description:
    "Global chemical distribution, logistics, and supply-chain partner headquartered in UAE.",
  keywords: [
    "chemical distribution",
    "Leela Gulf FZC",
    "UAE specialty chemicals",
    "global supply chain",
    "raw materials supplier",
  ],
  icons: {
    icon: [
      { url: "/logos/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/logos/logo.png",
    apple: "/logos/logo.png",
  },
  openGraph: {
    title: "Leela Gulf FZC | Global Chemical Sourcing & Supply Chain Partner",
    description:
      "Global chemical distribution, logistics, and supply-chain partner headquartered in UAE.",
    url: siteUrl,
    siteName: "Leela Gulf FZC",
    images: [
      {
        url: "/logos/logo.png",
        width: 1200,
        height: 630,
        alt: "Leela Gulf FZC Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leela Gulf FZC | Global Chemical Sourcing & Supply Chain Partner",
    description:
      "Global chemical distribution, logistics, and supply-chain partner headquartered in UAE.",
    images: ["/logos/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${raleway.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logos/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/logos/logo.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
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

