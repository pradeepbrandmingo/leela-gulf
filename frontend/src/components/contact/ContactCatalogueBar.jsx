"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Download, ArrowRight } from "lucide-react";

/**
 * ContactCatalogueBar - Premium Compact Dual Call-to-Action Bar Component.
 * White background card with rich gold typography, crisp contrast & distinct font hierarchy.
 */
export default function ContactCatalogueBar() {
  const { isRTL } = useLanguage();

  const whatsappUrl =
    "https://wa.me/97165265627?text=Hello%20Leela%20Gulf%20Team%2C%20I%20am%20looking%20for%20assistance%20regarding%20chemical%20products.";

  return (
    <div className="w-full mt-6 sm:mt-8">
      {/* ── WHITE PILL CARD CONTAINER ── */}
      <div className="bg-white rounded-2xl p-4.5 sm:p-5 md:p-6 shadow-xl border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 transition-all duration-300 hover:shadow-2xl">

        {/* ═════════════════════════════════════════════════════════════════
            LEFT CTA: DOWNLOAD COMPANY CATALOGUE
            ═════════════════════════════════════════════════════════════════ */}
        <a
          href="/documents/leela-gulf-catalogue.pdf"
          download="leela-gulf-catalogue.pdf"
          className="flex items-center gap-3.5 sm:gap-4 flex-1 group cursor-pointer"
        >
          {/* Download Icon in Gold Tinted Circle */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gold-light/15 border border-gold-main/30 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-gold-main/30 transition-all shadow-sm">
            <Download className="w-4.5 h-4.5 text-gold-main" />
          </div>

          <div>
            <span className="block font-heading font-bold text-[10px] sm:text-[11px] text-gold-main uppercase tracking-wider mb-0.5">
              {isRTL ? "تحميل" : "DOWNLOAD OUR"}
            </span>
            <h4 className="font-heading font-bold text-base sm:text-lg text-gold-dark group-hover:text-gold-main transition-colors leading-snug">
              {isRTL ? "كتالوج الشركة" : "Company Catalogue"}
            </h4>
            <p className="font-subheading text-[11px] sm:text-xs text-gray-500 font-normal leading-relaxed mt-0.5">
              {isRTL
                ? "احصل على القائمة الكاملة لمنتجاتنا في مكان واحد."
                : "Get the complete list of our products in one place."}
            </p>
          </div>
        </a>

        {/* ═════════════════════════════════════════════════════════════════
            CENTER DIVIDER LINE (Horizontal on Mobile | Vertical on Desktop)
            ═════════════════════════════════════════════════════════════════ */}
        <div className="w-full md:w-[1px] h-[1px] md:h-11 bg-gray-200 shrink-0" />

        {/* ═════════════════════════════════════════════════════════════════
            RIGHT CTA: NEED HELP FINDING THE RIGHT PRODUCT? (WHATSAPP REDIRECT)
            ═════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 flex-1">
          <div>
            <span className="block font-heading font-bold text-[10px] sm:text-[11px] text-gold-main uppercase tracking-wider mb-0.5">
              {isRTL ? "هل تحتاج مساعدة في العثور على" : "NEED HELP FINDING THE"}
            </span>
            <h4 className="font-heading font-bold text-base sm:text-lg text-gold-dark leading-snug">
              {isRTL ? "المنتج المناسب؟" : "Right Product?"}
            </h4>
            <p className="font-subheading text-[11px] sm:text-xs text-gray-500 font-normal leading-relaxed mt-0.5">
              {isRTL
                ? "خبراؤنا هنا لمساعدتك في العثور على أفضل حل."
                : "Our experts are help to find the best solution."}
            </p>
          </div>

          {/* WhatsApp Contact Us Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-heading font-bold text-xs sm:text-sm text-gold-main border border-gold-main/80 bg-white hover:bg-gold-main hover:text-white transition-all duration-300 rounded-xl px-4 py-2 sm:px-4.5 sm:py-2.5 shrink-0 shadow-sm hover:shadow-md group mt-1 sm:mt-0"
          >
            <span>{isRTL ? "تواصل معنا" : "Contact Us"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-main group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
        </div>

      </div>
    </div>
  );
}
