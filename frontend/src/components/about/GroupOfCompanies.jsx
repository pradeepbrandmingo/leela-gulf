"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";

/**
 * GroupOfCompanies - Group of Companies brand logos section for the About Us page.
 * 100% Match to Client Request:
 * 1. Default: Dark matte grey card (bg-[#1d1d1d]), pure white logo filter (brightness-0 invert).
 * 2. Hover: Card smoothly turns clean WHITE (hover:bg-white) with gold border glow, revealing original vivid logo colors so black logo text is 100% clearly visible and premium!
 */
export default function GroupOfCompanies() {
  const { t } = useLanguage();

  const companies = [
    {
      id: "tobias-amines",
      name: "Tobias Amines",
      logo: "/images/aboutpage/tobias amines.png",
    },
    {
      id: "leela-films",
      name: "Leela Films",
      logo: "/images/aboutpage/leela Films.png",
    },
    {
      id: "leela-gulf",
      name: "Leela Gulf FZC",
      logo: "/images/aboutpage/leela Gulf FZC.png",
    },
    {
      id: "leela-partner",
      name: "Leela Partner Limited",
      logo: "/images/aboutpage/leela partner limited.png",
    },
    {
      id: "leepol",
      name: "Leepol",
      logo: "/images/aboutpage/leepol black logo.png",
    },
    {
      id: "pure-leela",
      name: "Pure Leela Limited",
      logo: "/images/aboutpage/Pure leela limited.png",
    },
    {
      id: "leela-corp",
      name: "The Leela Corporation",
      logo: "/images/aboutpage/the leela corporation.png",
    },
    {
      id: "leela-usa",
      name: "The Leela USA LLC",
      logo: "/images/aboutpage/TLC_USA_LLC_Cap.png",
    },
  ];

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Global Unified Section Heading */}
        <SectionHeading
          prefix={t("groupCompanies.titlePrefix")}
          highlight={t("groupCompanies.titleHighlight")}
          className="mb-8 sm:mb-12"
        />

        {/* 8 Company Logo Cards Grid (White Hover Background for Perfect Logo Contrast) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 max-w-[1140px] mx-auto">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-[#1d1d1d] border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex items-center justify-center h-[140px] sm:h-[165px] md:h-[185px] shadow-none transition-all duration-500 hover:bg-white hover:border-[var(--color-secondary-main)] hover:shadow-[0_15px_35px_rgba(196,132,47,0.3)] hover:-translate-y-2 group cursor-pointer"
            >
              <div className="relative w-full h-full flex items-center justify-center p-1">
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={260}
                  height={130}
                  unoptimized
                  className="max-h-[90px] sm:max-h-[110px] max-w-[92%] sm:max-w-[90%] object-contain filter brightness-0 invert opacity-90 group-hover:brightness-100 group-hover:invert-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
