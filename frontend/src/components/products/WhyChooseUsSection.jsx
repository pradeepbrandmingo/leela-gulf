"use client";

import { useLanguage } from "@/context/LanguageContext";

/**
 * WhyChooseUsSection - Premium Why Choose Us feature section matching exact client design.
 * Features:
 * - Luxury white/off-white rounded outer card container on dark theme background.
 * - Header with vertical gold accent line indicator.
 * - Left Side (Card 01): High-impact dark featured card with watermarked giant '01' background number & inner dark glass content box.
 * - Right Side (Cards 02, 03, 04): 3 clean stacked white cards with gold numbers & Raleway body typography.
 * - Fully responsive for mobile, tablet, and desktop with complete RTL (Arabic) support.
 */
export default function WhyChooseUsSection() {
  const { isRTL } = useLanguage();

  const featuresData = [
    {
      num: "01",
      title: isRTL ? "نقاوة رائدة في الصناعة" : "Industry-Leading Purity",
      desc: isRTL
        ? "نوفر مواد كيميائية ومكونات صيدلانية عالية النقاوة مصنعة وفق أعلى معايير الجودة العالمية ومعتمدة بشهادات التحليل والقياس."
        : "High-purity chemical raw materials, APIs, and excipients sourced from certified global manufacturing partners with guaranteed quality assurance.",
    },
    {
      num: "02",
      title: isRTL ? "شبكة لوجستية عالمية" : "Global Logistics Network",
      desc: isRTL
        ? "سلسلة توريد متكاملة ومراكز توزيع استراتيجية في دولة الإمارات تضمن تسليم المنتجات بسرعة وسلاسة عبر جميع دول الخليج والأسواق العالمية."
        : "Seamless end-to-end supply chain management and strategic warehousing in UAE ensuring fast, reliable distribution across GCC & international markets.",
    },
    {
      num: "03",
      title: isRTL ? "مصادر مستدامة ومعتمدة" : "Certified Sustainable Sourcing",
      desc: isRTL
        ? "التزام تام بالمعايير البيئية الدولية والامتثال التنظيمي لتوفير حلول كيميائية صديقة للبيئة وآمنة للصناعات الحديثة."
        : "Uncompromising commitment to international environmental standards and regulatory compliance for sustainable chemical solutions.",
    },
    {
      num: "04",
      title: isRTL ? "دعم فني وتخصصي متواصل" : "Dedicated Technical Support",
      desc: isRTL
        ? "فريق متمرس من الخبراء التقنيين لتقديم الاستشارات الفنية، والتخصيص الدقيق للتركيبات، والمساعدة الكاملة في اختيار المنتجات."
        : "Experienced team of technical specialists providing expert consultation, custom formulation assistance, and dedicated client service.",
    },
  ];

  const featuredItem = featuresData[0];
  const stackedItems = featuresData.slice(1);

  return (
    <section className="w-full bg-[var(--color-primary)] py-5 sm:py-7 md:py-8 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        
        {/* ── MAIN WHITE ROUNDED CONTAINER CARD ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 lg:p-7 shadow-xl border border-gray-200/60 transition-all duration-300">
          
          {/* ── TOP SECTION HEADING (Gold Accent Line + Title) ── */}
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-4.5 md:mb-5">
            <span className="w-1.5 h-5 sm:h-6 bg-gradient-gold-animated rounded-full shrink-0" />
            <h2 className="font-heading font-bold text-lg sm:text-2xl md:text-3xl text-[#1a1a1a] tracking-tight leading-none" style={{ fontWeight: 700 }}>
              {isRTL ? "لماذا تختارنا" : "Why Choose Us"}
            </h2>
          </div>

          {/* ── GRID CONTAINER: LEFT FEATURED CARD (01) + RIGHT STACK CARDS (02, 03, 04) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4.5 lg:gap-5 items-stretch">
            
            {/* ═════════════════════════════════════════════════════════════════
                LEFT SIDE: DARK FEATURED CARD (01) - COMPACT WIDTH & HEIGHT
                ═════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 bg-[var(--color-primary)] rounded-xl sm:rounded-2xl lg:rounded-3xl pt-10 xs:pt-12 sm:pt-4 p-3 sm:p-4.5 lg:p-5 relative overflow-hidden flex flex-col justify-end min-h-[220px] sm:min-h-[280px] md:min-h-[310px] lg:min-h-[330px] shadow-xl border border-gray-800/80 group">
              
              {/* Giant Watermarked Background Number "01" (Restored Georgia Serif Warm Dark Gold Tint) */}
              <span 
                className="absolute -top-1 right-2 rtl:left-2 rtl:right-auto font-serif font-bold text-[100px] sm:text-[140px] md:text-[165px] lg:text-[185px] text-[#221c15] sm:text-[#1f1a14] leading-none select-none pointer-events-none group-hover:text-[#2d271e] transition-colors duration-500 z-0"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {featuredItem.num}
              </span>

              {/* Decorative Subtle Gold Ambient Glow */}
              <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#c4842f]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Inner Floating Dark Glass Card */}
              <div className="relative z-10 bg-[var(--color-card-dark)] border border-[#c4842f]/35 rounded-xl lg:rounded-2xl p-3.5 sm:p-4.5 md:p-5 shadow-2xl transition-all duration-300 group-hover:border-[#e8b958]/70">
                {/* Horizontal Gold Line Accent */}
                <div className="w-7 sm:w-8 h-[3px] bg-gradient-gold-animated rounded-full mb-2 sm:mb-2.5" />
                
                {/* Title */}
                <h3 className="font-heading font-bold text-base sm:text-xl md:text-2xl text-white mb-1.5 sm:mb-2 leading-snug" style={{ fontWeight: 700 }}>
                  {featuredItem.title}
                </h3>
                
                {/* Description */}
                <p className="font-subheading text-xs sm:text-[13px] md:text-sm text-gray-300 leading-relaxed font-normal">
                  {featuredItem.desc}
                </p>
              </div>

            </div>

            {/* ═════════════════════════════════════════════════════════════════
                RIGHT SIDE: 3 STACKED WHITE CARDS (02, 03, 04)
                ═════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-2.5 sm:gap-3">
              {stackedItems.map((item) => (
                <div
                  key={item.num}
                  className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3.5 sm:p-4 lg:p-4.5 shadow-sm hover:shadow-lg hover:border-gray-200/90 transition-all duration-300 flex items-start gap-3 sm:gap-4 flex-1 group"
                >
                  {/* Gold Number (02, 03, 04) */}
                  <span className="font-heading font-bold text-sm sm:text-lg md:text-xl text-gold-main shrink-0 mt-0.5" style={{ fontWeight: 700 }}>
                    {item.num}
                  </span>

                  {/* Content */}
                  <div>
                    <h3 className="font-heading font-bold text-xs sm:text-base md:text-lg text-[#1a1a1a] mb-0.5 sm:mb-1 leading-snug group-hover:text-gold-main transition-colors duration-200" style={{ fontWeight: 700 }}>
                      {item.title}
                    </h3>
                    <p className="font-subheading text-[11.5px] sm:text-xs md:text-[13px] text-gray-500 leading-normal sm:leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
