"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, Eye, Home } from "lucide-react";

/**
 * BlogDetailsHero - Dynamic Hero Banner for Blog Article Details Page:
 * - Title formatted with signature Running Gold Shimmer (text-gradient-gold-animated) matching Screenshot #2 100%!
 * - Dynamic Card Background Image.
 * - Top Breadcrumb: Home / Blogs / {Blog Title} matching Screenshot #3.
 * - Meta Bar: Date | Read Time | Views.
 * - Global Aspect Ratio & Dimensions matching CareersHero & KnowledgeCenterHero 100%.
 */
export default function BlogDetailsHero({ blog }) {
  const { isRTL } = useLanguage();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fallback defaults
  const category = blog ? (isRTL ? blog.categoryAr : blog.category) : "COMPLIANCE";
  const title = blog
    ? isRTL
      ? blog.titleAr
      : blog.title
    : "Understanding the Latest Compliance Regulations 2026";
  
  const titlePrefix = blog
    ? isRTL
      ? blog.titlePrefixAr || ""
      : blog.titlePrefix || ""
    : "Understanding the Latest ";
    
  const titleGold = blog
    ? isRTL
      ? blog.titleGoldAr || title
      : blog.titleGold || title
    : "Compliance Regulations 2026";

  const titleSuffix = blog
    ? isRTL
      ? blog.titleSuffixAr || ""
      : blog.titleSuffix || ""
    : "";

  const excerpt = blog
    ? isRTL
      ? blog.excerptAr
      : blog.excerpt
    : "A comprehensive guide to key regulatory changes and how businesses can stay compliant and ahead.";
  const date = blog ? (isRTL ? blog.dateAr : blog.date) : "20 May 2026";
  const readTime = blog ? (isRTL ? blog.readTimeAr : blog.readTime) : "5 Min Read";
  const views = blog ? (isRTL ? blog.viewsAr : blog.views) : "1.2K Views";

  // Exact background image from clicked blog card
  const heroBgImage = blog?.heroImage || blog?.image || "/images/blogimage/blogdetails.jpg";

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--color-primary)] pt-16 sm:pt-24 md:pt-28 pb-4 sm:pb-10 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* ═══════════════════════════════════════════
            TOP BREADCRUMB BAR (Home / Blogs / {Blog Title})
            ═══════════════════════════════════════════ */}
        <div className="flex items-center gap-1.5 text-xs font-subheading text-gray-400 mb-3 sm:mb-5 overflow-hidden text-ellipsis whitespace-nowrap">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-gold-main transition-colors shrink-0"
          >
            <Home className="w-3.5 h-3.5 text-gray-400 hover:text-gold-main" />
            <span>{isRTL ? "الرئيسية" : "Home"}</span>
          </Link>

          <span className="text-gray-600">/</span>

          <Link
            href="/knowledge-center"
            className="hover:text-gold-main transition-colors shrink-0"
          >
            <span>{isRTL ? "مركز المعرفة" : "Knowledge Center"}</span>
          </Link>

          <span className="text-gray-600">/</span>

          <span className="font-bold text-white truncate max-w-[280px] sm:max-w-md lg:max-w-xl">
            {title}
          </span>
        </div>

        {/* ═══════════════════════════════════════════
            MAIN HERO CARD CONTAINER
            Matches CareersHero & KnowledgeCenterHero Dimensions 100%
            ═══════════════════════════════════════════ */}
        <div
          className={`relative rounded-xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden bg-[var(--color-primary)] shadow-2xl transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Aspect Ratio Container (Global Hero Specs) */}
          <div className="relative w-full aspect-[1.7/1] sm:aspect-[2.4/1] md:aspect-[2.6/1] lg:aspect-[2.9/1] min-h-[280px] sm:min-h-[420px] md:min-h-[460px]">

            {/* Dummy Photo Background Image */}
            <Image
              src={heroBgImage}
              alt={title}
              fill
              className={`object-cover opacity-85 sm:opacity-100 ${
                isRTL ? "object-left sm:object-left" : "object-right sm:object-right"
              }`}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
            />

            {/* ═══════════════════════════════════════════
                DIRECTION-AWARE GRADIENT OVERLAY (RTL / LTR)
                ═══════════════════════════════════════════ */}
            {isRTL ? (
              /* ARABIC (RTL): Dark Overlay starts from RIGHT and fades to LEFT */
              <div className="absolute top-0 bottom-0 right-0 left-auto w-full sm:w-[82%] md:w-[78%] lg:w-[72%] bg-gradient-to-l from-[var(--color-primary)] via-[var(--color-primary)] via-50% to-transparent z-0" />
            ) : (
              /* ENGLISH (LTR): Dark Overlay starts from LEFT and fades to RIGHT */
              <div className="absolute top-0 bottom-0 left-0 right-auto w-full sm:w-[82%] md:w-[78%] lg:w-[72%] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)] via-50% to-transparent z-0" />
            )}

            {/* Mobile Top/Bottom Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 via-transparent to-[var(--color-primary)]/40 sm:hidden z-0" />

            {/* ═══════════════════════════════════════════
                TEXT CONTENT OVERLAY CONTAINER
                Matches Reference Screenshot #2 100%
                ═══════════════════════════════════════════ */}
            <div
              className={`absolute top-0 bottom-0 flex flex-col justify-center z-10 ${
                isRTL
                  ? "right-0 left-auto w-full sm:w-[78%] md:w-[74%] lg:w-[66%] pr-5 sm:pr-10 md:pr-14 lg:pr-16 pl-4 text-right items-start"
                  : "left-0 right-auto w-full sm:w-[78%] md:w-[74%] lg:w-[66%] pl-5 sm:pl-10 md:pl-14 lg:pl-16 pr-4 text-left items-start"
              }`}
            >
              {/* Category Badge ONLY */}
              <div
                className={`mb-2 sm:mb-3 transition-all duration-700 delay-200 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span className="px-3.5 py-1 rounded-full bg-gold-main/20 border border-gold-main/40 font-heading font-bold text-[10px] sm:text-xs tracking-wider text-gold-light uppercase drop-shadow">
                  {category}
                </span>
              </div>

              {/* Main Article Title (With Running Gold Shimmer & Balanced 2-Line Formatting) */}
              <h1
                className={`font-heading font-bold text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.5rem] text-white leading-[1.25] sm:leading-[1.2] tracking-tight max-w-full sm:max-w-xl md:max-w-2xl mb-2 sm:mb-3 [text-wrap:balance] transition-all duration-700 delay-400 ease-out drop-shadow-md ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <span>{titlePrefix}</span>
                <span className="text-gradient-gold-animated">{titleGold}</span>
                <span>{titleSuffix}</span>
              </h1>

              {/* Short Description / Excerpt (Protected with line-clamp against extra long CMS content) */}
              <p
                className={`font-subheading text-gray-300 text-xs sm:text-sm md:text-base max-w-full sm:max-w-xl lg:max-w-2xl leading-relaxed mb-3 sm:mb-5 line-clamp-3 sm:line-clamp-4 transition-all duration-700 delay-500 ease-out drop-shadow-sm ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {excerpt}
              </p>

              {/* Gold Accent Dash */}
              <div className="w-10 sm:w-16 h-[2.5px] sm:h-[3px] bg-gradient-gold-animated rounded-full mb-3 sm:mb-4" />

              {/* Article Meta Bar: Date | Read Time | Views */}
              <div
                className={`flex flex-wrap items-center gap-2 sm:gap-3.5 text-[11px] sm:text-xs text-gray-200 font-subheading transition-all duration-700 delay-600 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                {/* Date */}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-main" />
                  <span>{date}</span>
                </div>

                <span className="text-gray-500 font-light">|</span>

                {/* Read Time */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-main" />
                  <span>{readTime}</span>
                </div>

                <span className="text-gray-500 font-light">|</span>

                {/* Views Count (Eye Icon) */}
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-gold-main" />
                  <span>{views}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
