"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";
import { X, Layers, ChevronDown, ArrowLeftRight } from "lucide-react";


/* ═══════════════════════════════════════════════════════════════════════
   PRODUCT DATA — Leepol Carbomer | Coat | HCO
   ═══════════════════════════════════════════════════════════════════════ */

export const LEEPOL_TABS_DATA = [

  /* ── TAB 1 : LEEPOL CARBOMER ───────────────────────────────────── */
  {
    id: "carbomer",
    tabLabel: "Leepol Carbomer",
    arTabLabel: "ليبول كاربومر (Carbomer)",
    inci: "INCI: Carbomer",
    arInci: "المكون المعتمد (INCI): كاربومر",
    title: "High-Performance Acrylates Co-Polymers",
    arTitle: "بوليمرات الأكريلات عالية الأداء والتثخين",
    desc: "Carbomers are the backbone of countless gels, creams, lotions, and topical pharmaceutical products. Leepol's Carbomer range is engineered to deliver consistent thickening, suspending, and stabilizing performance across a wide variety of applications.",
    arDesc: "تعد الكاربومرات العمود الفقري للعديد من الجل، والكريمات، واللوشنات، والمنتجات الصيدلانية الموضعية. تم تصميم مجموعة ليبول كاربومر لتقديم أداء متسق في التثخين، والتعليق، وتثبيت المستحلبات عبر مختلف التطبيقات.",
    applications: [
      { en: "Thickeners for gels & topicals", ar: "مثخنات للجل والتطبيقات الموضعية" },
      { en: "Rheology modifiers for creams", ar: "معدلات لزوجة وانسيابية للكريمات" },
      { en: "Suspending agents for uniform dispersions", ar: "عوامل تعليق لتوزيع متجانس" },
      { en: "Stabilizers for emulsions", ar: "مثبتات قوية للمستحلبات" },
      { en: "Oral care with controlled-release", ar: "منتجات العناية بالفم مع إطلاق متحكم به" },
      { en: "Hand sanitizers & hydroalcoholic gels", ar: "معقمات اليدين والجل الكحولي" },
    ],
    image: "/images/Leepol/carbomerimg.avif",
    imageOverlay: "Rheology Modifiers & Thickeners",
    arImageOverlay: "معدلات اللزوجة ومثخنات القوام",
    glanceTitle: "Leepol® CARBOMER",
    arGlanceTitle: "ليبول® كاربومر (CARBOMER)",
    glanceBadges: ["ACRYLATES CO-POLYMER", "( INCI - Carbomer )"],
    arGlanceBadges: ["بوليمر أكريلات مشترك", "( INCI - كاربومر )"],
    tableProducts: [
      {
        product: "Leepol® ET-1",
        application: "Thickeners",
        arApplication: "مثخنات",
        description: "Transparent Gel",
        arDescription: "جل شفاف",
        appRowSpan: 1,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® ET-2",
        application: "Thickeners",
        arApplication: "مثخنات",
        description: "Transparent Gel",
        arDescription: "جل شفاف",
        appRowSpan: 1,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 940",
        application: "Rheology Modifier Thickeners Suspending-Agent Stabilizer Topical Application",
        arApplication: "معدل لزوجة / مثخن / عامل تعليق / مثبت / استخدام موضعي",
        description: "Transparent Gel",
        arDescription: "جل شفاف",
        appRowSpan: 6,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 980",
        application: "Rheology Modifier Thickeners Suspending-Agent Stabilizer Topical Application",
        arApplication: "معدل لزوجة / مثخن / عامل تعليق / مثبت / استخدام موضعي",
        description: "Benzene Free",
        arDescription: "خالٍ من البنزين",
        appRowSpan: 0,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 934",
        application: "Rheology Modifier Thickeners Suspending-Agent Stabilizer Topical Application",
        arApplication: "معدل لزوجة / مثخن / عامل تعليق / مثبت / استخدام موضعي",
        description: "Opaque Gel",
        arDescription: "جل معتم",
        appRowSpan: 0,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 974",
        application: "Rheology Modifier Thickeners Suspending-Agent Stabilizer Topical Application",
        arApplication: "معدل لزوجة / مثخن / عامل تعليق / مثبت / استخدام موضعي",
        description: "Benzene Free",
        arDescription: "خالٍ من البنزين",
        appRowSpan: 0,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 941",
        application: "Rheology Modifier Thickeners Suspending-Agent Stabilizer Topical Application",
        arApplication: "معدل لزوجة / مثخن / عامل تعليق / مثبت / استخدام موضعي",
        description: "Low Viscous Clear Gel",
        arDescription: "جل نقي منخفض اللزوجة",
        appRowSpan: 0,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 971",
        application: "Rheology Modifier Thickeners Suspending-Agent Stabilizer Topical Application",
        arApplication: "معدل لزوجة / مثخن / عامل تعليق / مثبت / استخدام موضعي",
        description: "Benzene Free",
        arDescription: "خالٍ من البنزين",
        appRowSpan: 0,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 934P",
        application: "Oral Care Application Controlled Release",
        arApplication: "تطبيقات العناية بالفم / تحرير متحكم به",
        description: "Special Grades for Internal Use in Pharmaceutical Formulation",
        arDescription: "درجات خاصة للاستخدام الداخلي في التركيبات الصيدلانية",
        appRowSpan: 3,
        descRowSpan: 3,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 974P",
        application: "Oral Care Application Controlled Release",
        arApplication: "تطبيقات العناية بالفم / تحرير متحكم به",
        description: "Special Grades for Internal Use in Pharmaceutical Formulation",
        arDescription: "درجات خاصة للاستخدام الداخلي في التركيبات الصيدلانية",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 971P",
        application: "Oral Care Application Controlled Release",
        arApplication: "تطبيقات العناية بالفم / تحرير متحكم به",
        description: "Special Grades for Internal Use in Pharmaceutical Formulation",
        arDescription: "درجات خاصة للاستخدام الداخلي في التركيبات الصيدلانية",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 956",
        application: "Efficient rheology Modifier Capable Of Providing High Viscosity Gel, Hand Sanitizer, Hydroalcoholic Gel",
        arApplication: "معدل لزوجة فعال يوفر جل عالي اللزوجة، معقم اليدين، جل كحولي مائي",
        description: "Cross-Linked Polyacrylate Acid",
        arDescription: "حمض بولي أكريلات متصالب",
        appRowSpan: 1,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 990",
        application: "Viscosity Enhancer, Gelling Agent, Suspending Agent, Moisturizing Capability",
        arApplication: "محسن لزوجة، عامل هلامي، عامل تعليق، قدرة ترطيب",
        description: "Cross-Linked Polyacrylate Polymer",
        arDescription: "بوليمر بولي أكريلات متصالب",
        appRowSpan: 1,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 996",
        application: "Excellent Thickening Suspending Performance",
        arApplication: "أداء تثخين وتعليق ممتاز",
        description: "Cross-Linked Polyacrylate Polymer",
        arDescription: "بوليمر بولي أكريلات متصالب",
        appRowSpan: 1,
        descRowSpan: 1,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 912G",
        application: "Free flowing Granular form for direct compression in pharmaceutical industry.",
        arApplication: "شكل حبيبي حر التدفق للضغط المباشر في الصناعة الدوائية.",
        description: "Cross-Linked Water Soluble Polymer of Acrylic Acid",
        arDescription: "بوليمر حمض الأكريليك القابل للذوبان في الماء المتصالب",
        appRowSpan: 2,
        descRowSpan: 2,
        tdsUrl: "#",
      },
      {
        product: "Leepol® 971G",
        application: "Free flowing Granular form for direct compression in pharmaceutical industry.",
        arApplication: "شكل حبيبي حر التدفق للضغط المباشر في الصناعة الدوائية.",
        description: "Cross-Linked Water Soluble Polymer of Acrylic Acid",
        arDescription: "بوليمر حمض الأكريليك القابل للذوبان في الماء المتصالب",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Ultrez 10",
        application: "Easy to disperse self wetting rheology modifier with Short flow High Viscosity Performance with best in class electrolyte tolerance and clarity",
        arApplication: "معدل لزوجة ذاتي الترطيب سهل التشتيت مع أداء لزوجة عالية وتحمل ممتاز للشوارد ونقاء فائق",
        description: "Cross-Linked Water Soluble Polymer of Acrylic Acid",
        arDescription: "بوليمر حمض الأكريليك القابل للذوبان في الماء المتصالب",
        appRowSpan: 4,
        descRowSpan: 4,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Ultrez 20",
        application: "Easy to disperse self wetting rheology modifier with Short flow High Viscosity Performance with best in class electrolyte tolerance and clarity",
        arApplication: "معدل لزوجة ذاتي الترطيب سهل التشتيت مع أداء لزوجة عالية وتحمل ممتاز للشوارد ونقاء فائق",
        description: "Cross-Linked Water Soluble Polymer of Acrylic Acid",
        arDescription: "بوليمر حمض الأكريليك القابل للذوبان في الماء المتصالب",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Ultrez 21",
        application: "Easy to disperse self wetting rheology modifier with Short flow High Viscosity Performance with best in class electrolyte tolerance and clarity",
        arApplication: "معدل لزوجة ذاتي الترطيب سهل التشتيت مع أداء لزوجة عالية وتحمل ممتاز للشوارد ونقاء فائق",
        description: "Cross-Linked Water Soluble Polymer of Acrylic Acid",
        arDescription: "بوليمر حمض الأكريليك القابل للذوبان في الماء المتصالب",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Ultrez 2020",
        application: "Easy to disperse self wetting rheology modifier with Short flow High Viscosity Performance with best in class electrolyte tolerance and clarity",
        arApplication: "معدل لزوجة ذاتي الترطيب سهل التشتيت مع أداء لزوجة عالية وتحمل ممتاز للشوارد ونقاء فائق",
        description: "Cross-Linked Water Soluble Polymer of Acrylic Acid",
        arDescription: "بوليمر حمض الأكريليك القابل للذوبان في الماء المتصالب",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Acrym-N-50",
        application: "Pre neutralized anionic rheology modifier",
        arApplication: "معدل لزوجة أنيوني متعادل مسبقاً",
        description: "Acrylates co polymer & mineral oil & polysorbate 80",
        arDescription: "بوليمر أكريلات مشترك وزيت معدني وبوليسوربات 80",
        appRowSpan: 1,
        descRowSpan: 1,
        tdsUrl: "#",
      },
    ],
  },

  /* ── TAB 2 : LEEPOL COAT ───────────────────────────────────────── */
  {
    id: "coat",
    tabLabel: "Leepol Coat",
    arTabLabel: "ليبول كوت (Coat)",
    inci: "INCI: Methacrylic Acid & Ethyl Acrylate Copolymer",
    arInci: "المكون المعتمد (INCI): بوليمر مشترك لحمض الميثاكريليك وإيثيل أكريلات",
    title: "Film-Coating Polymers for Pharma",
    arTitle: "بوليمرات تغليف الأقراص والكبسولات الدوائية",
    desc: "Tablet and capsule coating is both a science and an art; it affects drug release, taste masking, moisture protection, and patient compliance. Leepol Coat provides advanced polymer solutions designed specifically for these critical formulation needs.",
    arDesc: "تغليف الأقراص والكبسولات هو علم وفن متكامل؛ حيث يتحكم في تحرير الدواء، وحجب الطعم غير المرغوب، ومقاومة الرطوبة، وزيادة امتثال المرضى. يقدم ليبول كوت حلول بوليمر متطورة مصممة خصيصاً لهذه الاحتياجات الدوائية الدقيقة.",
    applications: [
      { en: "Film coating for smooth tablet finish", ar: "تغليف غشائي لملمس ناعم للأقراص" },
      { en: "Enteric coating for intestinal release", ar: "تغليف معوي للتحرير في الأمعاء" },
      { en: "Sustained-release drug delivery", ar: "تحرير دوائي ممتد المفعول" },
      { en: "Moisture barrier coating for shelf life", ar: "حاجز حماية من الرطوبة لزيادة الصلاحية" },
      { en: "Taste masking for patient compliance", ar: "حجب الطعم لتحسين تقبل المرضى" },
      { en: "Colon-targeted specific delivery", ar: "استهداف التحرير الدوائي في القولون" },
    ],
    image: "/images/Leepol/Coat.avif",
    imageOverlay: "Advanced Film Coatings",
    arImageOverlay: "حلول التغليف الدوائي المتقدمة",
    glanceTitle: "Leepol® COAT",
    arGlanceTitle: "ليبول® كوت (COAT)",
    glanceBadges: ["Coating Material", "( INCI - Methylarylic Acid & Ethyl Acrylate Copolymer )"],
    arGlanceBadges: ["مادة التغليف (Coating Material)", "( INCI - بوليمر حمض الميثاكريليك وإيثيل أكريلات )"],
    tableProducts: [
      {
        product: "Leepol® Coat S-100",
        application: "Leepol coat series comprise of Methylarylic acid copolymers which is used in film coating, Enteric coating, sustain release, moisture barrier, taste masking, colon targeted coating,",
        arApplication: "تتكون سلسلة ليبول كوت من بوليمرات حمض الميثاكريليك المشتركة المستخدمة في التغليف الغشائي، التغليف المعوي، التحرير ممتد المفعول، حاجز الرطوبة، حجب الطعم، والتغليف المستهدف للقولون.",
        description: "Methylarylic acid copolymers  Solvent System & Aqueous System",
        arDescription: "بوليمرات حمض الميثاكريليك المشتركة - نظام المذيبات والنظام المائي",
        appRowSpan: 8,
        descRowSpan: 8,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Coat L-100",
        application: "Leepol coat series comprise of Methylarylic acid copolymers which is used in film coating, Enteric coating, sustain release, moisture barrier, taste masking, colon targeted coating,",
        arApplication: "تتكون سلسلة ليبول كوت من بوليمرات حمض الميثاكريليك المشتركة المستخدمة في التغليف الغشائي، التغليف المعوي، التحرير ممتد المفعول، حاجز الرطوبة، حجب الطعم، والتغليف المستهدف للقولون.",
        description: "Methylarylic acid copolymers  Solvent System & Aqueous System",
        arDescription: "بوليمرات حمض الميثاكريليك المشتركة - نظام المذيبات والنظام المائي",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Coat L-100D",
        application: "Leepol coat series comprise of Methylarylic acid copolymers which is used in film coating, Enteric coating, sustain release, moisture barrier, taste masking, colon targeted coating,",
        arApplication: "تتكون سلسلة ليبول كوت من بوليمرات حمض الميثاكريليك المشتركة المستخدمة في التغليف الغشائي، التغليف المعوي، التحرير ممتد المفعول، حاجز الرطوبة، حجب الطعم، والتغليف المستهدف للقولون.",
        description: "Methylarylic acid copolymers  Solvent System & Aqueous System",
        arDescription: "بوليمرات حمض الميثاكريليك المشتركة - نظام المذيبات والنظام المائي",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Coat L-30D",
        application: "Leepol coat series comprise of Methylarylic acid copolymers which is used in film coating, Enteric coating, sustain release, moisture barrier, taste masking, colon targeted coating,",
        arApplication: "تتكون سلسلة ليبول كوت من بوليمرات حمض الميثاكريليك المشتركة المستخدمة في التغليف الغشائي، التغليف المعوي، التحرير ممتد المفعول، حاجز الرطوبة، حجب الطعم، والتغليف المستهدف للقولون.",
        description: "Methylarylic acid copolymers  Solvent System & Aqueous System",
        arDescription: "بوليمرات حمض الميثاكريليك المشتركة - نظام المذيبات والنظام المائي",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Coat L-30DA",
        application: "Leepol coat series comprise of Methylarylic acid copolymers which is used in film coating, Enteric coating, sustain release, moisture barrier, taste masking, colon targeted coating,",
        arApplication: "تتكون سلسلة ليبول كوت من بوليمرات حمض الميثاكريليك المشتركة المستخدمة في التغليف الغشائي، التغليف المعوي، التحرير ممتد المفعول، حاجز الرطوبة، حجب الطعم، والتغليف المستهدف للقولون.",
        description: "Methylarylic acid copolymers  Solvent System & Aqueous System",
        arDescription: "بوليمرات حمض الميثاكريليك المشتركة - نظام المذيبات والنظام المائي",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Coat E-100",
        application: "Leepol coat series comprise of Methylarylic acid copolymers which is used in film coating, Enteric coating, sustain release, moisture barrier, taste masking, colon targeted coating,",
        arApplication: "تتكون سلسلة ليبول كوت من بوليمرات حمض الميثاكريليك المشتركة المستخدمة في التغليف الغشائي، التغليف المعوي، التحرير ممتد المفعول، حاجز الرطوبة، حجب الطعم، والتغليف المستهدف للقولون.",
        description: "Methylarylic acid copolymers  Solvent System & Aqueous System",
        arDescription: "بوليمرات حمض الميثاكريليك المشتركة - نظام المذيبات والنظام المائي",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Coat E-12.5",
        application: "Leepol coat series comprise of Methylarylic acid copolymers which is used in film coating, Enteric coating, sustain release, moisture barrier, taste masking, colon targeted coating,",
        arApplication: "تتكون سلسلة ليبول كوت من بوليمرات حمض الميثاكريليك المشتركة المستخدمة في التغليف الغشائي، التغليف المعوي، التحرير ممتد المفعول، حاجز الرطوبة، حجب الطعم، والتغليف المستهدف للقولون.",
        description: "Methylarylic acid copolymers  Solvent System & Aqueous System",
        arDescription: "بوليمرات حمض الميثاكريليك المشتركة - نظام المذيبات والنظام المائي",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® Coat EPO",
        application: "Leepol coat series comprise of Methylarylic acid copolymers which is used in film coating, Enteric coating, sustain release, moisture barrier, taste masking, colon targeted coating,",
        arApplication: "تتكون سلسلة ليبول كوت من بوليمرات حمض الميثاكريليك المشتركة المستخدمة في التغليف الغشائي، التغليف المعوي، التحرير ممتد المفعول، حاجز الرطوبة، حجب الطعم، والتغليف المستهدف للقولون.",
        description: "Methylarylic acid copolymers  Solvent System & Aqueous System",
        arDescription: "بوليمرات حمض الميثاكريليك المشتركة - نظام المذيبات والنظام المائي",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
    ],
  },

  /* ── TAB 3 : LEEPOL HCO ────────────────────────────────────────── */
  {
    id: "hco",
    tabLabel: "Leepol HCO",
    arTabLabel: "ليبول إتش سي أو (HCO)",
    inci: "Polyoxyl 40-Hydrogenated Castor Oil",
    arInci: "المكون المعتمد: زيت الخروع المهدرج بولي أوكسيل 40",
    title: "Non-Ionic Solubilizer & Emulsifier",
    arTitle: "مذيب ومستحلب غير أيوني فائق النقاوة",
    desc: "Solubility is one of the biggest hurdles in formulating oral liquids, injectables, and aerosol products. Leepol HCO is made by reacting hydrogenated castor oil, designed to help poorly soluble actives dissolve effectively while remaining safe and non-toxic.",
    arDesc: "تعتبر الذائبية من أكبر التحديات في تركيب السوائل الفموية، والمستحضرات القابلة للحقن، والهباء الجوي. يتم تصنيع ليبول إتش سي أو من تفاعل زيت الخروع المهدرج لمساعدة المواد الفعالة ضعيفة الذوبان على الذوبان بكفاءة مع الحفاظ على الأمان التام وعدم السمية.",
    applications: [
      { en: "Solubilizer for limited-solubility actives", ar: "مذيب للمواد الفعالة محدودة الذائبية" },
      { en: "Dissolution improver for APIs", ar: "محسن ذوبان للمكونات الصيدلانية الفعالة" },
      { en: "Emulsifier for stable formulations", ar: "مستحلب قوي ومثبت للتركيبات" },
      { en: "Transparency improver for clear liquids", ar: "محسن شفافية للسوائل النقية" },
      { en: "Volatility retardant & Film former", ar: "مؤخر تطاير ومكون للأغشية" },
      { en: "Masking agent for taste or odor", ar: "عامل حجب وتعديل للطعم والرائحة" },
    ],
    image: "/images/Leepol/HCO.avif",
    imageOverlay: "Solubilizers & Emulsifiers",
    arImageOverlay: "المذيبات والمستحلبات النقية",
    glanceTitle: "Leepol® HCO",
    arGlanceTitle: "ليبول® إتش سي أو (HCO)",
    glanceBadges: ["( Polyoxyl 40-Hydrogenated Castor Oil )"],
    arGlanceBadges: ["( زيت الخروع المهدرج بولي أوكسيل 40 )"],
    tableProducts: [
      {
        product: "Leepol® HCO K-140",
        application: "Leepol® HCO is non ionic solubiliser and emulsifier obtained by reacting hydrogenated castor oil Applicable as Solubilizer, Dissolution Improver, Emulsifier, Moisturizer, Transparency Improver, Volatility retardant, Film Former, Masking Agent, Aerosol Formulations",
        arApplication: "ليبول® إتش سي أو هو مذيب ومستحلب غير أيوني ناتج عن تفاعل زيت الخروع المهدرج؛ قابل للتطبيق كمذيب، محسن ذوبان، مستحلب، مرطب، محسن شفافية، مؤخر تطاير، مكون أغشية، عامل حجب، وتركيبات رذاذية",
        description: "Colorless Viscous Liquid, Odourless Viscous Liquid, Nontoxic",
        arDescription: "سائل لزج عديم اللون، سائل لزج عديم الرائحة، غير سام",
        appRowSpan: 5,
        descRowSpan: 3,
        tdsUrl: "#",
      },
      {
        product: "Leepol® HCO POWDER",
        application: "Leepol® HCO is non ionic solubiliser and emulsifier obtained by reacting hydrogenated castor oil Applicable as Solubilizer, Dissolution Improver, Emulsifier, Moisturizer, Transparency Improver, Volatility retardant, Film Former, Masking Agent, Aerosol Formulations",
        arApplication: "ليبول® إتش سي أو هو مذيب ومستحلب غير أيوني ناتج عن تفاعل زيت الخروع المهدرج؛ قابل للتطبيق كمذيب، محسن ذوبان، مستحلب، مرطب، محسن شفافية، مؤخر تطاير، مكون أغشية، عامل حجب، وتركيبات رذاذية",
        description: "Colorless Viscous Liquid, Odourless Viscous Liquid, Nontoxic",
        arDescription: "سائل لزج عديم اللون، سائل لزج عديم الرائحة، غير سام",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® HCO FLAKE",
        application: "Leepol® HCO is non ionic solubiliser and emulsifier obtained by reacting hydrogenated castor oil Applicable as Solubilizer, Dissolution Improver, Emulsifier, Moisturizer, Transparency Improver, Volatility retardant, Film Former, Masking Agent, Aerosol Formulations",
        arApplication: "ليبول® إتش سي أو هو مذيب ومستحلب غير أيوني ناتج عن تفاعل زيت الخروع المهدرج؛ قابل للتطبيق كمذيب، محسن ذوبان، مستحلب، مرطب، محسن شفافية، مؤخر تطاير، مكون أغشية، عامل حجب، وتركيبات رذاذية",
        description: "Colorless Viscous Liquid, Odourless Viscous Liquid, Nontoxic",
        arDescription: "سائل لزج عديم اللون، سائل لزج عديم الرائحة، غير سام",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
      {
        product: "Leepol® HCO K-150",
        application: "Leepol® HCO is non ionic solubiliser and emulsifier obtained by reacting hydrogenated castor oil Applicable as Solubilizer, Dissolution Improver, Emulsifier, Moisturizer, Transparency Improver, Volatility retardant, Film Former, Masking Agent, Aerosol Formulations",
        arApplication: "ليبول® إتش سي أو هو مذيب ومستحلب غير أيوني ناتج عن تفاعل زيت الخروع المهدرج؛ قابل للتطبيق كمذيب، محسن ذوبان، مستحلب، مرطب، محسن شفافية، مؤخر تطاير، مكون أغشية، عامل حجب، وتركيبات رذاذية",
        description: "White to Pale Yellow, Viscous Liquid, Nontoxic",
        arDescription: "سائل لزج من الأبيض إلى الأصفر الشاحب، غير سام",
        appRowSpan: 0,
        descRowSpan: 2,
        tdsUrl: "#",
      },
      {
        product: "Leepol® HCO K-160",
        application: "Leepol® HCO is non ionic solubiliser and emulsifier obtained by reacting hydrogenated castor oil Applicable as Solubilizer, Dissolution Improver, Emulsifier, Moisturizer, Transparency Improver, Volatility retardant, Film Former, Masking Agent, Aerosol Formulations",
        arApplication: "ليبول® إتش سي أو هو مذيب ومستحلب غير أيوني ناتج عن تفاعل زيت الخروع المهدرج؛ قابل للتطبيق كمذيب، محسن ذوبان، مستحلب، مرطب، محسن شفافية، مؤخر تطاير، مكون أغشية، عامل حجب، وتركيبات رذاذية",
        description: "White to Pale Yellow, Viscous Liquid, Nontoxic",
        arDescription: "سائل لزج من الأبيض إلى الأصفر الشاحب، غير سام",
        appRowSpan: 0,
        descRowSpan: 0,
        tdsUrl: "#",
      },
    ],
  },
];


/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT — LeepolProductsShowcase
   ═══════════════════════════════════════════════════════════════════════ */

export default function LeepolProductsShowcase() {
  const { isRTL } = useLanguage();
  const [activeTabId, setActiveTabId] = useState("carbomer");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const currentTab =
    LEEPOL_TABS_DATA.find((tab) => tab.id === activeTabId) || LEEPOL_TABS_DATA[0];

  const handleOpenQuote = (productItem) => {
    setSelectedProduct(productItem);
    setIsQuoteModalOpen(true);
  };

  return (
    <section className="relative w-full bg-[var(--color-primary)] pt-3 sm:pt-8 md:pt-10 pb-8 sm:pb-10 md:py-12 text-white overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold-main/[0.04] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 relative z-10">

        {/* ────────────────────────────────────────────
            1. SECTION HEADING
            ──────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-6">
          <h2 className="font-heading font-medium text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px] text-white tracking-tight leading-tight">
            {isRTL ? (
              <>
                <span className="font-heading text-white font-medium not-italic inline mr-2 rtl:mr-0 rtl:ml-2">
                  استكشف
                </span>
                <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                  خطوط منتجاتنا الرائدة
                </span>
              </>
            ) : (
              <>
                <span className="font-heading text-white font-medium not-italic inline mr-2">
                  Explore Our
                </span>
                <span className="font-heading text-gradient-gold-animated font-semibold not-italic inline">
                  Flagship Lines
                </span>
              </>
            )}
          </h2>
        </div>

        {/* ────────────────────────────────────────────
            2. TAB NAVIGATION (Centered & Fully Visible on Mobile)
            ──────────────────────────────────────────── */}
        <div className="w-full flex justify-center mb-5 sm:mb-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-1 py-1">
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-3 mx-auto">
            {LEEPOL_TABS_DATA.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`
                    shrink-0 whitespace-nowrap px-2.5 sm:px-6 py-1.5 sm:py-2.5 rounded-full font-heading font-bold
                    text-[10px] sm:text-xs uppercase tracking-normal sm:tracking-wider
                    transition-all duration-300 cursor-pointer
                    ${isActive
                      ? "bg-gradient-gold-animated text-black shadow-md shadow-gold-main/25 scale-[1.02]"
                      : "bg-[#0e1017] border border-[#202434] text-gray-400 hover:text-white hover:border-gold-main/40 hover:bg-[#131622]"
                    }
                  `}
                >
                  {isRTL ? tab.arTabLabel : tab.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* ────────────────────────────────────────────
            3. OVERVIEW CARD (50 / 50 layout — Image on TOP on mobile)
            ──────────────────────────────────────────── */}
        <div className="bg-[var(--color-card-dark)] border border-gold-main/25 hover:border-gold-main/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-8 sm:mb-10 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px] lg:min-h-[360px]">

            {/* Top on Mobile / Right on Desktop — Full-bleed Image */}
            <div className="order-1 lg:order-2 relative w-full h-[210px] sm:h-[260px] md:h-[300px] lg:min-h-full lg:h-auto overflow-hidden group">
              <Image
                src={currentTab.image}
                alt={currentTab.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Image overlay label */}
              <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5 z-10">
                <span className="font-heading font-bold text-xs sm:text-base text-gold-light drop-shadow">
                  {isRTL ? currentTab.arImageOverlay : currentTab.imageOverlay}
                </span>
              </div>
            </div>

            {/* Bottom on Mobile / Left on Desktop — Text Content */}
            <div className="order-2 lg:order-1 flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-10">

              {/* INCI badge */}
              <span className="text-gold-main font-heading font-bold text-[10.5px] sm:text-xs tracking-[0.18em] uppercase block mb-1.5 sm:mb-2">
                {isRTL ? currentTab.arInci : currentTab.inci}
              </span>

              {/* Title */}
              <h3 className="font-heading font-bold text-lg sm:text-2xl md:text-[28px] lg:text-3xl text-white tracking-tight leading-snug mb-2 sm:mb-3">
                {isRTL ? currentTab.arTitle : currentTab.title}
              </h3>

              {/* Description */}
              <p className="font-subheading text-xs sm:text-[13px] text-gray-300 leading-relaxed mb-3.5 sm:mb-5">
                {isRTL ? currentTab.arDesc : currentTab.desc}
              </p>

              {/* Key Applications */}
              <div className="bg-[#12141d]/80 border border-[#232738] rounded-xl p-3.5 sm:p-5">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-white mb-2.5 sm:mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-gradient-gold-animated" />
                  {isRTL ? "أبرز التطبيقات والاستخدامات" : "Key Applications"}
                </h4>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-subheading text-gray-300">
                  {currentTab.applications.map((app, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-snug">
                      <span className="text-gold-main font-bold shrink-0">—</span>
                      <span>{isRTL ? app.ar : app.en}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* ────────────────────────────────────────────
            4. PRODUCT TABLE
            ──────────────────────────────────────────── */}
        <div>

          {/* Table Header */}
          <div className="mb-4 sm:mb-5">
            <span className="text-gold-main font-heading font-bold text-[11px] sm:text-xs tracking-[0.18em] uppercase block mb-1">
              {isRTL ? "نظرة سريعة على المنتجات" : "PRODUCT AT A GLANCE"}
            </span>

            <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-[28px] text-white tracking-tight leading-tight mb-2 sm:mb-3">
              {isRTL ? currentTab.arGlanceTitle : currentTab.glanceTitle}
            </h3>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {(isRTL ? currentTab.arGlanceBadges : currentTab.glanceBadges).map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-3 py-1 rounded-full bg-gold-main/10 border border-gold-main/30 text-gold-light text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Tablet Swipe Helper */}
              <div className="hidden md:flex lg:hidden items-center gap-1.5 text-[10.5px] font-mono text-gold-light/80 bg-gold-main/10 border border-gold-main/25 px-2.5 py-1 rounded-full">
                <ArrowLeftRight className="w-3 h-3 text-gold-main animate-pulse" />
                <span>{isRTL ? "اسحب لعرض كامل الجدول" : "Swipe to view full table"}</span>
              </div>
            </div>
          </div>

          {/* Table Container — Premium Glass Card */}
          <div className="bg-gradient-to-b from-[#11131c] via-[#0d0f17] to-[#0a0b12] border border-gold-main/35 hover:border-gold-main/50 rounded-2xl sm:rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(230,175,46,0.06)] overflow-hidden transition-all duration-300">

            {/* ── 1. DESKTOP & TABLET VIEW (md and up): Unified Spanning Table ── */}
            <div className="hidden md:block max-h-[680px] lg:max-h-[830px] xl:max-h-[835px] overflow-x-auto overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:#32384a_#12141d] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#0d0f17] [&::-webkit-scrollbar-thumb]:bg-[#2c3348] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold-main/60 px-2 sm:px-3.5 pb-2.5 sm:pb-3.5 pt-0">

              <table className="w-full min-w-[760px] lg:min-w-full text-center border-separate border-spacing-x-2 border-spacing-y-1.5">

                {/* 100% Solid Sticky Header — Luxury Dark Bar with Gold Accents */}
                <thead className="sticky top-0 z-30 bg-[#0d0f17] shadow-lg shadow-black/90">
                  <tr className="bg-[#0d0f17]">
                    <th className="sticky top-0 z-30 pt-3 pb-2 px-1 text-center bg-[#0d0f17] w-[20%] xl:w-[18%]">
                      <div className="py-2.5 px-3 font-heading font-bold text-xs lg:text-[13px] tracking-wider uppercase text-gold-light rounded-xl bg-gradient-to-b from-[#191d2c] to-[#121522] border border-[#2d344b] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        {isRTL ? "المنتج (PRODUCTS)" : "PRODUCTS"}
                      </div>
                    </th>
                    <th className="sticky top-0 z-30 pt-3 pb-2 px-1 text-center bg-[#0d0f17] w-[38%] xl:w-[40%]">
                      <div className="py-2.5 px-3 font-heading font-bold text-xs lg:text-[13px] tracking-wider uppercase text-gold-light rounded-xl bg-gradient-to-b from-[#191d2c] to-[#121522] border border-[#2d344b] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        {isRTL ? "مجال التطبيق (APPLICATION)" : "APPLICATION"}
                      </div>
                    </th>
                    <th className="sticky top-0 z-30 pt-3 pb-2 px-1 text-center bg-[#0d0f17] w-[30%] xl:w-[30%]">
                      <div className="py-2.5 px-3 font-heading font-bold text-xs lg:text-[13px] tracking-wider uppercase text-gold-light rounded-xl bg-gradient-to-b from-[#191d2c] to-[#121522] border border-[#2d344b] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        {isRTL ? "الوصف والمواصفة (DESCRIPTION)" : "DESCRIPTION"}
                      </div>
                    </th>
                    <th className="sticky top-0 z-30 pt-3 pb-2 px-1 text-center bg-[#0d0f17] w-[12%] xl:w-[12%]">
                      <div className="py-2.5 px-3 font-heading font-bold text-xs lg:text-[13px] tracking-wider uppercase text-gold-light rounded-xl bg-gradient-to-b from-[#191d2c] to-[#121522] border border-[#2d344b] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        {isRTL ? "الإجراءات (ACTIONS)" : "ACTIONS"}
                      </div>
                    </th>
                  </tr>
                </thead>

                {/* Body with Elevated Rounded Box Rows */}
                <tbody className="font-subheading text-xs">
                  {currentTab.tableProducts.map((row, idx) => {
                    const appSpan = row.appRowSpan !== undefined ? row.appRowSpan : 1;
                    const descSpan = row.descRowSpan !== undefined ? row.descRowSpan : 1;

                    return (
                      <tr key={idx} className="group">

                        {/* 1. Product Name Box */}
                        <td className="align-middle text-center p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#141725] to-[#0f111c] border border-[#22273c] group-hover:border-gold-main/50 group-hover:shadow-[0_0_16px_rgba(230,175,46,0.1)] transition-all duration-300">
                          <div className="flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-main/70 group-hover:bg-gold-light group-hover:scale-125 transition-all shrink-0" />
                            <span className="font-heading font-bold text-[12.5px] sm:text-[13.5px] text-white group-hover:text-gold-light transition-colors tracking-tight">
                              {row.product}
                            </span>
                          </div>
                        </td>

                        {/* 2. Application Box (spans vertically when appSpan > 0 — full border block matching SS 4 & 5) */}
                        {appSpan > 0 && (
                          <td
                            rowSpan={appSpan}
                            className={`align-middle text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                              appSpan > 1
                                ? "bg-gradient-to-b from-[#131627] via-[#15192e] to-[#131627] border-2 border-[#2b334e] hover:border-gold-main/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]"
                                : "bg-gradient-to-b from-[#111320] to-[#0d0f18] border border-[#1f2436] hover:border-gold-main/35"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center py-2 px-1">
                              <span className="font-subheading text-gray-300 text-[11px] sm:text-xs leading-relaxed max-w-lg mx-auto">
                                {isRTL ? row.arApplication : row.application}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* 3. Description Box (spans vertically when descSpan > 0 — full border block matching SS 4 & 5) */}
                        {descSpan > 0 && (
                          <td
                            rowSpan={descSpan}
                            className={`align-middle text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 ${
                              descSpan > 1
                                ? "bg-gradient-to-b from-[#14172a] via-[#171b32] to-[#14172a] border-2 border-[#2b334e] hover:border-gold-main/50 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]"
                                : "bg-gradient-to-b from-[#131624] to-[#0f111c] border border-[#22273c] hover:border-gold-main/35"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center py-2 px-1">
                              <span className="font-subheading font-medium text-gold-light/95 group-hover:text-gold-light text-[11px] sm:text-xs leading-relaxed max-w-md mx-auto">
                                {isRTL ? row.arDescription : row.description}
                              </span>
                            </div>
                          </td>
                        )}

                        {/* 4. Action Box (QUOTE) */}
                        <td className="align-middle text-center p-2 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#141725] to-[#0f111c] border border-[#22273c] group-hover:border-gold-main/40 transition-all duration-300">
                          <button
                            type="button"
                            onClick={() => handleOpenQuote(row)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-gold-animated text-black text-[10.5px] sm:text-[11px] font-heading font-extrabold shadow-[0_2px_8px_rgba(230,175,46,0.3)] hover:shadow-[0_4px_16px_rgba(230,175,46,0.55)] hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap tracking-wider uppercase"
                          >
                            <span>{isRTL ? "طلب سعر" : "QUOTE"}</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>

            </div>

            {/* ── 2. MOBILE VIEW (<768px): High-Density Luxury Cards with Vertical Scrolling ── */}
            <div className="block md:hidden max-h-[540px] overflow-y-auto overscroll-contain p-3 space-y-3.5 [scrollbar-width:thin] [scrollbar-color:#32384a_#12141d] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#2c3348] [&::-webkit-scrollbar-thumb]:rounded-full">
              {currentTab.tableProducts.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gradient-to-b from-[#131624] via-[#10131d] to-[#0d0f17] border border-[#23283c] hover:border-gold-main/50 transition-all duration-300 shadow-lg space-y-3"
                >
                  {/* Card Header: Product Name + Instant Quote Button */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#1f2438]">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-gold-main shrink-0 shadow-[0_0_8px_rgba(230,175,46,0.6)]" />
                      <h4 className="font-heading font-bold text-sm text-white tracking-tight truncate">
                        {row.product}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenQuote(row)}
                      className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg bg-gradient-gold-animated text-black text-[10.5px] font-heading font-extrabold shadow-[0_2px_8px_rgba(230,175,46,0.3)] active:scale-95 transition-all cursor-pointer whitespace-nowrap uppercase shrink-0"
                    >
                      <span>{isRTL ? "طلب سعر" : "QUOTE"}</span>
                    </button>
                  </div>

                  {/* Application Information Box */}
                  <div className="p-2.5 rounded-xl bg-[#0a0b12]/80 border border-[#1d2233]">
                    <span className="text-[9.5px] font-heading font-bold text-gold-light/90 block uppercase tracking-wider mb-1">
                      {isRTL ? "مجال التطبيق (APPLICATION)" : "APPLICATION"}
                    </span>
                    <p className="font-subheading text-[11.5px] text-gray-300 leading-relaxed">
                      {isRTL ? row.arApplication : row.application}
                    </p>
                  </div>

                  {/* Description Information Box */}
                  <div className="p-2.5 rounded-xl bg-[#0a0b12]/80 border border-[#1d2233]">
                    <span className="text-[9.5px] font-heading font-bold text-gold-light/90 block uppercase tracking-wider mb-1">
                      {isRTL ? "الوصف والمواصفة (DESCRIPTION)" : "DESCRIPTION"}
                    </span>
                    <p className="font-subheading font-medium text-[11.5px] text-gold-light leading-relaxed">
                      {isRTL ? row.arDescription : row.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer bar — Premium Status Counter */}
            <div className="py-3 px-4 sm:px-6 bg-gradient-to-r from-[#0d0f17] via-[#121520] to-[#0d0f17] border-t border-[#22273d] flex flex-wrap items-center justify-between text-[11px] sm:text-xs font-subheading text-gray-400 gap-3">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-main opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-main"></span>
                </span>
                <span>
                  {isRTL ? "إجمالي درجات المنتجات:" : "Total Product Grades:"}{" "}
                  <strong className="text-gold-light font-heading font-bold text-xs sm:text-[13px]">
                    {currentTab.tableProducts.length}
                  </strong>
                </span>
              </span>

              <span className="text-[10.5px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
                <span className="text-gold-main/90 font-semibold">
                  {isRTL ? "مرّر للأسفل لعرض درجات إضافية" : "Scroll inside table to view more"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gold-main animate-bounce" />
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* ────────────────────────────────────────────
          5. QUOTE MODAL
          ──────────────────────────────────────────── */}
      {isQuoteModalOpen && selectedProduct && (
        <div
          onClick={() => setIsQuoteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#0e1015] border border-gold-main/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Close */}
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1b1e2a] border border-[#2e3344] text-gray-400 hover:text-white hover:border-gold-light hover:bg-[#252a3a] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
              aria-label="Close quote modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Product info header */}
            <div className="mb-5 bg-[#161822] border border-gold-main/20 rounded-xl p-4 flex items-center gap-3 sm:gap-4 shadow-lg overflow-hidden">
              <div className="w-1 h-10 bg-gradient-gold-animated rounded-full shrink-0" />
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gold-main/15 border border-gold-main/40 flex items-center justify-center text-gold-light shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="pr-8 rtl:pr-0 rtl:pl-8 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-heading font-bold uppercase tracking-widest text-gold-light block mb-0.5">
                  {isRTL ? "طلب عرض سعر رسمي" : "Request Quote"}
                </span>
                <h3 className="font-heading font-bold text-base sm:text-xl text-white leading-tight truncate">
                  {selectedProduct.product}
                </h3>
                <p className="font-subheading text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">
                  {isRTL ? selectedProduct.arApplication : selectedProduct.application}
                </p>
              </div>
            </div>

            {/* Form */}
            <LeadEnquiryForm
              sourcePage={`The World of Leepol - ${selectedProduct.product}`}
              productName={selectedProduct.product}
              showHeading={false}
              isModal={true}
            />
          </div>
        </div>
      )}

    </section>
  );
}
