"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  Server,
  Globe,
  UserCheck,
  Bell,
  Mail,
  ArrowRight,
  HelpCircle,
  Building2,
  Calendar,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const { isRTL } = useLanguage();
  const [activeSection, setActiveSection] = useState("overview");

  const lastUpdated = isRTL ? "يناير 2026" : "January 2026";

  const sections = isRTL
    ? [
        {
          id: "overview",
          icon: Shield,
          title: "1. نظرة عامة والنطاق",
          content: [
            "تلتزم شركة ليلا جلف ش.م.ح (Leela Gulf F.Z.C.)، المسجلة في هيئة المنطقة الحرة بعجمان، دولة الإمارات العربية المتحدة (المكتب C11F - SF9213)، بحماية خصوصية وسرية بيانات عملائها وشركائها وزوار موقعها الإلكتروني.",
            "توضح سياسة الخصوصية هذه كيفية جمع واستخدام وتخزين وحماية المعلومات الشخصية والتجارية عند استخدامك لموقعنا الإلكتروني (leelagulf.com) أو عند التواصل معنا لطلب عروض الأسعار والمواصفات الفنية للكيماويات الصناعية والمواد الفعالة الصيدلانية (APIs) وخدمات الاستشارات البيئية.",
            "تنطبق هذه السياسة على كافة المنتجات والخدمات التي تقدمها ليلا جلف ضمن دولة الإمارات العربية المتحدة وعبر شبكتنا الدولية للتوريد.",
          ],
        },
        {
          id: "collection",
          icon: Eye,
          title: "2. المعلومات التي نجمعها",
          content: [
            "المعلومات المقدمة طوعاً: تشمل الاسم، المسمى الوظيفي، اسم الشركة، البريد الإلكتروني للعمل، رقم الهاتف، البلد، وتفاصيل استفسارات الشراء أو طلبات عروض الأسعار (RFQs).",
            "البيانات التجارية والتقنية: وثائق اعتماد الموردين، المواصفات الفنية المطلوبة، شهادات التحليل (COA)، وسجلات الامتثال البيئي.",
            "بيانات التصفح التلقائية: عنوان بروتوكول الإنترنت (IP)، نوع المتصفح، نظام التشغيل، الصفحات التي تمت زيارتها، والوقت المستغرق على الموقع لتحسين تجربة المستخدم وتحليل الأداء.",
          ],
        },
        {
          id: "usage",
          icon: FileCheck,
          title: "3. كيفية استخدام بياناتك",
          content: [
            "معالجة طلبات التوريد وعروض الأسعار وتوفير أوراق بيانات سلامة المواد (MSDS) والشهادات الفنية.",
            "إدارة سلاسل الإمداد اللوجستية وعمليات الشحن والتخليص الجمركي بالتنسيق مع الجهات المعتمدة.",
            "ضمان الامتثال للوائح السلامة الكيميائية المحلية والدولية ومتطلبات هيئات حماية البيئة.",
            "إرسال التحديثات الدورية والنشرات الإخبارية الصناعية للعملاء المشتركين (مع إمكانية إلغاء الاشتراك في أي وقت).",
            "تحسين أمان الموقع ومنع الاحتيال وضمان استمرارية الخدمات الرقمية.",
          ],
        },
        {
          id: "sharing",
          icon: Server,
          title: "4. مشاركة البيانات ونقلها دولياً",
          content: [
            "شركاء التصنيع والخدمات اللوجستية: نشارك البيانات الضرورية فقط مع خطوط الشحن المعتمدة والمصانع ومختبرات الفحص لتنفيذ أوامر الشراء.",
            "الامتثال القانوني: قد نفصح عن المعلومات للجهات الحكومية أو التنظيمية في دولة الإمارات أو دول التصدير عند وجود متطلب قانوني إلزامي.",
            "النقل الدولي للبيانات: نظراً لطبيعة أعمالنا الدولية، قد يتم نقل ومعالجة البيانات بين مكاتبنا وشركائنا في الإمارات، الهند، والولايات المتحدة وفق أعلى معايير الحماية.",
            "نحن لا نبيع ولا نؤجر بياناتك الشخصية أو التجارية لأي أطراف ثالثة لأغراض تسويقية على الإطلاق.",
          ],
        },
        {
          id: "security",
          icon: Lock,
          title: "5. أمن البيانات ومدة الاحتفاظ بها",
          content: [
            "نطبق بروتوكولات أمنية تقنية وتنظيمية متقدمة تشمل التشفير (SSL/TLS) وجدران الحماية لحماية البيانات من الوصول غير المصرح به.",
            "يقتصر الوصول إلى البيانات الحساسة على الموظفين والمهندسين المخولين فقط والمقيدين باتفاقيات سرية صارمة.",
            "نحتفظ بالبيانات للمدة اللازمة لتحقيق الأغراض التجارية المنصوص عليها أو للامتثال للمتطلبات المحاسبية والتنظيمية المعمول بها في دولة الإمارات.",
          ],
        },
        {
          id: "rights",
          icon: UserCheck,
          title: "6. حقوقك وخياراتك",
          content: [
            "حق الوصول: يحق لك طلب نسخة من البيانات الشخصية المحفوظة لدينا.",
            "حق التصحيح: يمكنك طلب تعديل أو تحديث أي معلومات غير دقيقة أو غير مكتملة.",
            "حق الحذف: يمكنك طلب حذف بياناتك الشخصية متى لم يعد هناك مسوغ قانوني أو تعاقدي للاحتفاظ بها.",
            "إلغاء الاشتراك: يمكنك إلغاء الاشتراك في الرسائل الإخبارية في أي وقت من خلال رابط الإلغاء أو بمراسلتنا مباشرة.",
          ],
        },
        {
          id: "cookies",
          icon: Globe,
          title: "7. ملفات تعريف الارتباط (Cookies)",
          content: [
            "يستخدم موقعنا ملفات تعريف الارتباط الأساسية لضمان عمل وظائف التصفح وتفضيلات اللغة (العربية/الإنجليزية) بأعلى كفاءة.",
            "نستخدم أدوات تحليلية مجهولة الهوية لفهم كيفية تفاعل الزوار مع صفحات المنتجات وتحسين بنية الموقع.",
            "يمكنك التحكم في ملفات تعريف الارتباط أو تعطيلها من خلال إعدادات متصفحك في أي وقت.",
          ],
        },
        {
          id: "contact",
          icon: Mail,
          title: "8. التواصل ومسؤول الامتثال",
          content: [
            "إذا كانت لديك أي أسئلة أو استفسارات بخصوص سياسة الخصوصية أو ممارسات معالجة البيانات، يُرجى التواصل مع فريق الامتثال:",
            "البريد الإلكتروني: info@leelagulf.com",
            "العنوان: ليلا جلف ش.م.ح، منطقة عجمان الحرة، مكتب C11F - SF9213، عجمان، الإمارات العربية المتحدة",
            "الهاتف: 92746 87487 (971+)",
          ],
        },
      ]
    : [
        {
          id: "overview",
          icon: Shield,
          title: "1. Overview & Scope",
          content: [
            "Leela Gulf F.Z.C., registered with Ajman Free Zone Authority, United Arab Emirates (Office C11F - SF9213), is committed to safeguarding the privacy and confidentiality of personal and corporate data entrusted to us by our clients, suppliers, and website visitors.",
            "This Privacy Policy describes how we collect, use, process, and protect your information when you visit our website (leelagulf.com), request chemical quotations, submit technical inquiries for Active Pharmaceutical Ingredients (APIs) or LEEPOL® specialty polymers, or engage our environmental compliance consultancy.",
            "This policy applies to all products, solutions, and digital channels operated by Leela Gulf F.Z.C. globally.",
          ],
        },
        {
          id: "collection",
          icon: Eye,
          title: "2. Information We Collect",
          content: [
            "Voluntarily Provided Information: Contact name, job title, corporate entity, business email, phone number, country, and specific product or RFQ (Request for Quotation) requirements.",
            "Commercial & Technical Data: Supplier verification records, technical grade requirements, Certificates of Analysis (COA), safety data sheets (MSDS), and compliance declarations.",
            "Automated Technical Data: IP address, browser type, operating system, pages visited, session duration, and referral source collected through secure analytics to optimize platform performance and security.",
          ],
        },
        {
          id: "usage",
          icon: FileCheck,
          title: "3. How We Use Your Information",
          content: [
            "Fulfilling commercial requests, drafting proforma invoices, processing purchase orders, and supplying regulatory datasheets.",
            "Coordinating end-to-end chemical supply chain operations, maritime freight, customs documentation, and logistics tracking.",
            "Ensuring strict compliance with international chemical safety standards, environmental protocols, and CPCB/RSPCB/EIA regulations where applicable.",
            "Delivering technical market insights, product catalog updates, and corporate newsletters to subscribed users (with instant opt-out functionality).",
            "Maintaining platform security, mitigating cyber risks, and preventing fraudulent commercial activities.",
          ],
        },
        {
          id: "sharing",
          icon: Server,
          title: "4. Information Sharing & Cross-Border Transfers",
          content: [
            "Authorized Logistics & Supply Partners: We share necessary operational data exclusively with certified freight carriers, accredited chemical testing laboratories, and manufacturing facilities to execute confirmed orders.",
            "Regulatory & Statutory Authorities: We may disclose information where required by UAE law, international customs mandates, or environmental oversight agencies.",
            "Cross-Border Data Flows: Given our international trading footprint across the UAE, India, the USA, and worldwide markets, data may be securely transferred within our group infrastructure under strict protection standards.",
            "We strictly do not sell, rent, or commercialize your personal or corporate data to any third-party marketing entities.",
          ],
        },
        {
          id: "security",
          icon: Lock,
          title: "5. Data Security & Retention",
          content: [
            "We employ enterprise-grade technical and organizational safeguards including SSL/TLS encryption, secure server environments, and restricted access protocols.",
            "Access to commercial and proprietary information is strictly confined to authorized personnel bound by non-disclosure agreements.",
            "We retain personal and commercial data only for the duration necessary to satisfy the commercial purpose, fulfill warranty/regulatory obligations, or comply with statutory UAE accounting and corporate laws.",
          ],
        },
        {
          id: "rights",
          icon: UserCheck,
          title: "6. Your Legal Rights",
          content: [
            "Right of Access: You may request confirmation of whether we process your data and receive an electronic summary of relevant records.",
            "Right to Rectification: You have the right to promptly correct inaccurate or outdated corporate and contact information.",
            "Right to Erasure: You may request deletion of your information when it is no longer required for active contracts or regulatory compliance.",
            "Opt-Out: You can unsubscribe from our newsletters or technical updates at any time via the email footer link or by contacting us directly.",
          ],
        },
        {
          id: "cookies",
          icon: Globe,
          title: "7. Cookies & Web Technologies",
          content: [
            "Our website uses essential session cookies to remember your language preference (English/Arabic) and ensure core security functions.",
            "Anonymous aggregate analytics help us evaluate popular product categories, regional traffic distribution, and platform responsiveness.",
            "You can manage or disable cookie preferences via your browser settings at any time without impacting essential site browsing.",
          ],
        },
        {
          id: "contact",
          icon: Mail,
          title: "8. Contact Our Privacy Office",
          content: [
            "For inquiries regarding this Privacy Policy, data subject access requests, or regulatory queries, please contact our compliance department:",
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
      <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-gold-main/[0.03] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        {/* ── HERO HEADER BLOCK ── */}
        <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 ${isRTL ? "rtl" : "ltr"}`}>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-gold-main/30 text-gold-light text-xs font-heading font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-gold-main" />
            <span>{isRTL ? "الخصوصية والامتثال" : "Privacy & Compliance"}</span>
          </div>

          {/* Page Heading */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            <span>{isRTL ? "سياسة " : "Privacy "}</span>
            <span className="text-gradient-gold-animated">{isRTL ? "الخصوصية" : "Policy"}</span>
          </h1>

          {/* Subtitle / Meta Info */}
          <p className="font-subheading text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
            {isRTL
              ? "نلتزم في ليلا جلف ش.م.ح بحماية بياناتكم وخصوصيتكم وفق أعلى المعايير القانونية والتنظيمية في دولة الإمارات العربية المتحدة وسلاسل الإمداد العالمية."
              : "Leela Gulf F.Z.C. is dedicated to upholding the highest standards of data security, operational confidentiality, and regulatory transparency across our global chemical trading network."}
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
                <span>{isRTL ? "فهرس الأقسام" : "Table of Contents"}</span>
                <FileCheck className="w-4 h-4 text-gold-light" />
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

              {/* Quick Legal Help Banner */}
              <div className="mt-6 pt-5 border-t border-white/10 bg-gradient-to-br from-gold-main/10 to-transparent p-4 rounded-xl border border-gold-main/20">
                <div className="flex items-center gap-2 text-gold-light text-xs font-bold uppercase tracking-wider mb-1.5">
                  <HelpCircle className="w-4 h-4 text-gold-main" />
                  <span>{isRTL ? "استفسار قانوني؟" : "Legal Questions?"}</span>
                </div>
                <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                  {isRTL
                    ? "تواصل مباشرة مع مكتب الامتثال القانوني لدينا للحصول على إيضاحات سريعة."
                    : "Reach out directly to our compliance desk for verification or technical queries."}
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

          {/* ── RIGHT / SECTIONS DETAILED ACCORDION/CARDS ── */}
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

            {/* Bottom Navigation Link to Terms */}
            <div className="bg-gradient-to-r from-gold-main/15 via-gold-main/5 to-transparent border border-gold-main/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-heading font-bold text-base text-white mb-1">
                  {isRTL ? "الشروط والأحكام التجارية" : "Commercial Terms & Conditions"}
                </h4>
                <p className="text-xs text-gray-300">
                  {isRTL
                    ? "اطلع على شروط التعاقد والتوريد والتسليم المعمول بها لدى ليلا جلف."
                    : "Review our standard terms governing chemical sales, freight, COAs, and contracts."}
                </p>
              </div>
              <Link
                href="/terms-and-conditions"
                className="btn-gold-primary px-5 py-2.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
              >
                <span>{isRTL ? "عرض الشروط والأحكام" : "View Terms & Conditions"}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
