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
            GLOBAL MAP VISUALIZATION CONTAINER
            ═══════════════════════════════════════════ */}
        <div className="relative w-full max-w-5xl mx-auto mb-10 sm:mb-14 md:mb-16 rounded-2xl sm:rounded-3xl bg-[var(--color-card-dark)]/80 border border-gold-main/30 p-4 sm:p-6 md:p-10 shadow-2xl backdrop-blur-md">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute inset-0 bg-radial from-white/[0.03] to-transparent rounded-2xl sm:rounded-3xl pointer-events-none" />

          <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] max-h-[500px]">
            <Image
              src="/images/Active Pharmaceutical Ingredients/map gulf.png"
              alt={isRTL ? "خريطة تواجدنا حول العالم" : "Our Global Presence Map"}
              fill
              className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              priority
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            GLOBAL REGULATORY CERTIFICATIONS & ACCREDITATIONS
            ═══════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto">
          {/* Logos Grid (Cards that turn White on Hover with Gold Glow) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-5">
            {CERTIFICATIONS_DATA.map((item, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0f1117] border border-[#232736] hover:border-gold-main/70 hover:bg-white hover:shadow-[0_8px_30px_rgba(214,185,42,0.35)] transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] cursor-pointer"
              >
                {/* Logo Image Container */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 flex items-center justify-center mb-2.5">
                  <Image
                    src={item.src}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Certification Title Text */}
                <span className="text-center font-heading font-bold text-[11px] sm:text-xs text-gray-300 group-hover:text-neutral-900 transition-colors duration-300 line-clamp-2 leading-tight">
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
