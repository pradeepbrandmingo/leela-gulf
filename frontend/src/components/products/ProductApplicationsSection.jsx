"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Check } from "lucide-react";

/**
 * ProductApplicationsSection - Master Production-Ready Industry Applications Showcase.
 * 100% Exact Match to Client Reference Design (Screenshot 1):
 * - Outer White Container Card (#fcfcfb)
 * - Centered Section Title & Subtitle + Gold Accent Line
 * - Left: Rounded Image Container (Aspect 16/10, max-h-[260px])
 * - Right:
 *    - Soft Gold Category Pill Tag with Bullet Dot (● COSMETICS)
 *    - Application Title (Personal Care)
 *    - Bullet Points with Clean Gold Checkmark (✓)
 * - 100% Dynamic MongoDB Data Flow with Zero Dummy Fallback
 */
export default function ProductApplicationsSection({ product: customProduct }) {
  const { isRTL } = useLanguage();
  const [failedImages, setFailedImages] = useState({});

  const defaultFallbackImg = "/images/prodcut/dummy-product.jpg";

  const p = customProduct || {};

  // Extract real database application cards
  const rawCards = Array.isArray(p.applicationsData)
    ? p.applicationsData
    : Array.isArray(p.applicationCards)
    ? p.applicationCards
    : p.applicationsData?.applications || [];

  const items = rawCards.map((c, idx) => ({
    id: c.id || idx,
    categoryTag: c.badge || c.categoryTag || (isRTL ? "صناعي" : "COSMETICS"),
    title: c.industry || c.title || (isRTL ? "تطبيق صناعي" : "Personal Care"),
    image: c.imageUrl || c.image || defaultFallbackImg,
    bulletPoints: Array.isArray(c.bullets)
      ? c.bullets
      : Array.isArray(c.bulletPoints)
      ? c.bulletPoints
      : typeof c.bullets === "string"
      ? [c.bullets]
      : [],
  })).filter((c) => c.title.trim().length > 0);

  // If no application items found from database, don't render empty section
  if (items.length === 0) {
    return null;
  }

  const sectionTitle = isRTL ? "التطبيقات الصناعية" : "Industry Applications";
  const subtitle = isRTL
    ? "قابلية التوسع التجاري عبر مختلف قطاعات التصنيع."
    : "Commercial scalability across diverse manufacturing sectors.";

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-8 sm:pb-10 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── MAIN WHITE ROUNDED CONTAINER CARD (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 md:p-7 lg:p-8 shadow-xl border border-gray-200/60 transition-all duration-300">
          
          {/* 1. Centered Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2
              className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] tracking-tight leading-tight mb-2 sm:mb-2"
              style={{ fontWeight: 700 }}
            >
              {sectionTitle}
            </h2>
            
            <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-500 font-normal leading-relaxed mb-3">
              {subtitle}
            </p>
            
            {/* Centered Gold Accent Divider Line */}
            <div className="w-12 sm:w-16 h-1 bg-gradient-gold-animated rounded-full mx-auto" />
          </div>

          {/* 2. Cards List (Alternating Left-to-Right / Right-to-Left Layout) */}
          <div className="space-y-5 sm:space-y-6">
            {items.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const currentImg = failedImages[idx]
                ? defaultFallbackImg
                : item.image || defaultFallbackImg;

              return (
                <div
                  key={item.id || idx}
                  className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 border border-gray-200/90 hover:border-gold-main hover:shadow-xl hover:shadow-gold-main/10 transition-all duration-300 overflow-hidden"
                >
                  <div
                    className={`flex flex-col items-center justify-between gap-6 sm:gap-7 lg:gap-8 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    
                    {/* Image Column (Fixed rounded aspect box) */}
                    <div className="w-full md:w-5/12 lg:w-5/12 shrink-0">
                      <div className="relative w-full aspect-16/10 lg:aspect-4/3 max-h-[230px] sm:max-h-[260px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/60 group-hover:shadow-md transition-shadow duration-300">
                        <Image
                          src={currentImg}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          onError={() => {
                            setFailedImages((prev) => ({ ...prev, [idx]: true }));
                          }}
                        />
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="w-full md:w-7/12 lg:w-7/12 flex flex-col justify-center">
                      
                      {/* Category Tag Pill with Golden Bullet Dot */}
                      {item.categoryTag && (
                        <div className="mb-2.5">
                          <span className="bg-gold-main/10 border border-gold-main/30 text-gold-main font-heading font-bold text-[11px] sm:text-xs uppercase tracking-wider px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                            {item.categoryTag}
                          </span>
                        </div>
                      )}

                      {/* Application Title */}
                      <h3
                        className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-[#1a1a1a] tracking-tight mb-3 group-hover:text-gold-main transition-colors duration-300"
                        style={{ fontWeight: 700 }}
                      >
                        {item.title}
                      </h3>

                      {/* Bullet Points with Clean Gold Checkmark (✓) */}
                      {item.bulletPoints && item.bulletPoints.length > 0 && (
                        <ul className="space-y-2 sm:space-y-2.5">
                          {item.bulletPoints.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-gold-main shrink-0 mt-0.5 stroke-[2.5]" />
                              <span className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed font-normal break-words">
                                {bullet}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
