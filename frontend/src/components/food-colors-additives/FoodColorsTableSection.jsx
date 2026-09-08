"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export const FOOD_COLORS_TABLE_DATA = [
  {
    supra: {
      name: "TARTRAZINE",
      arName: "تارترازين (أصفر)",
      color: "#FACC15",
      gradient: "linear-gradient(135deg, #FEF08A, #EAB308)",
    },
    lake: {
      name: "LAKE TARTRAZINE",
      arName: "ليك تارترازين",
      color: "#EAB308",
      gradient: "linear-gradient(135deg, #FDE047, #CA8A04)",
    },
    blended: {
      name: "EGG YELLOW",
      arName: "أصفر بيضي",
      color: "#F59E0B",
      gradient: "linear-gradient(135deg, #FCD34D, #D97706)",
    },
  },
  {
    supra: {
      name: "ALLURA RED",
      arName: "ألورا ريد (أحمر)",
      color: "#EF4444",
      gradient: "linear-gradient(135deg, #FCA5A5, #DC2626)",
    },
    lake: {
      name: "LAKE ALLURA RED",
      arName: "ليك ألورا ريد",
      color: "#DC2626",
      gradient: "linear-gradient(135deg, #F87171, #B91C1C)",
    },
    blended: {
      name: "BLACK CTB",
      arName: "أسود CTB",
      color: "#374151",
      gradient: "linear-gradient(135deg, #4B5563, #1F2937)",
    },
  },
  {
    supra: {
      name: "SUNSET YELLOW",
      arName: "أصفر غروب الشمس",
      color: "#F97316",
      gradient: "linear-gradient(135deg, #FDBA74, #EA580C)",
    },
    lake: {
      name: "LAKE SUNSET YELLOW",
      arName: "ليك أصفر غروب الشمس",
      color: "#EA580C",
      gradient: "linear-gradient(135deg, #FB923C, #C2410C)",
    },
    blended: {
      name: "BLACK NCTB",
      arName: "أسود NCTB",
      color: "#1F2937",
      gradient: "linear-gradient(135deg, #374151, #111827)",
    },
  },
  {
    supra: {
      name: "CARMOISINE",
      arName: "كارموزين (أحمر قرمزي)",
      color: "#BE185D",
      gradient: "linear-gradient(135deg, #F472B6, #9D174D)",
    },
    lake: {
      name: "LAKE CARMOISINE",
      arName: "ليك كارموزين",
      color: "#9D174D",
      gradient: "linear-gradient(135deg, #EC4899, #831843)",
    },
    blended: {
      name: "BLACK 1011",
      arName: "أسود 1011",
      color: "#18181B",
      gradient: "linear-gradient(135deg, #27272A, #09090B)",
    },
  },
  {
    supra: {
      name: "PONCEAU - 4R",
      arName: "بونسو 4R (أحمر ساطع)",
      color: "#E11D48",
      gradient: "linear-gradient(135deg, #FB7185, #BE123C)",
    },
    lake: {
      name: "LAKE PONCEAU - 4R",
      arName: "ليك بونسو 4R",
      color: "#BE123C",
      gradient: "linear-gradient(135deg, #F43F5E, #9F1239)",
    },
    blended: {
      name: "KESARI B",
      arName: "كيساري B (زعفراني)",
      color: "#D97706",
      gradient: "linear-gradient(135deg, #FBBF24, #B45309)",
    },
  },
  {
    supra: {
      name: "SUNSET YELLOW",
      arName: "أصفر غروب الشمس",
      color: "#F97316",
      gradient: "linear-gradient(135deg, #FDBA74, #EA580C)",
    },
    lake: {
      name: "LAKE SUNSET YELLOW",
      arName: "ليك أصفر غروب الشمس",
      color: "#EA580C",
      gradient: "linear-gradient(135deg, #FB923C, #C2410C)",
    },
    blended: {
      name: "APPLE GREEN",
      arName: "أخضر تفاحي",
      color: "#65A30D",
      gradient: "linear-gradient(135deg, #A3E635, #4D7C0F)",
    },
  },
  {
    supra: {
      name: "BRILLIANT BLUE FCF",
      arName: "أزرق لامع FCF",
      color: "#0284C7",
      gradient: "linear-gradient(135deg, #38BDF8, #0369A1)",
    },
    lake: {
      name: "LAKE BRILLIANT BLUE FCF",
      arName: "ليك أزرق لامع FCF",
      color: "#0369A1",
      gradient: "linear-gradient(135deg, #0EA5E9, #075985)",
    },
    blended: {
      name: "PEA GREEN",
      arName: "أخضر بازلائي",
      color: "#84CC16",
      gradient: "linear-gradient(135deg, #BEF264, #65A30D)",
    },
  },
  {
    supra: {
      name: "INDIGO CARMINE",
      arName: "كارمين نيلي (أزرق داكن)",
      color: "#312E81",
      gradient: "linear-gradient(135deg, #6366F1, #1E1B4B)",
    },
    lake: {
      name: "LAKE INDIGO CARMINE",
      arName: "ليك كارمين نيلي",
      color: "#1E1B4B",
      gradient: "linear-gradient(135deg, #4338CA, #0F172A)",
    },
    blended: {
      name: "RASPBERRY RED",
      arName: "أحمر توت العليق",
      color: "#C026D3",
      gradient: "linear-gradient(135deg, #E879F9, #86198F)",
    },
  },
  {
    supra: {
      name: "CHOCOLATE BROWN",
      arName: "بني شوكولاتة",
      color: "#78350F",
      gradient: "linear-gradient(135deg, #92400E, #451A03)",
    },
    lake: {
      name: "LAKE CHOCOLATE",
      arName: "ليك شوكولاتة",
      color: "#572C15",
      gradient: "linear-gradient(135deg, #78350F, #381A08)",
    },
    blended: {
      name: "STRAWBERRY RED",
      arName: "أحمر فراولة",
      color: "#E11D48",
      gradient: "linear-gradient(135deg, #FB7185, #9F1239)",
    },
  },
  {
    supra: {
      name: "QUINOLINE YELLOW",
      arName: "أصفر كينولين",
      color: "#EAB308",
      gradient: "linear-gradient(135deg, #FEF08A, #CA8A04)",
    },
    lake: {
      name: "LAKE QUINOLINE YELLOW",
      arName: "ليك أصفر كينولين",
      color: "#CA8A04",
      gradient: "linear-gradient(135deg, #FDE047, #A16207)",
    },
    blended: {
      name: "CHOCOLATE BROWN",
      arName: "بني شوكولاتة",
      color: "#78350F",
      gradient: "linear-gradient(135deg, #92400E, #451A03)",
    },
  },
];

