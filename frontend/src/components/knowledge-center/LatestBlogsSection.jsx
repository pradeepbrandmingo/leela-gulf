"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Search, SlidersHorizontal, Calendar, ArrowRight, ChevronDown, Check, X, RotateCcw, BookOpen, Loader2 } from "lucide-react";
import { apiRequest } from "@/config/api";

function LatestBlogsContent() {
  const { isRTL } = useLanguage();
  const searchParams = useSearchParams();

  // State for live blogs (Defaults to empty array - NO dummy blogs on load/refresh)
  const [blogsList, setBlogsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Read URL search params on mount or param changes
  useEffect(() => {
    const catParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    if (catParam) {
      setSelectedCategory(catParam.toUpperCase());
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Fetch Live Published Blogs from API
  useEffect(() => {
    async function loadLiveBlogs() {
      setIsLoading(true);
      try {
        const res = await apiRequest("/blogs?status=Published", { silent: true });
        if (res?.success && Array.isArray(res.data)) {
          setBlogsList(res.data);
        } else {
          setBlogsList([]);
        }
      } catch (err) {
        console.warn("Backend /api/blogs error:", err?.message);
        setBlogsList([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadLiveBlogs();
  }, []);

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

  // Dynamic Categories Options computation from live MongoDB blogs
  const dynamicCategoryOptions = useMemo(() => {
    const baseOptions = [
      { key: "ALL", label: "All Categories", labelAr: "جميع التصنيفات" },
      { key: "COMPLIANCE", label: "Compliance", labelAr: "الامتثال والتنظيم" },
      { key: "QUALITY", label: "Quality", labelAr: "ضمان الجودة" },
      { key: "INDUSTRY INSIGHTS", label: "Industry Insights", labelAr: "رؤى القطاع" },
      { key: "REGULATIONS", label: "Regulations", labelAr: "اللوائح العامة" },
      { key: "TECHNOLOGY", label: "Technology", labelAr: "التقنية والابتكار" },
      { key: "LEELA GULF UPDATES", label: "Leela Gulf Updates", labelAr: "تحديثات ليلا جلف" },
    ];

    const categoryTranslations = {
      compliance: "الامتثال والتنظيم",
      quality: "ضمان الجودة",
      "quality assurance": "ضمان الجودة",
      "industry insights": "رؤى القطاع",
      "industry trends": "اتجاهات الصناعة",
      regulations: "اللوائح العامة",
      technology: "التقنية والابتكار",
      "leela gulf updates": "تحديثات ليلا جلف",
      sustainability: "الاستدامة",
      general: "عام",
    };

    const uniqueCats = new Set();
    blogsList.forEach((b) => {
      if (b?.category) uniqueCats.add(b.category.trim());
      if (Array.isArray(b?.categories)) {
        b.categories.forEach((c) => c && uniqueCats.add(c.trim()));
      }
    });

    const result = [{ key: "ALL", label: "All Categories", labelAr: "جميع التصنيفات" }];

    uniqueCats.forEach((cat) => {
      const upper = cat.toUpperCase();
      const lower = cat.toLowerCase();
      if (!result.some((r) => r.key === upper)) {
        result.push({
          key: upper,
          label: cat,
          labelAr: categoryTranslations[lower] || cat,
        });
      }
    });

    baseOptions.forEach((b) => {
      if (!result.some((r) => r.key === b.key)) {
        result.push(b);
      }
    });

    return result;
  }, [blogsList]);

  // Filtered & Sorted Blogs Computation (Real-Time Search & Category Filter)
  const filteredBlogs = useMemo(() => {
    return blogsList.filter((blog) => {
      // Exclude drafts
      if (blog.status && blog.status !== "Published") return false;

      const titleText = isRTL ? (blog.titleAr || blog.title || "") : (blog.title || "");
      const excerptText = isRTL ? (blog.excerptAr || blog.excerpt || "") : (blog.excerpt || "");
      const categoryText = (blog.category || "").toUpperCase();
      const categoryArText = (blog.categoryAr || "").toUpperCase();
      const authorText = isRTL ? (blog.authorAr || blog.author || "") : (blog.author || "");
      const tags = Array.isArray(blog.categories) ? blog.categories.map((c) => (c || "").toUpperCase()) : [];

      // Multi-Field Search (Matches title, excerpt, category, tags, author, slug)
      const searchLower = searchTerm.trim().toLowerCase();
      const matchesSearch =
        searchLower === "" ||
        titleText.toLowerCase().includes(searchLower) ||
        excerptText.toLowerCase().includes(searchLower) ||
        authorText.toLowerCase().includes(searchLower) ||
        categoryText.toLowerCase().includes(searchLower) ||
        categoryArText.toLowerCase().includes(searchLower) ||
        tags.some((t) => t.toLowerCase().includes(searchLower)) ||
        (blog.slug || "").toLowerCase().includes(searchLower);

      // Category Filter Matching
      const matchesCategory =
        selectedCategory === "ALL" ||
        categoryText === selectedCategory ||
        categoryText.includes(selectedCategory) ||
        tags.includes(selectedCategory) ||
        tags.some((t) => t.includes(selectedCategory));

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      const timeA = a.timestamp || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      const timeB = b.timestamp || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
      if (sortBy === "LATEST") return timeB - timeA;
      return timeA - timeB;
    });
  }, [blogsList, searchTerm, selectedCategory, sortBy, isRTL]);

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

  const isCatActive = selectedCategory !== "ALL";
  const selectedCatObj = dynamicCategoryOptions.find((c) => c.key === selectedCategory);
  const selectedCatLabel = isRTL ? (selectedCatObj?.labelAr || selectedCatObj?.label) : (selectedCatObj?.label || "Categories");

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
                    ? "ابحث بالعنوان، الكاتب، الوسم..."
                    : "Search blogs by title, tags, keyword..."
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
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold flex items-center justify-between sm:justify-start gap-2.5 transition-all shadow-md cursor-pointer outline-none border ${
                    isCatActive
                      ? "bg-gradient-gold-animated text-black border-transparent font-extrabold shadow-lg"
                      : "bg-transparent text-white border-gold-main/50 hover:border-gold-light hover:text-gold-light"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <SlidersHorizontal className={`w-3.5 h-3.5 shrink-0 ${isCatActive ? "text-black stroke-[2.5]" : "text-gold-light stroke-[2.2]"}`} />
                    <span className={`truncate ${isCatActive ? "text-black font-extrabold" : "text-white"}`}>
                      {selectedCategory === "ALL"
                        ? isRTL
                          ? "التصنيفات"
                          : "Categories"
                        : selectedCatLabel}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${isCatActive ? "text-black stroke-[2.5]" : "text-gold-light"} ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Categories Popup Menu */}
                {isCategoryOpen && (
                  <div className="absolute left-0 rtl:left-auto rtl:right-0 top-full mt-2 w-64 bg-[#14161d] border border-gold-main/40 rounded-xl shadow-2xl z-50 overflow-hidden py-1.5 max-h-72 overflow-y-auto animate-[fadeIn_0.15s_ease-out]">
                    {dynamicCategoryOptions.map((cat) => {
                      const isSelected = selectedCategory === cat.key;
                      return (
                        <div
                          key={cat.key}
                          onClick={() => {
                            setSelectedCategory(cat.key);
                            setIsCategoryOpen(false);
                          }}
                          className={`px-4 py-2.5 text-xs font-subheading flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-gold-main/20 text-gold-light font-bold"
                              : "text-gray-300 hover:bg-[#1a1d28] hover:text-white"
                          }`}
                        >
                          <span className="truncate">{isRTL ? cat.labelAr : cat.label}</span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-gold-light shrink-0 ml-2" />
                          )}
                        </div>
                      );
                    })}
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
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-44 bg-[#14161d] border border-gold-main/40 rounded-xl shadow-2xl z-50 overflow-hidden py-1.5 animate-[fadeIn_0.15s_ease-out]">
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
                        <Check className="w-4 h-4 text-gold-light shrink-0" />
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
                        <Check className="w-4 h-4 text-gold-light shrink-0" />
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            ACTIVE FILTERS CHIP BAR
            ═══════════════════════════════════════════ */}
        {hasActiveFilters && (
          <div className="flex items-center flex-wrap gap-2 mb-6 sm:mb-8 text-xs">
            <span className="text-gray-400 font-subheading">
              {isRTL ? "الفلاتر النشطة:" : "Active Filters:"}
            </span>

            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-main/15 text-gold-light border border-gold-main/30 font-subheading">
                <span>&ldquo;{searchTerm}&rdquo;</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-white"
                  onClick={() => setSearchTerm("")}
                />
              </span>
            )}

            {selectedCategory !== "ALL" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-main/15 text-gold-light border border-gold-main/30 font-subheading">
                <span>
                  {dynamicCategoryOptions.find((c) => c.key === selectedCategory)?.[
                    isRTL ? "labelAr" : "label"
                  ] || selectedCategory}
                </span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-white"
                  onClick={() => setSelectedCategory("ALL")}
                />
              </span>
            )}

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-gray-400 hover:text-gold-light transition-colors ml-1 font-subheading cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isRTL ? "إعادة تعيين" : "Reset All"}</span>
            </button>
          </div>
        )}

        {/* Showing Count Indicator */}
        <div className="text-xs font-subheading text-gray-400 mb-6 flex items-center justify-between">
          <span>
            {isLoading
              ? (isRTL ? "جاري تحميل المقالات..." : "Loading articles...")
              : (isRTL
                ? `عرض ${filteredBlogs.length} من أصل ${blogsList.length} مقالات`
                : `Showing ${filteredBlogs.length} of ${blogsList.length} articles`)}
          </span>
        </div>

        {/* ═══════════════════════════════════════════
            BLOGS CARDS GRID / SIMPLE SPINNER / EMPTY STATE
            ═══════════════════════════════════════════ */}
        {isLoading ? (
          /* Simple Clean Luxury Spinner Loading */
          <div className="w-full py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-gold-main" />
            <span className="font-heading text-xs sm:text-sm text-gray-400 font-semibold tracking-wide">
              {isRTL ? "جاري تحميل المقالات..." : "Loading articles..."}
            </span>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-7">
            {paginatedBlogs.map((blog, idx) => {
              const title = isRTL ? (blog.titleAr || blog.title) : blog.title;
              const excerpt = isRTL ? (blog.excerptAr || blog.excerpt) : blog.excerpt;
              const category = isRTL ? (blog.categoryAr || blog.category) : (blog.category || "General");
              const date = isRTL ? (blog.dateAr || blog.date) : blog.date;
              const image = blog.heroImage || blog.image || "/images/blogimage/blogdetails.jpg";
              const targetSlug = blog.slug || blog.id || `article-${idx + 1}`;

              return (
                <div
                  key={blog._id || blog.slug || blog.id || idx}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-white/10"
                >
                  {/* Top Image Container */}
                  <Link
                    href={`/knowledge-center/${targetSlug}`}
                    className="relative w-full h-52 sm:h-56 bg-gray-950 overflow-hidden cursor-pointer block"
                  >
                    <Image
                      src={image}
                      alt={title || "Blog Image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  </Link>

                  {/* Card Content Body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-white text-black">
                    
                    {/* Meta Row: Category Badge + Date */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-heading font-bold text-[10.5px] uppercase tracking-wider text-gold-dark">
                          {category}
                        </span>

                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-subheading">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{date}</span>
                        </div>
                      </div>

                      {/* Article Title */}
                      <Link href={`/knowledge-center/${targetSlug}`} className="block">
                        <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 leading-snug line-clamp-2 group-hover:text-gold-dark transition-colors cursor-pointer mb-2.5">
                          {title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="font-subheading text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                        {excerpt}
                      </p>
                    </div>

                    {/* Bottom Action: Read More Link */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href={`/knowledge-center/${targetSlug}`}
                        className="inline-flex items-center gap-1.5 font-heading font-bold text-xs sm:text-sm text-gold-dark hover:text-black transition-colors group-hover:gap-2 duration-200 cursor-pointer"
                      >
                        <span>{isRTL ? "اقرأ المزيد" : "Read More"}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 text-gold-dark group-hover:text-black" />
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full py-16 text-center rounded-3xl border border-dashed border-gold-main/30 bg-[#12141a] px-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-gold-main/15 text-gold-light flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-1.5">
              {isRTL ? "لم يتم العثور على مقالات" : "No Articles Found"}
            </h3>
            <p className="font-subheading text-xs text-gray-400 max-w-md mx-auto mb-5">
              {isRTL
                ? "لم نتمكن من العثور على أي مقالات تطابق بحثك الحالي. جرب استخدام كلمات بحث مختلفة أو تغيير التصنيف."
                : "We couldn't find any articles matching your search criteria. Try using different keywords or resetting filters."}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-5 py-2.5 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs hover:scale-105 transition-all shadow-md cursor-pointer"
            >
              {isRTL ? "إعادة تعيين الفلاتر" : "Reset Filters"}
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            PAGINATION: LOAD MORE BUTTON
            ═══════════════════════════════════════════ */}
        {!isLoading && filteredBlogs.length > visibleCount && (
          <div className="text-center mt-10 sm:mt-14">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-8 py-3 rounded-2xl bg-transparent border-2 border-gold-main text-gold-light font-heading font-bold text-xs sm:text-sm hover:bg-gradient-gold-animated hover:text-black hover:border-transparent transition-all shadow-lg hover:shadow-gold-main/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isRTL ? "عرض المزيد من المقالات" : "Load More Articles"}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

export default function LatestBlogsSection() {
  return (
    <Suspense fallback={
      <div className="w-full py-24 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold-main" />
        <span className="font-heading text-xs text-gray-400">Loading articles...</span>
      </div>
    }>
      <LatestBlogsContent />
    </Suspense>
  );
}
