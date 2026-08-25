"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, MapPin, Clock, X, CheckCircle2, Send } from "lucide-react";

// ── Backend-Ready Master Open Positions Dataset ──
export const DUMMY_POSITIONS = [
  {
    id: "pos-1",
    category: "QUALITY ASSURANCE",
    categoryAr: "ضمان الجودة",
    title: "Quality Control Engineer",
    titleAr: "مهندس مراقبة الجودة",
    description: "Ensure product quality and compliance with industry standards through rigorous testing, inspection, and data analysis.",
    descriptionAr: "ضمان جودة المنتجات والامتثال للمعايير الصناعية من خلال الاختبارات الصارمة والتفتيش.",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    type: "Full-Time",
    typeAr: "دوام كامل",
    department: "Quality & Compliance",
    responsibilities: [
      "Perform physical and chemical laboratory testing on raw materials and finished goods.",
      "Maintain ISO compliance and audit documentation.",
      "Collaborate with supply chain partners to resolve quality deviations.",
      "Conduct batch inspections and issue Certificates of Analysis (COA)."
    ],
    requirements: [
      "Bachelor's Degree in Chemical Engineering or Applied Chemistry.",
      "3+ years of QA/QC experience in chemical or industrial manufacturing.",
      "Proficiency in laboratory instrumentation (HPLC, GC, Spectrophotometry).",
      "Strong analytical skills and attention to detail."
    ]
  },
  {
    id: "pos-2",
    category: "LEGAL & COMPLIANCE",
    categoryAr: "الشؤون القانونية والامتثال",
    title: "Regulatory Affairs Specialist",
    titleAr: "أخصائي الشؤون التنظيمية",
    description: "Manage complex regulatory submissions, ensure strict compliance with global standards, and monitor environmental guidelines.",
    descriptionAr: "إدارة الملفات التنظيمية والامتثال للمعايير العالمية وإرشادات البيئة.",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    type: "Full-Time",
    typeAr: "دوام كامل",
    department: "Legal & Regulatory",
    responsibilities: [
      "Prepare and submit chemical product registration dossiers to Middle East regulatory authorities.",
      "Monitor international chemical safety regulations (REACH, GHS, REACH-UAE).",
      "Review SDS (Safety Data Sheets) and chemical transport compliance.",
      "Advise business teams on regulatory risk management."
    ],
    requirements: [
      "Degree in Law, Chemistry, or Environmental Science.",
      "4+ years of regulatory affairs experience in chemical/pharma sector.",
      "In-depth knowledge of GHS classification and MSDS preparation.",
      "Fluency in English (Arabic is a plus)."
    ]
  },
  {
    id: "pos-3",
    category: "OPERATIONS",
    categoryAr: "العمليات التشغيلية",
    title: "Production Executive",
    titleAr: "تنفيذي الإنتاج",
    description: "Oversee daily production processes, ensure supply chain efficiency, and maintain high-quality manufacturing output.",
    descriptionAr: "الإشراف على عمليات الإنتاج اليومية وضمان كفاءة سلسلة التوريد.",
    location: "Sharjah, UAE",
    locationAr: "الشارقة، الإمارات",
    type: "Full-Time",
    typeAr: "دوام كامل",
    department: "Plant Operations",
    responsibilities: [
      "Plan and execute daily batch production schedules.",
      "Supervise plant operators and strictly enforce EHS safety standards.",
      "Optimize yield and minimize process waste during chemical blending.",
      "Maintain equipment logbooks and report maintenance requirements."
    ],
    requirements: [
      "Diploma or Degree in Chemical/Mechanical Engineering.",
      "2-4 years hands-on experience in chemical process plant operations.",
      "Strong leadership and shift management skills.",
      "Commitment to workplace health and safety protocols."
    ]
  },
  {
    id: "pos-4",
    category: "ENGINEERING",
    categoryAr: "الهندسة والترميم",
    title: "Maintenance Engineer",
    titleAr: "مهندس الصيانة",
    description: "Maintain and optimize critical equipment performance to ensure smooth, safe, and uninterrupted facility operations.",
    descriptionAr: "صيانة وتحسين أداء المعدات لضمان التنسيق السلس للمرفق.",
    location: "Sharjah, UAE",
    locationAr: "الشارقة، الإمارات",
    type: "Full-Time",
    typeAr: "دوام كامل",
    department: "Maintenance & Reliability",
    responsibilities: [
      "Execute preventive maintenance programs for pumps, agitators, tanks, and piping.",
      "Troubleshoot electrical and mechanical faults in blending facilities.",
      "Manage spare parts inventory and vendor relationships.",
      "Implement energy efficiency and reliability improvements."
    ],
    requirements: [
      "Bachelor's Degree in Mechanical or Electrical Engineering.",
      "3+ years experience in process industry equipment maintenance.",
      "Proficiency in PLC controls, pumps, and pneumatic systems.",
      "Proactive problem solver with emergency response capability."
    ]
  },
  {
    id: "pos-5",
    category: "SUPPLY CHAIN & LOGISTICS",
    categoryAr: "سلسلة التوريد والخدمات اللوجستية",
    title: "Global Freight & Logistics Coordinator",
    titleAr: "منسق الشحن والخدمات اللوجستية العالمية",
    description: "Coordinate international vessel shipments, customs clearance, and iso-tank container logistics for liquid chemical distribution.",
    descriptionAr: "تنسيق الشحنات البحرية والتخليص الجمركي للحاويات الكيميائية.",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    type: "Full-Time",
    typeAr: "دوام كامل",
    department: "Logistics",
    responsibilities: [
      "Book vessel containers and dangerous goods (DG) air/sea freight.",
      "Manage customs documentation and bill of lading (BL) processing.",
      "Track global shipments and update clients on arrival schedules."
    ],
    requirements: [
      "Bachelor's Degree in Supply Chain or Business Administration.",
      "3+ years experience handling chemical cargo logistics in UAE/GCC.",
      "Certification in Hazmat / Dangerous Goods (DG) handling preferred."
    ]
  },
  {
    id: "pos-6",
    category: "COMMERCIAL & SALES",
    categoryAr: "المبيعات والتجارية",
    title: "Industrial Chemical Sales Manager",
    titleAr: "مدير مبيعات المواد الكيميائية الصناعية",
    description: "Drive B2B chemical distribution growth across Middle East & Africa regions, expanding key enterprise client accounts.",
    descriptionAr: "قيادة نمو توزيع المواد الكيميائية B2B وتوسيع حسابات العملاء.",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    type: "Full-Time",
    typeAr: "دوام كامل",
    department: "Commercial Sales",
    responsibilities: [
      "Develop new market opportunities for specialty and commodity chemicals.",
      "Negotiate supply contracts with industrial manufacturers.",
      "Achieve quarterly revenue and margin targets."
    ],
    requirements: [
      "Degree in Chemistry or Chemical Engineering + MBA.",
      "5+ years B2B sales experience in GCC chemical distribution.",
      "Proven track record of key account management."
    ]
  }
];

