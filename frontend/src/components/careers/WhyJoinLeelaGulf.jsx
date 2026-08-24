"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Users, Compass, RefreshCw, Zap, Trophy, Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── 6 Master Core Values Dataset ──
const CORE_VALUES = [
  {
    num: "01",
    title: "Customer First",
    titleAr: "العميل أولاً",
    icon: Users,
  },
  {
    num: "02",
    title: "Be Curious",
    titleAr: "كن شغوفاً بالاستكشاف",
    icon: Compass,
  },
  {
    num: "03",
    title: "Be Persistent Yet Flexible",
    titleAr: "إصرار مع مرونة",
    icon: RefreshCw,
  },
  {
    num: "04",
    title: "Just Do It",
    titleAr: "انجح في التنفيذ",
    icon: Zap,
  },
  {
    num: "05",
    title: "We Win Together, We Learn Together",
    titleAr: "نفوز معاً ونتعلم معاً",
    icon: Trophy,
  },
  {
    num: "06",
    title: "Think Like An Entrepreneur",
    titleAr: "فكر كرواد الأعمال",
    icon: Lightbulb,
  },
];

export default function WhyJoinLeelaGulf() {
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

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[var(--color-primary)] py-10 sm:py-16 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ═══════════════════════════════════════════
            HEADER SECTION (2-Line Heading Left + Quote Right)
            Matches Reference Screenshot 100%
            ═══════════════════════════════════════════ */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center mb-10 sm:mb-14 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* LEFT 6 COLS: Badge + 2-Line Title + Subtitle */}
          <div className="lg:col-span-6">
            {/* Small Gold Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 sm:w-6 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
              <span className="font-heading font-bold text-[10px] sm:text-xs tracking-[0.2em] text-gold-light uppercase">
                {isRTL ? "قيمنا الجوهرية" : "CAREERS"}
              </span>
            </div>

            {/* Main Title (Exact 2-Line Format matching Reference SS #2) */}
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-3 tracking-tight leading-[1.15]">
              {isRTL ? (
                <>
                  <span className="block">لماذا تنضم إلى</span>
                  <span className="block text-gradient-gold-animated">ليلا جلف</span>
                </>
              ) : (
                <>
                  <span className="block">Why Join</span>
                  <span className="block text-gradient-gold-animated">Leela Gulf</span>
                </>
              )}
            </h2>

            {/* Subtitle */}
            <p className="font-subheading text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              {isRTL
                ? "نحن لسنا مجرد شركة؛ نحن المحفز لنموك المهني ونجاحك الشخصي."
                : "We're not just a company; we're a catalyst for your professional growth and personal success."}
            </p>
          </div>

          {/* RIGHT 6 COLS: Quote Block with Gold Vertical Accent Border */}
          <div className="lg:col-span-6 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gold-main pl-5 sm:pl-6 rtl:pr-5 rtl:pr-6">
            <p className="font-subheading text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed italic">
              {isRTL
                ? "قيمنا الأساسية هي نجمة الشمال الخاصة بنا. إنها تجمعنا معاً في مسار مشترك لتحقيق النجاح للمؤسسة وحياتك المهنية، وتضيء الطريق إلى الأمام وتوجهنا نحو التميز في كل ما نفعل."
                : "Our Core Values are our North Star. They bring us together on a common path to drive success for the organization and your career, illuminating the path forward and steering us toward excellence in everything we do. These principles define, inspire, and unite us."}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            6 CORE VALUES GRID (3 Cols x 2 Rows)
            Matches Reference Screenshot 100%
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CORE_VALUES.map((val, idx) => {
            const IconComponent = val.icon;
            return (
              <div
                key={val.num}
                className={`group relative bg-[#11131a] rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-gold-main/50 transition-all duration-500 shadow-xl hover:-translate-y-1.5 overflow-hidden cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${150 + idx * 80}ms` }}
              >
                {/* Background Large Number Watermark */}
                <span className="absolute bottom-3 right-4 rtl:left-4 rtl:right-auto font-heading font-extrabold text-5xl sm:text-6xl text-white/5 group-hover:text-gold-main/15 transition-colors duration-500 select-none pointer-events-none">
                  {val.num}
                </span>

                {/* Solid Gold Animated Icon Badge */}
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-gold-animated flex items-center justify-center text-black mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <IconComponent className="w-6 h-6 text-black stroke-[2.2]" />
                </div>

                {/* Value Title */}
                <h3 className="font-heading font-bold text-base sm:text-lg lg:text-xl text-white group-hover:text-gold-light transition-colors duration-300 leading-snug pr-8">
                  {isRTL ? val.titleAr : val.title}
                </h3>

                {/* Gold Underline Dash (BY DEFAULT VISIBLE under Title as requested) */}
                <div className="w-8 h-[2.5px] bg-gradient-gold-animated rounded-full mt-2.5 transition-all duration-300" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
