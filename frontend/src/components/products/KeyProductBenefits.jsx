"use client";

import { useLanguage } from "@/context/LanguageContext";

/**
 * KeyProductBenefits - High-impact 6-card feature grid component matching exact client reference UI.
 * Features:
 * - Dark luxury container card with centered section header ("FORMULATION ADVANTAGES" + "Key Product Benefits").
 * - 3-column responsive grid (6 benefit cards) with watermarked background numbers (01-06).
 * - Enforces global typography (Modulus Pro for headings, Raleway for body copy) & gold theme tokens.
 * - Fully responsive across mobile, tablet, and desktop with full RTL (Arabic) support.
 */
export default function KeyProductBenefits() {
  const { isRTL } = useLanguage();

  const benefitsData = [
    {
      num: "01",
      title: isRTL ? "نعومة فائقة واستثناء" : "Exceptional Mildness",
      desc: isRTL
        ? "يقلل بشكل كبير من احتمالية تهيج البشرة الناتج عن الخافضات السطحية، مما يجعله المعيار الصناعي للعناية بالبشرة الحساسة ومنتجات الأطفال."
        : "Dramatically reduces the irritation potential of primary anionic surfactants, making it the industry standard for sensitive skin and premium baby care formulations.",
    },
    {
      num: "02",
      title: isRTL ? "تعزيز الرغوة المتفوق" : "Superior Foam Boosting",
      desc: isRTL
        ? "ينتج رغوة غنية ومستقرة وفخمة عبر مستويات حموضة مختلفة، مما يعزز تجربة المستهلك الحسية في غسول الجسم ومنظفات الوجه."
        : "Generates a rich, stable, and luxurious lather across varying pH levels, enhancing the tactile consumer experience in body washes and facial cleansers.",
    },
    {
      num: "03",
      title: isRTL ? "بناء اللزوجة المثالي" : "Viscosity Building",
      desc: isRTL
        ? "يعمل كعامل تثخين عالي الفاعلية عند دمجه مع كلوريد الصوديوم، مما يقلل الحاجة لمعدلات اللزوجة الاصطناعية المكلفة في سلسلة التوريد."
        : "Acts as a highly effective thickening agent when combined with sodium chloride, reducing the need for expensive synthetic rheology modifiers in your supply chain.",
    },
    {
      num: "04",
      title: isRTL ? "تحمل المياه العسرة" : "Hard Water Tolerance",
      desc: isRTL
        ? "يحافظ على سلامة التنظيف والرغوة الممتازة حتى في بيئات المياه العسرة ذات المعادن العالية، مما يضمن أداءً متسقاً للمنتج عالمياً."
        : "Maintains excellent cleansing and foaming integrity even in high-mineral hard water environments, ensuring consistent product performance globally.",
    },
    {
      num: "05",
      title: isRTL ? "توافقية عالية واستقرار" : "High Compatibility",
      desc: isRTL
        ? "يتميز بملف شحنة محايد يسمح بالتكامل السلس مع أنظمة الخافضات السطحية الأنيونية والكاتيونية وغير الأيونية دون انفصال."
        : "Exhibits a net-neutral charge profile, allowing seamless integration with anionic, cationic, and non-ionic surfactant systems without separation.",
    },
    {
      num: "06",
      title: isRTL ? "قابلة للتحلل الحيوي" : "Biodegradability",
      desc: isRTL
        ? "مشتق من أحماض زيت النخيل وجوز الهند الطبيعية، مما يوفر خياراً صديقاً للبيئة وقابلاً للتحلل الحيوي يتوافق مع معايير التجميل النظيف الحديثة."
        : "Derived from natural coconut oil fatty acids, offering an eco-friendly, highly biodegradable profile that aligns with modern 'clean beauty' standards.",
    },
  ];

  return (
    <section className="w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        
        {/* ── CENTERED SECTION HEADER ── */}

            {/* ── CENTERED SECTION HEADER ── */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 relative z-10">
              <span className="font-heading font-bold text-[10px] sm:text-xs tracking-[0.25em] text-gold-main uppercase block mb-2">
                {isRTL ? "مزايا التركيبة" : "FORMULATION ADVANTAGES"}
              </span>
              <h2 className="font-heading font-bold text-xl sm:text-3xl md:text-4xl lg:text-[2.4rem] text-white tracking-tight leading-tight" style={{ fontWeight: 700 }}>
                {isRTL ? "فوائد المنتج الرئيسية" : "Key Product Benefits"}
              </h2>
            </div>

            {/* ── 3-COLUMN CARDS GRID WITH STAGGERED OFFSET (MATCHING CLIENT REF UI SCREENSHOT 1) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch relative z-10 py-2">
              {benefitsData.map((item, index) => {
                // Stagger middle column (Cards 02 & 05) downwards slightly on desktop as seen in reference UI
                const isMiddleColumn = index === 1 || index === 4;
                
                return (
                  <div
                    key={item.num}
                    className={`bg-[#12141c] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 relative overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-500 hover:border-[#c4842f]/60 hover:bg-[#171a26] hover:-translate-y-2 group cursor-pointer ${
                      isMiddleColumn ? "lg:translate-y-5" : ""
                    }`}
                  >
                    {/* Giant Watermarked Background Number (01 - 06) - Dark Subtle Watermark Inside Card */}
                    <span 
                      className="absolute bottom-[-16px] right-[-8px] rtl:left-[-8px] rtl:right-auto font-heading font-black text-[90px] sm:text-[110px] text-white/[0.05] group-hover:text-[#c4842f]/20 leading-none select-none pointer-events-none transition-colors duration-500 z-0"
                    >
                      {item.num}
                    </span>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      {/* Top Number Tag */}
                      <span className="font-heading font-bold text-xs text-gold-main tracking-wider uppercase mb-4 block" style={{ fontWeight: 700 }}>
                        {item.num}
                      </span>

                      <div>
                        {/* Benefit Title */}
                        <h3 className="font-heading font-bold text-base sm:text-lg md:text-xl text-white mb-2.5 leading-snug group-hover:text-gold-accent transition-colors duration-200" style={{ fontWeight: 700 }}>
                          {item.title}
                        </h3>

                        {/* Benefit Description */}
                        <p className="font-subheading text-xs sm:text-[13px] md:text-sm text-gray-400 leading-relaxed font-normal">
                          {item.desc}
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
