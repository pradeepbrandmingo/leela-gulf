"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Download, ArrowRight } from "lucide-react";

/**
 * ContactCatalogueBar - Ultra-Compact Dual Call-to-Action Bar Component.
 * Features:
 * 1. Left CTA: Download Company Catalogue (Triggers download of `/documents/leela-gulf-catalogue.pdf`).
 * 2. Right CTA: Need Help Finding the Right Product? (Redirects to WhatsApp: +971 6 526 5627).
 * Ultra-compact height and pixel-perfect responsiveness across mobile & desktop.
 */
export default function ContactCatalogueBar() {
  const { isRTL } = useLanguage();

  const whatsappUrl =
    "https://wa.me/97165265627?text=Hello%20Leela%20Gulf%20Team%2C%20I%20am%20looking%20for%20assistance%20regarding%20chemical%20products.";

  return (
    <div className="w-full mt-6 sm:mt-8">
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 md:gap-6 transition-all duration-300 hover:shadow-2xl">
        
        {/* ═════════════════════════════════════════════════════════════════
            LEFT CTA: DOWNLOAD COMPANY CATALOGUE
            ═════════════════════════════════════════════════════════════════ */}
        <a
          href="/documents/leela-gulf-catalogue.pdf"
          download="leela-gulf-catalogue.pdf"
          className="flex items-center gap-3 sm:gap-3.5 flex-1 group cursor-pointer"
        >
          {/* Download Icon in Gold Tinted Circle */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#fcf8ed] border border-[#f5e6be] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#f5e6be] transition-all shadow-sm">
            <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#c4842f]" />
          </div>

          <div>
            <span className="block font-subheading text-[10px] sm:text-[11px] text-gray-500 font-medium leading-none mb-0.5">
              {isRTL ? "تحميل" : "Download Our"}
            </span>
            <h4 className="font-heading font-bold text-sm sm:text-base md:text-lg text-[#c4842f] group-hover:text-[#a3681e] transition-colors leading-tight">
              {isRTL ? "كتالوج الشركة" : "Company Catalogue"}
            </h4>
            <p className="font-subheading text-[11px] sm:text-xs text-gray-500 leading-tight mt-0.5">
              {isRTL
                ? "احصل على القائمة الكاملة لمنتجاتنا في مكان واحد."
                : "Get the complete list of our products in one place."}
            </p>
          </div>
        </a>

        {/* ═════════════════════════════════════════════════════════════════
            CENTER DIVIDER LINE (Horizontal on Mobile | Vertical on Desktop)
            ═════════════════════════════════════════════════════════════════ */}
        <div className="w-full md:w-[1px] h-[1px] md:h-10 bg-gray-100 md:bg-gray-200 shrink-0" />

        {/* ═════════════════════════════════════════════════════════════════
            RIGHT CTA: NEED HELP FINDING THE RIGHT PRODUCT? (WHATSAPP REDIRECT)
            ═════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 flex-1">
          <div>
            <span className="block font-subheading text-[10px] sm:text-[11px] text-gray-500 font-medium leading-none mb-0.5">
              {isRTL ? "هل تحتاج مساعدة في العثور على" : "Need Help Finding the"}
            </span>
            <h4 className="font-heading font-bold text-sm sm:text-base md:text-lg text-[#c4842f] leading-tight">
              {isRTL ? "المنتج المناسب؟" : "Right Product?"}
            </h4>
            <p className="font-subheading text-[11px] sm:text-xs text-gray-500 leading-tight mt-0.5">
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
            className="inline-flex items-center gap-1.5 font-heading font-bold text-xs text-[#c4842f] border border-[#c4842f]/80 bg-white hover:bg-[#c4842f] hover:text-white transition-all duration-300 rounded-xl px-3.5 py-1.5 sm:px-4 sm:py-2 shrink-0 shadow-sm hover:shadow-md group mt-1 sm:mt-0"
          >
            <span>{isRTL ? "تواصل معنا" : "Contact Us"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c4842f] group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
        </div>

      </div>
    </div>
  );
}