export default function FoodColorsTableSection() {
  const { isRTL } = useLanguage();
  const [activeMobileTab, setActiveMobileTab] = useState("all");

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-gold-main/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* ═══════════════════════════════════════════
            SECTION HEADER
            ═══════════════════════════════════════════ */}
        <div className="mb-6 sm:mb-8">
          <h2 className="font-heading font-medium text-[24px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-white tracking-tight leading-tight">
            {isRTL ? (
              <>
                <span className="font-heading text-white font-medium not-italic inline mr-2 rtl:mr-0 rtl:ml-2">
                  ملونات
                </span>
                <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                  الأغذية
                </span>
              </>
            ) : (
              <>
                <span className="font-heading text-white font-medium not-italic inline mr-2">
                  Food
                </span>
                <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                  Colors
                </span>
              </>
            )}
          </h2>
          {/* Gold Accent Underline */}
          <div className="w-12 sm:w-16 h-[2.5px] bg-gradient-gold-animated rounded-full mt-2" />
        </div>

        {/* ═══════════════════════════════════════════
            MAIN TABLE CONTAINER (Luxury Dark Theme Card)
            ═══════════════════════════════════════════ */}
        <div className="bg-[var(--color-card-dark)]/95 backdrop-blur-md border border-gold-main/30 hover:border-gold-main/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">

          {/* DESKTOP TABLE VIEW (>=768px) */}
          <div className="hidden md:block overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left rtl:text-right border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-[#252834] bg-[#14161f]/90">
                  <th className="py-4 px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light w-1/3">
                    {isRTL ? "ألوان سوبرا (SUPRA)" : "SUPRA"}
                  </th>
                  <th className="py-4 px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light w-1/3">
                    {isRTL ? "ألوان ليك (LAKE COLORS)" : "LAKE COLORS"}
                  </th>
                  <th className="py-4 px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light w-1/3">
                    {isRTL ? "الألوان الممزوجة (BLENDED)" : "BLENDED"}
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#1e212c] font-heading font-semibold text-xs lg:text-sm">
                {FOOD_COLORS_TABLE_DATA.map((row, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-[#151822]/80 transition-colors duration-150"
                  >
                    {/* 1. SUPRA */}
                    <td className="py-3.5 px-6">
                      {row.supra ? (
                        <div className="flex items-center gap-3.5">
                          {/* Rectangular Box Swatch */}
                          <span
                            className="w-10 h-6 sm:w-11 sm:h-6.5 rounded-sm shrink-0 shadow-md ring-1 ring-white/20 group-hover:scale-105 group-hover:ring-white/40 transition-all duration-200"
                            style={{
                              background: row.supra.gradient || row.supra.color,
                            }}
                          />
                          <span className="text-white group-hover:text-gold-light transition-colors tracking-wide text-xs sm:text-[13.5px] font-heading font-semibold">
                            {isRTL ? row.supra.arName : row.supra.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-600 font-mono text-xs">—</span>
                      )}
                    </td>

                    {/* 2. LAKE COLORS */}
                    <td className="py-3.5 px-6">
                      {row.lake ? (
                        <div className="flex items-center gap-3.5">
                          {/* Rectangular Box Swatch */}
                          <span
                            className="w-10 h-6 sm:w-11 sm:h-6.5 rounded-sm shrink-0 shadow-md ring-1 ring-white/20 group-hover:scale-105 group-hover:ring-white/40 transition-all duration-200"
                            style={{
                              background: row.lake.gradient || row.lake.color,
                            }}
                          />
                          <span className="text-white group-hover:text-gold-light transition-colors tracking-wide text-xs sm:text-[13.5px] font-heading font-semibold">
                            {isRTL ? row.lake.arName : row.lake.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-600 font-mono text-xs">—</span>
                      )}
                    </td>

                    {/* 3. BLENDED */}
                    <td className="py-3.5 px-6">
                      {row.blended ? (
                        <div className="flex items-center gap-3.5">
                          {/* Rectangular Box Swatch */}
                          <span
                            className="w-10 h-6 sm:w-11 sm:h-6.5 rounded-sm shrink-0 shadow-md ring-1 ring-white/20 group-hover:scale-105 group-hover:ring-white/40 transition-all duration-200"
                            style={{
                              background: row.blended.gradient || row.blended.color,
                            }}
                          />
                          <span className="text-white group-hover:text-gold-light transition-colors tracking-wide text-xs sm:text-[13.5px] font-heading font-semibold">
                            {isRTL ? row.blended.arName : row.blended.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-600 font-mono text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW (<768px): Segmented Tabs & High-Density Card List */}
          <div className="block md:hidden p-4 space-y-4">
            {/* Mobile Category Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#14161f] border border-[#232736]">
              {[
                { id: "all", label: isRTL ? "الكل" : "All" },
                { id: "supra", label: isRTL ? "سوبرا" : "Supra" },
                { id: "lake", label: isRTL ? "ليك" : "Lake" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMobileTab(tab.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-heading font-bold transition-all text-center ${
                    activeMobileTab === tab.id
                      ? "bg-gradient-gold-animated text-black shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile Cards List */}
            <div className="divide-y divide-[#1e212c]">
              {FOOD_COLORS_TABLE_DATA.map((row, idx) => (
                <div key={idx} className="py-3 space-y-2.5">
                  {(activeMobileTab === "all" || activeMobileTab === "supra") && row.supra && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-9 h-5.5 rounded-sm shrink-0 shadow-md ring-1 ring-white/20"
                          style={{ background: row.supra.gradient || row.supra.color }}
                        />
                        <span className="font-heading font-bold text-xs sm:text-sm text-white">
                          {isRTL ? row.supra.arName : row.supra.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gold-light bg-[#161822] px-2 py-0.5 rounded border border-[#262b3a]">
                        SUPRA
                      </span>
                    </div>
                  )}

                  {(activeMobileTab === "all" || activeMobileTab === "lake") && row.lake && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-9 h-5.5 rounded-sm shrink-0 shadow-md ring-1 ring-white/20"
                          style={{ background: row.lake.gradient || row.lake.color }}
                        />
                        <span className="font-heading font-bold text-xs sm:text-sm text-white">
                          {isRTL ? row.lake.arName : row.lake.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gold-light bg-[#161822] px-2 py-0.5 rounded border border-[#262b3a]">
                        LAKE
                      </span>
                    </div>
                  )}

                  {(activeMobileTab === "all") && row.blended && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-9 h-5.5 rounded-sm shrink-0 shadow-md ring-1 ring-white/20"
                          style={{ background: row.blended.gradient || row.blended.color }}
                        />
                        <span className="font-heading font-bold text-xs sm:text-sm text-white">
                          {isRTL ? row.blended.arName : row.blended.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-gold-light bg-[#161822] px-2 py-0.5 rounded border border-[#262b3a]">
                        BLENDED
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Table Bottom Footer Bar */}
          <div className="py-3 px-5 sm:px-6 bg-[#12141c] border-t border-[#252834] flex items-center justify-between text-xs font-subheading text-gray-400">
            <span>
              {isRTL ? "إجمالي درجات الألوان المعتمدة:" : "Total food color shades:"}{" "}
              <strong className="text-gold-light font-heading font-bold">
                {FOOD_COLORS_TABLE_DATA.length * 3} Standard Shades
              </strong>
            </span>
            <span className="hidden sm:inline text-gray-500">
              {isRTL ? "مطابق لمواصفات US-FDA و EU و FSSAI" : "US-FDA, EU & FSSAI Compliant"}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
