"use client";

import { useLanguage } from "@/context/LanguageContext";
import { FileText, ArrowRight } from "lucide-react";

/**
 * ProductAboutSection - Master Production-Ready Product Details About & Supply Section.
 * 100% Match to Client Reference UI Screenshots (Part 1 & Part 2):
 * - Outer White Container Card (#fcfcfb)
 * - Heading: "About [Product Title]"
 * - Detailed Overview Paragraphs (Formulation, TSCA, FDA 21 CFR compliance)
 * - 4 Key Technical Cards (2x2 Grid):
 *    1. Manufacturing Process
 *    2. Packaging & Logistics
 *    3. Safety & Handling
 *    4. Bulk Pricing & Procurement
 * - Bottom Full-Width Highlight Card: "Why Choose Leela Gulf as a Trusted Supplier?"
 * - CTA Button inside card: "Request a Sample / Quote"
 * - 100% Dynamic Data Flow (Accepts `aboutData` or `product` prop for backend API)
 * - Full LTR/RTL support for English and Arabic.
 */
export default function ProductAboutSection({ product: customProduct, onQuoteRequest }) {
  const { isRTL } = useLanguage();

  // Fallback Data Structure (Matches future Backend API payload)
  const defaultAboutData = {
    title: "Cocamidopropyl Betaine (CAPB)",
    paragraphs: isRTL
      ? [
          "كوكاميدوبروبيل بيتاين هو خافض للتوتر السطحي أمفوتيري مصنوع من الأحماض الدهنية لزيت جوز الهند. يحمل ملف شحنة محايد صافي يتيح له التواجد بشكل مريح بجانب خافضات التوتر السطحي الأنيونية والكاتيونية وغير الأيونية.",
          "مدرج في قائمة المواد الكيميائية US TSCA ومتوافق مع متطلبات FDA 21 CFR، انتقل CAPB من دور داعم إلى عنصر أساسي في العديد من تركيبات التنظيف الحديثة.",
        ]
      : [
          "Cocamidopropyl Betaine is an amphoteric surfactant produced from coconut oil fatty acids. It carries a net-neutral charge profile that lets it sit comfortably alongside anionic, cationic, and non-ionic surfactants in mixed-system formulations, making it the default secondary surfactant in modern personal care.",
          "Listed on the US TSCA Chemical Substance Inventory and aligned with FDA 21 CFR requirements, CAPB has moved from a supporting role to a centerpiece in many cleansing formulations driven by the shift toward sulfate-free and \"clean beauty\" ingredient stories.",
        ],
    cards: [
      {
        title: isRTL ? "عملية التصنيع" : "Manufacturing Process",
        content: isRTL
          ? [
              "يتم إنتاجه من خلال تفاعل على مرحلتين: تتفاعل الأحماض الدهنية لجوز الهند أولاً مع ثنائي ميثيل أمينوبروبيل أمين (DMAPA) لتشكيل مركب وسيط للأميد.",
              "ثم يتم تحويل المركب الوسيط مع أحادي كلورو أسيتات الصوديوم في وسط قلوي. يتطلب الإنتاج تحكماً صارماً في درجة الحرارة والحموضة وزمن الاستقرار للحفاظ على جودة المستحضرات التجميلية.",
            ]
          : [
              "Produced through a two-step reaction: coconut fatty acids are first reacted with dimethylaminopropylamine (DMAPA) to form an amide intermediate.",
              "The intermediate is then quaternized with sodium monochloroacetate in an alkaline medium. Production requires strict control of temperature, pH, and dwell time to maintain cosmetic-grade quality.",
            ],
      },
      {
        title: isRTL ? "التعبئة والتغليف والخدمات اللوجستية" : "Packaging & Logistics",
        content: isRTL
          ? [
              "يتم شحن CAPB في براميل HDPE للطلبات القياسية، مع حوايا IBC سعة 1,000 لتر وصهاريج سائبة متاحة للكميات التجارية الكبيرة.",
              "بالنسبة للطلبات الموجهة للولايات المتحدة ودول الخليج، يدعم المخزون المحلي الشحن السريع. يُحفظ في حاويات محكمة الإغلاق في مكان بارد وجاف وجيد التهوية بعيداً عن أشعة الشمس المباشرة.",
            ]
          : [
              "CAPB ships in HDPE drums for standard orders, with IBC totes (1,000 L) and bulk tankers available for larger commercial volumes.",
              "For US and Gulf-bound orders, domestic stock supports faster fulfillment. Store in tightly sealed containers in a cool, dry, well-ventilated area away from direct sunlight, heat, and freezing temperatures to protect active content.",
            ],
      },
      {
        title: isRTL ? "السلامة والتعامل" : "Safety & Handling",
        content: isRTL
          ? [
              "جيد التحمل عموماً في التركيبات التجميلية النهائية، ولكنه يتطلب ممارسات سلامة كيميائية قياسية في شكله المركز المورد (محلول 30 إلى 35%).",
              "يجب على المتعاملين ارتداء قفازات مقاومة للمواد الكيميائية ونظارات واقية وملابس حماية. لا يصنف على أنه خطر DOT للنقل بموجب التركيزات التجارية النموذجية.",
            ]
          : [
              "Generally well-tolerated in finished cosmetic formulations, but requires standard chemical safety practices in its concentrated supplied form (30 to 35% solution).",
              "Handlers must wear chemical-resistant gloves, splash goggles, and protective clothing. It is not classified as DOT hazardous for transport under typical commercial concentrations.",
            ],
      },
      {
        title: isRTL ? "التسعير بالجملة والمشتريات" : "Bulk Pricing & Procurement",
        content: isRTL
          ? [
              "يعكس تسعير CAPB مجموعة من العوامل: تكاليف المواد الخام لزيت جوز الهند وDMAPA، نسبة المادة الفعالة، دورات الطلب، والشهادات المطلوبة (حلال، كوشير، نباتي).",
              "تقيم فرق المشتريات السعر لكل كجم من المادة الفعالة لضمان المقارنة المعيارية. يتم تحديد السعر النهائي بناءً على درجة التركيبة، الحجم، الوجهة، وتوقيت الشحن.",
            ]
          : [
              "CAPB pricing reflects a stack of factors: coconut oil and DMAPA feedstock costs, active matter percentage, demand cycles, and required certifications (Halal, Kosher, vegan).",
              "Procurement teams evaluate price per kg of active matter to ensure normalized comparison. Final pricing is dictated by formulation grade, volume, destination, and dispatch timing.",
            ],
      },
    ],
    supplierSection: {
      title: isRTL ? "لماذا تختار ليلا الخليج كمورد موثوق؟" : "Why Choose Leela Gulf as a Trusted Supplier?",
      content: isRTL
        ? [
            "تجعل ليلا الخليج عملية الشراء مباشرة لمصنعي العناية الشخصية ومستحضرات التجميل من خلال ضمان محتوى فعال ثابت، ومستويات منخفضة من الأمين الحر، وتوفير شهادة التحليل (CoA) مع كل دفعة. نشحن إلى أكثر من 40 دولة مع عينات متاحة للتأهيل قبل أي طلب بالجملة.",
            "مع وجود مخزون في المستودعات المحلية للجداول الزمنية الضيقة وشروط Incoterms مرنة (FOB, CIF, DDP)، يتمتع فريق المشتريات لديك بالمرونة لهيكلة الاتفاقيات بدقة كما هو مطلوب.",
          ]
        : [
            "Leela Gulf makes procurement straightforward for personal care and cosmetic formulators by ensuring consistent active content, low free-amine levels, and providing a Certificate of Analysis with every batch. We ship to 40+ countries with samples available for qualification before any bulk order.",
            "With domestic US and Middle East warehouse stock for tight timelines and flexible Incoterms (FOB, CIF, DDP), your procurement team has the room to structure agreements precisely as needed.",
          ],
      buttonText: isRTL ? "طلب عينة / عرض سعر" : "Request a Sample / Quote",
    },
  };

  const p = customProduct || {};
  const about = p.aboutData || defaultAboutData;
  const productTitle = p.title || about.title || "Cocamidopropyl Betaine (CAPB)";

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-8 sm:pb-10 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── MAIN WHITE ROUNDED CONTAINER CARD (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 md:p-7 lg:p-8 shadow-xl border border-gray-200/60 transition-all duration-300">
          
          {/* 1. Main Heading */}
          <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] tracking-tight leading-tight mb-3 sm:mb-4" style={{ fontWeight: 700 }}>
            {isRTL ? `عن ${productTitle}` : `About ${productTitle}`}
          </h2>

          {/* 2. Overview Paragraphs */}
          {about.paragraphs && about.paragraphs.length > 0 && (
            <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 max-w-5xl">
              {about.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed font-normal">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* 3. 4 Key Technical Cards (2x2 Grid) */}
          {about.cards && about.cards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-5 sm:mb-6 auto-rows-fr">
              {about.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 border border-gray-200/90 hover:border-[#c4842f] hover:shadow-lg hover:shadow-[#c4842f]/10 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
                >
                  <div>
                    {/* Card Title with Animated Gold Bullet Dot */}
                    <div className="flex items-start sm:items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c4842f] shrink-0 mt-1.5 sm:mt-0 group-hover:scale-110 transition-all duration-300" />
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight break-words group-hover:text-[#9e6316] transition-colors duration-300" style={{ fontWeight: 700 }}>
                        {card.title}
                      </h3>
                    </div>

                    {/* Card Description Paragraphs */}
                    {Array.isArray(card.content) ? (
                      <div className="space-y-1.5">
                        {card.content.map((text, cIdx) => (
                          <p key={cIdx} className="font-subheading text-xs sm:text-xs md:text-[13px] text-gray-600 leading-relaxed font-normal break-words">
                            {text}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="font-subheading text-xs sm:text-xs md:text-[13px] text-gray-600 leading-relaxed font-normal break-words">
                        {card.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. Bottom Full-Width Highlight Card ("Why Choose Leela Gulf as a Trusted Supplier?") */}
          {about.supplierSection && (
            <div className="group bg-[#f7f3eb]/80 hover:bg-[#f7f3eb] rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 border border-[#c4842f]/50 hover:border-[#c4842f] shadow-xs hover:shadow-lg hover:shadow-[#c4842f]/10 transition-all duration-300 overflow-hidden">
              
              <div>
                {/* Title with Same Golden Bullet Dot & Same Heading Size */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c4842f] shrink-0 group-hover:scale-110 transition-all duration-300" />
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight group-hover:text-[#9e6316] transition-colors duration-300" style={{ fontWeight: 700 }}>
                    {about.supplierSection.title}
                  </h3>
                </div>

                {/* Paragraphs */}
                {Array.isArray(about.supplierSection.content) ? (
                  <div className="space-y-2.5 mb-5 max-w-5xl">
                    {about.supplierSection.content.map((text, sIdx) => (
                      <p key={sIdx} className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed font-normal">
                        {text}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed mb-5 font-normal max-w-5xl">
                    {about.supplierSection.content}
                  </p>
                )}

                {/* CTA Button */}
                <div>
                  <button
                    type="button"
                    onClick={onQuoteRequest}
                    className="btn-gold-primary px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-black" />
                    <span>{about.supplierSection.buttonText || (isRTL ? "طلب عينة / عرض سعر" : "Request a Sample / Quote")}</span>
                    <ArrowRight className={`w-3.5 h-3.5 text-black ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
