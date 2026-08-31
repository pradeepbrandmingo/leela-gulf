"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FileText, ArrowRight } from "lucide-react";

/**
 * ProductAboutSection - Master Production-Ready Product Details About & Supply Section.
 * Strictly uses global design tokens:
 * - Outer White Container Card (#fcfcfb)
 * - Heading: "About [Product Title]"
 * - Detailed Overview Paragraph
 * - 4 Key Technical Cards (2x2 Grid) with bg-gold-main bullet dots
 * - Bottom Light Beige Highlight Card: "Why Choose Leela Gulf as a Trusted Supplier?" (#f7f3eb)
 * - CTA Button inside card: "Request Quote" with FileText icon & ArrowRight
 */
export default function ProductAboutSection({ product: customProduct, onQuoteRequest }) {
  const { isRTL } = useLanguage();

  const p = customProduct || {};
  const about = p.aboutData || {};
  const productTitle = p.title || "Product";

  const overviewText = about.overview || p.description || "";
  const card1Title = about.card1Title || (isRTL ? "عملية التصنيع" : "Manufacturing Process");
  const card1Content = about.manufacturingProcess || "";
  const card2Title = about.card2Title || (isRTL ? "التعبئة والتغليف والخدمات اللوجستية" : "Packaging & Logistics");
  const card2Content = about.packagingLogistics || "";
  const card3Title = about.card3Title || (isRTL ? "السلامة والتعامل" : "Safety & Handling");
  const card3Content = about.safetyHandling || "";
  const card4Title = about.card4Title || (isRTL ? "التسعير بالجملة والمشتريات" : "Bulk Pricing & Procurement");
  const card4Content = about.bulkPricing || "";

  const whyChooseTitle = about.whyChooseTitle || (isRTL ? "لماذا تختار ليلا الخليج كمورد موثوق؟" : "Why Choose Leela Gulf as a Trusted Supplier?");
  const whyChooseContent = about.whyChooseLeela || "";

  // Prepare technical 2x2 grid cards array
  const cards = [
    { title: card1Title, content: card1Content },
    { title: card2Title, content: card2Content },
    { title: card3Title, content: card3Content },
    { title: card4Title, content: card4Content },
  ].filter((c) => c.content && c.content.trim().length > 0);

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-8 sm:pb-10 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── MAIN WHITE ROUNDED CONTAINER CARD (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 md:p-7 lg:p-8 shadow-xl border border-gray-200/60 transition-all duration-300">
          
          {/* 1. Main Heading */}
          <h2
            className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] tracking-tight leading-tight mb-3 sm:mb-4"
            style={{ fontWeight: 700 }}
          >
            {about.aboutTitle || (isRTL ? `عن ${productTitle}` : `About ${productTitle}`)}
          </h2>

          {/* 2. Overview Paragraph */}
          {overviewText && (
            <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 max-w-5xl">
              <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed font-normal">
                {overviewText}
              </p>
            </div>
          )}

          {/* 3. 4 Key Technical Cards (2x2 Grid) */}
          {cards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-5 sm:mb-6 auto-rows-fr">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 border border-gray-200/90 hover:border-gold-main hover:shadow-lg hover:shadow-gold-main/10 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
                >
                  <div>
                    {/* Card Title with Animated Gold Bullet Dot */}
                    <div className="flex items-start sm:items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-gold-main shrink-0 mt-1.5 sm:mt-0 group-hover:scale-110 transition-all duration-300" />
                      <h3
                        className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight break-words group-hover:text-gold-dark transition-colors duration-300"
                        style={{ fontWeight: 700 }}
                      >
                        {card.title}
                      </h3>
                    </div>

                    {/* Card Description */}
                    <p className="font-subheading text-xs sm:text-xs md:text-[13px] text-gray-600 leading-relaxed font-normal break-words">
                      {card.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. Bottom Light Beige Highlight Card ("Why Choose Leela Gulf as a Trusted Supplier?") */}
          {whyChooseContent && (
            <div className="group bg-[#f7f3eb]/80 hover:bg-[#f7f3eb] rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-gold-main/40 hover:border-gold-main shadow-xs hover:shadow-lg hover:shadow-gold-main/10 transition-all duration-300 overflow-hidden">
              
              <div>
                {/* Title with Same Golden Bullet Dot */}
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-main shrink-0 group-hover:scale-110 transition-all duration-300" />
                  <h3
                    className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight group-hover:text-gold-dark transition-colors duration-300"
                    style={{ fontWeight: 700 }}
                  >
                    {whyChooseTitle}
                  </h3>
                </div>

                {/* Paragraphs */}
                <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed mb-5 font-normal max-w-5xl">
                  {whyChooseContent}
                </p>

                {/* CTA Button */}
                {onQuoteRequest && (
                  <div>
                    <button
                      type="button"
                      onClick={onQuoteRequest}
                      className="btn-gold-primary px-5 sm:px-6 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-black" />
                      <span>{isRTL ? "طلب عرض سعر" : "Request Quote"}</span>
                      <ArrowRight className={`w-3.5 h-3.5 text-black ${isRTL ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
