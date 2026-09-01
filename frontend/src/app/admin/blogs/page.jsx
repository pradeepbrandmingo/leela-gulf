"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { apiRequest } from "@/config/api";
import { BLOGS_DATA } from "@/data/blogsData";
import {
  FileText,
  Search,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  X,
  Eye,
  Trash2,
  Edit3,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Tag,
  Loader2,
  ExternalLink,
} from "lucide-react";

// Standard Blog Categories
export const BLOG_CATEGORIES = [
  "All Categories",
  "Compliance",
  "Quality",
  "Industry Insights",
  "Regulations",
  "Technology",
  "Events",
  "Sustainability",
  "Safety",
  "Supply Chain",
  "Leela Gulf Updates",
];

// Helper Date Formatters
const formatDateShort = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatDateNumeric = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Date Range Text Formatter
const getDateRangeText = (filterType, customStart, customEnd) => {
  const today = new Date();

  if (filterType === "Custom" && customStart && customEnd) {
    return `${formatDateShort(customStart)} - ${formatDateShort(customEnd)}`;
  }

  if (filterType === "Today") {
    return formatDateShort(today);
  }

  if (filterType === "Yesterday") {
    const yest = new Date(today);
    yest.setDate(today.getDate() - 1);
    return formatDateShort(yest);
  }

  if (filterType === "Last 7 days") {
    const past7 = new Date(today);
    past7.setDate(today.getDate() - 6);
    return `${formatDateShort(past7)} - ${formatDateShort(today)}`;
  }

  if (filterType === "Last 30 days") {
    const past30 = new Date(today);
    past30.setDate(today.getDate() - 29);
    return `${formatDateShort(past30)} - ${formatDateShort(today)}`;
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

// Date Range Evaluator Helper
const isDateInSelectedRange = (dateStr, filterOption, customStart, customEnd) => {
  if (!filterOption || filterOption === "All Time") return true;
  if (!dateStr) return false;

  const itemDate = new Date(dateStr);
  if (isNaN(itemDate.getTime())) return true;

  const now = new Date();

  if (filterOption === "Today") {
    return (
      itemDate.getDate() === now.getDate() &&
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  }

  if (filterOption === "Yesterday") {
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    return (
      itemDate.getDate() === yest.getDate() &&
      itemDate.getMonth() === yest.getMonth() &&
      itemDate.getFullYear() === yest.getFullYear()
    );
  }

  if (filterOption === "Last 7 days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return itemDate >= start;
  }

  if (filterOption === "Last 30 days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return itemDate >= start;
  }

  if (filterOption === "This Month") {
    return (
      itemDate.getMonth() === now.getMonth() &&
      itemDate.getFullYear() === now.getFullYear()
    );
  }

  if (filterOption === "Last Month") {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return (
      itemDate.getMonth() === lastMonth.getMonth() &&
      itemDate.getFullYear() === lastMonth.getFullYear()
    );
  }

  if (filterOption === "Custom") {
    if (!customStart || !customEnd) return true;
    const start = new Date(customStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);
    return itemDate >= start && itemDate <= end;
  }

  return true;
};

export default function AdminBlogsPage() {
  // State for Blogs List
  const [blogsList, setBlogsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Search & Filter Controls State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // UI Dropdown Toggles
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Selection State
  const [selectedBlogs, setSelectedBlogs] = useState([]);

  // Modals & Action States
  const [selectedBlogModal, setSelectedBlogModal] = useState(null);
  const [deleteConfirmBlog, setDeleteConfirmBlog] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Refs for outside click handling
  const categoryRef = useRef(null);
  const statusRef = useRef(null);
  const timeRangeRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setIsStatusOpen(false);
      }
      if (timeRangeRef.current && !timeRangeRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Blogs from Backend API (MongoDB)
  async function loadBlogs() {
    setIsLoading(true);
    try {
      const res = await apiRequest("/blogs", { method: "GET" });
      if (res?.success && Array.isArray(res?.data)) {
        setBlogsList(res.data);
      } else {
        setBlogsList([]);
      }
    } catch (err) {
      console.warn("Backend /api/blogs notice:", err?.message);
      setBlogsList([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  // Date Filter Selection
  const handleSelectFilter = (opt) => {
    setSelectedFilterOption(opt.value);
    if (opt.value === "Custom") {
      setShowCustomModal(true);
      setShowFilterDropdown(false);
      return;
    }
    setDateRangeText(getDateRangeText(opt.value));
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const handleApplyCustomDate = () => {
    setSelectedFilterOption("Custom");
    setDateRangeText(getDateRangeText("Custom", customStartDate, customEndDate));
    setShowCustomModal(false);
    setCurrentPage(1);
  };

  // Dynamic Category Options computed from active MongoDB blogs
  const availableCategories = useMemo(() => {
    const baseList = [
      "All Categories",
      "Compliance",
      "Quality",
      "Industry Insights",
      "Regulations",
      "Technology",
      "Events",
      "Sustainability",
      "Safety",
      "Supply Chain",
      "Leela Gulf Updates",
      "General",
    ];
    const unique = new Set(baseList);
    blogsList.forEach((b) => {
      if (b?.category) unique.add(b.category.trim());
      if (Array.isArray(b?.categories)) {
        b.categories.forEach((c) => c && unique.add(c.trim()));
      }
    });
    return Array.from(unique);
  }, [blogsList]);

  // Filter Blogs based on Multi-Field Search, Category, Status, and Date Range
  const filteredBlogs = useMemo(() => {
    return blogsList.filter((blog) => {
      // 1. Multi-Field Real-Time Search (Title, Arabic Title, Slug, Category, Tags, Excerpt, Author, Content, Status)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch =
          (blog.title || "").toLowerCase().includes(query) ||
          (blog.en?.title || "").toLowerCase().includes(query) ||
          (blog.titleAr || "").toLowerCase().includes(query) ||
          (blog.ar?.title || "").toLowerCase().includes(query);
        const slugMatch = (blog.slug || "").toLowerCase().includes(query);
        const categoryMatch =
          (blog.category || "").toLowerCase().includes(query) ||
          (blog.en?.category || "").toLowerCase().includes(query) ||
          (blog.categoryAr || "").toLowerCase().includes(query) ||
          (blog.ar?.category || "").toLowerCase().includes(query);
        const excerptMatch =
          (blog.excerpt || "").toLowerCase().includes(query) ||
          (blog.en?.excerpt || "").toLowerCase().includes(query) ||
          (blog.excerptAr || "").toLowerCase().includes(query) ||
          (blog.ar?.excerpt || "").toLowerCase().includes(query);
        const authorMatch =
          (blog.author || "").toLowerCase().includes(query) ||
          (blog.en?.author || "").toLowerCase().includes(query) ||
          (blog.authorAr || "").toLowerCase().includes(query) ||
          (blog.ar?.author || "").toLowerCase().includes(query);
        const contentMatch =
          (blog.content || "").toLowerCase().includes(query) ||
          (blog.en?.content || "").toLowerCase().includes(query) ||
          (blog.ar?.content || "").toLowerCase().includes(query);
        const statusMatch = (blog.status || "").toLowerCase().includes(query);

        // Tags matching from root categories and nested en/ar categories
        const allTags = [
          ...(Array.isArray(blog.categories) ? blog.categories : []),
          ...(Array.isArray(blog.en?.categories) ? blog.en.categories : []),
          ...(Array.isArray(blog.ar?.categories) ? blog.ar.categories : []),
        ];
        const tagsMatch = allTags.some((c) => typeof c === "string" && c.toLowerCase().includes(query));

        if (
          !titleMatch &&
          !slugMatch &&
          !categoryMatch &&
          !excerptMatch &&
          !authorMatch &&
          !contentMatch &&
          !statusMatch &&
          !tagsMatch
        ) {
          return false;
        }
      }

      // 2. Category Filter (Matches primary category or any tag)
      if (selectedCategory !== "All Categories") {
        const catLower = selectedCategory.toLowerCase().trim();
        const primaryMatch =
          (blog.category || "").toLowerCase().trim() === catLower ||
          (blog.en?.category || "").toLowerCase().trim() === catLower ||
          (blog.categoryAr || "").toLowerCase().trim() === catLower ||
          (blog.ar?.category || "").toLowerCase().trim() === catLower;
        const allTags = [
          ...(Array.isArray(blog.categories) ? blog.categories : []),
          ...(Array.isArray(blog.en?.categories) ? blog.en.categories : []),
          ...(Array.isArray(blog.ar?.categories) ? blog.ar.categories : []),
        ];
        const arrayMatch = allTags.some((c) => typeof c === "string" && c.toLowerCase().trim() === catLower);
        if (!primaryMatch && !arrayMatch) {
          return false;
        }
      }

      // 3. Status Filter (Published | Draft)
      if (selectedStatus !== "All Status") {
        if ((blog.status || "Published").toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // 4. Date Range Filter
      const blogDate = blog.createdAt || blog.date;
      if (!isDateInSelectedRange(blogDate, selectedFilterOption, customStartDate, customEndDate)) {
        return false;
      }

      return true;
    });
  }, [blogsList, searchQuery, selectedCategory, selectedStatus, selectedFilterOption, customStartDate, customEndDate]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  // Reset all filters handler
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedStatus("All Status");
    setSelectedFilterOption("All Time");
    setDateRangeText("All Time");
    setCurrentPage(1);
  };

  // Delete Blog Handler
  const handleDeleteBlog = async (id) => {
    setIsDeleting(true);
    try {
      const res = await apiRequest(`/blogs/${id}`, { method: "DELETE" });
      if (res?.success) {
        setToastMsg("Blog post deleted successfully!");
        setBlogsList((prev) => prev.filter((b) => b._id !== id));
        setTimeout(() => setToastMsg(""), 3500);
      } else {
        throw new Error(res?.message || "Failed to delete blog");
      }
    } catch (err) {
      console.log("Backend delete error:", err);
      setBlogsList((prev) => prev.filter((b) => b._id !== id));
      setToastMsg("Blog post removed!");
      setTimeout(() => setToastMsg(""), 3500);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmBlog(null);
      if (selectedBlogModal && selectedBlogModal._id === id) {
        setSelectedBlogModal(null);
      }
    }
  };

  // Checkbox Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedBlogs(paginatedBlogs.map((b) => b._id));
    } else {
      setSelectedBlogs([]);
    }
  };

  const handleSelectBlog = (id) => {
    if (selectedBlogs.includes(id)) {
      setSelectedBlogs(selectedBlogs.filter((bId) => bId !== id));
    } else {
      setSelectedBlogs([...selectedBlogs, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBlogs.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedBlogs.length} selected blog(s)?`)) return;

    setIsDeleting(true);
    try {
      await Promise.allSettled(
        selectedBlogs.map((id) => apiRequest(`/blogs/${id}`, { method: "DELETE" }))
      );
      setBlogsList((prev) => prev.filter((b) => !selectedBlogs.includes(b._id)));
      setSelectedBlogs([]);
      setToastMsg(`${selectedBlogs.length} blog post(s) deleted successfully!`);
      setTimeout(() => setToastMsg(""), 3500);
    } catch (err) {
      console.error("Bulk delete error:", err);
      setBlogsList((prev) => prev.filter((b) => !selectedBlogs.includes(b._id)));
      setSelectedBlogs([]);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All Categories" ||
    selectedStatus !== "All Status" ||
    selectedFilterOption !== "All Time";

  // Category Color Badges Mapping
  const getCategoryBadgeClass = (cat) => {
    const c = (cat || "").toLowerCase();
    if (c.includes("sustainab")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (c.includes("trend") || c.includes("insight")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (c.includes("safety")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (c.includes("innovat")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (c.includes("business")) return "bg-cyan-50 text-cyan-700 border-cyan-200";
    if (c.includes("supply")) return "bg-rose-50 text-rose-700 border-rose-200";
    if (c.includes("quality")) return "bg-teal-50 text-teal-700 border-teal-200";
    if (c.includes("compliance")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    return "bg-gold-main/10 text-gold-dark border-gold-main/30";
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* ── 1. TOP BREADCRUMB & TIME RANGE FILTER (Matches Screenshot 2) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-gold-dark transition-colors">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-bold">Blogs</span>
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-gray-900 tracking-tight">
            Blogs Management
          </h1>
        </div>

        {/* Right Date Selector Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative" ref={timeRangeRef}>
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-semibold text-gray-700 shadow-2xs transition-all duration-200 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-dark" />
              <span>{dateRangeText}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                  showFilterDropdown ? "rotate-180 text-gold-dark" : ""
                }`}
              />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
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
                    className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
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
        </div>
      </div>

      {/* ── 2. HERO BANNER: ALL BLOGS & ACTIONS ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-lg font-heading font-extrabold text-gray-900">
              All Blogs
            </h2>
            <span className="bg-[#fdfaf0] text-gold-dark text-xs font-heading font-extrabold px-2.5 py-0.5 rounded-full border border-gold-main/30">
              {filteredBlogs.length} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            Manage, filter, and organize all published and draft articles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs/add"
            className="px-5 py-2.5 bg-[#d6b92a] hover:bg-gold-dark text-black hover:text-white rounded-xl font-heading font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Blog</span>
          </Link>
        </div>
      </div>

      {/* ── 3. SEARCH & FILTER CONTROLS BAR ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by blog title, keyword, or excerpt..."
            className="w-full pl-9 pr-3.5 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:flex-initial" ref={categoryRef}>
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-gold-main hover:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span className="truncate max-w-[130px]">{selectedCategory}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${
                  isCategoryOpen ? "rotate-180 text-gold-dark" : ""
                }`}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1.5 space-y-0.5 [scrollbar-width:thin] animate-[fadeIn_0.15s_ease-out]">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#fdfaf0] text-gold-dark font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative flex-1 sm:flex-initial" ref={statusRef}>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-gold-main hover:bg-white shadow-2xs transition-all cursor-pointer"
            >
              <span>{selectedStatus}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                  isStatusOpen ? "rotate-180 text-gold-dark" : ""
                }`}
              />
            </button>

            {isStatusOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-1.5 space-y-0.5 animate-[fadeIn_0.15s_ease-out]">
                {["All Status", "Published", "Draft"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setSelectedStatus(st);
                      setIsStatusOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                      selectedStatus === st
                        ? "bg-[#fdfaf0] text-gold-dark font-bold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{st}</span>
                    {selectedStatus === st && <Check className="w-3.5 h-3.5 text-gold-dark" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 4. BULK ACTION BAR ── */}
      {selectedBlogs.length > 0 && (
        <div className="bg-[#11131a] text-white px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg animate-[fadeIn_0.15s_ease-out]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-main animate-pulse" />
            <span className="text-xs font-bold">
              {selectedBlogs.length} blog post(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={() => setSelectedBlogs([])}
              className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── 5. NOTIFICATION TOAST ── */}
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── 6. BLOGS TABLE (Matches Screenshot 2) ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full text-left border-collapse text-xs">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-50/90 border-b border-gray-200 text-[11px] font-heading font-extrabold text-gray-600 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      paginatedBlogs.length > 0 &&
                      paginatedBlogs.every((b) => selectedBlogs.includes(b._id))
                    }
                    className="w-3.5 h-3.5 rounded border-gray-300 text-gold-main focus:ring-gold-main cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 min-w-[280px]">Blog Title</th>
                <th className="py-3 px-3 min-w-[130px]">Category</th>
                <th className="py-3 px-3 min-w-[100px]">Status</th>
                <th className="py-3 px-3 min-w-[130px]">Published On</th>
                <th className="py-3 px-3 min-w-[90px]">Views</th>
                <th className="py-3 px-3 w-28 text-right pr-4">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin text-gold-main mx-auto mb-2" />
                    <span>Loading blogs list...</span>
                  </td>
                </tr>
              ) : paginatedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="font-heading font-bold text-sm text-gray-600">No blog posts found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {hasActiveFilters ? "Try clearing search or filters." : "Click '+ Add New Blog' to create your first article."}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedBlogs.map((blog) => {
                  const isSelected = selectedBlogs.includes(blog._id);
                  const badgeStyle = getCategoryBadgeClass(blog.category);

                  return (
                    <tr
                      key={blog._id}
                      className={`hover:bg-[#fdfaf0]/40 transition-colors group ${
                        isSelected ? "bg-[#fdfaf0]/70" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectBlog(blog._id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-gold-main focus:ring-gold-main cursor-pointer"
                        />
                      </td>

                      {/* Title & Image Preview */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative">
                            {blog.image ? (
                              <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FileText className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-heading font-bold text-xs text-gray-900 group-hover:text-gold-dark transition-colors line-clamp-1">
                              {blog.title}
                            </h3>
                            {blog.excerpt && (
                              <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                                {blog.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-heading font-bold border ${badgeStyle}`}
                        >
                          {blog.category || "General"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {blog.status === "Published" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Published Date */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-gray-600 text-[11px]">
                        {blog.date || (blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—")}
                      </td>

                      {/* Views */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-gray-600 text-[11px]">
                        {typeof blog.views === "number" ? blog.views.toLocaleString() : (blog.views || "0")}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right pr-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick View Modal Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedBlogModal(blog)}
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Preview Blog Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Page Link */}
                          <Link
                            href={`/admin/blogs/edit/${blog._id}`}
                            className="p-1.5 text-gray-400 hover:text-gold-dark hover:bg-gold-main/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Blog"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmBlog(blog)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Blog"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* ── 7. PRODUCTION-READY PAGINATION FOOTER (Matches Screenshot 4) ── */}
        <div className="py-3 px-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div>
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredBlogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-900">
              {Math.min(currentPage * itemsPerPage, filteredBlogs.length)}
            </span>{" "}
            of <span className="font-bold text-gray-900">{filteredBlogs.length}</span> blogs
          </div>

          <div className="flex items-center gap-4">
            {/* Items Per Page Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-gold-main transition-colors shadow-2xs cursor-pointer"
              >
                <span>{itemsPerPage} per page</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {showPerPageDropdown && (
                <div className="absolute right-0 bottom-full mb-1.5 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-40 animate-[fadeIn_0.15s_ease-out]">
                  {[5, 10, 25, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1);
                        setShowPerPageDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between cursor-pointer ${
                        itemsPerPage === num
                          ? "bg-[#fdfaf0] text-gold-dark font-bold"
                          : "text-gray-700 hover:bg-gray-50 font-medium"
                      }`}
                    >
                      <span>{num} per page</span>
                      {itemsPerPage === num && <Check className="w-3 h-3 text-gold-dark" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Page Navigation Buttons (|< < 1 2 3 > >|) */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors font-bold text-xs shadow-2xs cursor-pointer"
                title="First Page"
              >
                |&lt;
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors shadow-2xs cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#0a0a0a] text-gold-main font-extrabold border border-gold-main/40"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors shadow-2xs cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages || totalPages === 0}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors font-bold text-xs shadow-2xs cursor-pointer"
                title="Last Page"
              >
                &gt;|
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8. CUSTOM DATE RANGE MODAL (Matches Screenshot 3) ── */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gold-main/30 space-y-4 relative">
            <button
              onClick={() => setShowCustomModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-heading font-extrabold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-dark" />
              <span>Select Custom Date Range</span>
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-semibold focus:outline-none focus:border-gold-main"
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
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-semibold focus:outline-none focus:border-gold-main"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustomDate}
                className="px-4 py-2 bg-black text-gold-main rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors shadow-xs cursor-pointer"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. QUICK PREVIEW MODAL ── */}
      {selectedBlogModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gold-main/30 space-y-4 max-h-[90vh] overflow-y-auto [scrollbar-width:thin]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-dark" />
                <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                  Blog Preview
                </h3>
              </div>
              <button
                onClick={() => setSelectedBlogModal(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Image */}
            {selectedBlogModal.image && (
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                <img
                  src={selectedBlogModal.image}
                  alt={selectedBlogModal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Blog Title & Excerpt */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-heading font-bold border ${getCategoryBadgeClass(
                    selectedBlogModal.category
                  )}`}
                >
                  {selectedBlogModal.category}
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-xs text-gray-500 font-mono">
                  {selectedBlogModal.date || "20 May 2026"}
                </span>
              </div>

              <h2 className="text-base font-heading font-extrabold text-gray-900 leading-tight">
                {selectedBlogModal.title}
              </h2>
              {selectedBlogModal.titleAr && (
                <p className="text-xs font-heading font-semibold text-gray-600 mt-1 text-right" dir="rtl">
                  {selectedBlogModal.titleAr}
                </p>
              )}

              {selectedBlogModal.excerpt && (
                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {selectedBlogModal.excerpt}
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <Link
                href={`/knowledge-center/${selectedBlogModal.slug || selectedBlogModal._id}`}
                target="_blank"
                className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-heading font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live Article</span>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/blogs/edit/${selectedBlogModal._id}`}
                  className="px-4 py-2 bg-black hover:bg-gray-900 text-gold-main rounded-xl text-xs font-heading font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Article</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 10. DELETE CONFIRMATION MODAL ── */}
      {deleteConfirmBlog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-heading font-extrabold text-base text-gray-900">
                Delete Blog Post?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to permanently delete{" "}
                <span className="font-bold text-gray-900 block truncate mt-0.5">
                  "{deleteConfirmBlog.title}"
                </span>
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmBlog(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-heading font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteBlog(deleteConfirmBlog._id)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
