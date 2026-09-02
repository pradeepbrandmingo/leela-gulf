"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
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
  ExternalLink,
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
  UploadCloud,
  LayoutGrid
} from "lucide-react";

// Official 11 Leela Gulf Industries
const OFFICIAL_INDUSTRIES = [
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
const INDUSTRY_OPTIONS = OFFICIAL_INDUSTRIES;

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

function FeatureIconSelect({ value, onChange, isOpen, onToggle, onClose }) {
  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" | "custom"
  const [iconSearch, setIconSearch] = useState("");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [savedIcons, setSavedIcons] = useState([]);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSavedIcons(getSavedCustomIcons());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const isCustomUrl =
    typeof value === "string" &&
    (value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/uploads/") ||
      value.startsWith("data:image/") ||
      value.includes(".svg") ||
      value.includes(".png") ||
      value.includes(".webp"));

  const isFontAwesome =
    typeof value === "string" &&
    (value.includes("fa-") ||
      value.startsWith("fa ") ||
      value.startsWith("fas ") ||
      value.startsWith("far ") ||
      value.startsWith("fab "));

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
        onClose?.();
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
    let url = customUrlInput.trim();
    const match = url.match(/class=["']([^"']+)["']/i);
    if (match) url = match[1];

    if (url.startsWith("http") || url.startsWith("/uploads") || url.includes(".png") || url.includes(".svg") || url.includes("fa-")) {
      saveCustomIconToStorage(url);
      setSavedIcons(getSavedCustomIcons());
    }
    onChange(url);
    setCustomUrlInput("");
    onClose?.();
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
        onClick={onToggle}
        className="flex items-center gap-1.5 px-2 py-1.5 bg-white border border-gray-200 hover:border-gold-main/60 focus:border-gold-main rounded-xl text-xs font-semibold text-gray-800 shadow-2xs transition-all cursor-pointer w-full max-w-[165px] justify-between"
      >
        <div className="flex items-center gap-1.5 truncate min-w-0">
          {isCustomUrl ? (
            <img
              src={value}
              alt="Custom Icon"
              className="w-3.5 h-3.5 object-contain rounded shrink-0 [filter:brightness(0)_saturate(100%)_invert(74%)_sepia(85%)_saturate(380%)_hue-rotate(5deg)_brightness(95%)_contrast(85%)]"
            />
          ) : isFontAwesome ? (
            <i className={`${value.replace(/[<>]/g, "").trim()} text-gold-dark text-xs shrink-0`} />
          ) : (
            <SelectedIcon className="w-3.5 h-3.5 text-gold-dark shrink-0" />
          )}
          <span className="truncate text-[11px] font-heading font-bold text-gray-800">
            {isCustomUrl ? "Custom Icon" : isFontAwesome ? value.split(" ").pop() : selectedPreset ? selectedPreset.label.split("/")[0].trim() : "Sparkles"}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-gold-dark" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-72 sm:w-80 max-w-[calc(100vw-32px)] bg-white border border-gold-main/40 rounded-2xl shadow-2xl z-[100] p-3 animate-[fadeIn_0.15s_ease-out]">
          {/* Header Tab Switcher with Vector Icons Only (Zero Emojis) */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-200 rounded-xl mb-2.5">
            <button
              type="button"
              onClick={() => setActiveTab("catalog")}
              className={`flex-1 py-1.5 text-[10px] font-heading font-bold rounded-lg transition-all inline-flex items-center justify-center gap-1.5 ${
                activeTab === "catalog"
                  ? "bg-white text-gold-dark shadow-xs border border-gold-main/30"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span>30+ Icons Catalog</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`flex-1 py-1.5 text-[10px] font-heading font-bold rounded-lg transition-all inline-flex items-center justify-center gap-1.5 ${
                activeTab === "custom"
                  ? "bg-white text-gold-dark shadow-xs border border-gold-main/30"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span>Custom / FA {savedIcons.length > 0 ? `(${savedIcons.length})` : ""}</span>
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
                          onClose?.();
                        }}
                        className={`w-full px-2.5 py-1.5 text-left text-xs font-medium rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                          isItemSel
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
                    <div className="inline-flex items-center gap-1 text-[10px] font-heading font-extrabold text-gold-dark">
                      <UploadCloud className="w-3 h-3 text-gold-dark shrink-0" />
                      <span>Saved Uploaded Icons ({savedIcons.length}):</span>
                    </div>
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
                          onClose?.();
                        }}
                        className={`h-12 rounded-xl bg-white border flex items-center justify-center p-1.5 hover:border-gold-main hover:scale-105 transition-all cursor-pointer shadow-xs ${
                          value === iconUrl
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

              {/* Paste Direct FontAwesome Class or Image URL */}
              <div className="space-y-1 pt-1 border-t border-gray-100">
                <label className="text-[10px] font-heading font-bold text-gray-600">
                  Or Paste FontAwesome Class / Image URL:
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="e.g. fa-regular fa-house or https://...svg"
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

// Slug generator
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [activeLang, setActiveLang] = useState("en"); // "en" | "ar"
  const [slug, setSlug] = useState("");
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingTds, setIsUploadingTds] = useState(false);
  const [uploadingCardIdx, setUploadingCardIdx] = useState(null);
  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [openFeatureDropdownIdx, setOpenFeatureDropdownIdx] = useState(null);
  const [productSlug, setProductSlug] = useState("");
  const industryDropdownRef = useRef(null);

  // Auto-generate slug when English title changes
  const handleTitleChange = (val) => {
    if (activeLang === "en") {
      setFormData((prev) => ({ ...prev, title: val }));
      if (!isSlugCustom) {
        setSlug(slugify(val));
      }
    } else {
      setArFormData((prev) => ({ ...prev, title: val }));
    }
  };

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

  // Form Data (English & Universal Specs)
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    casNumber: "",
    inciName: "",
    hsCode: "",
    chemicalFormula: "",
    gradeValue: "",
    categoryTag: "",
    primaryIndustry: "Industrial Chemicals",
    shortOverview: "",
    status: "Published",
    featured: true,
    tdsUrl: "",
    tdsFileName: "",
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

  // Arabic Form Data
  const [arFormData, setArFormData] = useState({
    title: "",
    categoryTag: "",
    primaryIndustry: "",
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

  const [appTags, setAppTags] = useState([]);
  const [arAppTags, setArAppTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");

  const [features, setFeatures] = useState([]);
  const [arFeatures, setArFeatures] = useState([]);

  const [applicationCards, setApplicationCards] = useState([]);
  const [arApplicationCards, setArApplicationCards] = useState([]);

  const [faqs, setFaqs] = useState([]);
  const [arFaqs, setArFaqs] = useState([]);

  const [relatedHeading, setRelatedHeading] = useState("Related Surfactants");
  const [arRelatedHeading, setArRelatedHeading] = useState("منتجات ذات صلة");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [arRelatedProducts, setArRelatedProducts] = useState([]);

  // Fetch Existing Product from Database
  useEffect(() => {
    async function loadExistingProduct() {
      if (!productId) return;
      setIsLoadingProduct(true);
      setErrorMsg("");
      try {
        const res = await apiRequest(`/products/${productId}`);
        if (res?.success && res?.data) {
          const p = res.data;
          setProductSlug(p.slug || p._id);
          setSlug(p.slug || slugify(p.en?.title || p.title || ""));

          const en = p.en || {};
          const ar = p.ar || {};

          setFormData({
            title: en.title || p.title || "",
            code: p.code || "",
            casNumber: p.casNumber || "",
            inciName: p.inciName || "",
            hsCode: p.hsCode || "",
            chemicalFormula: p.chemicalFormula || "",
            gradeValue: en.gradeValue || p.gradeValue || "",
            categoryTag: en.categoryTag || p.categoryTag || "",
            primaryIndustry: p.primaryIndustry || en.primaryIndustry || "Industrial Chemicals",
            shortOverview: en.shortOverview || "",
            status: p.status || "Published",
            featured: Boolean(p.featured),
            tdsUrl: p.tdsUrl || "",
            tdsFileName: p.tdsFileName || (p.tdsUrl ? "Uploaded-TDS-Document.pdf" : ""),
            aboutTitle: en.aboutTitle || "",
            aboutOverview: en.aboutOverview || "",
            card1Title: en.card1Title || "Manufacturing Process",
            manufacturingProcess: en.manufacturingProcess || "",
            card2Title: en.card2Title || "Packaging & Logistics",
            packagingLogistics: en.packagingLogistics || "",
            card3Title: en.card3Title || "Safety & Handling",
            safetyHandling: en.safetyHandling || "",
            card4Title: en.card4Title || "Bulk Pricing & Procurement",
            bulkPricing: en.bulkPricing || "",
            whyChooseTitle: en.whyChooseTitle || "Why Choose Leela Gulf as a Trusted Supplier?",
            whyChooseLeela: en.whyChooseLeela || "",
          });

          setArFormData({
            title: ar.title || "",
            categoryTag: ar.categoryTag || "",
            primaryIndustry: ar.primaryIndustry || "",
            gradeValue: ar.gradeValue || "",
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

          setProductImages(p.images?.length ? p.images : []);
          setAppTags(en.applicationTags || []);
          setArAppTags(ar.applicationTags || []);
          setFeatures(en.features || []);
          setArFeatures(ar.features || []);
          setApplicationCards(en.applicationCards || []);
          setArApplicationCards(ar.applicationCards || []);
          setFaqs(en.faqs || []);
          setArFaqs(ar.faqs || []);
          setRelatedHeading(en.relatedHeading || "Related Surfactants");
          setArRelatedHeading(ar.relatedHeading || "منتجات ذات صلة");
          setRelatedProducts(en.relatedProducts || []);
          setArRelatedProducts(ar.relatedProducts || []);
        } else {
          setErrorMsg("Product not found in database.");
        }
      } catch (err) {
        console.error("Load Product Error:", err);
        setErrorMsg("Failed to load product data.");
      } finally {
        setIsLoadingProduct(false);
      }
    }
    loadExistingProduct();
  }, [productId]);

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
        setSuccessMsg("Product image updated to Cloudinary successfully!");
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
        setSuccessMsg("TDS Document uploaded successfully to Cloudinary!");
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
        const updated = [...applicationCards];
        updated[cardIndex].imageUrl = data.data.url;
        setApplicationCards(updated);
        if (arApplicationCards.length > cardIndex) {
          const arUpdated = [...arApplicationCards];
          arUpdated[cardIndex].imageUrl = data.data.url;
          setArApplicationCards(arUpdated);
        }
        setSuccessMsg("Card image uploaded to Cloudinary successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Cloudinary Card Upload Error:", err);
      setErrorMsg("Failed to upload application card image.");
    } finally {
      setUploadingCardIdx(null);
    }
  };

  // Auto-translate Handler (English -> Arabic)
  const handleAutoTranslate = async () => {
    if (!formData.title.trim()) {
      alert("Please enter English Product Title first.");
      return;
    }

    setIsTranslating(true);
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

      const res = await apiRequest("/translate", {
        method: "POST",
        body: { payload: enPayload, targetLang: "ar" },
      });

      if (res.success && res.data) {
        const ar = res.data;
        setArFormData((prev) => ({
          ...prev,
          title: ar.title || "",
          gradeValue: ar.gradeValue || "",
          categoryTag: ar.categoryTag || "",
          primaryIndustry: ar.primaryIndustry || "",
          shortOverview: ar.shortOverview || "",
          aboutTitle: ar.aboutTitle || "",
          aboutOverview: ar.aboutOverview || "",
          card1Title: ar.card1Title || "",
          manufacturingProcess: ar.manufacturingProcess || "",
          card2Title: ar.card2Title || "",
          packagingLogistics: ar.packagingLogistics || "",
          card3Title: ar.card3Title || "",
          safetyHandling: ar.safetyHandling || "",
          card4Title: ar.card4Title || "",
          bulkPricing: ar.bulkPricing || "",
          whyChooseTitle: ar.whyChooseTitle || "",
          whyChooseLeela: ar.whyChooseLeela || "",
        }));

        if (Array.isArray(ar.applicationTags)) setArAppTags(ar.applicationTags);
        if (Array.isArray(ar.features)) setArFeatures(ar.features);
        if (Array.isArray(ar.applicationCards)) setArApplicationCards(ar.applicationCards);
        if (Array.isArray(ar.faqs)) setArFaqs(ar.faqs);
        if (ar.relatedHeading) setArRelatedHeading(ar.relatedHeading);
        if (Array.isArray(ar.relatedProducts)) setArRelatedProducts(ar.relatedProducts);

        setSuccessMsg("Arabic translation generated successfully!");
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error("Auto-translate error:", err);
      setErrorMsg("Translation service unavailable. You can enter Arabic text manually.");
    } finally {
      setIsTranslating(false);
    }
  };

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
        if (!appTags.includes(newTagInput.trim())) setAppTags([...appTags, newTagInput.trim()]);
      } else {
        if (!arAppTags.includes(newTagInput.trim())) setArAppTags([...arAppTags, newTagInput.trim()]);
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    if (activeLang === "en") setAppTags(appTags.filter((t) => t !== tagToRemove));
    else setArAppTags(arAppTags.filter((t) => t !== tagToRemove));
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
    const newFeat = { id: Date.now(), title: "", description: "", icon: "sparkles" };
    setFeatures([...features, newFeat]);
    if (arFeatures.length) setArFeatures([...arFeatures, { ...newFeat }]);
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
    if (arFeatures.length) setArFeatures(arFeatures.filter((_, i) => i !== index));
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
    if (arFaqs.length) setArFaqs([...arFaqs, { ...newFaq }]);
  };

  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
    if (arFaqs.length) setArFaqs(arFaqs.filter((_, i) => i !== index));
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
      updated[cardIndex].bullets.splice(bulletIndex, 1);
      setApplicationCards(updated);
    } else {
      const updated = [...(arApplicationCards.length ? arApplicationCards : applicationCards)];
      updated[cardIndex].bullets.splice(bulletIndex, 1);
      setArApplicationCards(updated);
    }
  };

  const handleAddAppCard = () => {
    const newCard = { id: Date.now(), industry: "", badge: "", imageUrl: "", bullets: [""] };
    setApplicationCards([...applicationCards, newCard]);
    if (arApplicationCards.length) setArApplicationCards([...arApplicationCards, { ...newCard }]);
  };

  const handleRemoveAppCard = (index) => {
    setApplicationCards(applicationCards.filter((_, i) => i !== index));
    if (arApplicationCards.length) setArApplicationCards(arApplicationCards.filter((_, i) => i !== index));
  };

  // Related Product Handlers
  const handleRelatedChange = (index, field, value) => {
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
    const newRel = { id: Date.now(), categoryTag: "", title: "", description: "", slug: "" };
    setRelatedProducts([...relatedProducts, newRel]);
    if (arRelatedProducts.length) setArRelatedProducts([...arRelatedProducts, { ...newRel }]);
  };

  const handleRemoveRelatedProduct = (index) => {
    setRelatedProducts(relatedProducts.filter((_, i) => i !== index));
    if (arRelatedProducts.length) setArRelatedProducts(arRelatedProducts.filter((_, i) => i !== index));
  };

  // Submit Update to Real Database
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

      const fullPayload = {
        title: formData.title,
        slug: slug ? slugify(slug) : slugify(formData.title),
        code: formData.code,
        casNumber: formData.casNumber,
        inciName: formData.inciName,
        hsCode: formData.hsCode,
        chemicalFormula: formData.chemicalFormula,
        primaryIndustry: formData.primaryIndustry,
        categoryTag: formData.categoryTag,
        gradeValue: formData.gradeValue,
        status: targetStatus || formData.status,
        featured: formData.featured,
        images: productImages,
        tdsUrl: formData.tdsUrl,
        tdsFileName: formData.tdsFileName,
        en: enPayload,
        ar: arPayload,
      };

      const res = await apiRequest(`/products/${productId}`, {
        method: "PUT",
        body: fullPayload,
      });

      if (res.success) {
        setSuccessMsg("Product updated successfully!");
        setTimeout(() => {
          router.push("/admin/products");
        }, 1200);
      } else {
        throw new Error(res.message || "Failed to update product.");
      }
    } catch (err) {
      console.error("Update Product Error:", err);
      setErrorMsg(err.message || "Something went wrong while updating product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <Loader2 className="w-8 h-8 text-gold-dark animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-500">Loading product for editing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HEADER ROW: Breadcrumbs, Title, View Live, Translate, Save Draft & Update
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 py-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-gray-400 mb-1">
              <Link href="/admin/products" className="hover:text-gold-dark flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Products
              </Link>
              <span>&gt;</span>
              <span className="text-gray-900 font-bold">Edit Product</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900 tracking-tight">
                Edit Product Listing
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                • Editing Mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Live on Frontend Button */}
            {productSlug && (
              <Link
                href={`/products/${slug || productSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
                title="View this product live on public website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live</span>
              </Link>
            )}

            {/* Re-Translate to Arabic */}
            <button
              type="button"
              disabled={isTranslating}
              onClick={handleAutoTranslate}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Re-translates English fields to Arabic"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <Languages className="w-3.5 h-3.5 text-white" />
                  <span>Re-Translate English to Arabic</span>
                </>
              )}
            </button>

            {/* Save Draft */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit("Draft")}
              className="px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Save className="w-3.5 h-3.5 text-gray-500" />
              <span>Save Draft</span>
            </button>

            {/* Update / Publish Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit("Published")}
              className="px-5 py-2 bg-[#d6b92a] text-black font-extrabold hover:bg-gold-dark hover:text-white rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Update Product</span>
            </button>
          </div>
        </div>

        {/* ── Language Switcher Tabs ── */}
        <div className="flex items-center justify-between bg-gray-50/80 p-1.5 rounded-xl border border-gray-200/80">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveLang("en")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeLang === "en"
                  ? "bg-white text-gray-900 shadow-2xs border border-gray-200"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>English (Original Form)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveLang("ar")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                activeLang === "ar"
                  ? "bg-[#fdfaf0] text-gold-dark shadow-2xs border border-gold-main/40"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>Arabic (العربية)</span>
            </button>
          </div>
          <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
            {activeLang === "en"
              ? "Editing English fields. Click 'Re-Translate' to update Arabic."
              : "Viewing and fine-tuning Arabic localized content."}
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Product Title / Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={curForm.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={activeLang === "en" ? "e.g. Cocamidopropyl Betaine (CAPB 35%)" : "مثال: كوكاميدوبروبيل بيتين (CAPB 35%)"}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-gold-main transition-all"
            />
          </div>

          {/* Slug (URL Path) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 block">
                Slug (URL Path) <span className="text-rose-500">*</span>
              </label>
              {isSlugCustom && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugCustom(false);
                    setSlug(slugify(formData.title));
                  }}
                  className="text-[10px] text-gold-dark font-bold hover:underline cursor-pointer"
                >
                  Auto
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setIsSlugCustom(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="e.g. cocamidopropyl-betaine-capb-35"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:bg-white focus:outline-none focus:border-gold-main transition-all"
              />
            </div>
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
            Technical Data Sheet (TDS) Document <span className="text-gray-400 font-normal">(Upload PDF or paste URL)</span>
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
          SECTION 2: TECHNICAL SPECIFICATIONS (UNIVERSAL CHEMICAL DATA)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-extrabold text-gray-900">
              2. Chemical Specifications (4 Technical Specs)
            </h2>
            <p className="text-[11px] text-gray-400 font-medium">
              Displayed in the 2x2 technical specification cards on the hero section.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">CAS Number</label>
            <input
              type="text"
              value={formData.casNumber}
              onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
              placeholder="e.g. 61789-40-0"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">INCI Name</label>
            <input
              type="text"
              value={formData.inciName}
              onChange={(e) => setFormData({ ...formData, inciName: e.target.value })}
              placeholder="e.g. Coco Amido Propyl Betaine"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">HS Code</label>
            <input
              type="text"
              value={formData.hsCode}
              onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
              placeholder="e.g. 3402.19.00"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Chemical Formula</label>
            <input
              type="text"
              value={formData.chemicalFormula}
              onChange={(e) => setFormData({ ...formData, chemicalFormula: e.target.value })}
              placeholder="e.g. C19H38N2O3"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main"
            />
          </div>
        </div>

        {/* Industry Application Tags (Pills) */}
        <div className="space-y-2 pt-3 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-700 block">
            Industry Application Pills ({activeLang.toUpperCase()})
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {curAppTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-800 inline-flex items-center gap-1.5"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <div className="flex items-center gap-1.5">
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
                placeholder="Type tag & hit Add..."
                className="p-1.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-gold-main"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-gray-900 text-gold-main text-xs font-bold rounded-xl hover:bg-black"
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 3: ABOUT PRODUCT & 4 KEY OPERATIONAL CARDS
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-extrabold text-gray-900 flex items-center gap-2">
              <span>3. About Product & Operational Breakdown</span>
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase font-bold">
                {activeLang.toUpperCase()}
              </span>
            </h2>
            <p className="text-[11px] text-gray-400 font-medium">
              Detailed chemical background, manufacturing, packaging, safety, and why choose Leela Gulf.
            </p>
          </div>
        </div>

        {/* Section Heading & Overview Paragraph */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">About Section Title</label>
            <input
              type="text"
              value={curForm.aboutTitle}
              onChange={(e) => setCurForm({ ...curForm, aboutTitle: e.target.value })}
              placeholder={activeLang === "en" ? "e.g. About Cocamidopropyl Betaine (CAPB)" : "عن كوكاميدوبروبيل بيتين"}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-gold-main"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Detailed Overview Paragraph</label>
            <textarea
              rows={3}
              value={curForm.aboutOverview}
              onChange={(e) => setCurForm({ ...curForm, aboutOverview: e.target.value })}
              placeholder="Comprehensive chemical overview..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed focus:bg-white focus:outline-none focus:border-gold-main"
            />
          </div>
        </div>

        {/* 4 Technical Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Card 1: Manufacturing Process */}
          <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-main" />
              <input
                type="text"
                value={curForm.card1Title}
                onChange={(e) => setCurForm({ ...curForm, card1Title: e.target.value })}
                className="font-bold text-xs text-gray-900 bg-transparent border-b border-gray-300 focus:border-gold-main focus:outline-none flex-1 pb-0.5"
              />
            </div>
            <textarea
              rows={3}
              value={curForm.manufacturingProcess}
              onChange={(e) => setCurForm({ ...curForm, manufacturingProcess: e.target.value })}
              placeholder="Synthesized by reacting dimethylaminopropylamine (DMAPA)..."
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
            />
          </div>

          {/* Card 2: Packaging & Logistics */}
          <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-main" />
              <input
                type="text"
                value={curForm.card2Title}
                onChange={(e) => setCurForm({ ...curForm, card2Title: e.target.value })}
                className="font-bold text-xs text-gray-900 bg-transparent border-b border-gray-300 focus:border-gold-main focus:outline-none flex-1 pb-0.5"
              />
            </div>
            <textarea
              rows={3}
              value={curForm.packagingLogistics}
              onChange={(e) => setCurForm({ ...curForm, packagingLogistics: e.target.value })}
              placeholder="Standard packaging: 200 kg HDPE drums, 1,000 kg IBC totes..."
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
            />
          </div>

          {/* Card 3: Safety & Handling */}
          <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-main" />
              <input
                type="text"
                value={curForm.card3Title}
                onChange={(e) => setCurForm({ ...curForm, card3Title: e.target.value })}
                className="font-bold text-xs text-gray-900 bg-transparent border-b border-gray-300 focus:border-gold-main focus:outline-none flex-1 pb-0.5"
              />
            </div>
            <textarea
              rows={3}
              value={curForm.safetyHandling}
              onChange={(e) => setCurForm({ ...curForm, safetyHandling: e.target.value })}
              placeholder="Store between 15°C and 30°C in original sealed packaging..."
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
            />
          </div>

          {/* Card 4: Bulk Pricing & Procurement */}
          <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-main" />
              <input
                type="text"
                value={curForm.card4Title}
                onChange={(e) => setCurForm({ ...curForm, card4Title: e.target.value })}
                className="font-bold text-xs text-gray-900 bg-transparent border-b border-gray-300 focus:border-gold-main focus:outline-none flex-1 pb-0.5"
              />
            </div>
            <textarea
              rows={3}
              value={curForm.bulkPricing}
              onChange={(e) => setCurForm({ ...curForm, bulkPricing: e.target.value })}
              placeholder="Procurement teams evaluate price per kg of active matter..."
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
            />
          </div>
        </div>

        {/* Why Choose Leela Gulf Highlight Box */}
        <div className="p-4 bg-[#fdfaf0] border border-gold-main/40 rounded-2xl space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-main" />
            <input
              type="text"
              value={curForm.whyChooseTitle}
              onChange={(e) => setCurForm({ ...curForm, whyChooseTitle: e.target.value })}
              className="font-heading font-extrabold text-xs text-gray-900 bg-transparent border-b border-gold-main/30 focus:border-gold-main focus:outline-none flex-1 pb-0.5"
            />
          </div>
          <textarea
            rows={3}
            value={curForm.whyChooseLeela}
            onChange={(e) => setCurForm({ ...curForm, whyChooseLeela: e.target.value })}
            placeholder="Leela Gulf makes procurement straightforward for formulators..."
            className="w-full p-3 bg-white border border-gold-main/30 rounded-xl text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 4: 01-05 PRODUCT FEATURES SHOWCASE
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-extrabold text-gray-900 flex items-center gap-2">
                <span>4. Product Features (01–05 Cards)</span>
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase font-bold">
                  {activeLang.toUpperCase()}
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Matches 3 top + 2 bottom cards on the product features section.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddFeature}
            className="px-3 py-1.5 bg-black text-gold-main font-bold text-xs rounded-xl hover:bg-gray-900 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Feature</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {curFeatures.map((feat, idx) => {
            const iconPreview = renderFeatureBadgeIcon(feat.icon);
            const isThisDropdownOpen = openFeatureDropdownIdx === (feat.id || idx);

            return (
              <div
                key={feat.id || idx}
                style={{ zIndex: isThisDropdownOpen ? 100 : 1 }}
                className={`relative bg-white border rounded-2xl shadow-2xs transition-all flex flex-col justify-between ${
                  isThisDropdownOpen
                    ? "border-gold-main ring-2 ring-gold-main/30 shadow-xl"
                    : "border-gray-200 hover:border-gold-main/40"
                }`}
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
                        isOpen={isThisDropdownOpen}
                        onToggle={() => setOpenFeatureDropdownIdx(isThisDropdownOpen ? null : (feat.id || idx))}
                        onClose={() => setOpenFeatureDropdownIdx(null)}
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
          SECTION 5: INDUSTRY APPLICATIONS (IMAGE + BULLETS)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-extrabold text-gray-900 flex items-center gap-2">
                <span>5. Industry Applications Breakdown</span>
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase font-bold">
                  {activeLang.toUpperCase()}
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Detailed cards with image on left and bullet points on right.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddAppCard}
            className="px-3 py-1.5 bg-black text-gold-main font-bold text-xs rounded-xl hover:bg-gray-900 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>

        <div className="space-y-4">
          {curAppCards.map((card, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={card.id || idx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs hover:border-gold-main/40 transition-all"
              >
                <div className="flex items-center justify-between p-3.5 bg-gray-50/60 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-extrabold text-gold-dark bg-[#fdfaf0] px-2 py-0.5 rounded border border-gold-main/30">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 py-0.5 bg-gray-100 rounded border border-gray-200/60">
                      {isEven ? "Image Left → Text Right" : "Text Left ← Image Right"}
                    </span>
                  </div>

                  {curAppCards.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAppCard(idx)}
                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Remove application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 block">Industry Name</label>
                      <input
                        type="text"
                        value={card.industry}
                        onChange={(e) => handleAppCardChange(idx, "industry", e.target.value)}
                        placeholder="Application Title (e.g. Personal Care)"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:outline-none focus:border-gold-main"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700 block">Badge Tag</label>
                      <input
                        type="text"
                        value={card.badge}
                        onChange={(e) => handleAppCardChange(idx, "badge", e.target.value.toUpperCase())}
                        placeholder="Badge Tag (e.g. COSMETICS)"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 uppercase focus:bg-white focus:outline-none focus:border-gold-main"
                      />
                    </div>
                  </div>

                  {/* Image Input for this Card */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 block">Card Image</label>
                    <div className="flex items-center gap-3">
                      {card.imageUrl ? (
                        <div className="relative w-14 h-14 rounded-xl border border-gray-200 overflow-hidden shrink-0">
                          <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : null}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={card.imageUrl || ""}
                          onChange={(e) => handleAppCardChange(idx, "imageUrl", e.target.value)}
                          placeholder="Or paste image URL (e.g. https://example.com/image.jpg)"
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main"
                        />
                      </div>
                      <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer inline-flex items-center gap-1 shrink-0">
                        {uploadingCardIdx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadCardImage(idx, e.target.files?.[0])}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-gray-200/60">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-700 block">
                        Bullet Points (Shown with checkmarks on frontend)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(idx)}
                        className="text-xs font-bold text-gold-dark hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    {(card.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleAppBulletChange(idx, bIdx, e.target.value)}
                          placeholder="Bullet point description..."
                          className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:bg-white focus:outline-none focus:border-gold-main"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(idx, bIdx)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 6: FREQUENTLY ASKED QUESTIONS (FAQS)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center text-gold-dark font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-heading font-extrabold text-gray-900 flex items-center gap-2">
                <span>6. Frequently Asked Questions (Accordion)</span>
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase font-bold">
                  {activeLang.toUpperCase()}
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddFaq}
            className="px-3 py-1.5 bg-black text-gold-main font-bold text-xs rounded-xl hover:bg-gray-900 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-3">
          {curFaqs.map((faq, idx) => (
            <div key={idx} className="p-4 bg-gray-50/80 border border-gray-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-xs text-gold-dark">
                  FAQ #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="text-gray-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={faq.question}
                onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                placeholder="Question text..."
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-gold-main"
              />

              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                placeholder="Answer text..."
                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Save Sticky Floating Bar ── */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#11131a]/95 backdrop-blur-md px-6 py-3 rounded-2xl border border-gold-main/40 shadow-2xl flex items-center gap-4">
        <Link
          href="/admin/products"
          className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={() => handleSubmit("Published")}
          disabled={isSubmitting}
          className="btn-gold-primary px-6 py-2 rounded-xl font-heading font-bold text-xs inline-flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin text-black" /> : <Save className="w-3.5 h-3.5 text-black" />}
          <span>Save Changes</span>
        </button>
      </div>

    </div>
  );
}
