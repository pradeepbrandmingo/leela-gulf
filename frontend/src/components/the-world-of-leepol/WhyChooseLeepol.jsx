"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WHY CHOOSE LEEPOL DATA — 5 Pillars of Leepol Advantage
 * ═══════════════════════════════════════════════════════════════════════
 */
const ADVANTAGE_CARDS = [
  {
    number: "01.",
    title: "Product of India",
    arTitle: "صناعة هندية بمعايير عالمية",
    desc: "Locally manufactured with uncompromising global quality standards, ensuring reliability and accessibility.",
    arDesc: "تصنيع محلي بمعايير جودة دولية صارمة لا تقبل المساومة، مما يضمن الموثوقية العالية وسهولة وسرعة التوريد.",
  },
  {
    number: "02.",
    title: "ISO Certified",
    arTitle: "شهادات الآيزو المعتمدة",
    desc: "ISO 9001:2015 & ISO 14001:2015 certified, guaranteeing consistent quality and environmentally responsible manufacturing.",
    arDesc: "معتمدون بشهادتي ISO 9001:2015 و ISO 14001:2015، مما يضمن ثبات الجودة والتصنيع المسؤول بيئياً.",
  },
  {
    number: "03.",
    title: "Diverse Portfolio",
    arTitle: "محفظة منتجات شاملة ومتنوعة",
    desc: "A comprehensive range seamlessly spanning across the pharmaceuticals, cosmetics, and personal care industries.",
    arDesc: "مجموعة متكاملة وواسعة تغطي بسلاسة متطلبات الصناعات الدوائية ومستحضرات التجميل والعناية الشخصية.",
  },
  {
    number: "04.",
    title: "Application-Specific Grades",
    arTitle: "درجات مخصصة لكل تطبيق صناعي",
    desc: "Tailored formulations explicitly engineered for your specific thickening, coating, and solubilizing needs.",
    arDesc: "تركيبات مبتكرة ومصممة هندسياً بدقة لتلبية احتياجاتكم المحددة في التثخين، وتغليف الأقراص، وزيادة الذوبان.",
  },
  {
    number: "05.",
    title: "Safer Formulations",
    arTitle: "تركيبات أكثر أماناً ونقاءً",
    desc: "Dedicated to patient and consumer safety with guaranteed benzene-free and nontoxic product options.",
    arDesc: "ملتزمون بسلامة المرضى والمستهلكين مع توفير خيارات نقية مضمونة خالية تماماً من البنزين وغير سامة.",
  },
];

/**
 * ═══════════════════════════════════════════════════════════════════════
 * COMPONENT — WhyChooseLeepol
 * - Strict adherence to global colors (--color-primary, --color-card-dark, gold-main)
 * - 3 top + 2 centered bottom layout on desktop/laptop matching reference screenshot
 * - Fully responsive (mobile, tablet, desktop)
 * - Bilingual RTL/LTR support via useLanguage hook
 * ═══════════════════════════════════════════════════════════════════════
 */
export default function WhyChooseLeepol() {
  const { isRTL } = useLanguage();

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      {/* Subtle Ambient Gold Glow in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] sm:h-[450px] bg-gold-main/[0.03] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        {/* ────────────────────────────────────────────
            SECTION HEADING & KICKER
            ──────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-gold-main mb-2 sm:mb-3">
            {isRTL ? "ميزة ليبول التنافسية" : "THE LEEPOL ADVANTAGE"}
          </p>
          <h2 className="font-heading font-medium text-[24px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-white tracking-tight leading-tight">
            {isRTL ? (
              <>
                <span className="font-heading text-white font-medium not-italic inline mr-2 rtl:mr-0 rtl:ml-2">
                  لماذا تختار
                </span>
                <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                  ليبول؟
                </span>
              </>
            ) : (
              <>
                <span className="font-heading text-white font-medium not-italic inline mr-2">
                  Why Choose
                </span>
                <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                  Leepol?
                </span>
              </>
            )}
          </h2>
        </div>

        {/* ────────────────────────────────────────────
            5 CARDS GRID (3 Top, 2 Centered Bottom)
            ──────────────────────────────────────────── */}
        <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
          {ADVANTAGE_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 bg-[var(--color-card-dark)] border border-white/[0.08] hover:border-gold-main/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(214,185,42,0.12)] flex flex-col justify-start overflow-hidden text-left rtl:text-right"
            >
              {/* Top running gold accent border highlight on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-main to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Inner ambient glow on hover */}
              <div className="absolute -top-16 -right-16 rtl:-right-auto rtl:-left-16 w-36 h-36 bg-gold-main/[0.06] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Card Number */}
              <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gold-main/30 group-hover:text-gold-main/60 transition-colors duration-300 select-none">
                {card.number}
              </span>

              {/* Card Title */}
              <h3 className="font-heading font-semibold text-lg sm:text-xl text-white group-hover:text-gold-light transition-colors duration-200 mt-4 sm:mt-5 mb-2.5">
                {isRTL ? card.arTitle : card.title}
              </h3>

              {/* Card Description */}
              <p className="font-subheading text-sm sm:text-[15px] leading-relaxed text-white/60 group-hover:text-white/80 transition-colors duration-200">
                {isRTL ? card.arDesc : card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
