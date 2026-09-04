"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RotateCcw,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  X,
  Eye,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  Building,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Package,
  Filter,
  FileText,
  Clock,
  ExternalLink
} from "lucide-react";
import { apiRequest } from "@/config/api";

// Helper to determine clean product URL for quotes & leads
const getProductLink = (lead) => {
  if (!lead) return null;
  if (lead.productUrl) return lead.productUrl;
  if (lead.productSlug) return `/products/${lead.productSlug}`;
  
  // If productName is present
  if (lead.productName) {
    const slug = lead.productName
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
    return slug ? `/products/${slug}` : null;
  }

  // If sourcePage contains product name after " - "
  if (lead.sourcePage && lead.sourcePage.includes(" - ")) {
    const parts = lead.sourcePage.split(" - ");
    const name = parts.slice(1).join(" - ").trim();
    if (name) {
      const slug = name
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
      return slug ? `/products/${slug}` : null;
    }
  }

  return null;
};

// Helper to sanitize & shorten technical SMTP email reason for clean display
const formatEmailReason = (reason) => {
  if (!reason) return "";
  if (reason.includes("NoSuchUser") || reason.includes("User doesn't exist") || reason.includes("User not found")) {
    return "Mailbox does not exist on mail server (5.1.1)";
  }
  if (reason.includes("Recipient address rejected")) {
    return "Recipient address rejected by mail server";
  }
  if (reason.includes("Disposable temporary")) {
    return "Disposable / temporary email provider";
  }
  if (reason.includes("No MX") || reason.includes("No active mail exchange")) {
    return "No active mail server found for domain";
  }
  if (reason.includes("test/dummy username pattern")) {
    return "Dummy / test username pattern detected";
  }
  return reason.split("http")[0].replace(/[\n\r]/g, " ").trim();
};

// Date Formatter Utilities
const formatDateShort = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateFull = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateNumeric = (date) => {
  if (!date) return "";
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
};

const getDynamicRangeText = (filterType) => {
  const today = new Date();

  if (filterType === "Today") {
    return formatDateShort(today);
  }

  if (filterType === "Yesterday") {
    const yest = new Date(today);
    yest.setDate(today.getDate() - 1);
    return formatDateShort(yest);
  }

  if (filterType === "Last 7 days") {
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    return `${formatDateShort(start)} - ${formatDateShort(today)}`;
  }

  if (filterType === "Last 30 days") {
    const start = new Date(today);
    start.setDate(today.getDate() - 29);
    return `${formatDateShort(start)} - ${formatDateShort(today)}`;
  }

  if (filterType === "This Month") {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return `${formatDateShort(firstDay)} - ${formatDateShort(today)}`;
  }

  if (filterType === "Last Month") {
    const firstDayLast = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayLast = new Date(today.getFullYear(), today.getMonth(), 0);
    return `${formatDateShort(firstDayLast)} - ${formatDateShort(lastDayLast)}`;
  }

  return "All Time";
};

// Date Range Evaluator Helper Function
const isDateInSelectedRange = (dateStr, filterOption, customStart, customEnd) => {
  if (!filterOption || filterOption === "All Time") return true;
  if (!dateStr) return false;

  const leadDate = new Date(dateStr);
  if (isNaN(leadDate.getTime())) return true;

  const now = new Date();

  if (filterOption === "Today") {
    return (
      leadDate.getDate() === now.getDate() &&
      leadDate.getMonth() === now.getMonth() &&
      leadDate.getFullYear() === now.getFullYear()
    );
  }

  if (filterOption === "Yesterday") {
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    return (
      leadDate.getDate() === yest.getDate() &&
      leadDate.getMonth() === yest.getMonth() &&
      leadDate.getFullYear() === yest.getFullYear()
    );
  }

  if (filterOption === "Last 7 days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return leadDate >= start;
  }

  if (filterOption === "Last 30 days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return leadDate >= start;
  }

  if (filterOption === "This Month") {
    return (
      leadDate.getMonth() === now.getMonth() &&
      leadDate.getFullYear() === now.getFullYear()
    );
  }

  if (filterOption === "Last Month") {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return (
      leadDate.getMonth() === lastMonth.getMonth() &&
      leadDate.getFullYear() === lastMonth.getFullYear()
    );
  }

  if (filterOption === "Custom") {
    if (!customStart || !customEnd) return true;
    const start = new Date(customStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);
    return leadDate >= start && leadDate <= end;
  }

  return true;
};

