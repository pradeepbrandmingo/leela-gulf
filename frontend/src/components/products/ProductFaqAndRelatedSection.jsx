"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Plus, X } from "lucide-react";

/**
 * ProductFaqAndRelatedSection - Master Production-Ready Bottom FAQ & Related Products Section.
 * Uses strict global theme tokens:
 * - Brand Gold: bg-gold-main, text-gold-main, text-gold-dark, border-gold-main
 * - Outer White Container Card (#fcfcfb)
 * - 2 Column Split (Left: Interactive FAQ Accordion | Right: Related Products Cards)
 * - Vertical Gold Bar Accents before Titles (bg-gold-main)
 * - Interactive Accordion with gold-main active title & clean +/x toggles
 * - Stacked Related Product Cards (Clean category text + Title + Description)
 * - 100% Dynamic data from MongoDB
 */
export default function ProductFaqAndRelatedSection({ product: customProduct }) {
  const { isRTL } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const p = customProduct || {};

  // Extract real database FAQs
  const rawFaqs = Array.isArray(p.faqData)
    ? p.faqData
    : Array.isArray(p.faqs)
    ? p.faqs
    : [];

  const faqs = rawFaqs
    .map((faq, idx) => ({
      id: faq.id || idx,
      number: String(idx + 1).padStart(2, "0"),
      question: faq.question || "",
      answer: faq.answer || "",
    }))
    .filter((f) => f.question.trim().length > 0);

  // Extract real database related products
  const rawRelated = Array.isArray(p.relatedProducts)
    ? p.relatedProducts
    : [];

  const relatedList = rawRelated
    .map((rel, idx) => ({
      id: rel.id || idx,
      slug: rel.slug || "",
      categoryTag: rel.categoryTag || (isRTL ? "خافض للتوتر السطحي" : "SURFACTANT"),
      title: rel.title || "",
      description: rel.description || "",
    }))
    .filter((r) => r.title.trim().length > 0);

  const relatedHeading = p.relatedHeading || (isRTL ? "منتجات ذات صلة" : "Related Surfactants");

  // If both FAQs and Related products are empty, don't render empty section
  if (faqs.length === 0 && relatedList.length === 0) {
    return null;
  }

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
            <div className={relatedList.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}>
              
              {faqs.length > 0 && (
                <>
                  {/* Section Header with Vertical Gold Accent Line */}
                  <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                    <span className="w-1 h-5 sm:h-6 bg-gold-main rounded-full shrink-0" />
                    <h2
                      className="font-heading font-bold text-lg sm:text-xl lg:text-2xl text-[#1a1a1a] tracking-tight"
                      style={{ fontWeight: 700 }}
                    >
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
                              <span className="font-heading font-bold text-xs sm:text-sm text-gold-main shrink-0 mt-0.5 tracking-wider">
                                {faq.number}
                              </span>

                              {/* Question Text */}
                              <h3
                                className={`font-heading font-bold text-sm sm:text-base md:text-[16px] leading-snug tracking-tight transition-colors duration-200 break-words ${
                                  isOpen ? "text-gold-main" : "text-[#1a1a1a] group-hover:text-gold-main"
                                }`}
                                style={{ fontWeight: 700 }}
                              >
                                {faq.question}
                              </h3>
                            </div>

                            {/* Plus (+) / Cross (x) Toggle Icon */}
                            <div className="shrink-0 pt-0.5">
                              {isOpen ? (
                                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gold-main transition-transform duration-200" />
                              ) : (
                                <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-400 group-hover:text-gold-main transition-transform duration-200" />
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
                </>
              )}
            </div>

            {/* ═══════════════════════════════════════════
                RIGHT COLUMN: RELATED PRODUCTS CARDS
                ═══════════════════════════════════════════ */}
            {relatedList.length > 0 && (
              <div className="lg:col-span-5">
                
                {/* Section Header with Vertical Gold Accent Line */}
                <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                  <span className="w-1 h-5 sm:h-6 bg-gold-main rounded-full shrink-0" />
                  <h2
                    className="font-heading font-bold text-lg sm:text-xl lg:text-2xl text-[#1a1a1a] tracking-tight"
                    style={{ fontWeight: 700 }}
                  >
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
                        {/* Subtitle / Category Tag */}
                        {rel.categoryTag && (
                          <p className="font-heading font-bold text-[10.5px] sm:text-[11px] text-gray-400 group-hover:text-gold-main transition-colors uppercase tracking-widest mb-1.5">
                            {rel.categoryTag}
                          </p>
                        )}

                        {/* Related Product Title */}
                        <h3
                          className="font-heading font-bold text-base sm:text-[17px] text-[#1a1a1a] tracking-tight mb-2 group-hover:text-gold-main transition-colors duration-200 break-words"
                          style={{ fontWeight: 700 }}
                        >
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
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
