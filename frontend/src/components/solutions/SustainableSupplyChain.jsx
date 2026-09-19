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
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
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
              RIGHT COLUMN: Centered High-Res Image with Vertically Centered Card
              ═══════════════════════════════════════════ */}
          <div
            className={`lg:col-span-6 relative transition-all duration-[1200ms] delay-200 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : isRTL
                  ? "opacity-0 -translate-x-12"
                  : "opacity-0 translate-x-12"
            }`}
          >
            {/* Aspect container with centered image - Compact Height */}
            <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none rounded-2xl sm:rounded-3xl lg:rounded-[30px] overflow-hidden border border-white/10 shadow-2xl bg-[var(--color-card-dark)] group min-h-[370px] sm:min-h-[410px] md:min-h-[430px]">
              
              {/* Main Image with object-center */}
              <Image
                src="/images/Sustainability And Compliance/solutions.avif"
                alt="Sustainable Supply Chain - Leela Gulf FZC"
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 620px"
                priority
              />

              {/* Gentle gradient vignette to accentuate the white card & image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

              {/* ═══════════════════════════════════════════
                  COMPACT FLOATING WHITE CARD (Vertically Centered & Right Aligned)
                  ═══════════════════════════════════════════ */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 right-3 left-3 sm:left-auto sm:right-4 md:right-6 lg:right-7 sm:w-[280px] md:w-[300px] lg:w-[310px] bg-white text-gray-900 rounded-2xl sm:rounded-[22px] shadow-2xl p-3.5 sm:p-4 md:p-4.5 border border-gray-100/90 transition-all duration-[1000ms] delay-[600ms] ease-out ${
                  isRTL
                    ? "sm:right-auto sm:left-4 md:left-6 lg:left-7 text-right"
                    : "text-left"
                } ${
                  isVisible
                    ? "opacity-100 translate-y-[-50%] scale-100"
                    : "opacity-0 translate-y-[-40%] scale-95"
                }`}
              >
                <div className="flex flex-col divide-y divide-gray-100/90">
                  {features.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 py-2 sm:py-2.5 first:pt-0 last:pb-0 group/item transition-all duration-300"
                      >
                        {/* Soft Circle Icon Badge — Font Awesome CSS Icon Font (No SVG) */}
                        <div className="flex-shrink-0 w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center transition-all duration-300 group-hover/item:bg-[var(--color-primary)] group-hover/item:text-gold-light group-hover/item:scale-105 shadow-xs">
                          <i className={`${item.iconClass} text-[13px] sm:text-[14px]`} />
                        </div>

                        {/* Feature Text */}
                        <p className="font-heading font-medium text-[11px] sm:text-[12px] md:text-[12.5px] text-slate-800 leading-tight group-hover/item:text-black transition-colors">
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
    </section>
  );
}
