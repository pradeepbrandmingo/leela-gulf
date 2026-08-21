"use client";

import { useLanguage } from "@/context/LanguageContext";

/**
 * ContactHero - Hero banner header for the Contact Us page.
 * Displays the badge `- CONTACT US -`, bold heading, and descriptive subtitle matching Screenshot 1.
 */
export default function ContactHero() {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`w-full text-center max-w-4xl mx-auto mb-10 sm:mb-14 ${isRTL ? "text-right sm:text-center" : "text-left sm:text-center"}`}>
      
      {/* Top Gold Badge */}
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="w-6 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
        <span className="font-heading font-bold text-xs sm:text-sm tracking-widest text-[#c4842f] uppercase">
          CONTACT US
        </span>
        <span className="w-6 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
      </div>

      {/* Main Bold Heading */}
      <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.3rem] text-white leading-[1.2] tracking-tight mb-4">
        {isRTL ? (
          <>
            ليلا الخليج هي البوابة{" "}
            <span className="text-gradient-gold-animated">عالية الثقة</span> لقطاع المواد الكيميائية.
          </>
        ) : (
          <>
            Leela Gulf is the high-trust gateway to the{" "}
            <span className="text-gradient-gold-animated">Indian Chemical Industry.</span>
          </>
        )}
      </h1>

      {/* Descriptive Subtitle */}
      <p className="font-subheading text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
        {isRTL
          ? "هل لديك أسئلة أو تحتاج إلى إرشادات من الخبراء؟ فريقنا هنا لمساعدتك"
          : "Have questions or need expert guidance? Our team is here to assist you with the"}
      </p>
    </div>
  );
}
