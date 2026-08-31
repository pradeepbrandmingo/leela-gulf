"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { apiRequest } from "@/config/api";
import {
  Package,
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
  FileSpreadsheet,
  FlaskConical,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Tag,
  Building2,
  Layers,
  Loader2
} from "lucide-react";

// Mock Product Dataset (Matches Leela Gulf Production Chemical Catalog)
const INITIAL_PRODUCTS = [
  {
    _id: "prod-001",
    name: "Sodium Lauryl Ether Sulphate (SLES 70%)",
    grade: "Anionic Surfactant",
    casNo: "68585-34-2",
    code: "LGF-CH-0001",
    industries: ["Home Care & Personal Care (LEEPOL®)", "Industrial Chemicals"],
    tags: ["Surfactant", "Cleaning Agents", "Foaming Agent"],
    status: "Published",
    createdAt: "2026-08-25T10:30:00Z",
    description: "High-purity SLES 70% used widely in household detergent formulations, liquid soaps, shampoo, and industrial cleaning preparations.",
    specs: "Active Matter: 70% ± 2%, pH Value: 7.0 - 8.5, Unsulfated Matter: Max 2.5%",
  },
  {
    _id: "prod-002",
    name: "Caustic Soda Flakes 99%",
    grade: "Industrial & Technical Grade",
    casNo: "1310-73-2",
    code: "LGF-CH-0002",
    industries: ["Water Treatment", "Industrial Chemicals"],
    tags: ["pH Adjuster", "Water Treatment", "Alkali"],
    status: "Published",
    createdAt: "2026-08-24T14:15:00Z",
    description: "Premium grade Sodium Hydroxide flakes used in water treatment, chemical synthesis, soap making, and textile processing.",
    specs: "Purity: Min 99.0%, Sodium Carbonate: Max 0.4%, NaCl: Max 0.03%",
  },
  {
    _id: "prod-003",
    name: "Linear Alkyl Benzene Sulphonic Acid (LABSA 96%)",
    grade: "LAB 96%",
    casNo: "27176-87-0",
    code: "LGF-CH-0003",
    industries: ["Home Care & Personal Care (LEEPOL®)"],
    tags: ["Detergent", "Industrial Cleaner", "Anionic"],
    status: "Published",
    createdAt: "2026-08-23T09:00:00Z",
    description: "Main active ingredient for laundry powders and liquid detergents. Outstanding detergency and wetting properties.",
    specs: "Active Matter: Min 96%, Free Acid: Max 1.5%, Water Content: Max 1.0%",
  },
  {
    _id: "prod-004",
    name: "Hydrochloric Acid 33%",
    grade: "Technical / Industrial Grade",
    casNo: "7647-01-0",
    code: "LGF-CH-0004",
    industries: ["Mining & Metals", "Industrial Chemicals"],
    tags: ["Acid", "Chemical Processing", "Pickling Agent"],
    status: "Published",
    createdAt: "2026-08-22T11:45:00Z",
    description: "Strong mineral acid utilized for steel pickling, pH neutralization, boiler descaling, and chemical synthesis.",
    specs: "Concentration: 33% ± 1%, Iron (Fe): Max 0.001%, Heavy Metals: Max 0.0005%",
  },
  {
    _id: "prod-005",
    name: "Soda Ash Light (Sodium Carbonate)",
    grade: "Dense & Light Grade",
    casNo: "497-19-8",
    code: "LGF-CH-0005",
    industries: ["Packaging & Paper pulp industries", "Industrial Chemicals"],
    tags: ["Glass Industry", "Detergent Builder", "pH Control"],
    status: "Published",
    createdAt: "2026-08-21T16:20:00Z",
    description: "Essential raw material for container glass, flat glass, sodium salts, detergent builders, and water treatment.",
    specs: "Na2CO3 Purity: Min 99.2%, NaCl: Max 0.7%, Sulphate (SO4): Max 0.03%",
  },
  {
    _id: "prod-006",
    name: "Mono Propylene Glycol (MPG)",
    grade: "USP & Industrial Grade",
    casNo: "57-55-6",
    code: "LGF-CH-0006",
    industries: ["CASE – Coatings, Adhesives, Sealants & Elastomers"],
    tags: ["Solvent", "Resins", "Humectant"],
    status: "Draft",
    createdAt: "2026-08-20T13:10:00Z",
    description: "Versatile solvent and humectant used in unsaturated polyester resins, paints, coatings, and heat transfer fluids.",
    specs: "Purity: Min 99.8%, Water Content: Max 0.1%, Specific Gravity: 1.035 - 1.037",
  },
  {
    _id: "prod-007",
    name: "Citric Acid Monohydrate",
    grade: "Food & Technical Grade",
    casNo: "5949-29-1",
    code: "LGF-CH-0007",
    industries: ["Food & Beverage chemicals", "Pharmaceuticals API & Excipients"],
    tags: ["Acidulant", "Food Additive", "Preservative"],
    status: "Published",
    createdAt: "2026-08-19T08:50:00Z",
    description: "Natural organic acidulant for beverages, confectionery, citric salts production, and eco-friendly cleaning formulations.",
    specs: "Purity: 99.5% - 100.5%, Moisture: 7.5% - 8.8%, Sulfated Ash: Max 0.05%",
  },
  {
    _id: "prod-008",
    name: "Toluene Technical Grade",
    grade: "Pure Grade 99.9%",
    casNo: "108-88-3",
    code: "LGF-CH-0008",
    industries: ["CASE – Coatings, Adhesives, Sealants & Elastomers"],
    tags: ["Solvent", "Coatings", "Thinners"],
    status: "Published",
    createdAt: "2026-08-18T15:00:00Z",
    description: "Aromatic hydrocarbon solvent for paints, lacquers, adhesives, rubber formulations, and chemical intermediates.",
    specs: "Purity: Min 99.9%, Benzene: Max 100 ppm, Water: Max 0.03%",
  },
  {
    _id: "prod-009",
    name: "Polyanionic Cellulose (PAC LV)",
    grade: "Low Viscosity Drilling Grade",
    casNo: "9004-32-4",
    code: "LGF-CH-0009",
    industries: ["Oil & Gas"],
    tags: ["Fluid Loss Control", "Viscosifier", "Drilling Mud"],
    status: "Published",
    createdAt: "2026-08-17T12:30:00Z",
    description: "High-performance water-soluble polymer providing fluid loss control without significantly increasing viscosity in salt water muds.",
    specs: "Degree of Substitution: Min 0.9, API Spec 13A Compliant, Moisture: Max 10%",
  },
  {
    _id: "prod-010",
    name: "Sodium Hypochlorite 12%",
    grade: "Commercial Disinfectant Grade",
    casNo: "7681-52-9",
    code: "LGF-CH-0010",
    industries: ["Water Treatment"],
    tags: ["Disinfectant", "Bleaching Agent", "Sanitizer"],
    status: "Published",
    createdAt: "2026-08-16T10:15:00Z",
    description: "Effective liquid disinfectant and bleaching agent used in municipal water purification, swimming pools, and industrial hygiene.",
    specs: "Available Chlorine: Min 12.0%, Free Alkali (NaOH): 0.5% - 1.5%",
  },
  {
    _id: "prod-011",
    name: "NPK Granular Compound Component",
    grade: "Agricultural Grade",
    casNo: "66455-26-3",
    code: "LGF-CH-0011",
    industries: ["Fertilizers chemicals"],
    tags: ["Fertilizer", "Nutrients", "Agriculture"],
    status: "Published",
    createdAt: "2026-08-15T09:00:00Z",
    description: "High-efficiency agricultural fertilizer raw material providing essential Nitrogen, Phosphorus, and Potassium for crop yield optimization.",
    specs: "Total Nitrogen: 15%, P2O5: 15%, K2O: 15%, Granule Size: 2-4mm",
  },
  {
    _id: "prod-012",
    name: "Textile Levelling Agent & Auxiliary",
    grade: "Textile Processing Grade",
    casNo: "9005-64-5",
    code: "LGF-CH-0012",
    industries: ["Textile Chemicals"],
    tags: ["Dyeing Auxiliary", "Levelling Agent", "Textile"],
    status: "Published",
    createdAt: "2026-08-14T11:20:00Z",
    description: "Specialized chemical agent ensuring uniform dye absorption and preventing streaking in synthetic and natural fiber processing.",
    specs: "Appearance: Clear Yellowish Liquid, pH: 6.0 - 7.5, Ionic Character: Non-ionic",
  },
  {
    _id: "prod-013",
    name: "Specialty Custom Catalyst Blend",
    grade: "Custom Synthesis Grade",
    casNo: "7440-06-4",
    code: "LGF-CH-0013",
    industries: ["Other"],
    tags: ["Catalyst", "Specialty Chemical", "Custom"],
    status: "Published",
    createdAt: "2026-08-13T14:40:00Z",
    description: "Customized reaction catalyst formulated for high-selectivity organic synthesis and industrial polymerization.",
    specs: "Active Metal: 5% Pt/C, Surface Area: > 800 m²/g, Loss on Drying: Max 3%",
  }
];

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

  const prodDate = new Date(dateStr);
  if (isNaN(prodDate.getTime())) return true;

  const now = new Date();

  if (filterOption === "Today") {
    return (
      prodDate.getDate() === now.getDate() &&
      prodDate.getMonth() === now.getMonth() &&
      prodDate.getFullYear() === now.getFullYear()
    );
  }

  if (filterOption === "Yesterday") {
    const yest = new Date(now);
    yest.setDate(now.getDate() - 1);
    return (
      prodDate.getDate() === yest.getDate() &&
      prodDate.getMonth() === yest.getMonth() &&
      prodDate.getFullYear() === yest.getFullYear()
    );
  }

  if (filterOption === "Last 7 days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return prodDate >= start;
  }

  if (filterOption === "Last 30 days") {
    const start = new Date(now);
    start.setDate(now.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return prodDate >= start;
  }

  if (filterOption === "This Month") {
    return (
      prodDate.getMonth() === now.getMonth() &&
      prodDate.getFullYear() === now.getFullYear()
    );
  }

  if (filterOption === "Last Month") {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return (
      prodDate.getMonth() === lastMonth.getMonth() &&
      prodDate.getFullYear() === lastMonth.getFullYear()
    );
  }

  if (filterOption === "Custom") {
    if (!customStart || !customEnd) return true;
    const start = new Date(customStart);
    start.setHours(0, 0, 0, 0);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);
    return prodDate >= start && prodDate <= end;
  }

  return true;
};

