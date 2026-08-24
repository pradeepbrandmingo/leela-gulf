"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Feather, Leaf, Droplet, FlaskConical, Layers, ShieldCheck } from "lucide-react";

/**
 * ProductFeaturesSection - Master Production-Ready Product Features Showcase.
 * 100% Match to Client Reference UI Screenshots (Part 3):
 * - Outer White Container Card (#fcfcfb)
 * - Centered Section Title: "Product Features"
 * - Subtitle: "Engineered for high performance, stability, and sustainability."
 * - Centered Gold Accent Divider Line
 * - Row 1: 3 Grid Cards (01, 02, 03)
 * - Row 2: 2 Centered Cards (04, 05)
 * - Top-left soft gold icon badge + Top-right numeric badge (01, 02, 03, 04, 05)
 * - 100% Dynamic Data Flow (Accepts `featuresData` or `product` prop for backend API)
 * - Full LTR/RTL support for English and Arabic.
 */
export default function ProductFeaturesSection({ product: customProduct }) {
  const { isRTL } = useLanguage();

  // Helper map for dynamic string icon keys from backend
  const getFeatureIcon = (iconName, index) => {
    const iconClass = "w-5 h-5 text-gold-main";
    switch (iconName?.toLowerCase()) {
      case "sparkles":
      case "soap":
      case "surfactant":
        return <Sparkles className={iconClass} />;
      case "feather":
      case "gentle":
      case "skin":
        return <Feather className={iconClass} />;
      case "leaf":
      case "natural":
      case "eco":
        return <Leaf className={iconClass} />;
      case "droplet":
      case "soluble":
      case "water":
        return <Droplet className={iconClass} />;
      case "flask":
      case "flaskconical":
      case "versatile":
        return <FlaskConical className={iconClass} />;
      default:
        // Default fallback icons based on index
        if (index === 0) return <Sparkles className={iconClass} />;
        if (index === 1) return <Feather className={iconClass} />;
        if (index === 2) return <Leaf className={iconClass} />;
        if (index === 3) return <Droplet className={iconClass} />;
        return <FlaskConical className={iconClass} />;
    }
  };

  // Fallback Full Spec Product Features (Matches future Backend API payload)
  const defaultFeaturesData = {
    sectionTitle: isRTL ? "ميزات المنتج" : "Product Features",
    subtitle: isRTL
      ? "مصمم للأداء العالي والأمان والاستدامة البيئية."
      : "Engineered for high performance, stability, and sustainability.",
    features: [
      {
        id: "01",
        number: "01",
        icon: "sparkles",
        title: isRTL ? "خافض للتوتر السطحي فعال" : "Effective Surfactant",
        description: isRTL
          ? "قدرات ممتازة في الرغوة والتنظيف، مصممة عند نقطة سعر شراء تنافسية للغاية."
          : "Excellent foaming and cleansing capabilities, positioned with a highly competitive procurement price point.",
      },
      {
        id: "02",
        number: "02",
        icon: "feather",
        title: isRTL ? "لطيف على البشرة" : "Gentle on Skin",
        description: isRTL
          ? "مصنوع خصيصًا للتطبيقات الحساسة، بما في ذلك العناية العالية بالأطفال والمنتجات الجلدية المتخصصة."
          : "Formulated specifically for sensitive applications, including premium baby care and specialized dermatological products.",
      },
      {
        id: "03",
        number: "03",
        icon: "leaf",
        title: isRTL ? "أصل طبيعي" : "Natural Origin",
        description: isRTL
          ? "مشتق بالكامل من الأحماض الدهنية لزيت جوز الهند، مما يضمن توريد مواد خام مستدامة وصديقة للبيئة."
          : "Derived entirely from coconut oil fatty acids, ensuring sustainable and eco-friendly raw material sourcing.",
      },
      {
        id: "04",
        number: "04",
        icon: "droplet",
        title: isRTL ? "عالي الذوبان" : "Highly Soluble",
        description: isRTL
          ? "مصمم للدمج السلس، مما يجعله سهل التركيب بشكل ملحوظ عبر مصفوفات السوائل والجل المعقدة."
          : "Engineered for seamless integration, making it remarkably easy to formulate across complex liquid and gel matrices.",
      },
      {
        id: "05",
        number: "05",
        icon: "flask",
        title: isRTL ? "استخدام متعدد الأغراض" : "Versatile Use",
        description: isRTL
          ? "عنصر بنيوي أساسي عبر العناية الشخصية، ومستحضرات التجميل، وحلول التنظيف التجارية."
          : "A core structural ingredient across personal care, cosmetics, and commercial-grade cleaning solutions.",
      },
    ],
  };

  const p = customProduct || {};
  const featuresData = p.featuresData || defaultFeaturesData;
  const items = featuresData.features || defaultFeaturesData.features;

  // Exact 5-card layout check (3 top + 2 centered bottom) or standard dynamic grid for N cards
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
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] tracking-tight leading-tight mb-2 sm:mb-2.5" style={{ fontWeight: 700 }}>
              {featuresData.sectionTitle}
            </h2>
            
            <p className="font-subheading text-xs sm:text-sm md:text-base text-gray-500 font-normal leading-relaxed mb-4">
              {featuresData.subtitle}
            </p>
            
            {/* Centered Gold Accent Divider Line */}
            <div className="w-12 sm:w-16 h-1 bg-gradient-gold-animated rounded-full mx-auto" />
          </div>

          {/* 2. Feature Cards Container */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Main Cards Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${isExactFiveCards ? "lg:grid-cols-3" : "lg:grid-cols-3"} gap-3.5 sm:gap-4 lg:gap-5 auto-rows-fr`}>
              {topRowItems.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="group bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 border border-gray-200/90 hover:border-[#c4842f] hover:shadow-lg hover:shadow-[#c4842f]/10 transition-all duration-300 flex flex-col justify-between h-full"
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
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight mb-1.5 break-words group-hover:text-[#9e6316] transition-colors duration-300" style={{ fontWeight: 700 }}>
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

            {/* Bottom Row (For 5-card exact screenshot layout) */}
            {isExactFiveCards && bottomRowItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-3.5 sm:gap-4 lg:gap-5 auto-rows-fr">
                {bottomRowItems.map((item, idx) => {
                  const actualIdx = idx + 3;
                  return (
                    <div
                      key={item.id || actualIdx}
                      className="group bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 border border-gray-200/90 hover:border-[#c4842f] hover:shadow-lg hover:shadow-[#c4842f]/10 transition-all duration-300 flex flex-col justify-between h-full"
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
                        <h3 className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight mb-1.5 break-words group-hover:text-[#9e6316] transition-colors duration-300" style={{ fontWeight: 700 }}>
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
