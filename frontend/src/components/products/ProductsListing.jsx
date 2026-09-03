"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { X, Loader2, FlaskConical, ArrowRight, SlidersHorizontal, Search } from "lucide-react";
import { apiRequest } from "@/config/api";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";

// Official 11 Leela Gulf Industries for Category Filtering
export const OFFICIAL_CATEGORIES = [
  { id: "all", name: "All Products", nameAr: "جميع المنتجات" },
  { id: "industrial-chemicals", name: "Industrial Chemicals", nameAr: "كيماويات صناعية", matchNames: ["Industrial Chemicals"] },
  { id: "water-treatment", name: "Water Treatment", nameAr: "معالجة المياه", matchNames: ["Water Treatment"] },
  { id: "home-care-personal-care", name: "Home Care & Personal Care (LEEPOL®)", nameAr: "العناية المنزلية والشخصية (LEEPOL®)", matchNames: ["Home Care & Personal Care (LEEPOL®)", "Home Care", "Personal Care"] },
  { id: "pharmaceuticals-api-excipients", name: "Pharmaceuticals API & Excipients", nameAr: "المواد الفعالة والسواغ الدوائية", matchNames: ["Pharmaceuticals API & Excipients", "Pharmaceuticals"] },
  { id: "food-beverage-chemicals", name: "Food & Beverage chemicals", nameAr: "كيماويات الأغذية والمشروبات", matchNames: ["Food & Beverage chemicals", "Food & Beverage"] },
  { id: "mining-metals", name: "Mining & Metals", nameAr: "التعدين والمعادن", matchNames: ["Mining & Metals"] },
  { id: "oil-gas", name: "Oil & Gas", nameAr: "النفط والغاز", matchNames: ["Oil & Gas"] },
  { id: "textile-chemicals", name: "Textile Chemicals", nameAr: "كيماويات النسيج", matchNames: ["Textile Chemicals"] },
  { id: "packaging-paper-pulp", name: "Packaging & Paper pulp industries", nameAr: "صناعات التعبئة ولب الورق", matchNames: ["Packaging & Paper pulp industries"] },
  { id: "fertilizers-chemicals", name: "Fertilizers chemicals", nameAr: "كيماويات الأسمدة", matchNames: ["Fertilizers chemicals", "Fertilizers"] },
  { id: "case-coatings-adhesives", name: "CASE – Coatings, Adhesives, Sealants & Elastomers", nameAr: "الطلاء والمواد اللاصقة ومانعات التسرب", matchNames: ["CASE – Coatings, Adhesives, Sealants & Elastomers", "CASE"] },
  { id: "other", name: "Other", nameAr: "أخرى", matchNames: ["Other"] },
];

const PRODUCTS_PER_PAGE = 9;

