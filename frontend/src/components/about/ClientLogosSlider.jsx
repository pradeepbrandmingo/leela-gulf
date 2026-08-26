"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";

/**
 * ClientLogosSlider - Continuous infinite marquee logo slider component.
 * Standardized global section vertical spacing (py-10 sm:py-14 md:py-16).
 * Uses dir="ltr" on marquee track so CSS animation never breaks or hides logos during language switch.
 */
export default function ClientLogosSlider() {
  const { t } = useLanguage();

  // 100% Enterprise Production-Ready Verified Logo Asset Manifest
  const activeLogoFiles = [
    "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png",
    "12.png", "14.png", "15.png", "16.png", "18.png", "19.png", "20.png", "21.png",
    "22.png", "23.png", "24.png", "25.png", "26.png",
  ];

  const clientLogos = activeLogoFiles.map((filename, index) => ({
    id: index + 1,
    src: `/images/clientlogo/${filename}`,
    alt: `Leela Gulf Client Partner ${index + 1}`,
  }));

  // Repeat logos array so the infinite marquee track is 100% seamless & continuous
  const duplicatedLogos = [
    ...clientLogos,
    ...clientLogos,
    ...clientLogos,
    ...clientLogos,
  ];

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 overflow-hidden">
      {/* Container with Standardized Global Section Heading */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <SectionHeading
          prefix={t("clientSlider.titlePrefix")}
          highlight={t("clientSlider.titleHighlight")}
          className="mb-8 sm:mb-12"
        />
      </div>

      {/* ── INFINITE MARQUEE SLIDER WRAPPER (Locked LTR direction for 100% smooth animation in English & Arabic) ── */}
      <div className="relative w-full overflow-hidden flex items-center py-3" dir="ltr">
        {/* Compact Edge Masks for Mobile (w-8) so center remains clear & visible */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 md:w-48 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 md:w-48 bg-gradient-to-l from-[var(--color-primary)] via-[var(--color-primary)]/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track Container (Slow, Luxury 120s Glide) */}
        <div className="animate-marquee flex items-center gap-5 sm:gap-7 md:gap-8 py-2">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`client-logo-${logo.id}-${index}`}
              className="bg-[var(--color-card-dark)] border border-white/10 rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-center min-w-[170px] sm:min-w-[210px] md:min-w-[240px] h-20 sm:h-24 md:h-28 shrink-0 transition-all duration-500 hover:bg-white hover:border-[var(--color-secondary-main)] hover:shadow-[0_12px_30px_rgba(196,132,47,0.3)] hover:-translate-y-1.5 group cursor-pointer"
            >
              {/* Client Logo PNG (White inverted in dark card -> Real original colors on white card hover) */}
              <Image
                src={logo.src}
                alt={logo.alt}
                width={280}
                height={120}
                unoptimized
                className="max-h-[50px] sm:max-h-[65px] md:max-h-[75px] max-w-[140px] sm:max-w-[170px] md:max-w-[190px] w-auto object-contain filter brightness-0 invert opacity-90 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
