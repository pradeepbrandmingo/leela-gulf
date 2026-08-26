"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

/**
 * AboutHero - Hero section component for the About Us page.
 * Uses /images/aboutpage/aboutnew.png with zero-gap 100% natural aspect ratio fit.
 * Standardized global section spacing (pb-10 sm:pb-14 md:pb-16).
 */
export default function AboutHero() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative w-full bg-[var(--color-primary)] text-white overflow-hidden pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 md:pb-16">
      {/* Subtle Ambient Background Gradient Glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[var(--color-secondary-main)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">

          {/* ═══════════════════════════════════════════
              LEFT COLUMN: Accent Bar, Heading & Paragraphs
              ═══════════════════════════════════════════ */}
          <div className={`lg:col-span-7 flex flex-col justify-center ${isRTL ? "text-right" : "text-left"}`}>

            {/* Top Horizontal Gold Accent Bar */}
            <div className="w-20 sm:w-24 h-[4px] bg-gradient-gold-animated rounded-full mb-6 sm:mb-8" />

            {/* Main Section Heading */}
            <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.15] tracking-tight mb-6 sm:mb-8">
              <span className="text-white inline">{t("aboutHero.titlePart1")}{" "}</span>
              <span className="text-gradient-gold-animated inline">{t("aboutHero.titlePart2")}</span>
            </h1>

            {/* Paragraph Descriptions */}
            <div className="space-y-4 sm:space-y-5 text-gray-300/90 font-subheading text-sm sm:text-base md:text-[1.02rem] leading-relaxed">
              <p className="hover:text-white transition-colors duration-300">
                {t("aboutHero.p1")}
              </p>
              <p className="hover:text-white transition-colors duration-300">
                {t("aboutHero.p2")}
              </p>
              <p className="hover:text-white transition-colors duration-300">
                {t("aboutHero.p3")}
              </p>
              <p className="hover:text-white transition-colors duration-300">
                {t("aboutHero.p4")}
              </p>
            </div>

          </div>

          {/* ═══════════════════════════════════════════
              RIGHT COLUMN: Image Box (aboutnew.png) & Floating Badge
              ═══════════════════════════════════════════ */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-[500px] lg:max-w-none">

              {/* Clean Image Container Box (Subtle Light Border, Heavy Dark Shadow-2xl Removed) */}
              <div className="relative rounded-2xl sm:rounded-3xl border border-[#393C3F]/30 shadow-md overflow-hidden group block">
                <Image
                  src="/images/aboutpage/aboutnew.png"
                  alt="Leela Gulf Leadership and Operations"
                  width={600}
                  height={600}
                  className="w-full h-auto block object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out rounded-2xl sm:rounded-3xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 pointer-events-none rounded-2xl sm:rounded-3xl" />
              </div>

              {/* Floating Gold "Excellence In Action" Badge (Bottom Right Overlap) */}
              <div
                className={`absolute z-20 -bottom-4 sm:-bottom-6 bg-[var(--color-card-dark)] border border-[var(--color-secondary-main)]/50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 md:p-5 shadow-2xl shadow-black max-w-[270px] sm:max-w-[310px] ${
                  isRTL ? "left-2 sm:left-4" : "right-2 sm:right-4"
                }`}
              >
                {/* Badge Text Content */}
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-[var(--color-secondary-main)] leading-tight mb-0.5 sm:mb-1">
                    {t("aboutHero.badgeTitle")}
                  </h4>
                  <p className="font-subheading text-[11px] sm:text-xs text-gray-300 leading-snug">
                    {t("aboutHero.badgeSubtitle")}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
