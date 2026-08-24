"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import SectionHeading from "@/components/common/SectionHeading";
import {
  Factory,
  Droplets,
  Sparkles,
  Pill,
  UtensilsCrossed,
  Pickaxe,
  Flame,
  Shirt,
  Package,
  Sprout,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   11 MASTER INDUSTRIES — From Client Master Spec Sheet
   ═══════════════════════════════════════════════════════════════════════ */
const INDUSTRIES_DATA = [
  {
    id: "industrial-chemicals",
    title: "Industrial Chemicals",
    titleAr: "الكيماويات الصناعية",
    slug: "industrial-chemicals",
    icon: Factory,
  },
  {
    id: "water-treatment",
    title: "Water Treatment",
    titleAr: "معالجة المياه",
    slug: "water-treatment",
    icon: Droplets,
  },
  {
    id: "home-personal-care",
    title: "Home Care & Personal Care (LEEPOL®)",
    titleAr: "العناية بالمنزل والعناية الشخصية (LEEPOL®)",
    slug: "home-personal-care",
    icon: Sparkles,
  },
  {
    id: "pharma-apis",
    title: "Pharmaceuticals API & Excipients",
    titleAr: "المكونات الصيدلانية الفعالة والمواد المساعدة",
    slug: "pharma-apis",
    icon: Pill,
  },
  {
    id: "food-beverage",
    title: "Food & Beverage Chemicals",
    titleAr: "كيماويات الأغذية والمشروبات",
    slug: "food-beverage",
    icon: UtensilsCrossed,
  },
  {
    id: "mining-metals",
    title: "Mining & Metals",
    titleAr: "التعدين والمعادن",
    slug: "mining-metals",
    icon: Pickaxe,
  },
  {
    id: "oil-gas",
    title: "Oil & Gas",
    titleAr: "النفط والغاز",
    slug: "oil-gas",
    icon: Flame,
  },
  {
    id: "textile-chemicals",
    title: "Textile Chemicals",
    titleAr: "كيماويات المنسوجات",
    slug: "textile-chemicals",
    icon: Shirt,
  },
  {
    id: "packaging-paper",
    title: "Packaging & Paper Pulp Industries",
    titleAr: "صناعات التعبئة والتغليف ولب الورق",
    slug: "packaging-paper",
    icon: Package,
  },
  {
    id: "fertilizers",
    title: "Fertilizers Chemicals",
    titleAr: "كيماويات الأسمدة",
    slug: "fertilizers",
    icon: Sprout,
  },
  {
    id: "case-coatings",
    title: "CASE – Coatings, Adhesives, Sealants & Elastomers",
    titleAr: "الطلاء والمواد اللاصقة والمواد العازلة",
    slug: "case-coatings",
    icon: Layers,
  },
];

export default function IndustryExpertiseSlider() {
  const { isRTL } = useLanguage();
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position for arrow disabled states
  const checkScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    if (isRTL) {
      const maxScroll = scrollWidth - clientWidth;
      const absScroll = Math.abs(scrollLeft);
      setCanScrollLeft(absScroll < maxScroll - 5);
      setCanScrollRight(absScroll > 5);
    } else {
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, [isRTL]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Handle Prev / Next Button Clicks
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 320;
    const factor = direction === "next" ? (isRTL ? -1 : 1) : isRTL ? 1 : -1;
    sliderRef.current.scrollBy({ left: scrollAmount * factor, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-[var(--color-primary)] pt-4 sm:pt-6 pb-12 sm:pb-14 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ── SECTION HEADER ── */}
        <div className="text-center">
          <span className="font-heading font-bold text-[10px] sm:text-xs tracking-[0.25em] text-[var(--color-white)] uppercase block mb-1">
            {isRTL ? "تصفح حسب" : "BROWSE BY"}
          </span>
          <SectionHeading
            prefix={isRTL ? "خبرتنا في" : "Our Industry"}
            highlight={isRTL ? "القطاعات الصناعية" : "Expertise"}
            className="mb-5 sm:mb-6"
          />
        </div>

        {/* ── SLIDER OUTER CARD WRAPPER ── */}
        <div className="relative group/slider px-2 sm:px-0">

          {/* Floating Left Arrow Button */}
          <button
            onClick={() => scroll(isRTL ? "next" : "prev")}
            disabled={isRTL ? !canScrollRight : !canScrollLeft}
            className="absolute left-[-6px] sm:left-[-16px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-gold-animated text-black shadow-xl shadow-black/50 flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
            aria-label="Previous Industry"
          >
            <ChevronLeft className={`w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5] ${isRTL ? "rotate-180" : ""}`} />
          </button>

          {/* Floating Right Arrow Button */}
          <button
            onClick={() => scroll(isRTL ? "prev" : "next")}
            disabled={isRTL ? !canScrollLeft : !canScrollRight}
            className="absolute right-[-6px] sm:right-[-16px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-gold-animated text-black shadow-xl shadow-black/50 flex items-center justify-center hover:scale-110 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
            aria-label="Next Industry"
          >
            <ChevronRight className={`w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5] ${isRTL ? "rotate-180" : ""}`} />
          </button>

          {/* White Rounded Container Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 p-1 sm:p-3 overflow-hidden">

            {/* Scrollable Track */}
            <div
              ref={sliderRef}
              className="flex items-stretch overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory py-1 sm:py-2"
            >
              {INDUSTRIES_DATA.map((industry, index) => {
                const IconComponent = industry.icon;
                return (
                  <div
                    key={industry.id}
                    className="shrink-0 w-[125px] xs:w-[145px] sm:w-[160px] md:w-[175px] lg:w-[calc(100%/6)] snap-start flex flex-col items-center justify-center p-2.5 xs:p-3 sm:p-3.5 md:p-4 text-center group cursor-pointer relative after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-[65%] after:w-[1px] after:bg-[#e2e8f0] last:after:hidden hover:bg-[#faf7f2] transition-colors duration-300 rounded-xl sm:rounded-2xl"
                  >
                    <Link href={`/industries/${industry.slug}`} className="w-full flex flex-col items-center justify-center">
                      {/* Clean Gold Line Icon */}
                      <div className="mb-2 sm:mb-3 flex items-center justify-center">
                        <IconComponent className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 text-gold-main group-hover:text-gold-dark group-hover:scale-110 transition-all duration-300 stroke-[1.5]" />
                      </div>

                      {/* Industry Title */}
                      <h3 className="font-heading font-bold text-[10px] xs:text-[11px] sm:text-[13px] md:text-sm text-[#1a1a1a] group-hover:text-gold-main leading-snug transition-colors duration-300 min-h-[28px] xs:min-h-[32px] sm:min-h-[36px] flex items-center justify-center text-center px-0.5" style={{ fontWeight: 700 }}>
                        {isRTL ? industry.titleAr : industry.title}
                      </h3>
                    </Link>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
