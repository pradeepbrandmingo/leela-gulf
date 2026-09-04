"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import {
  Users,
  UserPlus,
  FileText,
  Calendar,
  ChevronDown,
  Check,
  X,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  ArrowUpRight,
  Search,
  RefreshCw,
} from "lucide-react";

/**
 * CountryFlag Component: Renders visual SVG/PNG flag icon with border and fallback
 * Fixes Windows OS emoji flag rendering issue (where emoji flags display as text codes like "AE", "IN")
 */
function CountryFlag({ code, name, className = "w-5 h-3.5" }) {
  const countryCode = (code || "").toUpperCase();

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <img
        src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
        srcSet={`https://flagcdn.com/w80/${countryCode.toLowerCase()}.png 2x`}
        alt={name || countryCode}
        className={`${className} object-cover rounded-xs border border-gray-200 shadow-2xs`}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          if (e.currentTarget.nextElementSibling) {
            e.currentTarget.nextElementSibling.style.display = "inline-flex";
          }
        }}
      />
      <span
        style={{ display: "none" }}
        className="px-1 py-0.5 text-[9px] font-bold bg-gray-100 text-gray-700 rounded border border-gray-200 uppercase"
      >
        {countryCode}
      </span>
    </div>
  );
}

/**
 * Helper to format date in Short format (e.g. "May 21, 2025")
 */
