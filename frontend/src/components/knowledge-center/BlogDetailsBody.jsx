"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Link2,
  Check,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  FileText,
  SlidersHorizontal,
  ShieldCheck,
  Layers,
  Award,
  Cpu,
  CalendarDays,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { BLOGS_DATA } from "@/data/blogsData";

// Custom Facebook Icon Component
function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// Custom LinkedIn Icon Component
function LinkedinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z" />
    </svg>
  );
}

// Custom X (Twitter) Icon Component
function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Custom WhatsApp Icon Component
function WhatsappIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 2c-5.514 0-9.997 4.483-9.997 9.998 0 1.763.459 3.483 1.332 5.003l-1.396 5.105 5.228-1.371c1.468.802 3.123 1.262 4.833 1.262 5.514 0 9.997-4.483 9.997-9.998 0-5.515-4.483-9.999-9.997-9.999zm4.993 14.154c-.207.583-1.215 1.144-1.683 1.189-.469.044-1.077.204-3.579-.794-2.997-1.196-4.914-4.249-5.064-4.45-.149-.201-1.216-1.618-1.216-3.089 0-1.471.768-2.195 1.042-2.493.274-.298.598-.372.798-.372.199 0 .399.002.573.01.184.009.432-.07.674.512.249.6.847 2.067.922 2.217.075.149.124.323.025.522-.099.199-.149.323-.298.497-.149.174-.313.367-.447.493-.149.149-.306.312-.132.611.174.298.773 1.275 1.657 2.062 1.135 1.012 2.092 1.326 2.391 1.475.298.149.473.124.647-.075.174-.199.746-.871.945-1.169.199-.298.398-.249.672-.149.274.099 1.742.821 2.041.97.298.149.497.224.572.348.075.124.075.721-.132 1.304z" />
    </svg>
  );
}

const CATEGORY_WIDGET_ITEMS = [
  { key: "ALL", label: "All Categories", labelAr: "جميع التصنيفات", icon: Layers },
  { key: "COMPLIANCE", label: "Compliance", labelAr: "الامتثال والتنظيم", icon: ShieldCheck },
  { key: "QUALITY", label: "Quality", labelAr: "ضمان الجودة", icon: Award },
  { key: "INDUSTRY INSIGHTS", label: "Industry Insights", labelAr: "رؤى القطاع", icon: SlidersHorizontal },
  { key: "REGULATIONS", label: "Regulations", labelAr: "اللوائح العامة", icon: FileText },
  { key: "TECHNOLOGY", label: "Technology", labelAr: "التقنية والابتكار", icon: Cpu },
  { key: "LEELA GULF UPDATES", label: "Events", labelAr: "الأحداث والتحديثات", icon: CalendarDays },
];

