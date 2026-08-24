"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Download, Headphones, ArrowRight } from "lucide-react";

/**
 * ProductDetailCatalogueBar - Dedicated Technical Document Download & Expert Support Bar
 * EXCLUSIVELY built for individual Product Details Page (/products/[id]):
 * - 100% Dynamic data integration from Backend API payload (product prop)
 * - Left Box: Downloads product-specific Technical Data Sheet (TDS) / Spec Sheet
 * - Right Box: Direct WhatsApp redirect pre-filled with specific product title
 * - Same premium aesthetics (#fcfcfb card, gold badges, LTR/RTL support).
 */
export default function ProductDetailCatalogueBar({ product }) {
  const { isRTL } = useLanguage();

  const p = product || {};
  const productTitle = p.title || "Product";

  // Product-specific document URL & WhatsApp redirect link
  const docUrl = p.docUrl || p.tdsUrl || "/documents/leela-gulf-catalogue.pdf";
  const docTitle = p.docTitle || (isRTL ? `تحميل نشرة المواصفات الفنية (${productTitle})` : `Download ${productTitle} TDS & Spec Sheet`);
  const docSubtitle = p.docSubtitle || (isRTL ? "احصل على المواصفات الفنية الكاملة ومعايير السلامة." : "Get detailed technical specifications & safety data sheet.");

  const supportTitle = p.supportTitle || (isRTL ? `هل تحتاج إلى دعم فني لـ ${productTitle}؟` : `Need Technical Support for ${productTitle}?`);
  const supportSubtitle = p.supportSubtitle || (isRTL ? "خبراء الكيمياء لدينا مستعدون لمساعدتك في التركيبات." : "Our chemical experts are ready to assist with your formulation.");

  const encodedQuery = encodeURIComponent(`Hello Leela Gulf Team, I am looking for technical support & pricing regarding ${productTitle}.`);
  const whatsappUrl = p.whatsappUrl || `https://wa.me/97165265627?text=${encodedQuery}`;

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-8 sm:pb-10 md:pb-12 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">

        {/* ── MAIN WHITE ROUNDED CONTAINER CARD (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-5 sm:p-6 lg:px-10 lg:py-6 shadow-xl border border-gray-200/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 lg:gap-8 transition-all duration-300">

          {/* ═════════════════════════════════════════════════════════════════
              LEFT BOX: DOWNLOAD PRODUCT SPECIFIC TDS / DOCUMENT
              ═════════════════════════════════════════════════════════════════ */}
          <a
            href={docUrl}
            download
            className="flex items-center gap-3.5 sm:gap-4.5 flex-1 group cursor-pointer"
          >
            {/* Solid Gold Circular Icon Badge */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full bg-gradient-gold-animated flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Download className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-black stroke-[2.2]" />
            </div>

            {/* Text Hierarchy */}
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg lg:text-[19px] text-[#1a1a1a] leading-tight" style={{ fontWeight: 700 }}>
                {docTitle}
              </h3>
              <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-relaxed font-normal">
                {docSubtitle}
              </p>
            </div>
          </a>

          {/* ═════════════════════════════════════════════════════════════════
              CENTER VERTICAL SEPARATOR (Desktop) / HORIZONTAL SEPARATOR (Mobile)
              ═════════════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[1.5px] h-[1px] lg:h-12 bg-gray-200/90 shrink-0 my-0.5 lg:my-0" />

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT BOX: PRODUCT SPECIFIC TECHNICAL ASSISTANCE & WHATSAPP
              ═════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-5 flex-1">

            {/* Headphones Icon + Text */}
            <div className="flex items-center gap-3.5 sm:gap-4.5">
              {/* Solid Gold Circular Icon Badge */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full bg-gradient-gold-animated flex items-center justify-center shrink-0 shadow-md">
                <Headphones className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-black stroke-[2.2]" />
              </div>

              {/* Text Hierarchy */}
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg lg:text-[19px] text-[#1a1a1a] leading-tight" style={{ fontWeight: 700 }}>
                  {supportTitle}
                </h3>
                <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-relaxed font-normal">
                  {supportSubtitle}
                </p>
              </div>
            </div>

            {/* WhatsApp Direct Contact Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-primary px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-heading font-bold text-xs sm:text-sm text-black flex items-center gap-2 whitespace-nowrap shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer self-start sm:self-center"
            >
              <span>{isRTL ? "تواصل معنا" : "Contact Us"}</span>
              <ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-black stroke-[2.5] ${isRTL ? "rotate-180" : ""}`} />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}
