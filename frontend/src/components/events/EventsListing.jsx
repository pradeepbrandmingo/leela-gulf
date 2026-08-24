"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, ChevronDown, X, Sparkles } from "lucide-react";

/**
 * EventsListing - Media & Exhibitions Responsive Events Grid & Interactive Lightbox Modal Component
 * 100% Match to Client Requirements & Reference UI Screenshots:
 * - 4-Column Responsive Grid on Desktop/XL screens (1 col mobile, 2 col tablet, 3 col laptop, 4 col desktop)
 * - White Rounded Card Design matching Reference SS2
 * - Floating Date Badge Pill top-left over event image (e.g. "Jul 11, 2026")
 * - Dynamic Load More button when events count exceeds 8 items (expands by 4 per click)
 * - Interactive Lightbox Gallery Modal for viewing high-res photos & event details
 * - 100% Dynamic Backend Data Payload & Global Theme Color Ready.
 */
export default function EventsListing({ eventsData, activeTab }) {
  const { isRTL } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const [visibleCount, setVisibleCount] = useState(8);

  const defaultFallbackImg = "/images/prodcut/dummy-product.jpg";

  // Sample 12 Events Data Structure (Matches 100% future Backend API response payload)
  const defaultEvents = [
    {
      id: "event-1",
      category: "past",
      date: "Jul 11, 2026",
      title: "IFT FIRST",
      location: isRTL ? "شيكاغو، الولايات المتحدة الأمريكية" : "Chicago, USA",
      booth: "Booth 5T19",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: ["/images/prodcut/dummy-product.jpg", "/images/prodcut/dummy-product.jpg"],
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
      gallery: ["/images/prodcut/dummy-product.jpg", "/images/prodcut/dummy-product.jpg"],
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
      gallery: ["/images/prodcut/dummy-product.jpg", "/images/prodcut/dummy-product.jpg"],
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
      gallery: ["/images/prodcut/dummy-product.jpg", "/images/prodcut/dummy-product.jpg"],
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
      gallery: ["/images/prodcut/dummy-product.jpg"],
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
      gallery: ["/images/prodcut/dummy-product.jpg"],
      description: isRTL
        ? "استكشف أبرز مخرجات ليلا الخليج من معرض كيم إكسبو الهند 2026. اكتشف كيف تساعد أعمال التصدير القائمة على التكنولوجيا المشترين العالميين في التوريد الموثوق."
        : "Explore Leela Gulf's key takeaways and highlights from ChemExpo India 2026. Discover how our tech-driven merchant export business is helping global buyers securely source.",
    },
    {
      id: "event-7",
      category: "past",
      date: "Mar 14, 2026",
      title: "Middle East Coatings Show 2026",
      location: isRTL ? "دبي، الإمارات العربية المتحدة" : "Dubai, UAE",
      booth: "Hall 3, Booth B12",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: ["/images/prodcut/dummy-product.jpg"],
      description: isRTL
        ? "تواصل مع قادة صناعة المواد الكيميائية والطلاء في معرض الشرق الأوسط للطلاء 2026 في دبي. نقدم أحدث الحلول والبوليمرات المتخصصة."
        : "Connect with chemical & coating industry leaders at the Middle East Coatings Show 2026 in Dubai. Discover our high-performance polymers and additives.",
    },
    {
      id: "event-8",
      category: "past",
      date: "Feb 22, 2026",
      title: "Global Petrochemical Summit 2026",
      location: isRTL ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia",
      booth: "Booth R40",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: ["/images/prodcut/dummy-product.jpg"],
      description: isRTL
        ? "قم بزيارة جناح ليلا الخليج في القمة العالمية للبتروكيماويات بالرياض للاطلاع على أحدث الابتكارات في سلاسل التوريد الكيميائية المستدامة."
        : "Visit Leela Gulf's pavilion at the Global Petrochemical Summit in Riyadh to discover sustainable chemical supply chain innovations.",
    },
    {
      id: "event-9",
      category: "past",
      date: "Jan 18, 2026",
      title: "Asia Pacific Food Ingredients 2026",
      location: isRTL ? "سنغافورة" : "Singapore",
      booth: "Booth S18",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: ["/images/prodcut/dummy-product.jpg"],
      description: isRTL
        ? "استعراض شامل لمستخلصات ومكونات الأغذية في معرض آسيا والمحيط الهادئ لمكونات الأغذية في سنغافورة."
        : "Comprehensive showcase of premium food extracts and additives at the Asia Pacific Food Ingredients expo in Singapore.",
    },
    {
      id: "event-10",
      category: "past",
      date: "Dec 05, 2025",
      title: "EuroChem Expo 2025",
      location: isRTL ? "فرانكفورت، ألمانيا" : "Frankfurt, Germany",
      booth: "Hall 4, Booth F09",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: ["/images/prodcut/dummy-product.jpg"],
      description: isRTL
        ? "استعراض أبرز المشاركات والتغطيات في معرض يورو كيم 2025 في فرانكفورت لخدمة الأسواق الأوروبية والعالمية."
        : "Highlighting Leela Gulf's key milestones at EuroChem Expo 2025 in Frankfurt serving European and international markets.",
    },
    {
      id: "event-11",
      category: "past",
      date: "Nov 12, 2025",
      title: "Latin America Pharma & Chem 2025",
      location: isRTL ? "ساو باولو، البرازيل" : "São Paulo, Brazil",
      booth: "Booth SP-21",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: ["/images/prodcut/dummy-product.jpg"],
      description: isRTL
        ? "تعزيز الروابط التجارية وتقديم المواد الكيميائية الصيدلانية عالية النقاء في ساو باولو."
        : "Strengthening merchant export ties and distributing high-purity pharmaceutical ingredients in São Paulo.",
    },
    {
      id: "event-12",
      category: "past",
      date: "Oct 28, 2025",
      title: "Gulf Chemical Trade Fair 2025",
      location: isRTL ? "أبوظبي، الإمارات العربية المتحدة" : "Abu Dhabi, UAE",
      booth: "Hall 2",
      image: "/images/prodcut/dummy-product.jpg",
      gallery: ["/images/prodcut/dummy-product.jpg"],
      description: isRTL
        ? "المشاركة الفعالة في معرض الخليج للتجارة الكيميائية 2025 وعرض الحلول التقنية المتقدمة للمستوردين."
        : "Active participation at the Gulf Chemical Trade Fair 2025 in Abu Dhabi showcasing advanced digital logistics and sourcing.",
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

  // Slice events based on visibleCount for pagination
  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const openGalleryModal = (evt) => {
    setSelectedEvent(evt);
    setActiveModalImageIndex(0);
  };

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-16 sm:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── EVENTS 4-COLUMN RESPONSIVE GRID (1 col mobile, 2 col tablet, 3 col laptop, 4 col desktop) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {visibleEvents.map((evt, idx) => {
            const currentImg = failedImages[evt.id] ? defaultFallbackImg : evt.image || defaultFallbackImg;

            return (
              <div
                key={evt.id || idx}
                onClick={() => openGalleryModal(evt)}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200/80 hover:border-gold-main/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full"
              >
                
                {/* ── TOP IMAGE BOX ── */}
                <div className="relative w-full aspect-16/10 max-h-[190px] bg-gray-100 overflow-hidden shrink-0">
                  <Image
                    src={currentImg}
                    alt={evt.title}
                    fill
                    unoptimized
                    onError={() => setFailedImages((prev) => ({ ...prev, [evt.id]: true }))}
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Floating Date Badge Pill (Top-Left over Image - Matches Ref SS2) */}
                  <div className="absolute top-3 left-3 rtl:right-3 rtl:left-auto bg-black/90 text-gold-main font-heading font-bold text-[11px] sm:text-[11px] px-3 py-0.5 rounded-full shadow-md border border-gold-main/40 z-10">
                    <span>{evt.date}</span>
                  </div>
                </div>

                {/* ── BOTTOM CONTENT BOX ── */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    {/* Event Title */}
                    <h3 className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight mb-2 group-hover:text-gold-main transition-colors duration-300 break-words" style={{ fontWeight: 700 }}>
                      {evt.title}
                    </h3>

                    {/* Event Description Paragraph */}
                    <p className="font-subheading text-xs sm:text-xs text-gray-500 leading-relaxed font-normal break-words line-clamp-3 mb-3.5">
                      {evt.description}
                    </p>
                  </div>

                  {/* View Gallery → Link */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-heading font-bold text-xs sm:text-xs text-gold-main group-hover:text-gold-dark inline-flex items-center gap-1.5 transition-colors duration-200" style={{ fontWeight: 700 }}>
                      <span>{isRTL ? "عرض المعرض" : "View Gallery"}</span>
                      <ArrowRight className={`w-3.5 h-3.5 text-gold-main group-hover:translate-x-1 transition-transform duration-200 ${isRTL ? "rotate-180" : ""}`} />
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ── LOAD MORE BUTTON (Renders when total events > visibleCount) ── */}
        {hasMore && (
          <div className="mt-12 sm:mt-16 text-center flex justify-center">
            <button
              type="button"
              onClick={handleLoadMore}
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-gold-main/20 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              <span>{isRTL ? "تحميل المزيد من الفعاليات" : "Load More Events"}</span>
              <ChevronDown className="w-4 h-4 text-black group-hover:translate-y-0.5 transition-transform duration-300 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Fallback Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-[#161822] rounded-3xl border border-white/10 p-8 max-w-xl mx-auto">
            <Sparkles className="w-10 h-10 text-gold-main mx-auto mb-3 opacity-60" />
            <h3 className="font-heading font-bold text-xl text-white mb-2">
              {isRTL ? "لا توجد فعاليات حالياً" : "No Events Found"}
            </h3>
            <p className="font-subheading text-xs sm:text-sm text-gray-400">
              {isRTL
                ? "يرجى التحقق لاحقاً لمتابعة آخر المعارض."
                : "Please check back later to explore our past and upcoming global exhibitions."}
            </p>
          </div>
        )}

      </div>

      {/* ═════════════════════════════════════════════════════════════════
          EVENT GALLERY & LIGHTBOX POPUP MODAL (Sleek 2-Column Laptop View)
          ═════════════════════════════════════════════════════════════════ */}
      {selectedEvent && (
        <div
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#161822] text-white border border-white/15 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col p-5 sm:p-7 md:p-8 transition-all duration-300"
          >
            {/* Close Button Top Right (Solid Gold Mobile & Desktop Fail-Safe) */}
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 rtl:left-3 rtl:right-auto sm:rtl:left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold-main text-black shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center transition-transform duration-200 cursor-pointer z-40"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5 text-black stroke-[3]" />
            </button>

            {/* Modal Body 2-Column Laptop Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center overflow-y-auto max-h-[85vh] pr-1">
              
              {/* ── LEFT COLUMN: MAIN IMAGE SHOWCASE & THUMBNAILS (lg:col-span-5 - Balanced Weight) ── */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                
                {/* Main Showcase Image Box (Proportional Aspect Ratio) */}
                <div className="relative w-full aspect-4/3 max-h-[250px] sm:max-h-[270px] rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-xl">
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

                {/* Gallery Thumbnails Below Main Image */}
                {selectedEvent.gallery && selectedEvent.gallery.length > 0 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
                    {selectedEvent.gallery.map((gImg, gIdx) => {
                      const isActive = activeModalImageIndex === gIdx;
                      return (
                        <button
                          key={gIdx}
                          type="button"
                          onClick={() => setActiveModalImageIndex(gIdx)}
                          className={`relative w-16 sm:w-20 h-12 sm:h-14 rounded-xl overflow-hidden shrink-0 transition-all duration-200 cursor-pointer bg-white ${
                            isActive
                              ? "border-2 border-gold-main opacity-100 scale-100"
                              : "border border-white/20 opacity-40 hover:opacity-85 hover:border-white/40 scale-95"
                          }`}
                        >
                          <Image
                            src={gImg}
                            alt={`Gallery photo ${gIdx + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>

              {/* ── RIGHT COLUMN: EVENT DETAILS (lg:col-span-7) ── */}
              <div className="lg:col-span-7 flex flex-col justify-center h-full pt-1">
                <div>
                  
                  {/* Event Date Tag Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-main/15 border border-gold-main/40 text-gold-main font-heading font-bold text-xs uppercase tracking-widest mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                    <span>{selectedEvent.date}</span>
                  </div>

                  {/* Event Title */}
                  <h2 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight mb-3.5 leading-snug" style={{ fontWeight: 700 }}>
                    {selectedEvent.title}
                  </h2>

                  {/* Event Description Paragraph (Scrollable protection for long backend paragraphs) */}
                  <div className="bg-[#1e212d] rounded-2xl p-4 sm:p-5 border border-white/10 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                    <p className="font-subheading text-xs sm:text-sm text-gray-300 leading-relaxed font-normal break-words">
                      {selectedEvent.description}
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
