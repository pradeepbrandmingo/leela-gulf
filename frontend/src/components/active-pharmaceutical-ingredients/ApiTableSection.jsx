"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";
import { Search, X, Pill, ArrowRight, ShieldCheck, FileCheck } from "lucide-react";

export const API_PRODUCTS_DATA = [
  {
    srNo: 1,
    name: "Amisulpride",
    arName: "أميسولبريد",
    pharmacologicalClass: "Atypical Antipsychotic (D2/D3 antagonist)",
    arPharmacologicalClass: "مضاد للذهان غير نمطي (ناهض D2/D3)",
    grades: ["IP", "BP"],
    casNo: "71675-85-9",
  },
  {
    srNo: 2,
    name: "Ketoconazole",
    arName: "كيتوكونازول",
    pharmacologicalClass: "Antifungal (Imidazole class)",
    arPharmacologicalClass: "مضاد للفطريات (فئة إيميدازول)",
    grades: ["IP", "BP", "USP"],
    casNo: "65277-42-1",
  },
  {
    srNo: 3,
    name: "Levosulpiride",
    arName: "ليفوسولبيريد",
    pharmacologicalClass: "Prokinetic agent / Atypical Antipsychotic",
    arPharmacologicalClass: "عامل محرك للجهاز الهضمي / مضاد للذهان غير نمطي",
    grades: ["IHS"],
    casNo: "23672-07-3",
  },
  {
    srNo: 4,
    name: "Chlorzoxazone",
    arName: "كلورزوكسازون",
    pharmacologicalClass: "Muscle Relaxant (Centrally acting)",
    arPharmacologicalClass: "مرخي للعضلات (مركزي المفعول)",
    grades: ["USP"],
    casNo: "95-25-0",
  },
  {
    srNo: 5,
    name: "Sodium Valproate",
    arName: "فالبروات الصوديوم",
    pharmacologicalClass: "Antiepileptic / Mood Stabilizer",
    arPharmacologicalClass: "مضاد للصرع / مثبت المزاج",
    grades: ["IP", "BP"],
    casNo: "1069-66-5",
  },
  {
    srNo: 6,
    name: "Divalproex Sodium",
    arName: "ديفالبروكس الصوديوم",
    pharmacologicalClass: "Antiepileptic / Mood Stabilizer",
    arPharmacologicalClass: "مضاد للصرع / مثبت المزاج",
    grades: ["IP", "USP"],
    casNo: "76584-70-8",
  },
  {
    srNo: 7,
    name: "Valproic Acid",
    arName: "حمض الفالبرويك",
    pharmacologicalClass: "Antiepileptic / Mood Stabilizer",
    arPharmacologicalClass: "مضاد للصرع / مثبت المزاج",
    grades: ["IP", "BP", "USP"],
    casNo: "99-66-1",
  },
  {
    srNo: 8,
    name: "Gliclazide",
    arName: "غليكلازيد",
    pharmacologicalClass: "Antidiabetic (Sulfonylurea class)",
    arPharmacologicalClass: "مضاد للسكري (فئة السلفونيل يوريا)",
    grades: ["IP", "BP", "USP"],
    casNo: "21187-98-4",
  },
  {
    srNo: 9,
    name: "Fluconazole",
    arName: "فلوكونازول",
    pharmacologicalClass: "Antifungal (Triazole class)",
    arPharmacologicalClass: "مضاد للفطريات (فئة تريازول)",
    grades: ["IP"],
    casNo: "86386-73-4",
  },
  {
    srNo: 10,
    name: "Vitamin B1 HCL (Thiamine HCl)",
    arName: "فيتامين ب1 هيدروكلوريد (ثيامين)",
    pharmacologicalClass: "Vitamin (Water-soluble, B-complex)",
    arPharmacologicalClass: "فيتامين (قابل للذوبان في الماء، مجمع ب)",
    grades: ["IHS"],
    casNo: "67-03-8",
  },
  {
    srNo: 11,
    name: "Vitamin B2 (Riboflavin)",
    arName: "فيتامين ب2 (ريبوفلافين)",
    pharmacologicalClass: "Vitamin (Water-soluble, B-complex)",
    arPharmacologicalClass: "فيتامين (قابل للذوبان في الماء، مجمع ب)",
    grades: ["IHS"],
    casNo: "83-88-5",
  },
  {
    srNo: 12,
    name: "Tadalafil",
    arName: "تادالافيل",
    pharmacologicalClass: "PDE-5 Inhibitor (Erectile dysfunction / PAH)",
    arPharmacologicalClass: "مثبط PDE-5 (ضعف الانتصاب / PAH)",
    grades: ["IP", "BP", "USP"],
    casNo: "171596-29-5",
  },
  {
    srNo: 13,
    name: "Sildenafil Citrate",
    arName: "سترات السيلدينافيل",
    pharmacologicalClass: "PDE-5 Inhibitor (Erectile dysfunction / PAH)",
    arPharmacologicalClass: "مثبط PDE-5 (ضعف الانتصاب / PAH)",
    grades: ["IP", "BP", "USP"],
    casNo: "171599-83-0",
  },
  {
    srNo: 14,
    name: "Fosfomycin",
    arName: "فوسفوميسين",
    pharmacologicalClass: "Antibiotic (Phosphonic acid derivative)",
    arPharmacologicalClass: "مضاد حيوي (مشتق حمض الفوسفونيك)",
    grades: ["IHS"],
    casNo: "78964-85-9",
  },
  {
    srNo: 15,
    name: "Clotrimazole",
    arName: "كلوتريمازول",
    pharmacologicalClass: "Antifungal (Imidazole class)",
    arPharmacologicalClass: "مضاد للفطريات (فئة إيميدازول)",
    grades: ["IHS"],
    casNo: "23672-07-3",
  },
  {
    srNo: 16,
    name: "Nitrofurantoin",
    arName: "نيتروفورانتوين",
    pharmacologicalClass: "Antibiotic",
    arPharmacologicalClass: "مضاد حيوي",
    grades: ["IHS"],
    casNo: "67-20-9",
  },
  {
    srNo: 17,
    name: "Salicylic Acid",
    arName: "حمض الساليسيليك",
    pharmacologicalClass: "NSAIDS",
    arPharmacologicalClass: "مضادات الالتهاب غير الستيرويدية (NSAIDS)",
    grades: ["IP"],
    casNo: "69-72-7",
  },
  {
    srNo: 18,
    name: "Pregabalin",
    arName: "بريغابالين",
    pharmacologicalClass: "Anticonvulsant",
    arPharmacologicalClass: "مضاد للاختلاج / مسكن لآلام الأعصاب",
    grades: ["IP", "BP", "USP"],
    casNo: "148553-50-8",
  },
  {
    srNo: 19,
    name: "Metformin HCL",
    arName: "ميتفورمين هيدروكلوريد",
    pharmacologicalClass: "Antidiabetic",
    arPharmacologicalClass: "مضاد للسكري",
    grades: ["IP", "BP", "USP"],
    casNo: "1115-70-4",
  },
];

