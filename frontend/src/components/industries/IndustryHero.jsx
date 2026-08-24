"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

/**
 * IndustryHero - Standardized Banner Hero Component for Industry Pages.
 * 100% Matches ProductsHero.jsx 1-to-1 in design, structure, and aesthetics:
 * - Full-width rounded banner image with running gold gradient border frame (p-[3px] sm:p-[4px])
 * - Dark gradient overlay for crystal clear text readability
 * - Centered Badge (— INDUSTRIES —) + Heading text overlay
 * - Dynamic Industry Title rendering (e.g. "Industrial Chemicals", "Water Treatment", etc.)
 * - 100% Global Gold Theme Tokens & RTL/LTR support.
 */
export default function IndustryHero({ industryTitle, industryBadge, industrySubtitle }) {
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

  const badgeText = industryBadge || (isRTL ? "القطاعات الصناعية" : "INDUSTRIES");
  const defaultTitle = isRTL ? "تمكين الصناعات. تقديم الحلول." : "Powering Industries. Delivering Solutions.";
  const displayTitle = industryTitle || defaultTitle;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--color-primary)] pt-22 sm:pt-24 md:pt-28 pb-10 sm:pb-14 md:pb-16 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        
        {/* ═══════════════════════════════════════════
            OUTER GOLD FRAME (Running Gold Gradient Frame - Matches ProductsHero 1-to-1)
            ═══════════════════════════════════════════ */}
        <div
          className={`relative rounded-2xl sm:rounded-3xl bg-gradient-gold-animated p-[3px] sm:p-[4px] transition-all duration-1000 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* INNER IMAGE CONTAINER */}
          <div className="relative rounded-[14px] sm:rounded-[22px] overflow-hidden">
            
            {/* Banner Image */}
            <div className="relative w-full aspect-[2.8/1] sm:aspect-[2.6/1] md:aspect-[2.8/1] lg:aspect-[3/1]">
              <Image
                src="/images/prodcut/allproductbanner.png"
                alt={displayTitle}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
              />

              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>

            {/* ═══════════════════════════════════════════
                TEXT OVERLAY: Badge + Heading
                ═══════════════════════════════════════════ */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-10 md:px-16 text-center z-10 ${
                isRTL ? "direction-rtl" : ""
              }`}
            >
              {/* Top Badge */}
              <div
                className={`inline-flex items-center gap-2 mb-3 sm:mb-4 transition-all duration-700 delay-200 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <span className="w-5 sm:w-7 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
                <span className="font-heading font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.25em] text-gold-light uppercase">
                  {badgeText}
                </span>
                <span className="w-5 sm:w-7 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
              </div>

              {/* Main Bold Heading */}
              <h1
                className={`font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.3rem] text-white leading-[1.15] tracking-tight max-w-3xl transition-all duration-700 delay-400 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {displayTitle.includes(".") ? (
                  <>
                    <span>{displayTitle.split(".")[0]}. </span>
                    <span className="text-gradient-gold-animated block sm:inline mt-1 sm:mt-0">
                      {displayTitle.split(".")[1] || ""}
                    </span>
                  </>
                ) : (
                  <span className="text-gradient-gold-animated">{displayTitle}</span>
                )}
              </h1>

              {/* Subtitle if available */}
              {industrySubtitle && (
                <p className="mt-3 font-subheading text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl font-normal leading-relaxed">
                  {industrySubtitle}
                </p>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
