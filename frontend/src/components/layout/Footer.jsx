"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, isRTL } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-primary)] border-t border-[#393C3F]/40 text-white relative z-10 pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#393C3F]/30">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logos/logo.png"
                alt="Leela Gulf Logo"
                width={280}
                height={80}
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="font-subheading text-gray-400 text-sm max-w-md leading-relaxed">
              {t("deliveringConfidence")} — Premier provider of sustainable chemical solutions, APIs, CASE additives, and industrial raw materials across GCC, India & Global markets.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm tracking-wider text-gradient-gold-animated uppercase mb-4">
              {t("company")}
            </h4>
            <ul className="space-y-2.5 font-subheading text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-gradient-gold-animated transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-gradient-gold-animated transition-colors">
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link href="/industries" className="hover:text-gradient-gold-animated transition-colors">
                  {t("industries")}
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="hover:text-gradient-gold-animated transition-colors">
                  {t("sustainability")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-sm tracking-wider text-gradient-gold-animated uppercase mb-4">
              {t("contact")}
            </h4>
            <p className="font-subheading text-sm text-gray-300">
              Leela Gulf FZC, United Arab Emirates
            </p>
            <p className="font-subheading text-sm text-gray-300">
              Email: <a href="mailto:info@leelagulf.com" className="hover:text-gradient-gold-animated transition-colors">info@leelagulf.com</a>
            </p>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-subheading">
          <p>© {currentYear} Leela Gulf FZC. {t("allRightsReserved")}.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-white transition-colors">
              {t("contact")}
            </Link>
            <Link href="/knowledge-center" className="hover:text-white transition-colors">
              {t("knowledgeCenter")}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
