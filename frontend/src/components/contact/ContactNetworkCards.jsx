"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Phone, Mail, Globe, Globe2, Handshake, Warehouse } from "lucide-react";

/**
 * ContactNetworkCards - Premium Compact Contact Information Bar & Global Network Banner Component.
 * Responsive Layout:
 * - Desktop: Compact height, sleek proportions, tight padding.
 * - Mobile: Clean 3-row vertical stack matching Reference Screenshot 2.
 */
export default function ContactNetworkCards() {
  const { isRTL } = useLanguage();

  return (
    <div className="w-full space-y-6 sm:space-y-7 mt-8 sm:mt-10">
      
      {/* ═════════════════════════════════════════════════════════════════
          CARD 1: DIRECT CONTACT BAR ("Prefer to talk?")
          ═════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0e1014]/90 backdrop-blur-xl border border-[#c4842f]/35 rounded-2xl p-5 sm:p-6 md:p-7 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-[#c4842f]/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 lg:gap-8">
          
          {/* Left Column: Phone Icon & "Prefer to talk?" */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[var(--color-secondary-main)]/15 border border-[var(--color-secondary-main)]/40 flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-secondary-main)]/10">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-secondary-main)]" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base sm:text-lg text-white">
                {isRTL ? "تفضل التحدث إلينا؟" : "Prefer to talk?"}
              </h4>
              <p className="font-subheading text-xs sm:text-sm text-gray-400">
                {isRTL ? "فريقنا يبعد عنك مكالمة واحدة فقط." : "Our team is just a call away."}
              </p>
            </div>
          </div>

          {/* Center Column: Big Phone Number & Operating Hours */}
          <div className="text-left lg:text-center">
            <a
              href="tel:+97165265627"
              className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-white hover:text-[var(--color-secondary-main)] transition-colors tracking-tight block"
            >
              +971 6 526 5627
            </a>
            <p className="font-subheading text-xs sm:text-sm text-gray-400 mt-0.5">
              {isRTL ? "الاثنين - الجمعة (9 صباحاً حتى 6 مساءً بتوقيت الإمارات)" : "Mon - Fri (9 AM to 6 PM GST)"}
            </p>
          </div>

          {/* Right Column: Other Ways to Reach Us (No Underline) */}
          <div className="flex flex-col items-start lg:items-end shrink-0">
            <span className="font-heading font-bold text-xs sm:text-sm text-[#c4842f] mb-1.5 uppercase tracking-wider">
              {isRTL ? "طرق أخرى للتواصل معنا" : "OTHER WAYS TO REACH US"}
            </span>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              {/* Email */}
              <a
                href="mailto:sales@leelagulf.com"
                className="flex items-center gap-2 text-gray-200 hover:text-[var(--color-secondary-main)] transition-colors group"
              >
                <Mail className="w-4 h-4 text-[var(--color-secondary-main)] group-hover:scale-110 transition-transform" />
                <span className="font-medium">
                  sales@leelagulf.com
                </span>
              </a>

              {/* Website */}
              <a
                href="https://leelagulf.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-200 hover:text-[var(--color-secondary-main)] transition-colors group"
              >
                <Globe className="w-4 h-4 text-[var(--color-secondary-main)] group-hover:scale-110 transition-transform" />
                <span className="font-medium">
                  leelagulf.com
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          CARD 2: GLOBAL NETWORK BANNER WITH COMPACT HEIGHT & CLEAR GOLD MAP
          ═════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0b0d11] border border-[#c4842f]/40 rounded-3xl p-6 sm:p-8 md:p-9 relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#c4842f]/60 min-h-[300px] flex flex-col justify-between">
        
        {/* Background Map Image with Bright Clear Gold Contours */}
        <div 
          className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-85 pointer-events-none transition-transform duration-700 hover:scale-105 contrast-125"
          style={{ backgroundImage: "url('/images/contact/global newwork.png')" }}
        />
        {/* Soft Left Gradient Overlay so Left Text is 100% Readable while Right Gold Map Shines */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d11] via-[#0b0d11]/60 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-2xl">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-[2px] bg-[#c4842f] inline-block" />
            <span className="font-heading font-bold text-xs sm:text-sm tracking-widest text-[#c4842f] uppercase">
              {isRTL ? "الشبكة العالمية" : "GLOBAL NETWORK"}
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-[1.18] mb-3">
            {isRTL ? (
              <>
                ربط الصناعات. <br />
                <span className="text-[#c4842f]">عبر الخليج.</span>
              </>
            ) : (
              <>
                Connecting Industries. <br />
                <span className="text-[#c4842f]">Across the Gulf.</span>
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p className="font-subheading text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
            {isRTL
              ? "تقديم الحلول الكيميائية عبر دول مجلس التعاون الخليجي والأسواق الدولية بثقة وموثوقية."
              : "Delivering chemical solutions across the GCC and international markets with trust and reliability."}
          </p>
        </div>

        {/* Bottom Metrics Glass Container (Pixel-Perfect Mobile Vertical Stack & Desktop Horizontal Row) */}
        <div className="relative z-10 max-w-2xl">
          <div className="bg-[#12141c]/90 backdrop-blur-md border border-[#2e3344] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-6 shadow-xl">
            
            {/* Stat 1: Countries Served */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-secondary-main)]/15 border border-[var(--color-secondary-main)]/30 flex items-center justify-center shrink-0">
                <Globe2 className="w-4.5 h-4.5 text-[var(--color-secondary-main)]" />
              </div>
              <div>
                <h5 className="font-heading font-bold text-base sm:text-lg text-white leading-tight">
                  35+
                </h5>
                <p className="font-subheading text-xs text-gray-300 whitespace-nowrap leading-tight mt-0.5">
                  {isRTL ? "دولة مخدومة" : "Countries Served"}
                </p>
              </div>
            </div>

            {/* Stat 2: Supply Partners */}
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#282d3d] pt-3 sm:pt-0 pl-0 sm:pl-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-secondary-main)]/15 border border-[var(--color-secondary-main)]/30 flex items-center justify-center shrink-0">
                <Handshake className="w-4.5 h-4.5 text-[var(--color-secondary-main)]" />
              </div>
              <div>
                <h5 className="font-heading font-bold text-base sm:text-lg text-white leading-tight">
                  200+
                </h5>
                <p className="font-subheading text-xs text-gray-300 whitespace-nowrap leading-tight mt-0.5">
                  {isRTL ? "شريك توريد" : "Supply Partners"}
                </p>
              </div>
            </div>

            {/* Stat 3: Distribution Hub */}
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#282d3d] pt-3 sm:pt-0 pl-0 sm:pl-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-secondary-main)]/15 border border-[var(--color-secondary-main)]/30 flex items-center justify-center shrink-0">
                <Warehouse className="w-4.5 h-4.5 text-[var(--color-secondary-main)]" />
              </div>
              <div>
                <h5 className="font-heading font-bold text-base sm:text-lg text-white leading-tight">
                  UAE
                </h5>
                <p className="font-subheading text-xs text-gray-300 whitespace-nowrap leading-tight mt-0.5">
                  {isRTL ? "مركز التوزيع" : "Distribution Hub"}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
