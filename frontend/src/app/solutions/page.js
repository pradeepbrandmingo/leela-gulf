"use client";

import SustainabilityHero from "@/components/solutions/SustainabilityHero";
import SustainableSupplyChain from "@/components/solutions/SustainableSupplyChain";
import ComplianceServices from "@/components/solutions/ComplianceServices";
import OurImpact from "@/components/solutions/OurImpact";
import ConsultancyOverview from "@/components/solutions/ConsultancyOverview";

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white">
      {/* ── 1. SUSTAINABILITY & COMPLIANCE HERO BANNER ── */}
      <SustainabilityHero />

      {/* ── 2. SUSTAINABLE SUPPLY CHAIN SECTION ── */}
      <SustainableSupplyChain />

      {/* ── 3. THREE COMPLIANCE PILLARS (LEGAL ADVICE, LEGAL DOCUMENTATION, MONITORING) ── */}
      <ComplianceServices />

      {/* ── 4. OUR IMPACT STATS SHOWCASE ── */}
      <OurImpact />

      {/* ── 5. CONSULTANCY OVERVIEW (SEDEX-STYLE UI WITH 6 CLEARANCE CARDS & POPUP MODAL) ── */}
      <ConsultancyOverview />
    </main>
  );
}
