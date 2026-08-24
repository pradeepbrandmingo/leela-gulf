"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Download, Headphones, ArrowRight } from "lucide-react";

/**
 * ProductCatalogueBar - Premium Product Catalogue Download & WhatsApp Contact Bar
 * Matches client reference design 100%: solid gold circular icon badges, two-color title text hierarchy,
 * PDF download for leela-gulf-catalogue.pdf, and direct WhatsApp redirect.
 */
export default function ProductCatalogueBar() {
  const { isRTL } = useLanguage();

  const whatsappUrl =
    "https://wa.me/97165265627?text=Hello%20Leela%20Gulf%20Team%2C%20I%20am%20looking%20for%20assistance%20regarding%20chemical%20products.";

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-6 sm:pb-8 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">

        {/* ── WHITE ROUNDED PILL CONTAINER (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-5 sm:p-6 lg:px-10 lg:py-6 shadow-xl border border-gray-200/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 lg:gap-8 transition-all duration-300">

          {/* ═════════════════════════════════════════════════════════════════
              LEFT BOX: DOWNLOAD OUR PRODUCT CATALOGUE
              ═════════════════════════════════════════════════════════════════ */}
          <a
            href="/documents/leela-gulf-catalogue.pdf"
            download="leela-gulf-catalogue.pdf"
            className="flex items-center gap-3.5 sm:gap-4.5 flex-1 group cursor-pointer"
          >
            {/* Solid Gold Circular Icon Badge */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full bg-gradient-gold-animated flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Download className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 text-black stroke-[2.2]" />
            </div>

            {/* Text Hierarchy */}
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg lg:text-xl text-[#1a1a1a] leading-tight" style={{ fontWeight: 700 }}>
                {isRTL ? "تحميل " : "Download Our "}
                <span className="text-gold-main group-hover:text-gold-dark transition-colors">
                  {isRTL ? "كتالوج المنتجات" : "Product Catalogue"}
                </span>
              </h3>
              <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-relaxed font-normal">
                {isRTL
                  ? "احصل على القائمة الكاملة لمنتجاتنا في مكان واحد."
                  : "Get the complete list of our products in one place."}
              </p>
            </div>
          </a>

          {/* ═════════════════════════════════════════════════════════════════
              CENTER VERTICAL SEPARATOR (Desktop) / HORIZONTAL SEPARATOR (Mobile)
              ═════════════════════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[1.5px] h-[1px] lg:h-12 bg-gray-200/90 shrink-0 my-0.5 lg:my-0" />

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT BOX: NEED HELP FINDING THE RIGHT PRODUCT? (WHATSAPP REDIRECT)
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
                <h3 className="font-heading font-bold text-base sm:text-lg lg:text-xl text-[#1a1a1a] leading-tight" style={{ fontWeight: 700 }}>
                  {isRTL ? "هل تحتاج مساعدة في " : "Need Help Finding the "}
                  <span className="text-gold-main">
                    {isRTL ? "اختيار المنتج المناسب؟" : "Right Product?"}
                  </span>
                </h3>
                <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-500 mt-0.5 leading-relaxed font-normal">
                  {isRTL
                    ? "خبراؤنا هنا لمساعدتك في العثور على أفضل حل."
                    : "Our experts are here to help you find the best solution."}
                </p>
              </div>
            </div>

            {/* WhatsApp Direct Contact Us Button */}
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