export default function AdminProductsPage() {
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

  // Search & Dropdown Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [tagFilter, setTagFilter] = useState("All Application Tags");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Open Dropdown Toggle: 'industry' | 'tag' | 'status'
  const [openDropdown, setOpenDropdown] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);

  // Products Dataset State
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // Official Leela Gulf Industries Catalog List (11 Categories + All Industries + Other)
  const uniqueIndustries = useMemo(() => {
    return [
      "All Industries",
      "Industrial Chemicals",
      "Water Treatment",
      "Home Care & Personal Care (LEEPOL®)",
      "Pharmaceuticals API & Excipients",
      "Food & Beverage chemicals",
      "Mining & Metals",
      "Oil & Gas",
      "Textile Chemicals",
      "Packaging & Paper pulp industries",
      "Fertilizers chemicals",
      "CASE – Coatings, Adhesives, Sealants & Elastomers",
      "Other"
    ];
  }, []);

  // Extract Dynamic Application Tags List for Dropdown
  const uniqueTags = useMemo(() => {
    const set = new Set(["All Application Tags"]);
    productsList.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => set.add(t));
      }
    });
    return Array.from(set);
  }, [productsList]);

  // Filtered Products Computation
  const displayedProducts = useMemo(() => {
    return productsList.filter((prod) => {
      // 1. Date Range Filter
      if (
        !isDateInSelectedRange(
          prod.createdAt,
          selectedFilterOption,
          customStartDate,
          customEndDate
        )
      ) {
        return false;
      }

      // 2. Comprehensive Real-Time Search Query (Name, Grade, CAS No, Code, Industries, Tags, Specs)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (prod.name || "").toLowerCase().includes(q);
        const gradeMatch = (prod.grade || "").toLowerCase().includes(q);
        const casMatch = (prod.casNo || "").toLowerCase().includes(q);
        const codeMatch = (prod.code || "").toLowerCase().includes(q);
        const indMatch = (prod.industries || []).some((ind) =>
          ind.toLowerCase().includes(q)
        );
        const tagMatch = (prod.tags || []).some((tag) =>
          tag.toLowerCase().includes(q)
        );
        const descMatch = (prod.description || "").toLowerCase().includes(q);
        const specsMatch = (prod.specs || "").toLowerCase().includes(q);

        if (
          !nameMatch &&
          !gradeMatch &&
          !casMatch &&
          !codeMatch &&
          !indMatch &&
          !tagMatch &&
          !descMatch &&
          !specsMatch
        ) {
          return false;
        }
      }

      // 3. Industry Filter
      if (industryFilter !== "All Industries") {
        if (!prod.industries || !prod.industries.includes(industryFilter)) {
          return false;
        }
      }

      // 4. Tag Filter
      if (tagFilter !== "All Application Tags") {
        if (!prod.tags || !prod.tags.includes(tagFilter)) {
          return false;
        }
      }

      // 5. Status Filter
      if (statusFilter !== "All Status") {
        if (prod.status !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [
    productsList,
    searchQuery,
    industryFilter,
    tagFilter,
    statusFilter,
    selectedFilterOption,
    customStartDate,
    customEndDate,
  ]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(displayedProducts.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayedProducts.slice(start, start + itemsPerPage);
  }, [displayedProducts, currentPage, itemsPerPage]);

  // Date Filter Selection
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

  // Live Backend API Fetch
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await apiRequest("/products");
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((p) => ({
            _id: p._id,
            slug: p.slug,
            name: p.en?.title || p.title,
            grade: p.en?.gradeValue || p.gradeValue || "Industrial Grade",
            casNo: p.casNumber || "-",
            code: p.code || "PRD-001",
            industries: [p.primaryIndustry || p.en?.primaryIndustry || "Industrial Chemicals"],
            tags: p.en?.applicationTags || ["Chemical"],
            status: p.status || "Published",
            createdAt: p.createdAt,
            description: p.en?.shortOverview || "",
            specs: `CAS: ${p.casNumber || "-"}, HS: ${p.hsCode || "-"}, Formula: ${p.chemicalFormula || "-"}`,
          }));
          setProductsList(mapped);
        }
      } catch (err) {
        console.log("Using initial products fallback");
      }
    }
    loadProducts();
  }, []);

  // Reset Filters Helper
  const handleClearFilters = () => {
    setSearchQuery("");
    setIndustryFilter("All Industries");
    setTagFilter("All Application Tags");
    setStatusFilter("All Status");
    setSelectedFilterOption("All Time");
    setDateRangeText("All Time");
    setCurrentPage(1);
  };

  // Delete Product Handler with Real Backend Sync
  const handleDeleteProduct = async (id) => {
    try {
      await apiRequest(`/products/${id}`, { method: "DELETE" });
    } catch (err) {
      console.log("Backend delete error:", err);
    }
    setProductsList((prev) => prev.filter((p) => p._id !== id));
    setDeleteConfirmProduct(null);
    if (selectedProductModal && selectedProductModal._id === id) {
      setSelectedProductModal(null);
    }
  };

  // Checkbox Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(displayedProducts.map((p) => p._id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5 pb-10">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HEADER ROW: Breadcrumbs, Title + Total Products Pill & Date Filter
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 mb-0.5">
            <Link href="/admin/dashboard" className="hover:text-gold-dark transition-colors">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-semibold">Products</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900 tracking-tight">
              Products Management
            </h1>
          </div>
        </div>

        {/* Right Date Selector */}
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. ACTION HEADER ROW: Title, Subtitle + Add Product Button
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-gray-900 tracking-tight">
              All Products
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-heading font-extrabold bg-[#fdfaf0] text-gold-dark border border-gold-main/50 shadow-2xs">
              {displayedProducts.length} Total
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Manage, filter, and organize all listed chemical products.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Add New Product Button */}
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2 bg-[#d6b92a] text-black font-extrabold hover:bg-gold-dark hover:text-white rounded-xl text-xs shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. SEARCH & DYNAMIC FILTER DROPDOWNS ROW
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product name, CAS no. or code..."
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

        {/* Dropdown 1: All Industries */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "industry" ? null : "industry")}
            className="flex items-center justify-between gap-3 px-3.5 py-2 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-medium text-gray-700 min-w-[150px] shadow-xs transition-all"
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span className="truncate">{industryFilter}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {openDropdown === "industry" && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40 max-h-60 overflow-y-auto">
              {uniqueIndustries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => {
                    setIndustryFilter(ind);
                    setOpenDropdown(null);
                    setCurrentPage(1);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between truncate"
                >
                  <span className="truncate">{ind}</span>
                  {industryFilter === ind && <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 2: All Application Tags */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "tag" ? null : "tag")}
            className="flex items-center justify-between gap-3 px-3.5 py-2 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-medium text-gray-700 min-w-[160px] shadow-xs transition-all"
          >
            <div className="flex items-center gap-2 truncate">
              <Tag className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span className="truncate">{tagFilter}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {openDropdown === "tag" && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40 max-h-60 overflow-y-auto">
              {uniqueTags.map((tg) => (
                <button
                  key={tg}
                  onClick={() => {
                    setTagFilter(tg);
                    setOpenDropdown(null);
                    setCurrentPage(1);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between truncate"
                >
                  <span className="truncate">{tg}</span>
                  {tagFilter === tg && <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown 3: All Status */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
            className="flex items-center justify-between gap-3 px-3.5 py-2 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-medium text-gray-700 min-w-[120px] shadow-xs transition-all"
          >
            <span>{statusFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {openDropdown === "status" && (
            <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40">
              {["All Status", "Published", "Draft"].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setOpenDropdown(null);
                    setCurrentPage(1);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{st}</span>
                  {statusFilter === st && <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />}
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
          4. PRODUCTION ULTRA-COMPACT HIGH-DENSITY PRODUCTS TABLE
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        {displayedProducts.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-xs font-semibold">
            No products found matching your search or filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider select-none">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        displayedProducts.length > 0 &&
                        selectedProductIds.length === displayedProducts.length
                      }
                      className="rounded border-gray-300 text-gold-dark focus:ring-gold-main cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 whitespace-nowrap min-w-[220px]">
                    <div className="flex items-center gap-1.5">
                      <span>Product Name</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>CAS No.</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Product Code</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>Industries</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span>Application Tags</span>
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {paginatedProducts.map((product) => {
                  const isBottle = product._id.includes("003") || product._id.includes("005") || product._id.includes("007");
                  const isBeaker = product._id.includes("002") || product._id.includes("004") || product._id.includes("006");

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-[#fdfaf0]/50 transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product._id)}
                          onChange={() => handleSelectOne(product._id)}
                          className="rounded border-gray-300 text-gold-dark focus:ring-gold-main cursor-pointer"
                        />
                      </td>

                      {/* Product Name + Compact Container Box + 1-Line Truncated Title */}
                      <td className="py-2.5 px-3 max-w-[260px]">
                        <div className="flex items-center gap-2.5">
                          {/* Compact Glass Container Thumbnail */}
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100/90 border border-gray-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-gold-main/50 transition-all">
                            {isBottle ? (
                              <svg className="w-5 h-5 text-gray-600 drop-shadow-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M9 3h6v3H9zM10 6v3l-3 5v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6l-3-5V6" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 14h10" opacity="0.4" strokeDasharray="2 2" />
                              </svg>
                            ) : isBeaker ? (
                              <svg className="w-5 h-5 text-gray-600 drop-shadow-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 3h12v3l-1 1v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7L6 6V3z" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7 13h10" opacity="0.4" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-600 drop-shadow-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M10 2v6.5L4 18.5A2 2 0 0 0 5.7 21.5h12.6a2 2 0 0 0 1.7-3L14 8.5V2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.5 2h7" strokeLinecap="round" />
                                <path d="M7 15h10" opacity="0.4" />
                              </svg>
                            )}
                          </div>

                          {/* 1-Line Product Name & Grade with Tooltip and Ellipsis */}
                          <div className="min-w-0 flex-1">
                            <span
                              className="font-extrabold text-gray-900 block truncate text-xs hover:text-gold-dark transition-colors cursor-pointer"
                              title={product.name}
                              onClick={() => setSelectedProductModal(product)}
                            >
                              {product.name}
                            </span>
                            <span className="text-[11px] text-gray-400 font-normal truncate block leading-tight" title={product.grade}>
                              {product.grade}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CAS No (1-Line) */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-700 whitespace-nowrap font-medium">
                        {product.casNo}
                      </td>

                      {/* Product Code (1-Line Badge) */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-800 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200/80 text-gray-800 font-bold">
                          {product.code}
                        </span>
                      </td>

                      {/* Industries (Single Horizontal Line + Overflow Badge) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {product.industries && product.industries.length > 0 && (
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fdfaf0] text-[#8e7608] border border-[#f0d84a]/50 max-w-[145px] truncate inline-block"
                              title={product.industries[0]}
                            >
                              {product.industries[0]}
                            </span>
                          )}
                          {product.industries && product.industries.length > 1 && (
                            <span
                              className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100/70 text-amber-900 border border-amber-200 cursor-help shrink-0"
                              title={product.industries.slice(1).join(", ")}
                            >
                              +{product.industries.length - 1}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Application Tags (Single Horizontal Line) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {(product.tags || []).slice(0, 2).map((tg, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 max-w-[100px] truncate inline-block"
                              title={tg}
                            >
                              {tg}
                            </span>
                          ))}
                          {(product.tags || []).length > 2 && (
                            <span
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700 shrink-0 cursor-help"
                              title={(product.tags || []).slice(2).join(", ")}
                            >
                              +{(product.tags || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {product.status === "Published" ? (
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

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedProductModal(product)}
                            title="View Product Details"
                            className="p-1 text-gray-500 hover:text-gold-dark hover:bg-[#fdfaf0] border border-transparent hover:border-gold-main/40 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Product */}
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            title="Edit Product"
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* Delete Product */}
                          <button
                            onClick={() => setDeleteConfirmProduct(product)}
                            title="Delete Product"
                            className="p-1 text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-all"
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
            5. WORKING PAGINATION FOOTER
            ───────────────────────────────────────────────────────────────────────────── */}
        <div className="py-3 px-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div>
            Showing{" "}
            <span className="font-bold text-gray-900">
              {displayedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-bold text-gray-900">
              {Math.min(currentPage * itemsPerPage, displayedProducts.length)}
            </span>{" "}
            of <span className="font-bold text-gray-900">{displayedProducts.length}</span> products
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
                      {itemsPerPage === num && <Check className="w-3 h-3 text-gold-dark" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic Page Buttons */}
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors font-bold text-xs shadow-2xs"
                title="First Page"
              >
                |&lt;
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors shadow-2xs"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

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

              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1 bg-white border border-gray-200 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-black transition-colors shadow-2xs"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
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

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. PRODUCT DETAILS MODAL (VIEW)
          ───────────────────────────────────────────────────────────────────────────── */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-gold-main/30 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 pb-2 border-b border-gray-100">
              <div className="w-13 h-13 rounded-2xl bg-[#fdfaf0] border border-gold-main/40 flex items-center justify-center text-gold-dark shrink-0">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-extrabold text-gray-900">
                  {selectedProductModal.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedProductModal.grade} • Code: <strong className="text-gray-900">{selectedProductModal.code}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50/80 rounded-2xl p-4 text-xs border border-gray-100">
              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">CAS Registry Number</span>
                <span className="font-mono text-gray-900 font-bold text-xs">
                  {selectedProductModal.casNo}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Status</span>
                <span className="font-bold">
                  {selectedProductModal.status === "Published" ? "🟢 Published" : "🟡 Draft"}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Industries</span>
                <span className="text-gray-900 font-bold">
                  {(selectedProductModal.industries || []).join(", ")}
                </span>
              </div>

              <div>
                <span className="text-gray-400 font-semibold block mb-0.5">Application Tags</span>
                <span className="text-gray-900 font-bold">
                  {(selectedProductModal.tags || []).join(", ")}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Product Description
              </h4>
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 leading-relaxed font-sans">
                {selectedProductModal.description}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Technical Specifications
              </h4>
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono text-gray-800 leading-relaxed">
                {selectedProductModal.specs}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedProductModal(null)}
                className="px-6 py-2.5 bg-black text-gold-main font-bold text-xs rounded-xl hover:bg-gray-900 transition-colors shadow-xs"
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
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-extrabold text-gray-900">
              Delete Product?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Are you sure you want to delete <strong className="text-gray-900">{deleteConfirmProduct.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmProduct._id)}
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
