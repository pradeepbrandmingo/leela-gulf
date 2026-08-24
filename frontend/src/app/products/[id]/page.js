"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { X } from "lucide-react";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";
import ProductDetailHero from "@/components/products/ProductDetailHero";
import ProductAboutSection from "@/components/products/ProductAboutSection";
import ProductFeaturesSection from "@/components/products/ProductFeaturesSection";
import ProductApplicationsSection from "@/components/products/ProductApplicationsSection";
import ProductFaqAndRelatedSection from "@/components/products/ProductFaqAndRelatedSection";
import ProductCatalogueBar from "@/components/common/ProductCatalogueBar";

export default function ProductDetailPage() {
  const params = useParams();
  const { isRTL } = useLanguage();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const productId = params?.id || "1";

  // Dynamic Product Data (Structure matches future Backend API payload)
  const productData = {
    id: productId,
    title: "Cocamidopropyl Betaine (CAPB)",
    code: "HCL-001",
    category: isRTL ? "خافضات التوتر السطحي" : "SURFACTANTS",
    gradeLabel: "Product Grade",
    gradeValue: "ELSURFAC™ CAB45",
    description: isRTL
      ? "خافض للتوتر السطحي أمفوتيري لطيف مشتق من زيت جوز الهند، يستخدم على نطاق واسع في الشامبو، ومنظفات الوجه، والصابون السائل، ومستحضرات العناية الشخصية. متوفر للتوريد الصناعي بالجملة."
      : "Mild amphoteric surfactant derived from coconut oil, widely used in shampoos, facial cleansers, liquid soaps and personal care formulations. Available for bulk industrial supply.",
    specs: [
      { label: isRTL ? "رقم CAS" : "CAS Number", value: "61789-40-0" },
      { label: isRTL ? "اسم INCI" : "INCI Name", value: "Coco Amido Propyl Betaine" },
      { label: isRTL ? "رمز HS" : "HS Code", value: "3402.19.00" },
      { label: isRTL ? "الصيغة الكيميائية" : "Chemical Formula", value: "C19H38N2O3" },
    ],
    applications: isRTL
      ? ["العناية الشخصية", "العناية بالمنزل", "شامبو", "مستحضرات التجميل", "صابون سائل", "التنظيف الصناعي"]
      : ["Personal Care", "Home Care", "Shampoo", "Cosmetics", "Liquid Soap", "Industrial Cleaning"],
    images: [
      "/images/prodcut/dummy-product.jpg",
      "/images/prodcut/dummy-product.jpg",
      "/images/prodcut/dummy-product.jpg",
    ],
    overlayBadge: isRTL ? "توريد بالجملة عالمياً" : "BULK SUPPLY WORLDWIDE",
    floatingHighlights: isRTL
      ? ["مخزون جاهز للتسليم", "دعم فني متخصص", "تصدير عالمي مضمون"]
      : ["Ready Stock", "Technical Support", "Global Export"],
  };

  return (
    <main className="w-full bg-[var(--color-primary)] min-h-screen text-white">

      {/* ── 1. PRODUCT DETAIL HERO SECTION ── */}
      <ProductDetailHero
        product={productData}
        onQuoteRequest={() => setIsQuoteModalOpen(true)}
      />

      {/* ── 2. PRODUCT ABOUT & TECHNICAL SUPPLY DETAILS SECTION ── */}
      <ProductAboutSection
        product={productData}
        onQuoteRequest={() => setIsQuoteModalOpen(true)}
      />

      {/* ── 3. PRODUCT FEATURES SHOWCASE SECTION ── */}
      <ProductFeaturesSection
        product={productData}
      />

      {/* ── 4. INDUSTRY APPLICATIONS ALTERNATING SECTION ── */}
      <ProductApplicationsSection
        product={productData}
      />

      {/* ── 5. PRODUCT FAQ & RELATED SURFACTANTS SECTION ── */}
      <ProductFaqAndRelatedSection
        product={productData}
      />

      {/* ── 6. PRODUCT CATALOGUE DOWNLOAD & CONTACT BAR ── */}
      <ProductCatalogueBar />

      {/* ── REQUEST QUOTE POPUP MODAL ── */}
      {isQuoteModalOpen && (
        <div
          onClick={() => setIsQuoteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#0e1015] border border-[#e8b958]/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300"
          >

            {/* Close Button */}
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e2a] border border-[#2e3344] text-gray-400 hover:text-white hover:border-[#e8b958] hover:bg-[#252a3a] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>

            {/* Modal Header Product Info Card */}
            <div className="mb-6 bg-[#161822] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-lg relative overflow-hidden">
              <div className="w-1.5 h-12 bg-gradient-gold-animated rounded-full shrink-0" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#1d202d] border border-[#33394a] overflow-hidden shrink-0 shadow-md">
                <Image
                  src={productData.images[0]}
                  alt={productData.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="pr-8">
                <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-[#e8b958] block mb-1">
                  {isRTL ? "طلب عرض سعر للمنتج" : "Request Product Quote"}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl text-white leading-tight">
                  {productData.title}
                </h3>
                <p className="font-subheading text-xs sm:text-sm text-gray-400 mt-0.5">
                  {productData.code}
                </p>
              </div>
            </div>

            {/* Form */}
            <LeadEnquiryForm
              sourcePage={`Product Detail Page - ${productData.title}`}
              productName={productData.title}
              showHeading={false}
              isModal={true}
            />

          </div>
        </div>
      )}
    </main>
  );
}
