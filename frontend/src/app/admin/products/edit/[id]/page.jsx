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
  ExternalLink
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
];

function FeatureIconSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = FEATURE_ICON_OPTIONS.find((item) => item.id === (value || "sparkles")) || FEATURE_ICON_OPTIONS[0];
  const SelectedIcon = selected.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-gray-200 hover:border-gold-main/60 focus:border-gold-main rounded-xl text-xs font-semibold text-gray-800 shadow-2xs transition-all cursor-pointer min-w-[175px] justify-between"
      >
        <div className="flex items-center gap-1.5 truncate">
          <SelectedIcon className="w-3.5 h-3.5 text-gold-dark shrink-0" />
          <span className="truncate text-[11px] font-heading font-bold text-gray-800">{selected.label}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-gold-dark" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-gold-main/30 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto py-1.5 animate-[fadeIn_0.15s_ease-out] [scrollbar-width:thin]">
          {FEATURE_ICON_OPTIONS.map((item) => {
            const ItemIcon = item.icon;
            const isItemSel = (value || "sparkles") === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange(item.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  isItemSel
                    ? "bg-gold-main/15 text-gold-dark font-bold border-l-2 border-gold-main"
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
          })}
        </div>
      )}
    </div>
  );
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  const [activeLang, setActiveLang] = useState("en"); // "en" | "ar"
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
  const [productSlug, setProductSlug] = useState("");
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
        setSuccessMsg("✨ Product image updated to Cloudinary!");
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
        const updated = [...applicationCards];
        updated[cardIndex].imageUrl = data.data.url;
        setApplicationCards(updated);
        if (arApplicationCards.length > cardIndex) {
          const arUpdated = [...arApplicationCards];
          arUpdated[cardIndex].imageUrl = data.data.url;
          setArApplicationCards(arUpdated);
        }
        setSuccessMsg("✨ Card image uploaded to Cloudinary!");
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

        setSuccessMsg("✨ Arabic translation generated successfully!");
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
        setSuccessMsg("🎉 Product updated successfully!");
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
    <div className="max-w-7xl mx-auto space-y-6 pb-24 text-gray-800">
      
      {/* ── Top Header Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-0.5">
              <Link href="/admin/products" className="hover:text-gold-dark transition-colors">
                Products
              </Link>
              <span>&gt;</span>
              <span className="text-gray-700 font-semibold">Edit Product</span>
            </div>
            <h1 className="text-lg sm:text-xl font-heading font-extrabold text-gray-900 tracking-tight">
              Edit Product: <span className="text-gold-dark">{formData.title || "Product"}</span>
            </h1>
          </div>
        </div>

        {/* Quick Actions (Preview Live + Save Status) */}
        <div className="flex items-center gap-2.5">
          {productSlug && (
            <a
              href={`/products/${productSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-heading font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live</span>
            </a>
          )}
          
          <button
            type="button"
            onClick={() => handleSubmit("Draft")}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-heading font-bold text-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("Published")}
            disabled={isSubmitting}
            className="btn-gold-primary px-5 py-2 rounded-xl font-heading font-bold text-xs inline-flex items-center gap-1.5 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-black" />
                <span>Update & Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold animate-[fadeIn_0.2s_ease-out]">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Language Switcher Bar ── */}
      <div className="bg-[#11131a] text-white p-3.5 sm:p-4 rounded-2xl shadow-md border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-gold-main" />
          <span className="text-xs font-bold">Content Language Mode:</span>
          <div className="inline-flex p-1 bg-[#1c202d] rounded-xl border border-gray-700">
            <button
              type="button"
              onClick={() => setActiveLang("en")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLang === "en"
                  ? "bg-gold-main text-black shadow-xs"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              English Form
            </button>
            <button
              type="button"
              onClick={() => setActiveLang("ar")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLang === "ar"
                  ? "bg-gold-main text-black shadow-xs"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              العربية (Arabic Form)
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAutoTranslate}
          disabled={isTranslating}
          className="px-4 py-1.5 bg-gradient-to-r from-gold-main/20 to-gold-light/20 hover:from-gold-main/30 hover:to-gold-light/30 border border-gold-main/50 text-gold-light rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-light" />
              <span>Translating Entire Form...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-gold-main" />
              <span>Re-Translate English to Arabic</span>
            </>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          SECTION 1: HERO & IDENTIFICATION INFORMATION
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
                      className={`w-full px-3.5 py-2.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
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
              <Sparkles className="w-4 h-4" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {curFeatures.map((feat, idx) => {
            const iconPreview = (() => {
              const cls = "w-4 h-4 text-gold-main";
              const key = feat.icon?.toLowerCase() || "";
              if (key.includes("sparkle")) return <Sparkles className={cls} />;
              if (key.includes("feather")) return <Feather className={cls} />;
              if (key.includes("leaf")) return <Leaf className={cls} />;
              if (key.includes("droplet")) return <Droplet className={cls} />;
              if (key.includes("flask")) return <FlaskConical className={cls} />;
              if (key.includes("shield")) return <ShieldCheck className={cls} />;
              if (key.includes("zap")) return <Zap className={cls} />;
              if (key.includes("award")) return <Award className={cls} />;
              if (key.includes("sun")) return <Sun className={cls} />;
              if (key.includes("recycle")) return <Recycle className={cls} />;
              if (key.includes("heart")) return <Heart className={cls} />;
              if (key.includes("check")) return <CheckCircle2 className={cls} />;
              return <Sparkles className={cls} />;
            })();

            return (
              <div
                key={feat.id || idx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs hover:border-gold-main/40 transition-all group"
              >
                <div className="flex items-center justify-between p-3.5 bg-gray-50/60 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#fdfaf0] border border-gold-main/30 flex items-center justify-center shrink-0 shadow-2xs">
                      {iconPreview}
                    </div>
                    <span className="text-xs font-mono font-extrabold text-gold-dark bg-[#fdfaf0] px-2 py-0.5 rounded border border-gold-main/30">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FeatureIconSelect
                      value={feat.icon}
                      onChange={(newIcon) => handleFeatureChange(idx, "icon", newIcon)}
                    />

                    {curFeatures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove feature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 space-y-2.5">
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                    placeholder="Feature Title (e.g. Effective Surfactant)"
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-extrabold text-gray-900 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                  />

                  <textarea
                    rows={3}
                    value={feat.description}
                    onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                    placeholder="Feature description text..."
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 leading-relaxed focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                  />
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
