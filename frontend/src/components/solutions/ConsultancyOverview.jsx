"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef, useState } from "react";

/**
 * ConsultancyOverview - Premium Consulting & Regulatory Clearances Showcase
 * ────────────────────────────────────────────────────────────────────────
 * UI/UX Architecture based on reference:
 * - Left Column: Eyebrow, dual-tone animated gold heading, narrative description, and 4 bullet feature items with gold circular icon badges.
 * - Right Column: 6 White Service Cards (3x2 grid) with gold circle icon badges, titles, bottom gold dashes, and interactive click modal.
 * - Bottom Banner: Full-width white footer bar with gold badge, tagline, and Leela Gulf branding.
 * - Premium Popup Modal: Smooth backdrop-blur, detailed deliverables, and close controls.
 * - Font Awesome CSS Icon Font (NO SVG) via <i> tags.
 * - 100% Global Theme Colors & Tokens. Fully responsive across all devices.
 */
export default function ConsultancyOverview() {
  const { isRTL } = useLanguage();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedService]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedService(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 4 Left Pillar Points
  const leftFeatures = isRTL
    ? [
      {
        id: 1,
        iconClass: "fa-solid fa-users",
        title: "معايير بيئية صارمة",
        desc: "نضمن الالتزام الكامل باللوائح البيئية وتقييمات الأثر البيئي عبر كافة العمليات.",
      },
      {
        id: 2,
        iconClass: "fa-solid fa-shield-halved",
        title: "الصحة والسلامة والتنظيم",
        desc: "ضمان إدارة المواد والمخلفات وفق أعلى معايير السلامة والتأهب التشغيلي.",
      },
      {
        id: 3,
        iconClass: "fa-solid fa-seedling",
        title: "الاستدامة والمسؤولية البيئية",
        desc: "تتبع الأثر البيئي وتقديم حلول كيميائية خضراء تدعم تحقيق الحياد الكربوني.",
      },
      {
        id: 4,
        iconClass: "fa-solid fa-scale-balanced",
        title: "أخلاقيات العمل والامتثال",
        desc: "شفافية مطلقة ومطابقة تامة مع القوانين والتشريعات المحلية والدولية.",
      },
    ]
    : [
      {
        id: 1,
        iconClass: "fa-solid fa-users",
        title: "Labor & Environmental Standards",
        desc: "Ensuring fair operating practices, ethical compliance, and robust environmental stewardship.",
      },
      {
        id: 2,
        iconClass: "fa-solid fa-shield-halved",
        title: "Health & Safety Protocols",
        desc: "Guaranteeing that every operation is executed in facilities prioritizing worker well-being and emergency preparedness.",
      },
      {
        id: 3,
        iconClass: "fa-solid fa-seedling",
        title: "Environmental Stewardship",
        desc: "Tracking ecological footprint and promoting green solutions to support Net Zero goals.",
      },
      {
        id: 4,
        iconClass: "fa-solid fa-scale-balanced",
        title: "Business Ethics & Governance",
        desc: "Operating with total transparency, zero tolerance for non-compliance, and full legal conformity.",
      },
    ];

  // 6 Right Service Cards (from screenshot 2)
  const services = isRTL
    ? [
      {
        id: "environmental-clearance",
        title: "الموافقة البيئية",
        subtitle: "Environmental Clearance",
        iconClass: "fa-solid fa-leaf",
        shortDesc:
          "وفقاً للوائح تقييم الأثر البيئي، تتطلب المشاريع والأنشطة الصناعية المدرجة في الجداول المعتمدة موافقة بيئية مسبقة (EC) من وزارة البيئة أو الهيئات البيئية المختصة وفق معايير التصنيف المعتمدة.",
        longDesc:
          "في ليلا جلف (Leela Gulf FZC)، نقدم خدمات استشارية متكاملة لمساعدة الشركات والمؤسسات الصناعية في إدارة وتسهيل إجراءات الموافقة البيئية المعقدة بسلاسة. يضمن فريق خبرائنا الامتثال التام للتشريعات البيئية وتسريع الحصول على الموافقات وتجنب التأخير.",
        servicesHeading: "تشمل خدماتنا:",
        details: [
          {
            title: "دراسة الجدوى والتصنيف البيئي للمشروع",
            desc: "تقييم أهلية المشروع وتصنيفه البيئي وفق اللوائح البيئية المعتمدة.",
          },
          {
            title: "إعداد الشروط المرجعية (ToR)",
            desc: "صياغة وتجهيز الشروط المرجعية اللازمة لدراسات تقييم الأثر البيئي (EIA).",
          },
          {
            title: "دراسات تقييم الأثر البيئي (EIA)",
            desc: "إجراء دراسات تفصيلية حول الأثر البيئي، تدابير مكافحة التلوث، تقييم المخاطر، واستراتيجيات التخفيف.",
          },
          {
            title: "إدارة الاستشارات والمشاركة المجتمعية",
            desc: "إدارة جلسات الاستماع والتشاور العام والرد على الاستفسارات البيئية المعنية.",
          },
          {
            title: "إعداد وتقديم ملفات الامتثال التنظيمي",
            desc: "تجهيز وتقديم الوثائق الرسمية للجهات الحكومية المعنية وضمان مطابقتها لأعلى المعايير.",
          },
          {
            title: "المراقبة والامتثال المستمر بعد الترخيص (Post-EC)",
            desc: "تقديم دعم دوري ومستمر لضمان الالتزام بالشروط والاشتراطات البيئية بعد صدور الموافقة.",
          },
        ],
        closingNote:
          "إرشادات خبرائنا، ومعرفتنا العميقة بالأطر التنظيمية، وشبكة علاقاتنا القوية في الصناعة تجعل عملية الحصول على الموافقة البيئية خالية من المتاعب. سواء كنت تخطط لمشروع جديد أو توسعة منشأة قائمة، فإن ليلا جلف شريكك الموثوق لتأمين الموافقة البيئية بكل ثقة.",
        ctaText: "تواصل معنا اليوم! دعنا نتولى الإجراءات والتعقيدات القانونية بينما تركز أنت على نمو أعمالك.",
      },
      {
        id: "forest-clearance",
        title: "تصاريح الغابات",
        subtitle: "Forest Clearance",
        iconClass: "fa-solid fa-tree",
        shortDesc:
          "وفقاً لقانون الحفاظ على الغابات لعام 1980، يتطلب أي تحويل للأراضي الحرجية لأغراض غير حرجية—مثل المشاريع الصناعية، أو البنية التحتية، أو التنموية—موافقة مسبقة من الحكومة المركزية لضمان تدابير الحفظ البيئي والتنمية المستدامة.",
        longDesc:
          "في ليلا جلف FZC، نقدم خدمات استشارية متكاملة لمساعدة الشركات ومطوري المشاريع في الحصول على تصاريح الغابات (FC) بكفاءة عالية وضمان الامتثال للأنظمة البيئية مع تجنب التأخير.",
        servicesHeading: "تشمل خدماتنا:",
        details: [
          {
            title: "تقييم الأراضي الحرجية والتحقق من الانطباق",
            desc: "تحديد ما إذا كان مشروعك يتطلب تصريح غابات بناءً على تصنيف الأراضي والأحكام القانونية.",
          },
          {
            title: "إعداد وتقديم طلبات تصاريح الغابات",
            desc: "تجميع الوثائق التفصيلية، بما في ذلك مخططات استخدام الأراضي وتدابير التخفيف واستراتيجيات الإدارة البيئية.",
          },
          {
            title: "التنسيق والتمثيل لدى الجهات التنظيمية",
            desc: "التنسيق مع وزارة البيئة والغابات وتغير المناخ (MoEF&CC) وإدارات الغابات الإقليمية والهيئات المختصة.",
          },
          {
            title: "تصاريح الحياة البرية وتقييم التنوع الحيوي",
            desc: "المساعدة في الحصول على تصاريح المجلس الوطني للحياة البرية (NBWL) وإجراء دراسات التنوع الحيوي.",
          },
          {
            title: "المشاركة المجتمعية وجلسات الاستماع العامة",
            desc: "إدارة الاستشارات العامة والرد على الاستفسارات وضمان استيفاء المتطلبات التنظيمية.",
          },
          {
            title: "المراقبة والامتثال بعد صدور التصريح",
            desc: "ضمان الالتزام بالشروط والاشتراطات المحددة في الموافقة الحرجية، بما في ذلك التزامات التشجير التعويضي.",
          },
        ],
        closingNote:
          "تضمن خبراتنا العميقة تسريع كافة إجراءات تصاريح الغابات والتنسيق مع كافة الجهات المختصة بكل سلاسة وثقة لتمكين نمو مشروعك دون عوائق.",
        ctaText: "تواصل معنا اليوم! دعنا نتولى الإجراءات والتعقيدات القانونية بينما تركز أنت على تطوير مشروعك بكل ثقة.",
      },
      {
        id: "consent-to-establish",
        title: "موافقة الإنشاء (CTE / NOC)",
        subtitle: "Consent to Establish & SPCB Approvals",
        iconClass: "fa-solid fa-industry",
        shortDesc:
          "قبل بدء أي نشاط صناعي أو تجاري، يعد الحصول على موافقة الإنشاء (CTE)، والمعروفة أيضاً باسم شهادة عدم الممانعة (NOC)، متطلباً إلزامياً بموجب القوانين البيئية ومكافحة تلوث المياه (المادة 25) وتلوث الهواء (المادة 21).",
        longDesc:
          "في ليلا جلف FZC، نقدم خدمات استشارية متكاملة لمساعدة المنشآت والشركات في استخراج موافقات CTE/NOC بكفاءة عالية وضمان الامتثال التام للاشتراطات وتفادي أي تأخير في المشروع.",
        servicesHeading: "تشمل خدماتنا:",
        details: [
          {
            title: "تقييم المشروع والتحقق من الأهلية",
            desc: "تقييم جدوى المشروع ومطابقته للأنظمة والمعايير البيئية المعتمدة.",
          },
          {
            title: "إعداد وتقديم ملفات الطلب",
            desc: "إعداد الوثائق التفصيلية والتقارير الفنية للتقديم لدى لجان وهيئات مراقبة التلوث (SPCB/PCC).",
          },
          {
            title: "خطة الإدارة البيئية (EMP)",
            desc: "المساعدة في إعداد خطة شاملة للإدارة البيئية للحد من الآثار البيئية وتعزيز الاستدامة.",
          },
          {
            title: "المتابعة والتنسيق التنظيمي",
            desc: "التنسيق مع الهيئات الحكومية، والرد على الاستفسارات الفنية، وتسريع إصدار الموافقات.",
          },
          {
            title: "الاستشارات البيئية والامتثال",
            desc: "توجيه الشركات حول تدابير مكافحة التلوث، وإدارة النفايات، والامتثال للأنظمة الصناعية.",
          },
          {
            title: "دعم ما بعد صدور CTE",
            desc: "المساعدة في استيفاء شروط موافقة الإنشاء والتحضير لطلب تصريح التشغيل اللاحق (CTO).",
          },
        ],
        closingNote:
          "تضمن خبراتنا الفنية تسريع إجراءات إصدار شهادات عدم الممانعة وموافقات الإنشاء لضمان بدء أعمال البناء والتأسيس وفق الجدول الزمني المحدد.",
        ctaText: "تواصل معنا اليوم! احصل على موافقة الإنشاء بكل ثقة وركز على إدارة وتوسيع أعمالك بينما نتولى نحن ملف الامتثال بالكامل.",
      },
      {
        id: "crz-clearance",
        title: "تصريح المناطق الساحلية (CRZ)",
        subtitle: "Coastal Regulation Zone Clearance & Approvals",
        iconClass: "fa-solid fa-water",
        shortDesc:
          "تخضع المشاريع والأنشطة الواقعة ضمن مناطق التنظيم الساحلي (CRZ)، وفقاً لإشعار CRZ لعام 2011، للوائح بيئية صارمة تتطلب موافقة مسبقة من وزارة البيئة والغابات وتغير المناخ (MoEF&CC) أو سلطات إدارة المناطق الساحلية المختصة.",
        longDesc:
          "في ليلا جلف FZC، نقدم خدمات استشارية شاملة لمساعدة الشركات ومطوري المشاريع في الحصول على تصاريح CRZ بكفاءة عالية وضمان الامتثال التام للمعايير البيئية وتجنب التأخير.",
        servicesHeading: "تشمل خدماتنا:",
        details: [
          {
            title: "رسم الخرائط وتصنيف نطاقات CRZ",
            desc: "تحديد موقع المشروع ضمن فئات CRZ (CRZ-I, CRZ-II, CRZ-III, CRZ-IV) وتقييم المتطلبات التنظيمية.",
          },
          {
            title: "دراسة الجدوى وتقييم الأثر البيئي",
            desc: "تقييم أثر المشروع على النظم البيئية الساحلية وإعداد التقارير الفنية اللازمة.",
          },
          {
            title: "إعداد وتقديم ملفات طلب ترخيص CRZ",
            desc: "تجهيز تقارير المشاريع، وخطط الإدارة البيئية، واستراتيجيات التخفيف للتقديم لدى MoEF&CC أو سلطات إدارة المناطق الساحلية (SCZMA).",
          },
          {
            title: "التنسيق والتمثيل لدى الجهات المعنية",
            desc: "التنسيق مع MoEF&CC وSCZMA والجهات التنظيمية لتسريع إجراءات إصدار التراخيص.",
          },
          {
            title: "المشاركة المجتمعية وجلسات الاستماع",
            desc: "تيسير جلسات الاستماع العامة، والتعامل مع الشواغل البيئية، وضمان الامتثال القانوني.",
          },
          {
            title: "المراقبة والامتثال بعد صدور التصريح",
            desc: "المساعدة في استيفاء شروط الترخيص، وإعداد التقارير الدورية، وضمان الالتزام المستمر بمعايير CRZ.",
          },
        ],
        closingNote:
          "بفضل خبرتنا المتعمقة في الأنظمة البيئية وعلاقاتنا القوية بالهيئات الرقابية، نضمن تسريع إجراءات ترخيص المناطق الساحلية لتمكين تنفيذ مشاريعكم بكل ثقة.",
        ctaText: "تواصل معنا اليوم! دعنا نتولى التحديات التنظيمية بينما تركز أنت على تنفيذ مشاريعك الساحلية بسلاسة.",
      },
      {
        id: "consent-to-operate",
        title: "تصريح التشغيل (CTO / CCA)",
        subtitle: "Consent to Operate & Regularization",
        iconClass: "fa-solid fa-shield-halved",
        shortDesc:
          "قبل بدء أو مواصلة أي نشاط تشغيلي أو صناعي، يعد الحصول على موافقة التشغيل (CTO / CCA) إلزامياً بموجب قانون مكافحة تلوث المياه لعام 1974 (المادة 25) وقانون مكافحة تلوث الهواء لعام 1981 (المادة 21).",
        longDesc:
          "في ليلا جلف FZC، نقدم خدمات استشارية متكاملة لمساعدة المنشآت في استخراج وتجديد تراخيص التشغيل (CTO) بكفاءة عالية وضمان الامتثال المستمر للاشتراطات وتفادي أي توقف للعمليات.",
        servicesHeading: "تشمل خدماتنا:",
        details: [
          {
            title: "تقييم جاهزية المنشأة والامتثال",
            desc: "تقييم جاهزية المصنع وأنظمة مكافحة التلوث وفقاً للمعايير البيئية المعتمدة.",
          },
          {
            title: "إعداد وتقديم ملفات الترخيص (SPCB/PCC)",
            desc: "إعداد الوثائق التفصيلية وتقارير الرصد البيئي للتقديم لدى لجان مراقبة التلوث.",
          },
          {
            title: "خطة الإدارة البيئية والرصد المستمر (EMP)",
            desc: "المساعدة في تطبيق خطة الإدارة البيئية وبرامج المراقبة الدورية للحد من الانبعاثات.",
          },
          {
            title: "المتابعة والتنسيق مع الجهات الرقابية",
            desc: "التنسيق المباشر مع الهيئات المختصة، والرد على الاستفسارات الفنية، وتسريع إصدار الموافقات.",
          },
          {
            title: "التدقيق البيئي والاستشارات المستمرة",
            desc: "توجيه الشركات حول كفاءة محطات المعالجة، وإدارة النفايات، والامتثال الصناعي الدوري.",
          },
          {
            title: "دعم ما بعد صدور CTO والتقارير السنوية",
            desc: "المساعدة في استيفاء شروط الترخيص المستمرة، وتقديم الإقرارات البيئية السنوية (Form V).",
          },
        ],
        closingNote:
          "تضمن حلولنا الاستشارية المتخصصة تجديد وإصدار تصاريح التشغيل دون انقطاع، مع ضمان توافق منشآتك مع أحدث المعايير البيئية.",
        ctaText: "تواصل معنا اليوم! احصل على تصريح التشغيل وجدد تراخيصك بكل ثقة وركز على نمو إنتاجك وأعمالك.",
      },
      {
        id: "rule-9",
        title: "امتثال اللائحة 9 للمخلفات (Rule 9)",
        subtitle: "Hazardous Waste Utilization & CPCB Authorization",
        iconClass: "fa-solid fa-scale-balanced",
        shortDesc:
          "بموجب قواعد إدارة ونقل النفايات الخطرة وغيرها لعام 2016، تنظم اللائحة 9 استخدام وتدوير المخلفات الخطرة، وتلزم المنشآت بالحصول على موافقة المجلس المركزي (CPCB) أو لجان الولايات (SPCB) قبل تدوير أو استخدام المخلفات بأسلوب سليم بيئياً.",
        longDesc:
          "في ليلا جلف FZC، نقدم خدمات استشارية متكاملة لمساعدة الشركات في الحصول على تفويضات وترخيص Rule 9 وضمان الامتثال التام للوائح إدارة النفايات الخطرة.",
        servicesHeading: "تشمل خدماتنا:",
        details: [
          {
            title: "التقييم والتحقق من الأهلية",
            desc: "تقييم أهلية المنشأة بموجب اللائحة 9 وتحديد المتطلبات والوثائق الفنية اللازمة.",
          },
          {
            title: "إعداد وتقديم ملفات الترخيص",
            desc: "صياغة وتقديم التقارير التفصيلية، بما في ذلك توصيف المخلفات، وتفاصيل العمليات، وتحليل الأثر البيئي.",
          },
          {
            title: "التنسيق والتمثيل لدى CPCB و SPCB",
            desc: "التنسيق مع المجلس المركزي وهيئات الولايات لضمان المعالجة السلسة للطلب.",
          },
          {
            title: "الجدوى الفنية وخطة استغلال المخلفات",
            desc: "المساعدة في إعداد مقترحات شاملة لاستخدام وتدوير المخلفات، والمعالجة المشتركة، واسترداد الموارد.",
          },
          {
            title: "الامتثال للإرشادات والمعايير البيئية",
            desc: "ضمان الالتزام ببروتوكولات السلامة، ومعايير مكافحة التلوث، واللوائح التنظيمية.",
          },
          {
            title: "المراقبة والامتثال بعد صدور الترخيص",
            desc: "تقديم دعم مستمر للالتزام بالسجلات، والتقارير الدورية، والتزامات المراقبة البيئية تحت Rule 9.",
          },
        ],
        closingNote:
          "تضمن حلولنا الفنية في توصيف المخلفات وإجراءات التشغيل القياسية (SOPs) ترخيص منشأتك بسرعة وأمان بيئي مستدام.",
        ctaText: "تواصل معنا اليوم! دعنا نساعدك في الحصول على ترخيص اللائحة 9 للاستغلال المستدام والمسؤول للمخلفات.",
      },
    ]
    : [
      {
        id: "environmental-clearance",
        title: "Environmental Clearance",
        subtitle: "Statutory EIA & Approvals",
        iconClass: "fa-solid fa-leaf",
        shortDesc:
          "As mandated by the EIA Notification, 2006, any project or activity listed in its Schedule requires Prior Environmental Clearance (EC) from either the Ministry of Environment, Forests & Climate Change (MoEF&CC) or the State Environmental Impact Assessment Authority (SEIAA), depending on the screening criteria.",
        longDesc:
          "At Leela Gulf FZC, we offer end-to-end consultancy services to help businesses and industries navigate the complex EC process seamlessly. Our team of experts ensures full compliance with environmental regulations, helping clients secure approvals efficiently and avoid delays.",
        servicesHeading: "Our Services Include:",
        details: [
          {
            title: "Project Feasibility & Environmental Screening",
            desc: "Assessing project eligibility and classification under the EIA Notification, 2006.",
          },
          {
            title: "Preparation of Terms of Reference (ToR)",
            desc: "Assisting in drafting the ToR required for Environmental Impact Assessment (EIA) studies.",
          },
          {
            title: "Environmental Impact Assessment (EIA) Studies",
            desc: "Conducting detailed studies on environmental impact, pollution control, risk assessment, and mitigation strategies.",
          },
          {
            title: "Public Consultation & Stakeholder Engagement",
            desc: "Managing public hearings, consultations, and addressing environmental concerns.",
          },
          {
            title: "Submission & Compliance Documentation",
            desc: "Preparing and submitting the required documents to MoEF&CC/SEIAA and ensuring compliance with regulatory standards.",
          },
          {
            title: "Post-EC Compliance & Monitoring",
            desc: "Providing ongoing support to ensure adherence to environmental conditions post-clearance.",
          },
        ],
        closingNote:
          "Our expert guidance, in-depth knowledge of regulatory frameworks, and strong industry connections make the entire clearance process hassle-free for our clients. Whether you're planning a new project or expanding an existing one, Leela Gulf FZC is your trusted partner in securing Environmental Clearance with confidence.",
        ctaText: "Get in Touch Today! Let us handle the legal and procedural complexities while you focus on your business growth.",
      },
      {
        id: "forest-clearance",
        title: "Forest Clearance",
        subtitle: "Statutory Forest Land Diversion & Wildlife Approvals",
        iconClass: "fa-solid fa-tree",
        shortDesc:
          "As per the Forest (Conservation) Act, 1980, any diversion of forest land for non-forest purposes—such as industrial, infrastructure, or developmental projects—requires prior approval from the Central Government. This process ensures that environmental conservation measures are in place while facilitating sustainable development.",
        longDesc:
          "At Leela Gulf FZC, we provide end-to-end consultancy services to help businesses and project developers secure Forest Clearance (FC) efficiently, ensuring compliance with environmental regulations while minimizing project delays.",
        servicesHeading: "Our Services Include:",
        details: [
          {
            title: "Forest Land Assessment & Applicability Check",
            desc: "Identifying whether your project requires Forest Clearance based on land classification and legal provisions.",
          },
          {
            title: "Preparation & Submission of Forest Clearance Application",
            desc: "Compiling detailed documentation, including land-use plans, mitigation measures, and environmental management strategies.",
          },
          {
            title: "Regulatory Liaison & Representation",
            desc: "Coordinating with the Ministry of Environment, Forests & Climate Change (MoEF&CC), State Forest Department, and other regulatory bodies.",
          },
          {
            title: "Wildlife Clearance & Biodiversity Impact Assessment",
            desc: "If applicable, assisting in obtaining clearance from the National Board for Wildlife (NBWL) and conducting biodiversity impact studies.",
          },
          {
            title: "Public Consultation & Stakeholder Engagement",
            desc: "Managing public hearings, addressing concerns, and ensuring compliance with regulatory requirements.",
          },
          {
            title: "Post-Clearance Compliance & Monitoring",
            desc: "Ensuring adherence to conditions stipulated in the Forest Clearance approval, including afforestation commitments and environmental impact monitoring.",
          },
        ],
        closingNote:
          "Our dedicated forestry experts and deep regulatory knowledge streamline the approvals lifecycle, safeguarding your project timeline while maintaining full environmental integrity.",
        ctaText: "Get in Touch Today! Let us handle the legal complexities while you focus on your project development with confidence.",
      },
      {
        id: "consent-to-establish",
        title: "Consent to Establish (CTE)",
        subtitle: "SPCB / PCC NOC & Statutory Environmental Approvals",
        iconClass: "fa-solid fa-industry",
        shortDesc:
          "Before starting any industrial or commercial activity, obtaining Consent to Establish (CTE), also known as a No Objection Certificate (NOC), is a mandatory requirement under environmental laws in India. This approval is granted under Section 25 of the Water Act, 1974 (wastewater discharge regulation) and Section 21 of the Air Act, 1981 (emission control).",
        longDesc:
          "At Leela Gulf FZC, we provide end-to-end consultancy to help businesses obtain CTE/NOC efficiently, ensuring compliance with regulatory requirements and avoiding unnecessary delays.",
        servicesHeading: "Our Services Include:",
        details: [
          {
            title: "Project Assessment & Eligibility Check",
            desc: "Evaluating project feasibility based on environmental regulations.",
          },
          {
            title: "Preparation & Submission of Application",
            desc: "Preparing detailed documentation, including project reports and compliance details, for submission to the State Pollution Control Board (SPCB)/Pollution Control Committee (PCC).",
          },
          {
            title: "Environmental Management Plan (EMP)",
            desc: "Assisting in preparing an EMP to mitigate environmental impacts and enhance sustainability.",
          },
          {
            title: "Regulatory Liaison & Follow-ups",
            desc: "Coordinating with authorities, addressing queries, and ensuring smooth processing of approvals.",
          },
          {
            title: "Compliance Advisory",
            desc: "Guiding businesses on pollution control measures, waste management, and industry-specific compliance requirements.",
          },
          {
            title: "Post-CTE Support",
            desc: "Assisting in meeting conditions stipulated in the CTE and preparing for the subsequent Consent to Operate (CTO) application.",
          },
        ],
        closingNote:
          "With proactive regulatory liaison and technical expertise in effluent and air emission standards, we secure your Consent to Establish efficiently so construction and plant setup stay on schedule.",
        ctaText: "Get in Touch Today! Secure your Consent to Establish with confidence and focus on your business operations while we handle the compliance process.",
      },
      {
        id: "crz-clearance",
        title: "CRZ Clearance",
        subtitle: "Coastal Regulation Zone Approvals & Compliance",
        iconClass: "fa-solid fa-water",
        shortDesc:
          "Projects and activities within Coastal Regulation Zones (CRZ), as defined under the CRZ Notification, 2011, are subject to strict environmental regulations. While certain activities are prohibited, others are permissible only with prior approval from the Ministry of Environment, Forests & Climate Change (MoEF&CC) or the relevant regulatory authority.",
        longDesc:
          "At Leela Gulf FZC, we offer comprehensive consultancy services to help businesses and project developers secure CRZ Clearance efficiently, ensuring full compliance with environmental norms while minimizing delays.",
        servicesHeading: "Our Services Include:",
        details: [
          {
            title: "CRZ Mapping & Classification",
            desc: "Identifying project location within CRZ categories (CRZ-I, CRZ-II, CRZ-III, CRZ-IV) and assessing regulatory requirements.",
          },
          {
            title: "Feasibility Study & Impact Assessment",
            desc: "Evaluating project impact on coastal ecosystems and preparing necessary reports.",
          },
          {
            title: "Preparation & Submission of CRZ Clearance Application",
            desc: "Compiling detailed project reports, including environmental management plans and mitigation strategies, for submission to MoEF&CC or the State Coastal Zone Management Authority (SCZMA).",
          },
          {
            title: "Regulatory Liaison & Representation",
            desc: "Coordinating with MoEF&CC, SCZMA, and other relevant authorities for expediting approvals.",
          },
          {
            title: "Public Consultation & Stakeholder Engagement",
            desc: "Facilitating hearings, addressing public concerns, and ensuring regulatory compliance.",
          },
          {
            title: "Post-Clearance Compliance & Monitoring",
            desc: "Assisting in meeting clearance conditions, periodic reporting, and ensuring continued adherence to CRZ norms.",
          },
        ],
        closingNote:
          "With our expertise in environmental regulations, deep industry knowledge, and strong relationships with regulatory bodies, we streamline the CRZ clearance process, enabling businesses to move forward with confidence.",
        ctaText: "Get in Touch Today! Let us handle the regulatory challenges while you focus on executing your coastal projects smoothly.",
      },
      {
        id: "consent-to-operate",
        title: "Consent to Operate (CTO / CCA)",
        subtitle: "Statutory Operational Compliance & Periodic Regularization",
        iconClass: "fa-solid fa-shield-halved",
        shortDesc:
          "Before operating or continuing any industrial or commercial activity, obtaining Consent to Operate (CTO / CCA) is a mandatory requirement under environmental laws. This approval is granted under Section 25 of the Water Act, 1974 (wastewater discharge regulation) and Section 21 of the Air Act, 1981 (emission control practices).",
        longDesc:
          "At Leela Gulf FZC, we provide end-to-end consultancy to help businesses obtain CTO/CCA and periodic renewals efficiently, ensuring compliance with regulatory requirements and avoiding unnecessary operational delays.",
        servicesHeading: "Our Services Include:",
        details: [
          {
            title: "Project Assessment & Readiness Check",
            desc: "Evaluating facility readiness and pollution control performance based on environmental regulations.",
          },
          {
            title: "Preparation & Submission of Application",
            desc: "Preparing detailed documentation, including compliance reports and monitoring data, for submission to the State Pollution Control Board (SPCB)/Pollution Control Committee (PCC).",
          },
          {
            title: "Environmental Management Plan (EMP)",
            desc: "Assisting in preparing and executing an EMP to mitigate operational environmental impacts and enhance sustainability.",
          },
          {
            title: "Regulatory Liaison & Follow-ups",
            desc: "Coordinating with authorities, addressing queries, and ensuring smooth processing of renewals and approvals.",
          },
          {
            title: "Compliance Advisory & Audit",
            desc: "Guiding businesses on pollution control measures, waste management, and industry-specific ongoing compliance requirements.",
          },
          {
            title: "Post-CTO Support & Annual Returns",
            desc: "Assisting in meeting conditions stipulated in the CTO, environmental statements (Form V), and subsequent periodic filings.",
          },
        ],
        closingNote:
          "Secure your Consent to Operate with confidence and focus on your business operations while we handle the ongoing compliance and renewal process seamlessly.",
        ctaText: "Get in Touch Today! Let us manage your operational compliance while you concentrate on uninterrupted production growth.",
      },
      {
        id: "rule-9",
        title: "Rule 9 Compliance",
        subtitle: "Hazardous Waste Utilization & CPCB / SPCB Authorization",
        iconClass: "fa-solid fa-scale-balanced",
        shortDesc:
          "Under the Hazardous and Other Wastes (Management and Transboundary Movement) Rules, 2016, Rule 9 governs the utilization of hazardous waste by authorized users. It mandates that generators and facilitators must obtain approval from the Central Pollution Control Board (CPCB) or the State Pollution Control Board (SPCB) before hazardous waste can be processed, recycled, or utilized in an environmentally sound manner.",
        longDesc:
          "At Leela Gulf FZC, we provide comprehensive consultancy services to assist businesses in obtaining Rule 9 Authorization, ensuring full compliance with hazardous waste management regulations.",
        servicesHeading: "Our Services Include:",
        details: [
          {
            title: "Assessment & Eligibility Check",
            desc: "Evaluating whether a business qualifies under Rule 9 and identifying the necessary documentation.",
          },
          {
            title: "Preparation & Submission of Application",
            desc: "Drafting and submitting detailed reports, including waste characterization, process details, and environmental impact analysis.",
          },
          {
            title: "Regulatory Liaison & Representation",
            desc: "Coordinating with CPCB, SPCB, and other authorities to ensure smooth processing of the application.",
          },
          {
            title: "Technical Feasibility & Waste Utilization Plan",
            desc: "Assisting in preparing a comprehensive waste utilization proposal, including recycling, co-processing, and resource recovery strategies.",
          },
          {
            title: "Compliance with Environmental Guidelines",
            desc: "Ensuring adherence to pollution control norms, safety protocols, and regulatory requirements.",
          },
          {
            title: "Post-Approval Compliance & Monitoring",
            desc: "Providing ongoing support to meet the reporting, record-keeping, and environmental monitoring obligations under Rule 9.",
          },
        ],
        closingNote:
          "Our end-to-end technical expertise in waste characterization, trial-run SOPs, and CPCB/SPCB protocols ensures rapid approval and sustainable, risk-free hazardous waste utilization.",
        ctaText: "Get in Touch Today! Let us assist you in obtaining Rule 9 Authorization for sustainable and responsible waste utilization.",
      },
    ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--color-primary)] text-white py-10 sm:py-12 md:py-14 lg:py-16 overflow-hidden"
    >
      {/* Ambient background depth lights */}
      <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-gold-main/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] bg-gold-main/[0.03] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* ═══════════════════════════════════════════
            TOP MAIN GRID: Left Content & Right 6 Cards (Exactly Equal Height)
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch mb-8 sm:mb-10 lg:mb-12">

          {/* ── LEFT COLUMN: Perfectly Aligned & Balanced ── */}
          <div
            className={`lg:col-span-5 xl:col-span-5 flex flex-col justify-between transition-all duration-1000 ease-out ${isRTL ? "text-right" : "text-left"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <div>
              {/* Eyebrow */}
              <div className="flex flex-col items-start gap-1.5 mb-2.5 sm:mb-3">
                <span className="font-heading font-bold text-[11px] sm:text-xs tracking-[0.22em] text-gold-light uppercase">
                  {isRTL ? "نظرة عامة على الاستشارات" : "CONSULTANCY OVERVIEW"}
                </span>
                <div className="w-10 h-[2px] bg-gradient-gold-animated rounded-full" />
              </div>

              {/* Main Dual-tone Heading */}
              <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-[2.2rem] lg:text-[2.35rem] xl:text-[2.5rem] text-white leading-[1.15] tracking-tight mb-3 sm:mb-3.5 drop-shadow-sm">
                {isRTL ? (
                  <>
                    <span>ريادة الاستشارات والامتثال </span>
                    <span className="text-gradient-gold-animated">
                      لتحقيق التميز البيئي
                    </span>
                  </>
                ) : (
                  <>
                    <span>Leading Environmental & </span>
                    <span className="text-gradient-gold-animated">
                      Regulatory Consulting
                    </span>
                  </>
                )}
              </h2>

              {/* Narrative Paragraph */}
              <p className="font-subheading text-gray-300/90 text-xs sm:text-[13px] md:text-[13.5px] leading-relaxed mb-4 sm:mb-5">
                {isRTL
                  ? "خدماتنا الاستشارية تغطي قطاعات إدارة النفايات والصناعات الكيميائية، حيث نضمن التزام منشأتك التام بكافة الاشتراطات البيئية والتنظيمية لتحقيق الاستدامة والنمو الآمن."
                  : "Our core consulting services are multi-faceted across the waste management & chemical industries, ensuring complete regulatory compliance, risk mitigation, and sustainable operations."}
              </p>
            </div>

            {/* 4 Feature Items (Heading noticeably larger, bold, and distinct) */}
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
              {leftFeatures.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3.5 p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-gold-main/30 hover:bg-white/[0.05] transition-all duration-300 group/feat ${isRTL ? "flex-row-reverse text-right" : "text-left"
                    }`}
                >
                  {/* Gold Circle Icon Badge (No SVG) */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-card-dark)] border border-gold-main/30 flex items-center justify-center shrink-0 transition-all duration-300 group-hover/feat:scale-110 group-hover:border-gold-main/70 shadow-xs">
                    <i
                      className={`${item.iconClass} text-gold-light text-xs sm:text-sm`}
                    />
                  </div>

                  {/* Feature Content: Noticeably Large & Prominent Heading */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-heading font-bold text-[15.5px] sm:text-[16.5px] md:text-[17px] text-white leading-snug group-hover/feat:text-gold-light transition-colors mb-0.5">
                      {item.title}
                    </h4>
                    <p className="font-subheading text-gray-400 font-normal text-[11px] sm:text-[11.5px] leading-snug line-clamp-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: 6 Ultra-Premium Cards (2x3 on Mobile, 3x2 on Desktop) ── */}
          <div
            className={`lg:col-span-7 xl:col-span-7 flex flex-col justify-between transition-all duration-1000 delay-200 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4 h-full">
              {services.map((service, index) => (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className="group/card relative flex flex-col items-center justify-center text-center bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4.5 md:p-5 shadow-xs hover:shadow-xl border border-gray-100 hover:border-gold-main/40 transition-all duration-300 hover:-translate-y-1 focus:outline-hidden cursor-pointer h-full min-h-[165px] sm:min-h-[185px] md:min-h-[195px] overflow-hidden"
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                  aria-label={`View details for ${service.title}`}
                >
                  {/* Subtle luxury top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-transparent group-hover/card:bg-gradient-gold-animated transition-all duration-300" />

                  {/* Icon Badge: Directly above heading */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#fbf5dc] border border-[#f5eac0] flex items-center justify-center mb-2.5 sm:mb-3 transition-all duration-300 group-hover/card:scale-110 group-hover/card:bg-[var(--color-primary)] group-hover/card:border-[var(--color-primary)] shadow-2xs">
                    <i
                      className={`${service.iconClass} text-gold-dark text-sm sm:text-base transition-colors duration-300 group-hover/card:text-gold-light`}
                    />
                  </div>

                  {/* Service Title (Noticeably Larger & Bolder than subtitle) */}
                  <h3 className="font-heading font-bold text-[13.5px] sm:text-base md:text-[16px] text-gray-950 leading-tight tracking-tight group-hover/card:text-gold-dark transition-colors mb-1 max-w-[170px]">
                    {service.title}
                  </h3>

                  {/* Service Subtitle */}
                  <p className="font-subheading text-[10px] sm:text-[11px] md:text-[11.5px] text-gray-500 font-normal leading-tight mb-2.5 line-clamp-1">
                    {service.subtitle}
                  </p>

                  {/* View Details Button: Directly below subtitle */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-heading font-semibold text-gray-700 bg-gray-50 border border-gray-200/80 group-hover/card:bg-gradient-gold-animated group-hover/card:text-white group-hover/card:border-gold-main/70 group-hover/card:shadow-[0_3px_10px_rgba(200,169,81,0.3)] transition-all duration-300">
                    <span>{isRTL ? "عرض التفاصيل" : "View Details"}</span>
                    <i
                      className={`text-[8.5px] sm:text-[9px] transition-transform duration-200 group-hover/card:translate-x-0.5 ${isRTL ? "fa-solid fa-arrow-left" : "fa-solid fa-arrow-right"
                        }`}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BOTTOM BANNER: Sedex-style White Strip (Ultra-Compact & Refined)
            ═══════════════════════════════════════════ */}
        <div
          className={`bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md border border-gray-100 px-4 sm:px-6 py-3 sm:py-3.5 transition-all duration-700 delay-300 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Left: Shield Badge + Short Tagline */}
            <div className={`flex items-center gap-2.5 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
              <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#fbf5dc] border border-[#f5eac0] flex items-center justify-center shrink-0 shadow-2xs">
                <i className="fa-solid fa-shield-halved text-gold-dark text-xs sm:text-[13px]" />
              </div>
              <div>
                <p className="font-heading font-bold text-xs sm:text-[13px] text-gray-900 leading-tight">
                  {isRTL ? "شريكك الموثوق للامتثال التنظيمي" : "Trusted Regulatory & Compliance Partner"}
                </p>
                <p className="font-subheading text-[10px] sm:text-[10.5px] text-gray-500 leading-tight">
                  {isRTL ? "حلول استشارية متكاملة للمنشآت الصناعية" : "100% Statutory Clearance & Environmental Advisory"}
                </p>
              </div>
            </div>

            {/* Middle: Short & Punchy Highlight (Single Line) */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-5 w-px bg-gray-200" />
              <p className="font-subheading text-[11px] text-gray-600 tracking-tight whitespace-nowrap">
                {isRTL
                  ? "تسهيل وتسريع كافة الموافقات البيئية والتراخيص الحكومية"
                  : "Streamlined environmental clearances & ongoing compliance"}
              </p>
            </div>

            {/* Right: Leela Gulf Logo / Badge */}
            <div className={`flex items-center gap-2 shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
              <span className="font-heading font-bold text-xs sm:text-[13.5px] text-gray-900 tracking-tight">
                Leela<span className="text-gold-dark">Gulf</span>
              </span>
              <span className="text-[9px] font-heading font-bold text-gold-dark uppercase px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/80">
                FZC
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════
          POPUP MODAL: Interactive Service Details
          ═══════════════════════════════════════════ */}
      {selectedService && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedService(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl xl:max-w-6xl max-h-[92vh] sm:max-h-[90vh] bg-[var(--color-card-dark)] border border-gold-main/35 text-white rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col animate-[scaleUp_0.25s_ease-out]"
          >
            {/* Ambient Corner Glows */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold-main/[0.12] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gold-main/[0.08] rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header (Sticky) */}
            <div className={`relative px-5 sm:px-8 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between gap-4 bg-[var(--color-card-dark)]/95 backdrop-blur-md z-10 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-3.5 sm:gap-4 ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold-main/15 border border-gold-main/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(200,169,81,0.2)]">
                  <i className={`${selectedService.iconClass} text-gold-light text-xl sm:text-2xl`} />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-white leading-tight">
                      {selectedService.title}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gold-main/15 text-gold-light border border-gold-main/30">
                      Advisory
                    </span>
                  </div>
                  <p className="font-subheading text-xs sm:text-sm text-gold-light/90 mt-1">
                    {selectedService.subtitle}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0 border border-white/10 hover:border-gold-main/40"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark text-sm sm:text-base" />
              </button>
            </div>

            {/* Modal Scrollable Body (Scrollbar hidden via utility classes) */}
            <div
              className={`p-5 sm:p-7 md:p-8 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isRTL ? "text-right" : "text-left"
                }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">

                {/* Left Column: Overview, Closing Note & Advisory Highlights */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* Overview Narrative Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] shadow-inner space-y-3 font-subheading text-gray-300 text-xs sm:text-[13px] leading-relaxed">
                    <p className="text-white font-medium text-xs sm:text-[13.5px]">
                      {selectedService.shortDesc}
                    </p>
                    {selectedService.longDesc && (
                      <p className="text-gray-300/90 text-[11.5px] sm:text-xs leading-relaxed">
                        {selectedService.longDesc}
                      </p>
                    )}
                  </div>

                  {/* Closing Note (if present) */}
                  {selectedService.closingNote && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-main/[0.09] to-gold-main/[0.02] border border-gold-main/25 font-subheading text-[11.5px] sm:text-xs text-gray-200 leading-relaxed relative overflow-hidden">
                      <div className="flex items-start gap-2.5">
                        <i className="fa-solid fa-circle-info text-gold-light text-sm mt-0.5 shrink-0" />
                        <p className="text-gray-200/90">{selectedService.closingNote}</p>
                      </div>
                    </div>
                  )}

                  {/* CTA Banner note (if present) */}
                  {selectedService.ctaText && (
                    <div className="p-3.5 rounded-xl bg-gold-main/10 border border-gold-main/30 flex items-center gap-2.5">
                      <i className="fa-solid fa-headset text-gold-light text-sm shrink-0" />
                      <p className="font-heading font-semibold text-xs sm:text-[12.5px] text-gold-light leading-snug">
                        {selectedService.ctaText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Key Deliverables / Services Grid */}
                <div className="lg:col-span-7 flex flex-col gap-3.5">
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <h4 className="font-heading font-bold text-base sm:text-lg text-gold-light flex items-center gap-2 tracking-wide">
                      <span className="w-2.5 h-2.5 rounded-full bg-gold-light shadow-[0_0_10px_rgba(230,192,106,0.9)]" />
                      {selectedService.servicesHeading || (isRTL ? "تشمل خدماتنا:" : "Our Services Include:")}
                    </h4>
                    <span className="text-[11px] sm:text-xs font-subheading text-gray-400">
                      {selectedService.details.length} {isRTL ? "خدمات متخصصة" : "Key Pillars"}
                    </span>
                  </div>

                  {/* 2-Column Responsive Service Checklist Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.details.map((item, idx) => (
                      <div
                        key={idx}
                        className={`group p-3.5 sm:p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-gold-main/40 transition-all duration-200 flex items-start gap-3 ${isRTL ? "flex-row-reverse text-right" : "text-left"
                          }`}
                      >
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold-main/15 border border-gold-main/35 flex items-center justify-center shrink-0 mt-0.5 text-gold-light text-[10px] sm:text-xs group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(200,169,81,0.2)]">
                          <i className="fa-solid fa-check" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {typeof item === "string" ? (
                            <span className="font-heading font-bold text-sm sm:text-[15px] text-white block leading-snug">{item}</span>
                          ) : (
                            <>
                              <h5 className="font-heading font-bold text-sm sm:text-[14.5px] md:text-[15px] text-white block mb-1.5 leading-snug group-hover:text-gold-light transition-colors tracking-wide">
                                {item.title}
                              </h5>
                              {item.desc && (
                                <p className="font-subheading text-[11.5px] sm:text-[12px] text-gray-400 font-normal leading-relaxed">
                                  {item.desc}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer (Sticky) */}
            <div className={`px-5 sm:px-8 py-3.5 sm:py-4 border-t border-white/10 bg-[var(--color-card-dark)]/95 backdrop-blur-md flex items-center justify-between gap-3 z-10 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-subheading text-gray-300">
                  Leela Gulf FZC • Compliance & Advisory
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-6 py-2 rounded-xl bg-gradient-gold-animated text-black font-heading font-bold text-xs sm:text-sm hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-[0_4px_15px_rgba(200,169,81,0.25)]"
              >
                {isRTL ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
