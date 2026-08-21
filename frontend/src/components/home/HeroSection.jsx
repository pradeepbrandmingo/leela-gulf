"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

/**
 * HeroSection - Full-viewport hero with looping video background
 * and creative typography grid of 11 clickable Industry links.
 *
 * Grand, Bold & Prominent Typography Layout:
 * - Content container width expanded to lg:max-w-[92%] xl:max-w-[95%] so typography extends further to the right side of the screen.
 * - All text sizes, fonts, and row structures remain 100% untouched.
 */
export default function HeroSection() {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative w-full h-[100svh] max-h-[100svh] min-h-[580px] overflow-hidden flex items-center">
      {/* ── VIDEO BACKGROUND ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
        aria-hidden="true"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ── LIGHTER DARK OVERLAY for clear video backdrop ── */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* ── RIGHT-EDGE VERTICAL "DOWNLOAD CATALOGUE" TAB (Scoped ONLY to HeroSection) ── */}
      <a
        href="/documents/leela-gulf-catalogue.pdf"
        download="Leela_Gulf_Product_Catalogue.pdf"
        className={`absolute z-30 top-1/2 -translate-y-1/2 flex items-center justify-center bg-gradient-gold-animated shadow-[0_0_20px_rgba(196,132,47,0.4)] hover:shadow-[0_0_30px_rgba(247,210,126,0.6)] hover:brightness-110 transition-all duration-300 cursor-pointer ${
          isRTL
            ? "left-0 rounded-r-2xl sm:rounded-r-3xl border-2 border-l-0 border-white px-1.5 sm:px-3.5 py-4 sm:py-8"
            : "right-0 rounded-l-2xl sm:rounded-l-3xl border-2 border-r-0 border-white px-1.5 sm:px-3.5 py-4 sm:py-8"
        }`}
        aria-label="Download Catalogue PDF"
      >
        <span
          className="font-heading font-medium tracking-wide text-[10px] sm:text-sm md:text-base text-white select-none whitespace-nowrap"
          style={{
            writingMode: "vertical-lr",
            transform: isRTL ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          {t("downloadCatalogue")}
        </span>
      </a>

      {/* ── TYPOGRAPHY GRID CONTENT ── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-16 pb-2 sm:pt-20 sm:pb-3 md:pt-20 md:pb-3 h-full flex flex-col justify-center overflow-hidden">
        {/* Constrain width: 94% on mobile, lg:max-w-[92%] xl:max-w-[95%] on Desktop for maximum rightward extension */}
        <div
          className={`w-[94%] sm:w-full max-w-6xl lg:max-w-[92%] xl:max-w-[95%] flex flex-col justify-center my-auto ${isRTL ? "text-right" : "text-left"}`}
        >
          {/* ═══════════════════════════════════════════
              ROW 1: "Industrial" (NON-ITALIC) + "Chemicals" (gold bold)
                     + "Fertilizers" / "chemicals" (2 lines white beside)
              ═══════════════════════════════════════════ */}
          <div className="flex flex-wrap items-end gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-1 mb-1 sm:mb-1.5 md:mb-2">
            {/* Industrial Chemicals */}
            <Link
              href="/industries/industrial-chemicals"
              className="group block"
            >
              <span className="block font-heading font-medium not-italic text-xs sm:text-base md:text-lg text-gradient-gold-animated tracking-tight leading-tight mb-0.5">
                {t("industrial")}
              </span>
              <span className="block font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] text-gradient-gold-animated leading-none tracking-tight hover:opacity-90 transition-opacity">
                {t("industrialChemicals")}
              </span>
            </Link>

            {/* Fertilizers Chemicals (2 LINES WHITE TEXT BESIDE) */}
            <Link
              href="/industries/fertilizers-chemicals"
              className="block mb-0.5 md:mb-1 hover:text-gradient-gold-animated transition-colors"
            >
              <span className="font-heading font-medium text-[11px] sm:text-xs md:text-sm text-white leading-tight block mb-0.5 sm:mb-1">
                {t("fertilizers")}
              </span>
              <span className="font-heading font-medium text-[11px] sm:text-xs md:text-sm text-white leading-tight block">
                {t("fertilizersChemicals")}
              </span>
            </Link>
          </div>

          {/* ═══════════════════════════════════════════
              ROW 2: "Water Treatment" (white bold)
              ═══════════════════════════════════════════ */}
          <div className="mb-1 sm:mb-1.5 md:mb-2">
            <Link
              href="/industries/water-treatment"
              className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] text-white leading-none tracking-tight hover:text-gradient-gold-animated transition-colors inline-block"
            >
              {t("waterTreatment")}
            </Link>
          </div>

          {/* ═══════════════════════════════════════════
              ROW 3: "Textile Chemicals" (gold bold)
              ═══════════════════════════════════════════ */}
          <div className="mb-1 sm:mb-1.5 md:mb-2">
            <Link
              href="/industries/textile-chemicals"
              className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] text-gradient-gold-animated leading-none tracking-tight hover:opacity-90 transition-opacity inline-block"
            >
              {t("textileChemicals")}
            </Link>
          </div>

          {/* ═══════════════════════════════════════════
              ROW 4: "Food & Beverage chemicals" (2 lines) | divider | "Home Care & Personal Care" (2 lines)
              ═══════════════════════════════════════════ */}
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-1 mb-1 sm:mb-1.5 md:mb-2">
            <Link
              href="/industries/food-beverage-chemicals"
              className="font-heading font-bold text-base sm:text-xl md:text-2xl lg:text-3xl text-white leading-tight hover:text-gradient-gold-animated transition-colors"
            >
              <span className="block mb-0.5 sm:mb-1">{t("foodAnd")}</span>
              <span className="block">{t("beverageChemicals")}</span>
            </Link>

            {/* Gold vertical divider */}
            <span
              className="w-[2px] h-7 sm:h-8 md:h-10 bg-gradient-gold-animated rounded-full opacity-80"
              aria-hidden="true"
            />

            <Link
              href="/industries/home-care-personal-care"
              className="font-heading font-bold text-base sm:text-xl md:text-2xl lg:text-3xl text-gradient-gold-animated leading-tight hover:opacity-90 transition-opacity"
            >
              <span className="block mb-0.5 sm:mb-1">{t("homeCare")}</span>
              <span className="block">{t("personalCare")}</span>
            </Link>
          </div>

          {/* ═══════════════════════════════════════════
              ROW 5: "Pharmaceuticals API & Excipients" (gold)
              ═══════════════════════════════════════════ */}
          <div className="mb-1 sm:mb-1.5 md:mb-2">
            <Link
              href="/industries/pharmaceuticals-api-excipients"
              className="font-heading font-bold text-xl sm:text-2xl md:text-3xl lg:text-[2.6rem] text-gradient-gold-animated leading-tight tracking-tight hover:opacity-90 transition-opacity inline-block"
            >
              {t("pharmaceuticalsApiExcipients")}
            </Link>
          </div>

          {/* ═══════════════════════════════════════════
              ROW 6: "CASE" + 2 lines subscript | divider | "Packaging & Paper Pulp" (2 lines)
              ═══════════════════════════════════════════ */}
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 md:gap-x-6 gap-y-1 mb-1.5 sm:mb-2 md:mb-2.5">
            <Link
              href="/industries/case-coatings-adhesives"
              className="group hover:text-gradient-gold-animated transition-colors flex items-center gap-1.5 sm:gap-2.5"
            >
              <span className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-gradient-gold-animated leading-none tracking-tight inline-block">
                {t("caseTitle")}
              </span>
              <span className="font-heading font-medium text-xs sm:text-sm md:text-sm lg:text-[0.92rem] text-white leading-tight block max-w-[150px] sm:max-w-[180px] md:max-w-[220px]">
                <span className="block mb-0.5 sm:mb-0.5">
                  {t("caseSubscriptLine1")}
                </span>
                <span className="block">{t("caseSubscriptLine2")}</span>
              </span>
            </Link>

            {/* Gold vertical divider */}
            <span
              className="w-[2px] h-6 sm:h-7 md:h-9 bg-gradient-gold-animated rounded-full opacity-80"
              aria-hidden="true"
            />

            <Link
              href="/industries/packaging-paper-pulp"
              className="font-heading font-bold text-sm sm:text-base md:text-xl text-white leading-tight hover:text-gradient-gold-animated transition-colors"
            >
              <span className="block mb-0.5 sm:mb-1">{t("packagingAnd")}</span>
              <span className="block">{t("paperPulp")}</span>
            </Link>
          </div>

          {/* ═══════════════════════════════════════════
              ROW 7: "LEEPOL®" + "Oil & Gas"
              ═══════════════════════════════════════════ */}
          <div className="flex flex-wrap items-baseline gap-x-4 sm:gap-x-6 md:gap-x-10 gap-y-1">
            <Link
              href="/industries/home-care-personal-care"
              className="font-heading font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] text-gradient-gold-animated leading-none tracking-tight hover:opacity-90 transition-opacity inline-flex items-baseline"
            >
              <span>{t("leepolBrand")}</span>
              {/* Perfectly Centered Registered Trademark Vector Badge */}
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-[#c4842f] align-super self-start mt-0.5 sm:mt-1 inline-block ${isRTL ? "mr-0.5 sm:mr-1" : "ml-0.5 sm:ml-1"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-label="Registered Trademark"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  d="M9.5 15.5V8.5H12.5C13.8 8.5 14.5 9.2 14.5 10.3C14.5 11.4 13.8 12.1 12.5 12.1H9.5M12.5 12.1L14.5 15.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/industries/oil-gas"
              className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] text-white leading-none tracking-tight hover:text-gradient-gold-animated transition-colors inline-block"
            >
              {t("oilGas")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