export default function ProductsListing() {
  const { isRTL } = useLanguage();

  // ── State ──
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState(null);
  const [dbProducts, setDbProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);
  const sectionRef = useRef(null);

  // Fetch live products from MongoDB Backend (Published Only)
  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await apiRequest("/products?status=Published", { silent: true });
        if (res?.success && Array.isArray(res.data)) {
          setDbProducts(res.data);
        }
      } catch (err) {
        console.log("Could not load live products from API");
      } finally {
        setIsLoading(false);
      }
    }
    loadLiveProducts();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Normalized Live Products from MongoDB (Published Only) ──
  const allProductsList = useMemo(() => {
    const publishedOnly = dbProducts.filter(
      (p) => (p.status || "Published") === "Published"
    );

    return publishedOnly.map((p) => {
      const loc = isRTL ? (p.ar?.title ? p.ar : p.en) : (p.en || p);
      const industryName = p.primaryIndustry || p.en?.primaryIndustry || "Industrial Chemicals";

      return {
        id: p.slug || p._id,
        slug: p.slug || p._id,
        title: loc?.title || p.title,
        code: p.code || "PRD",
        primaryIndustry: industryName,
        categoryTag: loc?.categoryTag || p.categoryTag || "CHEMICAL",
        description: loc?.shortOverview || p.en?.shortOverview || "",
        image: (p.images && p.images[0]) || "/images/prodcut/dummy-product.jpg",
        tdsUrl: p.tdsUrl || "",
        isLive: true,
      };
    });
  }, [dbProducts, isRTL]);

  // ── Derived: Active Category Object ──
  const activeCategory = useMemo(
    () => OFFICIAL_CATEGORIES.find((c) => c.id === selectedCategory) || OFFICIAL_CATEGORIES[0],
    [selectedCategory]
  );

  // ── Compute Category Product Counts ──
  const categoriesWithCounts = useMemo(() => {
    return OFFICIAL_CATEGORIES.map((cat) => {
      if (cat.id === "all") {
        return { ...cat, count: allProductsList.length };
      }
      const count = allProductsList.filter((p) => {
        return (cat.matchNames || [cat.name]).some((m) =>
          (p.primaryIndustry || "").toLowerCase().includes(m.toLowerCase())
        );
      }).length;
      return { ...cat, count };
    });
  }, [allProductsList]);

  // ── Filtered Products (search + category) ──
  const filteredProducts = useMemo(() => {
    let products = allProductsList;

    // Filter by category
    if (selectedCategory !== "all") {
      const selectedCatObj = OFFICIAL_CATEGORIES.find((c) => c.id === selectedCategory);
      if (selectedCatObj) {
        const matches = selectedCatObj.matchNames || [selectedCatObj.name];
        products = products.filter((p) =>
          matches.some((m) => (p.primaryIndustry || "").toLowerCase().includes(m.toLowerCase()))
        );
      }
    }

    // Filter by search query (real-time)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      products = products.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.code || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.primaryIndustry || "").toLowerCase().includes(q)
      );
    }

    return products;
  }, [allProductsList, selectedCategory, searchQuery]);

  // ── Pagination Logic ──
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // ── Handlers ──
  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoryDropdown(false);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        if (sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    },
    [totalPages]
  );

  // Generate page numbers for pagination bar
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[var(--color-primary)] py-8 sm:py-12 lg:py-16 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── TOP CONTROLS BAR: "Our Products" Heading (Left) + Gold Bordered Search (Center) + White Applications Button (Right) ── */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-12">
          
          {/* Left: Heading "Our Products" (Exact match with reference screenshot) */}
          <div className="shrink-0 max-w-full xl:max-w-md 2xl:max-w-xl">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight break-words">
              <span className="text-white">{isRTL ? "منتجاتنا " : "Our "}</span>
              <span className="text-gradient-gold-animated inline-block">{isRTL ? "المميزة" : "Products"}</span>
            </h2>
          </div>

          {/* Right Controls Container: Search Bar (Flex-1) + Applications Filter Button (Shrink-0) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 flex-1 xl:max-w-2xl justify-end w-full">
            
            {/* Center: Gold Bordered Search Input (Exact match with reference screenshot) */}
            <div className="relative flex-1 w-full min-w-0">
              <div className="flex items-center gap-2 p-1 sm:p-1.5 bg-black/40 border border-gold-main rounded-xl transition-all shadow-lg focus-within:border-gold-light focus-within:ring-1 focus-within:ring-gold-main/30">
                {/* White rounded-square icon box with gold magnifying glass */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gold-main stroke-[2.5]" />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isRTL ? "ابحث باسم المنتج..." : "Search By Product Name..."}
                  className="w-full bg-transparent px-2 py-1 text-xs sm:text-sm text-white placeholder-gray-400 font-subheading focus:outline-none truncate"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Solid White "Applications" Button & Dropdown (Exact match with reference screenshot) */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full sm:w-auto bg-white text-black font-heading font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-md hover:bg-gray-100 active:scale-98 transition-all flex items-center justify-between sm:justify-center gap-2.5 cursor-pointer select-none shrink-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <SlidersHorizontal className="w-4 h-4 text-black stroke-[2.2] shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-[200px] md:max-w-[220px]">
                    {isRTL
                      ? (selectedCategory === "all" ? "جميع المنتجات" : activeCategory.nameAr)
                      : (selectedCategory === "all" ? "All Products" : activeCategory.name)}
                  </span>
                </div>
                {selectedCategory !== "all" && (
                  <span className="w-2 h-2 rounded-full bg-gold-main shrink-0"></span>
                )}
              </button>

            {/* Applications Dropdown Menu */}
            {showCategoryDropdown && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-full sm:w-80 bg-[var(--color-primary-light)] border border-gold-main/40 rounded-2xl shadow-2xl py-2 z-50 max-h-80 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-[fadeIn_0.15s_ease-out]">
                {categoriesWithCounts.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full px-4 py-2.5 text-left rtl:text-right text-xs sm:text-sm font-subheading flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer ${
                        isSelected ? "text-gold-main font-bold bg-white/10" : "text-gray-300"
                      }`}
                    >
                      <span className="truncate pr-2 rtl:pr-0 rtl:pl-2">
                        {isRTL ? cat.nameAr : cat.name}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono shrink-0 ${
                        isSelected ? "bg-gold-main/20 text-gold-light border border-gold-main/30" : "bg-white/10 text-gray-400"
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

        {/* ── PRODUCTS GRID (3 Per Row) ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold-main animate-spin mb-3" />
            <p className="text-sm text-gray-400 font-semibold">Loading verified chemical products...</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {currentProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                isRTL={isRTL}
                onQuoteRequest={(p) => setQuoteProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-[#11131a]/60 rounded-3xl border border-[#252a38] p-6 sm:p-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-main/10 border border-gold-main/30 flex items-center justify-center mb-4 sm:mb-5 shadow-lg shadow-gold-main/5">
              <FlaskConical className="w-8 h-8 text-gold-main" />
            </div>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-white mb-2" style={{ fontWeight: 700 }}>
              {isRTL ? "لم يتم العثور على منتجات" : "No Products Found"}
            </h3>
            <p className="font-subheading text-gray-400 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
              {isRTL
                ? "لم تتم إضافة منتجات في هذا القسم بعد. يرجى إضافة منتجات جديدة من لوحة التحكم أو التواصل لطلب توريد مخصص."
                : "No products listed in this section yet. Contact our sourcing team for custom bulk supply."}
            </p>
            <Link
              href="/contact"
              className="btn-gold-primary px-5 sm:px-6 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wide inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>{isRTL ? "طلب توريد مخصص" : "Inquire for Sourcing"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>
        )}

        {/* ── PAGINATION BAR ── */}
        {totalProducts > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-10 border-t border-[#252a38]">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border border-gray-700 text-gray-400 hover:border-gold-main hover:text-gold-main disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                aria-label="Previous page"
              >
                ‹
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-500 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 cursor-pointer ${
                      currentPage === page
                        ? "bg-[#d6b92a] text-black font-extrabold shadow-sm shadow-gold-main/30"
                        : "border border-gray-700 text-gray-400 hover:border-gold-main hover:text-gold-main"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border border-gray-700 text-gray-400 hover:border-gold-main hover:text-gold-main disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                aria-label="Next page"
              >
                ›
              </button>
            </div>

            <p className="font-subheading text-sm text-gray-300">
              {isRTL ? (
                <>
                  عرض <span className="font-bold text-gold-main">{startIndex + 1}</span> إلى{" "}
                  <span className="font-bold text-gold-main">{endIndex}</span> من{" "}
                  <span className="font-bold text-gold-main">{totalProducts}</span> منتج
                </>
              ) : (
                <>
                  Showing <span className="font-bold text-gold-main">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-gold-main">{endIndex}</span> of{" "}
                  <span className="font-bold text-gold-main">{totalProducts}</span> Products
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* ── REQUEST QUOTE POPUP MODAL ── */}
      {quoteProduct && (
        <div
          onClick={() => setQuoteProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#0e1015] border border-gold-light/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto"
          >
            <button
              onClick={() => setQuoteProduct(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#1b1e2a] border border-[#2e3344] text-gray-400 hover:text-white hover:border-gold-light flex items-center justify-center transition-all cursor-pointer z-20"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 bg-[#161822] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-lg relative overflow-hidden">
              <div className="w-1.5 h-12 bg-gradient-gold-animated rounded-full shrink-0" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#1d202d] border border-[#33394a] overflow-hidden shrink-0">
                <Image
                  src={quoteProduct.image}
                  alt={quoteProduct.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="pr-8">
                <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-[#e8b958] block mb-1">
                  {isRTL ? "طلب عرض سعر للمنتج" : "Request Product Quote"}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl text-white leading-tight">
                  {quoteProduct.title}
                </h3>
                <p className="font-subheading text-xs sm:text-sm text-gray-400 mt-0.5">
                  {quoteProduct.code}
                </p>
              </div>
            </div>

            <LeadEnquiryForm
              sourcePage={`Product Listing Quote - ${quoteProduct.title}`}
              productName={quoteProduct.title}
              productSlug={quoteProduct.slug || quoteProduct.id || quoteProduct._id}
              productUrl={`/products/${quoteProduct.slug || quoteProduct.id || quoteProduct._id}`}
              showHeading={false}
              isModal={true}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function ProductCard({ product, isRTL, onQuoteRequest }) {
  return (
    <div className="group bg-white rounded-3xl p-4 sm:p-4.5 lg:p-5 border border-gray-100 hover:border-gold-main/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 flex flex-col justify-between">

      {/* Top Section: Image (Left) + Details (Right) */}
      <div className="flex flex-row items-start gap-3.5 sm:gap-4">

        {/* Left: Rounded Product Image (Clickable Link) */}
        <Link
          href={`/products/${product.slug || product.id}`}
          className="relative w-[44%] sm:w-[42%] aspect-square rounded-2xl bg-[#f5f5f7] overflow-hidden shrink-0 block group/img"
        >
          <Image
            src={product.image || "/images/prodcut/dummy-product.jpg"}
            alt={product.title || "Product"}
            fill
            className="object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 44vw, (max-width: 1024px) 20vw, 15vw"
          />
        </Link>

        {/* Right: Title, Code & Description */}
        <div className="flex-1 min-w-0 pt-0.5">
          {/* Product Title */}
          <h3
            className="font-heading font-bold text-[15px] sm:text-base lg:text-[17px] text-[#0d0e11] leading-snug mb-0.5 truncate"
            style={{ fontWeight: 700 }}
          >
            <Link
              href={`/products/${product.slug || product.id}`}
              className="hover:text-gold-main transition-colors"
            >
              {product.title}
            </Link>
          </h3>

          {/* Product Code */}
          <p className="font-subheading text-xs sm:text-[12.5px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wide truncate">
            {product.code}
          </p>

          {/* Description */}
          <p className="font-subheading text-xs sm:text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {product.description}
          </p>
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="flex items-center gap-3.5 sm:gap-4 mt-3.5 pt-3 border-t border-gray-100">
        {/* Left Action Box (Aligned under Image) */}
        <div className="w-[44%] sm:w-[42%] shrink-0 flex items-center justify-start">
          <button
            onClick={() => onQuoteRequest(product)}
            className="px-3.5 sm:px-4 py-1.5 rounded-full font-heading font-bold text-[11px] sm:text-xs tracking-wide btn-gold-outline-hover whitespace-nowrap cursor-pointer"
          >
            {isRTL ? "طلب عرض سعر" : "Request Quote"}
          </button>
        </div>

        {/* Right Action Box (Aligned under Right Text Column Start) */}
        <div className="flex-1 min-w-0 flex items-center justify-start">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="font-heading font-bold text-[11px] sm:text-xs text-gold-main hover:text-gold-dark transition-colors duration-200 whitespace-nowrap underline underline-offset-4 decoration-gold-main/60"
          >
            {isRTL ? "عرض التفاصيل" : "View Details"}
          </Link>
        </div>
      </div>
    </div>
  );
}
