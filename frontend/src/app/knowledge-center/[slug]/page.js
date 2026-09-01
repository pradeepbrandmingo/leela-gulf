"use client";

import { use, useState, useEffect } from "react";
import { apiRequest } from "@/config/api";
import { BLOGS_DATA } from "@/data/blogsData";
import BlogDetailsHero from "@/components/knowledge-center/BlogDetailsHero";
import BlogDetailsBody from "@/components/knowledge-center/BlogDetailsBody";
import { Loader2 } from "lucide-react";

export default function BlogDetailPage({ params }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogData() {
      setIsLoading(true);
      try {
        // Fetch specific blog by slug from backend MongoDB API
        const res = await apiRequest(`/blogs/${slug}`, { silent: true });
        if (res?.success && res?.data) {
          const b = res.data;
          // Normalize MongoDB format for components
          const normalized = {
            _id: b._id,
            id: b.slug,
            slug: b.slug,
            title: b.en?.title || b.title || b.slug,
            titleAr: b.ar?.title || b.en?.title || "",
            category: b.category || b.en?.category || "General",
            categoryAr: b.ar?.category || b.category || "عام",
            categories: b.categories || b.en?.categories || [],
            views: b.views || 0,
            viewsAr: b.views ? `${b.views} مشاهدة` : "0 مشاهدة",
            image: b.image || "/images/blogimage/blogdetails.jpg",
            heroImage: b.image || "/images/blogimage/blogdetails.jpg",
            authorImage: b.authorImage || "",
            authorLinkedIn: b.authorLinkedIn || "https://linkedin.com",
            authorEmail: b.authorEmail || "",
            date: b.date || (b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently Published"),
            dateAr: b.ar?.date || b.date,
            readTime: b.en?.readTime || b.readTime || "5 Min Read",
            readTimeAr: b.ar?.readTime || "5 دقائق قراءة",
            excerpt: b.en?.excerpt || b.excerpt || "",
            excerptAr: b.ar?.excerpt || "",
            content: b.en?.content || b.content || "",
            contentAr: b.ar?.content || b.en?.content || "",
            author: b.en?.author || b.author || "Leela Gulf Editorial Team",
            authorAr: b.ar?.author || b.en?.author || "فريق تحرير ليلا جلف",
            authorRole: b.en?.authorRole || b.authorRole || "Author",
            authorRoleAr: b.ar?.authorRole || "كاتب",
            authorCompany: b.en?.authorCompany || b.authorCompany || "LEELA GULF",
            authorCompanyAr: b.ar?.authorCompany || "ليلا جلف",
            authorBio: b.en?.authorBio || b.authorBio || "",
            authorBioAr: b.ar?.authorBio || "",
          };
          setBlog(normalized);
        } else {
          // Fallback to static mock if not in DB
          const fallback = BLOGS_DATA.find((b) => b.slug === slug || b.id === slug) || BLOGS_DATA[0];
          setBlog(fallback);
        }

        // Fetch all published blogs for recent posts sidebar widget
        const allRes = await apiRequest("/blogs?status=Published", { silent: true });
        if (allRes?.success && Array.isArray(allRes?.data)) {
          setAllBlogs(allRes.data);
        }
      } catch (err) {
        console.warn("Failed to load live blog, using fallback:", err);
        const fallback = BLOGS_DATA.find((b) => b.slug === slug || b.id === slug) || BLOGS_DATA[0];
        setBlog(fallback);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchBlogData();
    }
  }, [slug]);

  if (isLoading && !blog) {
    return (
      <main className="min-h-screen bg-[var(--color-primary)] text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-gold-main" />
        <span className="text-sm font-subheading text-gray-400">Loading article...</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white">
      {/* ── 1. DYNAMIC BLOG DETAILS HERO BANNER ── */}
      <BlogDetailsHero blog={blog} />

      {/* ── 2. BLOG ARTICLE CONTENT BODY ── */}
      <BlogDetailsBody blog={blog} allBlogs={allBlogs} />
    </main>
  );
}
