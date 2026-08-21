"use client";

import ProductsHero from "@/components/products/ProductsHero";
import IndustryExpertiseSlider from "@/components/products/IndustryExpertiseSlider";
import ProductsListing from "@/components/products/ProductsListing";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white overflow-hidden relative">

      {/* Products Page Hero Banner */}
      <ProductsHero />

      {/* Product Listing: Search, Filter, Grid & Pagination */}
      <ProductsListing />

      {/* Browse By Industry Expertise Slider */}
      <IndustryExpertiseSlider />

    </main>
  );
}
