"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

/**
 * LeepolHero - Hero Component for The World of Leepol Page
 * - Standardized Responsive Layout & Hierarchy matching global Hero design standards (FoodColorsHero, ApiHero, CareersHero).
 * - 100% Global Typography & Gold Tokens from globals.css.
 * - Direction-aware smooth theme overlay with high-contrast luxury text presentation.
 */
export default function LeepolHero() {
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
      className="relative w-full bg-[var(--color-primary)] pt-24 sm:pt-28 md:pt-32 pb-0 sm:pb-2 md:pb-4 overflow-hidden"
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

            {/* Background Molecular Science Image */}
            <Image
              src="/images/Active Pharmaceutical Ingredients/Active Pharmaceutical Ingredients herosection.jpg"
              alt="The World of Leepol - Leela Gulf"
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
              /* ARABIC (RTL): Dark Overlay starts from RIGHT and fades smoothly to LEFT */
              <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-card-dark)] via-[var(--color-card-dark)]/95 sm:via-[var(--color-card-dark)]/90 via-60% sm:via-45% to-transparent z-0" />
            ) : (
              /* ENGLISH (LTR): Dark Overlay starts from LEFT and fades smoothly to RIGHT */
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
                  ? "right-0 left-auto w-full sm:w-[88%] md:w-[84%] lg:w-[75%] xl:w-[72%] pr-5 sm:pr-10 md:pr-14 lg:pr-16 pl-5 text-right items-start"
                  : "left-0 right-auto w-full sm:w-[88%] md:w-[84%] lg:w-[75%] xl:w-[72%] pl-5 sm:pl-10 md:pl-14 lg:pl-16 pr-5 text-left items-start"
              }`}
            >
              {/* Top Breadcrumb Badge with Home Link */}
              <div
                className={`flex items-center gap-1.5 mb-2.5 sm:mb-4 transition-all duration-700 delay-200 ease-out font-heading font-bold text-[9.5px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase drop-shadow ${
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
                  {isRTL ? "عالم ليبول" : "THE WORLD OF LEEPOL"}
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className={`font-heading font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.1rem] text-white leading-[1.2] sm:leading-[1.16] tracking-tight max-w-full sm:max-w-3xl mb-2.5 sm:mb-4 transition-all duration-700 delay-400 ease-out drop-shadow-md ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {isRTL ? (
                  <>
                    <span>مرحبًا بكم في </span>
                    <span className="text-gradient-gold-animated">عالم ليبول</span>
                  </>
                ) : (
                  <>
                    <span>WELCOME TO THE WORLD OF </span>
                    <span className="text-gradient-gold-animated">LEEPOL</span>
                  </>
                )}
              </h1>

              {/* Headline Subtitle */}
              <h2
                className={`font-heading font-semibold text-sm sm:text-base md:text-lg lg:text-xl text-white leading-snug sm:leading-relaxed max-w-full sm:max-w-2xl mb-2 sm:mb-3 transition-all duration-700 delay-450 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {isRTL
                  ? "ليبول هو قفزة نوعية في علوم مواد الطلاء وكيمياء البوليمرات المتقدمة."
                  : "Leepol is an advancement of Coating Material Science & Polymer Chemistry."}
              </h2>

              {/* Description Body Paragraph */}
              <p
                className={`text-gray-300 font-subheading text-xs sm:text-sm md:text-base leading-relaxed max-w-full sm:max-w-2xl mb-3.5 sm:mb-5 transition-all duration-700 delay-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {isRTL
                  ? "اكتشف مجموعتنا المبتكرة من البوليمرات عالية الأداء ومواد الطلاء المتخصصة. تم تصميم ليبول لتلبية أكثر المتطلبات الصناعية دقة، ليقدم متانة استثنائية وتنوعاً فائقاً في التركيب ومقاومة كيميائية متقدمة لتطبيقات الجيل القادم."
                  : "Discover our innovative range of high-performance polymers and specialty coating materials. Engineered to meet the most demanding industrial requirements, Leepol delivers exceptional durability, formulation versatility, and advanced chemical resistance for next-generation applications."}
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
