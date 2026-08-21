"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, Mail, X } from "lucide-react";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";

// Temporary Mock Data Lookup for Setup
const DUMMY_PRODUCTS_MAP = {
  "1": { id: 1, title: "Hydrochloric Acid", code: "HCL-001", category: "Strong Acids", description: "Hydrochloric acid is a strong, highly corrosive acid used in various industrial processes.", image: "/images/prodcut/dummy-product.jpg" },
  "2": { id: 2, title: "Sulfuric Acid", code: "SA-002", category: "Strong Acids", description: "Sulfuric acid is a dense, oily liquid used as an industrial chemical and reagent.", image: "/images/prodcut/dummy-product.jpg" },
  "3": { id: 3, title: "Nitric Acid", code: "NA-003", category: "Strong Acids", description: "Nitric acid is a highly corrosive mineral acid used in fertilizer production.", image: "/images/prodcut/dummy-product.jpg" },
  "4": { id: 4, title: "Phosphoric Acid", code: "PA-004", category: "Strong Acids", description: "Phosphoric acid is used in rust removal, food flavoring, and dental applications.", image: "/images/prodcut/dummy-product.jpg" },
  "5": { id: 5, title: "Acetic Acid", code: "AA-005", category: "Strong Acids", description: "Acetic acid is a colorless organic compound widely used as a chemical reagent.", image: "/images/prodcut/dummy-product.jpg" },
  "10": { id: 10, title: "Sodium Hydroxide", code: "NaOH-010", category: "Basic Chemicals", description: "Sodium hydroxide, also known as caustic soda, is a highly versatile alkali.", image: "/images/prodcut/dummy-product.jpg" },
};

export default function ProductDetailPage() {
  const params = useParams();
  const { isRTL } = useLanguage();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const productId = params?.id || "1";
  const product = DUMMY_PRODUCTS_MAP[productId] || {
    id: productId,
    title: `Product #${productId}`,
    code: `PROD-${productId}`,
    category: "Chemical Solutions",
    description: "High-purity industrial chemical product supplied globally by Leela Gulf FZC.",
    image: "/images/prodcut/dummy-product.jpg",
  };

  return (
    <main className="w-full bg-[var(--color-primary)] min-h-screen pt-24 sm:pt-28 pb-16 text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ── BREADCRUMB & BACK BUTTON ── */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-800/80">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-heading font-bold text-xs sm:text-sm text-[#e8b958] hover:text-white transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            <span>{isRTL ? "العودة إلى جميع المنتجات" : "Back to All Products"}</span>
          </Link>
          <span className="font-subheading text-xs text-gray-500 uppercase tracking-widest">
            {product.category}
          </span>
        </div>

        {/* ── PRODUCT DETAILS HERO PLACEHOLDER ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">

          {/* Left: Product Main Image Box */}
          <div className="lg:col-span-5 bg-white/5 border border-gray-800 rounded-3xl p-6 sm:p-8 flex items-center justify-center">
            <div className="relative w-full aspect-square rounded-2xl bg-white overflow-hidden shadow-2xl">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Product Code Badge */}
              <div className="inline-block px-3 py-1 rounded-md bg-[#e8b958]/15 border border-[#e8b958]/30 font-subheading text-xs font-bold text-[#e8b958] mb-3 uppercase tracking-wider">
                {product.code}
              </div>

              {/* Product Title */}
              <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight" style={{ fontWeight: 700 }}>
                {product.title}
              </h1>

              {/* Description */}
              <p className="font-subheading text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Key Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-subheading">
                  <CheckCircle2 className="w-4 h-4 text-[#e8b958] shrink-0" />
                  <span>High Industrial Purity Grade</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-subheading">
                  <ShieldCheck className="w-4 h-4 text-[#e8b958] shrink-0" />
                  <span>Certified CoA & MSDS Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-subheading">
                  <CheckCircle2 className="w-4 h-4 text-[#e8b958] shrink-0" />
                  <span>Global Logistics & Supply Chain</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 font-subheading">
                  <ShieldCheck className="w-4 h-4 text-[#e8b958] shrink-0" />
                  <span>Customized Packaging Options</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-gray-800">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="btn-gold-primary px-6 sm:px-8 py-3.5 rounded-full font-heading font-bold text-xs sm:text-sm tracking-wide cursor-pointer"
              >
                {isRTL ? "طلب عرض سعر للمنتج" : "Request Product Quote"}
              </button>

              <Link
                href="/products"
                className="px-6 sm:px-8 py-3.5 border border-gray-700 hover:border-[#e8b958] rounded-full font-heading font-bold text-xs sm:text-sm text-gray-300 hover:text-[#e8b958] transition-all"
              >
                {isRTL ? "تصفح بقية المنتجات" : "Explore All Products"}
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* ── REQUEST QUOTE POPUP MODAL ── */}
      {isQuoteModalOpen && (
        <div
          onClick={() => setIsQuoteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl bg-[#14161d] border border-[#e8b958]/50 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300"
          >

            {/* Close Button */}
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1e212b] border border-[#2e3344] text-gray-400 hover:text-white hover:border-[#e8b958] flex items-center justify-center transition-all cursor-pointer z-20"
              aria-label="Close quote modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-5 pb-4 border-b border-gray-800 flex items-center gap-3.5 sm:gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#1a1d27] border border-[#2e3344] overflow-hidden shrink-0 shadow-md">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="pr-8">
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#e8b958] block mb-0.5">
                  {isRTL ? "طلب عرض سعر للمنتج" : "Request Product Quote"}
                </span>
                <h3 className="font-heading font-bold text-base sm:text-xl text-white leading-tight">
                  {product.title}
                </h3>
                <p className="font-subheading text-xs text-gray-400 mt-0.5">
                  {product.code}
                </p>
              </div>
            </div>

            {/* Form */}
            <LeadEnquiryForm
              sourcePage={`Product Detail Page - ${product.title}`}
              productName={product.title}
              showHeading={false}
              isModal={true}
            />

          </div>
        </div>
      )}
    </main>
  );
}
