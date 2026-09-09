"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";

export const CERTIFICATIONS_DATA = [
  {
    name: "ISO Certified (QMS)",
    arName: "شهادة آيزو (نظام إدارة الجودة)",
    src: "/images/Active Pharmaceutical Ingredients/logos/ISO Certified (QMS).png",
  },
  {
    name: "ISO Certified (EMS)",
    arName: "شهادة آيزو (الإدارة البيئية)",
    src: "/images/Active Pharmaceutical Ingredients/logos/ISO Certified (EMS).png",
  },
  {
    name: "WHO GMP Certified",
    arName: "شهادة ممارسات التصنيع الجيد (WHO GMP)",
    src: "/images/Active Pharmaceutical Ingredients/logos/WHO GMP Certified.png",
  },
  {
    name: "GMP Certified",
    arName: "شهادة ممارسات التصنيع الجيد (GMP)",
    src: "/images/Active Pharmaceutical Ingredients/logos/GMP Certified.png",
  },
  {
    name: "GLP Certified",
    arName: "شهادة ممارسات المختبرات الجيدة (GLP)",
    src: "/images/Active Pharmaceutical Ingredients/logos/GLP Cortified.png",
  },
  {
    name: "FDA Certified",
    arName: "معتمد من إدارة الغذاء والدواء (FDA)",
    src: "/images/Active Pharmaceutical Ingredients/logos/FDA Certified.png",
  },
  {
    name: "FDCA Certified",
    arName: "معتمد من هيئة FDCA",
    src: "/images/Active Pharmaceutical Ingredients/logos/FDCA Cortified.png",
  },
  {
    name: "FSSAI Certified",
    arName: "معتمد من FSSAI",
    src: "/images/Active Pharmaceutical Ingredients/logos/FSSAI Certified.png",
  },
  {
    name: "Halal Certified",
    arName: "شهادة حلال معتمدة",
    src: "/images/Active Pharmaceutical Ingredients/logos/Halal Certified.png",
  },
  {
    name: "Kosher Certified",
    arName: "شهادة كوشير معتمدة",
    src: "/images/Active Pharmaceutical Ingredients/logos/Kosher Certified.png",
  },
  {
    name: "FSSC Certified",
    arName: "شهادة سلامة الغذاء (FSSC 22000)",
    src: "/images/Active Pharmaceutical Ingredients/logos/FSSC Certified.png",
  },
  {
    name: "GMO Certified",
    arName: "شهادة خلو من الكائنات المعدلة وراثياً (GMO)",
    src: "/images/Active Pharmaceutical Ingredients/logos/GMO Certified.png",
  },
  {
    name: "HACCP Certified",
    arName: "شهادة تحليل المخاطر (HACCP)",
    src: "/images/Active Pharmaceutical Ingredients/logos/HACCP Certified.png",
  },
  {
    name: "EXCiPACT Certified",
    arName: "شهادة إكسيباكت للسواغات (EXCiPACT)",
    src: "/images/Active Pharmaceutical Ingredients/logos/EXCIPACT Certified.png",
  },
];

export default function GlobalPresenceSection() {
  const { isRTL } = useLanguage();

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      {/* Background Decorative Gradient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] md:w-[900px] h-[400px] bg-gradient-to-b from-[#d6b92a]/8 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* ═══════════════════════════════════════════
            GLOBAL UNIFIED SECTION HEADING (100% Match with About Us & Site)
            ═══════════════════════════════════════════ */}
        <SectionHeading
          prefix={isRTL ? "تواجدنا" : "Our Presence"}
          highlight={isRTL ? "حول العالم" : "Across The Globe"}
          className="mb-8 sm:mb-12"
        />

        {/* ═══════════════════════════════════════════
            GLOBAL MAP VISUALIZATION CONTAINER (Full Container Width)
            ═══════════════════════════════════════════ */}
        <div className="relative w-full mb-10 sm:mb-14 md:mb-16 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#11131c] via-[#0d0f17] to-[#0a0b12] border border-gold-main/35 hover:border-gold-main/50 p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 group">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gold-main/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-white/[0.02] to-transparent rounded-2xl sm:rounded-3xl pointer-events-none" />

          <div className="relative w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[580px] xl:h-[640px]">
            <Image
              src="/images/Active Pharmaceutical Ingredients/map gulf.png"
              alt={isRTL ? "خريطة تواجدنا حول العالم" : "Our Global Presence Map"}
              fill
              className="object-contain w-full h-full drop-shadow-[0_12px_35px_rgba(0,0,0,0.85)] group-hover:scale-[1.01] transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1400px"
              priority
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            GLOBAL REGULATORY CERTIFICATIONS & ACCREDITATIONS (Full Width Grid)
            ═══════════════════════════════════════════ */}
        <div className="w-full">
          {/* Logos Grid (Crisp White Cards with Luxury Gold Hover Glow) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-4.5 xl:gap-5">
            {CERTIFICATIONS_DATA.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:border-gold-main hover:shadow-[0_12px_32px_rgba(230,175,46,0.45),0_0_20px_rgba(230,175,46,0.25)] transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] cursor-pointer"
              >
                {/* Logo Image Container */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 flex items-center justify-center mb-2.5">
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Certification Title Text */}
                <span className="text-center font-heading font-bold text-[11px] sm:text-xs text-neutral-900 group-hover:text-black transition-colors duration-200 line-clamp-2 leading-tight">
                  {isRTL ? item.arName : item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
