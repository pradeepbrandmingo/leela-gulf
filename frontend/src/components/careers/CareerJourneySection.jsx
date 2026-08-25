"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FileText, PhoneCall, Code2, Building2, Award, ChevronDown } from "lucide-react";

// ── 5 Master Hiring Journey Steps Dataset ──
const HIRING_STEPS = [
  {
    stepNum: 1,
    processLabel: "PROCESS 1",
    processLabelAr: "المرحلة الأولى",
    title: "Application",
    titleAr: "تقديم الطلب",
    duration: "(1 to 2 days)",
    durationAr: "(1 إلى 2 يوم)",
    icon: FileText,
    description: "Submit your resume and cover letter. Our talent acquisition team reviews your profile within 48 hours to evaluate your domain expertise and alignment with the open role.",
    descriptionAr: "قم بتقديم سيرتك الذاتية. يقوم فريق الاستقطاب لدينا بمراجعة ملفك الشخصي خلال 48 ساعة لتقييم خبرتك ومدى ملاءمتك للوظيفة."
  },
  {
    stepNum: 2,
    processLabel: "PROCESS 2",
    processLabelAr: "المرحلة الثانية",
    title: "Phone Call",
    titleAr: "المكالمة الأولية",
    duration: "(~1 week)",
    durationAr: "(~1 أسبوع)",
    icon: PhoneCall,
    description: "A 20-30 minute introductory call with an HR recruiter to discuss your background, career aspirations, salary expectations, and answer your preliminary questions about Leela Gulf.",
    descriptionAr: "مكالمة تمهيدية لمدة 20-30 دقيقة مع مسؤول التوظيف لمناقشة خلفيتك المهنية وتطلعاتك والإجابة على استفساراتك الأولية."
  },
  {
    stepNum: 3,
    processLabel: "PROCESS 3",
    processLabelAr: "المرحلة الثالثة",
    title: "Interview Round 1 & Assessment",
    titleAr: "المقابلة الأولى والتقييم الفني",
    duration: "(1 to 2 weeks)",
    durationAr: "(1 إلى 2 أسبوع)",
    icon: Code2,
    description: "An in-depth technical or functional interview with the hiring manager and a practical assessment case study to gauge your problem-solving capabilities.",
    descriptionAr: "مقابلة متعمقة مع مدير القسم وإجراء تقييم عملي لقياس مهاراتك الفنية وحلك للمشكلات."
  },
  {
    stepNum: 4,
    processLabel: "PROCESS 4",
    processLabelAr: "المرحلة الرابعة",
    title: "On-site Visit",
    titleAr: "الزيارة الميدانية والشخصية",
    duration: "(1 day)",
    durationAr: "(يوم واحد)",
    icon: Building2,
    description: "Visit our regional office or manufacturing facility, meet potential teammates, tour the premises, and participate in a culture alignment session with company leadership.",
    descriptionAr: "زيارة مقرنا الرئيسي أو مرافقنا، والالتقاء بفريق العمل المستقبلي، وجولة في المرفق وجلسة توافق الثقافة المؤسسية."
  },
  {
    stepNum: 5,
    processLabel: "PROCESS 5",
    processLabelAr: "المرحلة الخامسة",
    title: "Reference Checks and Offer!",
    titleAr: "التحقق من المراجع والعرض الوظيفي!",
    duration: "",
    durationAr: "",
    icon: Award,
    description: "Professional reference verification followed by a competitive formal offer letter, onboarding roadmap, and warm welcome to the Leela Gulf family!",
    descriptionAr: "التحقق من المراجع المهنية يليها تقديم العرض الوظيفي الرسمي، وخطط الانضمام والترحيب بك في عائلة ليلا جلف!"
  }
];

