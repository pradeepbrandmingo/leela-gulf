"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const FOOD_ADDITIVES_DATA = [
  {
    name: "MAIZE STARCH",
    arName: "نشا الذرة",
    spec: "(Technical / Food / Pharma)",
    arSpec: "(تقني / غذائي / دوائي)",
  },
  {
    name: "SODIUM BICARBONATE",
    arName: "بيكربونات الصوديوم",
    spec: null,
    arSpec: null,
  },
  {
    name: "LIQUID GLUCOSE",
    arName: "الجلوكوز السائل",
    spec: null,
    arSpec: null,
  },
  {
    name: "DEXTROSE MONOHYDRATE",
    arName: "دكستروز أحادي الهيدرات",
    spec: null,
    arSpec: null,
  },
  {
    name: "SORBITOL",
    arName: "سوربيتول",
    spec: null,
    arSpec: null,
  },
  {
    name: "TAPIOCA STARCH",
    arName: "نشا التابيوكا",
    spec: null,
    arSpec: null,
  },
  {
    name: "TALC",
    arName: "التلك",
    spec: null,
    arSpec: null,
  },
  {
    name: "BORIC ACID",
    arName: "حمض البوريك",
    spec: null,
    arSpec: null,
  },
  {
    name: "BENZOIC ACID",
    arName: "حمض البنزويك",
    spec: null,
    arSpec: null,
  },
  {
    name: "CALCIUM CARBONATE",
    arName: "كربونات الكالسيوم",
    spec: "(Heavy / Light / PPT / Oyster)",
    arSpec: "(ثقيل / خفيف / مرسب / محاري)",
  },
  {
    name: "DICALCIUM PHOSPHATE",
    arName: "فوسفات ثنائي الكالسيوم",
    spec: "(Food / Pharma / Feed)",
    arSpec: "(غذائي / دوائي / علفي)",
  },
  {
    name: "ACID THICKENER",
    arName: "مثخن الأحماض (Acid Thickener)",
    spec: null,
    arSpec: null,
  },
];

export default function FoodAdditivesSection() {
  const { isRTL } = useLanguage();

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[550px] h-[350px] bg-gold-main/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* ═══════════════════════════════════════════
            SECTION HEADER
            ═══════════════════════════════════════════ */}
        <div className="mb-6 sm:mb-8">
          <h2 className="font-heading font-medium text-[24px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-white tracking-tight leading-tight">
            {isRTL ? (
              <>
                <span className="font-heading text-white font-medium not-italic inline mr-2 rtl:mr-0 rtl:ml-2">
                  مضافات وسواغات
                </span>
                <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                  الأغذية
                </span>
              </>
            ) : (
              <>
                <span className="font-heading text-white font-medium not-italic inline mr-2">
                  Food Additives &
                </span>
                <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                  Excipients
                </span>
              </>
            )}
          </h2>
          {/* Gold Accent Underline */}
          <div className="w-12 sm:w-16 h-[2.5px] bg-gradient-gold-animated rounded-full mt-2" />
        </div>

        {/* ═══════════════════════════════════════════
            3-COLUMN HIGH-DENSITY COMPACT CARD GRID
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-3.5">
          {FOOD_ADDITIVES_DATA.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex items-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#0e1017] border border-[#202434] hover:border-gold-main/40 hover:bg-[#131622] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/50 cursor-pointer min-h-[56px] sm:min-h-[62px]"
            >
              {/* Glowing Gold Accent Bullet */}
              <span className="w-2 h-2 rounded-[2px] bg-gradient-gold-animated shrink-0 shadow-[0_0_8px_rgba(214,185,42,0.5)] group-hover:scale-125 transition-transform duration-300" />

              {/* Title & Specification Text */}
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <h3 className="font-heading font-bold text-xs sm:text-[13.5px] text-white group-hover:text-gold-light transition-colors tracking-wide leading-snug">
                  {isRTL ? item.arName : item.name}
                </h3>

                {/* Sub-specifications if available */}
                {(item.spec || item.arSpec) && (
                  <span className="text-[10.5px] sm:text-[11px] text-gray-400 font-subheading mt-0.5 leading-none">
                    {isRTL ? item.arSpec : item.spec}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
