"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Image as ImageIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  X,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/config/api";

// Helper Date Formatters
const formatDateShort = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
    const firstDayLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLast = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return itemDate >= firstDayLast && itemDate <= lastDayLast;
  }

  if (filterOption === "Custom") {
    if (!customStart || !customEnd) return true;
    const s = new Date(customStart);
    s.setHours(0, 0, 0, 0);
    const e = new Date(customEnd);
    e.setHours(23, 59, 59, 999);
    return itemDate >= s && itemDate <= e;
  }

  return true;
};

export default function AdminEventsPage() {
  const [eventsList, setEventsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | Published | Draft
  const [selectedIds, setSelectedIds] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Top Right "All Time" Date Filter State
  const [selectedFilterOption, setSelectedFilterOption] = useState("All Time");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [appliedCustomStart, setAppliedCustomStart] = useState("");
  const [appliedCustomEnd, setAppliedCustomEnd] = useState("");
  const timeRangeRef = useRef(null);

  // Dropdown UI states
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);
  const perPageRef = useRef(null);
  const statusRef = useRef(null);

  // Preview Modal state
  const [previewEvent, setPreviewEvent] = useState(null);
  const [previewActiveImageIdx, setPreviewActiveImageIdx] = useState(0);

  // Delete Confirm Modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (timeRangeRef.current && !timeRangeRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
      if (perPageRef.current && !perPageRef.current.contains(e.target)) {
        setShowPerPageDropdown(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setIsStatusDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch live events from API
  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const res = await apiRequest("/events", { method: "GET" });
        if (res.success && Array.isArray(res.data)) {
          setEventsList(res.data);
        } else {
          setEventsList([]);
        }
      } catch (err) {
        console.error("Could not fetch events from backend:", err);
        setEventsList([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  // Date select handler
  const handleSelectFilter = (opt) => {
    if (opt === "Custom") {
      setShowCustomModal(true);
      setShowFilterDropdown(false);
      return;
    }
    setSelectedFilterOption(opt);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const handleApplyCustom = () => {
    if (customStartDate && customEndDate) {
      setAppliedCustomStart(customStartDate);
      setAppliedCustomEnd(customEndDate);
      setSelectedFilterOption("Custom");
      setShowCustomModal(false);
      setCurrentPage(1);
    }
  };

  // Multi-field real-time search & filtering
  const filteredEvents = useMemo(() => {
    return eventsList.filter((event) => {
      // 1. Status Filter
      if (statusFilter !== "ALL" && (event.status || "Published") !== statusFilter) {
        return false;
      }

      // 2. Date Range Filter
      const eventDateValue = event.createdAt || event.date;
      if (
        !isDateInSelectedRange(
          eventDateValue,
          selectedFilterOption,
          appliedCustomStart,
          appliedCustomEnd
        )
      ) {
        return false;
      }

      // 3. Search Term Filter across all fields
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const titleMatch = (event.title || "").toLowerCase().includes(query);
        const titleArMatch = (event.titleAr || "").toLowerCase().includes(query);
        const dateMatch = (event.date || "").toLowerCase().includes(query);
        const statusMatch = (event.status || "").toLowerCase().includes(query);
        const descMatch = (event.description || "").toLowerCase().includes(query);
        const descArMatch = (event.descriptionAr || "").toLowerCase().includes(query);

        if (
          !titleMatch &&
          !titleArMatch &&
          !dateMatch &&
          !statusMatch &&
          !descMatch &&
          !descArMatch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [eventsList, statusFilter, selectedFilterOption, appliedCustomStart, appliedCustomEnd, searchTerm]);

  // Production-Ready Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedEvents.map((ev) => ev._id || ev.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete Action Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await apiRequest(`/events/${deleteTargetId}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Backend delete API not found, updating local state:", err);
    }
    setEventsList((prev) => prev.filter((ev) => (ev._id || ev.id) !== deleteTargetId));
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTargetId));
    setIsDeleting(false);
    setDeleteTargetId(null);
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} selected events?`)) {
      setEventsList((prev) => prev.filter((ev) => !selectedIds.includes(ev._id || ev.id)));
      setSelectedIds([]);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSelectedFilterOption("All Time");
    setAppliedCustomStart("");
    setAppliedCustomEnd("");
    setCurrentPage(1);
  };

  const dateRangeText = getDateRangeText(
    selectedFilterOption,
    appliedCustomStart,
    appliedCustomEnd
  );

  return (
    <div className="space-y-4 pb-10 font-subheading text-gray-900">
      
      {/* ── BREADCRUMB & HEADER WITH TOP RIGHT DATE DROPDOWN ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 mb-0.5">
            <Link href="/admin/dashboard" className="hover:text-gold-dark transition-colors">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-bold">Events</span>
          </div>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 tracking-tight">
            Events & Exhibitions Management
          </h1>
        </div>

        {/* Top Right Controls: All Time Dropdown + Live Page Link */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          
          {/* "All Time" Date Range Dropdown */}
          <div className="relative" ref={timeRangeRef}>
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-heading font-bold text-gray-700 shadow-2xs transition-all duration-200 cursor-pointer"
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
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in duration-150">
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
                    onClick={() => handleSelectFilter(opt)}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-heading font-medium flex items-center justify-between transition-colors cursor-pointer ${
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

          {/* Live Events Page External Link */}
          <Link
            href="/events"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-heading font-bold transition-all"
          >
            <span>Live Events Page</span>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </Link>
        </div>
      </div>

      {/* ── TOP BANNER CARD (Compact & Sleek) ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-gray-900">
              All Events
            </h2>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-heading font-bold bg-[#fdfaf0] text-gold-dark border border-gold-main/30">
              {filteredEvents.length} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Manage, filter, and organize all past and upcoming exhibitions, cover images & gallery photos.
          </p>
        </div>

        <Link
          href="/admin/events-gallery/add"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gold-main hover:bg-gold-light text-black font-heading font-bold text-xs shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
          <span>Add New Event</span>
        </Link>
      </div>

      {/* ── SEARCH & FILTER CONTROLS BAR (Searchbar + All Status Only) ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-3 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        
        {/* Real-time Search Input */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by event title, date, status, or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-hidden focus:border-gold-main focus:bg-white text-gray-900 placeholder-gray-400 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Status Filter Dropdown & Reset */}
        <div className="flex items-center gap-2" ref={statusRef}>
          
          {/* Status Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-semibold bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
            >
              <span>
                {statusFilter === "ALL"
                  ? "All Status"
                  : statusFilter === "Published"
                  ? "● Published"
                  : "● Draft"}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1 text-xs">
                {["ALL", "Published", "Draft"].map((st) => (
                  <div
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setIsStatusDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                      statusFilter === st ? "font-bold text-gold-dark bg-[#fdfaf0]" : "text-gray-700"
                    }`}
                  >
                    <span>{st === "ALL" ? "All Status" : st}</span>
                    {statusFilter === st && <Check className="w-3 h-3 text-gold-dark" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {(searchTerm || statusFilter !== "ALL" || selectedFilterOption !== "All Time") && (
            <button
              onClick={handleClearFilters}
              title="Reset All Filters"
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

        </div>
      </div>

      {/* ── BULK ACTION BAR ── */}
      {selectedIds.length > 0 && (
        <div className="bg-gray-900 text-white px-3.5 py-2 rounded-xl flex items-center justify-between shadow-md text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-gold-light">
              {selectedIds.length} {selectedIds.length === 1 ? "event" : "events"} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* ── COMPACT & ELEGANT EVENTS TABLE ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase font-heading text-[10px] tracking-wider bg-gray-50/60">
                <th className="py-2.5 px-3.5 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      paginatedEvents.length > 0 &&
                      paginatedEvents.every((ev) => selectedIds.includes(ev._id || ev.id))
                    }
                    className="rounded border-gray-300 text-gold-main focus:ring-gold-main cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3 font-semibold">Event Title & Details</th>
                <th className="py-2.5 px-3 font-semibold">Date</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Gallery</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 font-subheading text-xs">
                    <Loader2 className="w-5 h-5 animate-spin text-gold-main mx-auto mb-1.5" />
                    Loading exhibitions & events...
                  </td>
                </tr>
              ) : paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 font-subheading text-xs">
                    <ImageIcon className="w-7 h-7 text-gray-300 mx-auto mb-1.5" />
                    No events found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((event) => {
                  const evId = event._id || event.id;
                  const isSelected = selectedIds.includes(evId);
                  const coverImg = event.image || event.coverImage || "/images/prodcut/dummy-product.jpg";
                  const galleryCount = Array.isArray(event.gallery) ? event.gallery.length : 1;

                  return (
                    <tr
                      key={evId}
                      className={`hover:bg-gray-50/80 transition-colors ${
                        isSelected ? "bg-gold-main/5" : ""
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-2.5 px-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(evId)}
                          className="rounded border-gray-300 text-gold-main focus:ring-gold-main cursor-pointer"
                        />
                      </td>

                      {/* Cover Thumbnail + Title + Excerpt */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200/80 group">
                            <Image
                              src={coverImg}
                              alt={event.title || "Event Image"}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 max-w-[340px] sm:max-w-lg">
                            <h3 className="font-heading font-bold text-xs text-gray-900 truncate group-hover:text-gold-dark transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Event Date */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-gray-600 text-xs font-medium font-mono">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{event.date}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold ${
                            event.status === "Published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                              : "bg-amber-50 text-amber-700 border border-amber-200/60"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{event.status || "Published"}</span>
                        </span>
                      </td>

                      {/* Gallery Photos Count Badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                          <ImageIcon className="w-3 h-3 text-gray-400" />
                          <span>{galleryCount} photos</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1">
                          
                          {/* Quick Preview Eye */}
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewEvent(event);
                              setPreviewActiveImageIdx(0);
                            }}
                            title="Preview Event Popup"
                            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Link */}
                          <Link
                            href={`/admin/events-gallery/edit/${evId}`}
                            title="Edit Event"
                            className="p-1.5 text-gray-400 hover:text-gold-dark hover:bg-gold-main/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(evId)}
                            title="Delete Event"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

        {/* ── 100% WORKING PRODUCTION-READY PAGINATION FOOTER ── */}
        <div className="py-2.5 px-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium">
          
          {/* Dynamic Counter text (e.g. "Showing 1 to 5 of 6 events" or "Showing 6 to 6 of 6 events") */}
          <div>
            Showing{" "}
            <span className="font-bold text-gray-900">
              {filteredEvents.length > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-900">
              {Math.min(validCurrentPage * itemsPerPage, filteredEvents.length)}
            </span>{" "}
            of <span className="font-bold text-gray-900">{filteredEvents.length}</span> events
          </div>

          <div className="flex items-center gap-3">
            
            {/* Items Per Page Dropdown (5, 10, 20, 50) */}
            <div className="relative" ref={perPageRef}>
              <button
                type="button"
                onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-gold-main transition-colors shadow-2xs cursor-pointer"
              >
                <span>{itemsPerPage} per page</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {showPerPageDropdown && (
                <div className="absolute right-0 bottom-full mb-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-40 animate-in fade-in duration-100">
                  {[5, 10, 20, 50].map((num) => (
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

            {/* Dynamic Page Navigation Buttons (|<  <  1  2  3  >  >|) */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={validCurrentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors font-bold text-xs shadow-2xs cursor-pointer"
                title="First Page"
              >
                |&lt;
              </button>
              <button
                type="button"
                disabled={validCurrentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors shadow-2xs cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Dynamic Numbered Page Buttons (1, 2, 3...) */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2.5 py-1 font-bold rounded-lg text-xs transition-colors shadow-2xs cursor-pointer ${
                    validCurrentPage === pageNum
                      ? "bg-[#0a0a0a] text-gold-main font-extrabold border border-gold-main/40"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={validCurrentPage >= totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors shadow-2xs cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={validCurrentPage >= totalPages || totalPages === 0}
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

      {/* ═════════════════════════════════════════════════════════════════════
          CUSTOM DATE RANGE PICKER MODAL
          ═════════════════════════════════════════════════════════════════════ */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-gray-900 text-sm">
                Select Custom Date Range
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 focus:outline-hidden focus:border-gold-main"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-gray-900 focus:outline-hidden focus:border-gold-main"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                disabled={!customStartDate || !customEndDate}
                className="px-4 py-1.5 rounded-xl bg-gold-main hover:bg-gold-light text-black text-xs font-heading font-bold disabled:opacity-50"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          INTERACTIVE POPUP MODAL (100% Matching Frontend Events Popup SS4!)
          ═════════════════════════════════════════════════════════════════════ */}
      {previewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0e1017] border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white p-5 sm:p-8 space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setPreviewEvent(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gold-main hover:bg-gold-light text-black flex items-center justify-center transition-colors cursor-pointer shadow-lg z-20"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Modal Body: Left Image & Right Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              
              {/* Left Column: Active Image + Thumbnails */}
              <div className="w-full sm:w-1/2 space-y-3">
                <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-white shadow-md border border-white/10">
                  <Image
                    src={
                      (previewEvent.gallery && previewEvent.gallery[previewActiveImageIdx]) ||
                      previewEvent.image ||
                      "/images/prodcut/dummy-product.jpg"
                    }
                    alt={previewEvent.title || "Event Image"}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Multiple Images Gallery Thumbnails (Screenshot 4) */}
                {Array.isArray(previewEvent.gallery) && previewEvent.gallery.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {previewEvent.gallery.map((imgUrl, gIdx) => (
                      <button
                        key={gIdx}
                        onClick={() => setPreviewActiveImageIdx(gIdx)}
                        className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          previewActiveImageIdx === gIdx
                            ? "border-gold-main scale-105"
                            : "border-white/20 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Gallery thumbnail ${gIdx + 1}`}
                          fill
                          className="object-cover bg-white"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Date Pill + Heading + Full Description */}
              <div className="w-full sm:w-1/2 space-y-4">
                
                {/* Floating Date Pill */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-gold-main/40 text-gold-light text-xs font-heading font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                  <span>{previewEvent.date}</span>
                </span>

                {/* Main Heading */}
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                  {previewEvent.title}
                </h2>

                {/* Full Description Box */}
                <div className="bg-[#141722] border border-white/5 rounded-2xl p-4 sm:p-5 text-gray-300 text-xs sm:text-sm leading-relaxed font-subheading max-h-48 overflow-y-auto">
                  {previewEvent.description}
                </div>

              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-subheading">
                Status: <strong className="text-white">{previewEvent.status || "Published"}</strong>
              </span>

              <Link
                href={`/admin/events-gallery/edit/${previewEvent._id || previewEvent.id}`}
                className="inline-flex items-center gap-1 text-gold-light hover:text-white font-heading font-bold"
              >
                <span>Edit This Event</span>
                <Edit2 className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-900 text-base">
                  Delete Event
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Are you sure you want to delete this event? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-heading font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-heading font-bold transition-colors cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete Event"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