export default function CareerJourneySection() {
  const { isRTL } = useLanguage();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0); // Step 1 expanded by default

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[var(--color-primary)] py-10 sm:py-16 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ═══════════════════════════════════════════
            HEADER SECTION (2-Line Heading Left + Quote Right)
            Matches Reference Screenshot 100%
            ═══════════════════════════════════════════ */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center mb-12 sm:mb-16 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* LEFT 6 COLS: Badge + 2-Line Title */}
          <div className="lg:col-span-6">
            {/* Small Gold Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 sm:w-6 h-[2px] bg-gradient-gold-animated inline-block rounded-full" />
              <span className="font-heading font-bold text-[10px] sm:text-xs tracking-[0.2em] text-gold-light uppercase">
                {isRTL ? "رحلة التوظيف" : "HIRING ADVENTURE"}
              </span>
            </div>

            {/* Main Title (2-Line Layout) */}
            <h2 className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.16]">
              {isRTL ? (
                <>
                  <span className="block">رحلة استكشاف</span>
                  <span className="block text-gradient-gold-animated">الوظائف في ليلا جلف</span>
                </>
              ) : (
                <>
                  <span className="block">Leela Gulf's Career</span>
                  <span className="block text-gradient-gold-animated">Exploration Journey</span>
                </>
              )}
            </h2>
          </div>

          {/* RIGHT 6 COLS: Quote Block with Vertical Accent Border */}
          <div className="lg:col-span-6 border-l-2 rtl:border-r-2 rtl:border-l-0 border-gold-main pl-5 sm:pl-6 rtl:pr-5 rtl:pr-6">
            <p className="font-subheading text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed italic">
              {isRTL
                ? "في ليلا جلف، تم تصميم تجربة التوظيف لدينا بعناية لتكون فعالة وشاملة. نحن نؤمن بأن كل شخص معني يجب أن يكون واثقاً تماماً من القرارات التي يتخذها، مما يضمن انتقالاً سلسًا إلى فريق ستزدهر فيه وتساهم بأفضل ما لديك."
                : "At Leela Gulf, our hiring experience is meticulously designed to be both efficient and thorough. We believe that everyone involved should be 100% sure of the decisions they make, ensuring a seamless transition into a team where you'll thrive and contribute your best."}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            MINIMAL VERTICAL TIMELINE LIST (NO CARD BOXES / BORDERS)
            Matches Reference Screenshot #1 100%
            ═══════════════════════════════════════════ */}
        <div className="relative pl-6 sm:pl-10 rtl:pr-6 rtl:pl-0 sm:rtl:pr-10 w-full">
          {/* Vertical Connecting Line */}
          <div className="absolute top-6 bottom-6 left-6 sm:left-10 rtl:right-6 sm:rtl:right-10 rtl:left-auto w-[2px] bg-gradient-gold-animated -translate-x-1/2 rtl:translate-x-1/2 z-0" />

          <div className="space-y-8 sm:space-y-10 relative z-10 w-full">
            {HIRING_STEPS.map((step, idx) => {
              const IconComponent = step.icon;
              const isOpen = openIndex === idx;

              return (
                <div
                  key={step.stepNum}
                  className={`flex items-start gap-5 sm:gap-7 transition-all duration-700 w-full ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${200 + idx * 100}ms` }}
                >
                  {/* Left Circle Icon Badge (Anchored on Line) */}
                  <div
                    onClick={() => toggleAccordion(idx)}
                    className={`relative rounded-full p-[2px] bg-gradient-gold-animated shrink-0 cursor-pointer transition-transform duration-300 shadow-lg -ml-[22px] sm:-ml-[26px] rtl:-mr-[22px] rtl:ml-0 sm:rtl:-mr-[26px] ${
                      isOpen ? "scale-110 shadow-gold-main/30" : "hover:scale-105"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isOpen
                          ? "bg-gradient-gold-animated text-black"
                          : "bg-[var(--color-primary)] text-gold-light"
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[2] ${isOpen ? "text-black" : "text-gold-light"}`} />
                    </div>
                  </div>

                  {/* Right Minimal Content Row (Clean Minimal Layout without Card Boxes) */}
                  <div className="flex-1 w-full pt-1.5">
                    {/* Header Clickable Row */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(idx)}
                      className="w-full flex items-center justify-between text-left rtl:text-right cursor-pointer group py-1"
                    >
                      <div>
                        {/* Process Label */}
                        <span className="font-heading font-bold text-[10px] sm:text-xs text-gradient-gold-animated tracking-widest uppercase block mb-1">
                          {isRTL ? step.processLabelAr : step.processLabel}
                        </span>

                        {/* Step Title + Duration */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-heading font-bold text-base sm:text-xl md:text-2xl text-white group-hover:text-gold-light transition-colors">
                            {isRTL ? step.titleAr : step.title}
                          </h3>
                          {(step.duration || step.durationAr) && (
                            <span className="font-subheading text-xs sm:text-sm text-gray-400 font-medium">
                              {isRTL ? step.durationAr : step.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Chevron Icon */}
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-gold-main/20 transition-colors ml-4 rtl:mr-4 rtl:ml-0">
                        <ChevronDown
                          className={`w-4.5 h-4.5 text-gold-light transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-gold-main" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expandable Body Text */}
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-gray-800/60 max-w-3xl animate-[fadeIn_0.25s_ease-out]">
                        <p className="font-subheading text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {isRTL ? step.descriptionAr : step.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
