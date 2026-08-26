"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Search, SlidersHorizontal, Calendar, ArrowRight, ChevronDown, Check, X, RotateCcw, BookOpen } from "lucide-react";
import { BLOGS_DATA } from "@/data/blogsData";

const CATEGORY_OPTIONS = [
  { key: "ALL", label: "All Categories", labelAr: "جميع التصنيفات" },
  { key: "COMPLIANCE", label: "Compliance", labelAr: "الامتثال والتنظيم" },
  { key: "QUALITY", label: "Quality Assurance", labelAr: "ضمان الجودة" },
  {
    key: "INDUSTRY INSIGHTS",
    label: "Industry Insights",
    labelAr: "رؤى القطاع",
  },
  {
    key: "LEELA GULF UPDATES",
    label: "Leela Gulf Updates",
    labelAr: "تحديثات ليلا جلف",
  },
];

export default function LatestBlogsSection() {
  const { isRTL } = useLanguage();

  // Filter & Search Controls State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("LATEST"); // LATEST | OLDEST
  
  // UI Dropdown Toggles & Pagination Limit
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4); // Default 4 cards

  const categoryRef = useRef(null);
  const sortRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered & Sorted Blogs Computation
  const filteredBlogs = useMemo(() => {
    return BLOGS_DATA.filter((blog) => {
      const titleText = isRTL ? blog.titleAr : blog.title;
      const categoryText = blog.category;
      const excerptText = isRTL ? blog.excerptAr : blog.excerpt;

      const matchesSearch =
        searchTerm.trim() === "" ||
        titleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        excerptText.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || categoryText === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === "LATEST") return b.timestamp - a.timestamp;
      return a.timestamp - b.timestamp;
    });
  }, [searchTerm, selectedCategory, sortBy, isRTL]);

  // Reset pagination count when filter changes
  useEffect(() => {
    setVisibleCount(4);
  }, [searchTerm, selectedCategory, sortBy]);

  const hasActiveFilters =
    searchTerm.trim() !== "" || selectedCategory !== "ALL";

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setSortBy("LATEST");
  };

  const paginatedBlogs = filteredBlogs.slice(0, visibleCount);

  return (
    <section className="w-full bg-[var(--color-primary)] py-8 sm:py-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ═══════════════════════════════════════════
            SECTION HEADER & CONTROLS BAR
            ═══════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 mb-6 sm:mb-10">
          
          {/* Section Main Title */}
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-1.5">
              {isRTL ? (
                <>
                  أحدث{" "}
                  <span className="text-gradient-gold-animated">المدونات</span>
                </>
              ) : (
                <>
                  Latest{" "}
                  <span className="text-gradient-gold-animated">Blogs</span>
                </>
              )}
            </h2>
            <div className="w-12 h-[2.5px] bg-gradient-gold-animated rounded-full" />
          </div>

          {/* Controls Container */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">

            {/* Search Bar */}
            <div className="relative w-full sm:w-72 md:w-80 flex items-center">
              <Search className="w-4 h-4 text-gold-light absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  isRTL
                    ? "ابحث عن المدونات..."
                    : "Search blogs by title, keyword..."
                }
                className="w-full pl-10 pr-9 rtl:pr-10 rtl:pl-9 py-2.5 rounded-xl bg-transparent border border-gold-main/50 text-white text-xs font-subheading placeholder-gray-400 outline-none focus:border-gold-light focus:ring-1 focus:ring-gold-light transition-all shadow-md"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 rtl:left-3 rtl:right-auto text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter & Sort Buttons */}
            <div className="flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto">

              {/* Categories Filter Dropdown */}
              <div ref={categoryRef} className="relative flex-1 sm:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                    setIsSortOpen(false);
                  }}
                  className={`w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center justify-between sm:justify-start gap-2 transition-all shadow-md cursor-pointer outline-none border ${
                    selectedCategory !== "ALL"
                      ? "bg-gradient-gold-animated text-black border-transparent"
                      : "bg-transparent text-white border-gold-main/50 hover:border-gold-light hover:text-gold-light"
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.2] shrink-0 text-gold-light" />
                    <span className="truncate">
                      {selectedCategory === "ALL"
                        ? isRTL
                          ? "التصنيفات"
                          : "Categories"
                        : CATEGORY_OPTIONS.find(
                            (c) => c.key === selectedCategory,
                          )?.[isRTL ? "labelAr" : "label"]}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 text-gold-light transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Categories Popup Menu */}
                {isCategoryOpen && (
                  <div className="absolute left-0 rtl:left-auto rtl:right-0 top-full mt-2 w-56 bg-[#14161d] border border-gold-main/40 rounded-xl shadow-2xl z-50 overflow-hidden py-1.5 animate-[fadeIn_0.15s_ease-out]">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <div
                        key={cat.key}
                        onClick={() => {
                          setSelectedCategory(cat.key);
                          setIsCategoryOpen(false);
                        }}
                        className={`px-4 py-2.5 text-xs font-subheading flex items-center justify-between cursor-pointer transition-colors ${
                          selectedCategory === cat.key
                            ? "bg-gold-main/20 text-gold-light font-bold"
                            : "text-gray-300 hover:bg-[#1a1d28] hover:text-white"
                        }`}
                      >
                        <span>{isRTL ? cat.labelAr : cat.label}</span>
                        {selectedCategory === cat.key && (
                          <Check className="w-4 h-4 text-gold-light shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div ref={sortRef} className="relative flex-1 sm:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-transparent border border-gold-main/50 text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-between sm:justify-start gap-2 shadow-md cursor-pointer outline-none hover:border-gold-light hover:text-gold-light transition-colors"
                >
                  <span className="truncate">
                    {sortBy === "LATEST"
                      ? isRTL
                        ? "الأحدث أولاً"
                        : "Latest First"
                      : isRTL
                        ? "الأقدم أولاً"
                        : "Oldest First"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gold-light shrink-0 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Sort Popup Menu */}
                {isSortOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-44 bg-[#14161d] border border-gold-main/40 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-[fadeIn_0.15s_ease-out]">
                    <div
                      onClick={() => {
                        setSortBy("LATEST");
                        setIsSortOpen(false);
                      }}
                      className={`px-4 py-2.5 text-xs font-subheading flex items-center justify-between cursor-pointer transition-colors ${
                        sortBy === "LATEST"
                          ? "bg-gold-main/20 text-gold-light font-bold"
                          : "text-gray-300 hover:bg-[#1a1d28] hover:text-white"
                      }`}
                    >
                      <span>{isRTL ? "الأحدث أولاً" : "Latest First"}</span>
                      {sortBy === "LATEST" && (
                        <Check className="w-4 h-4 text-gold-light" />
                      )}
                    </div>
                    <div
                      onClick={() => {
                        setSortBy("OLDEST");
                        setIsSortOpen(false);
                      }}
                      className={`px-4 py-2.5 text-xs font-subheading flex items-center justify-between cursor-pointer transition-colors ${
                        sortBy === "OLDEST"
                          ? "bg-gold-main/20 text-gold-light font-bold"
                          : "text-gray-300 hover:bg-[#1a1d28] hover:text-white"
                      }`}
                    >
                      <span>{isRTL ? "الأقدم أولاً" : "Oldest First"}</span>
                      {sortBy === "OLDEST" && (
                        <Check className="w-4 h-4 text-gold-light" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-3 py-2.5 rounded-xl bg-gray-800 text-gold-light hover:bg-gray-700 font-heading font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {isRTL ? "إعادة ضبط" : "Reset"}
                  </span>
                </button>
              )}

            </div>

          </div>

        </div>

        {/* Active Search & Count Summary Bar */}
        <div className="flex items-center justify-between text-xs font-subheading text-gray-400 mb-6 px-1">
          <span>
            {isRTL
              ? `عرض ${paginatedBlogs.length} من أصل ${filteredBlogs.length} مقال`
              : `Showing ${paginatedBlogs.length} of ${filteredBlogs.length} articles`}
          </span>
          {hasActiveFilters && (
            <span className="text-gold-light font-bold">
              {isRTL ? "تصفية نشطة" : "Filtered view active"}
            </span>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            BLOG CARDS GRID CONTAINER (Clean Dummy Images for All Cards)
            ═══════════════════════════════════════════ */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white/5 rounded-3xl border border-white/10 px-4">
            <BookOpen className="w-12 h-12 text-gold-main mx-auto mb-3 opacity-80" />
            <h4 className="font-heading font-bold text-lg text-white mb-1">
              {isRTL ? "لم يتم العثور على مدونات" : "No Articles Found"}
            </h4>
            <p className="font-subheading text-gray-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
              {isRTL
                ? "لا توجد نتائج تطابق معايير البحث أو التصنيف المحدد. يرجى تجربة كلمات بحث أخرى."
                : "No blogs match your search query or selected category. Try clearing filters to view all articles."}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isRTL ? "إعادة عرض الكل" : "View All Blogs"}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {paginatedBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/knowledge-center/${blog.slug}`}
                className="bg-white rounded-2xl p-0 overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between border border-gray-100 group cursor-pointer h-full"
              >
                <div>
                  {/* Top Image Container (Standard High-Res Photo Image) */}
                  <div className="h-44 sm:h-48 w-full relative overflow-hidden bg-gray-950">
                    <Image
                      src={blog.heroImage || "/images/blogimage/blogdetails.jpg"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5">
                    {/* Meta Row: Category + Date */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="font-heading font-bold text-[10.5px] text-gold-main uppercase tracking-wider truncate">
                        {isRTL ? blog.categoryAr : blog.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500 font-subheading text-[11px] shrink-0">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{isRTL ? blog.dateAr : blog.date}</span>
                      </div>
                    </div>

                    {/* Blog Title */}
                    <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900 leading-snug mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-gold-main transition-colors">
                      {isRTL ? blog.titleAr : blog.title}
                    </h3>

                    {/* Blog Excerpt */}
                    <p className="font-subheading text-xs text-gray-600 leading-relaxed line-clamp-2 min-h-[2.25rem]">
                      {isRTL ? blog.excerptAr : blog.excerpt}
                    </p>
                  </div>
                </div>

                {/* Read More Footer */}
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                  <div className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-gold-main group-hover:gap-2.5 transition-all">
                    <span>{isRTL ? "اقرأ المزيد" : "Read More"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-main stroke-[2.2] rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════
            PAGINATION / LOAD MORE BUTTON
            ═══════════════════════════════════════════ */}
        {visibleCount < filteredBlogs.length && (
          <div className="mt-10 sm:mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-7 py-3 rounded-2xl bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
            >
              <span>
                {isRTL ? "تحميل المزيد من المقالات" : "Load More Articles"}
              </span>
              <ChevronDown className="w-4 h-4 text-black stroke-[2.5]" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
