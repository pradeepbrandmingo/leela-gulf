"use client";

import ApiHero from "@/components/active-pharmaceutical-ingredients/ApiHero";
import ApiTableSection from "@/components/active-pharmaceutical-ingredients/ApiTableSection";
import ExcipientsTableSection from "@/components/active-pharmaceutical-ingredients/ExcipientsTableSection";
import GlobalPresenceSection from "@/components/active-pharmaceutical-ingredients/GlobalPresenceSection";

export default function ActivePharmaceuticalIngredientsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white">
      {/* ── 1. HERO SECTION ── */}
      <ApiHero />

      {/* ── 2. ACTIVE PHARMACEUTICAL INGREDIENTS TABLE & QUOTE SECTION ── */}
      <ApiTableSection />

      {/* ── 3. PHARMACEUTICAL EXCIPIENTS TABLE & QUOTE SECTION ── */}
      <ExcipientsTableSection />

      {/* ── 4. OUR PRESENCE ACROSS THE GLOBE & CERTIFICATIONS SECTION ── */}
      <GlobalPresenceSection />
    </main>
  );
}
