"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";
import { Search } from "lucide-react";

export const EXCIPIENTS_DATA = [
  {
    srNo: 1,
    name: "Calcium Carbonate",
    arName: "كربونات الكالسيوم",
    functionalClass: "Diluents / Fillers",
    arFunctionalClass: "مخففات / مواد مالئة",
  },
  {
    srNo: 2,
    name: "Dicalcium Phosphate",
    arName: "فوسفات ثنائي الكالسيوم",
    functionalClass: "Diluents / Fillers",
    arFunctionalClass: "مخففات / مواد مالئة",
  },
  {
    srNo: 3,
    name: "Magnesium Hydroxide",
    arName: "هيدروكسيد المغنيسيوم",
    functionalClass: "Antacid / Alkaline Agent",
    arFunctionalClass: "مضاد للحموضة / عامل قلوي",
  },
  {
    srNo: 4,
    name: "Magnesium Oxide",
    arName: "أكسيد المغنيسيوم",
    functionalClass: "Antacid / Alkaline Agent",
    arFunctionalClass: "مضاد للحموضة / عامل قلوي",
  },
  {
    srNo: 5,
    name: "Sodium Bicarbonate",
    arName: "بيكربونات الصوديوم",
    functionalClass: "Antacid / Alkaline Agent",
    arFunctionalClass: "مضاد للحموضة / عامل قلوي",
  },
  {
    srNo: 6,
    name: "Calcium Hydroxide",
    arName: "هيدروكسيد الكالسيوم",
    functionalClass: "pH Adjusters / Alkaline Agents",
    arFunctionalClass: "معدلات درجة الحموضة / عوامل قلوية",
  },
  {
    srNo: 7,
    name: "Calcium Oxide",
    arName: "أكسيد الكالسيوم",
    functionalClass: "pH Adjusters / Alkaline Agents",
    arFunctionalClass: "معدلات درجة الحموضة / عوامل قلوية",
  },
  {
    srNo: 8,
    name: "Sodium Carbonate",
    arName: "كربونات الصوديوم",
    functionalClass: "pH Adjusters / Alkaline Agents",
    arFunctionalClass: "معدلات درجة الحموضة / عوامل قلوية",
  },
  {
    srNo: 9,
    name: "Maize Starch",
    arName: "نشا الذرة",
    functionalClass: "Disintegrants",
    arFunctionalClass: "عوامل مفككة",
  },
  {
    srNo: 10,
    name: "Sorbitol",
    arName: "سوربيتول",
    functionalClass: "Sweetening Agents",
    arFunctionalClass: "عوامل تحلية",
  },
  {
    srNo: 11,
    name: "Dextrose Monohydrate",
    arName: "دكستروز أحادي الهيدرات",
    functionalClass: "Sweetening Agents",
    arFunctionalClass: "عوامل تحلية",
  },
  {
    srNo: 12,
    name: "Liquid Glucose",
    arName: "الجلوكوز السائل",
    functionalClass: "Binders",
    arFunctionalClass: "مواد رابطة",
  },
  {
    srNo: 13,
    name: "Purified Talc",
    arName: "التلك النقي",
    functionalClass: "Glidants / Lubricants",
    arFunctionalClass: "مواد منزلقة / مواد تشحيم",
  },
];

