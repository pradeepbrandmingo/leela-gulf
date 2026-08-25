"use client";

import KnowledgeCenterHero from "@/components/knowledge-center/KnowledgeCenterHero";
import LatestBlogsSection from "@/components/knowledge-center/LatestBlogsSection";

export default function KnowledgeCenterPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white">
      {/* ── 1. KNOWLEDGE CENTER HERO BANNER ── */}
      <KnowledgeCenterHero />

      {/* ── 2. LATEST BLOGS & KNOWLEDGE ARTICLES SECTION ── */}
      <LatestBlogsSection />
    </main>
  );
}
