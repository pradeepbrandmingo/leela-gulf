"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

/**
 * OurImpact - Luxury Compact Stats Showcase Section
 * ──────────────────────────────────────────────────
 * - "OUR IMPACT" animated gold heading (text-gradient-gold-animated) INSIDE the white card.
 * - 2x2 Grid on Mobile, 4 in a row on Desktop (grid-cols-2 lg:grid-cols-4).
 * - Compact top-to-bottom height with ultra-refined luxury proportions.
 * - Font Awesome CSS Icon Font (NO SVG) via <i> tags.
 * - 100% Global theme tokens, fully responsive with smooth micro-animations.
 */
export default function OurImpact() {
  const { isRTL } = useLanguage();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = isRTL
    ? [
        {
          id: 1,
          iconClass: "fa-solid fa-seedling",
          value: "98%",
          title: "التوريد الأخلاقي",
          subtitle: "من موردين معتمدين",
        },
        {
          id: 2,
          iconClass: "fa-solid fa-users",
          value: "40+",
          title: "شركاء موثوقون",
          subtitle: "مصنّعون حول العالم",
        },
        {
          id: 3,
          iconClass: "fa-solid fa-headset",
          value: "24/7",
          title: "دعم الامتثال",
          subtitle: "دعم مستمر للعمليات",
        },
        {
          id: 4,
          iconClass: "fa-solid fa-globe",
          value: "عالمي",
          title: "التوريد المسؤول",
          subtitle: "التوصيل عبر كافة الدول",
        },
      ]
    : [
        {
          id: 1,
          iconClass: "fa-solid fa-seedling",
          value: "98%",
          title: "Ethical Sourcing",
          subtitle: "From audited suppliers",
        },
        {
          id: 2,
          iconClass: "fa-solid fa-users",
          value: "40+",
          title: "Trusted Partners",
          subtitle: "Worldwide manufacturers",
        },
        {
          id: 3,
          iconClass: "fa-solid fa-headset",
          value: "24/7",
          title: "Compliance Support",
          subtitle: "Always-on support for operations",
        },
        {
          id: 4,
          iconClass: "fa-solid fa-globe",
          value: "Global",
          title: "Responsible Supply",
          subtitle: "Delivering across the world",
        },
      ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--color-primary)] text-white py-6 sm:py-8 md:py-10 overflow-hidden"
    >
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-gold-main/[0.03] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        {/* ── White Stats Card Container ── */}
        <div
          className={`bg-white rounded-2xl sm:rounded-3xl lg:rounded-[26px] shadow-xl border border-gray-100/90 p-4 sm:p-5 md:p-6 lg:p-7 transition-all duration-1000 ease-out hover:shadow-2xl ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {/* ── "OUR IMPACT" Eyebrow INSIDE White Card (Centered Horizontally) ── */}
          <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-center text-center">
            <span className="font-heading font-bold text-[11px] sm:text-xs md:text-[12.5px] tracking-[0.22em] text-gradient-gold-animated uppercase select-none">
              {isRTL ? "تأثيرنا" : "OUR IMPACT"}
            </span>
          </div>

          {/* ── 2x2 Grid on Mobile / 4-Col Grid on Desktop ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              // Divider logic:
              // Mobile 2x2:
              // - Left items (index 0, 2): right border
              // - Top items (index 0, 1): bottom border
              // Desktop 4x1:
              // - Items 0, 1, 2: right border, no bottom border
              const isLeftOnMobile = index % 2 === 0;
              const isTopOnMobile = index < 2;
              const isNotLastOnDesktop = index < 3;

              return (
                <div
                  key={stat.id}
                  className={`relative flex flex-col items-center text-center px-2 sm:px-3 md:px-4 lg:px-5 py-3 sm:py-3.5 lg:py-1.5 transition-all duration-300 group ${
                    isLeftOnMobile
                      ? isRTL
                        ? "border-l border-gray-100 lg:border-l-0"
                        : "border-r border-gray-100"
                      : ""
                  } ${
                    isTopOnMobile
                      ? "border-b border-gray-100 lg:border-b-0"
                      : ""
                  } ${
                    isNotLastOnDesktop
                      ? isRTL
                        ? "lg:border-l lg:border-gray-100 lg:border-r-0"
                        : "lg:border-r lg:border-gray-100"
                      : ""
                  }`}
                >
                  {/* Icon Circle Badge — Font Awesome CSS Icon Font (No SVG) */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-[var(--color-card-dark)] flex items-center justify-center mb-2 sm:mb-2.5 shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:bg-[var(--color-primary)]">
                    <i
                      className={`${stat.iconClass} text-white text-xs sm:text-[13px] md:text-sm transition-colors duration-300 group-hover:text-gold-light`}
                    />
                  </div>

                  {/* Big Stat Value */}
                  <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-[1.85rem] lg:text-[2.1rem] text-[var(--color-card-dark)] leading-tight tracking-tight mb-0.5 sm:mb-1 transition-colors duration-300 group-hover:text-gold-dark">
                    {stat.value}
                  </h3>

                  {/* Stat Title */}
                  <p className="font-heading font-bold text-[11px] sm:text-xs md:text-[13px] lg:text-[13.5px] text-[var(--color-card-dark)] leading-snug mb-0.5">
                    {stat.title}
                  </p>

                  {/* Stat Subtitle */}
                  <p className="font-subheading text-[10px] sm:text-[11px] text-gray-500 leading-tight max-w-[130px] sm:max-w-[160px]">
                    {stat.subtitle}
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

