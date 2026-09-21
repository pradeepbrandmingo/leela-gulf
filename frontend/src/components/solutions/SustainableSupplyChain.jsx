"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

/**
 * SustainableSupplyChain - High-Impact Feature Section:
 * - 100% matches reference UI/UX screenshot layout & visual hierarchy.
 * - Left Column: Eyebrow, dual-tone heading with animated gold gradient, and narrative.
 * - Right Column: Large rounded image container with object-center positioning so plant & hands stay centered.
 * - Floating White Card: Vertically centered (top-to-bottom) on the right side of the image container.
 * - 4 Key Pillars using Font Awesome CSS Icon Font (NO SVG — rendered via <i> tags).
 * - 100% Global Theme Colors: var(--color-primary), var(--color-card-dark), text-gradient-gold-animated.
 * - Direction-aware (LTR / RTL for Arabic).
 */
export default function SustainableSupplyChain() {
  const { isRTL } = useLanguage();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = isRTL
    ? [
        {
          id: 1,
          iconClass: "fa-solid fa-leaf",
          text: "توريد أخلاقي من موردين معتمدين",
        },
        {
          id: 2,
          iconClass: "fa-solid fa-box-open",
          text: "تغليف وعمليات تنفيذ تراعي تقليل النفايات",
        },
        {
          id: 3,
          iconClass: "fa-solid fa-wind",
          text: "أقل نسبة انبعاثات CO₂ عبر لوجستيات محسنة",
        },
        {
          id: 4,
          iconClass: "fa-solid fa-award",
          text: "أكثر من 4 شهادات استدامة عبر قاعدة الموردين",
        },
      ]
    : [
        {
          id: 1,
          iconClass: "fa-solid fa-leaf",
          text: "Ethical sourcing from audited suppliers",
        },
        {
          id: 2,
          iconClass: "fa-solid fa-box-open",
          text: "Waste-conscious fulfillment and packaging",
        },
        {
          id: 3,
          iconClass: "fa-solid fa-wind",
          text: "Minimal CO₂ emissions through optimized logistics",
        },
        {
          id: 4,
          iconClass: "fa-solid fa-award",
          text: "4+ sustainability certification across supplier base",
        },
      ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--color-primary)] text-white py-10 sm:py-14 md:py-16 overflow-hidden"
    >
      {/* Ambient Glows for Visual Depth */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-gold-main/[0.04] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-gold-main/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* ═══════════════════════════════════════════
              LEFT COLUMN: Eyebrow, Heading & Narrative
              ═══════════════════════════════════════════ */}
          <div
            className={`lg:col-span-6 flex flex-col justify-center transition-all duration-[1200ms] ease-out ${
              isRTL ? "text-right" : "text-left"
            } ${
              isVisible
                ? "opacity-100 translate-x-0"
                : isRTL
                  ? "opacity-0 translate-x-12"
                  : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Eyebrow with gold accent dash */}
            <div className="flex flex-col items-start gap-2 mb-3 sm:mb-4">
              <span className="font-heading font-bold text-xs sm:text-[13px] tracking-[0.22em] text-gold-light uppercase">
                {isRTL ? "الاستدامة والمسؤولية" : "SUSTAINABILITY"}
              </span>
              <div className="w-10 sm:w-12 h-[2.5px] sm:h-[3px] bg-gradient-gold-animated rounded-full" />
            </div>

            {/* Main Section Heading */}
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] text-white leading-[1.16] sm:leading-[1.14] tracking-tight mb-4 sm:mb-6 drop-shadow-sm">
              {isRTL ? (
                <>
                  <span className="block">بناء سلسلة توريد</span>
                  <span className="block text-gradient-gold-animated">
                    أكثر استدامة
                  </span>
                </>
              ) : (
                <>
                  <span className="block">Building a More</span>
                  <span className="block text-gradient-gold-animated">
                    Sustainable Supply Chain
                  </span>
                </>
              )}
            </h2>

            {/* Narrative Paragraph */}
            <p className="font-subheading text-gray-300/90 text-sm sm:text-base md:text-[1.02rem] leading-relaxed max-w-xl">
              {isRTL
                ? "الاستدامة ليست مجرد قيمة نؤمن بها، بل هي طريقة عملنا. من تقليل النفايات والانبعاثات إلى التوريد المسؤول للمواد الخام، ندمج التفكير المراعي لكوكب الأرض في كل خطوة من عملياتنا."
                : "Sustainability is not just a value, it's how we operate. From minimizing waste and emissions to responsibly sourcing raw materials, we embed planet-first thinking into every step of our operations."}
            </p>
          </div>

          {/* ═══════════════════════════════════════════
              RIGHT COLUMN: High-Res Image with 3D Flip-In Animation & Luxury Accent Frame
              ═══════════════════════════════════════════ */}
          <div
            className={`lg:col-span-6 relative [perspective:1400px] transition-all duration-[1300ms] delay-150 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
              isVisible
                ? "opacity-100 [transform:perspective(1400px)_rotateY(0deg)_translateX(0)_scale(1)]"
                : isRTL
                  ? "opacity-0 [transform:perspective(1400px)_rotateY(-32deg)_translateX(-60px)_scale(0.92)] origin-left"
                  : "opacity-0 [transform:perspective(1400px)_rotateY(32deg)_translateX(60px)_scale(0.92)] origin-right"
            }`}
          >
            {/* Ambient Gold Atmospheric Glow */}
            <div className="absolute -inset-4 bg-gold-main/[0.08] rounded-full blur-3xl pointer-events-none" />

            {/* 1. Layered Offset Architectural Backing Panel */}
            <div
              className={`absolute inset-0 ${
                isRTL
                  ? "-translate-x-3 translate-y-3 sm:-translate-x-4 sm:translate-y-4"
                  : "translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4"
              } rounded-2xl sm:rounded-3xl border border-gold-main/30 bg-gradient-to-br from-[#181c2b]/90 via-[#10131f]/80 to-black/90 shadow-xl pointer-events-none -z-10 group-hover:border-gold-main/60 transition-all duration-500`}
            >
              {/* Subtle gold corner accents */}
              <div className="absolute top-3 left-3 w-8 h-[1.5px] bg-gradient-gold-animated opacity-70" />
              <div className="absolute bottom-3 right-3 w-8 h-[1.5px] bg-gradient-gold-animated opacity-70" />
            </div>

            {/* 2. Main Luxury Metallic Rim Container */}
            <div className="relative mx-auto w-full max-w-[580px] lg:max-w-none p-[1.5px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gold-light/60 via-white/20 to-gold-main/40 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(202,154,53,0.12)] group">
              
              {/* Inner Image Container */}
              <div className="relative w-full rounded-[14.5px] sm:rounded-[22.5px] overflow-hidden bg-[var(--color-card-dark)] min-h-[380px] sm:min-h-[410px] md:min-h-[430px]">
                
                {/* Main High-Res Image */}
                <Image
                  src="/images/Sustainability And Compliance/solutions.avif"
                  alt="Sustainable Supply Chain - Leela Gulf FZC"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 620px"
                  priority
                />

                {/* Smooth Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 pointer-events-none" />

                {/* Sleek Minimalist Luxury Glass Badge */}
                <div
                  className={`absolute top-3.5 sm:top-4.5 ${
                    isRTL ? "right-3.5 sm:right-4.5" : "left-3.5 sm:left-4.5"
                  } z-20 flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-gold-light/40 shadow-xl transition-all duration-300 group-hover:border-gold-light/70`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse shadow-[0_0_8px_rgba(202,154,53,0.9)]" />
                  <span className="font-heading font-semibold text-[10px] sm:text-[11px] text-gold-light tracking-wider uppercase">
                    {isRTL ? "سلسلة توريد مستدامة" : "Sustainable Supply"}
                  </span>
                </div>

                {/* ═══════════════════════════════════════════
                    FLOATING WHITE FEATURE CARD (Vertically Centered)
                    ═══════════════════════════════════════════ */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 right-3 left-3 sm:left-auto sm:right-4 md:right-6 lg:right-7 sm:w-[285px] md:w-[305px] lg:w-[315px] bg-white text-gray-900 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.35)] p-3.5 sm:p-4 md:p-4.5 border border-white transition-all duration-[1000ms] delay-[600ms] ease-out ${
                    isRTL
                      ? "sm:right-auto sm:left-4 md:left-6 lg:left-7 text-right"
                      : "text-left"
                  } ${
                    isVisible
                      ? "opacity-100 translate-y-[-50%] scale-100"
                      : "opacity-0 translate-y-[-40%] scale-95"
                  }`}
                >
                  <div className="flex flex-col divide-y divide-gray-100">
                    {features.map((item) => {
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 py-2 sm:py-2.5 first:pt-0 last:pb-0 group/item transition-all duration-300"
                        >
                          {/* Circular Icon Badge */}
                          <div className="flex-shrink-0 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-amber-50/80 text-[var(--color-primary)] flex items-center justify-center transition-all duration-300 group-hover/item:bg-[var(--color-primary)] group-hover/item:text-gold-light group-hover/item:scale-105 shadow-xs border border-amber-100/60">
                            <i className={`${item.iconClass} text-[13px] sm:text-[14px]`} />
                          </div>

                          {/* Feature Text */}
                          <p className="font-heading font-medium text-[11px] sm:text-[12px] md:text-[12.5px] text-gray-800 leading-tight group-hover/item:text-black transition-colors">
                            {item.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
