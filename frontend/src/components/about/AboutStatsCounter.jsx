"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Single Stat Item Counter Component with smooth IntersectionObserver count-up animation.
 */
function StatItem({ targetNumber, suffix, label }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp = null;
          const duration = 2000; // 2 seconds count-up duration

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Ease-out cubic formula for luxury deceleration effect
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easedProgress * targetNumber));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(targetNumber);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) observer.unobserve(itemRef.current);
    };
  }, [targetNumber, hasAnimated]);

  // Format large numbers (e.g. 1300 -> 1,300)
  const formattedCount = count.toLocaleString();

  return (
    <div ref={itemRef} className="flex flex-col items-center justify-center p-3 sm:p-5">
      {/* Clean Light-Weight Gold Number matching Reference UI Spec */}
      <div className="font-heading font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] leading-none text-[#e8b958] mb-2.5 sm:mb-3 tracking-tight">
        {formattedCount}
        {suffix}
      </div>

      {/* Clean White Label matching Reference UI Spec */}
      <div className="font-heading font-medium text-sm sm:text-base md:text-lg lg:text-[1.15rem] text-white/95 tracking-wide leading-snug text-center">
        {label}
      </div>
    </div>
  );
}

/**
 * AboutStatsCounter - Banner Statistics Counter component for About Us page.
 * 100% Exact Match to Client Reference UI Spec:
 * - /images/aboutpage/banneraboutus.png background image clearly visible with medium overlay
 * - Clean rounded-3xl container box
 * - Sleek, lightweight font-medium gold numbers
 * - 4 clean columns (85+ Countries, 800+ TEUs/Quarter, 11 Core Industrial Sectors, 1,300+ Trusted Clients)
 */
export default function AboutStatsCounter() {
  const { t } = useLanguage();

  const stats = [
    {
      targetNumber: 85,
      suffix: "+",
      label: t("aboutStats.stat1Label") || "Countries",
    },
    {
      targetNumber: 800,
      suffix: "+",
      label: t("aboutStats.stat2Label") || "TEUs / Quarter",
    },
    {
      targetNumber: 11,
      suffix: "",
      label: t("aboutStats.stat3Label") || "Core Industrial Sectors",
    },
    {
      targetNumber: 1300,
      suffix: "+",
      label: t("aboutStats.stat4Label") || "Trusted Clients",
    },
  ];

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        
        {/* Banner Box Container matching Reference UI Spec */}
        <div className="relative w-full max-w-[1240px] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
          
          {/* Background Banner Image (/images/aboutpage/banneraboutus.png) */}
          <Image
            src="/images/aboutpage/banneraboutus.png"
            alt="Leela Gulf Global Operations Flags Banner"
            fill
            sizes="(max-width: 1280px) 100vw, 1240px"
            className="object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
            priority={false}
          />

          {/* Medium Overlay so Flag Background Image is Clearly Visible */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] z-10" />

          {/* Stats Items 4-Column Grid */}
          <div className="relative z-20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 p-8 sm:p-12 md:p-16">
            {stats.map((stat, index) => (
              <StatItem
                key={`about-stat-${index}`}
                targetNumber={stat.targetNumber}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
