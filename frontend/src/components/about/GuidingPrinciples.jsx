"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

/**
 * GuidingPrinciples - Our Guiding Principles section component for About Us page.
 * 100% Exact Match to Client Reference UI Spec:
 * - Left column: Direct /images/aboutpage/Guiding.png image with /images/aboutpage/Ellipse.png image centered inside notch curvature.
 * - Right column: "Our Guiding Principles" title + 5 compact, sleek principle points cards.
 * - Standardized global section vertical spacing (py-10 sm:py-14 md:py-16).
 */
export default function GuidingPrinciples() {
  const { t } = useLanguage();

  const principles = [
    {
      title: t("guidingPrinciples.p1Title"),
      desc: t("guidingPrinciples.p1Desc"),
    },
    {
      title: t("guidingPrinciples.p2Title"),
      desc: t("guidingPrinciples.p2Desc"),
    },
    {
      title: t("guidingPrinciples.p3Title"),
      desc: t("guidingPrinciples.p3Desc"),
    },
    {
      title: t("guidingPrinciples.p4Title"),
      desc: t("guidingPrinciples.p4Desc"),
    },
    {
      title: t("guidingPrinciples.p5Title"),
      desc: t("guidingPrinciples.p5Desc"),
    },
  ];

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[var(--color-secondary-main)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-[1320px] mx-auto">
          {/* ═══════════════════════════════════════════
              LEFT COLUMN: Guiding.png Image + Ellipse.png Gold Circle
              (100% Match to Reference Screenshot)
              ═══════════════════════════════════════════ */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-[500px]">
              {/* Direct Guiding.png Image (No Outer Border Box) */}
              <Image
                src="/images/aboutpage/Guiding.png"
                alt="Leela Gulf Guiding Principles Team"
                width={650}
                height={550}
                className="w-full h-auto object-contain"
                priority={false}
              />

              {/* Exact Ellipse.png Image centered 100% vertically & horizontally inside notch curvature on the right side */}
              <div className="absolute top-[54.5%] -translate-y-1/2 right-[-18px] sm:right-[-24px] z-10 flex items-center justify-center">
                <Image
                  src="/images/aboutpage/Ellipse.png"
                  alt="Gold Circle Accent"
                  width={70}
                  height={70}
                  className="w-11 h-11 sm:w-14 sm:h-14 md:w-[58px] md:h-[58px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              RIGHT COLUMN: Heading + 5 Compact Principles Cards List
              ═══════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Section Title */}
            <h2 className="font-heading font-medium text-[26px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-white tracking-tight leading-tight mb-5 text-left">
              <span
                className="font-heading text-white font-medium not-italic mr-2 inline"
                style={{
                  fontFamily: "var(--font-family-heading)",
                  fontStyle: "normal",
                }}
              >
                {t("guidingPrinciples.titlePrefix")}
              </span>
              <span
                className="font-heading text-gradient-gold-animated font-semibold not-italic inline"
                style={{
                  fontFamily: "var(--font-family-heading)",
                  fontStyle: "normal",
                }}
              >
                {t("guidingPrinciples.titleHighlight")}
              </span>
            </h2>

            {/* 5 Compact Principles Cards */}
            <div className="space-y-2.5 sm:space-y-3">
              {principles.map((item, index) => (
                <div
                  key={`principle-${index}`}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 sm:py-3.5 sm:px-5 transition-all duration-300 hover:bg-white/10 hover:border-[#d49b29]/50 hover:-translate-y-0.5 group"
                >
                  <h3 className="font-heading font-bold text-sm sm:text-base text-[#e8b958] mb-1 tracking-tight group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="font-subheading text-gray-300 text-xs sm:text-sm leading-normal sm:leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
