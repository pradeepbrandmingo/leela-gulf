"use client";

import { useLanguage } from "@/context/LanguageContext";

/**
 * FloatingSidebar - Transparent Floating Social Media Icons (LinkedIn & Instagram).
 * Placed at Bottom Right across all pages.
 * Features:
 * 1. 100% Transparent background (NO dark card container box).
 * 2. Tight right side spacing (right-2 sm:right-3).
 * 3. Clean SVG line-art icons matching exact UI spec (0 export errors).
 * 4. Pure global gold color palette.
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
        href="https://www.linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn"
        className="relative group flex items-center justify-center p-1 bg-transparent hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8 text-gold-light hover:text-gold-main drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-colors duration-300"
        >
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <line x1="7" y1="10" x2="7" y2="17" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
          <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
          <line x1="11" y1="10" x2="11" y2="17" />
        </svg>

        {/* Floating Tooltip */}
        <span
          className={`absolute ${
            isRTL ? "left-full ml-3" : "right-full mr-3"
          } top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#16181f] text-white border border-gold-main/40 text-xs font-heading font-semibold px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300`}
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
        className="relative group flex items-center justify-center p-1 bg-transparent hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8 text-gold-light hover:text-gold-main drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-colors duration-300"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>

        {/* Floating Tooltip */}
        <span
          className={`absolute ${
            isRTL ? "left-full ml-3" : "right-full mr-3"
          } top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#16181f] text-white border border-gold-main/40 text-xs font-heading font-semibold px-2.5 py-1 rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300`}
        >
          Instagram
        </span>
      </a>
    </aside>
  );
}
