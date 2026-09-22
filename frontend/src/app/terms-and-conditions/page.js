"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  FileText,
  Scale,
  CheckCircle2,
  Truck,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Lock,
  Building2,
  Calendar,
  ArrowRight,
  HelpCircle,
  Mail,
  Flame,
} from "lucide-react";

export default function TermsAndConditionsPage() {
  const { isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState("preamble");

  const lastUpdated = isRTL ? "يناير 2026" : "January 2026";

  const sections = isRTL
    ? [
        {
          id: "preamble",
          icon: Building2,
          title: "1. نطاق الاتفاقية وهوية الشركة",
          content: [
            "تحكم هذه الشروط والأحكام كافة المعاملات التجارية وعروض الأسعار وأوامر الشراء والخدمات الاستشارية المقدمة من قِبل شركة ليلا جلف ش.م.ح (Leela Gulf F.Z.C.)، المسجلة لدى هيئة المنطقة الحرة بعجمان، دولة الإمارات العربية المتحدة، مكتب C11F - SF9213.",
            "يشكل إرسال طلب عرض أسعار (RFQ)، أو إصدار أمر شراء (PO)، أو قبول فاتورة أولية (Proforma Invoice) موافقة كاملة وملزمة من المشتري/العميل على هذه الشروط والأحكام دون أي تحفظ.",
            "لا تسري أي شروط أو بنود إضافية يقدمها العميل إلا بموجب موافقة خطية صريحة وموقعة من المفوض بالتوقيع في ليلا جلف.",
          ],
        },
        {
          id: "products-specifications",
          icon: CheckCircle2,
          title: "2. المنتجات والمواصفات الفنية وشهادات التحليل (COA)",
          content: [
            "توريد المواد الكيميائية: تشمل منتجاتنا الكيماويات الصناعية العامة، المواد الفعالة والمكونات الصيدلانية (APIs & Excipients)، بوليمرات LEEPOL® المتخصصة، ملونات ومضافات الأغذية، والمذيبات المتخصصة.",
            "شهادات التحليل (COA): يتم توريد كافة المواد مصحوبة بشهادة تحليل معتمدة (Certificate of Analysis) توضح معايير الجودة والدرجة التقنية المعتمدة وقت الشحن.",
            "التفاوتات المعيارية: تخضع جميع المواد الكيميائية للتفاوتات الصناعية القياسية ومواصفات المصنعين ما لم يتم الاتفاق كتابياً على درجات نقاء مخصصة.",
            "فحص العينات والاستلام: يلتزم المشتري بفحص واختبار المواد فور وصولها إلى ميناء الوصول أو مستودعاته قبل استخدامها في خطوط الإنتاج.",
          ],
        },
        {
          id: "pricing-payment",
          icon: Scale,
          title: "3. عروض الأسعار والطلبات وشروط الدفع",
          content: [
            "صلاحية الأسعار: نظراً لتقلبات أسواق المواد الكيميائية العالمية وأسعار الشحن البحري، تكون الأسعار المذكورة في عروض الأسعار صالحة للمدة المحددة صراحة في العرض.",
            "العملة والضرائب: تُسعر المعاملات عموماً بالدولار الأمريكي (USD) أو الدرهم الإماراتي (AED) ولا تشمل ضريبة القيمة المضافة (VAT) أو الرسوم الجمركية المحلية ما لم يُنص على خلاف ذلك.",
            "طرق الدفع: يتم سداد القيمة عبر التحويل البنكي المباشر (TT)، أو خطابات الاعتماد المستندية غير القابلة للإلغاء والمؤكدة (LC at sight)، أو وفق شروط الائتمان المتفق عليها خطياً.",
            "التأخير في السداد: يحق لشركة ليلا جلف تعليق أو إلغاء الشحنات المستقبلية في حال تأخر العميل عن سداد أي مستحقات مالية في مواعيدها المحددة.",
          ],
        },
        {
          id: "shipping-delivery",
          icon: Truck,
          title: "4. الشحن والتسليم وقواعد التجارة الدولية (Incoterms)",
          content: [
            "قواعد التجارة الدولية: تُنفذ جميع الشحنات البحرية والبرية والجوية وفق أحدث إصدار من قواعد التجارة الدولية (Incoterms 2020) مثل CIF, FOB, CFR, EXW وفقاً لما هو مدون في الفاتورة الأولية.",
            "انتقال المخاطر والملكية: تنتقل مخاطر هلاك أو تلف البضائع إلى المشتري وفق شرط الـ Incoterms المتفق عليه، بينما تظل ملكية البضائع محفوظة لـ ليلا جلف حتى استلام كامل القيمة المالية.",
            "التخليص الجمركي والموافقات: يتحمل المستورد/المشتري مسؤولية استخراج كافة تراخيص الاستيراد والموافقات البيئية والتنظيمية في بلد المقصد.",
          ],
        },
        {
          id: "safety-compliance",
          icon: Flame,
          title: "5. السلامة الكيميائية وبيانات السلامة (MSDS) والاستخدام المصرح به",
          content: [
            "أوراق بيانات سلامة المواد (MSDS): توفر ليلا جلف أوراق بيانات السلامة المتوافقة مع النظام المنسق عالمياً (GHS) لكل منتج كيميائي.",
            "الاستخدام والتعامل الآمن: يقر المشتري بامتلاكه التجهيزات والكوادر المؤهلة للتعامل الآمن وتخزين وتصريف المواد الكيميائية وفق اللوائح البيئية السارية.",
            "إقرار الاستخدام النهائي: يتعهد المشتري بعدم استخدام أي من المواد الكيميائية الموردة في أي أنشطة محظورة دولياً أو تخل باتفاقيات منع انتشار الأسلحة الكيميائية.",
          ],
        },
        {
          id: "intellectual-property",
          icon: Lock,
          title: "6. الملكية الفكرية والعلامات التجارية",
          content: [
            "جميع العلامات التجارية، بما في ذلك العلامة التجارية المسجلة LEEPOL® وشعار ليلا جلف والمحتوى التقني المنشور على الموقع، هي ملكية حصرية لشركة ليلا جلف ومجموعتها.",
            "يحظر نسخ أو إعادة إنتاج أو استغلال أي تصاميم أو مواصفات أو تركيبات بوليمرية دون إذن خطي مسبق.",
          ],
        },
        {
          id: "liability-force-majeure",
          icon: AlertTriangle,
          title: "7. حدود المسؤولية والقوة القاهرة (Force Majeure)",
          content: [
            "حدود المسؤولية: تنحصر مسؤولية ليلا جلف القصوى عن أي مطالبة متعلقة بعدم مطابقة المنتج في استبدال البضاعة المعيبة أو رد قيمتها المدفوعة فقط، ولا نتحمل أي مسؤولية عن أرباح فائتة أو خسائر تشغيلية غير مباشرة.",
            "القوة القاهرة: لا تتحمل الشركة مسؤولية أي تأخير أو إخفاق ناتج عن ظروف قاهرة خارجة عن الإرادة المعقولة تشمل: إغلاق الموانئ، الاضطرابات الملاحية، الأوبئة، النزاعات العمالية، أو القرارات الحكومية الطارئة.",
          ],
        },
        {
          id: "governing-law",
          icon: Scale,
          title: "8. القانون الواجب التطبيق والاختصاص القضائي",
          content: [
            "تخضع هذه الشروط والأحكام وتُفسر وفقاً لقوانين دولة الإمارات العربية المتحدة واللوائح المعمول بها في هيئة المنطقة الحرة بعجمان.",
            "يتم حل أي نزاع ينشأ عن هذه الاتفاقية ودياً في المقام الأول، وفي حال تعذر ذلك، ينعقد الاختصاص القضائي الحصري لمحاكم دبي/عجمان أو مركز التحكيم المتفق عليه.",
          ],
        },
        {
          id: "contact-legal",
          icon: Mail,
          title: "9. الاستفسارات والإشعارات القانونية",
          content: [
            "تُرسل كافة الإشعارات والاستفسارات المتعلقة بالعقود والشروط التجارية إلى القسم القانوني:",
            "البريد الإلكتروني: info@leelagulf.com",
            "العنوان: شركة ليلا جلف ش.م.ح، منطقة عجمان الحرة، مكتب C11F - SF9213، عجمان، الإمارات العربية المتحدة",
            "الهاتف: 92746 87487 (971+)",
          ],
        },
      ]
    : [
        {
          id: "preamble",
          icon: Building2,
          title: "1. Scope & Company Identification",
          content: [
            "These Terms and Conditions govern all commercial transactions, quotations, sales contracts, purchase orders, and technical consultancy provided by Leela Gulf F.Z.C., registered under the Ajman Free Zone Authority, United Arab Emirates, Office C11F - SF9213.",
            "The issuance of a Request for Quotation (RFQ), issuance of a Purchase Order (PO), or confirmation of a Proforma Invoice constitutes the buyer's full and unconditional acceptance of these terms.",
            "No supplementary or differing terms proposed by the buyer shall have legal validity unless explicitly confirmed in writing and signed by an authorized signatory of Leela Gulf F.Z.C.",
          ],
        },
        {
          id: "products-specifications",
          icon: CheckCircle2,
          title: "2. Products, Specifications & Certificate of Analysis (COA)",
          content: [
            "Chemical Portfolio: Our global supply scope encompasses Industrial Chemicals, Active Pharmaceutical Ingredients (APIs & Excipients), LEEPOL® specialty polymers, Food Colors & Additives, and Water Treatment formulations.",
            "Certificates of Analysis (COA): Every chemical consignment is dispatched with an authentic Certificate of Analysis reflecting the tested parameters and grade specifications at the time of loading.",
            "Industrial Tolerances: All materials are subject to standard international manufacturing tolerances and batch variances unless custom purity standards are contractually stipulated.",
            "Inspection Obligation: The buyer is obligated to inspect, sample, and test consignments upon arrival at the designated port or facility prior to blending or industrial processing.",
          ],
        },
        {
          id: "pricing-payment",
          icon: Scale,
          title: "3. Quotations, Orders & Payment Terms",
          content: [
            "Price Validity: Due to global chemical feedstocks and freight volatility, quotations are valid strictly for the timeframe specified in the formal commercial offer.",
            "Currencies & Duties: Prices are denominated in USD or AED and exclude local import duties, port tariffs, or VAT unless expressly agreed under DDP Incoterms.",
            "Payment Instruments: Payments must be settled via Telegraphic Transfer (TT), Irrevocable Confirmed Letter of Credit at sight (LC), or verified documentary collection.",
            "Default on Payments: Leela Gulf F.Z.C. reserves the right to suspend manufacturing, halt in-transit consignments, or cancel pending deliveries in the event of overdue accounts.",
          ],
        },
        {
          id: "shipping-delivery",
          icon: Truck,
          title: "4. Shipping, Delivery & Incoterms 2020",
          content: [
            "Applicable Incoterms: All international maritime, land, and air freight shipments are executed under ICC Incoterms 2020 (CIF, FOB, CFR, EXW, FCA) as specified on the commercial invoice.",
            "Transfer of Risk & Title: Risk of loss or damage transfers in accordance with the nominated Incoterm. Ownership and title to goods remain with Leela Gulf F.Z.C. until payment is received in full.",
            "Customs Clearance: The importer/buyer bears sole responsibility for securing all necessary import permits, chemical registrations, and environmental authorizations in the destination country.",
          ],
        },
        {
          id: "safety-compliance",
          icon: Flame,
          title: "5. Chemical Safety, MSDS & End-Use Declarations",
          content: [
            "Material Safety Data Sheets (MSDS): Leela Gulf F.Z.C. provides GHS-compliant Safety Data Sheets outlining handling, PPE, storage, and emergency spill countermeasures.",
            "Safe Storage & Handling: The buyer warrants that receiving facilities comply with applicable environmental, occupational health, and hazardous substance storage regulations.",
            "End-Use Undertaking: The buyer guarantees that chemicals supplied will not be diverted to non-peaceful purposes, prohibited dual-use applications, or sanctioned international entities.",
          ],
        },
        {
          id: "intellectual-property",
          icon: Lock,
          title: "6. Intellectual Property & Brand Assets",
          content: [
            "All registered trademarks, including the LEEPOL® brand, Leela Gulf trade insignia, product datasheets, and proprietary formulation data, remain the exclusive intellectual property of the group.",
            "Unauthorized replication, reverse engineering of specialty polymer matrices, or trademark infringement will be prosecuted under applicable UAE and international IP laws.",
          ],
        },
        {
          id: "liability-force-majeure",
          icon: AlertTriangle,
          title: "7. Limitation of Liability & Force Majeure",
          content: [
            "Liability Cap: The maximum liability of Leela Gulf F.Z.C. for any non-conforming batch is strictly capped at replacing the affected volume or refunding the invoiced net purchase price. In no event shall we be liable for indirect, punitive, or consequential production losses.",
            "Force Majeure: Neither party shall be held liable for failure or delay caused by events beyond reasonable control, including port blockades, maritime delays, feedstock force majeure, natural disasters, epidemics, or emergency trade embargoes.",
          ],
        },
        {
          id: "governing-law",
          icon: Scale,
          title: "8. Governing Law & Dispute Resolution",
          content: [
            "These Terms and Conditions shall be construed and governed in all respects in accordance with the substantive laws of the United Arab Emirates and the regulations of the Ajman Free Zone Authority.",
            "Any dispute arising from commercial contracts shall first be submitted to good-faith executive consultation. Unresolved disputes shall be submitted to the exclusive jurisdiction of the competent courts in the UAE or accredited arbitration bodies.",
          ],
        },
        {
          id: "contact-legal",
          icon: Mail,
          title: "9. Legal Notices & Communications",
          content: [
            "All formal contract notices, documentation, and regulatory inquiries should be directed to our corporate legal desk:",
            "Email: info@leelagulf.com",
            "Corporate Address: Leela Gulf F.Z.C., Ajman Free Zone, Office C11F - SF9213, Ajman, United Arab Emirates",
            "Phone: +971 92746 87487",
          ],
        },
      ];

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-white pt-28 sm:pt-32 md:pt-36 pb-20 sm:pb-24 overflow-hidden relative">
      {/* Ambient Gold Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-main/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-gold-main/[0.03] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        {/* ── HERO HEADER BLOCK ── */}
        <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 ${isRTL ? "rtl" : "ltr"}`}>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-gold-main/30 text-gold-light text-xs font-heading font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <Scale className="w-3.5 h-3.5 text-gold-main" />
            <span>{isRTL ? "الشروط القانونية والتجارية" : "Commercial Legal Terms"}</span>
          </div>

          {/* Page Heading */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            <span>{isRTL ? "الشروط " : "Terms & "}</span>
            <span className="text-gradient-gold-animated">{isRTL ? "والأحكام" : "Conditions"}</span>
          </h1>

          {/* Subtitle / Meta Info */}
          <p className="font-subheading text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
            {isRTL
              ? "الشروط والأحكام التجارية القياسية الحاكمة لكافة عقود توريد وتداول المواد الكيميائية والاستشارات البيئية لشركة ليلا جلف ش.م.ح."
              : "Standard commercial terms governing chemical sales, international Incoterms, specifications, Certificates of Analysis (COA), and business contracts with Leela Gulf F.Z.C."}
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-400 font-subheading pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gold-main" />
              <span>{isRTL ? "ليلا جلف ش.م.ح - منطقة عجمان الحرة" : "Leela Gulf F.Z.C. - Ajman Free Zone, UAE"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-main" />
              <span>{isRTL ? `آخر تحديث: ${lastUpdated}` : `Last Updated: ${lastUpdated}`}</span>
            </span>
          </div>
        </div>

        {/* ── MAIN CONTENT TWO-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ── LEFT / NAVIGATION SIDEBAR (Desktop Sticky) ── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[var(--color-card-dark)]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
              <h3 className="font-heading font-bold text-sm text-gold-main uppercase tracking-wider mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
                <span>{isRTL ? "بنود الاتفاقية" : "Agreement Sections"}</span>
                <FileText className="w-4 h-4 text-gold-light" />
              </h3>

              <nav className="space-y-1.5 font-subheading text-xs sm:text-sm">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveSection(sec.id)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-gold-main/15 text-gold-light font-bold border border-gold-main/40"
                          : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? "text-gold-light" : "text-gray-400 group-hover:text-gold-main"
                        }`}
                      />
                      <span className="truncate">{sec.title}</span>
                    </a>
                  );
                })}
              </nav>

              {/* Commercial Inquiries Box */}
              <div className="mt-6 pt-5 border-t border-white/10 bg-gradient-to-br from-gold-main/10 to-transparent p-4 rounded-xl border border-gold-main/20">
                <div className="flex items-center gap-2 text-gold-light text-xs font-bold uppercase tracking-wider mb-1.5">
                  <HelpCircle className="w-4 h-4 text-gold-main" />
                  <span>{isRTL ? "استفسار تعاقدي؟" : "Contractual Inquiry?"}</span>
                </div>
                <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                  {isRTL
                    ? "هل تحتاج إلى شروط تعاقد خاصة أو اتفاقيات توريد طويلة الأجل؟ تواصل مع قسم العقود لدينا."
                    : "Need customized supply agreements, annual rate contracts, or special Incoterms terms? Contact our trade desk."}
                </p>
                <a
                  href="mailto:info@leelagulf.com"
                  className="inline-flex items-center gap-2 text-xs font-heading font-bold text-gold-light hover:text-white transition-colors"
                >
                  <span>info@leelagulf.com</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                </a>
              </div>
            </div>
          </aside>

          {/* ── RIGHT / DETAILED CLAUSES CARDS ── */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-32 bg-[var(--color-card-dark)]/90 backdrop-blur-md border border-white/10 hover:border-gold-main/30 rounded-2xl p-6 sm:p-8 shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3.5 mb-5 pb-3 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-gold-main/15 border border-gold-main/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-gold-light" />
                    </div>
                    <h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-white tracking-wide">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="space-y-3.5 font-subheading text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {sec.content.map((paragraph, pIdx) => (
                      <p key={pIdx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-main shrink-0 mt-2" />
                        <span className="flex-1">{paragraph}</span>
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Bottom Navigation Link to Privacy Policy */}
            <div className="bg-gradient-to-r from-gold-main/15 via-gold-main/5 to-transparent border border-gold-main/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-heading font-bold text-base text-white mb-1">
                  {isRTL ? "سياسة الخصوصية وحماية البيانات" : "Privacy & Data Protection Policy"}
                </h4>
                <p className="text-xs text-gray-300">
                  {isRTL
                    ? "تعرف على كيفية حماية وإدارة بياناتك وسجلاتك التجارية لدى ليلا جلف."
                    : "Discover how we safeguard your commercial data and information security."}
                </p>
              </div>
              <Link
                href="/privacy-policy"
                className="btn-gold-primary px-5 py-2.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
              >
                <span>{isRTL ? "عرض سياسة الخصوصية" : "View Privacy Policy"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
