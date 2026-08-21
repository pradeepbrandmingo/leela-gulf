"use client";

import { useLanguage } from "@/context/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";
import { Target, Eye } from "lucide-react";

/**
 * MissionVision - Mission & Vision section component for the About Us page.
 * Fully responsive across LTR (English) and RTL (Arabic) languages with symmetrical card notch clipping & padding.
 */
export default function MissionVision() {
  const { t, isRTL } = useLanguage();

  // CSS Polygon clip-path matching reference UI cutout notch for LTR & RTL
  const folderClipLTR = "polygon(0% 0%, 60% 0%, 68% 32px, 100% 32px, 100% 100%, 0% 100%)";
  const folderClipRTL = "polygon(0% 32px, 32% 32px, 40% 0%, 100% 0%, 100% 100%, 0% 100%)";

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      {/* Subtle Ambient Background Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--color-secondary-main)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Global Unified Section Heading */}
        <SectionHeading
          prefix={t("missionVision.titlePrefix")}
          highlight={t("missionVision.titleHighlight")}
          className="mb-8 sm:mb-12"
        />

        {/* Mission & Vision Cards Grid (Compact 1040px Max Width for Proportioned Card Dimensions) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-[1040px] mx-auto items-stretch">
          
          {/* ═══════════════════════════════════════════
              CARD 1: MISSION
              ═══════════════════════════════════════════ */}
          <div className="relative group filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col h-full">
            
            {/* Top Shelf Index Badge (— 01) */}
            <div className={`absolute top-1.5 ${isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6"} z-20 flex items-center gap-2 pointer-events-none`}>
              {isRTL ? (
                <>
                  <span className="font-heading font-bold text-sm sm:text-base text-[var(--color-secondary-main)] tracking-widest">
                    01
                  </span>
                  <span className="w-5 sm:w-6 h-[2px] bg-[var(--color-secondary-main)] inline-block" />
                </>
              ) : (
                <>
                  <span className="w-5 sm:w-6 h-[2px] bg-[var(--color-secondary-main)] inline-block" />
                  <span className="font-heading font-bold text-sm sm:text-base text-[var(--color-secondary-main)] tracking-widest">
                    01
                  </span>
                </>
              )}
            </div>

            {/* Folder Cutout White Card Surface */}
            <div
              className="bg-white text-gray-900 rounded-3xl pt-7 sm:pt-9 pb-8 sm:pb-10 px-6 sm:px-8 md:px-9 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
              style={{
                clipPath: isRTL ? folderClipRTL : folderClipLTR,
              }}
            >
              {/* Card Header: Flat Gold Circle Badge + Title */}
              <div className={`flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6 ${isRTL ? "pl-16 sm:pl-20" : "pr-16 sm:pr-20"}`}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d49b29] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Target className="w-7 h-7 sm:w-8 sm:h-8 text-black stroke-[2.2]" />
                </div>

                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                  {t("missionVision.missionTitle")}
                </h3>
              </div>

              {/* Body Description Text */}
              <p className="font-subheading text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed flex-1">
                {t("missionVision.missionDesc")}
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              CARD 2: VISION
              ═══════════════════════════════════════════ */}
          <div className="relative group filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col h-full">
            
            {/* Top Shelf Index Badge (— 02) */}
            <div className={`absolute top-1.5 ${isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6"} z-20 flex items-center gap-2 pointer-events-none`}>
              {isRTL ? (
                <>
                  <span className="font-heading font-bold text-sm sm:text-base text-[var(--color-secondary-main)] tracking-widest">
                    02
                  </span>
                  <span className="w-5 sm:w-6 h-[2px] bg-[var(--color-secondary-main)] inline-block" />
                </>
              ) : (
                <>
                  <span className="w-5 sm:w-6 h-[2px] bg-[var(--color-secondary-main)] inline-block" />
                  <span className="font-heading font-bold text-sm sm:text-base text-[var(--color-secondary-main)] tracking-widest">
                    02
                  </span>
                </>
              )}
            </div>

            {/* Folder Cutout White Card Surface */}
            <div
              className="bg-white text-gray-900 rounded-3xl pt-7 sm:pt-9 pb-8 sm:pb-10 px-6 sm:px-8 md:px-9 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
              style={{
                clipPath: isRTL ? folderClipRTL : folderClipLTR,
              }}
            >
              {/* Card Header: Flat Gold Circle Badge + Title */}
              <div className={`flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6 ${isRTL ? "pl-16 sm:pl-20" : "pr-16 sm:pr-20"}`}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#d49b29] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Eye className="w-7 h-7 sm:w-8 sm:h-8 text-black stroke-[2.2]" />
                </div>

                <h3 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                  {t("missionVision.visionTitle")}
                </h3>
              </div>

              {/* Body Description Text */}
              <p className="font-subheading text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed flex-1">
                {t("missionVision.visionDesc")}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
