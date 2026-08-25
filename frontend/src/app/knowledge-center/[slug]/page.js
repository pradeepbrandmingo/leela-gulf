"use client";

import { use } from "react";
import { BLOGS_DATA } from "@/data/blogsData";
import BlogDetailsHero from "@/components/knowledge-center/BlogDetailsHero";
import BlogDetailsBody from "@/components/knowledge-center/BlogDetailsBody";

export default function BlogDetailPage({ params }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  // Match blog from dataset or fallback to first blog
  const blog =
    BLOGS_DATA.find(
      (b) => b.slug === slug || b.id === slug
    ) || BLOGS_DATA[0];

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white">
      {/* ── 1. DYNAMIC BLOG DETAILS HERO BANNER ── */}
      <BlogDetailsHero blog={blog} />

      {/* ── 2. BLOG ARTICLE CONTENT BODY ── */}
      <BlogDetailsBody blog={blog} />
    </main>
  );
}