export default function OpenPositionsSection() {
  const { isRTL } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedJob, setSelectedJob] = useState(null);

  const displayedPositions = DUMMY_POSITIONS.slice(0, visibleCount);
  const hasMore = visibleCount < DUMMY_POSITIONS.length;

  const handleToggleLoadMore = () => {
    if (hasMore) {
      setVisibleCount(DUMMY_POSITIONS.length);
    } else {
      setVisibleCount(4);
    }
  };

  const handleApplyNow = (job) => {
    const subject = encodeURIComponent(`Application for ${job.title}`);
    const body = encodeURIComponent(`Hello Leela Gulf HR Team,\n\nI am interested in applying for the ${job.title} position (${job.location}). Please find my resume attached.\n\nBest regards,`);
    window.location.href = `mailto:careers@leelagulf.com?subject=${subject}&body=${body}`;
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
            {displayedPositions.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="group bg-white rounded-2xl p-4 sm:p-4.5 lg:p-5 text-black border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Category Label */}
                  <span className="font-heading font-bold text-[10px] sm:text-[10.5px] text-gray-400 tracking-wider uppercase block mb-0.5">
                    {isRTL ? job.categoryAr : job.category}
                  </span>

                  {/* Title + Arrow Row */}
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <h3 className="font-heading font-bold text-sm sm:text-base lg:text-[17px] text-black group-hover:text-gold-main transition-colors duration-200 leading-snug">
                      {isRTL ? job.titleAr : job.title}
                    </h3>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-main/10 flex items-center justify-center shrink-0 group-hover:bg-gradient-gold-animated group-hover:scale-105 transition-all duration-300">
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-main group-hover:text-black transition-colors" />
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="font-subheading text-xs sm:text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {isRTL ? job.descriptionAr : job.description}
                  </p>
                </div>

                {/* Pills Row (Location + Job Type) */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gray-100/90 text-gray-600 text-[10.5px] sm:text-xs font-subheading font-medium">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    {isRTL ? job.locationAr : job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gray-100/90 text-gray-600 text-[10.5px] sm:text-xs font-subheading font-medium">
                    <Clock className="w-3 h-3 text-gray-500" />
                    {isRTL ? job.typeAr : job.type}
                  </span>
                </div>
              </div>
            ))}

            {/* "View All Openings" / "Show Less" Action Button */}
            {DUMMY_POSITIONS.length > 4 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleToggleLoadMore}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
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
          JOB DETAILS POPUP MODAL
          ═══════════════════════════════════════════ */}
      {selectedJob && (
        <div
          onClick={() => setSelectedJob(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[var(--color-primary)] border border-gold-main/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/90 max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 rtl:left-4 rtl:right-auto sm:rtl:left-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-gold-main/40 text-gray-300 hover:text-white hover:border-gold-main hover:bg-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer z-20 shadow-lg hover:scale-105 group"
              aria-label="Close job details modal"
            >
              <X className="w-5 h-5 text-gray-300 group-hover:text-gold-light transition-colors" />
            </button>

            {/* Modal Header Box */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
              <div className="w-1.5 h-12 bg-gradient-gold-animated rounded-full absolute left-0 top-1/2 -translate-y-1/2" />
              <div className="pl-3 pr-8">
                <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-gold-light block mb-1">
                  {isRTL ? selectedJob.categoryAr : selectedJob.category}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl text-white leading-tight">
                  {isRTL ? selectedJob.titleAr : selectedJob.title}
                </h3>
                <div className="flex items-center gap-2.5 sm:gap-3 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-gray-300 text-xs font-subheading">
                    <MapPin className="w-3.5 h-3.5 text-gold-light" />
                    {isRTL ? selectedJob.locationAr : selectedJob.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-gray-300 text-xs font-subheading">
                    <Clock className="w-3.5 h-3.5 text-gold-light" />
                    {isRTL ? selectedJob.typeAr : selectedJob.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Responsibilities & Requirements */}
            <div className="space-y-5 mb-6 text-gray-300 text-xs sm:text-sm font-subheading">
              <div>
                <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                  {isRTL ? "الوصف الوظيفي" : "Job Overview"}
                </h4>
                <p className="leading-relaxed text-gray-300">
                  {isRTL ? selectedJob.descriptionAr : selectedJob.description}
                </p>
              </div>

              {selectedJob.responsibilities && (
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                    {isRTL ? "المهام والمسؤوليات الأساسية" : "Key Responsibilities"}
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedJob.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.requirements && (
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                    {isRTL ? "المتطلبات والخبرات" : "Requirements & Qualifications"}
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
                        <span>{req}</span>
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
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
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
