"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Languages,
  Eye,
  Save,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  X,
  ExternalLink,
  Loader2,
  ChevronDown,
  Edit3,
} from "lucide-react";
import { apiRequest } from "@/config/api";

const PRESET_DEPARTMENTS = [
  "Quality Assurance",
  "Legal & Compliance",
  "Operations",
  "Sales & Marketing",
  "Supply Chain & Logistics",
  "Research & Development (R&D)",
  "Finance & Accounting",
  "Human Resources",
];

const PRESET_JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Remote", "Internship"];

export default function AddCareerJobPage() {
  const router = useRouter();

  // Language Tab State
  const [activeLang, setActiveLang] = useState("en"); // 'en' | 'ar'
  const [isTranslating, setIsTranslating] = useState(false);

  // English Form Fields
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Quality Assurance");
  const [isCustomDept, setIsCustomDept] = useState(false);
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-Time");
  const [isCustomJobType, setIsCustomJobType] = useState(false);
  const [overview, setOverview] = useState("");
  const [responsibilities, setResponsibilities] = useState(["", "", ""]);
  const [requirements, setRequirements] = useState(["", "", ""]);

  // Arabic Form Fields
  const [titleAr, setTitleAr] = useState("");
  const [departmentAr, setDepartmentAr] = useState("");
  const [locationAr, setLocationAr] = useState("");
  const [jobTypeAr, setJobTypeAr] = useState("");
  const [overviewAr, setOverviewAr] = useState("");
  const [responsibilitiesAr, setResponsibilitiesAr] = useState(["", "", ""]);
  const [requirementsAr, setRequirementsAr] = useState(["", "", ""]);

  // Status State
  const [status, setStatus] = useState("Published"); // 'Published' | 'Draft'

  // Dropdown Open States
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const deptRef = useRef(null);
  const typeRef = useRef(null);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (deptRef.current && !deptRef.current.contains(e.target)) setShowDeptDropdown(false);
      if (typeRef.current && !typeRef.current.contains(e.target)) setShowTypeDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── DYNAMIC ARRAY HANDLERS ──
  const handleAddResponsibility = () => {
    if (activeLang === "en") {
      setResponsibilities([...responsibilities, ""]);
    } else {
      setResponsibilitiesAr([...responsibilitiesAr, ""]);
    }
  };

  const handleUpdateResponsibility = (idx, val) => {
    if (activeLang === "en") {
      const arr = [...responsibilities];
      arr[idx] = val;
      setResponsibilities(arr);
    } else {
      const arr = [...responsibilitiesAr];
      arr[idx] = val;
      setResponsibilitiesAr(arr);
    }
  };

  const handleRemoveResponsibility = (idx) => {
    if (activeLang === "en") {
      const arr = responsibilities.filter((_, i) => i !== idx);
      setResponsibilities(arr.length === 0 ? [""] : arr);
    } else {
      const arr = responsibilitiesAr.filter((_, i) => i !== idx);
      setResponsibilitiesAr(arr.length === 0 ? [""] : arr);
    }
  };

  const handleAddRequirement = () => {
    if (activeLang === "en") {
      setRequirements([...requirements, ""]);
    } else {
      setRequirementsAr([...requirementsAr, ""]);
    }
  };

  const handleUpdateRequirement = (idx, val) => {
    if (activeLang === "en") {
      const arr = [...requirements];
      arr[idx] = val;
      setRequirements(arr);
    } else {
      const arr = [...requirementsAr];
      arr[idx] = val;
      setRequirementsAr(arr);
    }
  };

  const handleRemoveRequirement = (idx) => {
    if (activeLang === "en") {
      const arr = requirements.filter((_, i) => i !== idx);
      setRequirements(arr.length === 0 ? [""] : arr);
    } else {
      const arr = requirementsAr.filter((_, i) => i !== idx);
      setRequirementsAr(arr.length === 0 ? [""] : arr);
    }
  };

  // ── AUTO TRANSLATE TO ARABIC ──
  const handleAutoTranslate = async () => {
    if (!title.trim()) {
      setErrMsg("Please enter an English Job Title before translating.");
      return;
    }

    setIsTranslating(true);
    setErrMsg("");
    try {
      const validResp = responsibilities.filter((r) => r.trim());
      const validReq = requirements.filter((r) => r.trim());

      // 1. Try Backend Translation API
      let trans = null;
      try {
        const payload = {
          title,
          department,
          location: location || "Dubai, UAE",
          jobType,
          overview,
          responsibilities: validResp,
          requirements: validReq,
        };

        const res = await apiRequest("/translate", {
          method: "POST",
          body: JSON.stringify({
            payload,
            targetLang: "ar",
            sourceLang: "en",
          }),
        });

        if (res?.success && (res.translated || res.data)) {
          trans = res.translated || res.data;
        }
      } catch (backendErr) {
        console.warn("Backend translation api failed, using direct client fallback:", backendErr);
      }

      // 2. Direct Fallback if needed
      if (!trans || !trans.title) {
        const translateSingle = async (str) => {
          if (!str || !str.trim()) return "";
          try {
            const r = await fetch(
              `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(str)}`
            );
            if (r.ok) {
              const d = await r.json();
              if (d && Array.isArray(d[0])) return d[0].map((item) => item[0]).join("");
            }
          } catch (e) {
            console.warn(e);
          }
          return str;
        };

        const tTitle = await translateSingle(title);
        const tDept = await translateSingle(department);
        const tLoc = await translateSingle(location || "Dubai, UAE");
        const tType = await translateSingle(jobType);
        const tOverview = await translateSingle(overview);
        const tResp = await Promise.all(validResp.map((r) => translateSingle(r)));
        const tReq = await Promise.all(validReq.map((r) => translateSingle(r)));

        trans = {
          title: tTitle,
          department: tDept,
          location: tLoc,
          jobType: tType,
          overview: tOverview,
          responsibilities: tResp,
          requirements: tReq,
        };
      }

      // Populate Arabic States
      if (trans.title) setTitleAr(trans.title);
      if (trans.department) setDepartmentAr(trans.department);
      if (trans.location) setLocationAr(trans.location);
      if (trans.jobType) setJobTypeAr(trans.jobType);
      if (trans.overview) setOverviewAr(trans.overview);
      if (Array.isArray(trans.responsibilities)) {
        setResponsibilitiesAr(trans.responsibilities.length > 0 ? trans.responsibilities : ["", "", ""]);
      }
      if (Array.isArray(trans.requirements)) {
        setRequirementsAr(trans.requirements.length > 0 ? trans.requirements : ["", "", ""]);
      }

      setActiveLang("ar");
      setToastMsg("Job details translated to Arabic successfully!");
      setTimeout(() => setToastMsg(""), 3500);
    } catch (err) {
      console.error("Translation error:", err);
      setActiveLang("ar");
    } finally {
      setIsTranslating(false);
    }
  };

  // ── SUBMIT FORM HANDLER ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrMsg("Please provide a Job Title.");
      return;
    }
    if (!overview.trim()) {
      setErrMsg("Please provide a Job Overview.");
      return;
    }

    const cleanedResp = responsibilities.filter((r) => r.trim());
    const cleanedRespAr = responsibilitiesAr.filter((r) => r.trim());
    const cleanedReq = requirements.filter((r) => r.trim());
    const cleanedReqAr = requirementsAr.filter((r) => r.trim());

    setIsSubmitting(true);
    setErrMsg("");
    try {
      const payload = {
        title: title.trim(),
        titleAr: titleAr.trim() || title.trim(),
        department: department.trim(),
        departmentAr: departmentAr.trim() || department.trim(),
        location: location.trim() || "Dubai, UAE",
        locationAr: locationAr.trim() || location.trim() || "دبي، الإمارات",
        jobType: jobType.trim() || "Full-Time",
        jobTypeAr: jobTypeAr.trim() || jobType.trim() || "دوام كامل",
        overview: overview.trim(),
        overviewAr: overviewAr.trim() || overview.trim(),
        responsibilities: cleanedResp,
        responsibilitiesAr: cleanedRespAr.length > 0 ? cleanedRespAr : cleanedResp,
        requirements: cleanedReq,
        requirementsAr: cleanedReqAr.length > 0 ? cleanedReqAr : cleanedReq,
        status,
      };

      const res = await apiRequest("/careers/jobs", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res && res.success === false) {
        throw new Error(res.message || "Failed to publish job opening.");
      }

      setToastMsg("Job Opening published successfully to MongoDB!");
      setTimeout(() => {
        router.push("/admin/careers");
      }, 1000);
    } catch (err) {
      setErrMsg(err.message || "Failed to create job posting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 font-subheading text-gray-900">
      
      {/* ── TOP ACTION BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        
        {/* Left: Back Link & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/careers"
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
            title="Back to Careers"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
              Post New Job
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Publish a new career opportunity to the Leela Gulf careers page.
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Status Toggle Button */}
          <button
            type="button"
            onClick={() => setStatus((prev) => (prev === "Published" ? "Draft" : "Published"))}
            className={`px-3 py-2 rounded-xl text-xs font-heading font-bold border transition-colors cursor-pointer ${
              status === "Published"
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
            }`}
          >
            ● {status === "Published" ? "Status: Published" : "Status: Draft"}
          </button>

          {/* Preview Modal Button */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-heading font-bold transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Preview Modal</span>
          </button>

          {/* Save & Publish Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold-main hover:bg-gold-light text-black text-xs sm:text-sm font-heading font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>Save Job</span>
          </button>

        </div>
      </div>

      {/* ── TOAST NOTIFICATIONS ── */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}
      {errMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-bold animate-in fade-in flex items-center gap-2">
          <X className="w-4 h-4 text-red-600" />
          <span>{errMsg}</span>
        </div>
      )}

      {/* ── LANGUAGE SWITCHER & AUTO TRANSLATE BUTTON ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Language Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveLang("en")}
            className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeLang === "en"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang("ar")}
            className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
              activeLang === "ar"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            العربية (Arabic)
          </button>
        </div>

        {/* Auto Translate Button */}
        <button
          type="button"
          disabled={isTranslating}
          onClick={handleAutoTranslate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-main/15 hover:bg-gold-main/30 border border-gold-main/40 text-gold-dark text-xs font-heading font-bold transition-colors cursor-pointer disabled:opacity-50"
        >
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin text-gold-dark" />
          ) : (
            <Languages className="w-4 h-4 text-gold-dark" />
          )}
          <span>Auto Translate to Arabic</span>
        </button>

      </div>

      {/* ── JOB DETAILS FORM CARD ── */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        
        {/* Section 1: Core Job Info */}
        <div className="space-y-4">
          <h3 className="font-heading font-extrabold text-lg text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Briefcase className="w-4 h-4 text-gold-dark" />
            <span>Job Header & Classification</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Job Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              {activeLang === "en" ? (
                <input
                  type="text"
                  placeholder="e.g. Quality Control Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
                />
              ) : (
                <input
                  type="text"
                  dir="rtl"
                  placeholder="مثال: مهندس مراقبة الجودة"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
                />
              )}
            </div>

            {/* Department (Custom Luxury Themed Dropdown + Manual Option) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider">
                  Department / Category <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomDept(!isCustomDept)}
                  className="text-[11px] text-gold-dark font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isCustomDept ? "Choose from list" : "Enter custom"}</span>
                </button>
              </div>

              {activeLang === "en" ? (
                isCustomDept ? (
                  <input
                    type="text"
                    placeholder="Enter custom department (e.g. Petrochemicals)"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
                  />
                ) : (
                  <div className="relative" ref={deptRef}>
                    <button
                      type="button"
                      onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden hover:border-gold-main text-gray-900 transition-colors cursor-pointer text-left"
                    >
                      <span className="truncate">{department || "Select Department"}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    </button>

                    {showDeptDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-30 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                        {PRESET_DEPARTMENTS.map((dept) => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => {
                              setDepartment(dept);
                              setShowDeptDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                              department === dept
                                ? "bg-gold-main/15 text-gold-dark font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{dept}</span>
                            {department === dept && <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ) : (
                <input
                  type="text"
                  dir="rtl"
                  placeholder="مثال: ضمان الجودة"
                  value={departmentAr}
                  onChange={(e) => setDepartmentAr(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
                />
              )}
            </div>

            {/* Location & Job Type */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Location with Placeholder */}
              <div>
                <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Location
                </label>
                {activeLang === "en" ? (
                  <input
                    type="text"
                    placeholder="e.g. Dubai, UAE"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 transition-colors"
                  />
                ) : (
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثال: دبي، الإمارات"
                    value={locationAr}
                    onChange={(e) => setLocationAr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 transition-colors"
                  />
                )}
              </div>

              {/* Job Type (Custom Luxury Themed Dropdown + Manual Option) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider">
                    Job Type
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomJobType(!isCustomJobType)}
                    className="text-[11px] text-gold-dark font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isCustomJobType ? "Select" : "Custom"}</span>
                  </button>
                </div>

                {activeLang === "en" ? (
                  isCustomJobType ? (
                    <input
                      type="text"
                      placeholder="e.g. Part-Time"
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
                    />
                  ) : (
                    <div className="relative" ref={typeRef}>
                      <button
                        type="button"
                        onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden hover:border-gold-main text-gray-900 transition-colors cursor-pointer text-left"
                      >
                        <span className="truncate">{jobType || "Select Type"}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      </button>

                      {showTypeDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                          {PRESET_JOB_TYPES.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setJobType(type);
                                setShowTypeDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                                jobType === type
                                  ? "bg-gold-main/15 text-gold-dark font-bold"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <span>{type}</span>
                              {jobType === type && <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثال: دوام كامل"
                    value={jobTypeAr}
                    onChange={(e) => setJobTypeAr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
                  />
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Section 2: Job Overview */}
        <div className="space-y-2">
          <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider">
            Job Overview / Summary <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-gray-400 block mb-1">
            Displayed on front job cards (2-3 lines) and in top section of the popup modal.
          </span>
          {activeLang === "en" ? (
            <textarea
              rows={4}
              placeholder="Ensure product quality and compliance with industry standards through rigorous testing, inspection, and data analysis."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 leading-relaxed transition-colors"
            />
          ) : (
            <textarea
              rows={4}
              dir="rtl"
              placeholder="ضمان جودة المنتج والامتثال لمعايير الصناعة من خلال الاختبارات الصارمة والفحص وتحليل البيانات."
              value={overviewAr}
              onChange={(e) => setOverviewAr(e.target.value)}
              className="w-full px-4 py-3 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 leading-relaxed transition-colors"
            />
          )}
        </div>

        {/* Section 3: Key Responsibilities (Empty inputs with placeholders by default) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider">
              Key Responsibilities (Bullet Points)
            </label>
            <button
              type="button"
              onClick={handleAddResponsibility}
              className="inline-flex items-center gap-1 text-xs font-heading font-bold text-gold-dark hover:text-black transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Responsibility</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(activeLang === "en" ? responsibilities : responsibilitiesAr).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-main/20 text-gold-dark text-[10.5px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  placeholder={
                    activeLang === "en"
                      ? idx === 0
                        ? "e.g. Perform physical and chemical laboratory testing on raw materials."
                        : idx === 1
                        ? "e.g. Maintain ISO compliance and audit documentation."
                        : "e.g. Collaborate with supply chain partners to resolve quality deviations."
                      : idx === 0
                      ? "مثال: إجراء الاختبارات المعملية الفيزيائية والكيميائية على المواد الخام."
                      : idx === 1
                      ? "مثال: الحفاظ على الامتثال لمعايير الأيزو ووثائق التدقيق."
                      : "مثال: التعاون مع شركاء سلسلة التوريد لحل انحرافات الجودة."
                  }
                  value={item}
                  onChange={(e) => handleUpdateResponsibility(idx, e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveResponsibility(idx)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove point"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Requirements & Qualifications (Empty inputs with placeholders by default) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-heading font-bold text-gray-900 uppercase tracking-wider">
              Requirements & Qualifications (Bullet Points)
            </label>
            <button
              type="button"
              onClick={handleAddRequirement}
              className="inline-flex items-center gap-1 text-xs font-heading font-bold text-gold-dark hover:text-black transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Requirement</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {(activeLang === "en" ? requirements : requirementsAr).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gold-main/20 text-gold-dark text-[10.5px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  placeholder={
                    activeLang === "en"
                      ? idx === 0
                        ? "e.g. Bachelor's Degree in Chemical Engineering or Applied Chemistry."
                        : idx === 1
                        ? "e.g. 3+ years of QA/QC experience in chemical manufacturing."
                        : "e.g. Strong analytical skills and attention to detail."
                      : idx === 0
                      ? "مثال: درجة البكالوريوس في الهندسة الكيميائية أو الكيمياء التطبيقية."
                      : idx === 1
                      ? "مثال: خبرة لا تقل عن 3 سنوات في ضمان ومراقبة الجودة."
                      : "مثال: مهارات تحليلية قوية والاهتمام الدقيق بالتفاصيل."
                  }
                  value={item}
                  onChange={(e) => handleUpdateRequirement(idx, e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(idx)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove requirement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════════
          LIVE JOB PREVIEW MODAL (Screenshot 2 Match)
          ═════════════════════════════════════════════════════════════════ */}
      {isPreviewOpen && (
        <div
          onClick={() => setIsPreviewOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0d1017] border border-gold-main/30 rounded-3xl overflow-hidden shadow-2xl text-white p-6 sm:p-8 space-y-6 my-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-gold-main hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge & Title Card */}
            <div className="bg-[#141724] border-l-4 border-gold-main rounded-2xl p-4 sm:p-5 space-y-2">
              <span className="text-[11px] font-heading font-bold text-gold-main tracking-wider uppercase block">
                {activeLang === "ar" ? (departmentAr || department) : department}
              </span>
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                {activeLang === "ar" ? (titleAr || title || "عنوان الوظيفة") : (title || "Job Title")}
              </h2>
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs text-gray-300 bg-black/50 border border-white/10 px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-gold-main" />
                  <span>{activeLang === "ar" ? (locationAr || location || "دبي، الإمارات") : (location || "Dubai, UAE")}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-300 bg-black/50 border border-white/10 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>{activeLang === "ar" ? (jobTypeAr || jobType || "دوام كامل") : (jobType || "Full-Time")}</span>
                </span>
              </div>
            </div>

            {/* Job Overview */}
            <div className="space-y-1.5">
              <h4 className="font-heading font-bold text-sm text-gold-light">Job Overview</h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {activeLang === "ar" ? (overviewAr || overview || "نظرة عامة على الوظيفة...") : (overview || "Job overview description...")}
              </p>
            </div>

            {/* Key Responsibilities */}
            {(activeLang === "ar" ? responsibilitiesAr : responsibilities).filter(Boolean).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-gold-light">Key Responsibilities</h4>
                <ul className="space-y-2">
                  {(activeLang === "ar" ? responsibilitiesAr : responsibilities).filter(Boolean).map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements & Qualifications */}
            {(activeLang === "ar" ? requirementsAr : requirements).filter(Boolean).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-gold-light">Requirements & Qualifications</h4>
                <ul className="space-y-2">
                  {(activeLang === "ar" ? requirementsAr : requirements).filter(Boolean).map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ready to Apply Bottom Box */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141724]/80 p-4 rounded-2xl">
              <div>
                <h5 className="font-heading font-bold text-sm text-white">Ready to Apply?</h5>
                <p className="text-xs text-gray-400">Send your CV directly to our HR hiring team.</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gold-main text-black font-heading font-bold text-xs shadow-md">
                <span>Apply Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
