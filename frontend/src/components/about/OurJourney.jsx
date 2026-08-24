"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { MapPin, Flag } from "lucide-react";

/**
 * OurJourney - Interactive Winding Roadmap Timeline component for About Us page.
 * 100% Match to Client Reference HTML/CSS/JS & Spec Screenshots:
 * - SVG viewBox (0 0 1000 4800) proportioned to 9 full milestone cards.
 * - Road passes directly behind Step 9 (August 2026, Dubai Expansion) and continues smoothly below.
 * - Zero overlap: Flag banner sits on top of pole (-top-16) floating above cards.
 * - Real-time scroll-synced gold progress line using site's global theme palette.
 * - Full LTR/RTL support for English and Arabic.
 */
export default function OurJourney() {
  const { t, isRTL } = useLanguage();
  const wrapperRef = useRef(null);
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(5500);
  const [strokeDashoffset, setStrokeDashoffset] = useState(5500);
  const [activeCardId, setActiveCardId] = useState(null);

  const steps = [
    {
      id: "2016",
      stepNum: t("ourJourney.s1Tag"),
      year: t("ourJourney.s1Year"),
      prefixTitle: t("ourJourney.s1TitlePrefix"),
      highlightTitle: t("ourJourney.s1TitleHighlight"),
      desc: t("ourJourney.s1Desc"),
      location: t("ourJourney.s1Loc"),
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      align: "left",
    },
    {
      id: "2018",
      stepNum: t("ourJourney.s2Tag"),
      year: t("ourJourney.s2Year"),
      prefixTitle: t("ourJourney.s2TitlePrefix"),
      highlightTitle: t("ourJourney.s2TitleHighlight"),
      desc: t("ourJourney.s2Desc"),
      location: t("ourJourney.s2Loc"),
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800",
      align: "right",
    },
    {
      id: "2019",
      stepNum: t("ourJourney.s3Tag"),
      year: t("ourJourney.s3Year"),
      prefixTitle: t("ourJourney.s3TitlePrefix"),
      highlightTitle: t("ourJourney.s3TitleHighlight"),
      desc: t("ourJourney.s3Desc"),
      location: t("ourJourney.s3Loc"),
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
      align: "left",
    },
    {
      id: "2020",
      stepNum: t("ourJourney.s4Tag"),
      year: t("ourJourney.s4Year"),
      prefixTitle: t("ourJourney.s4TitlePrefix"),
      highlightTitle: t("ourJourney.s4TitleHighlight"),
      desc: t("ourJourney.s4Desc"),
      location: t("ourJourney.s4Loc"),
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
      align: "right",
    },
    {
      id: "2023",
      stepNum: t("ourJourney.s5Tag"),
      year: t("ourJourney.s5Year"),
      prefixTitle: t("ourJourney.s5TitlePrefix"),
      highlightTitle: t("ourJourney.s5TitleHighlight"),
      desc: t("ourJourney.s5Desc"),
      location: t("ourJourney.s5Loc"),
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
      align: "left",
    },
    {
      id: "2024",
      stepNum: t("ourJourney.s6Tag"),
      year: t("ourJourney.s6Year"),
      prefixTitle: t("ourJourney.s6TitlePrefix"),
      highlightTitle: t("ourJourney.s6TitleHighlight"),
      desc: t("ourJourney.s6Desc"),
      location: t("ourJourney.s6Loc"),
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      align: "right",
    },
    {
      id: "2025",
      stepNum: t("ourJourney.s7Tag"),
      year: t("ourJourney.s7Year"),
      prefixTitle: t("ourJourney.s7TitlePrefix"),
      highlightTitle: t("ourJourney.s7TitleHighlight"),
      desc: t("ourJourney.s7Desc"),
      location: t("ourJourney.s7Loc"),
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
      align: "left",
    },
    {
      id: "2026",
      stepNum: t("ourJourney.s8Tag"),
      year: t("ourJourney.s8Year"),
      prefixTitle: t("ourJourney.s8TitlePrefix"),
      highlightTitle: t("ourJourney.s8TitleHighlight"),
      desc: t("ourJourney.s8Desc"),
      location: t("ourJourney.s8Loc"),
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
      align: "right",
    },
    {
      id: "aug2026",
      stepNum: t("ourJourney.s9Tag"),
      year: t("ourJourney.s9Year"),
      prefixTitle: t("ourJourney.s9TitlePrefix"),
      highlightTitle: t("ourJourney.s9TitleHighlight"),
      desc: t("ourJourney.s9Desc"),
      location: t("ourJourney.s9Loc"),
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
      align: "left",
    },
  ];

  // Measure SVG path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      setStrokeDashoffset(len);
    }
  }, []);

  // Synchronize gold path progress 100% in real-time with card scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current || !pathLength) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start gold line when container top reaches 70% of screen height, end when container bottom leaves screen
      const startPoint = windowHeight * 0.7;
      let progress = (startPoint - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));

      const offset = pathLength * (1 - progress);
      setStrokeDashoffset(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathLength]);

  const handleCardClick = (id) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  // SVG Path definition curving all the way through Step 9 and ending smoothly below
  const roadPathD = "M 180 180 C 650 240, 820 540, 820 700 C 820 860, 180 1060, 180 1220 C 180 1380, 820 1580, 820 1740 C 820 1900, 180 2100, 180 2260 C 180 2420, 820 2620, 820 2780 C 820 2940, 180 3140, 180 3300 C 180 3460, 820 3660, 820 3820 C 820 3980, 500 4200, 200 4350 C 180 4450, 180 4550, 180 4650";

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-12 sm:py-16 md:py-20 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
        
        {/* Full Client Heading as One Cohesive Block */}
        <div className="text-center mb-14 sm:mb-20 max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            <span className="text-white">{t("ourJourney.titleLine1")}</span>{" "}
            <span className="text-[var(--color-secondary-light)]">{t("ourJourney.titleHighlight")}</span>
          </h2>
          <p className="font-heading text-lg sm:text-xl md:text-2xl text-gray-300 mt-3 leading-relaxed tracking-tight">
            {t("ourJourney.titleLine2")}
          </p>
        </div>

        {/* ═══════════════════════════════════════════
            MAIN ROADMAP PATH WRAPPER
            ═══════════════════════════════════════════ */}
        <div ref={wrapperRef} className="relative max-w-[1100px] mx-auto py-10" dir="ltr">
          
          {/* Underlay SVG Winding Road Canvas (Desktop & Tablet) */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block z-0"
            viewBox="0 0 1000 4800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#12151e" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#1a1e2b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0e1017" stopOpacity="0.8" />
              </linearGradient>

              {/* Exact Site Global Theme Secondary Gold Color Gradient */}
              <linearGradient id="goldDashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f7d27e" />
                <stop offset="50%" stopColor="#c4842f" />
                <stop offset="100%" stopColor="#9e6417" />
              </linearGradient>
            </defs>

            {/* Base Background Track */}
            <path
              d={roadPathD}
              fill="none"
              stroke="url(#roadGradient)"
              strokeWidth="90"
              strokeLinecap="round"
            />

            {/* Center Lane Marker */}
            <path
              d={roadPathD}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="4"
              strokeDasharray="12, 12"
            />

            {/* Scroll-Revealed Global Theme Gold Active Progress Line */}
            <path
              ref={pathRef}
              d={roadPathD}
              fill="none"
              stroke="url(#goldDashGradient)"
              strokeWidth="6"
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-150 ease-out filter drop-shadow-[0_0_14px_rgba(196,132,47,0.85)]"
            />
          </svg>

          {/* Milestone Steps Container */}
          <div className="relative z-10 flex flex-col gap-16 sm:gap-24 md:gap-32">
            {steps.map((item) => {
              // Layout is always LTR (dir="ltr" on wrapper) so SVG road and card positions stay aligned
              const isLeft = item.align === "left";
              const isActive = activeCardId === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex items-center relative w-full ${
                    isLeft ? "md:justify-start md:pl-6" : "md:justify-end md:pr-6"
                  } justify-center`}
                >
                  {/* Flag Marker Pin (Positioned cleanly ON TOP of pole to eliminate card overlap) */}
                  <div
                    className={`hidden md:flex flex-col items-center absolute -top-16 ${
                      isLeft ? "left-[170px]" : "right-[170px]"
                    } z-20 pointer-events-none`}
                  >
                    <div className="bg-[#1d1d1d] border border-[#c4842f]/40 backdrop-blur-md px-3 py-1 rounded flex items-center gap-1.5 text-[0.7rem] font-bold text-[var(--color-secondary-light)] tracking-wider shadow-2xl mb-1">
                      <Flag className="w-3.5 h-3.5 text-gold-light" />
                      <span>{item.stepNum}</span>
                    </div>
                    <div className="w-[3px] h-10 bg-gradient-to-b from-[#c4842f] to-transparent rounded-full" />
                  </div>

                  {/* ═══════════════════════════════════════════
                      MILESTONE HOVER-REVEAL STEP CARD
                      ═══════════════════════════════════════════ */}
                  <div
                    onClick={() => handleCardClick(item.id)}
                    dir={isRTL ? "rtl" : "ltr"}
                    className="w-full max-w-[460px] bg-[#1d1d1d] border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:bg-[#222222] hover:border-[#c4842f]/50 hover:shadow-[0_15px_30px_rgba(196,132,47,0.15)] group cursor-pointer select-none"
                  >
                    {/* Header Bar */}
                    <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 px-5 sm:px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-2.5">
                        {/* Mobile Step Badge */}
                        <span className="md:hidden inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#c4842f]/15 border border-[#c4842f]/30 text-[0.68rem] font-bold text-gold-light tracking-wider uppercase">
                          {item.stepNum}
                        </span>
                        <span className="font-heading font-extrabold text-xl sm:text-2xl text-[var(--color-secondary-accent)] tracking-tight">
                          {item.year}
                        </span>
                      </div>

                      <span className="text-[0.68rem] uppercase font-bold tracking-widest text-[var(--color-secondary-light)] opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
                        {t("ourJourney.hoverHint")}
                      </span>
                    </div>

                    {/* Hidden Image Reveal Container (Reveals smoothly on hover or mobile tap) */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isActive
                          ? "max-h-[220px] opacity-100"
                          : "max-h-0 opacity-0 group-hover:max-h-[220px] group-hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.year}
                        width={800}
                        height={400}
                        unoptimized
                        className="w-full h-[200px] object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                      />
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 sm:p-6 text-start">
                      <h3 className="font-heading font-medium text-lg sm:text-xl text-white mb-2 leading-snug">
                        <span>{item.prefixTitle} </span>
                        <span className="font-bold text-[var(--color-secondary-light)]">{item.highlightTitle}</span>
                      </h3>

                      <p className="font-subheading text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                        {item.desc}
                      </p>

                      <div className="flex items-center gap-2 pt-3 border-t border-white/10 text-xs font-bold text-[var(--color-secondary-light)] tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-secondary-light)] shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
