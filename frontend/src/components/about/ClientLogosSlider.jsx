"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

/**
 * ClientLogosSlider - Continuous infinite marquee logo slider component.
 * Uses 15 transparent PNG client logo images from /images/clientlogo/ (1.png to 15.png).
 * Fully responsive across all devices with prominent mobile logo sizing (h-20) & clear edge masks.
 */
export default function ClientLogosSlider() {
  const { t } = useLanguage();

  // 15 Real Transparent PNG Client Logos from /images/clientlogo/
  const clientLogos = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    src: `/images/clientlogo/${i + 1}.png`,
    alt: `Leela Gulf Client Partner ${i + 1}`,
  }));

  // Repeat logos array so the infinite marquee track is 100% seamless & continuous
  const duplicatedLogos = [
    ...clientLogos,
    ...clientLogos,
    ...clientLogos,
    ...clientLogos,
  ];

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-8 sm:py-14 md:py-16 overflow-hidden">
      {/* Container with Standardized Spacing & Typography */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 mb-6 sm:mb-10">
        {/* Section Heading (Matching Reference UI Spec & Global Typography Tokens) */}
        <h3 className="font-heading font-medium text-[20px] sm:text-[28px] md:text-[32px] lg:text-[36px] text-center text-white tracking-tight leading-tight">
          <span>{t("clientSlider.titlePrefix")}</span>
          <span className="text-gradient-gold-animated font-semibold">{t("clientSlider.titleHighlight")}</span>
        </h3>
      </div>

      {/* ── INFINITE MARQUEE SLIDER WRAPPER ── */}
      <div className="relative w-full overflow-hidden flex items-center py-3">
        {/* Compact Edge Masks for Mobile (w-8) so center remains clear & visible */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 md:w-48 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 md:w-48 bg-gradient-to-l from-[var(--color-primary)] via-[var(--color-primary)]/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track Container (Slow, Luxury 120s Glide) */}
        <div className="animate-marquee flex items-center gap-10 sm:gap-16 md:gap-24">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`client-logo-${logo.id}-${index}`}
              className="flex items-center justify-center shrink-0 cursor-pointer group px-2 sm:px-4"
            >
              {/* High-Impact Responsive Client PNG Image */}
              <Image
                src={logo.src}
                alt={logo.alt}
                width={280}
                height={120}
                className="h-20 sm:h-24 md:h-28 lg:h-32 max-w-[210px] sm:max-w-[260px] md:max-w-[280px] w-auto object-contain brightness-0 invert opacity-85 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
