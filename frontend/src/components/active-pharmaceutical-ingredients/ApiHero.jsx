"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

/**
 * ApiHero - Hero Component for Active Pharmaceutical Ingredients Page
 * - Standardized Responsive Layout & Hierarchy matching global Hero design standards.
 * - 100% Global Typography & Gold Tokens from globals.css.
 */
export default function ApiHero() {
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
        {/* Subtle Ambient Gold Glow */}
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
          {/* Responsive Height & Aspect Ratio Container */}
          <div className="relative w-full min-h-[380px] sm:min-h-[420px] md:min-h-[460px] sm:aspect-[2.4/1] md:aspect-[2.6/1] lg:aspect-[2.9/1]">

            {/* Background Molecular / Lab Image */}
            <Image
              src="/images/Active Pharmaceutical Ingredients/Active Pharmaceutical Ingredients herosection.jpg"
              alt="Active Pharmaceutical Ingredients - Leela Gulf"
              fill
              className={`object-cover opacity-90 sm:opacity-100 ${
                isRTL ? "object-left sm:object-left" : "object-right sm:object-right"
              }`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
            />

            {/* ═══════════════════════════════════════════
                DIRECTION-AWARE GRADIENT OVERLAY (RTL / LTR)
                100% Global Theme Token: var(--color-card-dark)
                ═══════════════════════════════════════════ */}
            {isRTL ? (
              /* ARABIC (RTL): Dark Overlay starts from RIGHT and fades to LEFT */
              <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-card-dark)] via-[var(--color-card-dark)]/95 sm:via-[var(--color-card-dark)]/90 via-60% sm:via-45% to-transparent z-0" />
            ) : (
              /* ENGLISH (LTR): Dark Overlay starts from LEFT and fades to RIGHT */
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-card-dark)] via-[var(--color-card-dark)]/95 sm:via-[var(--color-card-dark)]/90 via-60% sm:via-45% to-transparent z-0" />
            )}

            {/* Mobile Top/Bottom Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card-dark)]/90 via-transparent to-[var(--color-card-dark)]/40 sm:hidden z-0" />

            {/* ═══════════════════════════════════════════
                TEXT CONTENT OVERLAY CONTAINER
                ═══════════════════════════════════════════ */}
            <div
              className={`absolute inset-0 flex flex-col justify-center z-10 py-7 sm:py-0 ${
                isRTL
                  ? "right-0 left-auto w-full sm:w-[80%] md:w-[75%] lg:w-[65%] pr-5 sm:pr-10 md:pr-14 lg:pr-16 pl-5 text-right items-start"
                  : "left-0 right-auto w-full sm:w-[80%] md:w-[75%] lg:w-[65%] pl-5 sm:pl-10 md:pl-14 lg:pl-16 pr-5 text-left items-start"
              }`}
            >
              {/* Top Breadcrumb Badge */}
              <div
                className={`flex items-center gap-1.5 mb-2 sm:mb-4 transition-all duration-700 delay-200 ease-out font-heading font-bold text-[9.5px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase drop-shadow ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <Link
                  href="/"
                  className="text-gold-light hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  {isRTL ? "الرئيسية" : "HOME"}
                </Link>
                <span className="text-gold-main/60">/</span>
                <span className="text-gold-light">
                  {isRTL ? "المواد الصيدلانية الفعالة" : "ACTIVE PHARMACEUTICAL INGREDIENTS"}
                </span>
              </div>

              {/* Main Heading (100% Global Typography & Sizing) */}
              <h1
                className={`font-heading font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.1rem] text-white leading-[1.2] sm:leading-[1.16] tracking-tight max-w-full sm:max-w-2xl md:max-w-3xl mb-2.5 sm:mb-5 transition-all duration-700 delay-400 ease-out drop-shadow-md ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {isRTL ? (
                  <>
                    <span className="block">المواد الصيدلانية</span>
                    <span className="block">
                      <span className="text-gradient-gold-animated">الفعالة (APIs)</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block">ACTIVE PHARMACEUTICAL</span>
                    <span className="block">
                      <span className="text-gradient-gold-animated">INGREDIENTS</span>
                    </span>
                  </>
                )}
              </h1>

              {/* Description Subtitle */}
              <p
                className={`text-gray-300 font-subheading text-xs sm:text-sm md:text-base leading-relaxed sm:leading-relaxed max-w-full sm:max-w-xl md:max-w-2xl mb-3 sm:mb-6 transition-all duration-700 delay-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {isRTL
                  ? "اكتشف مجموعتنا الشاملة من المكونات الصيدلانية الفعالة عالية الجودة (APIs). يتم تصنيعها وفقًا لمعايير تنظيمية صارمة لضمان النقاء الفائق والاتساق والفعالية لتركيبات الرعاية الصحية العالمية."
                  : "Discover our comprehensive range of high-quality Active Pharmaceutical Ingredients (APIs). Manufactured under stringent regulatory standards, we ensure uncompromising purity, consistency, and efficacy for global healthcare formulations."}
              </p>

              {/* Gold Accent Dash */}
              <div className="w-8 sm:w-14 h-[2.5px] sm:h-[3px] bg-gradient-gold-animated rounded-full" />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
