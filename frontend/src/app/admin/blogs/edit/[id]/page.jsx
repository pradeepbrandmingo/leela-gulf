"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/config/api";
import BlogWysiwygEditor from "@/components/admin/BlogWysiwygEditor";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  X,
  Languages,
  Eye,
  Loader2,
  FileText,
  User,
  Mail,
  ExternalLink,
  Tag,
  Plus,
} from "lucide-react";

// Clean LinkedIn SVG Icon Component
function LinkedinIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
    </svg>
  );
}

// Preset Categories matching Frontend UI Sidebar
export const PRESET_BLOG_CATEGORIES = [
  "Compliance",
  "Quality",
  "Industry Insights",
  "Regulations",
  "Technology",
  "Events",
  "Sustainability",
  "Safety",
  "Supply Chain",
];

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

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params?.id;

  // Active Tab (English vs Arabic)
  const [activeLang, setActiveLang] = useState("en"); // 'en' | 'ar'
  const [isLoading, setIsLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);

  // Form State - Core
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Published");

  // Categories & Tags State (Bilingual)
  const [enCategories, setEnCategories] = useState(["Compliance"]);
  const [arCategories, setArCategories] = useState(["الامتثال"]);
  const [newCatInput, setNewCatInput] = useState("");

  // Form State - Images
  const [featuredImage, setFeaturedImage] = useState("");
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [authorImage, setAuthorImage] = useState("/images/careers/careers.avif");
  const [isUploadingAuthor, setIsUploadingAuthor] = useState(false);

  // Form State - English
  const [enTitle, setEnTitle] = useState("");
  const [enExcerpt, setEnExcerpt] = useState("");
  const [enMetaTitle, setEnMetaTitle] = useState("");
  const [enMetaDesc, setEnMetaDesc] = useState("");
  const [enContent, setEnContent] = useState("");

  // Author Profile State - English
  const [enAuthor, setEnAuthor] = useState("Ananya Sharma");
  const [enAuthorRole, setEnAuthorRole] = useState("Compliance Specialist");
  const [enAuthorCompany, setEnAuthorCompany] = useState("LEELA GULF");
  const [enAuthorBio, setEnAuthorBio] = useState(
    "Ananya is a compliance expert with 8+ years of experience helping businesses navigate complex regulations and ensure adherence to industry standards."
  );
  const [authorLinkedIn, setAuthorLinkedIn] = useState("https://linkedin.com");
  const [authorEmail, setAuthorEmail] = useState("contact@leelagulf.com");

  // Form State - Arabic
  const [arTitle, setArTitle] = useState("");
  const [arExcerpt, setArExcerpt] = useState("");
  const [arMetaTitle, setArMetaTitle] = useState("");
  const [arMetaDesc, setArMetaDesc] = useState("");
  const [arContent, setArContent] = useState("");
  const [arAuthor, setArAuthor] = useState("أنانيا شارما");
  const [arAuthorRole, setArAuthorRole] = useState("أخصائية الامتثال");
  const [arAuthorCompany, setArAuthorCompany] = useState("ليلا جلف");
  const [arAuthorBio, setArAuthorBio] = useState(
    "أنانيا أخصائية امثتال معتمدة بخبرة تزيد عن 8 سنوات في مساعدة الشركات على تطبيق معايير السلامة الدولية."
  );

  // UI Action States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const featuredFileInputRef = useRef(null);
  const authorFileInputRef = useRef(null);

  // Fetch Blog from Backend on Mount
  useEffect(() => {
    async function loadBlog() {
      if (!blogId) return;
      setIsLoading(true);
      try {
        const res = await apiRequest(`/blogs/${blogId}`, { silent: true });
        if (res?.success && res?.data) {
          const b = res.data;
          setSlug(b.slug || "");
          setStatus(b.status || "Published");
          setFeaturedImage(b.image || "");
          setAuthorImage(b.authorImage || "/images/careers/careers.avif");
          setAuthorLinkedIn(b.authorLinkedIn || "https://linkedin.com");
          setAuthorEmail(b.authorEmail || "contact@leelagulf.com");

          // Categories
          if (b.categories && Array.isArray(b.categories) && b.categories.length > 0) {
            setEnCategories(b.categories);
          } else if (b.category || b.en?.category) {
            setEnCategories([b.category || b.en?.category]);
          }

          if (b.ar?.categories && Array.isArray(b.ar.categories) && b.ar.categories.length > 0) {
            setArCategories(b.ar.categories);
          } else if (b.ar?.category) {
            setArCategories([b.ar.category]);
          }

          // English fields
          setEnTitle(b.en?.title || b.title || "");
          setEnExcerpt(b.en?.excerpt || b.excerpt || "");
          setEnMetaTitle(b.en?.metaTitle || (b.en?.title ? `${b.en.title} | Leela Gulf FZC` : ""));
          setEnMetaDesc(b.en?.metaDesc || b.en?.excerpt || "");
          setEnContent(b.en?.content || b.content || "");
          setEnAuthor(b.en?.author || "Ananya Sharma");
          setEnAuthorRole(b.en?.authorRole || "Compliance Specialist");
          setEnAuthorCompany(b.en?.authorCompany || "LEELA GULF");
          setEnAuthorBio(
            b.en?.authorBio ||
              "Ananya is a compliance expert with 8+ years of experience helping businesses navigate complex regulations and ensure adherence to industry standards."
          );

          // Arabic fields
          if (b.ar) {
            setArTitle(b.ar.title || "");
            setArExcerpt(b.ar.excerpt || "");
            setArMetaTitle(b.ar.metaTitle || "");
            setArMetaDesc(b.ar.metaDesc || "");
            setArContent(b.ar.content || "");
            setArAuthor(b.ar.author || "أنانيا شارما");
            setArAuthorRole(b.ar.authorRole || "أخصائية الامتثال");
            setArAuthorCompany(b.ar.authorCompany || "ليلا جلف");
            setArAuthorBio(
              b.ar.authorBio ||
                "أنانيا أخصائية امثتال معتمدة بخبرة تزيد عن 8 سنوات في مساعدة الشركات على تطبيق معايير السلامة الدولية."
            );
          }
        } else {
          setErrMsg("Blog post not found in database.");
        }
      } catch (err) {
        console.error("Load blog error:", err);
        setErrMsg("Could not load blog details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadBlog();
  }, [blogId]);

  // Add category handler
  const handleAddCategory = (catToAdd = null) => {
    const val = (catToAdd !== null ? catToAdd : newCatInput).trim();
    if (!val) return;

    if (activeLang === "en") {
      if (!enCategories.includes(val)) {
        setEnCategories((prev) => [...prev, val]);
      }
    } else {
      if (!arCategories.includes(val)) {
        setArCategories((prev) => [...prev, val]);
      }
    }
    setNewCatInput("");
  };

  // Remove category handler
  const handleRemoveCategory = (catToRemove) => {
    if (activeLang === "en") {
      setEnCategories((prev) => prev.filter((c) => c !== catToRemove));
    } else {
      setArCategories((prev) => prev.filter((c) => c !== catToRemove));
    }
  };

  // Image Size & Type Validator
  const validateImageFile = (file, maxSizeMB = 10) => {
    if (!file) return false;
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      alert(`Image file is too large (${sizeMB} MB). Please select an image under ${maxSizeMB}MB (Recommended: WebP, JPG, PNG).`);
      return false;
    }
    if (!file.type.startsWith("image/")) {
      alert(`Invalid file type (${file.type}). Please select a valid image (JPG, PNG, WebP, AVIF).`);
      return false;
    }
    return true;
  };

  // Cloudinary Featured Image Upload
  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file, 15)) {
      if (featuredFileInputRef.current) featuredFileInputRef.current.value = "";
      return;
    }

    setIsUploadingFeatured(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "leela-gulf/blogs");

      const res = await apiRequest("/upload/single", {
        method: "POST",
        body: formData,
      });

      const uploadedUrl = res?.data?.url || res?.url;
      if (res?.success && uploadedUrl) {
        setFeaturedImage(uploadedUrl);
      } else {
        alert(res?.message || "Image upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Featured image upload error:", err);
      alert("Image upload error: " + (err.message || "Network error"));
    } finally {
      setIsUploadingFeatured(false);
      if (featuredFileInputRef.current) featuredFileInputRef.current.value = "";
    }
  };

  // Cloudinary Author Avatar Upload
  const handleAuthorImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file, 10)) {
      if (authorFileInputRef.current) authorFileInputRef.current.value = "";
      return;
    }

    setIsUploadingAuthor(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "leela-gulf/authors");

      const res = await apiRequest("/upload/single", {
        method: "POST",
        body: formData,
      });

      const uploadedUrl = res?.data?.url || res?.url;
      if (res?.success && uploadedUrl) {
        setAuthorImage(uploadedUrl);
      } else {
        alert(res?.message || "Author image upload failed.");
      }
    } catch (err) {
      console.error("Author image upload error:", err);
      alert("Upload error: " + (err.message || "Failed"));
    } finally {
      setIsUploadingAuthor(false);
      if (authorFileInputRef.current) authorFileInputRef.current.value = "";
    }
  };

  // AI Auto-Translate English to Arabic
  const handleAutoTranslate = async () => {
    if (!enTitle) {
      alert("Please provide at least an English Blog Title before translating.");
      return;
    }

    setIsTranslating(true);
    try {
      const textsToTranslate = {
        title: enTitle,
        excerpt: enExcerpt || "",
        metaTitle: enMetaTitle || "",
        metaDesc: enMetaDesc || "",
        content: enContent || "",
        category: enCategories.join(", "),
        author: enAuthor || "Ananya Sharma",
        authorRole: enAuthorRole || "Compliance Specialist",
        authorCompany: enAuthorCompany || "LEELA GULF",
        authorBio: enAuthorBio || "",
      };

      const res = await apiRequest("/translate", {
        method: "POST",
        body: JSON.stringify({
          payload: textsToTranslate,
          data: textsToTranslate,
          targetLang: "ar",
          sourceLang: "en",
        }),
      });

      const trans = res?.translated || res?.data;
      if (res?.success && trans) {
        if (trans.title) setArTitle(trans.title);
        if (trans.excerpt) setArExcerpt(trans.excerpt);
        if (trans.metaTitle) setArMetaTitle(trans.metaTitle);
        if (trans.metaDesc) setArMetaDesc(trans.metaDesc);
        if (trans.content) setArContent(trans.content);
        if (trans.category) {
          const arCats = trans.category
            .split(/[,،]+/)
            .map((c) => c.trim())
            .filter(Boolean);
          if (arCats.length > 0) setArCategories(arCats);
        }
        if (trans.author) setArAuthor(trans.author);
        if (trans.authorRole) setArAuthorRole(trans.authorRole);
        if (trans.authorCompany) setArAuthorCompany(trans.authorCompany);
        if (trans.authorBio) setArAuthorBio(trans.authorBio);

        setActiveLang("ar");
        setToastMsg("Translated English content to Arabic successfully!");
        setTimeout(() => setToastMsg(""), 3500);
      } else {
        throw new Error(res?.message || "Translation failed");
      }
    } catch (err) {
      console.error("Auto-translate error:", err);
      alert("Translation service error: " + (err.message || "Failed"));
    } finally {
      setIsTranslating(false);
    }
  };

  // Submit Handler (Update Blog)
  const handleSubmit = async (submitStatus = null) => {
    if (!enTitle.trim()) {
      setErrMsg("Blog Title (English) is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    setErrMsg("");

    try {
      const finalStatus = submitStatus || status;
      const finalSlug = slug.trim() || slugify(enTitle);
      const CATEGORY_MAP = {
        "Compliance": "الامتثال",
        "Quality": "ضمان الجودة",
        "Sustainability": "الاستدامة",
        "Safety": "السلامة",
        "Industry Trends": "اتجاهات الصناعة",
        "Leela Gulf Updates": "تحديثات ليلا جلف",
        "Chemical Distribution": "توزيع المواد الكيميائية",
        "General": "عام",
      };

      const primaryCategory = enCategories[0] || "General";
      const finalArCats = arCategories.length > 0
        ? arCategories
        : enCategories.map((c) => CATEGORY_MAP[c] || c);
      const primaryCategoryAr = finalArCats[0] || (CATEGORY_MAP[primaryCategory] || "عام");

      const wordCount = (enContent || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
      const dynamicReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} Min Read`;
      const dynamicReadTimeAr = `${Math.max(1, Math.ceil(wordCount / 200))} دقائق قراءة`;

      const payload = {
        title: enTitle.trim(),
        slug: finalSlug,
        category: primaryCategory,
        categories: enCategories.length > 0 ? enCategories : ["General"],
        status: finalStatus,
        image: featuredImage || "",
        authorImage: authorImage || "",
        authorLinkedIn: authorLinkedIn || "",
        authorEmail: authorEmail || "",
        readTime: dynamicReadTime,
        en: {
          title: enTitle.trim(),
          category: primaryCategory,
          categories: enCategories.length > 0 ? enCategories : ["General"],
          excerpt: enExcerpt.trim(),
          content: enContent.trim(),
          author: enAuthor.trim() || "Leela Gulf Editorial Team",
          authorRole: enAuthorRole.trim() || "Author",
          authorCompany: enAuthorCompany.trim() || "LEELA GULF",
          authorBio: enAuthorBio.trim(),
          readTime: dynamicReadTime,
          metaTitle: enMetaTitle.trim(),
          metaDesc: enMetaDesc.trim(),
        },
        ar: arTitle.trim()
          ? {
              title: arTitle.trim(),
              category: primaryCategoryAr,
              categories: finalArCats.length > 0 ? finalArCats : ["عام"],
              excerpt: arExcerpt.trim(),
              content: arContent.trim() || enContent.trim(),
              author: arAuthor.trim() || (enAuthor.trim() || "فريق تحرير ليلا جلف"),
              authorRole: arAuthorRole.trim() || "كاتب",
              authorCompany: arAuthorCompany.trim() || "ليلا جلف",
              authorBio: arAuthorBio.trim(),
              readTime: dynamicReadTimeAr,
              metaTitle: arMetaTitle.trim(),
              metaDesc: arMetaDesc.trim(),
            }
          : null,
      };

      const res = await apiRequest(`/blogs/${blogId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res?.success) {
        setToastMsg("Blog post updated successfully!");
        setTimeout(() => {
          router.push("/admin/blogs");
        }, 1200);
      } else {
        throw new Error(res?.message || "Failed to update blog");
      }
    } catch (err) {
      console.error("Update blog submission error:", err);
      setErrMsg(err.message || "Failed to update blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-gold-main mx-auto mb-3" />
        <p className="text-xs font-heading font-bold">Loading Blog Article Details...</p>
      </div>
    );
  }

  const currentCategories = activeLang === "en" ? enCategories : arCategories;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* ── TOP HEADER & BREADCRUMB ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-gold-dark transition-colors">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link href="/admin/blogs" className="hover:text-gold-dark transition-colors">
              Blogs
            </Link>
            <span>&gt;</span>
            <span className="text-gray-900 font-bold">Edit Blog</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-heading font-extrabold text-gray-900 tracking-tight">
              Edit Blog: <span className="text-gold-dark">{enTitle || slug}</span>
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-heading font-bold flex items-center gap-1.5 border ${
                status === "Published"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${status === "Published" ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span>{status === "Published" ? "Published" : "Draft"}</span>
            </span>
          </div>
        </div>

        {/* Top Actions: Back Button */}
        <div className="flex items-center gap-3">
          <Link
            href={`/knowledge-center/${slug || blogId}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-bold text-gray-700 shadow-2xs transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            <span>View Live</span>
          </Link>
          <Link
            href="/admin/blogs"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:border-gold-main/50 rounded-xl text-xs font-bold text-gray-700 shadow-2xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Blogs</span>
          </Link>
        </div>
      </div>

      {/* ── ERROR & SUCCESS NOTIFICATIONS ── */}
      {errMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-[fadeIn_0.2s_ease-out]">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errMsg}</span>
        </div>
      )}

      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-[fadeIn_0.2s_ease-out]">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── MAIN 2-COLUMN FORM LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ══════════════════════════════════════════════════════════════════
            LEFT MAIN COLUMN (8 COLS): BLOG INFORMATION & WYSIWYG
            ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
            {/* Card Header & Language Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gold-dark" />
                <h2 className="text-base font-heading font-extrabold text-gray-900">
                  Blog Information
                </h2>
              </div>

              {/* Language Pills & Auto-Translate */}
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-0.5 rounded-xl flex items-center text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveLang("en")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeLang === "en"
                        ? "bg-black text-gold-main shadow-2xs font-extrabold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang("ar")}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeLang === "ar"
                        ? "bg-black text-gold-main shadow-2xs font-extrabold"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Arabic (AR)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating}
                  className="px-3 py-1.5 bg-[#fdfaf0] hover:bg-gold-main/20 text-gold-dark border border-gold-main/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Automatically re-translate English fields to Arabic"
                >
                  {isTranslating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Languages className="w-3.5 h-3.5 text-gold-dark" />
                  )}
                  <span>{isTranslating ? "Translating..." : "Auto Translate"}</span>
                </button>
              </div>
            </div>

            {/* ── ROW 1: TITLE & SLUG ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  {activeLang === "en" ? "Blog Title *" : "Blog Title (Arabic) *"}
                </label>
                {activeLang === "en" ? (
                  <input
                    type="text"
                    value={enTitle}
                    onChange={(e) => setEnTitle(e.target.value)}
                    placeholder="e.g. The Future of Sustainable Chemical Supply Chain"
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                  />
                ) : (
                  <input
                    type="text"
                    value={arTitle}
                    onChange={(e) => setArTitle(e.target.value)}
                    dir="rtl"
                    placeholder="عنوان المقال باللغة العربية"
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gold-main focus:bg-white transition-all text-right"
                  />
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Slug (URL Path) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* ── ROW 2: INTERACTIVE CATEGORIES & TAGS MANAGER (Matches Products & Frontend Sidebar) ── */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-gold-dark" />
                  <span>
                    {activeLang === "en"
                      ? "Categories & Tags *"
                      : "التصنيفات والوسوم (عربي) *"}
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal">
                    ({activeLang.toUpperCase()} - Shows on Blog Cards & Sidebar Filter)
                  </span>
                </label>
                <span className="text-[10px] text-gray-400">
                  {currentCategories.length} selected
                </span>
              </div>

              {/* Active Category Tag Badges + Inline Add Input */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50/80 rounded-xl border border-gray-200 min-h-[50px]">
                {currentCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gold-main/40 text-gold-dark font-extrabold rounded-lg text-xs shadow-2xs"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove category"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Input for typing custom categories manually */}
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                    placeholder={
                      activeLang === "en"
                        ? "+ Add custom category (press Enter)..."
                        : "+ أضف تصنيف جديد (اضغط Enter)..."
                    }
                    dir={activeLang === "ar" ? "rtl" : "ltr"}
                    className="px-3 py-1 bg-transparent border-none text-xs text-gray-800 focus:outline-none placeholder-gray-400 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCategory()}
                    className="px-3 py-1 bg-black hover:bg-gray-800 text-gold-main rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Suggested Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-gray-500 mr-1">
                  Suggested Categories:
                </span>
                {PRESET_BLOG_CATEGORIES.map((preset) => {
                  const isSelected = currentCategories.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveCategory(preset);
                        } else {
                          handleAddCategory(preset);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-gold-main/20 text-gold-dark border-gold-main font-extrabold"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gold-main/50 hover:text-gray-900"
                      }`}
                    >
                      {isSelected ? `✓ ${preset}` : `+ ${preset}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── ROW 3: SHORT DESCRIPTION / EXCERPT (Full Width) ── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Short Description / Excerpt *
                </label>
                <span
                  className={`text-[10px] font-bold ${
                    (activeLang === "en" ? enExcerpt.length : arExcerpt.length) > 160
                      ? "text-rose-600"
                      : "text-gray-400"
                  }`}
                >
                  {activeLang === "en" ? enExcerpt.length : arExcerpt.length} / 160
                </span>
              </div>
              {activeLang === "en" ? (
                <textarea
                  rows={3}
                  value={enExcerpt}
                  onChange={(e) => setEnExcerpt(e.target.value)}
                  placeholder="Exploring how sustainability is shaping the future of chemical supply chains..."
                  className="w-full p-3 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all resize-none leading-relaxed"
                />
              ) : (
                <textarea
                  rows={3}
                  value={arExcerpt}
                  onChange={(e) => setArExcerpt(e.target.value)}
                  dir="rtl"
                  placeholder="نبذة مختصرة عن المقال تعرض في البطاقات ونتائج البحث..."
                  className="w-full p-3 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all resize-none leading-relaxed text-right"
                />
              )}
            </div>

            {/* ── ROW 4: SEO METADATA (Meta Title & Meta Description in 1 Row) ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Meta Title (SEO)
                  </label>
                  <span
                    className={`text-[10px] font-bold ${
                      (activeLang === "en" ? enMetaTitle.length : arMetaTitle.length) > 60
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {activeLang === "en" ? enMetaTitle.length : arMetaTitle.length} / 60 characters
                  </span>
                </div>
                {activeLang === "en" ? (
                  <input
                    type="text"
                    value={enMetaTitle}
                    onChange={(e) => setEnMetaTitle(e.target.value)}
                    placeholder="Sustainable Chemical Supply Chain | Leela Gulf FZC"
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                  />
                ) : (
                  <input
                    type="text"
                    value={arMetaTitle}
                    onChange={(e) => setArMetaTitle(e.target.value)}
                    dir="rtl"
                    placeholder="عنوان تحسين محركات البحث باللغة العربية"
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all text-right"
                  />
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  Optimal length between 50-60 characters for search engine rankings.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Meta Description (SEO)
                  </label>
                  <span
                    className={`text-[10px] font-bold ${
                      (activeLang === "en" ? enMetaDesc.length : arMetaDesc.length) > 160
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {activeLang === "en" ? enMetaDesc.length : arMetaDesc.length} / 160 characters
                  </span>
                </div>
                {activeLang === "en" ? (
                  <input
                    type="text"
                    value={enMetaDesc}
                    onChange={(e) => setEnMetaDesc(e.target.value)}
                    placeholder="Discover how sustainable practices and innovation transform supply chains..."
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all"
                  />
                ) : (
                  <input
                    type="text"
                    value={arMetaDesc}
                    onChange={(e) => setArMetaDesc(e.target.value)}
                    dir="rtl"
                    placeholder="وصف تحسين محركات البحث لمحركات مثل Google باللغة العربية..."
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main focus:bg-white transition-all text-right"
                  />
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  Optimal length between 150-160 characters for search snippet previews.
                </p>
              </div>
            </div>

            {/* ── ROW 5: WYSIWYG RICH TEXT & HTML CODE CONTENT ── */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gold-dark" />
                  <span>
                    {activeLang === "en" ? "Article Content *" : "Article Content (Arabic) *"}
                  </span>
                </label>
                <span className="text-[11px] text-gray-400 font-medium">
                  Switch between Visual Formatter and HTML Code Source anytime.
                </span>
              </div>

              {activeLang === "en" ? (
                <BlogWysiwygEditor
                  value={enContent}
                  onChange={setEnContent}
                  placeholder="Write the full English blog article here..."
                  dir="ltr"
                />
              ) : (
                <BlogWysiwygEditor
                  value={arContent}
                  onChange={setArContent}
                  placeholder="اكتب المحتوى الكامل للمقال باللغة العربية هنا..."
                  dir="rtl"
                />
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT SIDEBAR COLUMN (4 COLS): ACTIONS, IMAGE, AUTHOR
            ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Quick Actions Bar */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
            {/* Status Info Row */}
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500">Current Status:</span>
              <span
                className={`px-2.5 py-0.5 rounded-lg text-xs font-heading font-bold border flex items-center gap-1.5 ${
                  status === "Published"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${status === "Published" ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span>{status === "Published" ? "Published" : "Draft"}</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full">
              {/* Preview Button */}
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-gold-main"
              >
                <Eye className="w-3.5 h-3.5 text-gray-500" />
                <span className="whitespace-nowrap">Preview</span>
              </button>

              {/* Draft Button */}
              {status === "Published" ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit("Draft")}
                  className="flex-1 py-2.5 px-3 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                  title="Unpublish and change to draft"
                >
                  <Save className="w-3.5 h-3.5 text-amber-600" />
                  <span className="whitespace-nowrap">Make Draft</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit("Draft")}
                  className="flex-1 py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer hover:border-gold-main disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 text-gray-500" />
                  <span className="whitespace-nowrap">Save Draft</span>
                </button>
              )}

              {/* Primary Publish / Update Action Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit("Published")}
                className="flex-1 py-2.5 px-4 bg-[#d6b92a] hover:bg-gold-dark text-black hover:text-white rounded-xl text-xs font-heading font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span className="whitespace-nowrap">
                  {status === "Draft" ? "Publish Blog" : "Update"}
                </span>
              </button>
            </div>
          </div>

          {/* ── CARD 1: FEATURED IMAGE ── */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-dark" />
                <h3 className="text-xs font-heading font-extrabold text-gray-900 uppercase tracking-wider">
                  Featured Image
                </h3>
              </div>
              {featuredImage && (
                <button
                  type="button"
                  onClick={() => setFeaturedImage("")}
                  className="text-gray-400 hover:text-rose-600 transition-colors"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {featuredImage ? (
              <div className="space-y-2.5">
                <div className="w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative group shadow-2xs">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                </div>

                <input
                  ref={featuredFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                  id="featured-img-change-edit"
                />
                <label
                  htmlFor="featured-img-change-edit"
                  className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isUploadingFeatured ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-gray-600" />
                  )}
                  <span>Change Featured Image</span>
                </label>
              </div>
            ) : (
              <div>
                <input
                  ref={featuredFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                  id="featured-img-upload-edit"
                />
                <label
                  htmlFor="featured-img-upload-edit"
                  className={`w-full border-2 border-dashed border-gray-200 hover:border-gold-main/60 rounded-xl p-6 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors bg-gray-50/50 hover:bg-[#fdfaf0]/40 ${
                    isUploadingFeatured ? "pointer-events-none opacity-60" : ""
                  }`}
                >
                  {isUploadingFeatured ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-gold-dark" />
                      <span className="text-xs text-gray-600 font-bold mt-1">Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-gold-main/10 flex items-center justify-center text-gold-dark">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-gray-800">Upload Featured Image</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP up to 15MB</span>
                    </>
                  )}
                </label>
                <p className="text-[10px] text-gray-400 mt-2 text-center">
                  Recommended size: 1200 x 630px (Landscape 16:9 ratio)
                </p>
              </div>
            )}
          </div>

          {/* ── CARD 2: ABOUT THE AUTHOR PROFILE (Right Sidebar Position) ── */}
          <div className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <User className="w-4 h-4 text-gold-dark" />
              <h3 className="text-xs font-heading font-extrabold text-gray-900 uppercase tracking-wider">
                About the Author
              </h3>
            </div>

            {/* Author Avatar Upload */}
            <div className="flex items-center gap-3.5 p-3 bg-gray-50/80 rounded-xl border border-gray-200/80">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-main shrink-0 relative bg-white shadow-xs">
                <img
                  src={authorImage || "/images/careers/careers.avif"}
                  alt="Author"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <input
                  ref={authorFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAuthorImageUpload}
                  className="hidden"
                  id="author-img-upload-sidebar-edit"
                />
                <label
                  htmlFor="author-img-upload-sidebar-edit"
                  className="text-xs font-bold text-gold-dark hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  {isUploadingAuthor ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-gray-600" />
                  )}
                  <span>{isUploadingAuthor ? "Uploading..." : "Change Photo"}</span>
                </label>
                <span className="text-[10px] text-gray-400 block mt-0.5">1:1 Square recommended</span>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                {activeLang === "en" ? "Author Name *" : "اسم الكاتب (عربي) *"}
              </label>
              {activeLang === "en" ? (
                <input
                  type="text"
                  value={enAuthor}
                  onChange={(e) => setEnAuthor(e.target.value)}
                  placeholder="Ananya Sharma"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gold-main"
                />
              ) : (
                <input
                  type="text"
                  value={arAuthor}
                  onChange={(e) => setArAuthor(e.target.value)}
                  dir="rtl"
                  placeholder="أنانيا شارما"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gold-main text-right"
                />
              )}
            </div>

            {/* Author Role */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                {activeLang === "en" ? "Role / Designation" : "المسمى الوظيفي (عربي)"}
              </label>
              {activeLang === "en" ? (
                <input
                  type="text"
                  value={enAuthorRole}
                  onChange={(e) => setEnAuthorRole(e.target.value)}
                  placeholder="Compliance Specialist"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gold-main"
                />
              ) : (
                <input
                  type="text"
                  value={arAuthorRole}
                  onChange={(e) => setArAuthorRole(e.target.value)}
                  dir="rtl"
                  placeholder="أخصائية الامتثال"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gold-main text-right"
                />
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                {activeLang === "en" ? "Company Name" : "اسم الشركة (عربي)"}
              </label>
              {activeLang === "en" ? (
                <input
                  type="text"
                  value={enAuthorCompany}
                  onChange={(e) => setEnAuthorCompany(e.target.value)}
                  placeholder="LEELA GULF"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gold-main uppercase"
                />
              ) : (
                <input
                  type="text"
                  value={arAuthorCompany}
                  onChange={(e) => setArAuthorCompany(e.target.value)}
                  dir="rtl"
                  placeholder="ليلا جلف"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-gold-main text-right"
                />
              )}
            </div>

            {/* Author Bio (Spacious & Clean) */}
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                {activeLang === "en" ? "Author Biography" : "نبذة عن الكاتب (عربي)"}
              </label>
              {activeLang === "en" ? (
                <textarea
                  rows={4}
                  value={enAuthorBio}
                  onChange={(e) => setEnAuthorBio(e.target.value)}
                  placeholder="Ananya is a compliance expert with 8+ years of experience..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main resize-none leading-relaxed [scrollbar-width:thin]"
                />
              ) : (
                <textarea
                  rows={4}
                  value={arAuthorBio}
                  onChange={(e) => setArAuthorBio(e.target.value)}
                  dir="rtl"
                  placeholder="نبذة موجزة عن الكاتب..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-gold-main resize-none leading-relaxed text-right [scrollbar-width:thin]"
                />
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <LinkedinIcon className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                <input
                  type="url"
                  value={authorLinkedIn}
                  onChange={(e) => setAuthorLinkedIn(e.target.value)}
                  placeholder="https://linkedin.com/in/author"
                  className="w-full bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <Mail className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="author@leelagulf.com"
                  className="w-full bg-transparent text-xs text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIVE PREVIEW MODAL ── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gold-main/30 space-y-5 max-h-[90vh] overflow-y-auto [scrollbar-width:thin]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-dark" />
                <h3 className="font-heading font-extrabold text-sm text-gray-900 uppercase tracking-wider">
                  Live Article Preview
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Featured Image */}
            {featuredImage && (
              <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200">
                <img src={featuredImage} alt={enTitle} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Meta & Title */}
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-bold mb-2">
                {enCategories.map((c) => (
                  <span
                    key={c}
                    className="bg-[#fdfaf0] text-gold-dark px-2.5 py-0.5 rounded-lg border border-gold-main/30"
                  >
                    {c}
                  </span>
                ))}
                <span>•</span>
                <span>By {enAuthor}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900 leading-tight">
                {enTitle || "Untitled Article"}
              </h1>

              {enExcerpt && (
                <p className="text-sm text-gray-600 mt-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 leading-relaxed italic">
                  {enExcerpt}
                </p>
              )}
            </div>

            {/* HTML WYSIWYG Content Render */}
            <div
              className="article-wysiwyg-content border-t border-gray-100 pt-4 text-sm text-gray-800 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: enContent || "<p class='text-gray-400 italic'>No article content provided yet.</p>" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
