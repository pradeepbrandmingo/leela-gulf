"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest, API_BASE_URL } from "@/config/api";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  FlaskConical,
  Package,
  Layers,
  HelpCircle,
  ShieldCheck,
  Building2,
  Sparkles,
  Feather,
  Leaf,
  Droplet,
  Zap,
  Award,
  Sun,
  Recycle,
  Heart,
  Upload,
  Check,
  ChevronDown,
  Info,
  X,
  Languages,
  Loader2,
  Globe,
  AlertCircle,
  Flame,
  Gauge,
  Compass,
  Factory,
  Waves,
  Activity,
  Cpu,
  Target,
  Star,
  Box,
  Microscope,
  Wind,
  Thermometer,
  Eye,
  Settings,
  TrendingUp,
  Gem,
  Search,
  Link2,
  UploadCloud
} from "lucide-react";

// Official Leela Gulf Industries Catalog List (11 Categories)
const INDUSTRY_OPTIONS = [
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

const FEATURE_ICON_OPTIONS = [
  { id: "sparkles", label: "Sparkles / Active Foaming", icon: Sparkles },
  { id: "feather", label: "Feather / Gentle on Skin", icon: Feather },
  { id: "leaf", label: "Leaf / Natural Origin", icon: Leaf },
  { id: "droplet", label: "Droplet / Highly Soluble", icon: Droplet },
  { id: "flask", label: "Flask / Versatile Synthesis", icon: FlaskConical },
  { id: "shield", label: "Shield / Safety & Stability", icon: ShieldCheck },
  { id: "zap", label: "Zap / High Performance", icon: Zap },
  { id: "award", label: "Award / Premium Grade", icon: Award },
  { id: "sun", label: "Sun / Thermal Resistance", icon: Sun },
  { id: "recycle", label: "Recycle / Eco Friendly", icon: Recycle },
  { id: "heart", label: "Heart / Safe & Mild", icon: Heart },
  { id: "check", label: "Check / Certified Quality", icon: CheckCircle2 },
  { id: "flame", label: "Flame / Thermal Reactivity", icon: Flame },
  { id: "gauge", label: "Gauge / Viscosity Control", icon: Gauge },
  { id: "factory", label: "Factory / Industrial Grade", icon: Factory },
  { id: "globe", label: "Globe / Global Export", icon: Globe },
  { id: "waves", label: "Waves / Surfactant & Emulsion", icon: Waves },
  { id: "activity", label: "Activity / High Reactivity", icon: Activity },
  { id: "package", label: "Package / Bulk Packaging", icon: Package },
  { id: "layers", label: "Layers / Coating & Film", icon: Layers },
  { id: "cpu", label: "Cpu / Tech Synthesis", icon: Cpu },
  { id: "target", label: "Target / High Precision", icon: Target },
  { id: "star", label: "Star / High Purity Grade", icon: Star },
  { id: "microscope", label: "Microscope / Lab Tested", icon: Microscope },
  { id: "wind", label: "Wind / Low Volatility", icon: Wind },
  { id: "thermometer", label: "Thermometer / Temp Stable", icon: Thermometer },
  { id: "trend", label: "Trending / High Yield", icon: TrendingUp },
  { id: "gem", label: "Gem / Crystalline Pure", icon: Gem },
  { id: "box", label: "Box / Standard Formulation", icon: Box },
  { id: "compass", label: "Compass / Direction & Flow", icon: Compass },
  { id: "settings", label: "Settings / Custom Modified", icon: Settings },
  { id: "eye", label: "Eye / Optical Clarity", icon: Eye },
];

function getSavedCustomIcons() {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("leela_saved_feature_icons");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomIconToStorage(url) {
  if (typeof window === "undefined" || !url) return;
  try {
    const prev = getSavedCustomIcons();
    const filtered = prev.filter((item) => item !== url);
    const updated = [url, ...filtered].slice(0, 16); // Keep last 16 icons
    localStorage.setItem("leela_saved_feature_icons", JSON.stringify(updated));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

function renderFeatureBadgeIcon(iconName) {
  const iconClass = "w-4 h-4 text-gold-main";
  const key = (iconName || "").trim().toLowerCase();

  // Custom Uploaded Image/SVG Icon URL
  if (
    key.startsWith("http://") ||
    key.startsWith("https://") ||
    key.startsWith("/uploads/") ||
    key.startsWith("data:image/") ||
    key.includes(".svg") ||
    key.includes(".png") ||
    key.includes(".webp")
  ) {
    return (
      <img
        src={iconName}
        alt="Feature Icon"
        className="w-5 h-5 object-contain [filter:brightness(0)_saturate(100%)_invert(74%)_sepia(85%)_saturate(380%)_hue-rotate(5deg)_brightness(95%)_contrast(85%)]"
      />
    );
  }

  if (key.includes("sparkle") || key.includes("foam") || key.includes("active")) return <Sparkles className={iconClass} />;
  if (key.includes("feather") || key.includes("gentle") || key.includes("skin") || key.includes("mild")) return <Feather className={iconClass} />;
  if (key.includes("leaf") || key.includes("natural") || key.includes("bio") || key.includes("plant") || key.includes("eco")) return <Leaf className={iconClass} />;
  if (key.includes("droplet") || key.includes("soluble") || key.includes("water") || key.includes("liquid")) return <Droplet className={iconClass} />;
  if (key.includes("flask") || key.includes("chemical") || key.includes("versatile") || key.includes("lab")) return <FlaskConical className={iconClass} />;
  if (key.includes("shield") || key.includes("safety") || key.includes("protect") || key.includes("stable")) return <ShieldCheck className={iconClass} />;
  if (key.includes("zap") || key.includes("fast") || key.includes("power") || key.includes("energy")) return <Zap className={iconClass} />;
  if (key.includes("award") || key.includes("pure") || key.includes("quality") || key.includes("cert") || key.includes("premium")) return <Award className={iconClass} />;
  if (key.includes("sun") || key.includes("heat") || key.includes("light") || key.includes("thermal")) return <Sun className={iconClass} />;
  if (key.includes("recycle") || key.includes("sustain") || key.includes("green")) return <Recycle className={iconClass} />;
  if (key.includes("heart") || key.includes("safe") || key.includes("care")) return <Heart className={iconClass} />;
  if (key.includes("flame") || key.includes("fire")) return <Flame className={iconClass} />;
  if (key.includes("gauge") || key.includes("pressure") || key.includes("speed")) return <Gauge className={iconClass} />;
  if (key.includes("check") || key.includes("verified")) return <CheckCircle2 className={iconClass} />;
  if (key.includes("factory") || key.includes("plant") || key.includes("industry")) return <Factory className={iconClass} />;
  if (key.includes("globe") || key.includes("world") || key.includes("export")) return <Globe className={iconClass} />;
  if (key.includes("wave") || key.includes("marine") || key.includes("surfactant")) return <Waves className={iconClass} />;
  if (key.includes("activity") || key.includes("reaction")) return <Activity className={iconClass} />;
  if (key.includes("package") || key.includes("bulk") || key.includes("drum")) return <Package className={iconClass} />;
  if (key.includes("layer") || key.includes("coating") || key.includes("film")) return <Layers className={iconClass} />;
  if (key.includes("cpu") || key.includes("tech") || key.includes("smart")) return <Cpu className={iconClass} />;
  if (key.includes("target") || key.includes("precision") || key.includes("focus")) return <Target className={iconClass} />;
  if (key.includes("star") || key.includes("grade")) return <Star className={iconClass} />;
  if (key.includes("microscope") || key.includes("research") || key.includes("purity")) return <Microscope className={iconClass} />;
  if (key.includes("wind") || key.includes("air") || key.includes("gas")) return <Wind className={iconClass} />;
  if (key.includes("thermometer") || key.includes("temp")) return <Thermometer className={iconClass} />;
  if (key.includes("trend") || key.includes("yield") || key.includes("efficiency")) return <TrendingUp className={iconClass} />;
  if (key.includes("gem") || key.includes("crystal") || key.includes("pure")) return <Gem className={iconClass} />;
  if (key.includes("box")) return <Box className={iconClass} />;
  if (key.includes("compass")) return <Compass className={iconClass} />;
  if (key.includes("setting")) return <Settings className={iconClass} />;
  if (key.includes("eye")) return <Eye className={iconClass} />;

  return <Sparkles className={iconClass} />;
}

function FeatureIconSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" | "custom"
  const [iconSearch, setIconSearch] = useState("");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [savedIcons, setSavedIcons] = useState([]);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSavedIcons(getSavedCustomIcons());
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCustomUrl =
    typeof value === "string" &&
    (value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/uploads/") ||
      value.startsWith("data:image/") ||
      value.includes(".svg") ||
      value.includes(".png") ||
      value.includes(".webp"));

  const selectedPreset = FEATURE_ICON_OPTIONS.find((item) => item.id === value);
  const SelectedIcon = selectedPreset ? selectedPreset.icon : Sparkles;

  const filteredIcons = FEATURE_ICON_OPTIONS.filter((item) =>
    item.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
    item.id.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload/single`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const uploadedUrl = data.data?.url || data.url;

      if (data.success && uploadedUrl) {
        saveCustomIconToStorage(uploadedUrl);
        setSavedIcons(getSavedCustomIcons());
        onChange(uploadedUrl);
        setIsOpen(false);
      } else {
        alert(data.message || "Failed to upload custom icon.");
      }
    } catch (err) {
      console.error("Icon upload error:", err);
      alert("Error uploading custom icon.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    const url = customUrlInput.trim();
    saveCustomIconToStorage(url);
    setSavedIcons(getSavedCustomIcons());
    onChange(url);
    setCustomUrlInput("");
    setIsOpen(false);
  };

  const handleClearSavedIcons = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("leela_saved_feature_icons");
      setSavedIcons([]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-gray-200 hover:border-gold-main/60 focus:border-gold-main rounded-xl text-xs font-semibold text-gray-800 shadow-2xs transition-all cursor-pointer w-full max-w-[165px] justify-between"
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {isCustomUrl ? (
            <img
              src={value}
              alt="Custom Icon"
              className="w-3.5 h-3.5 object-contain rounded shrink-0 [filter:brightness(0)_saturate(100%)_invert(74%)_sepia(85%)_saturate(380%)_hue-rotate(5deg)_brightness(95%)_contrast(85%)]"
            />
          ) : (
            <SelectedIcon className="w-3.5 h-3.5 text-gold-dark shrink-0" />
          )}
          <span className="truncate text-[11px] font-heading font-bold text-gray-800">
            {isCustomUrl ? "Custom Icon" : selectedPreset ? selectedPreset.label.split("/")[0].trim() : "Sparkles"}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-gold-dark" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-32px)] bg-white border border-gold-main/40 rounded-2xl shadow-2xl z-50 p-3 animate-[fadeIn_0.15s_ease-out]">
          {/* Header Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl mb-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={`flex-1 py-1.5 text-[10px] font-heading font-bold rounded-lg transition-all ${activeTab === "catalog"
                  ? "bg-white text-gold-dark shadow-xs border border-gold-main/30"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              🎨 30+ Icons Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`flex-1 py-1.5 text-[10px] font-heading font-bold rounded-lg transition-all ${activeTab === "custom"
                  ? "bg-white text-gold-dark shadow-xs border border-gold-main/30"
                  : "text-gray-600 hover:text-gray-900"
                }`}
            >
              📤 Custom Icon ({savedIcons.length})
            </button>
          </div>

          {activeTab === "catalog" ? (
            <div>
              {/* Search Bar */}
              <div className="relative mb-2">
                <Search className="w-3 h-3 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Search icons (e.g. eco, lab, foam)..."
                  className="w-full pl-7 pr-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[11px] placeholder-gray-400 focus:outline-none focus:border-gold-main"
                />
              </div>

              {/* Scrollable Icon List */}
              <div className="max-h-48 overflow-y-auto space-y-0.5 [scrollbar-width:thin] pr-1">
                {filteredIcons.length === 0 ? (
                  <div className="text-center py-4 text-xs text-gray-400">No icons match "{iconSearch}"</div>
                ) : (
                  filteredIcons.map((item) => {
                    const ItemIcon = item.icon;
                    const isItemSel = value === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onChange(item.id);
                          setIsOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 text-left text-xs font-medium rounded-lg flex items-center justify-between transition-colors cursor-pointer ${isItemSel
                            ? "bg-gold-main/15 text-gold-dark font-bold border border-gold-main/30"
                            : "text-gray-700 hover:bg-gold-main/10 hover:text-gold-dark"
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ItemIcon className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                          <span className="truncate text-[11px] font-heading">{item.label}</span>
                        </div>
                        {isItemSel && <Check className="w-3 h-3 text-gold-dark shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 py-1">
              {/* TOP: Previously Uploaded / Saved Custom Icons Gallery */}
              {savedIcons.length > 0 && (
                <div className="space-y-1.5 p-2 bg-[#fdfaf0]/80 rounded-xl border border-gold-main/30">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-heading font-extrabold text-gold-dark">
                      ✨ Click to use saved icon ({savedIcons.length}):
                    </span>
                    <button
                      type="button"
                      onClick={handleClearSavedIcons}
                      className="text-[9px] text-gray-400 hover:text-rose-600 underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1 [scrollbar-width:thin]">
                    {savedIcons.map((iconUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          onChange(iconUrl);
                          setIsOpen(false);
                        }}
                        className={`h-12 rounded-xl bg-white border flex items-center justify-center p-1.5 hover:border-gold-main hover:scale-105 transition-all cursor-pointer shadow-xs ${value === iconUrl
                            ? "border-gold-main ring-2 ring-gold-main/50 bg-gold-main/10"
                            : "border-gray-200"
                          }`}
                        title="Click to select this saved icon"
                      >
                        <img
                          src={iconUrl}
                          alt="Saved icon"
                          className="w-6 h-6 object-contain [filter:brightness(0)_saturate(100%)_invert(74%)_sepia(85%)_saturate(380%)_hue-rotate(5deg)_brightness(95%)_contrast(85%)]"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Image Upload Button */}
              <div className="border border-dashed border-gold-main/40 hover:border-gold-main bg-gray-50/70 rounded-xl p-2.5 text-center transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d6b92a] hover:bg-gold-dark text-black hover:text-white rounded-lg text-xs font-heading font-bold cursor-pointer transition-all shadow-xs disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5" />
                  )}
                  <span>{isUploading ? "Uploading..." : "Upload New SVG/PNG"}</span>
                </button>
                <p className="text-[9px] text-gray-400 mt-1">SVG/PNG will automatically adapt to Brand Gold color</p>
              </div>

              {/* Paste Direct URL */}
              <div className="space-y-1 pt-1 border-t border-gray-100">
                <label className="text-[10px] font-heading font-bold text-gray-600">Or Paste Custom Icon URL:</label>
                <div className="flex items-center gap-1">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/icon.svg"
                    className="flex-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[11px] placeholder-gray-400 focus:outline-none focus:border-gold-main"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-2.5 py-1 bg-gray-900 hover:bg-black text-white text-[11px] font-heading font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AddNewProductPage() {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState("en"); // "en" | "ar"
  const [isTranslating, setIsTranslating] = useState(false);
  const [hasTranslated, setHasTranslated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingTds, setIsUploadingTds] = useState(false);
  const [uploadingCardIdx, setUploadingCardIdx] = useState(null);
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const industryDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(e.target)) {
        setIsIndustryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cloudinary Direct Single Image Upload Handler
  const handleUploadProductImages = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImages(true);
    setErrorMsg("");
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload/single`, {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setProductImages([data.data.url]);
        setSuccessMsg("✨ Product image uploaded to Cloudinary!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary Image Upload Error:", err);
      setErrorMsg("Failed to upload image to Cloudinary. Please try again.");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleUploadTdsDoc = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingTds(true);
    setErrorMsg("");
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload/single`, {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setFormData((prev) => ({
          ...prev,
          tdsUrl: data.data.url,
          tdsFileName: file.name,
        }));
        setSuccessMsg("✨ TDS Document uploaded successfully to Cloudinary!");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        throw new Error(data.message || "TDS Upload failed");
      }
    } catch (err) {
      console.error("Cloudinary TDS Upload Error:", err);
      setErrorMsg("Failed to upload TDS document to Cloudinary.");
    } finally {
      setIsUploadingTds(false);
    }
  };

  const handleUploadCardImage = async (cardIndex, file) => {
    if (!file) return;

    setUploadingCardIdx(cardIndex);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/upload/single`, {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        handleAppCardChange(cardIndex, "imageUrl", data.data.url);
      }
    } catch (err) {
      console.error("Card Image Upload Error:", err);
      alert("Failed to upload application image to Cloudinary.");
    } finally {
      setUploadingCardIdx(null);
    }
  };

  // ── 1. SHARED TECHNICAL & GENERAL INFO (English default) ──
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    categoryTag: "SURFACTANTS",
    primaryIndustry: "Home Care & Personal Care (LEEPOL®)",
    gradeLabel: "Product Grade",
    gradeValue: "",
    shortOverview: "",
    status: "Published", // "Published" | "Draft"
    featured: false,

    // Quick Specs (Shared)
    casNumber: "",
    inciName: "",
    hsCode: "",
    chemicalFormula: "",

    // Media & Docs
    imageUrl: "/images/prodcut/dummy-product.jpg",
    tdsUrl: "",
    tdsFileName: "",

    // About Section
    aboutTitle: "",
    aboutOverview: "",
    card1Title: "Manufacturing Process",
    manufacturingProcess: "",
    card2Title: "Packaging & Logistics",
    packagingLogistics: "",
    card3Title: "Safety & Handling",
    safetyHandling: "",
    card4Title: "Bulk Pricing & Procurement",
    bulkPricing: "",
    whyChooseTitle: "Why Choose Leela Gulf as a Trusted Supplier?",
    whyChooseLeela: "",
  });

  // Arabic Localized State
  const [arFormData, setArFormData] = useState({
    title: "",
    categoryTag: "خافضات التوتر السطحي",
    primaryIndustry: "العناية المنزلية والشخصية (LEEPOL®)",
    gradeValue: "",
    shortOverview: "",
    aboutTitle: "",
    aboutOverview: "",
    card1Title: "عملية التصنيع",
    manufacturingProcess: "",
    card2Title: "التعبئة والتغليف والخدمات اللوجستية",
    packagingLogistics: "",
    card3Title: "السلامة والتعامل",
    safetyHandling: "",
    card4Title: "التسعير بالجملة والمشتريات",
    bulkPricing: "",
    whyChooseTitle: "لماذا تختار ليلا الخليج كمورد موثوق؟",
    whyChooseLeela: "",
  });

  // Dynamic Industry Application Tags
  const [appTags, setAppTags] = useState(["Personal Care", "Home Care", "Shampoo", "Cosmetics", "Liquid Soap"]);
  const [arAppTags, setArAppTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");

  // Dynamic Product Features (01 - 05)
  const [features, setFeatures] = useState([
    {
      id: 1,
      title: "Effective Surfactant",
      description: "Excellent foaming and cleansing capabilities, positioned with a highly competitive procurement price point.",
      icon: "sparkles"
    },
    {
      id: 2,
      title: "Gentle on Skin",
      description: "Formulated specifically for sensitive applications, including premium baby care and specialized dermatological products.",
      icon: "feather"
    },
    {
      id: 3,
      title: "Natural Origin",
      description: "Derived entirely from coconut oil fatty acids, ensuring sustainable and eco-friendly raw material sourcing.",
      icon: "leaf"
    },
    {
      id: 4,
      title: "Highly Soluble",
      description: "Engineered for seamless integration, making it remarkably easy to formulate across complex liquid and gel matrices.",
      icon: "droplet"
    },
    {
      id: 5,
      title: "Versatile Use",
      description: "A core structural ingredient across personal care, cosmetics and commercial-grade cleaning solutions.",
      icon: "flask"
    }
  ]);
  const [arFeatures, setArFeatures] = useState([]);

  // Dynamic Industry Applications Breakdown
  const [applicationCards, setApplicationCards] = useState([
    {
      id: 1,
      industry: "Personal Care",
      badge: "COSMETICS",
      imageUrl: "",
      bullets: [
        "Primary additive in high-end Shampoo and restorative Hair Care treatments.",
        "Essential structural component in specialized Skin and Oral Care formulations.",
        "Commonly utilized in body washes, facial cleansers, and toothpastes due to its mild cleansing action.",
        "Acts as a primary mild surfactant and foam booster in delicate baby products."
      ]
    },
    {
      id: 2,
      industry: "Household Products",
      badge: "INDUSTRIAL",
      imageUrl: "",
      bullets: [
        "Core ingredient in premium Household and Cleaning Products.",
        "Works effectively in gentle cleaners when combined with anionic surfactants, offering scalable production economics.",
        "Widely utilized as the base for liquid soaps and high-efficiency detergents."
      ]
    }
  ]);
  const [arApplicationCards, setArApplicationCards] = useState([]);

  // Dynamic FAQs
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "What is the active matter percentage?",
      answer: "Our standard industrial-grade Cocamidopropyl Betaine (CAPB) typically contains between 30% and 35% active matter, ensuring optimal performance and cost-effectiveness for bulk personal care formulations."
    },
    {
      id: 2,
      question: "Can CAPB be blended with anionic surfactants?",
      answer: "Yes, CAPB is widely blended with SLES and other anionic surfactants to increase viscosity and reduce overall formula irritation."
    },
    {
      id: 3,
      question: "What is the recommended shelf life?",
      answer: "24 months from the date of manufacture when stored in original sealed HDPE containers in a cool, dry area away from direct sunlight."
    }
  ]);
  const [arFaqs, setArFaqs] = useState([]);

  // Dynamic Related Products
  const [relatedHeading, setRelatedHeading] = useState("Related Surfactants");
  const [arRelatedHeading, setArRelatedHeading] = useState("منتجات ذات صلة");
  const [relatedProducts, setRelatedProducts] = useState([
    {
      id: 1,
      categoryTag: "ANIONIC SURFACTANT",
      title: "Sodium Laureth Sulfate (SLES 70%)",
      description: "A highly effective foaming agent commonly paired with CAPB in shampoo and body wash formulations.",
      slug: "sodium-laureth-sulfate-sles-70"
    },
    {
      id: 2,
      categoryTag: "NON-IONIC SURFACTANT",
      title: "Cocamide DEA (CDEA)",
      description: "Used alongside betaines as an excellent foam stabilizer and viscosity builder in liquid cosmetics.",
      slug: "cocamide-dea-cdea"
    },
    {
      id: 3,
      categoryTag: "HUMECTANT",
      title: "Refined Glycerin (99.5%)",
      description: "A complementary moisturizing agent widely utilized in home care and dermatological preparations.",
      slug: "refined-glycerin-99"
    }
  ]);
  const [arRelatedProducts, setArRelatedProducts] = useState([]);

  // ── 2. AUTO-TRANSLATE HANDLER (English -> Arabic AI/Google Translation) ──
  const handleAutoTranslate = async () => {
    if (!formData.title.trim()) {
      alert("Please fill at least the Product Title in English before translating.");
      return;
    }

    setIsTranslating(true);
    setErrorMsg("");

    try {
      const enPayload = {
        title: formData.title,
        gradeValue: formData.gradeValue,
        categoryTag: formData.categoryTag,
        primaryIndustry: formData.primaryIndustry,
        shortOverview: formData.shortOverview,
        aboutTitle: formData.aboutTitle || `About ${formData.title}`,
        aboutOverview: formData.aboutOverview,
        card1Title: formData.card1Title,
        manufacturingProcess: formData.manufacturingProcess,
        card2Title: formData.card2Title,
        packagingLogistics: formData.packagingLogistics,
        card3Title: formData.card3Title,
        safetyHandling: formData.safetyHandling,
        card4Title: formData.card4Title,
        bulkPricing: formData.bulkPricing,
        whyChooseTitle: formData.whyChooseTitle,
        whyChooseLeela: formData.whyChooseLeela,
        applicationTags: appTags,
        features,
        applicationCards,
        faqs,
        relatedHeading,
        relatedProducts,
      };

      const res = await apiRequest("/translate", {
        method: "POST",
        body: { payload: enPayload, targetLang: "ar", sourceLang: "en" },
      });

      if (res.success && res.data) {
        const ar = res.data;
        setArFormData({
          title: ar.title || "",
          categoryTag: ar.categoryTag || "",
          primaryIndustry: ar.primaryIndustry || "",
          gradeValue: ar.gradeValue || formData.gradeValue,
          shortOverview: ar.shortOverview || "",
          aboutTitle: ar.aboutTitle || "",
          aboutOverview: ar.aboutOverview || "",
          card1Title: ar.card1Title || "عملية التصنيع",
          manufacturingProcess: ar.manufacturingProcess || "",
          card2Title: ar.card2Title || "التعبئة والتغليف والخدمات اللوجستية",
          packagingLogistics: ar.packagingLogistics || "",
          card3Title: ar.card3Title || "السلامة والتعامل",
          safetyHandling: ar.safetyHandling || "",
          card4Title: ar.card4Title || "التسعير بالجملة والمشتريات",
          bulkPricing: ar.bulkPricing || "",
          whyChooseTitle: ar.whyChooseTitle || "لماذا تختار ليلا الخليج كمورد موثوق؟",
          whyChooseLeela: ar.whyChooseLeela || "",
        });

        if (Array.isArray(ar.applicationTags)) setArAppTags(ar.applicationTags);
        if (Array.isArray(ar.features)) setArFeatures(ar.features);
        if (Array.isArray(ar.applicationCards)) setArApplicationCards(ar.applicationCards);
        if (Array.isArray(ar.faqs)) setArFaqs(ar.faqs);
        if (ar.relatedHeading) setArRelatedHeading(ar.relatedHeading);
        if (Array.isArray(ar.relatedProducts)) setArRelatedProducts(ar.relatedProducts);

        setHasTranslated(true);
        setSuccessMsg("✨ All product sections automatically translated to Arabic! You can switch to the Arabic tab to preview or edit.");
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (err) {
      console.error("Auto Translate Error:", err);
      setErrorMsg("Failed to auto-translate. Please try again or fill fields manually.");
    } finally {
      setIsTranslating(false);
    }
  };

  // ── 3. STATE GETTERS/SETTERS BASED ON ACTIVE LANGUAGE TAB ──
  const curForm = activeLang === "en" ? formData : arFormData;
  const setCurForm = (newVal) => {
    if (activeLang === "en") setFormData(newVal);
    else setArFormData(newVal);
  };

  const curFeatures = activeLang === "en" ? features : (arFeatures.length ? arFeatures : features);
  const curAppCards = activeLang === "en" ? applicationCards : (arApplicationCards.length ? arApplicationCards : applicationCards);
  const curFaqs = activeLang === "en" ? faqs : (arFaqs.length ? arFaqs : faqs);
  const curAppTags = activeLang === "en" ? appTags : (arAppTags.length ? arAppTags : appTags);
  const curRelatedHeading = activeLang === "en" ? relatedHeading : arRelatedHeading;
  const curRelatedProducts = activeLang === "en" ? relatedProducts : (arRelatedProducts.length ? arRelatedProducts : relatedProducts);

  // Tag Handlers
  const handleAddTag = () => {
    if (newTagInput.trim()) {
      if (activeLang === "en") {
        if (!appTags.includes(newTagInput.trim())) {
          setAppTags([...appTags, newTagInput.trim()]);
        }
      } else {
        if (!arAppTags.includes(newTagInput.trim())) {
          setArAppTags([...arAppTags, newTagInput.trim()]);
        }
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    if (activeLang === "en") {
      setAppTags(appTags.filter((t) => t !== tagToRemove));
    } else {
      setArAppTags(arAppTags.filter((t) => t !== tagToRemove));
    }
  };

  // Feature Handlers
  const handleFeatureChange = (index, field, value) => {
    if (activeLang === "en") {
      const updated = [...features];
      updated[index][field] = value;
      setFeatures(updated);
    } else {
      const updated = [...(arFeatures.length ? arFeatures : features)];
      updated[index][field] = value;
      setArFeatures(updated);
    }
  };

  const handleAddFeature = () => {
    const newFeat = {
      id: Date.now(),
      title: "",
      description: "",
      icon: "sparkles"
    };
    setFeatures([...features, newFeat]);
    if (arFeatures.length) {
      setArFeatures([...arFeatures, { ...newFeat }]);
    }
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
    if (arFeatures.length) {
      setArFeatures(arFeatures.filter((_, i) => i !== index));
    }
  };

  // FAQ Handlers
  const handleFaqChange = (index, field, value) => {
    if (activeLang === "en") {
      const updated = [...faqs];
      updated[index][field] = value;
      setFaqs(updated);
    } else {
      const updated = [...(arFaqs.length ? arFaqs : faqs)];
      updated[index][field] = value;
      setArFaqs(updated);
    }
  };

  const handleAddFaq = () => {
    const newFaq = { id: Date.now(), question: "", answer: "" };
    setFaqs([...faqs, newFaq]);
    if (arFaqs.length) {
      setArFaqs([...arFaqs, { ...newFaq }]);
    }
  };

  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
    if (arFaqs.length) {
      setArFaqs(arFaqs.filter((_, i) => i !== index));
    }
  };

  // Application Card Handlers
  const handleAppCardChange = (index, field, value) => {
    if (activeLang === "en") {
      const updated = [...applicationCards];
      updated[index][field] = value;
      setApplicationCards(updated);
    } else {
      const updated = [...(arApplicationCards.length ? arApplicationCards : applicationCards)];
      updated[index][field] = value;
      setArApplicationCards(updated);
    }
  };

  const handleAppBulletChange = (cardIndex, bulletIndex, value) => {
    if (activeLang === "en") {
      const updated = [...applicationCards];
      updated[cardIndex].bullets[bulletIndex] = value;
      setApplicationCards(updated);
    } else {
      const updated = [...(arApplicationCards.length ? arApplicationCards : applicationCards)];
      updated[cardIndex].bullets[bulletIndex] = value;
      setArApplicationCards(updated);
    }
  };

  const handleAddBullet = (cardIndex) => {
    if (activeLang === "en") {
      const updated = [...applicationCards];
      updated[cardIndex].bullets.push("");
      setApplicationCards(updated);
    } else {
      const updated = [...(arApplicationCards.length ? arApplicationCards : applicationCards)];
      updated[cardIndex].bullets.push("");
      setArApplicationCards(updated);
    }
  };

  const handleRemoveBullet = (cardIndex, bulletIndex) => {
    if (activeLang === "en") {
      const updated = [...applicationCards];
      updated[cardIndex].bullets = updated[cardIndex].bullets.filter((_, i) => i !== bulletIndex);
      setApplicationCards(updated);
    } else {
      const updated = [...(arApplicationCards.length ? arApplicationCards : applicationCards)];
      updated[cardIndex].bullets = updated[cardIndex].bullets.filter((_, i) => i !== bulletIndex);
      setArApplicationCards(updated);
    }
  };

  // Related Products Handlers
  const handleRelatedProductChange = (index, field, value) => {
    if (activeLang === "en") {
      const updated = [...relatedProducts];
      updated[index][field] = value;
      setRelatedProducts(updated);
    } else {
      const updated = [...(arRelatedProducts.length ? arRelatedProducts : relatedProducts)];
      updated[index][field] = value;
      setArRelatedProducts(updated);
    }
  };

  const handleAddRelatedProduct = () => {
    const newRel = {
      id: Date.now(),
      categoryTag: "SURFACTANTS",
      title: "",
      description: "",
      slug: ""
    };
    setRelatedProducts([...relatedProducts, newRel]);
    if (arRelatedProducts.length) {
      setArRelatedProducts([...arRelatedProducts, { ...newRel }]);
    }
  };

  const handleRemoveRelatedProduct = (index) => {
    setRelatedProducts(relatedProducts.filter((_, i) => i !== index));
    if (arRelatedProducts.length) {
      setArRelatedProducts(arRelatedProducts.filter((_, i) => i !== index));
    }
  };

  // ── 4. SUBMIT TO REAL DATABASE (Multilingual Payload) ──
  const handleSubmit = async (targetStatus) => {
    if (!formData.title.trim()) {
      alert("Please enter the Product Title / Name in English.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const enPayload = {
        title: formData.title,
        gradeValue: formData.gradeValue,
        categoryTag: formData.categoryTag,
        primaryIndustry: formData.primaryIndustry,
        shortOverview: formData.shortOverview,
        aboutTitle: formData.aboutTitle || `About ${formData.title}`,
        aboutOverview: formData.aboutOverview,
        card1Title: formData.card1Title,
        manufacturingProcess: formData.manufacturingProcess,
        card2Title: formData.card2Title,
        packagingLogistics: formData.packagingLogistics,
        card3Title: formData.card3Title,
        safetyHandling: formData.safetyHandling,
        card4Title: formData.card4Title,
        bulkPricing: formData.bulkPricing,
        whyChooseTitle: formData.whyChooseTitle,
        whyChooseLeela: formData.whyChooseLeela,
        applicationTags: appTags,
        features,
        applicationCards,
        faqs,
        relatedHeading,
        relatedProducts,
      };

      // Ensure Arabic is populated
      let arPayload = arFormData.title ? {
        title: arFormData.title,
        gradeValue: arFormData.gradeValue || formData.gradeValue,
        categoryTag: arFormData.categoryTag || formData.categoryTag,
        primaryIndustry: arFormData.primaryIndustry || formData.primaryIndustry,
        shortOverview: arFormData.shortOverview,
        aboutTitle: arFormData.aboutTitle || `عن ${arFormData.title || formData.title}`,
        aboutOverview: arFormData.aboutOverview,
        card1Title: arFormData.card1Title,
        manufacturingProcess: arFormData.manufacturingProcess,
        card2Title: arFormData.card2Title,
        packagingLogistics: arFormData.packagingLogistics,
        card3Title: arFormData.card3Title,
        safetyHandling: arFormData.safetyHandling,
        card4Title: arFormData.card4Title,
        bulkPricing: arFormData.bulkPricing,
        whyChooseTitle: arFormData.whyChooseTitle,
        whyChooseLeela: arFormData.whyChooseLeela,
        applicationTags: arAppTags.length ? arAppTags : appTags,
        features: arFeatures.length ? arFeatures : features,
        applicationCards: arApplicationCards.length ? arApplicationCards : applicationCards,
        faqs: arFaqs.length ? arFaqs : faqs,
        relatedHeading: arRelatedHeading || "منتجات ذات صلة",
        relatedProducts: arRelatedProducts.length ? arRelatedProducts : relatedProducts,
      } : null;

      // Auto-translate on the fly if admin didn't manually hit Translate button
      if (!arPayload || !arPayload.title) {
        try {
          const transRes = await apiRequest("/translate", {
            method: "POST",
            body: { payload: enPayload, targetLang: "ar" },
          });
          if (transRes.success && transRes.data) {
            arPayload = transRes.data;
          }
        } catch (tErr) {
          console.error("Silent auto-translate fallback:", tErr);
        }
      }

      const fullPayload = {
        title: formData.title,
        code: formData.code,
        casNumber: formData.casNumber,
        inciName: formData.inciName,
        hsCode: formData.hsCode,
        chemicalFormula: formData.chemicalFormula,
        images: productImages,
        tdsUrl: formData.tdsUrl,
        tdsFileName: formData.tdsFileName,
        status: targetStatus || formData.status,
        featured: formData.featured,
        primaryIndustry: formData.primaryIndustry,
        categoryTag: formData.categoryTag,
        en: enPayload,
        ar: arPayload || enPayload,
      };

      const res = await apiRequest("/products", {
        method: "POST",
        body: fullPayload,
      });

      if (res.success) {
        setSuccessMsg(`Product "${formData.title}" saved successfully to database with English & Arabic translations!`);
        setTimeout(() => {
          router.push("/admin/products");
        }, 1500);
      }
    } catch (err) {
      console.error("Save Product Error:", err);
      setErrorMsg(err.message || "Failed to save product to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HEADER ROW: Back Button, Title, Language Tabs, 1-Click Translate & Publish
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 mb-1">
              <Link href="/admin/products" className="hover:text-gold-dark flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Products
              </Link>
              <span>&gt;</span>
              <span className="text-gray-900 font-semibold">Add New Product</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>Add New Product Listing</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${formData.status === "Published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                {formData.status === "Published" ? "● Ready to Publish" : "● Draft Mode"}
              </span>
            </h1>
          </div>

          {/* Action Buttons: 1-Click Auto Translate, Save Draft & Publish */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* 1-Click Auto Translate Button */}
            <button
              type="button"
              disabled={isTranslating}
              onClick={handleAutoTranslate}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-xl text-xs shadow-xs transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
              title="Automatically translates all English fields to Arabic"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>✨ Auto-Translate to Arabic</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit("Draft")}
              className="px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Save className="w-3.5 h-3.5 text-gray-500" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit("Published")}
              className="px-5 py-2 bg-[#d6b92a] text-black font-extrabold hover:bg-gold-dark hover:text-white rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Publish Product</span>
            </button>
          </div>
        </div>

        {/* ── Language Switcher Tabs ── */}
        <div className="flex items-center justify-between bg-gray-50/80 p-1.5 rounded-xl border border-gray-200/80">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveLang("en")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${activeLang === "en"
                  ? "bg-white text-gray-900 shadow-2xs border border-gray-200"
                  : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <span>🇬🇧 English (Original Form)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLang("ar")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${activeLang === "ar"
                  ? "bg-[#fdfaf0] text-gold-dark shadow-2xs border border-gold-main/40"
                  : "text-gray-500 hover:text-gray-900"
                }`}
            >
              <span>🇦🇪 Arabic (العربية)</span>
              {hasTranslated && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Auto-translated" />
              )}
            </button>
          </div>

          <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
            {activeLang === "en"
              ? "Fill form in English. Click Auto-Translate to generate Arabic."
              : "Viewing auto-translated Arabic fields. You can fine-tune if needed."}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 1: HERO & GENERAL PRODUCT INFORMATION
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-extrabold text-gray-900 flex items-center gap-2">
              <span>1. Hero & Identification Information</span>
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase font-bold">
                {activeLang.toUpperCase()}
              </span>
            </h2>
            <p className="text-[11px] text-gray-400 font-medium">
              Matches product hero banner title, category badge, and grade indicator on frontend.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Product Name / Title */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Product Title / Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={curForm.title}
              onChange={(e) => setCurForm({ ...curForm, title: e.target.value })}
              placeholder={activeLang === "en" ? "e.g. Cocamidopropyl Betaine (CAPB 35%)" : "مثال: كوكاميدوبروبيل بيتين (CAPB 35%)"}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-gold-main transition-all"
            />
          </div>

          {/* Product SKU / Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Product Code / SKU
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. PRD-001 or CAPB-35"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-gold-main transition-all"
            />
          </div>

          {/* Primary Industry Category (Luxury Theme Custom Dropdown) */}
          <div className="space-y-1.5 relative" ref={industryDropdownRef}>
            <label className="text-xs font-bold text-gray-700 block">
              Primary Industry <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsIndustryDropdownOpen((prev) => !prev)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 hover:border-gold-main/60 focus:bg-white focus:outline-none focus:border-gold-main transition-all flex items-center justify-between cursor-pointer"
            >
              <span className="truncate">{formData.primaryIndustry || "Select Primary Industry"}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${isIndustryDropdownOpen ? "rotate-180 text-gold-dark" : ""}`} />
            </button>

            {isIndustryDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gold-main/40 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto py-1.5 animate-[fadeIn_0.15s_ease-out] [scrollbar-width:thin]">
                {OFFICIAL_INDUSTRIES.map((ind) => {
                  const isSelected = formData.primaryIndustry === ind;
                  return (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, primaryIndustry: ind });
                        setIsIndustryDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${isSelected
                          ? "bg-gold-main/15 text-gold-dark font-bold border-l-3 border-gold-main"
                          : "text-gray-700 hover:bg-gold-main/10 hover:text-gold-dark"
                        }`}
                    >
                      <span className="truncate">{ind}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Tag Badge */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Category Tag Badge <span className="text-gray-400 font-normal">(e.g. SURFACTANTS)</span>
            </label>
            <input
              type="text"
              value={curForm.categoryTag}
              onChange={(e) => setCurForm({ ...curForm, categoryTag: e.target.value.toUpperCase() })}
              placeholder="e.g. SURFACTANTS, ACIDS, SOLVENTS"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 uppercase focus:bg-white focus:outline-none focus:border-gold-main transition-all"
            />
          </div>

          {/* Product Grade Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Product Grade Value <span className="text-gray-400 font-normal">(e.g. ELSURFAC™ CAB45)</span>
            </label>
            <input
              type="text"
              value={curForm.gradeValue || formData.gradeValue}
              onChange={(e) => {
                if (activeLang === "en") setFormData({ ...formData, gradeValue: e.target.value });
                else setArFormData({ ...arFormData, gradeValue: e.target.value });
              }}
              placeholder="e.g. ELSURFAC™ CAB45 or Industrial Grade 99%"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main transition-all"
            />
          </div>

          {/* Short Overview / Intro Paragraph */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Hero Short Overview Description
            </label>
            <textarea
              rows={3}
              value={curForm.shortOverview}
              onChange={(e) => setCurForm({ ...curForm, shortOverview: e.target.value })}
              placeholder={activeLang === "en" ? "Mild amphoteric surfactant derived from coconut oil..." : "خافض للتوتر السطحي أمفوتيري خفيف مشتق من زيت جوز الهند..."}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-main transition-all"
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 1B: PRODUCT PRIMARY IMAGE UPLOAD
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-extrabold text-gray-900">
              Product Primary Image
            </h2>
            <p className="text-[11px] text-gray-400 font-medium">
              Upload the high-resolution showcase image for the product hero banner and listings.
            </p>
          </div>
        </div>

        {/* Single Image Preview / Upload Area */}
        {productImages.length > 0 ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50/80 border border-gray-200 rounded-2xl">
            <div className="relative w-28 h-28 rounded-xl border-2 border-gold-main/40 overflow-hidden bg-white shrink-0 shadow-sm">
              <img src={productImages[0]} alt="Product Preview" className="w-full h-full object-cover" />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-gold-main text-black text-[9px] font-extrabold rounded shadow-xs">
                Active Image
              </span>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-xs font-bold text-gray-800 break-all">
                {productImages[0]}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <label className="px-3.5 py-1.5 bg-white border border-gray-200 hover:border-gold-main text-gray-700 hover:text-gold-dark font-bold text-xs rounded-xl cursor-pointer transition-all shadow-2xs inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImages}
                    className="hidden"
                    onChange={handleUploadProductImages}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setProductImages([])}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 transition-all inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Drag & Drop Single Zone */}
            <label className="flex flex-col items-center justify-center w-full h-32 bg-gray-50/80 border-2 border-dashed border-gray-200 hover:border-gold-main/50 rounded-xl cursor-pointer transition-all hover:bg-[#fdfaf0]/30">
              <div className="flex flex-col items-center gap-2 py-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                  {isUploadingImages ? (
                    <Loader2 className="w-4 h-4 text-gold-dark animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-gray-700 block">
                    {isUploadingImages ? "Uploading to Cloudinary..." : "Click to upload product primary image"}
                  </span>
                  <span className="text-[11px] text-gray-400">PNG, JPG, WEBP stored directly on Cloudinary CDN</span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                disabled={isUploadingImages}
                className="hidden"
                onChange={handleUploadProductImages}
              />
            </label>

            {/* OR Image URL Input */}
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Or paste direct image URL here (e.g. https://example.com/product.jpg)"
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main transition-all pr-20"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (imageUrlInput.trim()) {
                    setProductImages([imageUrlInput.trim()]);
                    setImageUrlInput("");
                  }
                }}
                className="px-4 py-2.5 bg-black text-gold-main font-bold text-xs rounded-xl hover:bg-gray-900 shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set Image</span>
              </button>
            </div>
          </div>
        )}

        {/* TDS / Technical Doc Upload */}
        <div className="space-y-2.5 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 block">
            Technical Data Sheet (TDS) Document <span className="text-gray-400 font-normal">(Optional - Upload PDF or paste URL)</span>
          </label>

          {formData.tdsFileName && (
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-emerald-800 truncate flex-1">{formData.tdsFileName}</span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, tdsFileName: "", tdsUrl: "" })}
                className="text-emerald-600 hover:text-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-all flex items-center gap-1.5 shrink-0">
              {isUploadingTds ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-dark" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-gray-500" />
              )}
              <span>{isUploadingTds ? "Uploading PDF..." : "Upload PDF"}</span>
              <input
                type="file"
                accept=".pdf"
                disabled={isUploadingTds}
                className="hidden"
                onChange={handleUploadTdsDoc}
              />
            </label>

            <span className="text-[11px] text-gray-400 font-semibold">or</span>

            <div className="flex-1 relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={formData.tdsUrl}
                onChange={(e) => setFormData({ ...formData, tdsUrl: e.target.value, tdsFileName: "" })}
                placeholder="Paste TDS PDF URL here..."
                className="w-full p-2 pl-9 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 2: 4 KEY SPECIFICATION BOXES
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-extrabold text-gray-900">
              2. Chemical Codes & Technical Quick Specs (4 Boxes)
            </h2>
            <p className="text-[11px] text-gray-400 font-medium">
              These 4 values render as prominent technical summary cards on the product detail hero.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CAS NUMBER */}
          <div className="space-y-1.5 bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/80">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Box 1: CAS NUMBER
            </span>
            <input
              type="text"
              value={formData.casNumber}
              onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
              placeholder="e.g. 61789-40-0"
              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-gold-main"
            />
          </div>

          {/* INCI NAME */}
          <div className="space-y-1.5 bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/80">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Box 2: INCI NAME
            </span>
            <input
              type="text"
              value={formData.inciName}
              onChange={(e) => setFormData({ ...formData, inciName: e.target.value })}
              placeholder="e.g. Coco Amido Propyl Betaine"
              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-gold-main"
            />
          </div>

          {/* HS CODE */}
          <div className="space-y-1.5 bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/80">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Box 3: HS CODE
            </span>
            <input
              type="text"
              value={formData.hsCode}
              onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
              placeholder="e.g. 3402.19.00"
              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-gold-main"
            />
          </div>

          {/* CHEMICAL FORMULA */}
          <div className="space-y-1.5 bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/80">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Box 4: CHEMICAL FORMULA
            </span>
            <input
              type="text"
              value={formData.chemicalFormula}
              onChange={(e) => setFormData({ ...formData, chemicalFormula: e.target.value })}
              placeholder="e.g. C19H38N2O3"
              className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-gold-main"
            />
          </div>
        </div>

        {/* Industry Application Tags */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 block">
            Industry Applications Tags <span className="text-gray-400 font-normal">({activeLang.toUpperCase()} - Shows as pill badges on Hero)</span>
          </label>
          <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
            {curAppTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 shadow-2xs"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="+ Add tag (press Enter)..."
                className="px-3 py-1 bg-transparent border-none text-xs text-gray-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-2.5 py-1 bg-black text-gold-main rounded-lg text-[11px] font-bold hover:bg-gray-900"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 3: ABOUT SECTION & OPERATIONAL SUPPLY DETAILS (4 Operational Cards)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-extrabold text-gray-900">
              3. About Product & Supply Chain Details (4 Operational Cards)
            </h2>
            <p className="text-[11px] text-gray-400 font-medium">
              Detailed chemical formulation background, FDA/TSCA compliance, logistics and pricing breakdown.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* About Section Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              About Section Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={curForm.aboutTitle}
              onChange={(e) => setCurForm({ ...curForm, aboutTitle: e.target.value })}
              placeholder={activeLang === "en" ? "e.g. About Cocamidopropyl Betaine (CAPB)" : "مثال: عن كوكاميدوبروبيل بيتين (CAPB)"}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-heading font-extrabold text-gray-900 focus:bg-white focus:outline-none focus:border-gold-main transition-all"
            />
          </div>

          {/* Detailed Overview Paragraphs */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              About Full Description <span className="text-gray-400 font-normal">(Formulation, TSCA, FDA 21 CFR compliance)</span>
            </label>
            <textarea
              rows={4}
              value={curForm.aboutOverview}
              onChange={(e) => setCurForm({ ...curForm, aboutOverview: e.target.value })}
              placeholder={activeLang === "en" ? "Cocamidopropyl Betaine is an amphoteric surfactant produced from coconut oil fatty acids..." : "كوكاميدوبروبيل بيتين هو خافض للتوتر السطحي أمفوتيري..."}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-main transition-all"
            />
          </div>

          {/* 4 Operational Cards (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Card 1: Manufacturing Process */}
            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold-main shrink-0" />
                <input
                  type="text"
                  value={curForm.card1Title}
                  onChange={(e) => setCurForm({ ...curForm, card1Title: e.target.value })}
                  placeholder="Manufacturing Process"
                  className="flex-1 text-xs font-extrabold text-gray-900 bg-transparent border-none focus:outline-none focus:underline decoration-gold-main"
                />
              </div>
              <textarea
                rows={3}
                value={curForm.manufacturingProcess}
                onChange={(e) => setCurForm({ ...curForm, manufacturingProcess: e.target.value })}
                placeholder="Produced through a two-step reaction..."
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
              />
            </div>

            {/* Card 2: Packaging & Logistics */}
            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold-main shrink-0" />
                <input
                  type="text"
                  value={curForm.card2Title}
                  onChange={(e) => setCurForm({ ...curForm, card2Title: e.target.value })}
                  placeholder="Packaging & Logistics"
                  className="flex-1 text-xs font-extrabold text-gray-900 bg-transparent border-none focus:outline-none focus:underline decoration-gold-main"
                />
              </div>
              <textarea
                rows={3}
                value={curForm.packagingLogistics}
                onChange={(e) => setCurForm({ ...curForm, packagingLogistics: e.target.value })}
                placeholder="CAPB ships in HDPE drums for standard orders..."
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
              />
            </div>

            {/* Card 3: Safety & Handling */}
            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold-main shrink-0" />
                <input
                  type="text"
                  value={curForm.card3Title}
                  onChange={(e) => setCurForm({ ...curForm, card3Title: e.target.value })}
                  placeholder="Safety & Handling"
                  className="flex-1 text-xs font-extrabold text-gray-900 bg-transparent border-none focus:outline-none focus:underline decoration-gold-main"
                />
              </div>
              <textarea
                rows={3}
                value={curForm.safetyHandling}
                onChange={(e) => setCurForm({ ...curForm, safetyHandling: e.target.value })}
                placeholder="Generally well-tolerated in finished cosmetic formulations..."
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
              />
            </div>

            {/* Card 4: Bulk Pricing & Procurement */}
            <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold-main shrink-0" />
                <input
                  type="text"
                  value={curForm.card4Title}
                  onChange={(e) => setCurForm({ ...curForm, card4Title: e.target.value })}
                  placeholder="Bulk Pricing & Procurement"
                  className="flex-1 text-xs font-extrabold text-gray-900 bg-transparent border-none focus:outline-none focus:underline decoration-gold-main"
                />
              </div>
              <textarea
                rows={3}
                value={curForm.bulkPricing}
                onChange={(e) => setCurForm({ ...curForm, bulkPricing: e.target.value })}
                placeholder="CAPB pricing reflects a stack of factors..."
                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
              />
            </div>
          </div>

          {/* Bottom Card: Why Choose Leela Gulf */}
          <div className="p-4 bg-[#fdfaf0] border border-gold-main/40 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
              <input
                type="text"
                value={curForm.whyChooseTitle}
                onChange={(e) => setCurForm({ ...curForm, whyChooseTitle: e.target.value })}
                placeholder="Why Choose Leela Gulf as a Trusted Supplier?"
                className="flex-1 text-xs font-extrabold text-gold-dark bg-transparent border-none focus:outline-none focus:underline decoration-gold-main"
              />
            </div>
            <textarea
              rows={3}
              value={curForm.whyChooseLeela}
              onChange={(e) => setCurForm({ ...curForm, whyChooseLeela: e.target.value })}
              placeholder="Leela Gulf makes procurement straightforward for personal care formulators..."
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 4: PRODUCT FEATURES SHOWCASE (01 - 05 Cards)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-extrabold text-gray-900">
                4. Product Features Showcase (01 - 05 Cards)
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Numbered feature highlights with custom icons displayed in Section 3 of frontend.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddFeature}
            className="flex items-center gap-1 px-3 py-1.5 bg-black text-gold-main font-bold text-xs rounded-xl hover:bg-gray-900 shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Feature</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {curFeatures.map((feat, idx) => {
            const iconPreview = renderFeatureBadgeIcon(feat.icon);

            return (
              <div
                key={feat.id}
                className="relative bg-white border border-gray-200 rounded-2xl shadow-2xs hover:border-gold-main/50 transition-all group z-10 hover:z-20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 p-3 bg-gray-50/70 border-b border-gray-100 rounded-t-2xl">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center shrink-0 shadow-2xs">
                        {iconPreview}
                      </div>
                      <span className="text-xs font-mono font-extrabold text-gold-dark bg-[#fdfaf0] px-2 py-0.5 rounded-lg border border-gold-main/30">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                      <FeatureIconSelect
                        value={feat.icon}
                        onChange={(newIcon) => handleFeatureChange(idx, "icon", newIcon)}
                      />

                      {curFeatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0 cursor-pointer"
                          title="Remove feature"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Feature Title</label>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                        placeholder="e.g. Active Foaming Action"
                        className="w-full p-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-extrabold text-gray-900 focus:outline-none focus:border-gold-main focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Feature Description</label>
                      <textarea
                        rows={3}
                        value={feat.description}
                        onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                        placeholder="Describe key benefits, performance, or chemical properties..."
                        className="w-full p-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs text-gray-700 leading-relaxed focus:outline-none focus:border-gold-main focus:bg-white transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 5: INDUSTRY APPLICATIONS (Alternating Left-Right Cards)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-extrabold text-gray-900">
                5. Industry Applications (Alternating Left-Right Cards)
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Each card shows on the frontend as an alternating image + text layout with bullet points.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const newCard = {
                id: Date.now(),
                industry: "",
                badge: "",
                bullets: [""],
                imageUrl: ""
              };
              setApplicationCards([...applicationCards, newCard]);
              if (arApplicationCards.length) {
                setArApplicationCards([...arApplicationCards, { ...newCard }]);
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-black text-gold-main font-bold text-xs rounded-xl hover:bg-gray-900 shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>

        <div className="space-y-4">
          {curAppCards.map((card, cardIdx) => {
            const isEven = cardIdx % 2 === 0;
            return (
              <div
                key={card.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs hover:border-gold-main/40 transition-all"
              >
                <div className="flex items-center justify-between p-3.5 bg-gray-50/60 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-extrabold text-gold-dark bg-[#fdfaf0] px-2 py-0.5 rounded border border-gold-main/30">
                      {String(cardIdx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-0.5 bg-gray-100 rounded">
                      {isEven ? "Image Left → Text Right" : "Text Left ← Image Right"}
                    </span>
                  </div>

                  {applicationCards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setApplicationCards(applicationCards.filter((_, i) => i !== cardIdx));
                        if (arApplicationCards.length) {
                          setArApplicationCards(arApplicationCards.filter((_, i) => i !== cardIdx));
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Remove application card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Industry Name
                      </label>
                      <input
                        type="text"
                        value={card.industry}
                        onChange={(e) => handleAppCardChange(cardIdx, "industry", e.target.value)}
                        placeholder="e.g. Personal Care"
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-extrabold text-gray-900 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Badge Tag
                      </label>
                      <input
                        type="text"
                        value={card.badge}
                        onChange={(e) => handleAppCardChange(cardIdx, "badge", e.target.value.toUpperCase())}
                        placeholder="e.g. COSMETICS"
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 uppercase focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Card Image
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 cursor-pointer transition-all flex items-center gap-1 shrink-0">
                          {uploadingCardIdx === cardIdx ? (
                            <Loader2 className="w-3 h-3 animate-spin text-gold-dark" />
                          ) : (
                            <Upload className="w-3 h-3 text-gray-500" />
                          )}
                          <span>{uploadingCardIdx === cardIdx ? "Uploading..." : "Upload"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingCardIdx === cardIdx}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadCardImage(cardIdx, file);
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={card.imageUrl || ""}
                          onChange={(e) => handleAppCardChange(cardIdx, "imageUrl", e.target.value)}
                          placeholder="or paste image URL..."
                          className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                        />
                        {card.imageUrl && (
                          <div className="relative w-9 h-9 rounded-lg border border-gray-200 overflow-hidden shrink-0 group/img">
                            <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleAppCardChange(cardIdx, "imageUrl", "")}
                              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Bullet Points (shown with checkmarks on frontend)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(cardIdx)}
                        className="text-[11px] font-bold text-gold-dark hover:text-gold-main flex items-center gap-0.5 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>
                    <div className="space-y-2">
                      {card.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="text-gold-main mt-2 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => handleAppBulletChange(cardIdx, bIdx, e.target.value)}
                            placeholder={`Bullet point ${bIdx + 1}...`}
                            className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                          />
                          {card.bullets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBullet(cardIdx, bIdx)}
                              className="p-1 text-gray-400 hover:text-rose-600 transition-colors mt-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 6: FAQS & RELATED PRODUCTS (2-COLUMN SPLIT MATCHING FRONTEND)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Frequently Asked Questions */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-heading font-extrabold text-gray-900 truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-gold-main rounded-full inline-block shrink-0" />
                  Frequently Asked Questions
                </h2>
                <p className="text-[11px] text-gray-400 font-medium truncate">
                  Accordion on frontend product detail page
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className="px-3 py-1.5 bg-black text-gold-main font-extrabold text-xs rounded-xl hover:bg-gray-900 shadow-2xs transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {curFaqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-4 bg-gray-50/70 border border-gray-200/90 rounded-xl space-y-3 relative group hover:border-gold-main/40 hover:bg-[#fdfaf0]/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-extrabold text-gold-dark bg-[#fdfaf0] px-2.5 py-0.5 rounded-md border border-gold-main/30">
                    FAQ #{String(idx + 1).padStart(2, "0")}
                  </span>
                  {faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Question Text <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                    placeholder="e.g. What is the active matter percentage?"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-gold-main transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Answer Content <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                    placeholder="Type detailed answer for buyers..."
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 leading-relaxed focus:outline-none focus:border-gold-main transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Related Products / Surfactants */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3.5 bg-gold-main rounded-full inline-block shrink-0" />
                  <input
                    type="text"
                    value={curRelatedHeading}
                    onChange={(e) => {
                      if (activeLang === "en") setRelatedHeading(e.target.value);
                      else setArRelatedHeading(e.target.value);
                    }}
                    placeholder="Related Surfactants"
                    className="text-sm font-heading font-extrabold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-gold-main focus:outline-none px-0 py-0.5 truncate"
                    title="Click to edit section heading"
                  />
                </div>
                <p className="text-[11px] text-gray-400 font-medium truncate">
                  Right-column product cards stack on frontend
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddRelatedProduct}
              className="px-3 py-1.5 bg-black text-gold-main font-extrabold text-xs rounded-xl hover:bg-gray-900 shadow-2xs transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {curRelatedProducts.map((rel, idx) => (
              <div
                key={rel.id}
                className="p-4 bg-gray-50/70 border border-gray-200/90 rounded-xl space-y-3 relative group hover:border-gold-main/40 hover:bg-[#fdfaf0]/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-extrabold text-gold-dark bg-[#fdfaf0] px-2.5 py-0.5 rounded-md border border-gold-main/30">
                    Product #{String(idx + 1).padStart(2, "0")}
                  </span>
                  {relatedProducts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRelatedProduct(idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Remove Related Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Category Tag <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={rel.categoryTag}
                      onChange={(e) => handleRelatedProductChange(idx, "categoryTag", e.target.value.toUpperCase())}
                      placeholder="e.g. ANIONIC SURFACTANT"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-extrabold text-gray-800 uppercase focus:outline-none focus:border-gold-main transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Redirect Slug / URL <span className="text-gray-400 font-normal">(e.g. sles-70)</span>
                    </label>
                    <input
                      type="text"
                      value={rel.slug || ""}
                      onChange={(e) => handleRelatedProductChange(idx, "slug", e.target.value)}
                      placeholder="e.g. sles-70 or /products/sles-70"
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-800 focus:outline-none focus:border-gold-main transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Product Name / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={rel.title}
                    onChange={(e) => handleRelatedProductChange(idx, "title", e.target.value)}
                    placeholder="e.g. Sodium Laureth Sulfate (SLES 70%)"
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-gold-main transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Short Description / Pairing Notes <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={rel.description}
                    onChange={(e) => handleRelatedProductChange(idx, "description", e.target.value)}
                    placeholder="e.g. A highly effective foaming agent commonly paired with CAPB in shampoo..."
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 leading-relaxed focus:outline-none focus:border-gold-main transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          FINAL ACTION BAR
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-gray-900 block">
              Listing Status
            </span>
            <span className="text-[11px] text-gray-400">
              {formData.status === "Published" ? "Visible to global clients on website" : "Hidden in admin draft queue"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: "Published" })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.status === "Published"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-black"
                }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: "Draft" })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.status === "Draft"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "text-gray-600 hover:text-black"
                }`}
            >
              Draft
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(formData.status)}
            className="px-6 py-2.5 bg-[#d6b92a] text-black font-extrabold hover:bg-gold-dark hover:text-white rounded-xl text-xs shadow-xs transition-all flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{formData.status === "Published" ? "Publish Product Now" : "Save as Draft"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
