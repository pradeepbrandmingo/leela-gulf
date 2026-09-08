"use client";

import LeepolHero from "@/components/the-world-of-leepol/LeepolHero";
import LeepolProductsShowcase from "@/components/the-world-of-leepol/LeepolProductsShowcase";
import WhyChooseLeepol from "@/components/the-world-of-leepol/WhyChooseLeepol";

export default function TheWorldOfLeepolPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white">
      {/* ── 1. HERO SECTION ── */}
      <LeepolHero />

      {/* ── 2. FLAGSHIP LINES TABBED SHOWCASE & SCROLLABLE TABLE SECTION ── */}
      <LeepolProductsShowcase />

      {/* ── 3. WHY CHOOSE LEEPOL (THE LEEPOL ADVANTAGE) ── */}
      <WhyChooseLeepol />
    </main>
  );
}
