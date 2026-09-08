"use client";

import FoodColorsHero from "@/components/food-colors-additives/FoodColorsHero";
import FoodColorsOverviewSection from "@/components/food-colors-additives/FoodColorsOverviewSection";
import FoodColorsTableSection from "@/components/food-colors-additives/FoodColorsTableSection";
import FoodAdditivesSection from "@/components/food-colors-additives/FoodAdditivesSection";

export default function FoodColorsAndAdditivesPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white">
      {/* ── 1. HERO SECTION ── */}
      <FoodColorsHero />

      {/* ── 2. THE ART & SCIENCE OF FOOD COLORS OVERVIEW SECTION ── */}
      <FoodColorsOverviewSection />

      {/* ── 3. FOOD COLORS (SUPRA, LAKE, BLENDED) TABLE SECTION ── */}
      <FoodColorsTableSection />

      {/* ── 4. FOOD ADDITIVES & EXCIPIENTS 3-COLUMN GRID SECTION ── */}
      <FoodAdditivesSection />
    </main>
  );
}
