"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Briefcase,
  Users,
  MapPin,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  ExternalLink,
  AlertTriangle,
  Loader2,
  FileText,
  Download,
  CheckCircle2,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Filter,
} from "lucide-react";
import { apiRequest } from "@/config/api";

// Date Range Text Formatter
const formatDateShort = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const PRESET_ALL_DEPARTMENTS = [
  "Quality Assurance",
  "Legal & Compliance",
  "Operations",
  "Sales & Marketing",
  "Supply Chain & Logistics",
  "Research & Development (R&D)",
  "Finance & Accounting",
  "Human Resources",
];

export default function AdminCareersPage() {
  // Navigation View Tab ('jobs' | 'applications')
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs' | 'applications'

  // Live Backend Data State (Clean Production Defaults - Zero Dummy Data)
  const [jobsList, setJobsList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters for Jobs Tab
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("ALL"); // ALL | Published | Draft
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [jobsPerPage, setJobsPerPage] = useState(10);
  const [currentJobPage, setCurrentJobPage] = useState(1);

  // Filters for Applications Tab
  const [appSearch, setAppSearch] = useState("");
  const [appPostFilter, setAppPostFilter] = useState("ALL"); // ALL | Post names
  const [appExpFilter, setAppExpFilter] = useState("ALL"); // ALL | Experience
  const [selectedAppIds, setSelectedAppIds] = useState([]);
  const [appsPerPage, setAppsPerPage] = useState(10);
  const [currentAppPage, setCurrentAppPage] = useState(1);

  // Modals & Preview States
  const [previewJob, setPreviewJob] = useState(null);
  const [viewCandidate, setViewCandidate] = useState(null);
  const [pdfPreviewTarget, setPdfPreviewTarget] = useState(null); // { name: string, resumeUrl: string, candidate: string }
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'job' | 'app', id: string, name: string }
  const [isDeleting, setIsDeleting] = useState(false);

  // Dropdowns
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const [showAppPostDropdown, setShowAppPostDropdown] = useState(false);
  const [showAppExpDropdown, setShowAppExpDropdown] = useState(false);
  const [showAppPerPageDropdown, setShowAppPerPageDropdown] = useState(false);

  const statusRef = useRef(null);
  const deptRef = useRef(null);
  const perPageRef = useRef(null);
  const appPostRef = useRef(null);
  const appExpRef = useRef(null);
  const appPerPageRef = useRef(null);

  // Outside click listener for dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatusDropdown(false);
      if (deptRef.current && !deptRef.current.contains(e.target)) setShowDeptDropdown(false);
      if (perPageRef.current && !perPageRef.current.contains(e.target)) setShowPerPageDropdown(false);
      if (appPostRef.current && !appPostRef.current.contains(e.target)) setShowAppPostDropdown(false);
      if (appExpRef.current && !appExpRef.current.contains(e.target)) setShowAppExpDropdown(false);
      if (appPerPageRef.current && !appPerPageRef.current.contains(e.target)) setShowAppPerPageDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Live Jobs and Applications from API
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        apiRequest("/careers/admin/jobs", { method: "GET" }).catch(() => null),
        apiRequest("/careers/applications", { method: "GET" }).catch(() => null),
      ]);

      if (jobsRes?.success && Array.isArray(jobsRes.data)) {
        setJobsList(jobsRes.data);
      } else {
        setJobsList([]);
      }

      if (appsRes?.success && Array.isArray(appsRes.data)) {
        setApplicationsList(appsRes.data);
      } else {
        setApplicationsList([]);
      }
    } catch (err) {
      console.warn("Careers API fetch error:", err);
      setJobsList([]);
      setApplicationsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── JOBS FILTERING & PAGINATION ──
  const departmentsList = useMemo(() => {
    const set = new Set(PRESET_ALL_DEPARTMENTS);
    jobsList.forEach((j) => {
      if (j.department && j.department.trim()) set.add(j.department.trim());
    });
    return Array.from(set);
  }, [jobsList]);

  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      // 1. Status Filter
      if (jobStatusFilter !== "ALL" && job.status !== jobStatusFilter) {
        return false;
      }
      // 2. Department Filter
      if (departmentFilter !== "ALL") {
        const jobDept = (job.department || "").toLowerCase().trim();
        const selectedDept = departmentFilter.toLowerCase().trim();
        if (jobDept !== selectedDept) {
          return false;
        }
      }
      // 3. Real-time Multi-field Token Search Filter (Title, Department, Location, Type, Overview, Responsibilities)
      if (jobSearch.trim()) {
        const query = jobSearch.toLowerCase().trim();
        const queryTokens = query.split(/\s+/).filter(Boolean);

        // Build combined searchable text blob
        const titleStr = `${job.title || ""} ${job.titleAr || ""}`.toLowerCase();
        const deptStr = `${job.department || ""} ${job.departmentAr || ""}`.toLowerCase();
        const locStr = `${job.location || ""} ${job.locationAr || ""}`.toLowerCase();
        const typeStr = `${job.jobType || ""} ${job.jobTypeAr || ""}`.toLowerCase();
        const statusStr = (job.status || "").toLowerCase();
        const overviewStr = `${job.overview || ""} ${job.overviewAr || ""}`.toLowerCase();
        const respStr = Array.isArray(job.responsibilities) ? job.responsibilities.join(" ").toLowerCase() : "";
        const reqStr = Array.isArray(job.requirements) ? job.requirements.join(" ").toLowerCase() : "";

        const fullSearchableBlob = `${titleStr} ${deptStr} ${locStr} ${typeStr} ${statusStr} ${overviewStr} ${respStr} ${reqStr}`;

        // Every typed keyword/token must match somewhere in the job
        const isMatched = queryTokens.every((token) => fullSearchableBlob.includes(token));
        if (!isMatched) {
          return false;
        }
      }
      return true;
    });
  }, [jobsList, jobStatusFilter, departmentFilter, jobSearch]);

  const totalJobPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentJobPage - 1) * jobsPerPage;
    return filteredJobs.slice(start, start + jobsPerPage);
  }, [filteredJobs, currentJobPage, jobsPerPage]);

  // ── APPLICATIONS FILTERING & PAGINATION ──
  const postAppliedOptions = useMemo(() => {
    const PRESET_POSTS = [
      "Quality Control Engineer",
      "Regulatory Affairs Specialist",
      "Production Executive",
      "Maintenance Engineer",
      "Other Profile",
    ];
    const set = new Set(PRESET_POSTS);
    applicationsList.forEach((a) => {
      if (a.postAppliedFor && a.postAppliedFor.trim()) set.add(a.postAppliedFor.trim());
    });
    return Array.from(set);
  }, [applicationsList]);

  const experienceOptions = [
    "Fresher (0-1 Year)",
    "1-2 Years",
    "3-5 Years",
    "5+ Years",
  ];

  const filteredApplications = useMemo(() => {
    return applicationsList.filter((app) => {
      // 1. Post Applied Filter
      if (appPostFilter !== "ALL") {
        if ((app.postAppliedFor || "").toLowerCase().trim() !== appPostFilter.toLowerCase().trim()) {
          return false;
        }
      }
      // 2. Experience Filter
      if (appExpFilter !== "ALL") {
        if ((app.totalExperience || "").toLowerCase().trim() !== appExpFilter.toLowerCase().trim()) {
          return false;
        }
      }
      // 3. Real-time Multi-token Deep Search (Name, Email, Phone, Location, Gender, Education, Specialization, Experience, Role, Referral, Cover Note)
      if (appSearch.trim()) {
        const query = appSearch.toLowerCase().trim();
        const tokens = query.split(/\s+/).filter(Boolean);

        const fullName = `${app.firstName || ""} ${app.lastName || ""}`.toLowerCase();
        const email = (app.email || "").toLowerCase();
        const phone = (app.phone || "").toLowerCase();
        const location = (app.currentLocation || "").toLowerCase();
        const address = (app.residentialAddress || "").toLowerCase();
        const gender = (app.gender || "").toLowerCase();
        const post = (app.postAppliedFor || "").toLowerCase();
        const edu = (app.education || "").toLowerCase();
        const spec = (app.specialization || "").toLowerCase();
        const exp = (app.totalExperience || "").toLowerCase();
        const source = (app.referralSource || "").toLowerCase();
        const note = (app.coverNote || "").toLowerCase();

        const searchableCandidateBlob = `${fullName} ${email} ${phone} ${location} ${address} ${gender} ${post} ${edu} ${spec} ${exp} ${source} ${note}`;

        const isMatched = tokens.every((token) => searchableCandidateBlob.includes(token));
        if (!isMatched) {
          return false;
        }
      }
      return true;
    });
  }, [applicationsList, appPostFilter, appExpFilter, appSearch]);

  const totalAppPages = Math.ceil(filteredApplications.length / appsPerPage) || 1;
  const paginatedApps = useMemo(() => {
    const start = (currentAppPage - 1) * appsPerPage;
    return filteredApplications.slice(start, start + appsPerPage);
  }, [filteredApplications, currentAppPage, appsPerPage]);

  // Select All Jobs Handlers
  const handleSelectAllJobs = (e) => {
    if (e.target.checked) {
      setSelectedJobIds(paginatedJobs.map((j) => j._id || j.id));
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleToggleJob = (id) => {
    setSelectedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  // Robust View / Download Resume CV Handler
  const handleOpenResume = async (app, forceDownload = false) => {
    if (!app) return;
    const url = app.resumeUrl;
    const candidateName = `${app.firstName || ""} ${app.lastName || ""}`.trim() || "Candidate";
    const filename = (app.resumeName && app.resumeName.toLowerCase().endsWith(".pdf"))
      ? app.resumeName
      : `${candidateName.replace(/[^a-zA-Z0-9_-]/g, "_")}_CV.pdf`;

    if (url && url !== "#" && url.startsWith("http")) {
      try {
        setIsProcessingPdf(true);
        // Fetch file blob to ensure accurate PDF mime type & proper filename
        const response = await fetch(url);
        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: "application/pdf" });
        const blobUrl = window.URL.createObjectURL(pdfBlob);

        if (forceDownload) {
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
        } else {
          // Open PDF in new tab with proper PDF viewer
          window.open(blobUrl, "_blank");
        }
      } catch (err) {
        console.warn("Direct blob fetch fallback:", err);
        if (forceDownload) {
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          window.open(url, "_blank");
        }
      } finally {
        setIsProcessingPdf(false);
      }
    } else {
      // Show Preview modal fallback
      setPdfPreviewTarget({
        candidate: candidateName,
        name: filename,
        resumeUrl: url,
        postAppliedFor: app.postAppliedFor,
        email: app.email,
        phone: app.phone,
        education: app.education,
        specialization: app.specialization,
        totalExperience: app.totalExperience,
      });
    }
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "job") {
        await apiRequest(`/careers/jobs/${deleteTarget.id}`, { method: "DELETE" }).catch(() => null);
        setJobsList((prev) => prev.filter((j) => (j._id || j.id) !== deleteTarget.id));
        setSelectedJobIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      } else {
        await apiRequest(`/careers/applications/${deleteTarget.id}`, { method: "DELETE" }).catch(() => null);
        setApplicationsList((prev) => prev.filter((a) => (a._id || a.id) !== deleteTarget.id));
        setSelectedAppIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-subheading text-gray-900">
      
      {/* ── 1. TOP HEADER & MAIN ACTION BUTTONS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight flex items-center gap-2.5">
            <span>Careers & Talent Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage published job openings and review received candidate job applications.
          </p>
        </div>

        {/* Right Action: + Post New Job Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/careers/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-main hover:bg-gold-light text-black text-xs sm:text-sm font-heading font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* ── 2. VIEW SWITCHER TABS (Job Openings vs Candidate Applications) ── */}
      <div className="flex items-center gap-3 border-b border-gray-200">
        
        {/* Tab 1: Job Openings */}
        <button
          type="button"
          onClick={() => setActiveTab("jobs")}
          className={`relative pb-3 px-2 text-sm font-heading font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === "jobs"
              ? "text-gray-900 border-b-2 border-gold-main"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Briefcase className="w-4 h-4 text-gold-dark" />
          <span>Job Openings</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700">
            {jobsList.length}
          </span>
        </button>

        {/* Tab 2: Candidate Applications */}
        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`relative pb-3 px-2 text-sm font-heading font-bold flex items-center gap-2 cursor-pointer transition-all ${
            activeTab === "applications"
              ? "text-gray-900 border-b-2 border-gold-main"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Users className="w-4 h-4 text-gold-dark" />
          <span>Candidate Applications / Leads</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gold-main/20 text-gold-dark">
            {applicationsList.length}
          </span>
        </button>

      </div>

      {/* ═════════════════════════════════════════════════════════════════
          TAB 1: JOB OPENINGS MANAGEMENT
          ═════════════════════════════════════════════════════════════════ */}
      {activeTab === "jobs" && (
        <div className="space-y-4">
          
          {/* ── SEARCH & FILTER TOOLBAR ── */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Search input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by job title, department, location, type, or overview..."
                value={jobSearch}
                onChange={(e) => {
                  setJobSearch(e.target.value);
                  setCurrentJobPage(1);
                }}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
              />
              {jobSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setJobSearch("");
                    setCurrentJobPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Department Filter Dropdown */}
              <div className="relative" ref={deptRef}>
                <button
                  type="button"
                  onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-gold-main transition-colors cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-gold-dark" />
                  <span>{departmentFilter === "ALL" ? "All Departments" : departmentFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {showDeptDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setDepartmentFilter("ALL");
                        setShowDeptDropdown(false);
                        setCurrentJobPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        departmentFilter === "ALL" ? "bg-gold-main/15 text-gold-dark font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All Departments
                    </button>
                    {departmentsList.map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => {
                          setDepartmentFilter(dept);
                          setShowDeptDropdown(false);
                          setCurrentJobPage(1);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          departmentFilter === dept ? "bg-gold-main/15 text-gold-dark font-bold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative" ref={statusRef}>
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-gold-main transition-colors cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-gray-500" />
                  <span>{jobStatusFilter === "ALL" ? "All Status" : jobStatusFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {showStatusDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    {["ALL", "Published", "Draft"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setJobStatusFilter(st);
                          setShowStatusDropdown(false);
                          setCurrentJobPage(1);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          jobStatusFilter === st ? "bg-gold-main/15 text-gold-dark font-bold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {st === "ALL" ? "All Status" : st}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Filter Button */}
              {(jobSearch || jobStatusFilter !== "ALL" || departmentFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setJobSearch("");
                    setJobStatusFilter("ALL");
                    setDepartmentFilter("ALL");
                    setCurrentJobPage(1);
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

            </div>
          </div>

          {/* ── JOBS DATA TABLE ── */}
          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-heading font-bold text-gray-600 uppercase tracking-wider">
                    <th className="p-3 pl-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          paginatedJobs.length > 0 &&
                          selectedJobIds.length === paginatedJobs.length
                        }
                        onChange={handleSelectAllJobs}
                        className="rounded-sm border-gray-300 text-gold-main focus:ring-gold-main cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Job Title & Details</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Location & Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-subheading">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-gold-main mx-auto mb-2" />
                        <span className="text-xs text-gray-400 font-bold">Loading Job Postings...</span>
                      </td>
                    </tr>
                  ) : paginatedJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-gray-400">
                        <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="font-heading font-bold text-sm text-gray-700">No Job Openings Found</p>
                        <p className="text-xs text-gray-400 mt-0.5">Post a new job or adjust your search filters.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedJobs.map((job) => {
                      const id = job._id || job.id;
                      const isSelected = selectedJobIds.includes(id);

                      return (
                        <tr
                          key={id}
                          className={`hover:bg-gray-50/80 transition-colors ${
                            isSelected ? "bg-gold-main/5" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3 pl-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleJob(id)}
                              className="rounded-sm border-gray-300 text-gold-main focus:ring-gold-main cursor-pointer"
                            />
                          </td>

                          {/* Job Title & Overview */}
                          <td className="p-3 max-w-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gold-main/10 text-gold-dark flex items-center justify-center shrink-0">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-heading font-bold text-sm text-gray-900 truncate">
                                  {job.title}
                                </h4>
                                <p className="text-[11.5px] text-gray-400 truncate max-w-xs">
                                  {job.overview}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Department */}
                          <td className="p-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold bg-gray-100 text-gray-800">
                              {job.department}
                            </span>
                          </td>

                          {/* Location & Job Type */}
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[11.5px] text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                                <MapPin className="w-3 h-3 text-gold-dark" />
                                <span>{job.location}</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11.5px] text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span>{job.jobType}</span>
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-heading font-bold ${
                                job.status === "Published"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : "bg-amber-50 text-amber-700 border border-amber-200/60"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <span>{job.status}</span>
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3 pr-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Modal Button */}
                              <button
                                type="button"
                                onClick={() => setPreviewJob(job)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-gold-dark hover:bg-gray-100 transition-colors cursor-pointer"
                                title="Preview Job Modal (Frontend style)"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit Job Link */}
                              <Link
                                href={`/admin/careers/edit/${id}`}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Edit Job Details"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>

                              {/* Delete Job Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({ type: "job", id, name: job.title })
                                }
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Job"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ── PAGINATION BAR ── */}
            {filteredJobs.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-gray-500 font-medium">
                  Showing {(currentJobPage - 1) * jobsPerPage + 1} to{" "}
                  {Math.min(currentJobPage * jobsPerPage, filteredJobs.length)} of{" "}
                  {filteredJobs.length} jobs
                </span>

                <div className="flex items-center gap-3">
                  {/* Per Page Dropdown */}
                  <div className="relative" ref={perPageRef}>
                    <button
                      type="button"
                      onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-gold-main transition-colors cursor-pointer"
                    >
                      <span>{jobsPerPage} per page</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    {showPerPageDropdown && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-32 bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                        {[5, 10, 20, 50].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              setJobsPerPage(num);
                              setShowPerPageDropdown(false);
                              setCurrentJobPage(1);
                            }}
                            className={`w-full text-left px-2.5 py-1 rounded-lg text-xs transition-colors ${
                              jobsPerPage === num
                                ? "bg-gold-main/15 text-gold-dark font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {num} per page
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Page Navigation Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentJobPage === 1}
                      onClick={() => setCurrentJobPage((prev) => Math.max(prev - 1, 1))}
                      className="p-1 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalJobPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentJobPage(p)}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          currentJobPage === p
                            ? "bg-[#0f1117] text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentJobPage === totalJobPages}
                      onClick={() => setCurrentJobPage((prev) => Math.min(prev + 1, totalJobPages))}
                      className="p-1 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          TAB 2: CANDIDATE APPLICATIONS / LEADS MANAGEMENT
          ═════════════════════════════════════════════════════════════════ */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          
          {/* ── APPLICATIONS TOOLBAR ── */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Real-time Search input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidate name, email, phone, location, role, or qualification..."
                value={appSearch}
                onChange={(e) => {
                  setAppSearch(e.target.value);
                  setCurrentAppPage(1);
                }}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 transition-colors"
              />
              {appSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setAppSearch("");
                    setCurrentAppPage(1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Post Applied Filter Dropdown */}
              <div className="relative" ref={appPostRef}>
                <button
                  type="button"
                  onClick={() => setShowAppPostDropdown(!showAppPostDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-gold-main transition-colors cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-gold-dark" />
                  <span className="max-w-[130px] truncate">{appPostFilter === "ALL" ? "All Positions" : appPostFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {showAppPostDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setAppPostFilter("ALL");
                        setShowAppPostDropdown(false);
                        setCurrentAppPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        appPostFilter === "ALL" ? "bg-gold-main/15 text-gold-dark font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All Positions
                    </button>
                    {postAppliedOptions.map((post) => (
                      <button
                        key={post}
                        type="button"
                        onClick={() => {
                          setAppPostFilter(post);
                          setShowAppPostDropdown(false);
                          setCurrentAppPage(1);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          appPostFilter === post ? "bg-gold-main/15 text-gold-dark font-bold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {post}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Experience Filter Dropdown */}
              <div className="relative" ref={appExpRef}>
                <button
                  type="button"
                  onClick={() => setShowAppExpDropdown(!showAppExpDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:border-gold-main transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-gold-dark" />
                  <span>{appExpFilter === "ALL" ? "All Experience" : appExpFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {showAppExpDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setAppExpFilter("ALL");
                        setShowAppExpDropdown(false);
                        setCurrentAppPage(1);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        appExpFilter === "ALL" ? "bg-gold-main/15 text-gold-dark font-bold" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All Experience Levels
                    </button>
                    {experienceOptions.map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => {
                          setAppExpFilter(exp);
                          setShowAppExpDropdown(false);
                          setCurrentAppPage(1);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                          appExpFilter === exp ? "bg-gold-main/15 text-gold-dark font-bold" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Filter Button */}
              {(appSearch || appPostFilter !== "ALL" || appExpFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setAppSearch("");
                    setAppPostFilter("ALL");
                    setAppExpFilter("ALL");
                    setCurrentAppPage(1);
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── APPLICATIONS DATA TABLE (No Status Column) ── */}
          <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/70 text-[11px] font-heading font-bold text-gray-600 uppercase tracking-wider">
                    <th className="p-3 pl-4">Candidate Name & Contact</th>
                    <th className="p-3">Post Applied For</th>
                    <th className="p-3">Qualifications & Experience</th>
                    <th className="p-3">Resume PDF</th>
                    <th className="p-3">Received Date</th>
                    <th className="p-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm font-subheading">
                  {paginatedApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-gray-400">
                        <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="font-heading font-bold text-sm text-gray-700">No Candidate Applications Found</p>
                        <p className="text-xs text-gray-400 mt-0.5">Adjust your search or filters to see matching candidates.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedApps.map((app) => {
                      const id = app._id || app.id;
                      return (
                        <tr key={id} className="hover:bg-gray-50/80 transition-colors">
                          
                          {/* Candidate Name, Email, Phone, Location */}
                          <td className="p-3 pl-4">
                            <div>
                              <h4 className="font-heading font-bold text-sm text-gray-900">
                                {app.firstName} {app.lastName}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2.5 text-[11.5px] text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-gray-400" />
                                  <span>{app.email}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span>{app.phone}</span>
                                </span>
                                {app.currentLocation && (
                                  <span className="inline-flex items-center gap-0.5 text-[10.5px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md">
                                    <MapPin className="w-2.5 h-2.5 text-gold-dark" />
                                    <span>{app.currentLocation}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Post Applied For */}
                          <td className="p-3">
                            <span className="font-heading font-bold text-xs text-gray-900 bg-gold-main/20 border border-gold-main/40 px-2.5 py-1 rounded-lg inline-block">
                              {app.postAppliedFor}
                            </span>
                          </td>

                          {/* Qualifications, Education, & Experience */}
                          <td className="p-3">
                            <div className="text-xs">
                              <p className="font-semibold text-gray-900">{app.specialization || "General Discipline"}</p>
                              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5 flex-wrap">
                                <span>{app.education}</span>
                                <span>•</span>
                                <span className="inline-block px-1.5 py-0.2 rounded-md bg-gray-100 text-gray-700 font-medium">
                                  {app.totalExperience}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Resume PDF View Button (Working) */}
                          <td className="p-3">
                            <button
                              type="button"
                              onClick={() => handleOpenResume(app)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gold-main hover:text-black text-gray-800 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                              title="Open Candidate CV"
                            >
                              <FileText className="w-3.5 h-3.5 text-gold-dark group-hover:text-black transition-colors" />
                              <span>View CV</span>
                              <Download className="w-3 h-3 opacity-60" />
                            </button>
                          </td>

                          {/* Received Date */}
                          <td className="p-3 text-xs text-gray-500">
                            {formatDateShort(app.createdAt)}
                          </td>

                          {/* Actions (View Profile Modal, Delete) */}
                          <td className="p-3 pr-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setViewCandidate(app)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-gold-dark hover:bg-gray-100 transition-colors cursor-pointer"
                                title="View Full Candidate Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "app",
                                    id,
                                    name: `${app.firstName} ${app.lastName}`,
                                  })
                                }
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Candidate Application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Applications */}
            {filteredApplications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-gray-500 font-medium">
                  Showing {(currentAppPage - 1) * appsPerPage + 1} to{" "}
                  {Math.min(currentAppPage * appsPerPage, filteredApplications.length)} of{" "}
                  {filteredApplications.length} candidates
                </span>

                <div className="flex items-center gap-3">
                  {/* Per Page Dropdown for Applications */}
                  <div className="relative" ref={appPerPageRef}>
                    <button
                      type="button"
                      onClick={() => setShowAppPerPageDropdown(!showAppPerPageDropdown)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-gold-main transition-colors cursor-pointer"
                    >
                      <span>{appsPerPage} per page</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </button>

                    {showAppPerPageDropdown && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-32 bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                        {[5, 10, 20, 50].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => {
                              setAppsPerPage(num);
                              setShowAppPerPageDropdown(false);
                              setCurrentAppPage(1);
                            }}
                            className={`w-full text-left px-2.5 py-1 rounded-lg text-xs transition-colors ${
                              appsPerPage === num
                                ? "bg-gold-main/15 text-gold-dark font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {num} per page
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentAppPage === 1}
                      onClick={() => setCurrentAppPage((prev) => Math.max(prev - 1, 1))}
                      className="p-1 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalAppPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCurrentAppPage(p)}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          currentAppPage === p
                            ? "bg-[#0f1117] text-white"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentAppPage === totalAppPages}
                      onClick={() => setCurrentAppPage((prev) => Math.min(prev + 1, totalAppPages))}
                      className="p-1 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          JOB DETAIL PREVIEW MODAL (Exact Frontend Theme - No Slider)
          ═════════════════════════════════════════════════════════════════ */}
      {previewJob && (
        <div
          onClick={() => setPreviewJob(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0d1017] border border-gold-main/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300 my-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPreviewJob(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 rtl:left-4 rtl:right-auto sm:rtl:left-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-gold-main/40 text-gray-300 hover:text-white hover:border-gold-main hover:bg-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer z-20 shadow-lg hover:scale-105 active:scale-95 group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-300 group-hover:text-gold-light transition-colors" />
            </button>

            {/* Modal Header Box */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
              <div className="w-1.5 h-12 bg-gradient-gold-animated rounded-full absolute left-0 top-1/2 -translate-y-1/2" />
              <div className="pl-3 pr-8 rtl:pr-3 rtl:pl-8">
                <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-gold-light block mb-1">
                  {previewJob.department}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl text-white leading-tight break-words">
                  {previewJob.title}
                </h3>
                <div className="flex items-center gap-2.5 sm:gap-3 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-subheading">
                    <MapPin className="w-3.5 h-3.5 text-gold-light shrink-0" />
                    <span>{previewJob.location || "Dubai, UAE"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-subheading">
                    <Clock className="w-3.5 h-3.5 text-gold-light shrink-0" />
                    <span>{previewJob.jobType || "Full-Time"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Key Responsibilities & Requirements */}
            <div className="space-y-5 mb-6 text-gray-300 text-xs sm:text-sm font-subheading">
              {previewJob.overview && (
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                    Job Overview
                  </h4>
                  <p className="leading-relaxed text-gray-300 break-words">
                    {previewJob.overview}
                  </p>
                </div>
              )}

              {Array.isArray(previewJob.responsibilities) && previewJob.responsibilities.length > 0 && (
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                    Key Responsibilities
                  </h4>
                  <ul className="space-y-1.5">
                    {previewJob.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
                        <span className="leading-relaxed break-words">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(previewJob.requirements) && previewJob.requirements.length > 0 && (
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-gold-light mb-1.5">
                    Requirements & Qualifications
                  </h4>
                  <ul className="space-y-1.5">
                    {previewJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0 mt-0.5" />
                        <span className="leading-relaxed break-words">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Ready to Apply Bottom Box */}
            <div className="pt-5 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-heading font-bold text-base text-white">
                  Ready to Apply?
                </h4>
                <p className="font-subheading text-xs text-gray-400">
                  Send your CV directly to our HR hiring team.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-7 py-3 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm tracking-wide shadow-lg shrink-0">
                <span>Apply Now</span>
                <ExternalLink className="w-4 h-4 text-black" />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          CANDIDATE APPLICATION FULL PROFILE MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {viewCandidate && (
        <div
          onClick={() => setViewCandidate(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-3xl shadow-2xl text-gray-900 flex flex-col max-h-[90vh] my-auto overflow-hidden"
          >
            {/* 1. Modal Fixed Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-start justify-between gap-4 bg-white shrink-0">
              <div>
                <span className="text-[11px] font-heading font-bold text-gold-dark bg-gold-main/15 border border-gold-main/30 px-3 py-0.5 rounded-full inline-block mb-1.5 uppercase tracking-wider">
                  Target Role: {viewCandidate.postAppliedFor}
                </span>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 leading-tight">
                  {viewCandidate.firstName} {viewCandidate.lastName}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Submitted application on {formatDateShort(viewCandidate.createdAt)}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setViewCandidate(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Modal Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#E5E7EB_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              {/* Section 01: Personal Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-gold-main/20 text-gold-dark font-mono font-bold text-[10.5px] flex items-center justify-center">
                    01
                  </span>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide">Personal Details</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Email Address</span>
                    <span className="font-semibold text-gray-900 break-all">{viewCandidate.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Phone Number</span>
                    <span className="font-semibold text-gray-900">{viewCandidate.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Gender</span>
                    <span className="font-semibold text-gray-900">{viewCandidate.gender || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Current Location</span>
                    <span className="font-semibold text-gray-900">{viewCandidate.currentLocation || "Dubai, UAE"}</span>
                  </div>
                  {viewCandidate.residentialAddress && (
                    <div className="sm:col-span-2">
                      <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Residential Address</span>
                      <span className="font-medium text-gray-800 break-words">{viewCandidate.residentialAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 02: Qualifications & Role */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-gold-main/20 text-gold-dark font-mono font-bold text-[10.5px] flex items-center justify-center">
                    02
                  </span>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide">Qualifications & Role</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Highest Education</span>
                    <span className="font-semibold text-gray-900">{viewCandidate.education || "Bachelor's Degree"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Specialization / Discipline</span>
                    <span className="font-semibold text-gray-900">{viewCandidate.specialization || "Quality Assurance / QC"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Total Experience</span>
                    <span className="font-semibold text-gray-900">{viewCandidate.totalExperience || "3-5 Years"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">How did you hear about us?</span>
                    <span className="font-semibold text-gray-900">{viewCandidate.referralSource || "LinkedIn"}</span>
                  </div>
                </div>
              </div>

              {/* Section 03: Resume & Motivation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-gold-main/20 text-gold-dark font-mono font-bold text-[10.5px] flex items-center justify-center">
                    03
                  </span>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide">Resume & Motivation</h4>
                </div>

                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 space-y-3.5 text-xs">
                  {viewCandidate.coverNote && (
                    <div>
                      <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px] mb-1">
                        Why Leela Gulf? / Motivation:
                      </span>
                      <p className="text-gray-700 bg-white p-3.5 rounded-xl border border-gray-200/80 leading-relaxed font-sans break-words">
                        {viewCandidate.coverNote}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 flex-wrap gap-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={isProcessingPdf}
                        onClick={() => handleOpenResume(viewCandidate, false)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-heading font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-2xs hover:scale-105 active:scale-95"
                      >
                        {isProcessingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5 text-gold-dark" />}
                        <span>View PDF</span>
                      </button>

                      <button
                        type="button"
                        disabled={isProcessingPdf}
                        onClick={() => handleOpenResume(viewCandidate, true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-main hover:bg-gold-light text-black text-xs font-heading font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
                      >
                        {isProcessingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        <span>Download PDF</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-gray-500 font-medium truncate max-w-[220px]">
                      {viewCandidate.resumeName || `${viewCandidate.firstName}_${viewCandidate.lastName}_CV.pdf`}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Modal Fixed Footer */}
            <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-end bg-gray-50/60 shrink-0">
              <button
                type="button"
                onClick={() => setViewCandidate(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-heading font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          RESUME CV PREVIEW MODAL (Opens when clicking View CV / Download CV)
          ═════════════════════════════════════════════════════════════════ */}
      {pdfPreviewTarget && (
        <div
          onClick={() => setPdfPreviewTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-gray-900"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-main/20 text-gold-dark flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-gray-900">
                    Candidate Resume CV
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {pdfPreviewTarget.candidate} • {pdfPreviewTarget.postAppliedFor}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPdfPreviewTarget(null)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-900 bg-white border border-gray-200 px-2.5 py-1 rounded-lg">
                    PDF Document
                  </span>
                  <span className="text-gray-500 font-medium">{pdfPreviewTarget.name}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11.5px] pt-1">
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Applicant Email</span>
                  <span className="font-medium text-gray-800">{pdfPreviewTarget.email}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Applicant Phone</span>
                  <span className="font-medium text-gray-800">{pdfPreviewTarget.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Education Degree</span>
                  <span className="font-medium text-gray-800">{pdfPreviewTarget.education}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Experience Level</span>
                  <span className="font-medium text-gray-800">{pdfPreviewTarget.totalExperience}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setPdfPreviewTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isProcessingPdf}
                onClick={() => handleOpenResume({ resumeUrl: pdfPreviewTarget.resumeUrl, firstName: pdfPreviewTarget.candidate, lastName: "" }, false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <button
                type="button"
                disabled={isProcessingPdf}
                onClick={() => handleOpenResume({ resumeUrl: pdfPreviewTarget.resumeUrl, firstName: pdfPreviewTarget.candidate, lastName: "" }, true)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-heading font-bold text-black bg-gold-main hover:bg-gold-light shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div
          onClick={() => setDeleteTarget(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-heading font-bold text-lg text-gray-900">
                Delete {deleteTarget.type === "job" ? "Job Posting" : "Candidate Application"}?
              </h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-heading font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-bold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
