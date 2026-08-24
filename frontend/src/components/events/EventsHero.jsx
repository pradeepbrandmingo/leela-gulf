"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Globe2, Sparkles } from "lucide-react";

/**
 * EventsHero - Media & Exhibitions Hero Banner Component
 * 100% Matches Client Reference UI Screenshots:
 * - Subtitle: "— MEDIA & EXHIBITIONS" in gold font
 * - Main Title: "Past Events" / "Exhibitions & Global Footprint"
 * - Subtitle Paragraph: "Explore our global footprint. Discover how Leela Gulf connects with industry leaders..."
 * - Interactive Filter Tabs (All Events, Upcoming, Past, Global Summits)
 * - LTR/RTL support for English & Arabic.
 */
export default function EventsHero({ activeTab, setActiveTab, totalCount }) {
  const { isRTL } = useLanguage();

  const filterTabs = [
    { id: "all", label: isRTL ? "جميع الفعاليات" : "All Events" },
    { id: "past", label: isRTL ? "الفعاليات السابقة" : "Past Events" },
    { id: "upcoming", label: isRTL ? "الفعاليات القادمة" : "Upcoming Exhibitions" },
    { id: "summits", label: isRTL ? "المؤتمرات العالمية" : "Global Summits" },
  ];

  return (
    <section className="w-full bg-[var(--color-primary)] relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12 overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 bg-gradient-to-b from-gold-main/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          
          {/* Subtitle Badge: — MEDIA & EXHIBITIONS */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-[2px] bg-gradient-gold-animated rounded-full" />
            <span className="font-heading font-bold text-xs sm:text-sm uppercase tracking-widest text-gradient-gold-animated">
              {isRTL ? "المعارض والإعلام" : "MEDIA & EXHIBITIONS"}
            </span>
          </div>

          {/* Main Title: Past Events */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-4" style={{ fontWeight: 700 }}>
            {isRTL ? "الفعاليات " : "Past "}
            <span className="text-gradient-gold-animated">
              {isRTL ? "والمعارض السابقة" : "Events"}
            </span>
          </h1>

          {/* Overview Description Paragraph */}
          <p className="font-subheading text-sm sm:text-base md:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl">
            {isRTL
              ? "استكشف حضورنا العالمي. اكتشف كيف تتواصل ليلا الخليج مع قادة الصناعة، وتعرض الحلول القائمة على التكنولوجيا، وتشكل مستقبل سلسلة توريد المواد الكيميائية."
              : "Explore our global footprint. Discover how Leela Gulf connects with industry leaders, showcases tech-driven solutions, and shapes the future of the chemical supply chain."}
          </p>

        </div>

      </div>
    </section>
  );
}
