"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, Upload, CheckCircle2, Lock, ArrowRight, AlertCircle, ChevronDown, Check, Search } from "lucide-react";
import { GLOBAL_COUNTRIES } from "@/data/countryCodes";

// ── Dropdown Options Datasets ──
const EDUCATION_OPTIONS = [
  { label: "High School", labelAr: "الثانوية العامة" },
  { label: "Diploma", labelAr: "دبلوم" },
  { label: "Bachelor's Degree", labelAr: "بكالوريوس" },
  { label: "Master's Degree", labelAr: "ماجستير" },
  { label: "Doctorate / PhD", labelAr: "دكتوراه" },
];

const SPECIALIZATION_OPTIONS = [
  { label: "Quality Assurance / QC", labelAr: "ضمان ومراقبة الجودة" },
  { label: "Regulatory Affairs", labelAr: "الشؤون التنظيمية" },
  { label: "Production & Manufacturing", labelAr: "الإنتاج والتصنيع" },
  { label: "Maintenance & Mechanical", labelAr: "الصيانة والهندسة الميكانيكية" },
  { label: "Sales & Business Development", labelAr: "المبيعات وتطوير الأعمال" },
];

const EXPERIENCE_OPTIONS = [
  { label: "Fresher (0-1 Year)", labelAr: "حديث التخرج (0-1 سنة)" },
  { label: "1-2 Years", labelAr: "1-2 سنوات" },
  { label: "3-5 Years", labelAr: "3-5 سنوات" },
  { label: "5+ Years", labelAr: "أكثر من 5 سنوات" },
];

const POST_APPLIED_OPTIONS = [
  { label: "Quality Control Engineer", labelAr: "مهندس مراقبة الجودة" },
  { label: "Regulatory Affairs Specialist", labelAr: "أخصائي الشؤون التنظيمية" },
  { label: "Production Executive", labelAr: "تنفيذي الإنتاج" },
  { label: "Maintenance Engineer", labelAr: "مهندس الصيانة" },
  { label: "Other Profile", labelAr: "تخصص آخر" },
];

const HEAR_ABOUT_OPTIONS = [
  { label: "LinkedIn", labelAr: "لينكد إن" },
  { label: "Company Website", labelAr: "موقع الشركة" },
  { label: "Employee Referral", labelAr: "توصية موظف" },
  { label: "Job Portal", labelAr: "بوابة الوظائف" },
  { label: "Other", labelAr: "مصدر آخر" },
];

const GENDER_OPTIONS = [
  { label: "Male", labelAr: "ذكر" },
  { label: "Female", labelAr: "أنثى" },
  { label: "Prefer not to say", labelAr: "أفضل عدم الإفصاح" },
];

