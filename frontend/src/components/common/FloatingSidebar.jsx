"use client";

import { FiLinkedin, FiInstagram } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

/**
 * FloatingSidebar - Transparent Floating Social Media Icons (LinkedIn & Instagram).
 * Placed at Bottom Right across all pages.
 * Features:
 * 1. Uses `react-icons/fi` (Feather Icons - thin elegant line icons).
 * 2. 100% Transparent background (NO background box).
 * 3. Icons use global `text-gold-main` color token from globals.css.
 */
export default function FloatingSidebar() {
  const { isRTL } = useLanguage();

  return (
    <aside
      aria-label="Social Media Links"
      className={`fixed ${
        isRTL ? "left-2 sm:left-3" : "right-2 sm:right-3"
      } bottom-8 sm:bottom-12 z-40 flex flex-col items-center gap-3.5 bg-transparent pointer-events-auto`}
    >
      {/* 1. LINKEDIN SOCIAL LINK */}
      <a
        href="https://www.linkedin.com/company/leela-gulf-fzc/"
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn"
        className="relative group flex items-center justify-center p-1 bg-transparent hover:scale-115 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <FiLinkedin className="w-6 h-6 sm:w-7 sm:h-7 text-gold-main group-hover:text-gold-light transition-colors duration-300" strokeWidth={1.3} />

        {/* Floating Tooltip */}
        <span
          className={`absolute ${
            isRTL ? "left-full ml-3" : "right-full mr-3"
          } top-1/2 -translate-y-1/2 whitespace-nowrap bg-card-dark text-gold-light border border-gold-main/40 text-xs font-heading font-semibold px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300`}
        >
          LinkedIn
        </span>
      </a>

      {/* 2. INSTAGRAM SOCIAL LINK */}
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        title="Instagram"
        className="relative group flex items-center justify-center p-1 bg-transparent hover:scale-115 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <FiInstagram className="w-6 h-6 sm:w-7 sm:h-7 text-gold-main group-hover:text-gold-light transition-colors duration-300" strokeWidth={1.3} />

        {/* Floating Tooltip */}
        <span
          className={`absolute ${
            isRTL ? "left-full ml-3" : "right-full mr-3"
          } top-1/2 -translate-y-1/2 whitespace-nowrap bg-card-dark text-gold-light border border-gold-main/40 text-xs font-heading font-semibold px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300`}
        >
          Instagram
        </span>
      </a>
    </aside>
  );
}