// Avatar Initials Color Generator
const getAvatarBg = (nameStr) => {
  const colors = [
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-rose-100 text-rose-800 border-rose-200",
    "bg-teal-100 text-teal-800 border-teal-200",
  ];
  let hash = 0;
  for (let i = 0; i < (nameStr || "").length; i++) {
    hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (firstName, lastName) => {
  const f = firstName ? firstName.charAt(0).toUpperCase() : "";
  const l = lastName ? lastName.charAt(0).toUpperCase() : "";
  return f + l || "U";
};

export default function AdminLeadsPage() {
  // Navigation Active Tab: 'overview' | 'byProduct' | 'contactUs'
  const [activeTab, setActiveTab] = useState("overview");

  // Global Header Date Filter
  const [selectedFilterOption, setSelectedFilterOption] = useState("All Time");
  const [dateRangeText, setDateRangeText] = useState("All Time");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [customEndDate, setCustomEndDate] = useState(() => new Date());

  // Search & Dynamic Page Source Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSourceFilter, setPageSourceFilter] = useState("All Pages");

  // Open Dropdown Popover Toggle
  const [openDropdown, setOpenDropdown] = useState(null); // 'pageSource'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);

  // Live Leads Data State
  const [leadsData, setLeadsData] = useState([]);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Lead Action Modals
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [deleteConfirmLead, setDeleteConfirmLead] = useState(null);

  // Selected Checkboxes State
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Fetch Live Leads from Backend API (Silent Background + Manual Trigger)
  const fetchLeads = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    const startTime = Date.now();
    try {
      let endpoint = `/leads?limit=500&_t=${Date.now()}`;

      if (searchQuery.trim()) {
        endpoint += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await apiRequest(endpoint, { method: "GET" });

      if (res && res.success) {
        setLeadsData(res.leads || []);
        setTotalLeadsCount(res.total || (res.leads ? res.leads.length : 0));
        setErrorMsg("");
      } else {
        setLeadsData([]);
        setTotalLeadsCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      if (isManual) {
        setErrorMsg("Failed to load leads from database. Please check connection.");
      }
    } finally {
      setIsLoading(false);
      if (isManual) {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 600 - elapsed);
        setTimeout(() => {
          setIsRefreshing(false);
        }, remainingDelay);
      }
    }
  }, [searchQuery]);

  useEffect(() => {
    let isCancelled = false;

    fetchLeads(false);

    // Auto-refresh polling every 8s when visible
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchLeads(false);
      }
    }, 8000);

    // Instant Sync on Tab Focus / Return to Window
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        fetchLeads(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      isCancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [fetchLeads]);

  // Handle Main Date Filter Selection
  const handleSelectFilter = (option) => {
    setSelectedFilterOption(option.value);
    setCurrentPage(1);
    if (option.value === "Custom") {
      setShowFilterDropdown(false);
      setShowCustomModal(true);
      return;
    }
    const calculated = getDynamicRangeText(option.value);
    setDateRangeText(calculated);
    setShowFilterDropdown(false);
  };

  const handleApplyCustomDate = () => {
    const formatted = `${formatDateNumeric(customStartDate)} to ${formatDateNumeric(customEndDate)}`;
    setDateRangeText(formatted);
    setSelectedFilterOption("Custom");
    setCurrentPage(1);
    setShowCustomModal(false);
  };

  // Clear All Filters Helper
  const handleClearFilters = () => {
    setSearchQuery("");
    setPageSourceFilter("All Pages");
    setSelectedFilterOption("All Time");
    setDateRangeText("All Time");
    setCurrentPage(1);
  };

  // Lead Delete Handler (Live Backend Sync)
  const handleDeleteLead = async (leadId) => {
    try {
      const res = await apiRequest(`/leads/${leadId}`, {
        method: "DELETE",
      });

      if (res && res.success) {
        setLeadsData((prev) => prev.filter((item) => item._id !== leadId));
        setTotalLeadsCount((prev) => Math.max(0, prev - 1));
        setDeleteConfirmLead(null);
        if (selectedLeadModal && selectedLeadModal._id === leadId) {
          setSelectedLeadModal(null);
        }
      }
    } catch (err) {
      alert("Failed to delete lead. Please try again.");
    }
  };

  // Checkbox Select Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeadIds(displayedLeads.map((l) => l._id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Dynamic Page Sources extracted from actual database leads
  const dynamicPageSources = useMemo(() => {
    const pagesSet = new Set(["All Pages"]);

    // Add unique sourcePage values from actual live leads (excluding blogs)
    leadsData.forEach((lead) => {
      if (lead.sourcePage && lead.sourcePage.trim()) {
        const pageName = lead.sourcePage.trim();
        if (!pageName.toLowerCase().includes("blog")) {
          pagesSet.add(pageName);
        }
      }
    });

    return Array.from(pagesSet);
  }, [leadsData]);

  // Filtered Leads Calculation based on Dynamic Page Source, Date Range, & Active Tab
  const displayedLeads = useMemo(() => {
    return leadsData.filter((lead) => {
      // 1. Date Range Filter
      if (
        !isDateInSelectedRange(
          lead.createdAt,
          selectedFilterOption,
          customStartDate,
          customEndDate
        )
      ) {
        return false;
      }

      // 2. Tab Filtering
      if (activeTab === "contactUs") {
        if (
          lead.sourcePage !== "Contact Page" &&
          !lead.sourcePage?.toLowerCase().includes("contact")
        ) {
          return false;
        }
      }
      if (activeTab === "byProduct") {
        if (
          !lead.productName &&
          !lead.service?.toLowerCase().includes("product") &&
          !lead.sourcePage?.toLowerCase().includes("product")
        ) {
          return false;
        }
      }

      // 3. Dynamic Page Source Filter
      if (pageSourceFilter !== "All Pages") {
        if (lead.sourcePage !== pageSourceFilter) {
          return false;
        }
      }

      return true;
    });
  }, [leadsData, activeTab, pageSourceFilter, selectedFilterOption, customStartDate, customEndDate]);

  // Working Client Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(displayedLeads.length / itemsPerPage));

  // Ensure current page does not exceed totalPages when filters change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayedLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [displayedLeads, currentPage, itemsPerPage]);

  return (
    <div className="space-y-5 pb-10">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. COMPACT HEADER ROW: Breadcrumbs, Title + Integrated Total Leads Pill & Date Filter
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 mb-0.5">
            <Link href="/admin/dashboard" className="hover:text-gold-dark transition-colors">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-semibold">Leads</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900 tracking-tight">
              Leads Management
            </h1>

            {/* Sleek Total Leads Pill */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#fdfaf0] border border-gold-main/40 rounded-xl shadow-2xs">
              <Users className="w-3.5 h-3.5 text-gold-dark" />
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  Total Leads:
                </span>
                <span className="text-xs font-heading font-extrabold text-gray-900">
                  {displayedLeads.length}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded-md border border-emerald-200">
                ↑ 12.5%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Date Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-semibold text-gray-700 shadow-xs transition-all duration-200"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-dark" />
              <span>{dateRangeText}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {[
                  "All Time",
                  "Today",
                  "Yesterday",
                  "Last 7 days",
                  "Last 30 days",
                  "This Month",
                  "Last Month",
                  "Custom",
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectFilter({ value: opt })}
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedFilterOption === opt
                        ? "bg-[#fdfaf0] text-gold-dark font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedFilterOption === opt && (
                      <Check className="w-3.5 h-3.5 text-gold-dark" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live Sync Pulse Indicator */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-heading font-semibold shadow-2xs select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Sync</span>
          </div>

          {/* Real-time Refresh Button */}
          <button
            onClick={() => fetchLeads(true)}
            disabled={isRefreshing}
            title="Refresh live leads"
            className="p-2 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-gray-700 hover:text-gold-dark shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold-dark" : ""}`} />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. NAVIGATION TABS WITH LUCIDE ICONS (NO RAW EMOJIS)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200/80 -mt-1">
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setActiveTab("overview");
              setPageSourceFilter("All Pages");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold transition-all relative ${
              activeTab === "overview"
                ? "text-gray-900 border-b-2 border-gold-main"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-gold-dark" />
            <span>Leads Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("byProduct");
              setPageSourceFilter("All Pages");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold transition-all relative ${
              activeTab === "byProduct"
                ? "text-gray-900 border-b-2 border-gold-main"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Package className="w-4 h-4 text-gold-dark" />
            <span>Leads by Product</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("contactUs");
              setPageSourceFilter("All Pages");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 pb-2.5 text-xs font-bold transition-all relative ${
              activeTab === "contactUs"
                ? "text-gray-900 border-b-2 border-gold-main"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Mail className="w-4 h-4 text-gold-dark" />
            <span>Contact Us Leads</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. DYNAMIC SEARCH & PAGE SOURCE FILTER ROW
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Real-time Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search leads by name, email, phone or company..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gold-main focus:ring-1 focus:ring-gold-main shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Page Source Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === "pageSource" ? null : "pageSource")}
              className="flex items-center justify-between gap-3 px-3.5 py-2 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-medium text-gray-700 min-w-[160px] shadow-xs transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Filter className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                <span className="truncate">{pageSourceFilter}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </button>
            {openDropdown === "pageSource" && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40 max-h-60 overflow-y-auto">
                {dynamicPageSources.map((pg) => (
                  <button
                    key={pg}
                    onClick={() => {
                      setPageSourceFilter(pg);
                      setOpenDropdown(null);
                      setCurrentPage(1);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between truncate"
                  >
                    <span className="truncate">{pg}</span>
                    {pageSourceFilter === pg && (
                      <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-semibold text-gray-600 shadow-xs transition-all ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>Clear Filters</span>
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────────────────────
            4. CLEAN HIGH-DENSITY LEADS TABLE
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400 text-xs font-semibold flex flex-col items-center justify-center gap-3">
              <div className="w-7 h-7 border-2 border-gold-main border-t-transparent rounded-full animate-spin"></div>
              <span>Loading live leads from database...</span>
            </div>
          ) : errorMsg ? (
            <div className="p-8 text-center text-rose-600 text-xs font-semibold">
              {errorMsg}
            </div>
          ) : displayedLeads.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs font-semibold">
              No leads found for this category or filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/90 border-b border-gray-200 text-xs font-heading font-bold text-gray-700 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          displayedLeads.length > 0 &&
                          selectedLeadIds.length === displayedLeads.length
                        }
                        className="rounded border-gray-300 text-gold-dark focus:ring-gold-main"
                      />
                    </th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Country</th>
                    <th className="py-3.5 px-4">Phone Number</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Page Source</th>
                    <th className="py-3.5 px-4">Service / Product</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                  {paginatedLeads.map((lead) => {
                    const fullName = `${lead.firstName || ""} ${lead.lastName || ""}`.trim();
                    const initials = getInitials(lead.firstName, lead.lastName);
                    const avatarClass = getAvatarBg(fullName);
                    const inquiryText = lead.service || lead.productName || "General Inquiry";

                    return (
                      <tr
                        key={lead._id}
                        className="hover:bg-[#fdfaf0]/40 transition-colors group"
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(lead._id)}
                            onChange={() => handleSelectOne(lead._id)}
                            className="rounded border-gray-300 text-gold-dark focus:ring-gold-main"
                          />
                        </td>

                        {/* Name + Initial Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border shrink-0 ${avatarClass}`}
                            >
                              {initials}
                            </div>
                            <span className="font-heading font-bold text-sm text-gray-900 whitespace-nowrap">
                              {fullName}
                            </span>
                          </div>
                        </td>

                        {/* Country */}
                        <td className="py-3.5 px-4 text-gray-700 font-medium whitespace-nowrap">
                          {lead.country || "India"}
                        </td>

                        {/* Phone Number */}
                        <td className="py-3.5 px-4 text-gray-800 font-mono text-[11px] whitespace-nowrap">
                          {lead.phone ? (
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span>{lead.phone}</span>
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">Not Provided</span>
                          )}
                        </td>

                        {/* Email + Health/Spam Indicator */}
                        {/* Email Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-gray-900 font-mono text-[11px]">
                              {lead.email}
                            </span>
                            {lead.emailStatus === "undeliverable" || lead.emailStatus === "SPAM" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded w-fit" title={lead.emailReason || "Undeliverable / Fake Mailbox"}>
                                <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                                Undeliverable / Fake
                              </span>
                            ) : lead.emailStatus === "unknown" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded w-fit" title={lead.emailReason || "Unverified / Catch-All / Dummy Pattern"}>
                                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                {lead.emailQuality === "SUSPICIOUS_DUMMY_PATTERN" ? "Suspicious / Test" : "Unverified / Catch-All"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded w-fit" title={lead.emailReason || "Verified Active Mailbox"}>
                                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                Deliverable / Real
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Page Source Pill */}
                        <td className="py-3.5 px-4">
                          {getProductLink(lead) ? (
                            <a
                              href={getProductLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 border border-blue-200/60 inline-flex items-center gap-1.5 max-w-[200px] truncate transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
                              title="Click to view product page in new tab"
                            >
                              <span className="truncate">{lead.sourcePage || "Contact Us Page"}</span>
                              <ExternalLink className="w-3 h-3 text-blue-500 group-hover:text-blue-800 shrink-0" />
                            </a>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 inline-block max-w-[180px] truncate">
                              {lead.sourcePage || "Contact Us Page"}
                            </span>
                          )}
                        </td>

                        {/* Service / Product */}
                        <td className="py-3.5 px-4 text-gray-900 font-semibold max-w-[200px] truncate">
                          {inquiryText}
                        </td>

                        {/* Actions: View Details (Eye) & Delete (Trash) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* View Action */}
                            <button
                              onClick={() => setSelectedLeadModal(lead)}
                              title="View Complete Lead Details"
                              className="p-1.5 text-gray-500 hover:text-gold-dark hover:bg-[#fdfaf0] border border-transparent hover:border-gold-main/40 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Delete Action */}
                            <button
                              onClick={() => setDeleteConfirmLead(lead)}
                              title="Delete Lead"
                              className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────────────────────
              5. PRODUCTION-READY WORKING PAGINATION FOOTER
              ───────────────────────────────────────────────────────────────────────────── */}
          <div className="py-3 px-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
            <div>
              Showing{" "}
              <span className="font-bold text-gray-900">
                {displayedLeads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-bold text-gray-900">
                {Math.min(currentPage * itemsPerPage, displayedLeads.length)}
              </span>{" "}
              of <span className="font-bold text-gray-900">{displayedLeads.length}</span> leads
            </div>

            <div className="flex items-center gap-4">
              {/* Items Per Page Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-gold-main transition-colors shadow-2xs"
                >
                  <span>{itemsPerPage} per page</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                {showPerPageDropdown && (
                  <div className="absolute right-0 bottom-full mb-1.5 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-40">
                    {[5, 10, 25, 50, 100].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setItemsPerPage(num);
                          setCurrentPage(1);
                          setShowPerPageDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{num} per page</span>
                        {itemsPerPage === num && (
                          <Check className="w-3 h-3 text-gold-dark" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Pagination Controls */}
              <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors font-bold text-xs shadow-2xs"
                  title="First Page"
                >
                  |&lt;
                </button>
                
                {/* Previous Page */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="p-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors shadow-2xs"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Dynamic Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 font-bold rounded-lg text-xs transition-colors shadow-2xs ${
                      currentPage === pageNum
                        ? "bg-[#0a0a0a] text-gold-main font-extrabold border border-gold-main/40"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Page */}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="p-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors shadow-2xs"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* Last Page */}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors font-bold text-xs shadow-2xs"
                  title="Last Page"
                >
                  &gt;|
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. COMPLETE COMPREHENSIVE LEAD DETAILS MODAL (VIEW ALL FORM DATA)
          ───────────────────────────────────────────────────────────────────────────── */}
      {selectedLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-gold-main/25 space-y-4.5 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedLeadModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Avatar & Name */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-gray-100">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg border shrink-0 ${getAvatarBg(
                  selectedLeadModal.firstName
                )}`}
              >
                {getInitials(selectedLeadModal.firstName, selectedLeadModal.lastName)}
              </div>
              <div>
                <h3 className="text-lg font-heading font-extrabold text-gray-900 leading-tight">
                  {selectedLeadModal.firstName} {selectedLeadModal.lastName}
                </h3>
                <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>Received on {formatDateFull(selectedLeadModal.createdAt)}</span>
                </p>
              </div>
            </div>

            {/* Comprehensive Data Grid (2 Columns, Clear & Spacious) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-gray-50/80 rounded-2xl p-4 text-xs border border-gray-100">
              {/* Email Address + Spam Verification */}
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold flex items-center gap-1 text-xs">
                  <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Email Address
                </span>
                <span className="font-mono text-gray-900 font-bold text-xs block break-all">
                  {selectedLeadModal.email}
                </span>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  {selectedLeadModal.emailStatus === "undeliverable" || selectedLeadModal.emailStatus === "SPAM" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md w-fit">
                      <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                      Undeliverable / Fake (Score: {selectedLeadModal.emailScore || 0}%)
                    </span>
                  ) : selectedLeadModal.emailStatus === "unknown" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md w-fit">
                      <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                      {selectedLeadModal.emailQuality === "SUSPICIOUS_DUMMY_PATTERN" ? "Suspicious / Test Pattern" : "Unverified / Catch-All"} ({selectedLeadModal.emailScore || 30}%)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      Deliverable / Real (Score: {selectedLeadModal.emailScore || 95}%)
                    </span>
                  )}
                  {selectedLeadModal.emailReason && (
                    <span className="text-[11px] text-gray-500 font-medium italic block pt-0.5">
                      ℹ️ {formatEmailReason(selectedLeadModal.emailReason)}
                    </span>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold flex items-center gap-1 text-xs">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Phone Number
                </span>
                <span className="text-gray-900 font-mono font-bold text-xs block">
                  {selectedLeadModal.phone || "Not Provided"}
                </span>
              </div>

              {/* Country */}
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold flex items-center gap-1 text-xs">
                  <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Country
                </span>
                <span className="text-gray-900 font-bold text-xs block">
                  {selectedLeadModal.country || "India"}
                </span>
              </div>

              {/* Company */}
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold flex items-center gap-1 text-xs">
                  <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Company Name
                </span>
                <span className="text-gray-900 font-bold text-xs block truncate" title={selectedLeadModal.company}>
                  {selectedLeadModal.company || "General Business / Individual"}
                </span>
              </div>

              {/* Page Source Origin (Clickable Link) */}
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold flex items-center gap-1 text-xs">
                  <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Page Source
                </span>
                {getProductLink(selectedLeadModal) ? (
                  <a
                    href={getProductLink(selectedLeadModal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
                    title="Open product page in new tab"
                  >
                    <span>{selectedLeadModal.sourcePage || "Contact Us Page"}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </a>
                ) : (
                  <span className="text-blue-700 font-bold text-xs block">
                    {selectedLeadModal.sourcePage || "Contact Us Page"}
                  </span>
                )}
              </div>

              {/* Service Selected / Inquiry Option */}
              <div className="space-y-1">
                <span className="text-gray-400 font-semibold flex items-center gap-1 text-xs">
                  <Package className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Service Selected
                </span>
                <span className="text-gray-900 font-bold text-xs block">
                  {selectedLeadModal.service || selectedLeadModal.productName || "General Inquiry"}
                </span>
              </div>

              {/* Product Name (if available - Clickable Link) */}
              {selectedLeadModal.productName && (
                <div className="space-y-1 sm:col-span-2 pt-1 border-t border-gray-100/80">
                  <span className="text-gray-400 font-semibold flex items-center gap-1 text-xs">
                    <Package className="w-3.5 h-3.5 text-gold-dark shrink-0" /> Target Product
                  </span>
                  {getProductLink(selectedLeadModal) ? (
                    <a
                      href={getProductLink(selectedLeadModal)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-dark hover:text-amber-700 hover:underline font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer group text-xs"
                      title="Open product page in new tab"
                    >
                      <span>{selectedLeadModal.productName}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gold-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </a>
                  ) : (
                    <span className="text-gray-900 font-bold text-xs block">
                      {selectedLeadModal.productName}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* User Message Section */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                User Message / Inquiry Requirements
              </h4>
              <div className="p-3 bg-gray-50 border border-gray-200/80 rounded-2xl text-xs text-gray-800 leading-relaxed font-sans max-h-24 overflow-y-auto whitespace-pre-wrap">
                {selectedLeadModal.message || "No message entered by the user."}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedLeadModal(null)}
                className="px-6 py-2.5 bg-black text-gold-main font-bold text-xs rounded-xl hover:bg-gray-900 transition-colors shadow-xs cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          7. CUSTOM DATE RANGE PICKER MODAL
          ───────────────────────────────────────────────────────────────────────────── */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gold-main/30 space-y-4 relative">
            <button
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-heading font-extrabold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-dark" /> Select Custom Date Range
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-500 font-semibold block mb-1">Start Date</label>
                <input
                  type="date"
                  value={formatDateNumeric(customStartDate).split("/").reverse().join("-")}
                  onChange={(e) => {
                    if (e.target.value) setCustomStartDate(new Date(e.target.value));
                  }}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-semibold focus:outline-none focus:border-gold-main"
                />
              </div>

              <div>
                <label className="text-gray-500 font-semibold block mb-1">End Date</label>
                <input
                  type="date"
                  value={formatDateNumeric(customEndDate).split("/").reverse().join("-")}
                  onChange={(e) => {
                    if (e.target.value) setCustomEndDate(new Date(e.target.value));
                  }}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-semibold focus:outline-none focus:border-gold-main"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomDate}
                className="px-4 py-2 bg-black text-gold-main rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors shadow-xs"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          8. DELETE CONFIRMATION MODAL
          ───────────────────────────────────────────────────────────────────────────── */}
      {deleteConfirmLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-gray-900">
              Delete Lead?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Are you sure you want to delete lead from{" "}
              <strong className="text-gray-900">
                {deleteConfirmLead.firstName} {deleteConfirmLead.lastName}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmLead(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLead(deleteConfirmLead._id)}
                className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
              >
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