// ── CUSTOM THEME DROPDOWN COMPONENT (Compact Height & Single Gold Active Border) ──
function CustomSelect({ placeholder, options, value, onChange, error, isRTL }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOpt = options.find((opt) => opt.label === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gray-50 text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all outline-none ${
          isOpen
            ? "border-2 border-gold-main bg-white shadow-xs"
            : error
            ? "border-2 border-red-500 bg-red-50/10"
            : "border border-gray-200 hover:border-gold-main/60"
        }`}
      >
        <span className={selectedOpt ? "text-gray-900 font-bold font-subheading" : "text-gray-400 font-subheading"}>
          {selectedOpt ? (isRTL ? selectedOpt.labelAr : selectedOpt.label) : placeholder}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gold-main shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-56 overflow-y-auto py-1 animate-[fadeIn_0.15s_ease-out]">
          {options.map((opt) => (
            <div
              key={opt.label}
              onClick={() => {
                onChange(opt.label);
                setIsOpen(false);
              }}
              className={`px-3.5 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-subheading flex items-center justify-between cursor-pointer transition-colors ${
                value === opt.label
                  ? "bg-gold-main/15 text-gold-main font-bold"
                  : "text-gray-800 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <span>{isRTL ? opt.labelAr : opt.label}</span>
              {value === opt.label && <Check className="w-3.5 h-3.5 text-gold-main shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── GLOBAL COUNTRY DIAL CODE PHONE INPUT COMPONENT (Compact Specs) ──
function GlobalPhoneInput({ dialCode, setDialCode, phoneNumber, setPhoneNumber, error, isRTL }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = GLOBAL_COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dialCode.includes(search)
  );

  const selectedCountry = GLOBAL_COUNTRIES.find((c) => c.dialCode === dialCode) || GLOBAL_COUNTRIES.find((c) => c.code === "AE") || GLOBAL_COUNTRIES[0];

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`w-full flex items-center rounded-xl bg-gray-50 transition-all ${
          error
            ? "border-2 border-red-500 bg-red-50/10"
            : isOpen
            ? "border-2 border-gold-main bg-white shadow-xs"
            : "border border-gray-200 focus-within:border-2 focus-within:border-gold-main focus-within:bg-white"
        }`}
      >
        {/* Country Flag & Dial Code Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-2.5 sm:px-3 sm:py-2.5 flex items-center gap-1.5 border-r rtl:border-l rtl:border-r-0 border-gray-200 text-gray-900 font-bold text-xs sm:text-sm hover:bg-gray-100/80 transition-colors shrink-0 cursor-pointer rounded-l-xl rtl:rounded-r-xl rtl:rounded-l-none outline-none"
        >
          <span className="text-sm sm:text-base leading-none">{selectedCountry.flag}</span>
          <span className="font-subheading text-gray-900 font-bold">{selectedCountry.dialCode}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gold-main" />
        </button>

        {/* Phone Number Input Field */}
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9\s-]/g, ""))}
          placeholder="50 123 4567"
          className="light-form-input w-full px-3 py-2.5 text-xs sm:text-sm text-gray-900 font-bold font-subheading placeholder-gray-400 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
        />
      </div>

      {/* Country Selection Popup Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1 animate-[fadeIn_0.15s_ease-out]">
          {/* Search Box */}
          <div className="p-2 border-b border-gray-100 relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 font-subheading outline-none focus:border-gold-main"
            />
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.map((c) => (
              <div
                key={`${c.code}-${c.dialCode}`}
                onClick={() => {
                  setDialCode(c.dialCode);
                  setIsOpen(false);
                }}
                className={`px-3.5 py-1.5 text-xs font-subheading flex items-center justify-between cursor-pointer transition-colors ${
                  selectedCountry.code === c.code
                    ? "bg-gold-main/15 text-gold-main font-bold"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <span className="truncate max-w-[170px]">{c.name}</span>
                </div>
                <span className="font-bold text-gray-600">{c.dialCode}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CareerApplicationForm() {
  const { isRTL } = useLanguage();
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dialCode: "+971",
    phoneNumber: "",
    gender: "",
    location: "",
    address: "",
    education: "",
    specialization: "",
    experience: "",
    postApplied: "",
    hearAbout: "",
    resume: null,
    whyJoin: "",
  });

  // Validation Error State & Submitting States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Handle Input Changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Name Input Sanitizer (Strictly blocks numbers and symbols)
  const handleNameChange = (field, rawValue) => {
    const cleanedValue = rawValue.replace(/[^a-zA-Z\u0600-\u06FF\s'-]/g, "");
    handleChange(field, cleanedValue);
  };

  // Auto-hide Thank You success screen automatically after 3 seconds
  useEffect(() => {
    if (isSubmittedSuccess) {
      const timer = setTimeout(() => {
        handleResetForm();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmittedSuccess]);

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: isRTL ? "حجم الملف يتجاوز 5 ميجابايت" : "File size exceeds 5 MB limit",
        }));
        return;
      }
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          resume: isRTL ? "يرجى رفع ملف بصيغة PDF فقط" : "Please upload a valid PDF document",
        }));
        return;
      }
      handleChange("resume", file);
    }
  };

  // Production-Ready Form Validation
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s'-]+$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = isRTL ? "الاسم الأول مطلوب" : "First name is required";
    } else if (!nameRegex.test(formData.firstName.trim())) {
      newErrors.firstName = isRTL ? "الاسم الأول يجب أن يحتوي على حروف فقط (بدون أرقام)" : "First name must contain letters only (no numbers)";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = isRTL ? "اسم العائلة مطلوب" : "Last name is required";
    } else if (!nameRegex.test(formData.lastName.trim())) {
      newErrors.lastName = isRTL ? "اسم العائلة يجب أن يحتوي على حروف فقط (بدون أرقام)" : "Last name must contain letters only (no numbers)";
    }
    if (!formData.email.trim()) {
      newErrors.email = isRTL ? "البريد الإلكتروني مطلوب" : "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isRTL ? "يرجى إدخال بريد إلكتروني صحيح" : "Enter a valid email address";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = isRTL ? "رقم الهاتف مطلوب" : "Phone number is required";
    }
    if (!formData.gender) {
      newErrors.gender = isRTL ? "يرجى تحديد الجنس" : "Please select gender";
    }
    if (!formData.location.trim()) {
      newErrors.location = isRTL ? "الموقع الحالي مطلوب" : "Current location is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = isRTL ? "العنوان مطلوب" : "Full address is required";
    }
    if (!formData.education) {
      newErrors.education = isRTL ? "يرجى اختيار المؤهل التعليمي" : "Please select education level";
    }
    if (!formData.specialization) {
      newErrors.specialization = isRTL ? "يرجى اختيار التخصص" : "Please select specialization";
    }
    if (!formData.experience) {
      newErrors.experience = isRTL ? "يرجى اختيار سنوات الخبرة" : "Please select experience level";
    }
    if (!formData.postApplied) {
      newErrors.postApplied = isRTL ? "يرجى اختيار الوظيفة المتقدم لها" : "Please select target position";
    }
    if (!formData.hearAbout) {
      newErrors.hearAbout = isRTL ? "يرجى إخبارنا كيف سمعت عنا" : "Please select how you heard about us";
    }
    if (!formData.resume) {
      newErrors.resume = isRTL ? "يرجى رفع السيرة الذاتية بصيغة PDF" : "Resume PDF upload is required";
    }
    if (!formData.whyJoin.trim()) {
      newErrors.whyJoin = isRTL ? "هذا الحقل مطلوب" : "Please fill in this section";
    } else if (formData.whyJoin.trim().length < 15) {
      newErrors.whyJoin = isRTL ? "يرجى إدخال 15 حرفاً على الأقل" : "Please enter at least 15 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate Backend API Submit
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
    }, 1200);
  };

  const handleResetForm = () => {
    setIsSubmittedSuccess(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      dialCode: "+971",
      phoneNumber: "",
      gender: "",
      location: "",
      address: "",
      education: "",
      specialization: "",
      experience: "",
      postApplied: "",
      hearAbout: "",
      resume: null,
      whyJoin: "",
    });
  };

  return (
    <section id="apply-form" className="w-full bg-[var(--color-primary)] py-8 sm:py-14 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ═══════════════════════════════════════════
            SECTION HEADER (Compact Spacing)
            ═══════════════════════════════════════════ */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          {/* Small Gold Badge */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="w-4 sm:w-5 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
            <span className="font-heading font-bold text-[9.5px] sm:text-xs tracking-[0.2em] text-gold-light uppercase">
              {isRTL ? "تقديم طلب وظيفي" : "CAREER APPLICATION"}
            </span>
            <span className="w-4 sm:w-5 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
          </div>

          {/* Main Title */}
          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight mb-2">
            {isRTL ? (
              <>
                قدّم بياناتك <span className="text-gradient-gold-animated">للتقديم</span>
              </>
            ) : (
              <>
                Submit Your Details to <span className="text-gradient-gold-animated">Apply</span>
              </>
            )}
          </h2>

          <p className="font-subheading text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isRTL
              ? "أكمل نموذج التقديم أدناه للانضمام إلى شركة ليلا جلف. يقوم فريق الاستقطاب لدينا بمراجعة الطلبات خلال 48 ساعة."
              : "Complete the application below to join Leela Gulf FZC. Our talent acquisition team reviews all submissions within 48 hours."}
          </p>
        </div>

        {/* ═══════════════════════════════════════════
            WHITE CARD FORM / THANK YOU CONTAINER (Compact Scale)
            ═══════════════════════════════════════════ */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 text-black shadow-2xl relative min-h-[380px] flex flex-col justify-center">

          {/* ═══════════════════════════════════════════
              THANK YOU SUCCESS VIEW (Auto-hides after 3s)
              ═══════════════════════════════════════════ */}
          {isSubmittedSuccess ? (
            <div className="text-center py-6 sm:py-10 animate-[fadeIn_0.4s_ease-out]">
              {/* Gold Badge Header */}
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold-main/10 border border-gold-main/30 mb-5">
                <span className="w-2 h-2 rounded-full bg-gradient-gold-animated" />
                <span className="font-heading font-bold text-[10px] sm:text-xs tracking-widest text-gold-main uppercase">
                  {isRTL ? "تقديم طلب وظيفي" : "CAREER APPLICATION"}
                </span>
              </div>

              {/* Animated Double Emerald Ring Icon Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/10">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                </div>
              </div>

              {/* Success Title */}
              <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-black mb-2 leading-tight">
                {isRTL
                  ? "تم ارسال طلبك بنجاح!"
                  : "Your application has been sent successfully!"}
              </h3>

              {/* Subtitle */}
              <p className="font-subheading text-gray-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                {isRTL
                  ? "شكراً لاهتمامك بالانضمام إلى ليلا جلف. سيتواصل معك فريق الاستقطاب والموارد البشرية لدينا قريباً بعد مراجعة سيرتك الذاتية."
                  : "Thank you for applying to Leela Gulf FZC. Our HR talent acquisition team will review your CV and get back to you shortly."}
              </p>
            </div>
          ) : (

            /* ═══════════════════════════════════════════
                APPLICATION FORM VIEW (Compact Form Spacing)
                ═══════════════════════════════════════════ */
            <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7">

              {/* ── SECTION 01: PERSONAL DETAILS ── */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gold-main/15 text-gold-main font-heading font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-black leading-tight">
                      {isRTL ? "البيانات الشخصية" : "Personal Details"}
                    </h3>
                    <p className="font-subheading text-[11px] sm:text-xs text-gray-500">
                      {isRTL ? "قدم معلومات الاتصال والموقع الحالي." : "Provide your contact information and current location."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "الاسم الأول *" : "First Name *"}
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleNameChange("firstName", e.target.value)}
                      placeholder={isRTL ? "أدخل الاسم الأول" : "Enter your first name"}
                      className={`light-form-input w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gray-50 border text-xs sm:text-sm text-gray-900 font-bold font-subheading placeholder-gray-400 outline-none transition-all ${
                        errors.firstName
                          ? "border-2 border-red-500 bg-red-50/10"
                          : "border border-gray-200 focus:border-2 focus:border-gold-main focus:bg-white"
                      }`}
                    />
                    {errors.firstName && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.firstName}</p>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "اسم العائلة *" : "Last Name *"}
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleNameChange("lastName", e.target.value)}
                      placeholder={isRTL ? "أدخل اسم العائلة" : "Enter your last name"}
                      className={`light-form-input w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gray-50 border text-xs sm:text-sm text-gray-900 font-bold font-subheading placeholder-gray-400 outline-none transition-all ${
                        errors.lastName
                          ? "border-2 border-red-500 bg-red-50/10"
                          : "border border-gray-200 focus:border-2 focus:border-gold-main focus:bg-white"
                      }`}
                    />
                    {errors.lastName && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.lastName}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "البريد الإلكتروني *" : "Email Address *"}
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto pointer-events-none" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="name@example.com"
                        className={`light-form-input w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl bg-gray-50 border text-xs sm:text-sm text-gray-900 font-bold font-subheading placeholder-gray-400 outline-none transition-all ${
                          errors.email
                            ? "border-2 border-red-500 bg-red-50/10"
                            : "border border-gray-200 focus:border-2 focus:border-gold-main focus:bg-white"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.email}</p>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "رقم الهاتف *" : "Phone Number *"}
                    </label>
                    <GlobalPhoneInput
                      dialCode={formData.dialCode}
                      setDialCode={(code) => handleChange("dialCode", code)}
                      phoneNumber={formData.phoneNumber}
                      setPhoneNumber={(num) => handleChange("phoneNumber", num)}
                      error={errors.phoneNumber}
                      isRTL={isRTL}
                    />
                    {errors.phoneNumber && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.phoneNumber}</p>}
                  </div>

                  {/* Select Gender */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "اختر الجنس *" : "Select Gender *"}
                    </label>
                    <CustomSelect
                      placeholder={isRTL ? "حدد الجنس" : "Select your gender"}
                      options={GENDER_OPTIONS}
                      value={formData.gender}
                      onChange={(val) => handleChange("gender", val)}
                      error={errors.gender}
                      isRTL={isRTL}
                    />
                    {errors.gender && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.gender}</p>}
                  </div>

                  {/* Current Location */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "الموقع الحالي *" : "Current Location *"}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder={isRTL ? "المدينة، الدولة" : "City, Country"}
                      className={`light-form-input w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gray-50 border text-xs sm:text-sm text-gray-900 font-bold font-subheading placeholder-gray-400 outline-none transition-all ${
                        errors.location
                          ? "border-2 border-red-500 bg-red-50/10"
                          : "border border-gray-200 focus:border-2 focus:border-gold-main focus:bg-white"
                      }`}
                    />
                    {errors.location && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.location}</p>}
                  </div>

                  {/* Full Address */}
                  <div className="md:col-span-2">
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "العنوان بالتفصيل *" : "Your Address *"}
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder={isRTL ? "أدخل عنوان السكن الكامل" : "Enter your full residential address"}
                      className={`light-form-input w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gray-50 border text-xs sm:text-sm text-gray-900 font-bold font-subheading placeholder-gray-400 outline-none transition-all ${
                        errors.address
                          ? "border-2 border-red-500 bg-red-50/10"
                          : "border border-gray-200 focus:border-2 focus:border-gold-main focus:bg-white"
                      }`}
                    />
                    {errors.address && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.address}</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* ── SECTION 02: QUALIFICATIONS & ROLE ── */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gold-main/15 text-gold-main font-heading font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-black leading-tight">
                      {isRTL ? "المؤهلات والوظيفة" : "Qualifications & Role"}
                    </h3>
                    <p className="font-subheading text-[11px] sm:text-xs text-gray-500">
                      {isRTL ? "شارك مؤهلاتك والوظيفة المستهدفة." : "Share your background and the position you are targeting."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Select Education */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "المؤهل التعليمي *" : "Select Education *"}
                    </label>
                    <CustomSelect
                      placeholder={isRTL ? "اختر مؤهلك الدراسي" : "Select highest degree"}
                      options={EDUCATION_OPTIONS}
                      value={formData.education}
                      onChange={(val) => handleChange("education", val)}
                      error={errors.education}
                      isRTL={isRTL}
                    />
                    {errors.education && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.education}</p>}
                  </div>

                  {/* Select Specialization */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "التخصص *" : "Select Specialization *"}
                    </label>
                    <CustomSelect
                      placeholder={isRTL ? "اختر تخصصك" : "Select discipline"}
                      options={SPECIALIZATION_OPTIONS}
                      value={formData.specialization}
                      onChange={(val) => handleChange("specialization", val)}
                      error={errors.specialization}
                      isRTL={isRTL}
                    />
                    {errors.specialization && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.specialization}</p>}
                  </div>

                  {/* Total Experience */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "إجمالي الخبرة *" : "Total Experience *"}
                    </label>
                    <CustomSelect
                      placeholder={isRTL ? "اختر مستوى الخبرة" : "Select experience level"}
                      options={EXPERIENCE_OPTIONS}
                      value={formData.experience}
                      onChange={(val) => handleChange("experience", val)}
                      error={errors.experience}
                      isRTL={isRTL}
                    />
                    {errors.experience && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.experience}</p>}
                  </div>

                  {/* Post Applied For */}
                  <div>
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "الوظيفة المتقدم لها *" : "Post Applied For *"}
                    </label>
                    <CustomSelect
                      placeholder={isRTL ? "اختر الوظيفة المستهدفة" : "Select target position"}
                      options={POST_APPLIED_OPTIONS}
                      value={formData.postApplied}
                      onChange={(val) => handleChange("postApplied", val)}
                      error={errors.postApplied}
                      isRTL={isRTL}
                    />
                    {errors.postApplied && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.postApplied}</p>}
                  </div>

                  {/* How did you hear about us? */}
                  <div className="md:col-span-2">
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                      {isRTL ? "كيف سمعت عنا؟ *" : "How did you hear about us? *"}
                    </label>
                    <CustomSelect
                      placeholder={isRTL ? "اختر الخيار المناسب" : "Select an option"}
                      options={HEAR_ABOUT_OPTIONS}
                      value={formData.hearAbout}
                      onChange={(val) => handleChange("hearAbout", val)}
                      error={errors.hearAbout}
                      isRTL={isRTL}
                    />
                    {errors.hearAbout && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.hearAbout}</p>}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              {/* ── SECTION 03: RESUME & MOTIVATION ── */}
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gold-main/15 text-gold-main font-heading font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 mt-0.5">
                    03
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-black leading-tight">
                      {isRTL ? "السيرة الذاتية والدافع" : "Resume & Motivation"}
                    </h3>
                    <p className="font-subheading text-[11px] sm:text-xs text-gray-500">
                      {isRTL ? "أرفق سيرتك الذاتية وأخبرنا برغبتك بالانضمام إلينا." : "Attach your latest CV and tell us what excites you about Leela Gulf."}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800">
                      {isRTL ? "رفع السيرة الذاتية *" : "Upload Resume *"}
                    </label>
                    <span className="text-[10.5px] font-subheading text-gold-main font-bold bg-gold-main/10 px-2.5 py-0.5 rounded-full border border-gold-main/20">
                      {isRTL ? "(ملف PDF فقط، بحد أقصى 5 ميجابايت)" : "(PDF only, max 5 MB)"}
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-200 bg-gray-50/70 hover:bg-gray-50 ${
                      errors.resume ? "border-red-400 bg-red-50/20" : "border-gray-300 hover:border-gold-main"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gold-main/15 text-gold-main flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-5 h-5 stroke-[2]" />
                    </div>

                    {formData.resume ? (
                      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-heading font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{formData.resume.name}</span>
                      </div>
                    ) : (
                      <div>
                        <p className="font-subheading text-xs sm:text-sm text-gray-700 mb-0.5">
                          <span className="text-gold-main font-bold hover:underline">
                            {isRTL ? "اضغط للتصفح" : "Click to browse"}
                          </span>{" "}
                          {isRTL ? "أو اسحب ملف الـ PDF هنا" : "or drag and drop your PDF here"}
                        </p>
                        <p className="font-subheading text-[10.5px] text-gray-400">
                          {isRTL ? "لم يتم اختيار ملف" : "No file selected"}
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.resume && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.resume}</p>}
                </div>

                <div>
                  <label className="block font-heading font-bold text-[11px] sm:text-xs text-gray-800 mb-1">
                    {isRTL ? "لماذا اخترت ليلا جلف؟ *" : "Why Leela Gulf? *"}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.whyJoin}
                    onChange={(e) => handleChange("whyJoin", e.target.value)}
                    placeholder={
                      isRTL
                        ? "أخبرنا لماذا ترغب بالانضمام إلى فريقنا وكيف تتوافق خبرتك مع مهمتنا..."
                        : "Tell us why you want to join our team and how your expertise aligns with our mission..."
                    }
                    className={`light-form-input w-full px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gray-50 border text-xs sm:text-sm text-gray-900 font-bold font-subheading placeholder-gray-400 outline-none transition-all resize-y ${
                      errors.whyJoin
                        ? "border-2 border-red-500 bg-red-50/10"
                        : "border border-gray-200 focus:border-2 focus:border-gold-main focus:bg-white"
                    }`}
                  />
                  {errors.whyJoin && <p className="text-[10.5px] text-red-500 mt-1 font-subheading flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.whyJoin}</p>}
                </div>
              </div>

              {/* ── SUBMIT BUTTON ── */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{isRTL ? "جاري الإرسال..." : "Submitting..."}</span>
                  ) : (
                    <>
                      <span>{isRTL ? "تقديم الطلب" : "Submit Application"}</span>
                      <ArrowRight className="w-4 h-4 text-black stroke-[2.2] rtl:rotate-180" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-[11px] font-subheading text-gray-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {isRTL
                      ? "تتم معالجة بياناتك بأمان وفقاً لمعايير الخصوصية في ليلا جلف."
                      : "Your data is processed securely under Leela Gulf's privacy standards."}
                  </span>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
