"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export const FOOD_COLORS_CATEGORIES = [
  {
    id: "01",
    num: "01",
    title: "Supra Colors",
    arTitle: "ألوان سوبرا (Supra Colors)",
    desc: "Highly concentrated, water-soluble synthetic colors. Designed to dissolve seamlessly into aqueous liquids, Supra colors deliver intense, clear, and vibrant hues. Ideal for beverages, clear gels, and baked goods where high tinctorial strength is required.",
    arDesc: "ألوان اصطناعية عالية التركيز وقابلة للذوبان في الماء. مصممة للذوبان بسلاسة في السوائل المائية، لتقديم درجات ألوان زاهية وواضحة ومثالية للمشروبات والحلويات والمخبوزات التي تتطلب قوة تلوين فائقة.",
  },
  {
    id: "02",
    num: "02",
    title: "Lake Colors",
    arTitle: "ألوان ليك (Lake Colors)",
    desc: "Aluminum salts of water-soluble dyes, offering superior dispersion and opacity. Because they are oil-dispersible rather than water-soluble, Lake colors are the perfect solution for fat-based systems, tablet coatings, cosmetics, and dry powder mixes.",
    arDesc: "أملاح الألومنيوم للأصباغ القابلة للذوبان في الماء، وتوفر تشتتاً وتغطية بصرية فائقة. ونظراً لقابليتها للتشتت في الزيوت والدهون، تعد ألوان ليك الحل المثالي للأنظمة الزيتية، وتغليف الأقراص الدوائية، ومستحضرات التجميل، والخلطات الجافة.",
  },
  {
    id: "03",
    num: "03",
    title: "Blended Colors",
    arTitle: "الألوان الممزوجة (Blended Colors)",
    desc: "Custom-formulated shades crafted to exact specifications. By precisely mixing primary colors, we create unique, stable secondary and tertiary shades (like Egg Yellow or Raspberry Red), ensuring perfect batch-to-batch consistency for your brand's signature identity.",
    arDesc: "تدرجات ألوان مخصصة ومصنعة وفق أدق المواصفات. من خلال مزج الألوان الأساسية بدقة، نبتكر درجات ألوان ثانوية وثلاثية فريدة ومستقرة (مثل الأصفر البيضي أو التوت البري)، مما يضمن اتساقاً مثالياً ومستقراً لكل دفعة إنتاج.",
  },
];

export default function FoodColorsOverviewSection() {
  const { isRTL } = useLanguage();
  const [activeCard, setActiveCard] = useState("01");

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      {/* Subtle Ambient Gold Glow in Background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-gold-main/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">

          {/* ═══════════════════════════════════════════
              LEFT COLUMN: Category Overview & Narrative
              ═══════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Clean Category Overview Text (No border, No icon) */}
            <span className="text-gold-main font-heading font-bold text-xs sm:text-[13px] tracking-[0.22em] uppercase block mb-3.5">
              {isRTL ? "نظرة عامة على الفئات" : "CATEGORY OVERVIEW"}
            </span>

            {/* Standard Global Section Heading */}
            <h2 className="font-heading font-medium text-[24px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-white tracking-tight leading-tight mb-5 sm:mb-6">
              {isRTL ? (
                <>
                  <span className="font-heading text-white font-medium not-italic block mb-1">
                    فن وعلم
                  </span>
                  <span className="font-heading text-gradient-gold-animated font-semibold not-italic block">
                    ملونات الأغذية
                  </span>
                </>
              ) : (
                <>
                  <span className="font-heading text-white font-medium not-italic block mb-1">
                    The Art & Science of
                  </span>
                  <span className="font-heading text-gradient-gold-animated font-semibold not-italic block">
                    Food Colors
                  </span>
                </>
              )}
            </h2>

            {/* Narrative Paragraphs */}
            <div className="space-y-3.5 text-xs sm:text-sm font-subheading text-gray-300 leading-relaxed">
              <p>
                {isRTL ? (
                  <>
                    يعد الجاذبية البصرية عنصراً أساسياً في قطاعات الأغذية والمشروبات والصناعات الدوائية. تم تصميم مجموعتنا الشاملة من ملونات الأغذية عالية النقاوة لتقديم{" "}
                    <strong className="text-white font-semibold">
                      ثبات لوني متسق، واستقرار استثنائي، وأعلى معايير السلامة المعتمدة.
                    </strong>
                  </>
                ) : (
                  <>
                    Visual appeal is paramount in the food, beverage, and pharmaceutical industries. Our comprehensive portfolio of high-purity food colors is engineered to deliver{" "}
                    <strong className="text-white font-semibold">
                      vibrant consistency, excellent stability, and uncompromised safety.
                    </strong>
                  </>
                )}
              </p>

              <p className="text-gray-400">
                {isRTL
                  ? "سواء كنت تقوم بتركيب مشروبات نقية، أو حلويات تعتمد على الدهون، أو تغليفات دوائية دقيقة، فإننا نوفر الدرجة اللونية والشكل الدقيق المطلوب لإبراز هوية منتجك بأفضل صورة ممكنة."
                  : "Whether you are formulating clear beverages, fat-based confectionery, or precise pharmaceutical coatings, we provide the exact shade and format required to bring your product to life."}
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              RIGHT COLUMN: Compact & Sleek Category Cards
              ═══════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4">
            {FOOD_COLORS_CATEGORIES.map((cat) => {
              const isActive = activeCard === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => setActiveCard(cat.id)}
                  className={`p-4 sm:p-5 md:p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-card-dark)] border-l-2 border-l-gold-main border-y border-r border-gold-main/30 shadow-lg shadow-black/50"
                      : "bg-[#0e1017] border border-[#202432] hover:border-gold-main/20 hover:bg-[#12151e]"
                  }`}
                >
                  {/* Header: Number + Title */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-mono font-bold text-sm sm:text-base text-gold-main shrink-0">
                      {cat.num}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white tracking-tight">
                      {isRTL ? cat.arTitle : cat.title}
                    </h3>
                  </div>

                  {/* Description Paragraph */}
                  <p className="font-subheading text-xs sm:text-[13px] text-gray-400 leading-relaxed">
                    {isRTL ? cat.arDesc : cat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
