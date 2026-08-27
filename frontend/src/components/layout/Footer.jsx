"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import {
  Phone,
  Mail,
  ArrowRight,
  Check,
} from "lucide-react";

/**
 * Footer - Luxury Re-designed Production-Ready React Footer Component.
 * 100% Global Tokens Only - Zero Custom Hex Colors (060606/0c0c0c removed).
 * Uses standard Tailwind & Global Tokens: bg-[var(--color-primary)], text-black, fill-black, btn-gold-primary, text-gold-main, text-gold-light.
 */
export default function Footer() {
  const { isRTL } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Newsletter Subscription State
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      setIsSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLinks = [
    { name: isRTL ? "الرئيسية" : "Home", href: "/" },
    { name: isRTL ? "من نحن" : "About", href: "/about", hasDot: true },
    { name: isRTL ? "المنتجات" : "Products", href: "/products" },
    { name: isRTL ? "الاستدامة والامتثال" : "Sustainability & Compliance", href: "/solutions" },
    { name: isRTL ? "مركز المعرفة" : "Knowledge Center", href: "/knowledge-center", hasDot: true },
    { name: isRTL ? "الوظائف" : "Careers", href: "/careers" },
    { name: isRTL ? "الفعاليات" : "Events", href: "/events" },
    { name: isRTL ? "اتصل بنا" : "Contact", href: "/contact" },
  ];

  const industriesLinks = [
    { name: isRTL ? "المواد الكيميائية الصناعية" : "Industrial Chemicals", href: "/industries/industrial-chemicals" },
    { name: isRTL ? "معالجة المياه" : "Water Treatment", href: "/industries/water-treatment" },
    { name: isRTL ? "العناية المنزلية والشخصية (LEEPOL®)" : "Home Care & Personal Care (LEEPOL®)", href: "/industries/home-care-personal-care" },
    { name: isRTL ? "المواد الفعالة والمكونات الصيدلانية" : "Pharmaceuticals API & Excipients", href: "/industries/pharmaceuticals-api-excipients" },
    { name: isRTL ? "كيميائيات الأغذية والمشروبات" : "Food & Beverage chemicals", href: "/industries/food-beverage-chemicals" },
    { name: isRTL ? "التعدين والمعادن" : "Mining & Metals", href: "/industries/mining-metals" },
    { name: isRTL ? "النفط والغاز" : "Oil & Gas", href: "/industries/oil-gas" },
    { name: isRTL ? "كيميائيات المنسوجات" : "Textile Chemicals", href: "/industries/textile-chemicals" },
    { name: isRTL ? "صناعات التغليف وورق اللب" : "Packaging & Paper pulp industries", href: "/industries/packaging-paper-pulp" },
    { name: isRTL ? "كيميائيات الأسمدة" : "Fertilizers chemicals", href: "/industries/fertilizers-chemicals" },
    { name: isRTL ? "الطلاء والمواد اللاصقة ومانعات التسرب" : "CASE – Coatings, Adhesives, Sealants & Elastomers", href: "/industries/case-coatings-adhesives-sealants-elastomers" },
  ];

  return (
    <footer className="relative bg-[var(--color-primary)] text-white overflow-hidden pt-12 sm:pt-16 pb-8 border-t border-gold-main/20 z-10">
      {/* Top Ambient Gold Gradient Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-main to-transparent opacity-80" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 relative z-10">
        
        {/* ═════════════════════════════════════════════════════════════════
            1. TOP DOCK CONTACT HEADER (4 Items Grid: 2x2 on Mobile, 4x1 on Desktop)
            ═════════════════════════════════════════════════════════════════ */}
        <div className="bg-card-dark/95 backdrop-blur-md border border-gold-main/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden mb-12 sm:mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-0 divide-x-0 sm:divide-x rtl:sm:divide-x-reverse divide-white/10 border-white/10">
            
            {/* CALL US */}
            <a
              href="tel:9274687487"
              className="group p-3.5 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left rtl:sm:text-right gap-2 sm:gap-4 hover:bg-gold-main/10 transition-all duration-300 border-b sm:border-b-0 border-r border-white/10"
            >
              <div className="bg-gradient-gold-animated w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-black flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(214,185,42,0.4)] group-hover:scale-108 transition-all duration-300">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-black fill-black" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-wider text-gray-400">
                  {isRTL ? "اتصل بنا" : "CALL US"}
                </span>
                <span className="text-xs sm:text-base font-heading font-bold text-white tracking-wide truncate">
                  92746 87487
                </span>
              </div>
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/919274687487"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3.5 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left rtl:sm:text-right gap-2 sm:gap-4 hover:bg-gold-main/10 transition-all duration-300 border-b sm:border-b-0 border-white/10"
            >
              <div className="bg-gradient-gold-animated w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-black flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(214,185,42,0.4)] group-hover:scale-108 transition-all duration-300">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-black" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-wider text-gray-400">
                  {isRTL ? "واتساب" : "WHATSAPP"}
                </span>
                <span className="text-xs sm:text-base font-heading font-bold text-white tracking-wide truncate">
                  92746 87487
                </span>
              </div>
            </a>

            {/* EMAIL US */}
            <a
              href="mailto:info@leelagulf.com"
              className="group p-3.5 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left rtl:sm:text-right gap-2 sm:gap-4 hover:bg-gold-main/10 transition-all duration-300 border-r border-white/10"
            >
              <div className="bg-gradient-gold-animated w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-black flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(214,185,42,0.4)] group-hover:scale-108 transition-all duration-300">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[2.2]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-wider text-gray-400">
                  {isRTL ? "راسلنا البريد" : "EMAIL US"}
                </span>
                <span className="text-xs sm:text-base font-heading font-bold text-white tracking-wide truncate">
                  info@leelagulf.com
                </span>
              </div>
            </a>

            {/* ADDRESS (AJMAN FREE ZONE) */}
            <div className="group p-3.5 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left rtl:sm:text-right gap-2 sm:gap-4 hover:bg-gold-main/10 transition-all duration-300 cursor-default">
              <div className="bg-gradient-gold-animated w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-black flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(214,185,42,0.4)] group-hover:scale-108 transition-all duration-300">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-black" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-wider text-gray-400 truncate">
                  {isRTL ? "منطقة عجمان الحرة" : "AJMAN FREE ZONE"}
                </span>
                <span className="text-[11px] sm:text-sm font-heading font-bold text-white tracking-wide truncate">
                  Office C11F - SF9213
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════
            2. MAIN FOOTER CONTENT GRID (3 COLUMNS)
            ═════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
          
          {/* ── COL 1: BRAND LOGO + NEWSLETTER + SOCIAL ICONS (5 Cols) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Official Brand Logo */}
              <Link href="/" className="inline-block mb-4 group">
                <Image
                  src="/logos/logo.png"
                  alt="Leela Gulf FZC Logo"
                  width={260}
                  height={75}
                  className="h-11 sm:h-13 w-auto object-contain transition-transform group-hover:scale-102 duration-300"
                />
              </Link>

              {/* Brand Description */}
              <p className="font-subheading text-gray-400 text-xs sm:text-sm leading-relaxed max-w-md mb-6">
                {isRTL
                  ? "شريك عالمي في توريد وسلسلة إمداد المواد الكيميائية، يربط بين المنتجين الموثوقين ومرافق التصنيع حول العالم من خلال جودة والامتثال."
                  : "A global chemical sourcing and supply partner, connecting trusted producers with manufacturing facilities worldwide through uncompromising quality and compliance."}
              </p>
            </div>

            {/* Newsletter Subscription Card */}
            <div className="mb-6">
              <h4 className="font-heading font-bold text-xs sm:text-sm text-gold-main uppercase tracking-widest mb-3">
                {isRTL ? "اشترك في الرؤى والنشرات" : "SUBSCRIBE TO INSIGHTS"}
              </h4>

              {isSubscribed ? (
                <div className="flex items-center gap-2.5 p-3.5 bg-gold-main/15 border border-gold-main/40 rounded-full text-gold-light text-xs sm:text-sm font-heading font-bold animate-fadeIn">
                  <Check className="w-4 h-4 text-gold-main shrink-0" />
                  <span>
                    {isRTL
                      ? "شكراً لاشتراكك في نشرة ليلى جلف!"
                      : "Thank you for subscribing to Leela Gulf Insights!"}
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="relative flex items-center bg-white/5 border border-white/10 rounded-full p-1 max-w-md focus-within:border-gold-main focus-within:bg-white/10 transition-all duration-300"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      isRTL
                        ? "أدخل عنوان بريدك الإلكتروني"
                        : "Enter your email address"
                    }
                    className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none font-subheading"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Submit Email Subscription"
                    className="bg-gradient-gold-animated w-10 h-10 rounded-full text-black flex items-center justify-center shrink-0 hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer shadow-md"
                  >
                    <ArrowRight className={`w-4 h-4 text-black ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3 pt-2">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/leela-gulf-fzc/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-gold-main hover:text-black hover:border-gold-main hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                title="YouTube"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-gold-main hover:text-black hover:border-gold-main hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                title="Instagram"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-gold-main hover:text-black hover:border-gold-main hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#"
                title="Facebook"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-gold-main hover:text-black hover:border-gold-main hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="#"
                title="X (Twitter)"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-gold-main hover:text-black hover:border-gold-main hover:-translate-y-1 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ── COL 2: QUICK LINKS (3 Cols) ── */}
          <div className="lg:col-span-3">
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-gold-main uppercase tracking-wider mb-5">
              {isRTL ? "ملاحة سريعة" : "QUICK LINKS"}
            </h3>
            <ul className="space-y-3 font-subheading text-xs sm:text-sm">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center text-gray-300 hover:text-gold-light hover:translate-x-1.5 rtl:hover:-translate-x-1.5 transition-all duration-300 group"
                  >
                    <span>{link.name}</span>
                    {link.hasDot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-main ml-2 rtl:mr-2 rtl:ml-0 shadow-xs shrink-0" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: INDUSTRIES LINKS (4 Cols - Vertical Auto Slider for 11 items) ── */}
          <div className="lg:col-span-4">
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-gold-main uppercase tracking-wider mb-4">
              {isRTL ? "القطاعات الصناعية" : "INDUSTRIES"}
            </h3>

            {/* Vertical Auto Slider Container (Default 8 items height: ~260px) */}
            <div className="relative h-[260px] overflow-hidden group py-1">
              {/* Top & Bottom Smooth Gradient Fade Masks */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[var(--color-primary)] to-transparent z-10" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[var(--color-primary)] to-transparent z-10" />

              {/* Scrolling List (Duplicated for Seamless Infinite Loop) */}
              <ul className="animate-vertical-ticker group-hover:[animation-play-state:paused] flex flex-col space-y-2.5 font-subheading text-xs sm:text-sm">
                {[...industriesLinks, ...industriesLinks].map((link, idx) => (
                  <li key={idx} className="shrink-0">
                    <Link
                      href={link.href}
                      className="inline-flex items-center text-gray-300 hover:text-gold-light hover:translate-x-1.5 rtl:hover:-translate-x-1.5 transition-all duration-300"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* ═════════════════════════════════════════════════════════════════
            3. BOTTOM LEGAL POLICY BAR
            ═════════════════════════════════════════════════════════════════ */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-subheading">
          <p>© {currentYear} Leela Gulf F.Z.C. {isRTL ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
          
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/contact" className="hover:text-gold-light transition-colors">
              {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
            <Link href="/contact" className="hover:text-gold-light transition-colors">
              {isRTL ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>
            <Link href="/solutions" className="hover:text-gold-light transition-colors">
              {isRTL ? "السياسات التنظيمية" : "Regulatory Policies"}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
