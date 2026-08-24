"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

/**
 * CareersHero - Inverted Layout for Arabic (RTL) vs English (LTR):
 * - English (LTR): Content box & Black Backdrop anchored to LEFT (left-0), photo visible on RIGHT.
 * - Arabic (RTL): Content box & Black Backdrop anchored to RIGHT (right-0), photo visible on LEFT.
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

        {/* ═══════════════════════════════════════════
            MAIN HERO CARD CONTAINER
            ═══════════════════════════════════════════ */}
        <div
          className={`relative rounded-xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-[#07080a] shadow-2xl transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Aspect Ratio Container */}
          <div className="relative w-full aspect-[1.7/1] sm:aspect-[2.4/1] md:aspect-[2.6/1] lg:aspect-[2.9/1] min-h-[280px] sm:min-h-[420px] md:min-h-[460px]">

            {/* Background Team Photo (Direction-Aware Object Position) */}
            <Image
              src="/images/careers/careers.avif"
              alt="Leela Gulf Team Working"
              fill
              className={`object-cover opacity-85 sm:opacity-100 ${
                isRTL ? "object-left sm:object-left" : "object-right sm:object-right"
              }`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
            />

            {/* ═══════════════════════════════════════════
                SOLID BLACK BACKDROP SHADE (Explicit left-0 in LTR vs right-0 in RTL)
                ═══════════════════════════════════════════ */}
            {isRTL ? (
              /* ARABIC (RTL): Solid Black Overlay anchored on the RIGHT side */
              <div className="absolute top-0 bottom-0 right-0 left-auto w-full sm:w-[80%] md:w-[75%] lg:w-[68%] bg-gradient-to-l from-[#07080a] via-[#07080a] via-45% to-transparent z-0" />
            ) : (
              /* ENGLISH (LTR): Solid Black Overlay anchored on the LEFT side */
              <div className="absolute top-0 bottom-0 left-0 right-auto w-full sm:w-[80%] md:w-[75%] lg:w-[68%] bg-gradient-to-r from-[#07080a] via-[#07080a] via-45% to-transparent z-0" />
            )}

            {/* Mobile Top/Bottom Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080a]/60 via-transparent to-[#07080a]/30 sm:hidden z-0" />

            {/* ═══════════════════════════════════════════
                TEXT CONTENT OVERLAY CONTAINER
                LTR: Anchored to left-0 (LEFT SIDE)
                RTL: Anchored to right-0 (RIGHT SIDE)
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
                className={`font-heading font-bold text-base sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.1rem] text-white leading-[1.18] sm:leading-[1.16] tracking-tight max-w-full sm:max-w-2xl md:max-w-3xl mb-2 sm:mb-4 transition-all duration-700 delay-400 ease-out drop-shadow-md ${
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
              <div className="w-8 sm:w-14 h-[2.5px] sm:h-[3px] bg-gradient-gold-animated rounded-full mb-2.5 sm:mb-6" />

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
