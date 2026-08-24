"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  FlaskConical,
  FileText,
  ArrowRight,
} from "lucide-react";

/**
 * ProductDetailHero - Production-Ready Product Details Hero Banner Component.
 * Clean, modern single product image display without carousel thumbnails or overlay badges.
 */
export default function ProductDetailHero({
  product,
  onQuoteRequest,
}) {
  const { isRTL } = useLanguage();

  // Dynamic product payload from page
  const p = product || {};

  // Image Fallback Handler
  const [imageError, setImageError] = useState(false);
  const defaultFallbackImg = "/images/prodcut/dummy-product.jpg";
  const primaryImage = p.images && p.images.length > 0 ? p.images[0] : defaultFallbackImg;
  const displayImage = imageError ? defaultFallbackImg : primaryImage;

  return (
    <section className="w-full bg-[var(--color-primary)] relative">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pt-16 sm:pt-20 md:pt-22 pb-6 sm:pb-8">
        {/* ── 1. TOP BREADCRUMB NAVIGATION ── */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm font-subheading mb-3 sm:mb-4 text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-white transition-colors">
            {isRTL ? "الرئيسية" : "Home"}
          </Link>
          <span className="text-gray-600">/</span>
          <Link href="/products" className="hover:text-white transition-colors">
            {isRTL ? "المنتجات" : "Products"}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gold-main font-semibold truncate max-w-[280px] sm:max-w-none">
            {p.title}
          </span>
        </nav>

        {/* ── 2. MAIN WHITE ROUNDED CONTAINER CARD (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 md:p-7 lg:p-8 shadow-xl border border-gray-200/60 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
            {/* ═════════════════════════════════════════════════════════════════
                LEFT COLUMN: TECHNICAL DETAILS, SPECS & CTA
                ═════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {/* Category Pill Tag (With Flask Icon) */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6f2ea] border border-gold-main/35 w-fit mb-2">
                <FlaskConical className="w-3.5 h-3.5 text-gold-main" />
                <span
                  className="font-heading font-bold text-[10.5px] sm:text-xs text-[#8c5e1e] uppercase tracking-wider"
                  style={{ fontWeight: 700 }}
                >
                  {p.category}
                </span>
              </div>

              {/* Product Main Title */}
              <h1
                className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-3xl text-[#1a1a1a] tracking-tight leading-tight mb-2"
                style={{ fontWeight: 700 }}
              >
                {p.title}
              </h1>

              {/* Product Grade Pill Tag */}
              {p.gradeValue && (
                <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden w-fit mb-3 text-xs font-subheading shadow-xs">
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-500 font-medium border-r border-gray-200 text-[11px] sm:text-xs">
                    {p.gradeLabel || "Product Grade"}
                  </span>
                  <span className="px-2.5 py-1 text-gold-main font-bold font-heading text-[11px] sm:text-xs">
                    {p.gradeValue}
                  </span>
                </div>
              )}

              {/* Description Overview */}
              <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed mb-3.5 font-normal">
                {p.description}
              </p>

              {/* 4 Technical Specification Info Cards (Always 2x2 Grid) */}
              {p.specs && p.specs.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3.5">
                  {p.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-2.5 sm:p-3 border border-gray-200/80 shadow-xs hover:border-gold-main/50 transition-colors"
                    >
                      <span className="font-heading font-semibold text-[9.5px] sm:text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                        {spec.label}
                      </span>
                      <span
                        className="font-heading font-bold text-xs sm:text-xs md:text-sm text-[#1a1a1a] block truncate"
                        style={{ fontWeight: 700 }}
                      >
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Industry Applications Pill Badges */}
              {p.applications && p.applications.length > 0 && (
                <div className="mb-3.5">
                  <span
                    className="font-heading font-bold text-[10px] tracking-widest text-gray-400 uppercase block mb-1.5"
                    style={{ fontWeight: 700 }}
                  >
                    {isRTL ? "تطبيقات الصناعة" : "INDUSTRY APPLICATIONS"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.applications.map((app, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[11px] sm:text-xs font-heading font-semibold text-[#222222] hover:border-gold-main hover:text-gold-main transition-all cursor-default shadow-xs"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Bulk Quote CTA Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onQuoteRequest}
                  className="btn-gold-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-black" />
                  <span>
                    {isRTL ? "طلب عرض سعر" : "Request Quote"}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 text-black ${isRTL ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* ═════════════════════════════════════════════════════════════════
                RIGHT COLUMN: CLEAN SINGLE PRODUCT IMAGE SHOWCASE
                ═════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] lg:aspect-square max-h-[340px] sm:max-h-[380px] lg:max-h-[400px] rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-gray-200/80 group">
                <Image
                  src={displayImage}
                  alt={p.title || "Product Showcase"}
                  fill
                  priority
                  unoptimized
                  onError={() => setImageError(true)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

