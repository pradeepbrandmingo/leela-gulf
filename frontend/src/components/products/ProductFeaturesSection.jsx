"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  Sparkles,
  Feather,
  Leaf,
  Droplet,
  FlaskConical,
  ShieldCheck,
  Zap,
  Award,
  Sun,
  Recycle,
  CheckCircle2,
  Heart,
  Flame,
  Gauge,
  Compass
} from "lucide-react";

/**
 * ProductFeaturesSection - Master Production-Ready Product Features Showcase.
 * Strictly uses global design tokens:
 * - Outer White Container Card (#fcfcfb)
 * - Centered Section Title: "Product Features"
 * - Subtitle: "Engineered for high performance, stability, and sustainability."
 * - Centered Gold Accent Divider Line
 * - Top Row: 3 Grid Cards (01, 02, 03)
 * - Bottom Row: 2 Centered Cards (04, 05)
 * - Soft gold icon badge (Left) + Watermark Number (Right, e.g. 01, 02...)
 * - 100% Dynamic data from MongoDB
 */
export default function ProductFeaturesSection({ product: customProduct }) {
  const { isRTL } = useLanguage();

  // Helper map for dynamic string icon keys
  const getFeatureIcon = (iconName, index) => {
    const iconClass = "w-5 h-5 text-gold-main";
    const key = iconName?.toLowerCase() || "";

    if (key.includes("sparkle") || key.includes("foam") || key.includes("active")) return <Sparkles className={iconClass} />;
    if (key.includes("feather") || key.includes("gentle") || key.includes("skin") || key.includes("mild")) return <Feather className={iconClass} />;
    if (key.includes("leaf") || key.includes("natural") || key.includes("bio") || key.includes("plant") || key.includes("eco")) return <Leaf className={iconClass} />;
    if (key.includes("droplet") || key.includes("soluble") || key.includes("water") || key.includes("liquid")) return <Droplet className={iconClass} />;
    if (key.includes("flask") || key.includes("chemical") || key.includes("versatile") || key.includes("lab")) return <FlaskConical className={iconClass} />;
    if (key.includes("shield") || key.includes("safety") || key.includes("protect")) return <ShieldCheck className={iconClass} />;
    if (key.includes("zap") || key.includes("fast") || key.includes("power")) return <Zap className={iconClass} />;
    if (key.includes("award") || key.includes("pure") || key.includes("quality") || key.includes("cert")) return <Award className={iconClass} />;
    if (key.includes("sun") || key.includes("heat") || key.includes("light")) return <Sun className={iconClass} />;
    if (key.includes("recycle") || key.includes("sustain")) return <Recycle className={iconClass} />;
    if (key.includes("heart") || key.includes("safe")) return <Heart className={iconClass} />;
    if (key.includes("flame")) return <Flame className={iconClass} />;
    if (key.includes("gauge")) return <Gauge className={iconClass} />;
    if (key.includes("check")) return <CheckCircle2 className={iconClass} />;

    // Default by position
    if (index === 0) return <Sparkles className={iconClass} />;
    if (index === 1) return <Feather className={iconClass} />;
    if (index === 2) return <Leaf className={iconClass} />;
    if (index === 3) return <Droplet className={iconClass} />;
    return <FlaskConical className={iconClass} />;
  };

  const p = customProduct || {};

  // Extract real database features
  const rawFeatures = Array.isArray(p.featuresData)
    ? p.featuresData
    : Array.isArray(p.features)
    ? p.features
    : p.featuresData?.features || [];

  const items = rawFeatures
    .map((f, idx) => ({
      id: f.id || idx,
      number: String(idx + 1).padStart(2, "0"),
      icon: f.icon || "sparkles",
      title: f.title || "",
      description: f.description || "",
    }))
    .filter((f) => f.title.trim().length > 0);

  // If no features from database, don't render empty section
  if (items.length === 0) {
    return null;
  }

  const sectionTitle = isRTL ? "ميزات المنتج" : "Product Features";
  const subtitle = isRTL
    ? "مصمم للأداء العالي والاستقرار والاستدامة البيئية."
    : "Engineered for high performance, stability, and sustainability.";

  // Exact 5-card layout check (3 top + 2 centered bottom)
  const isExactFiveCards = items.length === 5;
  const topRowItems = isExactFiveCards ? items.slice(0, 3) : items;
  const bottomRowItems = isExactFiveCards ? items.slice(3, 5) : [];

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-8 sm:pb-10 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── MAIN WHITE ROUNDED CONTAINER CARD (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-5 sm:p-7 md:p-9 lg:p-11 shadow-xl border border-gray-200/60 transition-all duration-300">
          
          {/* 1. Centered Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2
              className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] tracking-tight leading-tight mb-2 sm:mb-2.5"
              style={{ fontWeight: 700 }}
            >
              {sectionTitle}
            </h2>
            
            <p className="font-subheading text-xs sm:text-sm md:text-base text-gray-500 font-normal leading-relaxed mb-4">
              {subtitle}
            </p>
            
            {/* Centered Gold Accent Divider Line */}
            <div className="w-12 sm:w-16 h-1 bg-gradient-gold-animated rounded-full mx-auto" />
          </div>

          {/* 2. Feature Cards Container */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Main Cards Grid (Row 1: 3 cards) */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                isExactFiveCards ? "lg:grid-cols-3" : "lg:grid-cols-3"
              } gap-3.5 sm:gap-4 lg:gap-5 auto-rows-fr`}
            >
              {topRowItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="group bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 border border-gray-200/90 hover:border-gold-main hover:shadow-lg hover:shadow-gold-main/10 transition-all duration-300 flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Top Header Row inside Card: Left Icon Badge + Right Number */}
                    <div className="flex items-center justify-between mb-3">
                      {/* Soft Gold Icon Badge */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#fcf8ed] border border-[#f3e7c4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {getFeatureIcon(item.icon, idx)}
                      </div>

                      {/* Number Watermark */}
                      <span className="font-heading font-bold text-xs sm:text-sm text-sky-900/35 tracking-widest">
                        {item.number || String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3
                      className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight mb-1.5 break-words group-hover:text-gold-dark transition-colors duration-300"
                      style={{ fontWeight: 700 }}
                    >
                      {item.title}
                    </h3>

                    {/* Card Description */}
                    <p className="font-subheading text-xs sm:text-xs md:text-[13px] text-gray-600 leading-relaxed font-normal break-words">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row (Row 2: 2 cards centered for 5-card layout) */}
            {isExactFiveCards && bottomRowItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-3.5 sm:gap-4 lg:gap-5 auto-rows-fr">
                {bottomRowItems.map((item, idx) => {
                  const actualIdx = idx + 3;
                  return (
                    <div
                      key={item.id || actualIdx}
                      className="group bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 border border-gray-200/90 hover:border-gold-main hover:shadow-lg hover:shadow-gold-main/10 transition-all duration-300 flex flex-col justify-between h-full"
                    >
                      <div>
                        {/* Top Header Row inside Card: Left Icon Badge + Right Number */}
                        <div className="flex items-center justify-between mb-3">
                          {/* Soft Gold Icon Badge */}
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#fcf8ed] border border-[#f3e7c4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                            {getFeatureIcon(item.icon, actualIdx)}
                          </div>

                          {/* Number Watermark */}
                          <span className="font-heading font-bold text-xs sm:text-sm text-sky-900/35 tracking-widest">
                            {item.number || String(actualIdx + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h3
                          className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight mb-1.5 break-words group-hover:text-gold-dark transition-colors duration-300"
                          style={{ fontWeight: 700 }}
                        >
                          {item.title}
                        </h3>

                        {/* Card Description */}
                        <p className="font-subheading text-xs sm:text-xs md:text-[13px] text-gray-600 leading-relaxed font-normal break-words">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