export default function BlogDetailsBody({ blog }) {
  const { isRTL } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState(null); // 'YES' | 'NO'
  const [currentUrl, setCurrentUrl] = useState("https://leelagulf.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Current Blog Details or Fallback
  const currentBlog = blog || BLOGS_DATA[0];
  const title = isRTL ? currentBlog.titleAr : currentBlog.title;
  const excerpt = isRTL ? currentBlog.excerptAr : currentBlog.excerpt;
  const category = isRTL ? currentBlog.categoryAr : currentBlog.category;

  // Recent Posts (excluding current article)
  const recentPosts = BLOGS_DATA.filter((b) => b.id !== currentBlog.id).slice(0, 3);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Find Next & Prev Articles for Footer Navigation
  const currentIndex = BLOGS_DATA.findIndex((b) => b.id === currentBlog.id);
  const prevArticle = currentIndex > 0 ? BLOGS_DATA[currentIndex - 1] : null;
  const nextArticle = currentIndex < BLOGS_DATA.length - 1 ? BLOGS_DATA[currentIndex + 1] : BLOGS_DATA[0];

  return (
    <section className="w-full bg-[var(--color-primary)] py-8 sm:py-14 text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        
        {/* ═══════════════════════════════════════════
            FLEX WRAPPER: SHARE BAR (own column) + GRID (article + sidebar)
            Share bar is OUTSIDE the grid so it naturally top-aligns
            ═══════════════════════════════════════════ */}
        <div className="flex items-start gap-4 lg:gap-6 relative">

          {/* ═══════════════════════════════════════════
              STICKY LEFT SOCIAL SHARE BAR — own flex column
              Naturally top-aligned with the white card
              ═══════════════════════════════════════════ */}
          <div className="hidden lg:block w-14 shrink-0">
            <div className="sticky top-24 flex flex-col items-center gap-3 z-20">
              <span className="font-heading font-bold text-[10px] tracking-widest text-gray-400 uppercase mb-0.5">
                {isRTL ? "مشاركة" : "SHARE"}
              </span>

              {/* LinkedIn Share */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                className="w-10 h-10 rounded-full bg-white text-gold-main hover:bg-gold-main hover:text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <LinkedinIcon className="w-4 h-4 fill-current stroke-none" />
              </a>

              {/* Twitter / X Share */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on X"
                className="w-10 h-10 rounded-full bg-white text-gold-main hover:bg-gold-main hover:text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                className="w-10 h-10 rounded-full bg-white text-gold-main hover:bg-gold-main hover:text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <FacebookIcon className="w-4 h-4 fill-current stroke-none" />
              </a>

              {/* Copy Link Button */}
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy Link"
                className="w-10 h-10 rounded-full bg-white text-gold-main hover:bg-gold-main hover:text-black flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer relative"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
              </button>

              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="w-10 h-10 rounded-full bg-white text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
              >
                <WhatsappIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              CONTENT GRID: ARTICLE CARD + SIDEBAR WIDGETS
              ═══════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-11 gap-6 lg:gap-8 items-start">

          {/* ═══════════════════════════════════════════
              MAIN WHITE ARTICLE CARD CONTAINER
              100% Production Ready for Backend API Data
              ═══════════════════════════════════════════ */}
          <article className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-black shadow-2xl space-y-8 relative">

            {/* Dynamic Backend HTML Content OR Modular Section Fallback */}
            {currentBlog.content ? (
              <div
                className="article-wysiwyg-content font-subheading text-gray-700 text-sm sm:text-base leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: isRTL ? (currentBlog.contentAr || currentBlog.content) : currentBlog.content,
                }}
              />
            ) : (
              <>
                {/* Article Section: Introduction */}
                <div className="space-y-3">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">
                    {isRTL ? "المقدمة" : "Introduction"}
                  </h2>
                  <p className="font-subheading text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                    {isRTL
                      ? "يتطور المشهد التنظيمي لصناعة المواد الكيميائية باستمرار، وأصبح التوافق مع معايير السلامة أكثر أهمية من أي وقت مضى. في عام 2026، من المتوقع أن تؤثر عدة تغييرات رئيسية على عمليات الشركات وموزعي المواد السائلة في الشرق الأوسط وحول العالم."
                      : "The regulatory landscape is constantly evolving, and staying compliant is more important than ever. In 2026, several key changes are set to impact businesses across industries. This guide breaks down the most important updates and what they mean for your organization."}
                  </p>
                </div>

                {/* Article Section 1: Key Regulatory Changes */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
                    {isRTL
                      ? "1. التغييرات التنظيمية الرئيسية لعام 2026"
                      : "1. Key Regulatory Changes in 2026"}
                  </h3>
              <p className="font-subheading text-gray-600 text-xs sm:text-sm leading-relaxed">
                {isRTL
                  ? "تم تقديم سياسات وتعديلات جديدة لتعزيز الشفافية والمساءلة والكفاءة التشغيلية. يجب على الشركات التكيف مع هذه التغييرات لتجنب الغرامات والحفاظ على الامتثال."
                  : "New policies and amendments have been introduced to enhance transparency, accountability, and operational efficiency. Businesses must adapt to these changes to avoid penalties and maintain compliance."}
              </p>

              {/* Focus Areas Callout matching Reference Screenshot #2 */}
              <div className="pl-6 sm:pl-8 border-l-4 border-[#c4842f] my-6 py-1 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-gold-animated text-black flex items-center justify-center shrink-0 shadow-md mt-0.5">
                  <FileText className="w-5 h-5 stroke-[2.2] text-black" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-base text-gray-900">
                    {isRTL ? "مجالات التركيز الرئيسية:" : "Focus Areas:"}
                  </h4>
                  <ul className="space-y-2 font-subheading text-xs sm:text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold-main shrink-0 stroke-[2.5]" />
                      <span>
                        {isRTL
                          ? "متطلبات إعداد التقارير والتوثيق الأكثر صرامة."
                          : "Stricter reporting and documentation requirements"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold-main shrink-0 stroke-[2.5]" />
                      <span>
                        {isRTL
                          ? "معايير محسنة لخصوصية البيانات والأمن التشغيلي."
                          : "Enhanced data privacy and security standards"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold-main shrink-0 stroke-[2.5]" />
                      <span>
                        {isRTL
                          ? "تحديثات الامتثال المخصصة للقطاع الكيميائي واللوجستي."
                          : "Industry-specific compliance updates"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Article Section 2: Impact on Businesses */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
                {isRTL ? "2. التأثير على الأعمال والشركات" : "2. Impact on Businesses"}
              </h3>
              <p className="font-subheading text-gray-600 text-xs sm:text-sm leading-relaxed">
                {isRTL
                  ? "تؤثر هذه التغييرات على مسارات العمل والأنظمة والعمليات التجارية العامة. يجب على الشركات تقييم عملياتها الحالية وتطبيق التعديلات اللازمة."
                  : "These changes affect workflows, systems, and overall business operations. Companies should assess their current processes and implement necessary adjustments."}
              </p>

              {/* Bullet Points with Gold Dots matching Reference Screenshot #1 */}
              <ul className="space-y-2.5 font-subheading text-xs sm:text-sm text-gray-700 pt-1">
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-gold-animated shrink-0 shadow-sm" />
                  <span>
                    {isRTL
                      ? "زيادة تدقيق الامتثال والمراقبة الدورية."
                      : "Increased compliance audits and monitoring"}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-gold-animated shrink-0 shadow-sm" />
                  <span>
                    {isRTL
                      ? "عقوبات محتملة لعدم الامتثال للوائح الدولية."
                      : "Potential penalties for non-compliance"}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-gradient-gold-animated shrink-0 shadow-sm" />
                  <span>
                    {isRTL
                      ? "الحاجة إلى تدريب الموظفين وتوعيتهم بالسلامة."
                      : "Need for employee training and awareness"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Article Section 3: How to Stay Compliant */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
                {isRTL ? "3. كيفية الحفاظ على الامتثال" : "3. How to Stay Compliant"}
              </h3>
              <p className="font-subheading text-gray-600 text-xs sm:text-sm leading-relaxed">
                {isRTL
                  ? "التخطيط الاستباقي والأدوات المناسبة يمكن أن تساعد عملك على البقاء في الصدارة. إليك بعض أفضل الممارسات:"
                  : "Proactive planning and the right tools can help your business stay ahead. Here are some best practices:"}
              </p>

              <ul className="space-y-2.5 font-subheading text-xs sm:text-sm text-gray-700 pt-1">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0" />
                  <span>
                    {isRTL
                      ? "مراجعة تحديثات اللوائح بانتظام."
                      : "Regularly review regulatory updates"}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0" />
                  <span>
                    {isRTL
                      ? "الاستثمار في حلول إدارة الامتثال الرقمية."
                      : "Invest in compliance management solutions"}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold-main shrink-0" />
                  <span>
                    {isRTL
                      ? "تدريب فريقك وبناء ثقافة الامتثال أولاً."
                      : "Train your team and build a compliance-first culture"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Article Section: Conclusion */}
            <div className="space-y-3 pt-2">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-gray-900 tracking-tight">
                {isRTL ? "الخاتمة" : "Conclusion"}
              </h3>
              <p className="font-subheading text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">
                {isRTL
                  ? "يتطلب الحفاظ على الامتثال في عام 2026 الوعي والاستعداد والتحسين المستمر. من خلال فهم أحدث اللوائح واتخاذ خطوات استباقية، يمكن للشركات تقليل المخاطر وفتح فرص جديدة للنمو."
                  : "Staying compliant in 2026 requires awareness, preparation, and continuous improvement. By understanding the latest regulations and taking proactive steps, businesses can minimize risks and unlock new opportunities for growth."}
              </p>
            </div>
            </>
            )}

            {/* Mobile Share Bar Row (All 5 Share Options) */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 lg:hidden">
              <span className="font-heading font-bold text-xs text-gray-500">
                {isRTL ? "مشاركة المقال:" : "Share Article:"}
              </span>
              <div className="flex items-center gap-2">
                {/* LinkedIn Share */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on LinkedIn"
                  className="w-8 h-8 rounded-full bg-gray-100 text-gold-main hover:bg-gold-main hover:text-black flex items-center justify-center transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 fill-current stroke-none" />
                </a>

                {/* Twitter / X Share */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on X"
                  className="w-8 h-8 rounded-full bg-gray-100 text-gold-main hover:bg-gold-main hover:text-black flex items-center justify-center transition-colors"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </a>

                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Facebook"
                  className="w-8 h-8 rounded-full bg-gray-100 text-gold-main hover:bg-gold-main hover:text-black flex items-center justify-center transition-colors"
                >
                  <FacebookIcon className="w-3.5 h-3.5 fill-current stroke-none" />
                </a>

                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Copy Link"
                  className="w-8 h-8 rounded-full bg-gray-100 text-gold-main hover:bg-gold-main hover:text-black flex items-center justify-center transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
                </button>

                {/* WhatsApp Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on WhatsApp"
                  className="w-8 h-8 rounded-full bg-gray-100 text-emerald-500 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                >
                  <WhatsappIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Interactive Feedback Box */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-heading font-bold text-xs sm:text-sm text-gray-800">
                {isRTL ? "هل كان هذا المقال مفيداً؟" : "Was this article helpful?"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setHelpfulFeedback("YES")}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    helpfulFeedback === "YES"
                      ? "bg-gold-main text-black shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{isRTL ? "نعم" : "Yes"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHelpfulFeedback("NO")}
                  className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    helpfulFeedback === "NO"
                      ? "bg-gray-800 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{isRTL ? "لا" : "No"}</span>
                </button>
              </div>
            </div>

            {/* Article Footer Navigation Row */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              {prevArticle ? (
                <Link
                  href={`/knowledge-center/${prevArticle.slug}`}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-heading font-bold text-xs hover:border-gold-main hover:text-gold-main transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                  <span>{isRTL ? "السابق" : "Previous"}</span>
                </Link>
              ) : (
                <span className="text-xs text-gray-300 font-subheading">
                  {isRTL ? "الأحدث" : "Previous"}
                </span>
              )}

              <Link
                href={`/knowledge-center/${nextArticle.slug}`}
                className="px-5 py-2 rounded-xl bg-white border-2 border-gold-main text-gold-main font-heading font-bold text-xs hover:bg-gradient-gold-animated hover:text-black hover:border-transparent transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>{isRTL ? "التالي" : "Next"}</span>
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>

          </article>

          {/* ═══════════════════════════════════════════
              COLUMN 3: RIGHT SIDEBAR (3 STACKED WHITE CARDS)
              ═══════════════════════════════════════════ */}
          <aside className="lg:col-span-3 space-y-6">

            {/* ── SIDEBAR WIDGET 1: CATEGORIES LIST ── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-black shadow-xl border border-gray-100">
              <h4 className="font-heading font-bold text-base text-gray-900">
                {isRTL ? "التصنيفات" : "Categories"}
              </h4>
              <div className="w-6 h-0.5 bg-gradient-gold-animated rounded-full mt-1.5 mb-4" />

              <div className="space-y-1.5">
                {CATEGORY_WIDGET_ITEMS.map((item) => {
                  const IconComp = item.icon;
                  const isActive = currentBlog.category === item.key;

                  return (
                    <Link
                      key={item.key}
                      href="/knowledge-center"
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-subheading transition-colors ${
                        isActive
                          ? "bg-gold-main/15 text-gold-main font-bold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-gold-main" : "text-gray-400"}`} />
                      <span>{isRTL ? item.labelAr : item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── SIDEBAR WIDGET 2: ABOUT THE AUTHOR (Matching Screenshot #2) ── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-black shadow-xl border border-gray-100">
              <h4 className="font-heading font-bold text-base text-gray-900">
                {isRTL ? "عن الكاتب" : "About the Author"}
              </h4>
              <div className="w-6 h-0.5 bg-gradient-gold-animated rounded-full mt-1.5 mb-4" />

              {/* Author Header: Left Avatar + Right Details */}
              <div className="flex items-center gap-3 mb-3 text-left rtl:text-right">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold-main shrink-0 shadow-sm">
                  <Image
                    src="/images/careers/careers.avif"
                    alt="Author Ananya Sharma"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-heading font-bold text-sm text-gray-900 leading-snug">
                    {isRTL ? "أنانيا شارما" : "Ananya Sharma"}
                  </h5>
                  <span className="font-subheading text-[11px] text-gray-500 block">
                    {isRTL ? "أخصائية الامتثال" : "Compliance Specialist"}
                  </span>
                  <span className="font-heading font-bold text-[10.5px] text-gold-main tracking-wider block uppercase">
                    LEELA GULF
                  </span>
                </div>
              </div>

              {/* Author Bio */}
              <p className="font-subheading text-xs text-gray-500 leading-relaxed text-left rtl:text-right mb-4">
                {isRTL
                  ? "أنانيا أخصائية امثتال معتمدة بخبرة تزيد عن 8 سنوات في مساعدة الشركات على تطبيق معايير السلامة الدولية."
                  : "Ananya is a compliance expert with 8+ years of experience helping businesses navigate complex regulations and ensure adherence to industry standards."}
              </p>

              {/* Author Social Links */}
              <div className="flex items-center gap-3 pt-1 justify-start">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-main hover:text-black transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4 fill-current stroke-none" />
                </a>
                <a
                  href="mailto:contact@leelagulf.com"
                  className="text-gold-main hover:text-black transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* ── SIDEBAR WIDGET 3: RECENT POSTS ── */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-black shadow-xl border border-gray-100">
              <h4 className="font-heading font-bold text-base text-gray-900">
                {isRTL ? "أحدث المقالات" : "Recent Posts"}
              </h4>
              <div className="w-6 h-0.5 bg-gradient-gold-animated rounded-full mt-1.5 mb-4" />

              <div className="space-y-3.5">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/knowledge-center/${post.slug}`}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-950 shrink-0 border border-gray-100">
                      <Image
                        src={post.heroImage || "/images/blogimage/blogdetails.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Title & Date */}
                    <div>
                      <h5 className="font-heading font-bold text-xs text-gray-900 line-clamp-2 leading-snug group-hover:text-gold-main transition-colors">
                        {isRTL ? post.titleAr : post.title}
                      </h5>
                      <span className="font-subheading text-[10.5px] text-gray-400 block mt-1">
                        {isRTL ? post.dateAr : post.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

          </div>{/* end content grid */}
        </div>{/* end flex wrapper */}
      </div>
    </section>
  );
}
