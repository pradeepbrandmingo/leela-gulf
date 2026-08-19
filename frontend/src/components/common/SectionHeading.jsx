"use client";

/**
 * SectionHeading - Global unified section heading component used across the entire website.
 * Enforces Modulus Pro (font-heading) in clean non-italic medium weight with natural inline word wrapping:
 * - Mobile: 24px | Small Tablet: 32px | Tablet/Laptop: 40px | Desktop: 48px
 */
export default function SectionHeading({ prefix, highlight, suffix = "", className = "" }) {
  return (
    <h2 className={`font-heading font-medium text-[24px] sm:text-[32px] md:text-[40px] lg:text-[48px] text-center text-white tracking-tight leading-tight mb-8 sm:mb-12 ${className}`}>
      {prefix && (
        <span
          className="font-heading text-white font-medium not-italic mr-2 inline"
          style={{ fontFamily: "var(--font-family-heading)", fontStyle: "normal" }}
        >
          {prefix}{" "}
        </span>
      )}
      {highlight && (
        <span
          className="font-heading text-gradient-gold-animated font-semibold not-italic inline"
          style={{ fontFamily: "var(--font-family-heading)", fontStyle: "normal" }}
        >
          {highlight}
        </span>
      )}
      {suffix && (
        <span
          className="font-heading text-white font-medium not-italic ml-2 inline"
          style={{ fontFamily: "var(--font-family-heading)", fontStyle: "normal" }}
        >
          {" "}{suffix}
        </span>
      )}
    </h2>
  );
}