const formatDateShort = (dateInput) => {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (!d || isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

  if (filterType === "This Year") {
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    return `${formatDateShort(startOfYear)} - ${formatDateShort(today)}`;
  }

  if (filterType === "All Time") {
    return `All Recorded Traffic (Lifetime)`;
  }

  return `${formatDateShort(today)}`;
};

export default function AdminVisitorsPage() {
  // Main Date Filter Dropdown State
  const [selectedFilterOption, setSelectedFilterOption] = useState("Last 7 days");
  const [dateRangeText, setDateRangeText] = useState(() => getDynamicRangeText("Last 7 days"));
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Custom Date Range State
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [customEndDate, setCustomEndDate] = useState(() => new Date());

  // Live Backend Data State
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals for "View All" with Search & Zero Scrollbar
  const [showAllPagesModal, setShowAllPagesModal] = useState(false);
  const [showAllCountriesModal, setShowAllCountriesModal] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [pageSearchQuery, setPageSearchQuery] = useState("");

  // Filter Dropdown Options (Complete Production Ready)
  const filterOptions = [
    { label: "Today", value: "Today" },
    { label: "Yesterday", value: "Yesterday" },
    { label: "Last 7 days", value: "Last 7 days" },
    { label: "Last 30 days", value: "Last 30 days" },
    { label: "This Month", value: "This Month" },
    { label: "Last Month", value: "Last Month" },
    { label: "This Year", value: "This Year" },
    { label: "All Time (Lifetime)", value: "All Time" },
    { label: "Custom Range...", value: "Custom" },
  ];

  // Live API Fetcher
  const fetchLiveAnalytics = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    const startTime = Date.now();
    try {
      let url = `${API_BASE_URL}/analytics/stats?range=${encodeURIComponent(selectedFilterOption)}&_t=${Date.now()}`;
      if (selectedFilterOption === "Custom" && customStartDate && customEndDate) {
        url += `&startDate=${encodeURIComponent(customStartDate.toISOString())}&endDate=${encodeURIComponent(customEndDate.toISOString())}`;
      }
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      const data = await res.json();
      if (data && data.success) {
        setApiData(data);
        if (data.dateRangeText && selectedFilterOption !== "Custom") {
          setDateRangeText(data.dateRangeText);
        }
      }
    } catch (err) {
      console.warn("Using offline analytics defaults:", err?.message);
    } finally {
      if (isManual) {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 600 - elapsed);
        setTimeout(() => {
          setIsRefreshing(false);
        }, remainingDelay);
      }
    }
  }, [selectedFilterOption, customStartDate, customEndDate]);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        let url = `${API_BASE_URL}/analytics/stats?range=${encodeURIComponent(selectedFilterOption)}&_t=${Date.now()}`;
        if (selectedFilterOption === "Custom" && customStartDate && customEndDate) {
          url += `&startDate=${encodeURIComponent(customStartDate.toISOString())}&endDate=${encodeURIComponent(customEndDate.toISOString())}`;
        }
        const res = await fetch(url, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        const data = await res.json();
        if (!isCancelled && data && data.success) {
          setApiData(data);
          if (data.dateRangeText && selectedFilterOption !== "Custom") {
            setDateRangeText(data.dateRangeText);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.warn("Using offline analytics defaults:", err?.message);
        }
      }
    };

    loadData();

    // Live Real-Time Auto Refresh every 8 seconds (Smart Polling)
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        loadData();
      }
    }, 8000);

    // Instant Sync on Tab Focus / Return to Window
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        loadData();
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
  }, [selectedFilterOption, customStartDate, customEndDate]);

  const handleSelectFilter = (option) => {
    setSelectedFilterOption(option.value);
    if (option.value === "Custom") {
      setShowFilterDropdown(false);
      setShowCustomModal(true);
      return;
    }
    setDateRangeText(getDynamicRangeText(option.value));
    setShowFilterDropdown(false);
  };

  const handleApplyCustomDate = () => {
    const formatted = `${formatDateShort(customStartDate)} - ${formatDateShort(customEndDate)}`;
    setDateRangeText(formatted);
    setSelectedFilterOption("Custom");
    setShowCustomModal(false);
  };

  // ── TOP 3 METRIC CARDS (Live Real-Time Data) ──
  const topMetricCards = [
    {
      title: "Total Visitors",
      value: apiData?.kpiSummary?.totalVisitors?.value ?? "0",
      trend: apiData?.kpiSummary?.totalVisitors?.trend ?? "0.0%",
      trendLabel: "vs previous period",
      isPositive: apiData?.kpiSummary?.totalVisitors?.isPositive !== false,
      icon: Users,
      iconBg: "bg-amber-50 text-gold-dark border-gold-main/30",
    },
    {
      title: "New Visitors",
      value: apiData?.kpiSummary?.newVisitors?.value ?? "0",
      trend: apiData?.kpiSummary?.newVisitors?.trend ?? "0.0%",
      trendLabel: "vs previous period",
      isPositive: apiData?.kpiSummary?.newVisitors?.isPositive !== false,
      icon: UserPlus,
      iconBg: "bg-amber-50 text-gold-dark border-gold-main/30",
    },
    {
      title: "Total Page Views",
      value: apiData?.kpiSummary?.totalPageViews?.value ?? "0",
      trend: apiData?.kpiSummary?.totalPageViews?.trend ?? "0.0%",
      trendLabel: "vs previous period",
      isPositive: apiData?.kpiSummary?.totalPageViews?.isPositive !== false,
      icon: FileText,
      iconBg: "bg-amber-50 text-gold-dark border-gold-main/30",
    },
  ];

  // Visitors Overview Comparison State (Multi-Period vs Previous Period)
  const [chartViewMode, setChartViewMode] = useState("This Week");
  const [showChartModeDropdown, setShowChartModeDropdown] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  const chartModeOptions = [
    { label: "This Week (vs Last Week)", value: "This Week" },
    { label: "This Month (vs Last Month)", value: "This Month" },
    { label: "Last 30 Days (vs Prev 30 Days)", value: "Last 30 Days" },
    { label: "Custom Range...", value: "Custom" },
  ];

  // Helper for generating silky-smooth SVG Bezier Curves
  const generateSmoothPath = (pts, key = "cyCurrent") => {
    if (!pts || pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].cx},${pts[0][key]}`;
    let d = `M ${pts[0].cx},${pts[0][key]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.cx + (p1.cx - p0.cx) * 0.45;
      const cpY1 = p0[key];
      const cpX2 = p0.cx + (p1.cx - p0.cx) * 0.55;
      const cpY2 = p1[key];
      d += ` C ${cpX1.toFixed(1)},${cpY1.toFixed(1)} ${cpX2.toFixed(1)},${cpY2.toFixed(1)} ${p1.cx},${p1[key]}`;
    }
    return d;
  };

  // Dynamic Comparison Chart Data Calculation (Live Backend Data Driven)
  const comparisonChartData = useMemo(() => {
    const rawPoints =
      apiData?.chartData && apiData.chartData.length > 0
        ? apiData.chartData
        : [
            { label: "Mon", current: 0, previous: 0 },
            { label: "Tue", current: 0, previous: 0 },
            { label: "Wed", current: 0, previous: 0 },
            { label: "Thu", current: 0, previous: 0 },
            { label: "Fri", current: 0, previous: 0 },
            { label: "Sat", current: 0, previous: 0 },
            { label: "Sun", current: 0, previous: 0 },
          ];

    const maxVal = Math.max(10, ...rawPoints.map((p) => Math.max(p.current || 0, p.previous || 0)));
    const step = Math.ceil(maxVal / 4);
    const yLabels = [
      `${(step * 4).toLocaleString()}`,
      `${(step * 3).toLocaleString()}`,
      `${(step * 2).toLocaleString()}`,
      `${step.toLocaleString()}`,
      "0",
    ];

    const svgWidth = 500;
    const leftPad = 40;
    const rightPad = 40;
    const plotWidth = svgWidth - leftPad - rightPad;
    const count = rawPoints.length;

    const points = rawPoints.map((p, idx) => {
      const cx = count === 1 ? svgWidth / 2 : leftPad + (idx / (count - 1)) * plotWidth;
      const cyCurrent = 135 - ((p.current || 0) / maxVal) * 105;
      const cyPrev = 135 - ((p.previous || 0) / maxVal) * 105;
      return {
        label: p.label,
        current: p.current,
        prev: p.previous,
        cx: Math.round(cx),
        cyCurrent: Math.round(cyCurrent),
        cyPrev: Math.round(cyPrev),
      };
    });

    const curPath = generateSmoothPath(points, "cyCurrent");
    const curArea = `${curPath} L ${points[points.length - 1].cx},150 L ${points[0].cx},150 Z`;
    const prevPath = generateSmoothPath(points, "cyPrev");

    return {
      currentLabel: selectedFilterOption === "This Month" ? "This Month" : "Current Period",
      prevLabel: selectedFilterOption === "This Month" ? "Last Month" : "Previous Period",
      currentTotal: apiData?.kpiSummary?.totalVisitors?.value ?? "0",
      prevTotal: "0",
      growthPct: apiData?.kpiSummary?.totalVisitors?.trend ?? "0.0%",
      isGrowthPositive: apiData?.kpiSummary?.totalVisitors?.isPositive !== false,
      avgMetric: `${apiData?.kpiSummary?.avgDailyVisitors?.value ?? "0"} / day`,
      yLabels,
      points,
      curPath,
      curArea,
      prevPath,
    };
  }, [apiData, selectedFilterOption]);

  // Widget-Level Timeframe States (Production-grade Filtering)
  const [sourceTimeframe, setSourceTimeframe] = useState("This Week");
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  const [deviceTimeframe, setDeviceTimeframe] = useState("This Week");
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);

  // Timeframe Options for Chart/Widget Cards
  const widgetTimeframeOptions = ["Today", "This Week", "This Month", "All Time"];

  // ── DYNAMIC TRAFFIC SOURCE DATA ACCORDING TO LIVE BACKEND ──
  const { trafficSources, sourceTotalFormatted } = useMemo(() => {
    const totalRaw = apiData?.kpiSummary?.totalVisitors?.raw || 0;
    const totalFormatted = apiData?.kpiSummary?.totalVisitors?.value || "0";
    const sourcesList = apiData?.sourcesData || [
      { name: "Organic Search", count: 0, percentage: 0, color: "#1e3a8a" },
      { name: "Direct", count: 0, percentage: 0, color: "#c29d38" },
      { name: "Social Media", count: 0, percentage: 0, color: "#0284c7" },
      { name: "Referral", count: 0, percentage: 0, color: "#10b981" },
      { name: "Email", count: 0, percentage: 0, color: "#8b5cf6" },
    ];

    const circumference = 2 * Math.PI * 40;
    let offsetTracker = 0;
    const items = [];

    for (const s of sourcesList) {
      const arc = totalRaw > 0 ? (s.count / totalRaw) * circumference : 0;
      const off = -offsetTracker;
      offsetTracker += arc;
      items.push({
        name: s.name,
        count: Number(s.count || 0).toLocaleString(),
        pct: `${s.percentage || 0}%`,
        color: s.color || "#c19f16",
        arc: `${arc.toFixed(1)} ${circumference.toFixed(1)}`,
        offset: off,
      });
    }

    return {
      sourceTotalFormatted: totalFormatted,
      trafficSources: items,
    };
  }, [apiData]);

  // ── DYNAMIC DEVICES BREAKDOWN DATA ACCORDING TO LIVE BACKEND ──
  const { devicesData, deviceTotalFormatted } = useMemo(() => {
    const totalRaw = apiData?.kpiSummary?.totalVisitors?.raw || 0;
    const totalFormatted = apiData?.kpiSummary?.totalVisitors?.value || "0";
    const devList = apiData?.devicesData || [
      { name: "Desktop", count: 0, percentage: 0, color: "#1e3a8a" },
      { name: "Mobile", count: 0, percentage: 0, color: "#c29d38" },
      { name: "Tablet", count: 0, percentage: 0, color: "#0284c7" },
    ];

    const circumference = 2 * Math.PI * 40;
    let offsetTracker = 0;
    const iconMap = { Desktop: Laptop, Mobile: Smartphone, Tablet: Tablet };
    const items = [];

    for (const d of devList) {
      const arc = totalRaw > 0 ? (d.count / totalRaw) * circumference : 0;
      const off = -offsetTracker;
      offsetTracker += arc;
      items.push({
        name: d.name,
        count: Number(d.count || 0).toLocaleString(),
        pct: `${d.percentage || 0}%`,
        color: d.color || "#c19f16",
        icon: iconMap[d.name] || Laptop,
        arc: `${arc.toFixed(1)} ${circumference.toFixed(1)}`,
        offset: off,
      });
    }

    return {
      deviceTotalFormatted: totalFormatted,
      devicesData: items,
    };
  }, [apiData]);

  // ── TOP PAGES LIST (Live Backend Integrated) ──
  const topPagesData = useMemo(() => {
    if (apiData?.top5Pages && apiData.top5Pages.length > 0) {
      return apiData.top5Pages.map((p) => ({
        path: p.path,
        label: p.title || p.path,
        views: typeof p.views === "number" ? p.views.toLocaleString() : String(p.views),
        pct: `${p.percentage}%`,
      }));
    }
    return [];
  }, [apiData]);

  // Extended Pages for View All Modal
  const allPagesData = useMemo(() => {
    if (apiData?.allPages && apiData.allPages.length > 0) {
      return apiData.allPages.map((p) => ({
        path: p.path,
        label: p.title || p.path,
        views: typeof p.views === "number" ? p.views.toLocaleString() : String(p.views),
        pct: `${p.percentage}%`,
      }));
    }
    return [];
  }, [apiData]);

  // ── VISITORS BY COUNTRY (Worldwide Live Support with Real Flag Icons) ──
  const countryVisitorsData = useMemo(() => {
    if (apiData?.top5Countries && apiData.top5Countries.length > 0) {
      return apiData.top5Countries.map((c) => ({
        country: c.name,
        code: c.code,
        count: typeof c.visitors === "number" ? c.visitors.toLocaleString() : String(c.visitors),
        pct: `${c.percentage}%`,
        widthPct: Number(c.percentage) || 10,
      }));
    }
    return [];
  }, [apiData]);

  // Extended Countries for View All Modal
  const allCountriesData = useMemo(() => {
    if (apiData?.allCountries && apiData.allCountries.length > 0) {
      return apiData.allCountries.map((c) => ({
        country: c.name,
        code: c.code,
        count: typeof c.visitors === "number" ? c.visitors.toLocaleString() : String(c.visitors),
        pct: `${c.percentage}%`,
        widthPct: Number(c.percentage) || 5,
      }));
    }
    return [];
  }, [apiData]);



  return (
    <div className="space-y-6 pb-12 font-subheading text-gray-900">
      
      {/* ═════════════════════════════════════════════════════════════════
          1. TOP HEADER & BREADCRUMB & DATE FILTER BAR
          ═════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Visitors
          </h1>
          <div className="flex items-center gap-2 text-xs font-subheading text-gray-500 mt-1">
            <Link href="/admin/dashboard" className="hover:text-gold-dark transition-colors">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span className="text-gray-800 font-semibold">Visitors</span>
          </div>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex items-center gap-3 relative">
          
          {/* Dynamic Date Filter Button */}
          <div
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2.5 bg-white border border-gray-200/90 hover:border-gold-main/50 rounded-xl px-4 py-2.5 text-xs font-heading font-bold text-gray-800 shadow-xs cursor-pointer transition-all select-none"
          >
            <Calendar className="w-4 h-4 text-gold-dark" />
            <span>{dateRangeText}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
          </div>

          {/* Date Filter Dropdown */}
          {showFilterDropdown && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn space-y-1">
              {filterOptions.map((opt) => {
                const isSelected = selectedFilterOption === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelectFilter(opt)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#fdfaf0] text-gold-dark border border-gold-main/30"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-gold-dark shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}

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
            onClick={() => fetchLiveAnalytics(true)}
            disabled={isRefreshing}
            title="Refresh live visitor metrics"
            className="p-2.5 bg-white border border-gray-200/90 hover:border-gold-main/50 rounded-xl text-gray-700 hover:text-gold-dark shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold-dark" : ""}`} />
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          CUSTOM CALENDAR MODAL
          ═════════════════════════════════════════════════════════════════ */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 border border-gray-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold-dark" />
                <span className="text-xs font-heading font-extrabold text-gray-900 uppercase tracking-wider">
                  Select Custom Date Range
                </span>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate.toISOString().split("T")[0]}
                  onChange={(e) => setCustomStartDate(new Date(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-subheading font-medium text-gray-900 focus:outline-hidden focus:border-gold-main"
                />
              </div>
              <div>
                <label className="block text-xs font-heading font-bold text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate.toISOString().split("T")[0]}
                  onChange={(e) => setCustomEndDate(new Date(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-subheading font-medium text-gray-900 focus:outline-hidden focus:border-gold-main"
                />
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs font-heading font-bold text-gray-700">
                Range: <span className="font-extrabold text-gold-dark">{formatDateShort(customStartDate)} to {formatDateShort(customEndDate)}</span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-heading font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCustomDate}
                  className="px-6 py-2.5 rounded-xl bg-gold-main text-black font-heading font-extrabold hover:bg-gold-light transition-colors shadow-md cursor-pointer"
                >
                  Apply Range
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          2. TOP 3 METRIC CARDS ROW (Exact 3 Cards Requested by User)
          ═════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {topMetricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-gold-main/50 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 shadow-2xs ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-heading font-bold text-sm text-gray-600">
                  {card.title}
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight">
                  {card.value}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-subheading">
                  <span className="inline-flex items-center font-bold text-emerald-600">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {card.trend}
                  </span>
                  <span className="text-gray-400 font-medium">{card.trendLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          3. VISITORS OVERVIEW LINE CHART & VISITORS BY SOURCE DONUT
          ═════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* LEFT: Visitors Overview (7 Cols on large screens) */}
        <div className="lg:col-span-7 bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          
          {/* Header Row: Responsive Layout with wrap support */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading font-extrabold text-base sm:text-lg lg:text-xl text-gray-900 tracking-tight">
                  Visitors Overview
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-gold-dark border border-gold-main/20 text-[10px] font-heading font-extrabold shrink-0">
                  Comparison Mode
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-subheading mt-0.5 truncate">
                {comparisonChartData.currentLabel} vs {comparisonChartData.prevLabel} traffic analysis
              </p>
            </div>

            {/* Timeframe selector & Chart Legend */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
              <div className="flex items-center gap-2 sm:gap-3 text-xs font-subheading font-medium">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-0.5 bg-[#c19f16] rounded-full shrink-0" />
                  <span className="text-gray-800 font-bold text-[11px] sm:text-xs">{comparisonChartData.currentLabel}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2.5 h-0.5 border-b border-dashed border-gray-400 shrink-0" />
                  <span className="text-gray-400 text-[11px] sm:text-xs">{comparisonChartData.prevLabel}</span>
                </div>
              </div>

              {/* Comparison Dropdown (Week / Month / 30 Days / Custom) */}
              <div className="relative shrink-0">
                <div
                  onClick={() => setShowChartModeDropdown(!showChartModeDropdown)}
                  className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 hover:border-gold-main/40 rounded-xl px-2.5 py-1 text-xs font-heading font-semibold text-gray-700 cursor-pointer select-none transition-colors"
                >
                  <span>{chartViewMode}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </div>

                {showChartModeDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-48 sm:w-52 bg-white border border-gray-200 rounded-xl p-1 shadow-2xl z-30 animate-fadeIn space-y-0.5">
                    {chartModeOptions.map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          if (opt.value === "Custom") {
                            setShowChartModeDropdown(false);
                            setShowCustomModal(true);
                            setChartViewMode("Custom");
                            return;
                          }
                          setChartViewMode(opt.value);
                          setShowChartModeDropdown(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2 text-xs font-heading font-bold rounded-lg cursor-pointer transition-colors ${
                          chartViewMode === opt.value
                            ? "bg-[#fdfaf0] text-gold-dark border border-gold-main/20"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="whitespace-nowrap">{opt.label}</span>
                        {chartViewMode === opt.value && <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SVG Line & Area Chart Area */}
          <div className="flex gap-2 sm:gap-3 pt-2">
            {/* Y-Axis Labels Column */}
            <div className="flex flex-col justify-between text-[10.5px] sm:text-[11px] font-subheading font-medium text-gray-400 pb-7 shrink-0 h-48 sm:h-52">
              {comparisonChartData.yLabels.map((lbl, idx) => (
                <span key={idx} className="whitespace-nowrap">{lbl}</span>
              ))}
            </div>

            {/* SVG Plot */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="relative w-full h-48 sm:h-52">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 500 150"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="visitorAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c19f16" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#c19f16" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Dashed Grid Lines */}
                  <line x1="0" y1="5" x2="500" y2="5" stroke="#f3f4f6" strokeDasharray="3 3" />
                  <line x1="0" y1="35" x2="500" y2="35" stroke="#f3f4f6" strokeDasharray="3 3" />
                  <line x1="0" y1="65" x2="500" y2="65" stroke="#f3f4f6" strokeDasharray="3 3" />
                  <line x1="0" y1="95" x2="500" y2="95" stroke="#f3f4f6" strokeDasharray="3 3" />
                  <line x1="0" y1="125" x2="500" y2="125" stroke="#f3f4f6" strokeDasharray="3 3" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#e5e7eb" />

                  {/* Previous Period Dashed Gray Line */}
                  <path
                    d={comparisonChartData.prevPath}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Current Period Area Fill Gradient */}
                  <path
                    d={comparisonChartData.curArea}
                    fill="url(#visitorAreaGradient)"
                  />

                  {/* Current Period Solid Golden Line */}
                  <path
                    d={comparisonChartData.curPath}
                    fill="none"
                    stroke="#c19f16"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points & Interactive Dots */}
                  {comparisonChartData.points.map((pt, idx) => (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    >
                      {/* Gray dots for prev period */}
                      <circle cx={pt.cx} cy={pt.cyPrev} r="3" fill="#9ca3af" />

                      {/* Golden active dots for current period */}
                      <circle
                        cx={pt.cx}
                        cy={pt.cyCurrent}
                        r={hoveredPointIndex === idx ? "6" : "4.5"}
                        fill="#c19f16"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                    </g>
                  ))}
                </svg>

                {/* Hover Tooltip Overlay */}
                {hoveredPointIndex !== null && comparisonChartData.points[hoveredPointIndex] && (
                  <div
                    className="absolute pointer-events-none bg-gray-900/95 text-white p-2.5 rounded-xl text-xs shadow-2xl z-20 animate-fadeIn border border-gray-700 flex flex-col gap-1 -translate-x-1/2 -translate-y-full whitespace-nowrap"
                    style={{
                      left: `${(comparisonChartData.points[hoveredPointIndex].cx / 500) * 100}%`,
                      top: `${(comparisonChartData.points[hoveredPointIndex].cyCurrent / 150) * 100 - 8}%`,
                    }}
                  >
                    <span className="font-heading font-bold text-amber-300 border-b border-gray-700 pb-1">
                      {comparisonChartData.points[hoveredPointIndex].label}
                    </span>
                    <div className="flex items-center justify-between gap-3 text-[11px]">
                      <span className="text-gray-300">Current:</span>
                      <span className="font-bold text-white">
                        {comparisonChartData.points[hoveredPointIndex].current.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[11px]">
                      <span className="text-gray-400">Previous:</span>
                      <span className="text-gray-300">
                        {comparisonChartData.points[hoveredPointIndex].prev.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-400 pt-0.5 border-t border-gray-800">
                      +{(
                        ((comparisonChartData.points[hoveredPointIndex].current -
                          comparisonChartData.points[hoveredPointIndex].prev) /
                          Math.max(1, comparisonChartData.points[hoveredPointIndex].prev)) *
                        100
                      ).toFixed(1)}
                      % Growth
                    </div>
                  </div>
                )}

                {/* X-Axis Date Labels */}
                <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-subheading text-gray-500 pt-2 border-t border-gray-100">
                  {comparisonChartData.points.map((pt, idx) => (
                    <span key={idx} className={`whitespace-nowrap ${hoveredPointIndex === idx ? "font-bold text-gray-900" : ""}`}>
                      {pt.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 4 Key Comparison Metrics Bar inside Card: Responsive Mini-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-3 border-t border-gray-100">
            <div className="bg-gray-50/80 rounded-xl p-2.5 text-center border border-gray-100/90 min-w-0">
              <p className="text-[11px] font-medium text-gray-500 truncate" title={comparisonChartData.currentLabel}>
                {comparisonChartData.currentLabel}
              </p>
              <p className="font-heading font-bold text-base sm:text-lg text-gray-900 mt-0.5 truncate">
                {comparisonChartData.currentTotal}
              </p>
            </div>
            <div className="bg-gray-50/80 rounded-xl p-2.5 text-center border border-gray-100/90 min-w-0">
              <p className="text-[11px] font-medium text-gray-500 truncate" title={comparisonChartData.prevLabel}>
                {comparisonChartData.prevLabel}
              </p>
              <p className="font-heading font-bold text-base sm:text-lg text-gray-500 mt-0.5 truncate">
                {comparisonChartData.prevTotal}
              </p>
            </div>
            <div className="bg-gray-50/80 rounded-xl p-2.5 text-center border border-gray-100/90 min-w-0">
              <p className="text-[11px] font-medium text-gray-500 truncate">vs Previous</p>
              <p className="font-heading font-bold text-base sm:text-lg text-emerald-600 mt-0.5 truncate">
                {comparisonChartData.growthPct}
              </p>
            </div>
            <div className="bg-gray-50/80 rounded-xl p-2.5 text-center border border-gray-100/90 min-w-0">
              <p className="text-[11px] font-medium text-gray-500 truncate">Daily Avg</p>
              <p className="font-heading font-bold text-base sm:text-lg text-gray-900 mt-0.5 truncate">
                {comparisonChartData.avgMetric}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Visitors by Source (5 Cols on large screens) */}
        <div className="lg:col-span-5 bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading font-extrabold text-base sm:text-lg lg:text-xl text-gray-900 tracking-tight">
              Visitors by Source
            </h2>

            {/* Interactive Timeframe Dropdown */}
            <div className="relative shrink-0">
              <div
                onClick={() => {
                  setShowSourceDropdown(!showSourceDropdown);
                  setShowDeviceDropdown(false);
                }}
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 hover:border-gold-main/40 rounded-xl px-2.5 py-1 text-xs font-heading font-semibold text-gray-700 cursor-pointer select-none transition-colors"
              >
                <span>{sourceTimeframe}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>

              {showSourceDropdown && (
                <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl p-1 shadow-xl z-30 animate-fadeIn space-y-0.5">
                  {widgetTimeframeOptions.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setSourceTimeframe(opt);
                        setShowSourceDropdown(false);
                      }}
                      className={`flex items-center justify-between px-3 py-1.5 text-xs font-heading font-bold rounded-lg cursor-pointer transition-colors ${
                        sourceTimeframe === opt ? "bg-[#fdfaf0] text-gold-dark" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt}</span>
                      {sourceTimeframe === opt && <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Donut Chart & Legend */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-5 py-2">

            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 xl:w-44 xl:h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="13" />
                {trafficSources.map((src, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={src.color}
                    strokeWidth="13"
                    strokeDasharray={src.arc}
                    strokeDashoffset={src.offset}
                    className="transition-all duration-700 ease-out"
                  />
                ))}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 leading-tight">
                  {sourceTotalFormatted}
                </span>
                <span className="text-[11px] text-gray-400 font-subheading font-medium mt-0.5">Total Visitors</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2 w-full min-w-0 text-xs font-subheading flex-1">
              {trafficSources.map((src, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                    <span className="text-gray-700 font-medium truncate text-xs">{src.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0 text-right text-xs">
                    {src.count} <span className="text-gray-400 font-normal text-[11px]">({src.pct})</span>
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════════
          4. BOTTOM ROW: TOP PAGES + VISITORS BY COUNTRY + DEVICES
          ═════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* 1. TOP PAGES TABLE (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
              Top Pages
            </h2>
            <button
              onClick={() => setShowAllPagesModal(true)}
              className="text-xs font-heading font-bold text-gray-500 hover:text-gold-dark transition-colors px-2 py-1 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs font-subheading">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700 uppercase font-heading font-bold text-xs tracking-wider">
                  <th className="pb-2.5 font-bold">Page</th>
                  <th className="pb-2.5 font-bold text-right">Views</th>
                  <th className="pb-2.5 font-bold text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-800">
                {topPagesData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400 font-subheading text-xs">
                      No visitor page views recorded yet
                    </td>
                  </tr>
                ) : (
                  topPagesData.map((page, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 max-w-[120px] sm:max-w-[140px] truncate font-medium text-gray-900 text-xs" title={page.path}>
                        {page.path}
                      </td>
                      <td className="py-2.5 font-bold text-right text-gray-900 text-xs whitespace-nowrap">{page.views}</td>
                      <td className="py-2.5 text-right text-gray-500 font-medium text-xs whitespace-nowrap">{page.pct}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. VISITORS BY COUNTRY (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
              Visitors by Country
            </h2>
            <button
              onClick={() => setShowAllCountriesModal(true)}
              className="text-xs font-heading font-bold text-gray-500 hover:text-gold-dark transition-colors px-2 py-1 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs font-subheading">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700 uppercase font-heading font-bold text-xs tracking-wider">
                  <th className="pb-2.5 font-bold">Country</th>
                  <th className="pb-2.5 font-bold text-right">Visitors</th>
                  <th className="pb-2.5 font-bold text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-800">
                {countryVisitorsData.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-400 font-subheading text-xs">
                      No visitor country data recorded yet
                    </td>
                  </tr>
                ) : (
                  countryVisitorsData.map((c, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-2.5 flex items-center gap-2 font-medium text-gray-900 min-w-0">
                        <CountryFlag code={c.code} name={c.country} className="w-4 h-3 shrink-0 rounded-xs" />
                        <span className="truncate max-w-[90px] sm:max-w-[110px] md:max-w-[130px] font-semibold text-xs">{c.country}</span>
                      </td>
                      <td className="py-2.5 font-bold text-right text-gray-900 text-xs whitespace-nowrap">{c.count}</td>
                      <td className="py-2.5 text-right text-gray-500 font-medium text-xs whitespace-nowrap">{c.pct}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. DEVICES BREAKDOWN (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
              Devices
            </h2>

            {/* Interactive Timeframe Dropdown */}
            <div className="relative">
              <div
                onClick={() => {
                  setShowDeviceDropdown(!showDeviceDropdown);
                  setShowSourceDropdown(false);
                }}
                className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 hover:border-gold-main/40 rounded-xl px-2.5 py-1 text-xs font-heading font-semibold text-gray-700 cursor-pointer select-none transition-colors"
              >
                <span>{deviceTimeframe}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>

              {showDeviceDropdown && (
                <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl p-1 shadow-xl z-30 animate-fadeIn space-y-0.5">
                  {widgetTimeframeOptions.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => {
                        setDeviceTimeframe(opt);
                        setShowDeviceDropdown(false);
                      }}
                      className={`flex items-center justify-between px-3 py-1.5 text-xs font-heading font-bold rounded-lg cursor-pointer transition-colors ${
                        deviceTimeframe === opt ? "bg-[#fdfaf0] text-gold-dark" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt}</span>
                      {deviceTimeframe === opt && <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Donut & Legend: Clean Responsive Vertical Stack */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-1">

            {/* SVG Donut */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="14" />
                {devicesData.map((dev, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={dev.color}
                    strokeWidth="14"
                    strokeDasharray={dev.arc}
                    strokeDashoffset={dev.offset}
                    className="transition-all duration-700 ease-out"
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="font-heading font-extrabold text-lg sm:text-xl text-gray-900 leading-tight">
                  {deviceTotalFormatted}
                </span>
                <span className="text-[10px] text-gray-400 font-subheading font-medium">Total</span>
              </div>
            </div>

            {/* Full-width Legend List */}
            <div className="w-full space-y-1.5 pt-2 border-t border-gray-100 text-xs font-subheading">
              {devicesData.map((dev, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dev.color }} />
                    <span className="text-gray-700 font-medium truncate text-xs">{dev.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0 text-right text-xs">
                    {dev.count} <span className="text-gray-400 font-normal text-[11px]">({dev.pct})</span>
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>



      {/* ═════════════════════════════════════════════════════════════════
          6. ALL COUNTRIES MODAL (Ultra-Clean, High-Density, Spacious Modal)
          ═════════════════════════════════════════════════════════════════ */}
      {showAllCountriesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 max-w-3xl lg:max-w-4xl w-full shadow-2xl space-y-3 sm:space-y-3.5 border border-gray-100 max-h-[88vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark shrink-0 shadow-2xs">
                  <Globe className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
                    All Country Traffic Distribution
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-subheading">
                    Tracking worldwide visitor geolocation in real-time
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAllCountriesModal(false);
                  setCountrySearchQuery("");
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={countrySearchQuery}
                onChange={(e) => setCountrySearchQuery(e.target.value)}
                placeholder="Search country or code (e.g. UAE, India, US)..."
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 text-xs font-subheading font-medium text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-gold-main focus:bg-white transition-all"
              />
            </div>

            {/* Countries List (Compact High-Density Rows) */}
            <div className="overflow-y-auto flex-1 space-y-1 sm:space-y-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
              {allCountriesData
                .filter(
                  (c) =>
                    c.country.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
                    c.code.toLowerCase().includes(countrySearchQuery.toLowerCase())
                )
                .map((c, idx) => (
                  <div
                    key={idx}
                    className="py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-lg sm:rounded-xl bg-gray-50/70 hover:bg-[#fdfaf0]/80 border border-gray-100 hover:border-gold-main/30 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-150"
                  >
                    {/* Country Info & Rank */}
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span
                        className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center font-heading text-[10.5px] sm:text-[11px] font-bold shrink-0 ${
                          idx === 0
                            ? "bg-amber-100 text-gold-dark font-extrabold"
                            : idx === 1
                              ? "bg-gray-200 text-gray-700 font-extrabold"
                              : idx === 2
                                ? "bg-amber-50 text-amber-800"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <CountryFlag code={c.code} name={c.country} className="w-5 h-3.5 sm:w-5.5 sm:h-3.5 rounded-xs shrink-0 shadow-2xs" />
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-xs sm:text-[13px] text-gray-900 truncate leading-snug">
                          {c.country}
                        </p>
                        <span className="inline-block px-1.5 py-0.2 bg-gray-200/70 text-gray-600 rounded text-[9px] font-mono font-semibold uppercase">
                          ISO: {c.code}
                        </span>
                      </div>
                    </div>

                    {/* Visitors Count, Percentage & Progress Bar */}
                    <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-right">
                      {/* Mini Visual Progress Bar */}
                      <div className="hidden sm:flex flex-col items-end gap-0.5 w-16 sm:w-24">
                        <div className="w-full bg-gray-200/80 rounded-full h-1 sm:h-1.5 overflow-hidden">
                          <div
                            className="bg-gold-main h-full rounded-full transition-all duration-500"
                            style={{ width: c.pct }}
                          />
                        </div>
                      </div>

                      <div className="min-w-[72px] sm:min-w-[82px] text-right">
                        <p className="font-heading font-bold text-xs sm:text-[13px] text-gray-900 leading-tight">
                          {c.count} <span className="text-[10px] font-normal text-gray-500">visitors</span>
                        </p>
                        <p className="text-[11px] sm:text-xs font-bold text-gold-dark leading-tight mt-0.5">
                          {c.pct} <span className="text-[9.5px] font-normal text-gray-400">share</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Bottom Footer */}
            <div className="pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-subheading text-gray-500">
                Showing <span className="font-bold text-gray-800">{allCountriesData.length} countries</span> tracked worldwide
              </span>
              <button
                onClick={() => {
                  setShowAllCountriesModal(false);
                  setCountrySearchQuery("");
                }}
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-heading font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          7. ALL TOP PAGES MODAL (Ultra-Clean, High-Density, Spacious Modal)
          ═════════════════════════════════════════════════════════════════ */}
      {showAllPagesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 max-w-3xl lg:max-w-4xl w-full shadow-2xl space-y-3 sm:space-y-3.5 border border-gray-100 max-h-[88vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark shrink-0 shadow-2xs">
                  <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
                    All Top Pages Performance
                  </h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 font-subheading">
                    Detailed page views and traffic distribution across website
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAllPagesModal(false);
                  setPageSearchQuery("");
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pageSearchQuery}
                onChange={(e) => setPageSearchQuery(e.target.value)}
                placeholder="Search page name or URL path (e.g. Products, About, Contact)..."
                className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 text-xs font-subheading font-medium text-gray-900 placeholder:text-gray-400 focus:outline-hidden focus:border-gold-main focus:bg-white transition-all"
              />
            </div>

            {/* Pages List (Compact High-Density Rows) */}
            <div className="overflow-y-auto flex-1 space-y-1 sm:space-y-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-0.5">
              {allPagesData
                .filter(
                  (p) =>
                    p.label.toLowerCase().includes(pageSearchQuery.toLowerCase()) ||
                    p.path.toLowerCase().includes(pageSearchQuery.toLowerCase())
                )
                .map((page, idx) => (
                  <div
                    key={idx}
                    className="py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-lg sm:rounded-xl bg-gray-50/70 hover:bg-[#fdfaf0]/80 border border-gray-100 hover:border-gold-main/30 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-150"
                  >
                    {/* Page Label & Route */}
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <span
                        className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center font-heading text-[10.5px] sm:text-[11px] font-bold shrink-0 ${
                          idx === 0
                            ? "bg-amber-100 text-gold-dark font-extrabold"
                            : idx === 1
                              ? "bg-gray-200 text-gray-700 font-extrabold"
                              : idx === 2
                                ? "bg-amber-50 text-amber-800"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-heading font-bold text-xs sm:text-[13px] text-gray-900 truncate leading-snug">
                          {page.label}
                        </p>
                        <p className="text-[10.5px] text-gray-500 font-mono truncate leading-tight mt-0.5">
                          {page.path}
                        </p>
                      </div>
                    </div>

                    {/* Page Views, Share & Progress Bar */}
                    <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-right">
                      {/* Mini Visual Progress Bar */}
                      <div className="hidden sm:flex flex-col items-end gap-0.5 w-16 sm:w-24">
                        <div className="w-full bg-gray-200/80 rounded-full h-1 sm:h-1.5 overflow-hidden">
                          <div
                            className="bg-gold-main h-full rounded-full transition-all duration-500"
                            style={{ width: page.pct }}
                          />
                        </div>
                      </div>

                      <div className="min-w-[72px] sm:min-w-[82px] text-right">
                        <p className="font-heading font-bold text-xs sm:text-[13px] text-gray-900 leading-tight">
                          {page.views} <span className="text-[10px] font-normal text-gray-500">views</span>
                        </p>
                        <p className="text-[11px] sm:text-xs font-bold text-gold-dark leading-tight mt-0.5">
                          {page.pct} <span className="text-[9.5px] font-normal text-gray-400">traffic</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Bottom Footer */}
            <div className="pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-subheading text-gray-500">
                Showing <span className="font-bold text-gray-800">{allPagesData.length} active pages</span>
              </span>
              <button
                onClick={() => {
                  setShowAllPagesModal(false);
                  setPageSearchQuery("");
                }}
                className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white font-heading font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
