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
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 md:gap-24">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`client-logo-${logo.id}-${index}`}
              className="flex items-center justify-center shrink-0 cursor-pointer group px-3 sm:px-4"
            >
              {/* Direct Transparent Client PNG Image (Original Clean UI, No Box Cards) */}
              <Image
                src={logo.src}
                alt={logo.alt}
                width={280}
                height={120}
                unoptimized
                className="h-16 sm:h-22 md:h-26 lg:h-32 max-w-[180px] sm:max-w-[240px] md:max-w-[280px] w-auto object-contain brightness-0 invert opacity-80 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
