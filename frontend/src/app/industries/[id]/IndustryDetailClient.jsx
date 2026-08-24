"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import IndustryHero from "@/components/industries/IndustryHero";
import IndustryProductsListing, { MASTER_INDUSTRIES } from "@/components/industries/IndustryProductsListing";
import ProductCatalogueBar from "@/components/common/ProductCatalogueBar";

export default function IndustryDetailClient({ industryId }) {
  const { isRTL } = useLanguage();
  const [activeIndustryId, setActiveIndustryId] = useState(industryId || "industrial-chemicals");

  useEffect(() => {
    if (industryId) {
      setActiveIndustryId(industryId);
    }
  }, [industryId]);

  // Find active industry metadata for Hero Title
  const activeIndustryInfo = MASTER_INDUSTRIES.find((ind) => ind.id === activeIndustryId) || MASTER_INDUSTRIES[0];
  const heroDisplayTitle = isRTL ? activeIndustryInfo.nameAr : activeIndustryInfo.name;

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white relative">
      
      {/* ── 1. INDUSTRY HERO BANNER (Dynamically updates when dropdown selection changes) ── */}
      <IndustryHero
        industryTitle={heroDisplayTitle}
        industryBadge={isRTL ? "القطاعات الصناعية" : "INDUSTRIES"}
      />

      {/* ── 2. DYNAMIC INDUSTRY PRODUCTS LISTING (Sends selection back up to update Hero Title) ── */}
      <IndustryProductsListing
        selectedIndustry={activeIndustryId}
        onIndustrySelect={(newId) => setActiveIndustryId(newId)}
      />

      {/* ── 3. PRODUCT CATALOGUE DOWNLOAD BAR ── */}
      <ProductCatalogueBar />

    </main>
  );
}
