"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, MapPin, Calendar, X, ExternalLink, Sparkles, Building2 } from "lucide-react";

/**
 * EventsListing - Media & Exhibitions Events Grid & Interactive Lightbox Modal Component
 * 100% Match to Client Reference UI Screenshots:
 * - 3 Column Responsive Grid (1 col mobile, 2 col tablet, 3 col desktop)
 * - White Rounded Card Design (#ffffff)
 * - Floating Date Badge Pill top-left over event image (e.g. "Jul 11, 2026")
 * - Dynamic Event Titles, Locations, Booth Numbers & Descriptions
 * - "View Gallery →" link in gold font with hover arrow animation
 * - Interactive Lightbox Gallery Modal for viewing high-res photos & event details
 * - 100% Dynamic Backend Data Payload Ready.
 */
export default function EventsListing({ eventsData, activeTab }) {
  const { isRTL } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  const defaultFallbackImg = "/images/prodcut/dummy-product.jpg";

  // Sample Events Data Structure (Matches 100% future Backend API response payload)
  const defaultEvents = [
    {
      id: "event-1",
      category: "past",
      date: "Jul 11, 2026",
      title: "IFT FIRST",
      location: isRTL ? "شيكاغو، الولايات المتحدة الأمريكية" : "Chicago, USA",
      booth: "Booth 5T19",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: [
        "/images/prodcut/dummy-product.jpg",
        "/images/prodcut/dummy-product.jpg",
        "/images/prodcut/dummy-product.jpg",
      ],
      description: isRTL
        ? "اكتشف حلول تصدير مكونات الأغذية من ليلا الخليج في معرض IFT FIRST 2026 في شيكاغو (الجناح 5T19). توريد آمن وموثوق للمضافات الغذائية والمحافظ عالية الجودة."
        : "Discover Leela Gulf's food ingredient export solutions at IFT FIRST 2026 in Chicago (Booth 5T19). Securely source top-grade food additives, preservatives, and specialty chemicals directly.",
    },
    {
      id: "event-2",
      category: "past",
      date: "Jun 21, 2026",
      title: "World Perfumery Congress 2026",
      location: isRTL ? "سان فرانسيسكو، الولايات المتحدة الأمريكية" : "San Francisco, USA",
      booth: "Booth K51",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: [
        "/images/prodcut/dummy-product.jpg",
        "/images/prodcut/dummy-product.jpg",
      ],
      description: isRTL
        ? "التقِ بفريق ليلا الخليج في المؤتمر العالمي للعطور 2026 في سان فرانسيسكو (الجناح K51). نقدم توريداً شفافاً للمواد الكيميائية العطرية والزيوت الأساسية عالية الجودة."
        : "Meet Leela Gulf at the World Perfumery Congress 2026 in San Francisco (Booth K51). We provide transparent sourcing of high-quality aroma chemicals, essential oils, and fragrance ingredients.",
    },
    {
      id: "event-3",
      category: "past",
      date: "Jun 15, 2026",
      title: "Specialty Chemicals America 2026",
      location: isRTL ? "سافانا، الولايات المتحدة الأمريكية" : "Savannah, USA",
      booth: "Booth 1351",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: [
        "/images/prodcut/dummy-product.jpg",
        "/images/prodcut/dummy-product.jpg",
      ],
      description: isRTL
        ? "تواصل مع ليلا الخليج في معرض المواد الكيميائية المتخصصة أمريكا 2026 في سافانا (الجناح 1351). تعرّف على كيفية تمكين المشترين العالميين من خلال حلول التصدير التجاري."
        : "Connect with Leela Gulf at Specialty Chemicals America 2026 in Savannah (Booth 1351). Learn how our tech-driven merchant export solutions empower global buyers.",
    },
    {
      id: "event-4",
      category: "past",
      date: "May 19, 2026",
      title: "NYSCC Suppliers' Day 2026",
      location: isRTL ? "نيويورك، الولايات المتحدة الأمريكية" : "New York, USA",
      booth: "Booth 138",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: [
        "/images/prodcut/dummy-product.jpg",
        "/images/prodcut/dummy-product.jpg",
      ],
      description: isRTL
        ? "انضم إلى ليلا الخليج في يوم الموردين NYSCC 2026 في نيويورك (الجناح 138). اكتشف التوريد الآمن والقائم على التكنولوجيا لمكونات مستحضرات التجميل والعناية الشخصية."
        : "Join Leela Gulf at NYSCC Suppliers' Day 2026 in New York (Booth 138). Discover secure, tech-enabled sourcing of premium cosmetic, personal care, and functional ingredients directly.",
    },
    {
      id: "event-5",
      category: "past",
      date: "May 4, 2026",
      title: "American Coatings Show 2026",
      location: isRTL ? "إنديانابوليس، الولايات المتحدة الأمريكية" : "Indianapolis, USA",
      booth: "Main Hall",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: [
        "/images/prodcut/dummy-product.jpg",
      ],
      description: isRTL
        ? "استكشف أبرز نتائج وتغطيات ليلا الخليج من معرض الطلاء الأمريكي 2026. اكتشف كيف يربط عملنا التجاري المشترين بأمان وشفافية."
        : "Explore Leela Gulf's key takeaways and highlights from the American Coatings Show 2026. Discover how our business securely and transparently connects buyers.",
    },
    {
      id: "event-6",
      category: "past",
      date: "Apr 27, 2026",
      title: "ChemExpo India 2026",
      location: isRTL ? "مومباي، الهند" : "Mumbai, India",
      booth: "Hall 1",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: [
        "/images/prodcut/dummy-product.jpg",
      ],
      description: isRTL
        ? "استكشف أبرز مخرجات ليلا الخليج من معرض كيم إكسبو الهند 2026. اكتشف كيف تساعد أعمال التصدير القائمة على التكنولوجيا المشترين العالميين في التوريد الموثوق."
        : "Explore Leela Gulf's key takeaways and highlights from ChemExpo India 2026. Discover how our tech-driven merchant export business is helping global buyers securely source.",
    },
  ];

  const items = eventsData || defaultEvents;

  // Filter items based on activeTab
  const filteredEvents = items.filter((evt) => {
    if (!activeTab || activeTab === "all") return true;
    if (activeTab === "past") return evt.category === "past" || !evt.category;
    if (activeTab === "upcoming") return evt.category === "upcoming";
    if (activeTab === "summits") return evt.category === "summits" || evt.booth?.toLowerCase().includes("hall");
    return true;
  });

  const openGalleryModal = (evt) => {
    setSelectedEvent(evt);
    setActiveModalImageIndex(0);
  };

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-16 sm:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── EVENTS 3-COLUMN RESPONSIVE GRID (1 col mobile, 2 col tablet, 3 col desktop) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {filteredEvents.map((evt, idx) => {
            const currentImg = failedImages[evt.id] ? defaultFallbackImg : evt.image || defaultFallbackImg;

            return (
              <div
                key={evt.id || idx}
                onClick={() => openGalleryModal(evt)}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200/80 hover:border-gold-main/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full"
              >
                
                {/* ── TOP IMAGE BOX ── */}
                <div className="relative w-full aspect-16/10 max-h-[200px] bg-gray-100 overflow-hidden shrink-0">
                  <Image
                    src={currentImg}
                    alt={evt.title}
                    fill
                    unoptimized
                    onError={() => setFailedImages((prev) => ({ ...prev, [evt.id]: true }))}
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Floating Date Badge Pill (Top-Left over Image - Matches Ref SS1) */}
                  <div className="absolute top-3.5 left-3.5 rtl:right-3.5 rtl:left-auto bg-black/90 text-gold-main font-heading font-bold text-[11px] sm:text-xs px-3.5 py-1 rounded-full shadow-md border border-gold-main/40 z-10">
                    <span>{evt.date}</span>
                  </div>
                </div>

                {/* ── BOTTOM CONTENT BOX ── */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    {/* Event Title */}
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1a1a1a] tracking-tight mb-2.5 group-hover:text-gold-main transition-colors duration-300 break-words" style={{ fontWeight: 700 }}>
                      {evt.title}
                    </h3>

                    {/* Event Description Paragraph */}
                    <p className="font-subheading text-xs sm:text-sm text-gray-500 leading-relaxed font-normal break-words line-clamp-3 mb-4">
                      {evt.description}
                    </p>
                  </div>

                  {/* View Gallery → Link */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-heading font-bold text-xs sm:text-sm text-gold-main group-hover:text-gold-dark inline-flex items-center gap-1.5 transition-colors duration-200" style={{ fontWeight: 700 }}>
                      <span>{isRTL ? "عرض المعرض" : "View Gallery"}</span>
                      <ArrowRight className={`w-4 h-4 text-gold-main group-hover:translate-x-1.5 transition-transform duration-200 ${isRTL ? "rotate-180" : ""}`} />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Fallback Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-[#161822] rounded-3xl border border-white/10 p-8 max-w-xl mx-auto">
            <Sparkles className="w-10 h-10 text-gold-main mx-auto mb-3 opacity-60" />
            <h3 className="font-heading font-bold text-xl text-white mb-2">
              {isRTL ? "لا توجد فعاليات حالياً" : "No Events Found"}
            </h3>
            <p className="font-subheading text-xs sm:text-sm text-gray-400">
              {isRTL
                ? "يرجى التحقق من الفئات الأخرى لمتابعة آخر المعارض."
                : "Please check other categories to explore our past and upcoming global exhibitions."}
            </p>
          </div>
        )}

      </div>

      {/* ═════════════════════════════════════════════════════════════════
          EVENT GALLERY & LIGHTBOX POPUP MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {selectedEvent && (
        <div
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col transition-all duration-300"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#161822] text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div>
                <span className="text-gold-main font-heading font-bold text-xs uppercase tracking-widest block mb-1">
                  {selectedEvent.date} • {selectedEvent.booth || "Exhibition"}
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white leading-tight">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold-main hover:text-black text-gray-300 flex items-center justify-center transition-all cursor-pointer shrink-0"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              
              {/* Main Photo Viewer */}
              <div className="relative w-full aspect-16/10 max-h-[360px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md">
                <Image
                  src={
                    selectedEvent.gallery?.[activeModalImageIndex] ||
                    selectedEvent.image ||
                    defaultFallbackImg
                  }
                  alt={selectedEvent.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Gallery Thumbnails (if multiple photos available) */}
              {selectedEvent.gallery && selectedEvent.gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {selectedEvent.gallery.map((gImg, gIdx) => (
                    <button
                      key={gIdx}
                      type="button"
                      onClick={() => setActiveModalImageIndex(gIdx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeModalImageIndex === gIdx
                          ? "border-gold-main scale-105 shadow-md"
                          : "border-gray-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={gImg}
                        alt={`Gallery ${gIdx + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Event Location & Description Details */}
              <div className="bg-[#fcfcfb] rounded-2xl p-4 sm:p-5 border border-gray-200/80">
                <div className="flex items-center gap-2 text-sm text-gray-700 font-heading font-semibold mb-2">
                  <MapPin className="w-4 h-4 text-gold-main shrink-0" />
                  <span>{selectedEvent.location}</span>
                </div>
                <p className="font-subheading text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
