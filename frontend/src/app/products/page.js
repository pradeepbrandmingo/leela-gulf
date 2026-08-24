"use client";

import ProductsHero from "@/components/products/ProductsHero";
import IndustryExpertiseSlider from "@/components/products/IndustryExpertiseSlider";
import ProductsListing from "@/components/products/ProductsListing";
import WhyChooseUsSection from "@/components/products/WhyChooseUsSection";
import KeyProductBenefits from "@/components/products/KeyProductBenefits";
import ProductCatalogueBar from "@/components/common/ProductCatalogueBar";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white overflow-hidden relative">

      {/* Products Page Hero Banner */}
      <ProductsHero />

      {/* Product Listing: Search, Filter, Grid & Pagination */}
      <ProductsListing />

      {/* Why Choose Us Feature Section */}
      <WhyChooseUsSection />

      {/* Key Product Benefits Section */}
      <KeyProductBenefits />

      {/* Browse By Industry Expertise Slider */}
      <IndustryExpertiseSlider />

      {/* Product Catalogue Download & WhatsApp Help Bar */}
      <ProductCatalogueBar />

    </main>
  );
}