export default function ApiTableSection() {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApi, setSelectedApi] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Filter products by search query
  const filteredProducts = API_PRODUCTS_DATA.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.arName.toLowerCase().includes(q) ||
      item.pharmacologicalClass.toLowerCase().includes(q) ||
      item.arPharmacologicalClass.toLowerCase().includes(q) ||
      item.casNo.toLowerCase().includes(q) ||
      item.grades.some((g) => g.toLowerCase().includes(q))
    );
  });

  const handleOpenQuote = (apiItem) => {
    setSelectedApi(apiItem);
    setIsQuoteModalOpen(true);
  };

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-10 sm:py-14 md:py-16 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* ═══════════════════════════════════════════
            SECTION HEADER & QUICK SEARCH BAR
            ═══════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#252834]">
          {/* Title & Subtitle */}
          <div>
            <h2 className="font-heading font-medium text-[24px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-white tracking-tight leading-tight">
              {isRTL ? (
                <>
                  <span className="font-heading text-white font-medium not-italic inline mr-2 rtl:mr-0 rtl:ml-2">
                    قائمة المواد الصيدلانية
                  </span>
                  <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                    الفعالة
                  </span>
                </>
              ) : (
                <>
                  <span className="font-heading text-white font-medium not-italic inline mr-2">
                    Active Pharmaceutical
                  </span>
                  <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                    Ingredients
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-80 lg:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isRTL
                  ? "ابحث بالاسم، الفئة، أو رقم CAS..."
                  : "Search by API name, class, CAS no..."
              }
              className="w-full bg-[#14161f] border border-gold-main/30 hover:border-gold-main/60 focus:border-gold-main focus:ring-1 focus:ring-gold-main rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm font-subheading text-white placeholder-gray-500 outline-none transition-all duration-200 rtl:pl-4 rtl:pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3 text-gray-400 hover:text-white text-xs cursor-pointer p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            MAIN TABLE CONTAINER (Luxury Dark Theme Card)
            ═══════════════════════════════════════════ */}
        <div className="bg-[var(--color-card-dark)]/95 backdrop-blur-md border border-gold-main/30 hover:border-gold-main/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
          
          {/* DESKTOP & TABLET: Data Table */}
          <div className="hidden md:block overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left rtl:text-right border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-[#252834] bg-[#14161f]/90">
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light">
                    {isRTL ? "اسم المادة (API NAME)" : "API NAME"}
                  </th>
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light">
                    {isRTL ? "الفئة الدوائية" : "PHARMACOLOGICAL CLASS"}
                  </th>
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light text-center">
                    {isRTL ? "الدرجات المتاحة" : "GRADE AVAILABLE"}
                  </th>
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light text-center">
                    {isRTL ? "رقم CAS" : "CAS NO."}
                  </th>
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light text-right rtl:text-left">
                    {isRTL ? "الإجراءات" : "ACTIONS"}
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#1e212c]">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 font-subheading text-sm">
                      {isRTL ? "لم يتم العثور على نتائج مطابقة للبحث" : "No matching active pharmaceutical ingredients found."}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((item, idx) => (
                    <tr
                      key={item.srNo || idx}
                      className="group hover:bg-[#151822]/80 transition-colors duration-200"
                    >
                      {/* 1. API Name */}
                      <td className="py-4 px-5 lg:px-6 font-heading font-bold text-sm lg:text-base text-white group-hover:text-gold-light transition-colors">
                        <div className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-main/60 group-hover:bg-gold-light transition-colors" />
                          <span>{isRTL ? item.arName : item.name}</span>
                        </div>
                        {isRTL && (
                          <span className="text-[11px] text-gray-500 font-subheading block mt-0.5">
                            {item.name}
                          </span>
                        )}
                      </td>

                      {/* 2. Pharmacological Class */}
                      <td className="py-4 px-5 lg:px-6 font-subheading text-xs lg:text-sm text-gray-300">
                        {isRTL ? item.arPharmacologicalClass : item.pharmacologicalClass}
                      </td>

                      {/* 3. Grade Available (Pill Badges) */}
                      <td className="py-4 px-5 lg:px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {item.grades.map((grade, gIdx) => (
                            <span
                              key={gIdx}
                              className="px-2 py-0.5 rounded-md bg-[#1c1f2b] border border-gold-main/30 text-gold-light font-heading font-bold text-[10.5px] uppercase tracking-wide shadow-2xs"
                            >
                              {grade}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* 4. CAS No. */}
                      <td className="py-4 px-5 lg:px-6 font-mono text-xs lg:text-sm text-gray-400 text-center tracking-wide">
                        {item.casNo}
                      </td>

                      {/* 5. Action: Quote Button */}
                      <td className="py-4 px-5 lg:px-6 text-right rtl:text-left">
                        <button
                          type="button"
                          onClick={() => handleOpenQuote(item)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                          <span>{isRTL ? "طلب عرض سعر" : "Quote"}</span>
                          <span className="text-sm">→</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE: High-Density Card List (<768px) */}
          <div className="block md:hidden divide-y divide-[#1e212c]">
            {filteredProducts.length === 0 ? (
              <div className="py-10 px-4 text-center text-gray-400 font-subheading text-xs">
                {isRTL ? "لم يتم العثور على نتائج مطابقة للبحث" : "No matching active pharmaceutical ingredients found."}
              </div>
            ) : (
              filteredProducts.map((item, idx) => (
                <div key={item.srNo || idx} className="p-4 space-y-3">
                  {/* Top Header: API Name & CAS No */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-lg text-white tracking-tight leading-snug">
                        {isRTL ? item.arName : item.name}
                      </h3>
                      {isRTL && (
                        <p className="text-[11px] text-gray-500 font-subheading mt-0.5">
                          {item.name}
                        </p>
                      )}
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-[#161822] border border-[#2c303f] font-mono text-[10.5px] text-gray-400 shrink-0">
                      CAS: {item.casNo}
                    </span>
                  </div>

                  {/* Pharmacological Class (Subtle compact secondary text) */}
                  <div className="text-[12px] text-gray-400 font-subheading leading-relaxed">
                    <span className="text-gray-500 font-medium">Class: </span>
                    <span className="text-gray-300">{isRTL ? item.arPharmacologicalClass : item.pharmacologicalClass}</span>
                  </div>

                  {/* Bottom Row: Grades & Quote Button */}
                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-[#1e212c]">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-[10px] text-gray-500 font-heading font-semibold uppercase mr-1">
                        Grade:
                      </span>
                      {item.grades.map((grade, gIdx) => (
                        <span
                          key={gIdx}
                          className="px-1.5 py-0.5 rounded bg-[#1c1f2b] border border-gold-main/30 text-gold-light font-heading font-bold text-[10px] uppercase"
                        >
                          {grade}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenQuote(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-gold-animated text-black font-heading font-bold text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <span>{isRTL ? "طلب سعر" : "Quote"}</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Table Bottom Footer Bar */}
          <div className="py-3 px-5 sm:px-6 bg-[#12141c] border-t border-[#252834] flex items-center justify-between text-xs font-subheading text-gray-400">
            <span>
              {isRTL ? "إجمالي المواد المعروضة:" : "Showing active products:"}{" "}
              <strong className="text-gold-light font-heading font-bold">
                {filteredProducts.length} of {API_PRODUCTS_DATA.length}
              </strong>
            </span>
            <span className="hidden sm:inline text-gray-500">
              {isRTL ? "مواصفات دوائية مطابقة للمعايير الدولية" : "Pharmaceutical Grade Global Sourcing"}
            </span>
          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════
          REQUEST QUOTE POPUP MODAL
          ═══════════════════════════════════════════ */}
      {isQuoteModalOpen && selectedApi && (
        <div
          onClick={() => setIsQuoteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#0e1015] border border-gold-main/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e2a] border border-[#2e3344] text-gray-400 hover:text-white hover:border-gold-light hover:bg-[#252a3a] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>

            {/* Modal Header API Info Card */}
            <div className="mb-6 bg-[#161822] border border-gold-main/20 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-lg relative overflow-hidden">
              <div className="w-1.5 h-12 bg-gradient-gold-animated rounded-full shrink-0" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gold-main/15 border border-gold-main/40 flex items-center justify-center text-gold-light shrink-0 shadow-md">
                <Pill className="w-6 h-6" />
              </div>
              <div className="pr-8 rtl:pr-0 rtl:pl-8">
                <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-gold-light block mb-0.5">
                  {isRTL ? "طلب عرض سعر للمادة الفعالة" : "Request API Commercial Quote"}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl text-white leading-tight">
                  {isRTL ? selectedApi.arName : selectedApi.name}
                </h3>
                <p className="font-subheading text-xs sm:text-sm text-gray-400 mt-0.5">
                  CAS: {selectedApi.casNo} • Grades: {selectedApi.grades.join(" / ")}
                </p>
              </div>
            </div>

            {/* Form */}
            <LeadEnquiryForm
              sourcePage={`API Catalogue - ${selectedApi.name}`}
              productName={selectedApi.name}
              productSlug="active-pharmaceutical-ingredients"
              productUrl="/active-pharmaceutical-ingredients"
              showHeading={false}
              isModal={true}
            />

          </div>
        </div>
      )}

    </section>
  );
}
