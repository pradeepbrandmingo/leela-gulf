"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";
// Font Awesome CSS Icon Font classes — NO SVG in DOM, rendered via <i> tags

/**
 * ServiceSectionItem - Modular animated row for the 3 solutions pillars:
 * 1. Legal Advice (Image Left, Content Right)
 * 2. Legal Documentation (Content Left, Image Right)
 * 3. Monitoring (Image Left, Content Right)
 * - Direction-aware for Arabic (RTL).
 * - Zero buttons as strictly requested.
 * - Standardized Global Section Spacing (py-10 sm:py-14 md:py-16).
 * - 100% Global theme tokens (var(--color-primary), var(--color-card-dark), text-gradient-gold-animated).
 */
function ServiceSectionItem({ service, isReversed, index }) {
  const { isRTL } = useLanguage();
  const rowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const iconClass = service.iconClass;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center ${
        index !== 0 ? "pt-10 sm:pt-12 md:pt-14 lg:pt-16" : ""
      }`}
    >
      {/* ═══════════════════════════════════════════
          IMAGE CONTAINER (Alternates left/right with 3D Flip-In Animation)
          ═══════════════════════════════════════════ */}
      <div
        className={`lg:col-span-6 relative [perspective:1400px] transition-all duration-[1300ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
          isReversed
            ? "lg:order-2"
            : "lg:order-1"
        } ${
          isVisible
            ? "opacity-100 [transform:perspective(1400px)_rotateY(0deg)_translateX(0)_scale(1)]"
            : (isReversed !== isRTL)
              ? "opacity-0 [transform:perspective(1400px)_rotateY(32deg)_translateX(60px)_scale(0.92)] origin-right"
              : "opacity-0 [transform:perspective(1400px)_rotateY(-32deg)_translateX(-60px)_scale(0.92)] origin-left"
        }`}
      >
        {/* Ambient Gold Atmospheric Glow */}
        <div className="absolute -inset-4 bg-gold-main/[0.08] rounded-full blur-3xl pointer-events-none" />

        {/* 1. Layered Offset Architectural Backing Panel */}
        <div
          className={`absolute inset-0 ${
            isReversed
              ? "translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4"
              : "-translate-x-3 translate-y-3 sm:-translate-x-4 sm:translate-y-4"
          } rounded-2xl sm:rounded-3xl border border-gold-main/30 bg-gradient-to-br from-[#181c2b]/90 via-[#10131f]/80 to-black/90 shadow-xl pointer-events-none -z-10 group-hover:border-gold-main/60 transition-all duration-500`}
        >
          {/* Subtle gold corner accents */}
          <div className="absolute top-3 right-3 w-8 h-[1.5px] bg-gradient-gold-animated opacity-70" />
          <div className="absolute bottom-3 left-3 w-8 h-[1.5px] bg-gradient-gold-animated opacity-70" />
        </div>

        {/* 2. Main Luxury Metallic Rim Container */}
        <div className="relative mx-auto w-full max-w-[580px] lg:max-w-none p-[1.5px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gold-light/60 via-white/20 to-gold-main/40 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(202,154,53,0.12)] group">
          {/* Inner Image Container */}
          <div className="relative w-full rounded-[14.5px] sm:rounded-[22.5px] overflow-hidden bg-[var(--color-card-dark)] aspect-[1.38/1] sm:aspect-[1.45/1] md:aspect-[1.5/1]">
            {/* High-res Image */}
            <Image
              src={service.image}
              alt={service.titlePart1 + " " + service.titlePart2}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 650px"
              priority={index === 0}
            />

            {/* Smooth Multi-Stop Dark Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Sleek Minimalist Luxury Glass Badge */}
            <div
              className={`absolute top-3.5 sm:top-4.5 ${
                isRTL ? "right-3.5 sm:right-4.5" : "left-3.5 sm:left-4.5"
              } z-20 flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-gold-light/40 shadow-xl transition-all duration-300 group-hover:border-gold-light/70`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse shadow-[0_0_8px_rgba(202,154,53,0.9)]" />
              <span className="font-heading font-semibold text-[10px] sm:text-[11px] text-gold-light tracking-wider uppercase">
                {isRTL ? service.titlePart1 : `${service.titlePart1} ${service.titlePart2}`}
              </span>
            </div>

            {/* Bottom Subtle Glass Tagline Strip */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className={`${iconClass} text-gold-light text-xs sm:text-sm`} />
                <span className="font-heading font-medium text-[11px] sm:text-[12px] text-white/90">
                  {service.tagline}
                </span>
              </div>
              <div className="w-5 h-[2px] bg-gradient-gold-animated rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TEXT CONTENT (Alternates opposite to image)
          ═══════════════════════════════════════════ */}
      <div
        className={`lg:col-span-6 flex flex-col justify-center transition-all duration-[1200ms] delay-200 ease-out ${
          isRTL ? "text-right items-start" : "text-left items-start"
        } ${
          isReversed
            ? "lg:order-1"
            : "lg:order-2"
        } ${
          isVisible
            ? "opacity-100 translate-x-0"
            : isReversed
              ? "opacity-0 -translate-x-12"
              : "opacity-0 translate-x-12"
        }`}
      >
        {/* Main Title (Dual-tone white + animated gold gradient) */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] xl:text-[2.85rem] text-white leading-[1.16] tracking-tight mb-3 sm:mb-4 drop-shadow-sm">
          <span>{service.titlePart1}{" "}</span>
          <span className="text-gradient-gold-animated">{service.titlePart2}</span>
        </h2>

        {/* Gold Horizontal Accent Bar */}
        <div className="w-14 sm:w-16 h-[2.5px] sm:h-[3px] bg-gradient-gold-animated rounded-full mb-4 sm:mb-6" />

        {/* Narrative Description */}
        <p className="font-subheading text-gray-300/90 text-sm sm:text-base md:text-[1.02rem] leading-relaxed mb-5 sm:mb-6 max-w-xl">
          {service.description}
        </p>

        {/* Professional Highlight Tagline Badge — Font Awesome CSS Icon Font (No SVG) */}
        <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/90 shadow-sm transition-all duration-300 hover:border-gold-main/40 group/tag">
          <i className={`${iconClass} text-gold-light text-sm sm:text-[15px] shrink-0 transition-transform duration-300 group-hover/tag:scale-110`} />
          <span className="font-heading font-medium text-xs sm:text-sm md:text-[13.5px] text-white/95 tracking-wide">
            {service.tagline}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * ComplianceServices - Full 3-Section Showcase Component for Solutions:
 * 1. Legal Advice (Left Image, Right Content)
 * 2. Legal Documentation (Left Content, Right Image)
 * 3. Monitoring (Left Image, Right Content)
 */
export default function ComplianceServices() {
  const { isRTL } = useLanguage();

  const services = isRTL
    ? [
        {
          id: "legal-advice",
          titlePart1: "الاستشارات",
          titlePart2: "القانونية",
          description:
            "قد يكون التعامل مع لوائح إدارة النفايات والامتثال البيئي أمراً معقداً، لكن فريقنا القانوني المتخصص يضمن التزامك التام بكافة القوانين والتشريعات البيئية. نقدم إرشادات استراتيجية لمساعدتك على تقليل المخاطر وتجنب الغرامات وتطبيق أفضل الممارسات المستدامة.",
          tagline: "التزم بالمعايير واللوائح، واحمِ أعمالك بثقة وأمان.",
          image: "/images/Sustainability And Compliance/Legal Advice.avif",
          iconClass: "fa-solid fa-scale-balanced",
          isReversed: false,
        },
        {
          id: "legal-documentation",
          titlePart1: "التوثيق",
          titlePart2: "القانوني والامتثال",
          description:
            "يعد التوثيق القانوني السليم أمراً حيوياً للحصول على الموافقات التنظيمية وسير العمليات بسلاسة. نساعد في صياغة ومراجعة وإدارة كافة الوثائق القانونية اللازمة، بما في ذلك اتفاقيات التخلص من النفايات، تقييمات الأثر البيئي، وتقارير الامتثال لضمان استيفاء كافة المتطلبات القانونية بسلاسة.",
          tagline: "بسّط إجراءاتك التوثيقية، واحمِ منشأتك بفعالية واستدامة.",
          image: "/images/Sustainability And Compliance/Legal Documentation.avif",
          iconClass: "fa-solid fa-file-contract",
          isReversed: true,
        },
        {
          id: "monitoring",
          titlePart1: "المراقبة",
          titlePart2: "والتدقيق المستمر",
          description:
            "يعد ضمان الامتثال المستمر ركيزة أساسية للإدارة المسؤولة للنفايات والموارد. تساعدك خدمات المراقبة لدينا في تتبع ممارسات التخلص من النفايات، وحفظ السجلات بدقة، ومواكبة اللوائح المتطورة باستمرار. من خلال نهجنا الاستباقي، يمكنك منع المشكلات القانونية والتنظيمية قبل حدوثها.",
          tagline: "كن في المقدمة دائماً مع الرقابة والتدقيق الاحترافي.",
          image: "/images/Sustainability And Compliance/Monitoring.avif",
          iconClass: "fa-solid fa-chart-line",
          isReversed: false,
        },
      ]
    : [
        {
          id: "legal-advice",
          titlePart1: "Legal",
          titlePart2: "Advice",
          description:
            "Navigating waste management regulations can be complex, but our expert legal team ensures you stay compliant with all environmental laws. We provide strategic guidance to help you mitigate risks, avoid penalties, and implement best practices for sustainable waste management.",
          tagline: "Stay compliant, stay secure.",
          image: "/images/Sustainability And Compliance/Legal Advice.avif",
          iconClass: "fa-solid fa-scale-balanced",
          isReversed: false,
        },
        {
          id: "legal-documentation",
          titlePart1: "Legal",
          titlePart2: "Documentation",
          description:
            "Proper documentation is crucial for regulatory approvals and smooth operations. We assist in drafting, reviewing, and managing all necessary legal documents, including waste disposal agreements, environmental impact assessments, and compliance reports, ensuring you meet all legal requirements seamlessly.",
          tagline: "Streamline your documentation, safeguard your business.",
          image: "/images/Sustainability And Compliance/Legal Documentation.avif",
          iconClass: "fa-solid fa-file-contract",
          isReversed: true,
        },
        {
          id: "monitoring",
          titlePart1: "Compliance",
          titlePart2: "Monitoring",
          description:
            "Ensuring ongoing compliance is key to responsible waste management. Our monitoring services help you track waste disposal practices, maintain records, and stay updated on evolving regulations. With our proactive approach, you can prevent legal issues before they arise.",
          tagline: "Stay ahead with expert monitoring.",
          image: "/images/Sustainability And Compliance/Monitoring.avif",
          iconClass: "fa-solid fa-chart-line",
          isReversed: false,
        },
      ];

  return (
    <section className="relative w-full bg-[var(--color-primary)] text-white py-10 sm:py-14 md:py-16 overflow-hidden">
      {/* Subtle Ambient Background Depth */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gold-main/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 left-0 w-[500px] h-[500px] bg-gold-main/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">
        <div className="space-y-0">
          {services.map((service, index) => (
            <ServiceSectionItem
              key={service.id}
              service={service}
              isReversed={service.isReversed}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
