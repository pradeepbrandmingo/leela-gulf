"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Plus, X, ArrowUpRight } from "lucide-react";

/**
 * ProductFaqAndRelatedSection - Master Production-Ready Bottom FAQ & Related Products Section.
 * 100% Match to Client Reference UI Screenshot (Part 5):
 * - Outer White Container Card (#fcfcfb)
 * - 2 Column Split (Left: Interactive FAQ Accordion | Right: Related Products Cards)
 * - Vertical Gold Bar Accents before Titles (| Frequently Asked Questions & | Related Surfactants)
 * - Interactive Accordion with 01, 02, 03... index watermarks & +/x toggles
 * - 3 Stacker Related Product Cards (Category Pill + Title + Description)
 * - 100% Dynamic Data Flow for Backend API payload
 * - Full LTR/RTL support for English and Arabic.
 */
export default function ProductFaqAndRelatedSection({ product: customProduct }) {
  const { isRTL } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // First item open by default like screenshot

  // Fallback Data Structure (Matches future Backend API payload)
  const defaultFaqData = [
    {
      id: "faq-01",
      number: "01",
      question: isRTL ? "ما هي نسبة المادة الفعالة؟" : "What is the active matter percentage?",
      answer: isRTL
        ? "يحتوي كوكاميدوبروبيل بيتاين (CAPB) القياسي المخصص للاستخدام الصناعي على نسبة مادة فعالة بين 30% و35%، مما يضمن الأداء الأمثل والفعالية من حيث التكلفة لتركيبات العناية الشخصية بالجملة."
        : "Our standard industrial-grade Cocamidopropyl Betaine (CAPB) typically contains between 30% and 35% active matter, ensuring optimal performance and cost-effectiveness for bulk personal care formulations.",
    },
    {
      id: "faq-02",
      number: "02",
      question: isRTL ? "هل يمكن خلط CAPB مع خافضات التوتر السطحي الأنيونية؟" : "Can CAPB be blended with anionic surfactants?",
      answer: isRTL
        ? "نعم، يتم خلط CAPB بشكل شائع جداً مع SLES أو SLS لتعزيز خفة التركيبة وتقليل التخريش وزيادة استقرار الرغوة."
        : "Yes, CAPB is very commonly blended alongside SLES or SLS to boost formulation mildness, reduce irritation, and significantly enhance foam stability.",
    },
    {
      id: "faq-03",
      number: "03",
      question: isRTL ? "ما هي مدة الصلاحية الموصى بها؟" : "What is the recommended shelf life?",
      answer: isRTL
        ? "مدة الصلاحية الموصى بها هي 24 شهراً من تاريخ التصنيع عند تخزينها في حاويات محكمة الإغلاق في درجة حرارة الغرفة."
        : "The recommended shelf life is 24 months from the date of manufacture when stored in tightly sealed containers at ambient temperature away from direct sunlight.",
    },
    {
      id: "faq-04",
      number: "04",
      question: isRTL ? "هل تقدمون شهادة التحليل (CoA)؟" : "Do you provide a Certificate of Analysis (CoA)?",
      answer: isRTL
        ? "بالتأكيد. تحتوي كل دفعة يتم شحنها بواسطة ليلا الخليج على شهادة تحليل كاملة تدعم مواصفات الدفعة لضمان الجودة."
        : "Absolutely. Every shipment dispatched by Leela Gulf includes a batch-specific Certificate of Analysis (CoA) confirming active matter percentage and purity.",
    },
  ];

  const defaultRelatedProducts = [
    {
      id: "sles-70",
      slug: "sodium-laureth-sulfate-sles-70",
      categoryTag: isRTL ? "خافض التوتر السطحي الأنيوني" : "ANIONIC SURFACTANT",
      title: isRTL ? "كبريتات لوريث الصوديوم (SLES 70%)" : "Sodium Laureth Sulfate (SLES 70%)",
      description: isRTL
        ? "عامل رغوة عالي الفعالية يتم إقرانه عادةً مع CAPB في تركيبات الشامبو وغسول الجسم."
        : "A highly effective foaming agent commonly paired with CAPB in shampoo and body wash formulations.",
    },
    {
      id: "cdea",
      slug: "cocamide-dea-cdea",
      categoryTag: isRTL ? "خافض التوتر السطحي غير الأيوني" : "NON-IONIC SURFACTANT",
      title: isRTL ? "كوكاميد ديا (CDEA)" : "Cocamide DEA (CDEA)",
      description: isRTL
        ? "يستخدم جنبًا إلى جنب مع البيتاين كمعزز ومثبت ممتاز للرغوة وباني للزوجة في مستحضرات التجميل السائلة."
        : "Used alongside betaines as an excellent foam stabilizer and viscosity builder in liquid cosmetics.",
    },
    {
      id: "glycerin-99",
      slug: "refined-glycerin-99",
      categoryTag: isRTL ? "مرطب" : "HUMECTANT",
      title: isRTL ? "جلسرين مكرر (99.5%)" : "Refined Glycerin (99.5%)",
      description: isRTL
        ? "عامل ترطيب تكميلي يستخدم على نطاق واسع في العناية بالمنزل والمستحضرات الجلدية."
        : "A complementary moisturizing agent widely utilized in home care and dermatological preparations.",
    },
  ];

  const p = customProduct || {};
  const faqs = p.faqData || defaultFaqData;
  const relatedList = p.relatedProducts || defaultRelatedProducts;
  const relatedHeading = isRTL ? "منتجات ذات صلة" : "Related Surfactants";

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-8 sm:pb-10 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── MAIN WHITE ROUNDED CONTAINER CARD (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-5 sm:p-7 md:p-9 lg:p-11 shadow-xl border border-gray-200/60 transition-all duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ═══════════════════════════════════════════
                LEFT COLUMN: FREQUENTLY ASKED QUESTIONS
                ═══════════════════════════════════════════ */}
            <div className="lg:col-span-7">
              
              {/* Section Header with Vertical Gold Accent Line */}
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                <span className="w-1 h-5 sm:h-6 bg-[#c4842f] rounded-full shrink-0" />
                <h2 className="font-heading font-bold text-lg sm:text-xl lg:text-2xl text-[#1a1a1a] tracking-tight" style={{ fontWeight: 700 }}>
                  {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
                </h2>
              </div>

              {/* FAQ Accordion List */}
              <div className="divide-y divide-gray-200/70 border-t border-b border-gray-200/70">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div key={faq.id || idx} className="py-3.5 sm:py-4 transition-colors">
                      
                      {/* Question Toggle Header */}
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-start justify-between gap-4 text-left rtl:text-right cursor-pointer group"
                      >
                        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                          {/* Gold Index Watermark Number */}
                          <span className="font-heading font-bold text-xs sm:text-sm text-[#c4842f] shrink-0 mt-0.5 tracking-wider">
                            {faq.number || String(idx + 1).padStart(2, "0")}
                          </span>

                          {/* Question Text */}
                          <h3
                            className={`font-heading font-bold text-sm sm:text-base md:text-[16px] leading-snug tracking-tight transition-colors duration-200 break-words ${
                              isOpen ? "text-[#c4842f]" : "text-[#1a1a1a] group-hover:text-[#c4842f]"
                            }`}
                            style={{ fontWeight: 700 }}
                          >
                            {faq.question}
                          </h3>
                        </div>

                        {/* Plus (+) / Cross (x) Toggle Icon */}
                        <div className="shrink-0 pt-0.5">
                          {isOpen ? (
                            <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#c4842f] transition-transform duration-200" />
                          ) : (
                            <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-400 group-hover:text-[#c4842f] transition-transform duration-200" />
                          )}
                        </div>
                      </button>

                      {/* Expandable Answer Box */}
                      {isOpen && (
                        <div className="mt-2.5 pl-7 sm:pl-9 rtl:pl-0 rtl:pr-7 sm:rtl:pr-9 animate-[fadeIn_0.2s_ease-out]">
                          <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed font-normal break-words">
                            {faq.answer}
                          </p>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>

            {/* ═══════════════════════════════════════════
                RIGHT COLUMN: RELATED PRODUCTS CARDS
                ═══════════════════════════════════════════ */}
            <div className="lg:col-span-5">
              
              {/* Section Header with Vertical Gold Accent Line */}
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                <span className="w-1 h-5 sm:h-6 bg-[#c4842f] rounded-full shrink-0" />
                <h2 className="font-heading font-bold text-lg sm:text-xl lg:text-2xl text-[#1a1a1a] tracking-tight" style={{ fontWeight: 700 }}>
                  {relatedHeading}
                </h2>
              </div>

              {/* Stacked Related Product Cards List */}
              <div className="space-y-4">
                {relatedList.map((rel, idx) => (
                  <Link
                    key={rel.id || idx}
                    href={`/products/${rel.slug || rel.id}`}
                    className="group bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs hover:border-gold-main hover:shadow-lg hover:shadow-gold-main/10 transition-all duration-300 block relative overflow-hidden"
                  >
                    <div>
                      {/* Subtitle / Category Tag Pill (Golden-grayish tint matching reference UI) */}
                      {rel.categoryTag && (
                        <p className="font-heading font-bold text-[10.5px] sm:text-[11px] text-[#9b7b4d] uppercase tracking-widest mb-1.5">
                          {rel.categoryTag}
                        </p>
                      )}

                      {/* Related Product Title */}
                      <h3 className="font-heading font-bold text-base sm:text-[17px] text-[#1a1a1a] tracking-tight mb-2 group-hover:text-gold-main transition-colors duration-200 break-words" style={{ fontWeight: 700 }}>
                        {rel.title}
                      </h3>

                      {/* Related Product Description */}
                      <p className="font-subheading text-xs sm:text-xs md:text-[13.5px] text-gray-600 leading-relaxed font-normal break-words line-clamp-2">
                        {rel.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
