"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown } from "lucide-react";

// Master List of 11 Dynamic Industries (Matches Excel Sheet 1-to-1)
export const INDUSTRIES_LIST = [
  { id: "industrial-chemicals", name: "Industrial Chemicals", ar: "المواد الكيميائية الصناعية" },
  { id: "water-treatment", name: "Water Treatment", ar: "معالجة المياه" },
  { id: "home-care-personal-care", name: "Home Care & Personal Care (LEEPOL®)", ar: "العناية المنزلية والشخصية (LEEPOL®)" },
  { id: "pharmaceuticals-api-excipients", name: "Pharmaceuticals API & Excipients", ar: "المواد الصيدلانية الفعالة والمكونات" },
  { id: "food-beverage-chemicals", name: "Food & Beverage chemicals", ar: "كيماويات الأغذية والمشروبات" },
  { id: "mining-metals", name: "Mining & Metals", ar: "التعدين والمعادن" },
  { id: "oil-gas", name: "Oil & Gas", ar: "النفط والغاز" },
  { id: "textile-chemicals", name: "Textile Chemicals", ar: "كيماويات النسيج" },
  { id: "packaging-paper-pulp", name: "Packaging & Paper pulp industries", ar: "التغليف ولب الورق" },
  { id: "fertilizers-chemicals", name: "Fertilizers chemicals", ar: "أسمدة ومواد كيميائية زراعية" },
  { id: "case-coatings-adhesives", name: "CASE – Coatings, Adhesives, Sealants & Elastomers", ar: "الدهانات واللاصقات (CASE)" },
];

export default function Header() {
  const { lang, setLang, isRTL } = useLanguage();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isIndustriesSubmenuOpen, setIsIndustriesSubmenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: isRTL ? "الرئيسية" : "Home", href: "/", hasDot: false },
    { name: isRTL ? "عن الشركة" : "About", href: "/about", hasDot: false },
    { name: isRTL ? "المنتجات" : "Products", href: "/products", hasDot: false },
    {
      name: isRTL ? "القطاعات الصناعية" : "Industries",
      hasDot: true,
      isDropdown: true,
    },
    {
      name: isRTL ? "الاستدامة والامتثال" : "Sustainability & Compliance",
      href: "/solutions",
      hasDot: false,
    },
    {
      name: isRTL ? "مركز المعرفة" : "Knowledge Center",
      href: "/knowledge-center",
      hasDot: true,
    },
    { name: isRTL ? "الوظائف" : "Careers", href: "/careers", hasDot: false },
    { name: isRTL ? "الفعاليات" : "Events", href: "/events", hasDot: false },
    { name: isRTL ? "اتصل بنا" : "Contact", href: "/contact", hasDot: false },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 py-2.5 md:py-3 transition-all duration-300 ${
          isScrolled
            ? "bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#393C3F]/30 shadow-xl"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logos/logo.png"
              alt="Leela Gulf Logo"
              width={320}
              height={100}
              className="h-11 md:h-12 lg:h-14 w-auto object-contain transition-opacity hover:opacity-90"
              priority
            />
          </Link>

          {/* RIGHT TOP UTILITIES */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* Language Switcher Badge */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="hidden md:flex w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-gold-animated text-[#1a1a1a] items-center justify-center font-bold text-xs md:text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title={lang === "en" ? "Switch to Arabic" : "Switch to English"}
              aria-label="Switch Language"
            >
              文A
            </button>

            {/* Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col justify-center items-start gap-1.5 p-1.5 cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
              aria-label="Toggle Menu"
            >
              <span className="w-7 h-[3.5px] bg-gradient-gold-animated rounded-full"></span>
              <span className="w-5 h-[3.5px] bg-gradient-gold-animated rounded-full"></span>
              <span className="w-3.5 h-[3.5px] bg-gradient-gold-animated rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* DROPDOWN MENU OVERLAY CARD */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end rtl:justify-start pt-16"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Slide-over Card Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[320px] sm:max-w-[360px] h-auto max-h-[90vh] bg-[#08090a] border border-[#393C3F]/70 rounded-tl-[36px] rounded-bl-3xl p-6 md:p-8 shadow-2xl flex flex-col justify-between animate-section-reveal relative overflow-y-auto"
          >
            {/* Close Icon Top Right */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-5 rtl:left-5 rtl:right-auto text-gray-400 hover:text-white p-1 text-lg cursor-pointer transition-colors"
              aria-label="Close Menu"
            >
              ✕
            </button>

            {/* Menu Links List */}
            <nav className="space-y-2.5 pt-2">
              {menuItems.map((item, idx) => {
                const isActive = pathname === item.href || (item.isDropdown && pathname.startsWith("/industries"));

                if (item.isDropdown) {
                  return (
                    <div key={idx} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setIsIndustriesSubmenuOpen(!isIndustriesSubmenuOpen)}
                        className="flex items-center justify-between py-1 w-full text-left rtl:text-right cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-base md:text-lg font-heading tracking-wide transition-colors ${
                              isActive
                                ? "text-gradient-gold-animated font-bold"
                                : "text-gray-200 group-hover:text-gradient-gold-animated"
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.hasDot && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-gold-animated inline-block"></span>
                          )}
                        </div>

                        <ChevronDown
                          className={`w-4 h-4 text-gold-main transition-transform duration-200 ${
                            isIndustriesSubmenuOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Accordion List of 11 Dynamic Industry Pages */}
                      {isIndustriesSubmenuOpen && (
                        <div className="pl-3 rtl:pr-3 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gold-main/40 my-1 space-y-1.5">
                          {INDUSTRIES_LIST.map((ind) => {
                            const indHref = `/industries/${ind.id}`;
                            const isIndActive = pathname === indHref;
                            return (
                              <Link
                                key={ind.id}
                                href={indHref}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block text-xs sm:text-sm font-subheading transition-colors py-0.5 ${
                                  isIndActive
                                    ? "text-gradient-gold-animated font-bold"
                                    : "text-gray-300 hover:text-gradient-gold-animated"
                                }`}
                              >
                                {isRTL ? ind.ar : ind.name}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={idx} className="flex items-center gap-2 py-1">
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`text-base md:text-lg font-heading tracking-wide transition-colors ${
                        isActive
                          ? "text-gradient-gold-animated font-bold"
                          : "text-gray-200 hover:text-gradient-gold-animated"
                      }`}
                    >
                      {item.name}
                    </Link>
                    {item.hasDot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-gold-animated inline-block"></span>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Bottom Section inside Dropdown: Language Switcher Badge */}
            <div className="pt-4 flex justify-end rtl:justify-start border-t border-[#393C3F]/30 mt-4">
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-gold-animated text-[#1a1a1a] flex items-center justify-center font-bold text-xs md:text-sm shadow-xl transition-transform hover:scale-105 cursor-pointer"
                aria-label="Language Switcher"
              >
                文A
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
