"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, MapPin, Clock, X, CheckCircle2, Send, Briefcase, Loader2 } from "lucide-react";

export default function OpenPositionsSection() {
  const { isRTL } = useLanguage();
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch Live Published Jobs from Backend MongoDB
  useEffect(() => {
    async function fetchJobs() {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/careers/jobs`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPositions(data.data);
        } else {
          setPositions([]);
        }
      } catch (err) {
        console.warn("Error fetching published jobs:", err);
        setPositions([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const displayedPositions = positions.slice(0, visibleCount);
  const hasMore = visibleCount < positions.length;

  const handleToggleLoadMore = () => {
    if (hasMore) {
      setVisibleCount(positions.length);
    } else {
      setVisibleCount(4);
    }
  };

  const handleApplyNow = (job) => {
    // 1. Dispatch event to preselect position in application form
    if (job?.title) {
      window.dispatchEvent(
        new CustomEvent("selectCareerRole", {
          detail: { title: job.title },
        })
      );
    }

    // 2. Close Modal Popup
    setSelectedJob(null);

    // 3. Smooth Scroll down to Career Application Form
    setTimeout(() => {
      const formElement = document.getElementById("apply-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <section id="open-roles-section" className="w-full bg-[var(--color-primary)] py-8 sm:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ═══════════════════════════════════════════
            SECTION HEADER
            ═══════════════════════════════════════════ */}
        <div className="mb-6 sm:mb-8">
          {/* Small Gold Badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 sm:w-6 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
            <span className="font-heading font-bold text-[10px] sm:text-xs tracking-[0.2em] text-gold-light uppercase">
              {isRTL ? "الوظائف المتاحة" : "CAREERS"}
            </span>
          </div>

          {/* Main Title */}
          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-2 tracking-tight">
            {isRTL ? (
              <>
                الوظائف <span className="text-gradient-gold-animated">المتاحة</span>
              </>
            ) : (
              <>
                Open <span className="text-gradient-gold-animated">Positions</span>
              </>
            )}
          </h2>

          {/* Subtitle / Description */}
          <p className="font-subheading text-gray-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {isRTL
              ? "استكشف الفرص الوظيفية الممثلة في ليلا جلف. انضم إلى مهمتنا لتعزيز التميز والابتكار والاستدامة في الصناعة الكيميائية."
              : "Explore exciting opportunities at Leela Gulf. Join our mission to drive excellence, innovation, and sustainability in the chemical industry."}
          </p>
        </div>

        {/* ═══════════════════════════════════════════
            2-COLUMN GRID (Job Cards Left + Why Leela Gulf Right)
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7 items-start">

          {/* ── LEFT COLUMN (2 Cols): OPEN JOB CARDS LIST ── */}
          <div className="lg:col-span-2 space-y-3.5 sm:space-y-4">
            {isLoading ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[220px]">
                <Loader2 className="w-8 h-8 text-gold-main animate-spin mb-3" />
                <p className="text-xs sm:text-sm text-gray-400 font-subheading">
                  {isRTL ? "جاري تحميل الوظائف المتاحة..." : "Loading open positions..."}
                </p>
              </div>
            ) : positions.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-10 text-center">
                <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-gold-main/60 mx-auto mb-3" />
                <h4 className="font-heading font-bold text-base sm:text-lg text-white mb-1.5">
                  {isRTL ? "لا توجد شواغر حالياً" : "No Open Positions Currently"}
                </h4>
                <p className="font-subheading text-xs sm:text-sm text-gray-400 max-w-md mx-auto mb-5 leading-relaxed">
                  {isRTL
                    ? "لا توجد شواغر معلنة حالياً. يمكنك تقديم طلبك العام عبر النموذج بالأسفل وسيقوم فريقنا بمراجعته."
                    : "There are currently no active job vacancies. You are welcome to submit a general application using the form below."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const formElement = document.getElementById("apply-form");
                    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gold-main text-black font-heading font-bold text-xs sm:text-sm shadow-md cursor-pointer hover:bg-gold-light transition-all hover:scale-105 active:scale-95"
                >
                  {isRTL ? "تقديم طلب عام" : "Submit General Application"}
                </button>
              </div>
            ) : (
              displayedPositions.map((job) => {
                const id = job._id || job.id;
                return (
                  <div
                    key={id}
                    onClick={() => setSelectedJob(job)}
                    className="group bg-white rounded-2xl p-4 sm:p-5 text-black border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
                  >
                    <div className="space-y-1.5">
                      {/* Category Label */}
                      <span className="font-heading font-bold text-[10px] sm:text-[11px] text-gold-dark tracking-wider uppercase block truncate">
                        {isRTL ? (job.departmentAr || job.department) : job.department}
                      </span>

                      {/* Title + Arrow Row */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading font-bold text-sm sm:text-base lg:text-[17px] text-black group-hover:text-gold-dark transition-colors duration-200 leading-snug break-words flex-1">
                          {isRTL ? (job.titleAr || job.title) : job.title}
                        </h3>
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-main/15 flex items-center justify-center shrink-0 group-hover:bg-gradient-gold-animated group-hover:scale-110 transition-all duration-300 mt-0.5">
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark group-hover:text-black transition-colors" />
                        </div>
                      </div>

                      {/* Short Description */}
                      <p className="font-subheading text-xs sm:text-[13px] text-gray-600 line-clamp-2 sm:line-clamp-3 leading-relaxed break-words pt-0.5">
                        {isRTL ? (job.overviewAr || job.overview) : job.overview}
                      </p>
                    </div>

                    {/* Pills Row (Location + Job Type) */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 mt-auto">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/90 text-gray-700 text-[10.5px] sm:text-xs font-subheading font-medium">
                        <MapPin className="w-3 h-3 text-gold-dark shrink-0" />
                        <span className="truncate max-w-[150px]">{isRTL ? (job.locationAr || job.location) : (job.location || "Dubai, UAE")}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/90 text-gray-700 text-[10.5px] sm:text-xs font-subheading font-medium">
                        <Clock className="w-3 h-3 text-gold-dark shrink-0" />
                        <span className="truncate">{isRTL ? (job.jobTypeAr || job.jobType) : (job.jobType || "Full-Time")}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}

            {/* "View All Openings" / "Show Less" Action Button */}
            {positions.length > 4 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleToggleLoadMore}
                  className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  {hasMore
                    ? isRTL
                      ? "عرض جميع الوظائف"
                      : "View All Openings"
                    : isRTL
                    ? "عرض أقل"
                    : "Show Less"}
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (1 Col): "WHY LEELA GULF?" INFO CARD ── */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-4.5 sm:p-5 lg:p-6 text-black shadow-sm border border-gray-100 sticky top-28">
            <h3 className="font-heading font-bold text-base sm:text-lg text-black mb-3.5 border-b border-gray-100 pb-2.5">
              {isRTL ? "لماذا ليلا جلف؟" : "Why Leela Gulf?"}
            </h3>

            <div className="space-y-3 sm:space-y-3.5">
              {/* Point 1 */}
              <div className="relative pl-3.5 rtl:pr-3.5 rtl:pl-0 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gold-main">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-black mb-0.5">
                  {isRTL ? "النمو المهني" : "Career Growth"}
                </h4>
                <p className="font-subheading text-[11.5px] sm:text-xs text-gray-500 leading-relaxed">
                  {isRTL
                    ? "مسارات تطوير واضحة وميزانيات مخصصة للتطوير المهني المستمر."
                    : "Clear progression paths and dedicated budgets for your professional development."}
                </p>
              </div>

              {/* Point 2 */}
              <div className="relative pl-3.5 rtl:pr-3.5 rtl:pl-0 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gold-main">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-black mb-0.5">
                  {isRTL ? "ثقافة شاملة" : "Inclusive Culture"}
                </h4>
                <p className="font-subheading text-[11.5px] sm:text-xs text-gray-500 leading-relaxed">
                  {isRTL
                    ? "بيئة عمل متنوعة عالمياً قائمة على الاحترام والاستحقاق والنجاح التشاركي."
                    : "A globally diverse workplace built on respect, merit, and collaborative success."}
                </p>
              </div>

              {/* Point 3 */}
              <div className="relative pl-3.5 rtl:pr-3.5 rtl:pl-0 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gold-main">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-black mb-0.5">
                  {isRTL ? "الصحة والرفاهية" : "Health & Wellness"}
                </h4>
                <p className="font-subheading text-[11.5px] sm:text-xs text-gray-500 leading-relaxed">
                  {isRTL
                    ? "تغطية طبية شاملة وبرامج صحية ومبادرات توازن الحياة والعمل."
                    : "Comprehensive medical coverage, wellness programs, and work-life balance initiatives."}
                </p>
              </div>

              {/* Point 4 */}
              <div className="relative pl-3.5 rtl:pr-3.5 rtl:pl-0 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gold-main">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-black mb-0.5">
                  {isRTL ? "عمل ذو أثر" : "Impactful Work"}
                </h4>
                <p className="font-subheading text-[11.5px] sm:text-xs text-gray-500 leading-relaxed">
                  {isRTL
                    ? "المساهمة المباشرة في سلاسل التوريد الكيميائية المستدامة التي تشكل مستقبلاً أكثر خضرة."
                    : "Contribute directly to sustainable chemical supply chains that shape a greener future."}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ═══════════════════════════════════════════
          JOB DETAILS POPUP MODAL (Original Seamless Luxury Design - No Slider)
          ═══════════════════════════════════════════ */}
      {selectedJob && (
        <div
          onClick={() => setSelectedJob(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[var(--color-primary)] border border-gold-main/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/90 max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300 my-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 rtl:left-4 rtl:right-auto sm:rtl:left-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-gold-main/40 text-gray-300 hover:text-white hover:border-gold-main hover:bg-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer z-20 shadow-lg hover:scale-105 active:scale-95 group"
              aria-label="Close job details modal"
            >
              <X className="w-5 h-5 text-gray-300 group-hover:text-gold-light transition-colors" />
            </button>

            {/* Modal Header Box */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
              <div className="w-1.5 h-12 bg-gradient-gold-animated rounded-full absolute left-0 top-1/2 -translate-y-1/2" />
              <div className="pl-3 pr-8 rtl:pr-3 rtl:pl-8">
                <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-gold-light block mb-1">
                  {isRTL
                    ? (selectedJob.departmentAr || selectedJob.categoryAr || selectedJob.department || selectedJob.category)
                    : (selectedJob.department || selectedJob.category)}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl text-white leading-tight break-words">
                  {isRTL ? (selectedJob.titleAr || selectedJob.title) : selectedJob.title}
                </h3>
                <div className="flex items-center gap-2.5 sm:gap-3 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-subheading">
                    <MapPin className="w-3.5 h-3.5 text-gold-light shrink-0" />
                    <span>{isRTL ? (selectedJob.locationAr || selectedJob.location) : (selectedJob.location || "Dubai, UAE")}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-subheading">
                    <Clock className="w-3.5 h-3.5 text-gold-light shrink-0" />
                    <span>{isRTL ? (selectedJob.jobTypeAr || selectedJob.typeAr || selectedJob.jobType || selectedJob.type) : (selectedJob.jobType || selectedJob.type || "Full-Time")}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Key Responsibilities & Requirements */}
            <div className="space-y-5 mb-6 text-gray-300 text-xs sm:text-sm font-subheading">
              {(selectedJob.overview || selectedJob.overviewAr || selectedJob.description || selectedJob.descriptionAr) && (
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                    {isRTL ? "الوصف الوظيفي" : "Job Overview"}
                  </h4>
                  <p className="leading-relaxed text-gray-300 break-words">
                    {isRTL
                      ? (selectedJob.overviewAr || selectedJob.descriptionAr || selectedJob.overview || selectedJob.description)
                      : (selectedJob.overview || selectedJob.description)}
                  </p>
                </div>
              )}

              {Array.isArray(selectedJob.responsibilities) && selectedJob.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                    {isRTL ? "المهام والمسؤوليات الأساسية" : "Key Responsibilities"}
                  </h4>
                  <ul className="space-y-1.5">
                    {(isRTL && Array.isArray(selectedJob.responsibilitiesAr) && selectedJob.responsibilitiesAr.length > 0
                      ? selectedJob.responsibilitiesAr
                      : selectedJob.responsibilities
                    ).map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
                        <span className="leading-relaxed break-words">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(selectedJob.requirements) && selectedJob.requirements.length > 0 && (
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                    {isRTL ? "المتطلبات والخبرات" : "Requirements & Qualifications"}
                  </h4>
                  <ul className="space-y-1.5">
                    {(isRTL && Array.isArray(selectedJob.requirementsAr) && selectedJob.requirementsAr.length > 0
                      ? selectedJob.requirementsAr
                      : selectedJob.requirements
                    ).map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
                        <span className="leading-relaxed break-words">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* APPLY NOW CTA BUTTON BAR */}
            <div className="pt-5 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-heading font-bold text-base text-white">
                  {isRTL ? "هل أنت مستعد للانضمام؟" : "Ready to Apply?"}
                </h4>
                <p className="font-subheading text-xs text-gray-400">
                  {isRTL
                    ? "أرسل سيرتك الذاتية مباشرة إلى فريق التوظيف لدينا."
                    : "Send your CV directly to our HR hiring team."}
                </p>
              </div>

              {/* Running Gold Apply Now Button */}
              <button
                type="button"
                onClick={() => handleApplyNow(selectedJob)}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>{isRTL ? "قدّم الآن" : "Apply Now"}</span>
                <Send className="w-4 h-4 text-black stroke-[2.2]" />
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
