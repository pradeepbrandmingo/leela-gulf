"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { X, Loader2, FlaskConical, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/config/api";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";
import ProductDetailHero from "@/components/products/ProductDetailHero";
import ProductAboutSection from "@/components/products/ProductAboutSection";
import ProductFeaturesSection from "@/components/products/ProductFeaturesSection";
import ProductApplicationsSection from "@/components/products/ProductApplicationsSection";
import ProductFaqAndRelatedSection from "@/components/products/ProductFaqAndRelatedSection";
import ProductDetailCatalogueBar from "@/components/products/ProductDetailCatalogueBar";

export default function ProductDetailPage() {
  const params = useParams();
  const { isRTL } = useLanguage();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [dbProduct, setDbProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const productId = params?.id;

  // Fetch product from backend API
  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;
      setIsLoading(true);
      setError(false);
      try {
        const res = await apiRequest(`/products/${productId}`, { silent: true });
        if (res?.success && res?.data) {
          // If product is draft and user is not admin, hide from public
          const isAdmin = typeof window !== "undefined" && !!localStorage.getItem("adminToken");
          if (res.data.status === "Draft" && !isAdmin) {
            setError(true);
          } else {
            setDbProduct(res.data);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  // Loading Screen
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center justify-center pt-24 pb-20">
        <div className="w-16 h-16 rounded-2xl bg-gold-main/10 border border-gold-main/30 flex items-center justify-center mb-4 shadow-lg shadow-gold-main/5 animate-pulse">
          <Loader2 className="w-8 h-8 text-gold-main animate-spin" />
        </div>
        <p className="font-heading font-semibold text-sm text-gray-400 tracking-wide">
          {isRTL ? "جاري تحميل تفاصيل المنتج..." : "Loading product details..."}
        </p>
      </main>
    );
  }

  // Not Found Screen
  if (error || !dbProduct) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
        <div className="max-w-md bg-[#11131a]/80 p-8 rounded-3xl border border-[#252a38] flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gold-main/10 border border-gold-main/30 flex items-center justify-center mb-4">
            <FlaskConical className="w-8 h-8 text-gold-main" />
          </div>
          <h2 className="font-heading font-bold text-xl text-white mb-2" style={{ fontWeight: 700 }}>
            {isRTL ? "المنتج غير متوفر" : "Product Not Found"}
          </h2>
          <p className="font-subheading text-gray-400 text-sm mb-6 leading-relaxed">
            {isRTL
              ? "تعذر العثور على هذا المنتج أو قد تم نقله. يرجى تصفح قائمة المنتجات الكاملة."
              : "This product could not be located or may have been updated. Please explore our full product catalog."}
          </p>
          <Link
            href="/products"
            className="btn-gold-primary px-6 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wide inline-flex items-center gap-2"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            <span>{isRTL ? "العودة إلى جميع المنتجات" : "Back to All Products"}</span>
          </Link>
        </div>
      </main>
    );
  }

  // Construct localized data based on language (English or Arabic)
  const loc = isRTL
    ? (dbProduct.ar?.title ? dbProduct.ar : dbProduct.en)
    : (dbProduct.en || dbProduct);

  // Dynamic Product Data from Database
  const productData = {
    id: dbProduct.slug || dbProduct._id || productId,
    title: loc?.title || dbProduct.en?.title || "Product Title",
    code: dbProduct.code || "PRD-001",
    category: loc?.categoryTag || dbProduct.categoryTag || (isRTL ? "كيماويات عامة" : "CHEMICALS"),
    gradeLabel: "Product Grade",
    gradeValue: loc?.gradeValue || dbProduct.gradeValue || "Industrial Grade",
    description: loc?.shortOverview || dbProduct.en?.shortOverview || "",
    specs: [
      { label: isRTL ? "رقم CAS" : "CAS Number", value: dbProduct.casNumber || "N/A" },
      { label: isRTL ? "اسم INCI" : "INCI Name", value: dbProduct.inciName || "N/A" },
      { label: isRTL ? "رمز HS" : "HS Code", value: dbProduct.hsCode || "N/A" },
      { label: isRTL ? "الصيغة الكيميائية" : "Chemical Formula", value: dbProduct.chemicalFormula || "N/A" },
    ],
    applications: (loc?.applicationTags?.length ? loc.applicationTags : dbProduct.en?.applicationTags) || [],
    images: dbProduct.images?.length
      ? dbProduct.images
      : ["/images/prodcut/dummy-product.jpg"],
    overlayBadge: isRTL ? "توريد بالجملة عالمياً" : "BULK SUPPLY WORLDWIDE",
    floatingHighlights: isRTL
      ? ["مخزون جاهز للتسليم", "دعم فني متخصص", "تصدير عالمي مضمون"]
      : ["Ready Stock", "Technical Support", "Global Export"],
    
    // About Section
    aboutData: {
      aboutTitle: loc?.aboutTitle || `About ${loc?.title || "Product"}`,
      overview: loc?.aboutOverview || "",
      manufacturingProcess: loc?.manufacturingProcess || "",
      packagingLogistics: loc?.packagingLogistics || "",
      safetyHandling: loc?.safetyHandling || "",
      bulkPricing: loc?.bulkPricing || "",
      whyChooseTitle: loc?.whyChooseTitle || (isRTL ? "لماذا تختار ليلا الخليج كمورد موثوق؟" : "Why Choose Leela Gulf as a Trusted Supplier?"),
      whyChooseLeela: loc?.whyChooseLeela || "",
      card1Title: loc?.card1Title || (isRTL ? "عملية التصنيع" : "Manufacturing Process"),
      card2Title: loc?.card2Title || (isRTL ? "التعبئة والتغليف والخدمات اللوجستية" : "Packaging & Logistics"),
      card3Title: loc?.card3Title || (isRTL ? "السلامة والتعامل" : "Safety & Handling"),
      card4Title: loc?.card4Title || (isRTL ? "التسعير بالجملة والمشتريات" : "Bulk Pricing & Procurement"),
    },

    // Features
    featuresData: (loc?.features?.length ? loc.features : dbProduct.en?.features) || [],

    // Applications
    applicationsData: (loc?.applicationCards?.length ? loc.applicationCards : dbProduct.en?.applicationCards) || [],

    // FAQs & Related
    faqData: (loc?.faqs?.length ? loc.faqs : dbProduct.en?.faqs) || [],
    relatedHeading: loc?.relatedHeading || (isRTL ? "منتجات ذات صلة" : "Related Surfactants"),
    relatedProducts: (loc?.relatedProducts?.length ? loc.relatedProducts : dbProduct.en?.relatedProducts) || [],
    tdsUrl: dbProduct.tdsUrl || "",
  };

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white overflow-hidden selection:bg-gold-light selection:text-black">
      
      {/* ── 1. PRODUCT DETAILS HERO BANNER ── */}
      <ProductDetailHero
        product={productData}
        onQuoteRequest={() => setIsQuoteModalOpen(true)}
      />

      {/* ── 2. ABOUT PRODUCT & TECHNICAL DETAILS SECTION ── */}
      <ProductAboutSection
        product={productData}
        onQuoteRequest={() => setIsQuoteModalOpen(true)}
      />

      {/* ── 3. PRODUCT FEATURES SHOWCASE SECTION ── */}
      <ProductFeaturesSection
        product={productData}
      />

      {/* ── 4. DETAILED INDUSTRY APPLICATIONS SECTION ── */}
      <ProductApplicationsSection
        product={productData}
      />

      {/* ── 5. FAQS ACCORDION & RELATED SURFACTANTS SECTION ── */}
      <ProductFaqAndRelatedSection
        product={productData}
      />

      {/* ── 6. DEDICATED PRODUCT DETAIL TECHNICAL DOC & SUPPORT BAR ── */}
      <ProductDetailCatalogueBar
        product={productData}
      />

      {/* ── REQUEST QUOTE POPUP MODAL ── */}
      {isQuoteModalOpen && (
        <div
          onClick={() => setIsQuoteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#0e1015] border border-gold-light/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300"
          >

            {/* Close Button */}
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e2a] border border-[#2e3344] text-gray-400 hover:text-white hover:border-gold-light hover:bg-[#252a3a] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>

            {/* Modal Header Product Info Card */}
            <div className="mb-6 bg-[#161822] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-lg relative overflow-hidden">
              <div className="w-1.5 h-12 bg-gradient-gold-animated rounded-full shrink-0" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#1d202d] border border-[#33394a] overflow-hidden shrink-0 shadow-md">
                <Image
                  src={productData.images[0] || "/images/prodcut/dummy-product.jpg"}
                  alt={productData.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="pr-8">
                <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-gold-light block mb-1">
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
              productSlug={productData.slug || productData.id || productData._id || productId}
              productUrl={`/products/${productData.slug || productData.id || productData._id || productId}`}
              showHeading={false}
              isModal={true}
            />

          </div>
        </div>
      )}
    </main>
  );
}
