"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";

/**
 * OurLeaders - Executive Leadership Team section for About Us page.
 * 100% Match to Client Reference UI Spec:
 * 1. Fully responsive on mobile devices with smooth tap/hover card expand.
 * 2. Perfect RTL / LTR Language Switching support using Tailwind logical directional classes (text-start, pe-2).
 * 3. Thin white frame border around photos & LinkedIn icon ONLY.
 */
export default function OurLeaders() {
  const { t, isRTL } = useLanguage();
  const [activeMobileCard, setActiveMobileCard] = useState(null);

  const leaders = [
    {
      id: "ujas",
      name: t("ourLeaders.leader1Name"),
      role: t("ourLeaders.leader1Role"),
      quote: t("ourLeaders.leader1Quote"),
      image: "/images/aboutpage/Ujas.png",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: "abhishek",
      name: t("ourLeaders.leader2Name"),
      role: t("ourLeaders.leader2Role"),
      quote: t("ourLeaders.leader2Quote"),
      image: "/images/aboutpage/Abhishek.png",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: "rajesh",
      name: t("ourLeaders.leader3Name"),
      role: t("ourLeaders.leader3Role"),
      quote: t("ourLeaders.leader3Quote"),
      image: "/images/aboutpage/Rajesh.png",
      linkedin: "https://www.linkedin.com/",
    },
    {
      id: "nishant",
      name: t("ourLeaders.leader4Name"),
      role: t("ourLeaders.leader4Role"),
      quote: t("ourLeaders.leader4Quote"),
      image: "/images/aboutpage/Nishant.png",
      linkedin: "https://www.linkedin.com/",
    },
  ];

  const handleCardClick = (id) => {
    setActiveMobileCard(activeMobileCard === id ? null : id);
  };

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[var(--color-secondary-main)]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Global Unified Section Heading */}
        <SectionHeading
          prefix={t("ourLeaders.titlePrefix")}
          highlight={t("ourLeaders.titleHighlight")}
          className="mb-8 sm:mb-12"
        />

        {/* 4 Leaders Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 max-w-[1360px] mx-auto">
          {leaders.map((leader) => {
            const isActive = activeMobileCard === leader.id;

            return (
              <div
                key={leader.id}
                onClick={() => handleCardClick(leader.id)}
                className="relative bg-white text-gray-900 rounded-3xl p-2 sm:p-2.5 shadow-xl overflow-hidden group border border-gray-100 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(212,155,41,0.2)] h-[370px] sm:h-[380px] flex flex-col cursor-pointer select-none"
              >
                
                {/* ═══════════════════════════════════════════
                    DEFAULT STATE: Full Portrait Photo + Bottom Bar
                    ═══════════════════════════════════════════ */}
                <div className="relative w-full h-[295px] sm:h-[302px] overflow-hidden bg-gray-100 rounded-2xl shrink-0">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    width={400}
                    height={480}
                    unoptimized
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 rounded-2xl"
                  />
                </div>

                {/* Bottom Info Bar (Name, Role & LinkedIn Only) */}
                <div className="pt-2.5 pb-1 px-2 bg-white flex items-center justify-between flex-1">
                  <div className="flex-1 min-w-0 pe-2 text-start">
                    <h3 className="font-heading font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                      {leader.name}
                    </h3>
                    <p className="font-subheading text-[#d49b29] font-medium text-xs line-clamp-1 mt-0.5">
                      {leader.role}
                    </p>
                  </div>

                  {/* LinkedIn Icon ONLY */}
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-lg bg-blue-50 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-colors duration-300 shrink-0"
                    title="LinkedIn Profile"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.47 1.47 0 1 0 1.47 1.47 1.47 1.47 0 0 0-1.47-1.47Z" />
                    </svg>
                  </a>
                </div>

                {/* ═══════════════════════════════════════════
                    HOVER / ACTIVE STATE: Thumbnail + Details + Quote
                    (Smoothly fades & slides up on hover or tap)
                    ═══════════════════════════════════════════ */}
                <div
                  className={`absolute inset-0 bg-white p-4 sm:p-5 flex flex-col justify-start gap-3 transition-all duration-500 z-20 pointer-events-auto rounded-3xl ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto"
                  }`}
                >
                  {/* Top Thumbnail Header */}
                  <div className="flex items-center gap-3.5 pb-3 border-b border-gray-100">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 relative border border-gray-200 shadow-sm">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        width={120}
                        height={120}
                        unoptimized
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-start">
                      <h3 className="font-heading font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                        {leader.name}
                      </h3>
                      <p className="font-subheading text-[#d49b29] font-medium text-xs line-clamp-1 mt-0.5 mb-1.5">
                        {leader.role}
                      </p>

                      {/* LinkedIn Icon ONLY in Hover View */}
                      <a
                        href={leader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs text-[#0077b5] hover:underline font-medium"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.47 1.47 0 1 0 1.47 1.47 1.47 1.47 0 0 0-1.47-1.47Z" />
                        </svg>
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>

                  {/* Quote Message Body WITHOUT Golden Left Line (RTL / LTR Dynamic Alignment) */}
                  <div className="pt-1 text-start">
                    <p className="font-subheading text-gray-700 text-xs sm:text-[0.85rem] leading-relaxed italic">
                      &ldquo;{leader.quote}&rdquo;
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