export default function ExcipientsTableSection() {
  const { isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExcipient, setSelectedExcipient] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Live Filter Logic
  const filteredExcipients = EXCIPIENTS_DATA.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.arName.toLowerCase().includes(q) ||
      item.functionalClass.toLowerCase().includes(q) ||
      item.arFunctionalClass.toLowerCase().includes(q) ||
      String(item.srNo).includes(q)
    );
  });

  const handleOpenQuote = (excipientItem) => {
    setSelectedExcipient(excipientItem);
    setIsQuoteModalOpen(true);
  };

  return (
    <section className="relative w-full bg-[var(--color-primary)] py-8 sm:py-14 md:py-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* ═══════════════════════════════════════════
            SECTION HEADER & QUICK SEARCH BAR
            ═══════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[#252834]">
          {/* Title */}
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight">
              {isRTL ? (
                <>
                  قائمة السواغات{" "}
                  <span className="text-gradient-gold-animated">الصيدلانية</span>
                </>
              ) : (
                <>
                  Pharmaceutical{" "}
                  <span className="text-gradient-gold-animated">Excipients</span>
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
                  ? "ابحث باسم السواغ أو الفئة..."
                  : "Search by excipient name, class..."
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
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light text-center w-24">
                    {isRTL ? "الرقم (SR. NO.)" : "SR. NO."}
                  </th>
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light">
                    {isRTL ? "السواغ (EXCIPIENTS)" : "EXCIPIENTS"}
                  </th>
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light">
                    {isRTL ? "الفئة الوظيفية" : "CLASS"}
                  </th>
                  <th className="py-4 px-5 lg:px-6 font-heading font-bold text-xs tracking-wider uppercase text-gold-light text-right rtl:text-left">
                    {isRTL ? "الإجراءات" : "ACTIONS"}
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#1e212c]">
                {filteredExcipients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400 font-subheading text-sm">
                      {isRTL ? "لم يتم العثور على نتائج مطابقة للبحث" : "No matching pharmaceutical excipients found."}
                    </td>
                  </tr>
                ) : (
                  filteredExcipients.map((item, idx) => (
                    <tr
                      key={item.srNo || idx}
                      className="group hover:bg-[#151822]/80 transition-colors duration-200"
                    >
                      {/* 1. Sr. No. */}
                      <td className="py-4 px-5 lg:px-6 font-mono text-xs lg:text-sm text-gray-400 text-center tracking-wide font-semibold">
                        {item.srNo}
                      </td>

                      {/* 2. Excipient Name */}
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

                      {/* 3. Functional Class */}
                      <td className="py-4 px-5 lg:px-6 font-subheading text-xs lg:text-sm text-gray-300">
                        {isRTL ? item.arFunctionalClass : item.functionalClass}
                      </td>

                      {/* 4. Action: Quote Button */}
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
            {filteredExcipients.length === 0 ? (
              <div className="py-10 px-4 text-center text-gray-400 font-subheading text-xs">
                {isRTL ? "لم يتم العثور على نتائج مطابقة للبحث" : "No matching pharmaceutical excipients found."}
              </div>
            ) : (
              filteredExcipients.map((item, idx) => (
                <div key={item.srNo || idx} className="p-4 space-y-3">
                  {/* Top Header: Excipient Name & Serial No */}
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
                      #{item.srNo}
                    </span>
                  </div>

                  {/* Class (Subtle compact secondary text) */}
                  <div className="text-[12px] text-gray-400 font-subheading leading-relaxed">
                    <span className="text-gray-500 font-medium">Class: </span>
                    <span className="text-gray-300">{isRTL ? item.arFunctionalClass : item.functionalClass}</span>
                  </div>

                  {/* Bottom Row: Quote Button */}
                  <div className="flex items-center justify-end gap-3 pt-1 border-t border-[#1e212c]">
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
              {isRTL ? "إجمالي السواغات المعروضة:" : "Showing excipients:"}{" "}
              <strong className="text-gold-light font-heading font-bold">
                {filteredExcipients.length} of {EXCIPIENTS_DATA.length}
              </strong>
            </span>
            <span className="hidden sm:inline text-gray-500">
              {isRTL ? "سواغات ومواد صيدلانية عالية النقاء" : "Pharmaceutical Grade High Purity Excipients"}
            </span>
          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════
          REQUEST QUOTE POPUP MODAL
          ═══════════════════════════════════════════ */}
      {isQuoteModalOpen && selectedExcipient && (
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
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-[#181a24] border border-[#2e3344] text-gray-400 hover:text-white hover:border-gold-main flex items-center justify-center transition-all cursor-pointer rtl:right-auto rtl:left-4 sm:rtl:left-6"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="mb-6 pb-4 border-b border-[#252834]">
              <div className="inline-block px-3 py-1 rounded-full bg-gold-main/10 border border-gold-main/30 text-gold-light text-xs font-heading font-semibold uppercase tracking-wider mb-2">
                {isRTL ? "طلب تسعير سريع" : "Request Quote"}
              </div>
              <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-white">
                {isRTL ? selectedExcipient.arName : selectedExcipient.name}
              </h3>
              <p className="font-subheading text-xs sm:text-sm text-gray-400 mt-1">
                {isRTL ? (
                  <>
                    الفئة الوظيفية:{" "}
                    <span className="text-gray-200">
                      {selectedExcipient.arFunctionalClass}
                    </span>
                  </>
                ) : (
                  <>
                    Functional Class:{" "}
                    <span className="text-gray-200">
                      {selectedExcipient.functionalClass}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Master Lead Enquiry Form */}
            <LeadEnquiryForm
              productName={selectedExcipient.name}
              productSlug={selectedExcipient.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              sourcePage="/active-pharmaceutical-ingredients"
              isModal={true}
              onSuccess={() => {
                setTimeout(() => {
                  setIsQuoteModalOpen(false);
                  setSelectedExcipient(null);
                }, 2000);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
