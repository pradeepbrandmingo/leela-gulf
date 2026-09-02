"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/config/api";

/**
 * EventsListing - Media & Exhibitions Responsive Events Grid & Interactive Lightbox Modal Component
 */
export default function EventsListing({ eventsData, activeTab }) {
  const { isRTL } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});
  const [visibleCount, setVisibleCount] = useState(8);

  const defaultFallbackImg = "/images/prodcut/dummy-product.jpg";

  const [liveEvents, setLiveEvents] = useState(eventsData || []);
  const [isLoading, setIsLoading] = useState(!eventsData);

  const thumbnailsRef = useRef(null);

  useEffect(() => {
    if (eventsData) {
      setLiveEvents(eventsData);
      setIsLoading(false);
      return;
    }

    async function fetchLiveEvents() {
      setIsLoading(true);
      try {
        const res = await apiRequest("/events?status=Published", { method: "GET" });
        if (res?.success && Array.isArray(res.data)) {
          setLiveEvents(res.data);
        } else {
          setLiveEvents([]);
        }
      } catch (err) {
        console.error("Could not fetch events:", err);
        setLiveEvents([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLiveEvents();
  }, [eventsData]);

  const items = liveEvents || [];

  // Strict Filter: 1. Hide Drafts + 2. Filter by activeTab
  const filteredEvents = items.filter((evt) => {
    if (evt.status && evt.status.toLowerCase() === "draft") {
      return false;
    }
    if (!activeTab || activeTab === "all") return true;
    if (activeTab === "past") return evt.category === "past" || !evt.category;
    if (activeTab === "upcoming") return evt.category === "upcoming";
    if (activeTab === "summits") return evt.category === "summits" || evt.booth?.toLowerCase().includes("hall");
    return true;
  });

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const openGalleryModal = (evt) => {
    setSelectedEvent(evt);
    setActiveModalImageIndex(0);
  };

  // Modal Image Navigation & Continuous Thumbnail Sync
  const currentGallery =
    selectedEvent && Array.isArray(selectedEvent.gallery) && selectedEvent.gallery.length > 0
      ? selectedEvent.gallery
      : selectedEvent?.image
      ? [selectedEvent.image]
      : [];

  const scrollToThumbnail = (idx) => {
    if (thumbnailsRef.current) {
      const btn = thumbnailsRef.current.children[idx];
      if (btn) {
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  };

  const handlePrevImage = () => {
    if (currentGallery.length <= 1) return;
    const newIdx = activeModalImageIndex > 0 ? activeModalImageIndex - 1 : currentGallery.length - 1;
    setActiveModalImageIndex(newIdx);
    scrollToThumbnail(newIdx);
  };

  const handleNextImage = () => {
    if (currentGallery.length <= 1) return;
    const newIdx = activeModalImageIndex < currentGallery.length - 1 ? activeModalImageIndex + 1 : 0;
    setActiveModalImageIndex(newIdx);
    scrollToThumbnail(newIdx);
  };

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-16 sm:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── EVENTS 4-COLUMN RESPONSIVE GRID / SPINNER / EMPTY STATE ── */}
        {isLoading ? (
          <div className="w-full py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-gold-main" />
            <span className="font-heading text-xs sm:text-sm text-gray-400 font-semibold tracking-wide">
              {isRTL ? "جاري تحميل الفعاليات..." : "Loading exhibitions & events..."}
            </span>
          </div>
        ) : filteredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {visibleEvents.map((evt, idx) => {
                const currentImg = failedImages[evt._id || evt.id]
                  ? defaultFallbackImg
                  : evt.image || defaultFallbackImg;

                const displayTitle = isRTL ? (evt.titleAr || evt.title) : evt.title;
                const displayDesc = isRTL ? (evt.descriptionAr || evt.description) : evt.description;

                return (
                  <div
                    key={evt._id || evt.id || idx}
                    onClick={() => openGalleryModal(evt)}
                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200/80 hover:border-gold-main/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full"
                  >
                    
                    {/* ── TOP IMAGE BOX ── */}
                    <div className="relative w-full aspect-16/10 max-h-[190px] bg-gray-100 overflow-hidden shrink-0">
                      <Image
                        src={currentImg}
                        alt={displayTitle}
                        fill
                        unoptimized
                        onError={() => setFailedImages((prev) => ({ ...prev, [evt._id || evt.id]: true }))}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Floating Date Badge Pill */}
                      <div className="absolute top-3 left-3 rtl:right-3 rtl:left-auto bg-black/90 text-gold-main font-heading font-bold text-[11px] sm:text-[11px] px-3 py-0.5 rounded-full shadow-md border border-gold-main/40 z-10">
                        <span>{evt.date}</span>
                      </div>
                    </div>

                    {/* ── BOTTOM CONTENT BOX ── */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        {/* Event Title */}
                        <h3 className="font-heading font-bold text-base sm:text-lg text-[#1a1a1a] tracking-tight mb-2 group-hover:text-gold-main transition-colors duration-300 break-words" style={{ fontWeight: 700 }}>
                          {displayTitle}
                        </h3>

                        {/* Event Description Paragraph (Automatically clamped to 2-3 lines on card) */}
                        <p className="font-subheading text-xs sm:text-xs text-gray-500 leading-relaxed font-normal break-words line-clamp-3 mb-3.5">
                          {displayDesc}
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

            {/* ── LOAD MORE BUTTON ── */}
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
          </>
        ) : (
          /* Fallback Empty State */
          <div className="text-center py-16 bg-[var(--color-primary)] rounded-3xl border border-white/10 p-8 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gold-main/10 border border-gold-main/25 flex items-center justify-center mx-auto mb-4 text-gold-main shadow-lg">
              <Calendar className="w-7 h-7 stroke-[1.75]" />
            </div>
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
          EVENT GALLERY & LIGHTBOX POPUP MODAL (Fully Responsive with Slider & Fluid Layout)
          ═════════════════════════════════════════════════════════════════ */}
      {selectedEvent && (
        <div
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl lg:max-w-5xl bg-[#0d1017] text-white border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 md:p-7 my-auto transition-all duration-300"
          >
            {/* Close Button Top Right */}
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 rtl:left-3 rtl:right-auto sm:rtl:left-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold-main hover:bg-gold-light text-black shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 cursor-pointer z-50"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[3]" />
            </button>

            {/* Modal Body: 2-Column Fully Responsive Zero-Scroll Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center max-lg:max-h-[82vh] max-lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              
              {/* ── LEFT COLUMN: MAIN IMAGE SHOWCASE & THUMBNAIL SLIDER (lg:col-span-5) ── */}
              <div className="lg:col-span-5 flex flex-col gap-3 w-full">
                
                {/* Main Showcase Image Box */}
                <div className="relative w-full aspect-16/10 max-h-[220px] sm:max-h-[250px] rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-xl group">
                  <Image
                    src={
                      currentGallery[activeModalImageIndex] ||
                      selectedEvent.image ||
                      defaultFallbackImg
                    }
                    alt={selectedEvent.title || "Event Image"}
                    fill
                    unoptimized
                    className="object-cover transition-all duration-300"
                  />

                  {/* Main Image Overlay Left / Right Navigation Arrows */}
                  {currentGallery.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-2.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-gold-main text-white hover:text-black flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                        title="Previous Image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 hover:bg-gold-main text-white hover:text-black flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                        title="Next Image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Image Counter Badge */}
                  {currentGallery.length > 1 && (
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white font-mono text-[10px] sm:text-[10.5px] px-2 py-0.5 rounded-md border border-white/10">
                      {activeModalImageIndex + 1} / {currentGallery.length}
                    </div>
                  )}
                </div>

                {/* ── HORIZONTAL THUMBNAIL SLIDER WITH LEFT & RIGHT ARROW BUTTONS ── */}
                {currentGallery.length > 1 && (
                  <div className="relative flex items-center gap-1.5 w-full">
                    
                    {/* Left Scroll Arrow Button */}
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-gold-main hover:text-black text-white flex items-center justify-center transition-colors shadow-md shrink-0 cursor-pointer"
                      title="Previous Image"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Scrollable Thumbnails Strip (Hidden scrollbar) */}
                    <div
                      ref={thumbnailsRef}
                      className="flex items-center gap-2 overflow-x-auto py-0.5 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1"
                    >
                      {currentGallery.map((gImg, gIdx) => {
                        const isActive = activeModalImageIndex === gIdx;
                        return (
                          <button
                            key={gIdx}
                            type="button"
                            onClick={() => {
                              setActiveModalImageIndex(gIdx);
                              scrollToThumbnail(gIdx);
                            }}
                            className={`relative w-13 sm:w-15 h-9 sm:h-11 rounded-xl overflow-hidden shrink-0 transition-all duration-200 cursor-pointer bg-black/40 ${
                              isActive
                                ? "border-2 border-gold-main opacity-100 scale-100 shadow-md"
                                : "border border-white/20 opacity-50 hover:opacity-90 hover:border-white/40 scale-95"
                            }`}
                          >
                            <Image
                              src={gImg}
                              alt={`Thumbnail ${gIdx + 1}`}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Scroll Arrow Button */}
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 hover:bg-gold-main hover:text-black text-white flex items-center justify-center transition-colors shadow-md shrink-0 cursor-pointer"
                      title="Next Image"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                  </div>
                )}

              </div>

              {/* ── RIGHT COLUMN: EVENT DETAILS WITH FLUID RESPONSIVE CONTENT ── */}
              <div className="lg:col-span-7 flex flex-col justify-center h-full space-y-2.5 sm:space-y-3 w-full">
                
                {/* Event Date Tag Badge */}
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-gold-main/15 border border-gold-main/40 text-gold-light font-heading font-bold text-xs uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                    <span>{selectedEvent.date}</span>
                  </span>
                </div>

                {/* Event Title */}
                <h2 className="font-heading font-extrabold text-lg sm:text-xl lg:text-2xl text-white tracking-tight leading-snug break-words">
                  {isRTL ? (selectedEvent.titleAr || selectedEvent.title) : selectedEvent.title}
                </h2>

                {/* Full Description Box (Zero-scroll, compact, perfectly fitted) */}
                <div className="bg-[#141724] border border-white/10 rounded-2xl p-3.5 sm:p-4 text-gray-300 text-xs sm:text-[13px] leading-relaxed font-subheading shadow-inner">
                  <p className="break-words whitespace-pre-line">
                    {isRTL
                      ? (selectedEvent.descriptionAr || selectedEvent.description)
                      : selectedEvent.description}
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
