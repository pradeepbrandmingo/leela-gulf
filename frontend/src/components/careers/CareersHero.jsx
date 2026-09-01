"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

/**
 * CareersHero - Direction-Aware Hero Component (Synchronized with KnowledgeCenterHero):
 * - LTR (English): Text on LEFT, Theme Dark Overlay on LEFT, Photo on RIGHT.
 * - RTL (Arabic): Text on RIGHT, Theme Dark Overlay on RIGHT, Photo on LEFT.
 * - 100% Mobile & Desktop Responsive.
 * - 100% Global Theme Gold Tokens.
 */
export default function CareersHero({ onScrollToRoles }) {
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--color-primary)] pt-16 sm:pt-24 md:pt-28 pb-4 sm:pb-12 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        {/* Subtle Ambient Gold Glow for Depth */}
        <div className="absolute -top-16 -left-16 w-96 h-96 bg-gold-main/[0.07] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-gold-main/[0.04] rounded-full blur-[120px] pointer-events-none" />

        {/* ═══════════════════════════════════════════
            MAIN HERO CARD CONTAINER
            Uses 100% Globals.css Token: var(--color-card-dark)
            ═══════════════════════════════════════════ */}
        <div
          className={`relative rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-[var(--color-card-dark)] border border-white/5 shadow-2xl transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Aspect Ratio Container */}
          <div className="relative w-full aspect-[1.7/1] sm:aspect-[2.4/1] md:aspect-[2.6/1] lg:aspect-[2.9/1] min-h-[280px] sm:min-h-[420px] md:min-h-[460px]">

            {/* Background Team Photo */}
            <Image
              src="/images/careers/careers.avif"
              alt="Leela Gulf Team Working"
              fill
              className={`object-cover opacity-90 sm:opacity-100 ${
                isRTL ? "object-left sm:object-left" : "object-right sm:object-right"
              }`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
            />

            {/* ═══════════════════════════════════════════
                SMOOTH THEME GRADIENT OVERLAY (RTL / LTR)
                100% Global Theme Token: var(--color-card-dark)
                ═══════════════════════════════════════════ */}
            {isRTL ? (
              /* ARABIC (RTL): Dark Overlay starts from RIGHT and fades smoothly to LEFT */
              <div className="absolute top-0 bottom-0 right-0 left-auto w-full sm:w-[85%] md:w-[80%] lg:w-[70%] bg-gradient-to-l from-[var(--color-card-dark)] via-[var(--color-card-dark)]/90 via-45% to-transparent z-0" />
            ) : (
              /* ENGLISH (LTR): Dark Overlay starts from LEFT and fades smoothly to RIGHT */
              <div className="absolute top-0 bottom-0 left-0 right-auto w-full sm:w-[85%] md:w-[80%] lg:w-[70%] bg-gradient-to-r from-[var(--color-card-dark)] via-[var(--color-card-dark)]/90 via-45% to-transparent z-0" />
            )}

            {/* Mobile Top/Bottom Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card-dark)]/80 via-transparent to-[var(--color-card-dark)]/30 sm:hidden z-0" />

            {/* ═══════════════════════════════════════════
                TEXT CONTENT OVERLAY CONTAINER
                ═══════════════════════════════════════════ */}
            <div
              className={`absolute top-0 bottom-0 flex flex-col justify-center z-10 ${
                isRTL
                  ? "right-0 left-auto w-full sm:w-[75%] md:w-[70%] lg:w-[62%] pr-5 sm:pr-10 md:pr-14 lg:pr-16 pl-4 text-right items-start"
                  : "left-0 right-auto w-full sm:w-[75%] md:w-[70%] lg:w-[62%] pl-5 sm:pl-10 md:pl-14 lg:pl-16 pr-4 text-left items-start"
              }`}
            >
              {/* Top Breadcrumb Badge */}
              <div
                className={`flex items-center gap-2 mb-1.5 sm:mb-4 transition-all duration-700 delay-200 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="font-heading font-bold text-[9px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-gold-light uppercase drop-shadow">
                  {isRTL ? "الرئيسية / الوظائف" : "HOME / CAREERS"}
                </span>
              </div>

              {/* Main Bold Heading */}
              <h1
                className={`font-heading font-bold text-base sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.1rem] text-white leading-[1.18] sm:leading-[1.16] tracking-tight max-w-full sm:max-w-2xl md:max-w-3xl mb-2 sm:mb-5 transition-all duration-700 delay-400 ease-out drop-shadow-md ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {isRTL ? (
                  <>
                    <span className="block">خوض تحدي إعاده صياغه</span>
                    <span className="block">
                      <span className="text-gradient-gold-animated">الصناعة الكيميائية</span>
                    </span>
                    <span className="block">من خلال الانضمام إلينا</span>
                  </>
                ) : (
                  <>
                    <span className="block">Embrace the Challenge of</span>
                    <span className="block">
                      Reimagining the{" "}
                      <span className="text-gradient-gold-animated">Chemical Industry</span>
                    </span>
                    <span className="block">by Joining Us</span>
                  </>
                )}
              </h1>

              {/* Gold Accent Dash */}
              <div className="w-8 sm:w-14 h-[2.5px] sm:h-[3px] bg-gradient-gold-animated rounded-full mb-3 sm:mb-6" />

              {/* Action Buttons Row */}
              <div
                className={`flex items-center gap-2 sm:gap-4 transition-all duration-700 delay-600 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {/* Join Us Solid Gold Button */}
                <button
                  type="button"
                  onClick={onScrollToRoles}
                  className="px-4 py-2 sm:px-7 sm:py-3 rounded-lg sm:rounded-2xl bg-gradient-gold-animated text-black font-heading font-bold text-[11px] sm:text-sm tracking-wide shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  {isRTL ? "انضم إلينا" : "Join Us"}
                </button>

                {/* View Open Roles Outlined Button */}
                <button
                  type="button"
                  onClick={onScrollToRoles}
                  className="px-4 py-2 sm:px-7 sm:py-3 rounded-lg sm:rounded-2xl border border-white/80 text-white font-heading font-bold text-[11px] sm:text-sm tracking-wide hover:border-gold-main hover:text-gold-main transition-all duration-300 cursor-pointer backdrop-blur-xs"
                >
                  {isRTL ? "عرض الوظائف المتاحة" : "View open roles"}
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
