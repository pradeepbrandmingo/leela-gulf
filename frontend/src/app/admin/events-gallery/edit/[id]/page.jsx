"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  X,
  Languages,
  Eye,
  Loader2,
  Plus,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiRequest } from "@/config/api";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;

  // Active Language Tab ('en' | 'ar')
  const [activeLang, setActiveLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Core Event Form State
  const [status, setStatus] = useState("Published"); // 'Published' | 'Draft'
  const [eventDate, setEventDate] = useState("");
  const [customDateDisplay, setCustomDateDisplay] = useState("");

  // English Content State (Single Unified Description)
  const [enTitle, setEnTitle] = useState("");
  const [enDescription, setEnDescription] = useState("");

  // Arabic Content State (Single Unified Description)
  const [arTitle, setArTitle] = useState("");
  const [arDescription, setArDescription] = useState("");

  // Unified Images State (1st image is automatically the Main Card Cover, all images are in Popup Gallery)
  const [images, setImages] = useState([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewActiveImgIdx, setPreviewActiveImgIdx] = useState(0);

  const fileInputRef = useRef(null);

  // Fetch Event Data by ID
  useEffect(() => {
    async function fetchEventDetails() {
      if (!eventId) return;
      setIsLoading(true);
      try {
        const res = await apiRequest(`/events/${eventId}`, { method: "GET" });
        if (res.success && res.data) {
          const ev = res.data;
          setEnTitle(ev.title || "");
          setArTitle(ev.titleAr || "");
          setCustomDateDisplay(ev.date || "");
          setEnDescription(ev.description || ev.shortDescription || "");
          setArDescription(ev.descriptionAr || ev.shortDescriptionAr || "");
          
          const loadedImages = Array.isArray(ev.gallery) && ev.gallery.length > 0
            ? ev.gallery
            : (ev.image ? [ev.image] : []);
          setImages(loadedImages);
          setStatus(ev.status || "Published");
        }
      } catch (err) {
        console.warn("Could not fetch event from API:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEventDetails();
  }, [eventId]);

  // Format date helper: "2026-07-11" -> "Jul 11, 2026"
  const handleDateChange = (val) => {
    setEventDate(val);
    if (!val) {
      setCustomDateDisplay("");
      return;
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      const formatted = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      setCustomDateDisplay(formatted);
    }
  };

  // AI / Auto-Translate English to Arabic
  const handleAutoTranslate = async () => {
    if (!enTitle.trim()) {
      setErrMsg("Please provide an English Event Title before translating.");
      return;
    }

    setIsTranslating(true);
    setErrMsg("");
    try {
      let translatedTitle = "";
      let translatedDesc = "";

      // 1. Try Backend Translation Endpoint
      try {
        const res = await apiRequest("/translate", {
          method: "POST",
          body: JSON.stringify({
            payload: {
              title: enTitle,
              description: enDescription || "",
            },
            targetLang: "ar",
            sourceLang: "en",
          }),
        });

        const trans = res?.translated || res?.data;
        if (res?.success && trans) {
          if (trans.title && trans.title !== enTitle) translatedTitle = trans.title;
          if (trans.description && trans.description !== enDescription) translatedDesc = trans.description;
        }
      } catch (backendErr) {
        console.warn("Backend translation api failed, using direct client fallback:", backendErr);
      }

      // 2. Direct Client-side Fallback for Title
      if (!translatedTitle) {
        try {
          const directTitleRes = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(enTitle)}`
          );
          if (directTitleRes.ok) {
            const data = await directTitleRes.json();
            if (data && Array.isArray(data[0])) {
              translatedTitle = data[0].map((item) => item[0]).join("");
            }
          }
        } catch (e) {
          console.warn("Direct title translation fallback failed:", e);
        }
      }

      // 3. Direct Client-side Fallback for Description
      if (enDescription && !translatedDesc) {
        try {
          const directDescRes = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(enDescription)}`
          );
          if (directDescRes.ok) {
            const data = await directDescRes.json();
            if (data && Array.isArray(data[0])) {
              translatedDesc = data[0].map((item) => item[0]).join("");
            }
          }
        } catch (e) {
          console.warn("Direct desc translation fallback failed:", e);
        }
      }

      if (translatedTitle) setArTitle(translatedTitle);
      if (translatedDesc) setArDescription(translatedDesc);

      setActiveLang("ar");
      setToastMsg("Event content translated to Arabic successfully!");
      setTimeout(() => setToastMsg(""), 3500);
    } catch (err) {
      console.error("Auto translate error:", err);
      setActiveLang("ar");
    } finally {
      setIsTranslating(false);
    }
  };

  // Upload Helper
  const uploadSingleFile = async (file) => {
    const MAX_MB = 15;
    if (file.size > MAX_MB * 1024 * 1024) {
      throw new Error(`File "${file.name}" exceeds ${MAX_MB}MB. Please select an image under ${MAX_MB}MB.`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "events");

    const res = await apiRequest("/upload/single", {
      method: "POST",
      body: formData,
      isFormData: true,
    });

    const url = res?.data?.url || res?.url;
    if (!res?.success || !url) {
      throw new Error(res?.message || "Image upload failed");
    }

    return url;
  };

  // Unified Multiple / Single Image Upload Handler
  const handleImagesSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingImages(true);
    setErrMsg("");
    try {
      const uploadPromises = files.map((f) => uploadSingleFile(f));
      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      setErrMsg(err.message || "Could not upload images");
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMakeMainCover = (idx) => {
    if (idx === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const selected = copy.splice(idx, 1)[0];
      return [selected, ...copy];
    });
  };

  // Submit Update Handler
  const handleSubmit = async (targetStatus) => {
    const finalStatus = targetStatus || status;
    setErrMsg("");
    setToastMsg("");

    if (!enTitle.trim()) {
      setErrMsg("Please provide an Event Title (Heading).");
      setActiveLang("en");
      return;
    }

    if (!customDateDisplay && !eventDate) {
      setErrMsg("Please provide an Event Date.");
      return;
    }

    if (!enDescription.trim()) {
      setErrMsg("Please enter the Event Description.");
      setActiveLang("en");
      return;
    }

    const mainCover = images[0] || "/images/prodcut/dummy-product.jpg";
    const galleryList = images.length > 0 ? images : ["/images/prodcut/dummy-product.jpg"];

    const payload = {
      title: enTitle.trim(),
      titleAr: arTitle.trim() || enTitle.trim(),
      date: customDateDisplay || eventDate,
      image: mainCover,
      gallery: galleryList,
      description: enDescription.trim(),
      descriptionAr: arDescription.trim() || enDescription.trim(),
      shortDescription: enDescription.trim().slice(0, 160),
      shortDescriptionAr: (arDescription.trim() || enDescription.trim()).slice(0, 160),
      status: finalStatus,
      category: "past",
    };

    setIsSubmitting(true);
    try {
      const res = await apiRequest(`/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setToastMsg("Event updated successfully!");
        setStatus(finalStatus);
        setTimeout(() => {
          router.push("/admin/events-gallery");
        }, 900);
      } else {
        setErrMsg(res.message || "Failed to update event. Please try again.");
      }
    } catch (err) {
      console.warn("API save error:", err);
      setErrMsg(err.message || "Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayDate = customDateDisplay || eventDate || "Jul 11, 2026";
  const displayTitle = activeLang === "en" ? (enTitle || "Event Title") : (arTitle || enTitle || "عنوان الفعالية");
  const displayDesc = activeLang === "en" ? (enDescription || "Event description...") : (arDescription || enDescription || "تفاصيل الفعالية...");

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold-main" />
        <span className="text-xs font-heading font-bold text-gray-400 tracking-wide">
          Loading Event Details...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-subheading text-gray-900 max-w-[1380px] mx-auto">
      
      {/* ── 1. TOP HEADER & STICKY ACTION BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
        
        {/* Left: Back Link & Title */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1">
            <Link href="/admin/events-gallery" className="hover:text-gold-dark flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Events</span>
            </Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-bold">Edit Event</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
              Edit Event
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-heading font-bold ${
                status === "Published"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-amber-50 text-amber-700 border border-amber-200/60"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{status}</span>
            </span>
          </div>
        </div>

        {/* Right: Actions (Preview Modal, Publish / Draft Toggle, Update) */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* Quick Preview Modal Button */}
          <button
            type="button"
            onClick={() => {
              setIsPreviewOpen(true);
              setPreviewActiveImgIdx(0);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-gold-main text-gray-700 text-xs font-heading font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-gold-dark" />
            <span>Preview Modal</span>
          </button>

          {/* Quick Publish / Make Draft Toggle Button */}
          {status === "Published" ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit("Draft")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-heading font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Make Draft</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit("Published")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-heading font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <span>Publish Event</span>
            </button>
          )}

          {/* Save / Update Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(status)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gold-main hover:bg-gold-light text-black text-xs font-heading font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* ── TOAST / ERROR NOTIFICATIONS ── */}
      {errMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errMsg}</span>
          </div>
          <button onClick={() => setErrMsg("")} className="text-red-500 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 2. MAIN 2-COLUMN FORM CONTAINER (Clean & Unified) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN (7 Cols): TITLE, DATE, UNIFIED DESCRIPTION & AUTO-TRANSLATE ── */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Bilingual Language Switcher + Auto Translate Button */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  activeLang === "en"
                    ? "bg-[#0f1117] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>English</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveLang("ar")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                  activeLang === "ar"
                    ? "bg-[#0f1117] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>العربية (Arabic)</span>
              </button>
            </div>

            {/* AI Auto Translate Button */}
            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={isTranslating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fdfaf0] hover:bg-gold-main/20 text-gold-dark border border-gold-main/40 rounded-xl text-xs font-heading font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-dark" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5 text-gold-dark" />
                  <span>Auto Translate to Arabic</span>
                </>
              )}
            </button>
          </div>

          {/* Event Details Card */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            
            {/* Event Title */}
            <div>
              <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider mb-2">
                Event Heading / Title <span className="text-red-500">*</span>
              </label>
              {activeLang === "en" ? (
                <input
                  type="text"
                  placeholder="e.g. IFT FIRST or World Perfumery Congress 2026"
                  value={enTitle}
                  onChange={(e) => setEnTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 font-heading font-bold placeholder-gray-400 transition-colors"
                />
              ) : (
                <input
                  type="text"
                  dir="rtl"
                  placeholder="مثال: معرض IFT FIRST أو المؤتمر العالمي للعطور 2026"
                  value={arTitle}
                  onChange={(e) => setArTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 font-heading font-bold placeholder-gray-400 transition-colors"
                />
              )}
            </div>

            {/* Event Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Change Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Display Date Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jul 11, 2026"
                  value={customDateDisplay}
                  onChange={(e) => setCustomDateDisplay(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 font-mono transition-colors"
                />
              </div>
            </div>

            {/* ── SINGLE UNIFIED EVENT DESCRIPTION ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider">
                  Event Description <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  Card preview (2-3 lines) + Full text in popup
                </span>
              </div>
              {activeLang === "en" ? (
                <textarea
                  rows={6}
                  placeholder="Discover Leela Gulf's food ingredient export solutions at IFT FIRST 2026 in Chicago (Booth 5T19). Securely source top-grade food additives, preservatives, and specialty chemicals directly."
                  value={enDescription}
                  onChange={(e) => setEnDescription(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 leading-relaxed transition-colors resize-y"
                />
              ) : (
                <textarea
                  rows={6}
                  dir="rtl"
                  placeholder="اكتشف حلول تصدير مكونات الأغذية من ليلا الخليج في معرض IFT FIRST 2026 في شيكاغو (الجناح 5T19). توريد آمن وموثوق للمضافات الغذائية والمحافظ عالية الجودة."
                  value={arDescription}
                  onChange={(e) => setArDescription(e.target.value)}
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 leading-relaxed transition-colors resize-y"
                />
              )}
              <span className="text-[11px] text-gray-400 mt-1.5 block">
                Note: Front page card automatically truncates to 2-3 lines with ellipsis (...), and clicking the card displays this full text in the lightbox popup.
              </span>
            </div>

          </div>

        </div>

        {/* ── RIGHT COLUMN (5 Cols): SINGLE UNIFIED EVENT IMAGES & GALLERY UPLOADER ── */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-sm text-gray-900">
                  Event Images & Gallery
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  First image is the main cover. Multiple images will appear in the popup modal.
                </p>
              </div>

              {images.length > 0 && (
                <button
                  type="button"
                  disabled={isUploadingImages}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gold-main hover:text-black text-gray-700 text-xs font-heading font-bold transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More</span>
                </button>
              )}
            </div>

            {/* Upload Area / Dropzone */}
            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="py-12 px-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-gold-main hover:bg-gray-50 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 group"
              >
                {isUploadingImages ? (
                  <>
                    <Loader2 className="w-8 h-8 text-gold-main animate-spin" />
                    <span className="text-xs font-heading font-bold text-gray-700">Uploading event images...</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-gold-main/10 text-gold-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-heading font-bold text-gray-800">
                        Click or drag to upload Event Images
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Upload single or multiple images (PNG, JPG, WEBP, Max 5MB each)
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* 1st Image Feature Box (Main Card Cover) */}
                <div className="relative w-full aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gold-main shadow-xs group">
                  <Image
                    src={images[0]}
                    alt="Main Event Cover Image"
                    fill
                    className="object-cover"
                  />
                  
                  {/* Floating Main Cover Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/90 text-gold-main font-heading font-bold text-[10.5px] px-2.5 py-0.5 rounded-full shadow-md border border-gold-main/40 z-10">
                    <span>Main Cover Image</span>
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-md hover:bg-gray-100 transition-colors"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(0)}
                      className="p-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Additional Images Grid Thumbnails (If 2+ images uploaded) */}
                {images.length > 1 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                      <span>Gallery Thumbnails ({images.length - 1} extra photos in popup)</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {images.slice(1).map((imgUrl, idx) => {
                        const realIndex = idx + 1;
                        return (
                          <div
                            key={realIndex}
                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group shadow-2xs"
                          >
                            <Image
                              src={imgUrl}
                              alt={`Event photo ${realIndex + 1}`}
                              fill
                              className="object-cover"
                            />

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                              <button
                                type="button"
                                onClick={() => handleMakeMainCover(realIndex)}
                                className="text-[9px] font-bold text-white bg-black/80 hover:bg-gold-main hover:text-black px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer"
                              >
                                Set as Main
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(realIndex)}
                                className="p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Add More Box in grid */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-gold-main flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors p-2"
                      >
                        {isUploadingImages ? (
                          <Loader2 className="w-5 h-5 text-gold-main animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-5 h-5 text-gray-400 mb-0.5" />
                            <span className="text-[10px] font-bold text-gray-500">+ Upload</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImagesSelect}
              className="hidden"
            />
          </div>

        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════════
          INTERACTIVE POPUP MODAL PREVIEW (100% Matching Frontend Popup!)
          ═════════════════════════════════════════════════════════════════ */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl lg:max-w-4xl bg-[#0d1017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl text-white p-5 sm:p-7 space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gold-main hover:bg-gold-light text-black flex items-center justify-center transition-colors cursor-pointer shadow-lg z-20"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Modal Body: Left Image & Right Info */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start overflow-y-auto max-h-[82vh] pr-1">
              
              {/* Left Column: Active Image + Thumbnails */}
              <div className="sm:col-span-5 space-y-3">
                <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-black/50 shadow-md border border-white/10 group">
                  <Image
                    src={
                      images[previewActiveImgIdx] ||
                      images[0] ||
                      "/images/prodcut/dummy-product.jpg"
                    }
                    alt={displayTitle}
                    fill
                    className="object-cover"
                  />

                  {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <button
                        type="button"
                        onClick={() => setPreviewActiveImgIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="pointer-events-auto w-7 h-7 rounded-full bg-black/70 hover:bg-gold-main text-white hover:text-black flex items-center justify-center transition-colors shadow-md"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewActiveImgIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="pointer-events-auto w-7 h-7 rounded-full bg-black/70 hover:bg-gold-main text-white hover:text-black flex items-center justify-center transition-colors shadow-md"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Multiple Images Gallery Thumbnails Slider */}
                {images.length > 1 && (
                  <div className="flex items-center gap-1.5 w-full">
                    <button
                      type="button"
                      onClick={() => setPreviewActiveImgIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-gold-main hover:text-black text-white flex items-center justify-center transition-colors shrink-0"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-1">
                      {images.map((imgUrl, gIdx) => (
                        <button
                          key={gIdx}
                          onClick={() => setPreviewActiveImgIdx(gIdx)}
                          className={`relative w-12 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            previewActiveImgIdx === gIdx
                              ? "border-gold-main scale-105 shadow-md"
                              : "border-white/20 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`Gallery thumbnail ${gIdx + 1}`}
                            fill
                            className="object-cover bg-black/40"
                          />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewActiveImgIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="w-6 h-6 rounded-full bg-white/10 hover:bg-gold-main hover:text-black text-white flex items-center justify-center transition-colors shrink-0"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Date Pill + Heading + Full Description */}
              <div className="sm:col-span-7 space-y-3.5">
                
                {/* Floating Date Pill */}
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-gold-main/40 text-gold-light text-xs font-heading font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                    <span>{displayDate}</span>
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="font-heading font-extrabold text-lg sm:text-2xl text-white tracking-tight leading-snug break-words">
                  {displayTitle}
                </h2>

                {/* Full Description Box (No scrollbar - Clean, spacious, and responsive) */}
                <div className="bg-[#141724] border border-white/10 rounded-2xl p-4 sm:p-5 text-gray-300 text-xs sm:text-sm leading-relaxed font-subheading shadow-inner">
                  <p className="break-words whitespace-pre-line">
                    {displayDesc}
                  </p>
                </div>

              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-subheading">
                Status: <strong className="text-white">{status}</strong>
              </span>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="text-gold-light hover:text-white font-heading font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
