"use client";

import CareersHero from "@/components/careers/CareersHero";
import OpenPositionsSection from "@/components/careers/OpenPositionsSection";
import WhyJoinLeelaGulf from "@/components/careers/WhyJoinLeelaGulf";

export default function CareersPage() {
  const handleScrollToRoles = () => {
    const rolesElement = document.getElementById("open-roles-section");
    if (rolesElement) {
      rolesElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white">
      {/* ── 1. CAREERS HERO BANNER ── */}
      <CareersHero onScrollToRoles={handleScrollToRoles} />

      {/* ── 2. OPEN POSITIONS & WHY LEELA GULF SECTION ── */}
      <OpenPositionsSection />

      {/* ── 3. WHY JOIN LEELA GULF / CORE VALUES SECTION (Below Open Positions) ── */}
      <WhyJoinLeelaGulf />
    </main>
  );
}
