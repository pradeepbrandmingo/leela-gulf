"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Check, Sparkles, Factory, Pill, Shirt, ShieldAlert } from "lucide-react";

/**
 * ProductApplicationsSection - Master Production-Ready Industry Applications Showcase.
 * 100% Match to Client Reference UI Screenshots (Part 4):
 * - Outer White Container Card (#fcfcfb)
 * - Centered Section Title: "Industry Applications"
 * - Subtitle: "Commercial scalability across diverse manufacturing sectors."
 * - Centered Gold Accent Divider Line
 * - Alternating Left-to-Right / Right-to-Left Card Layout (Image Left <-> Image Right)
 * - Category Badge Pill (COSMETICS, INDUSTRIAL, MEDICAL, MANUFACTURING)
 * - Gold Checkmarks (✓) for bullet points
 * - 100% Dynamic Data Flow for N items from backend API
 * - Image onError fallback to local `/images/prodcut/dummy-product.jpg`
 * - Full LTR/RTL support for English and Arabic.
 */
export default function ProductApplicationsSection({ product: customProduct }) {
  const { isRTL } = useLanguage();
  const [failedImages, setFailedImages] = useState({});

  const defaultFallbackImg = "/images/prodcut/dummy-product.jpg";

  // Fallback Full Spec Industry Applications (Matches future Backend API payload)
  const defaultApplicationsData = {
    sectionTitle: isRTL ? "التطبيقات الصناعية" : "Industry Applications",
    subtitle: isRTL
      ? "قابلة للتوسع التجاري عبر مختلف قطاعات التصنيع."
      : "Commercial scalability across diverse manufacturing sectors.",
    applications: [
      {
        id: "app-01",
        categoryTag: isRTL ? "مستحضرات التجميل" : "COSMETICS",
        title: isRTL ? "العناية الشخصية" : "Personal Care",
        image: "https://images.unsplash.com/photo-1608248597263-00079e96047a?auto=format&fit=crop&q=80&w=1000",
        bulletPoints: isRTL
          ? [
              "مادة مضافة أساسية في الشامبو الراقي وعلاجات العناية بالشاعر الترميمية.",
              "مكون هيكلي أساسي في تركيبات العناية المتخصصة بالبشرة والفم.",
              "يستخدم على نطاق واسع في غسول الجسم، ومنظفات الوجه، ومعجون الأسنان بسبب عمله التنظيفي اللطيف.",
              "يعمل كخافض رئيسي لطيف للتوتر السطحي ومقوي للرغوة في منتجات الأطفال الرقيقة.",
            ]
          : [
              "Primary additive in high-end Shampoos and restorative Hair Care treatments.",
              "Essential structural component in specialized Skin and Oral Care formulations.",
              "Commonly utilized in body washes, facial cleansers, and toothpaste due to its mild cleansing action.",
              "Acts as a primary mild surfactant and foam booster in delicate baby products.",
            ],
      },
      {
        id: "app-02",
        categoryTag: isRTL ? "صناعي" : "INDUSTRIAL",
        title: isRTL ? "المنتجات المنزلية" : "Household Products",
        image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=1000",
        bulletPoints: isRTL
          ? [
              "مكون رئيسي في المنظفات المنزلية ومنتجات التنظيف الممتازة.",
              "يعمل بفعالية في المنظفات اللطيفة عند دمجها مع خافضات التوتر السطحي الأنيونية، مما يوفر اقتصاديات إنتاج قابلة للتوسع.",
              "يستخدم على نطاق واسع كقاعدة للصابون السائل والمنظفات عالية الكفاءة.",
            ]
          : [
              "Core ingredient in premium Household and Cleaning Products.",
              "Works effectively in gentle cleaners when combined with anionic surfactants, offering scalable production economics.",
              "Widely utilized as the base for liquid soaps and high-efficiency detergents.",
            ],
      },
      {
        id: "app-03",
        categoryTag: isRTL ? "طبي" : "MEDICAL",
        title: isRTL ? "المنتجات الصيدلانية" : "Pharmaceuticals",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1000",
        bulletPoints: isRTL
          ? [
              "يستخدم بشكل مكثف في التركيبات الموضعية التي تطلب خصائص تنظيف لطيفة وغير مخرشة.",
              "يحافظ على الفعالية دون تعطيل الحاجز الوقائي في العلاجات الجلدية السريرية.",
            ]
          : [
              "Used extensively in topical formulations requiring gentle, non-irritating cleansing properties.",
              "Maintains efficacy without barrier disruption in clinical dermatological treatments.",
            ],
      },
      {
        id: "app-04",
        categoryTag: isRTL ? "تصنيع" : "MANUFACTURING",
        title: isRTL ? "المنسوجات" : "Textiles",
        image: "https://images.unsplash.com/photo-1528458909336-e7a0adfac1d5?auto=format&fit=crop&q=80&w=1000",
        bulletPoints: isRTL
          ? [
              "يستخدم كعامل ترطيب عالي الكفاءة في جميع مراحل تصنيع المنسوجات.",
              "يعمل كعامل تشتيت حيوي في المعالجات الصناعية المعقدة للأقمشة.",
            ]
          : [
              "Employed as a highly efficient wetting agent throughout textile manufacturing.",
              "Serves as a vital dispersing agent in complex industrial fabric processing.",
            ],
      },
    ],
  };

  const p = customProduct || {};
  const appsData = p.applicationsData || defaultApplicationsData;
  const items = appsData.applications || defaultApplicationsData.applications;

  return (
    <section className="w-full bg-[var(--color-primary)] relative pb-8 sm:pb-10 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* ── MAIN WHITE ROUNDED CONTAINER CARD (#fcfcfb) ── */}
        <div className="bg-[#fcfcfb] rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 md:p-7 lg:p-8 shadow-xl border border-gray-200/60 transition-all duration-300">
          
          {/* 1. Centered Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] tracking-tight leading-tight mb-2 sm:mb-2" style={{ fontWeight: 700 }}>
              {appsData.sectionTitle}
            </h2>
            
            <p className="font-subheading text-xs sm:text-xs md:text-sm text-gray-500 font-normal leading-relaxed mb-3">
              {appsData.subtitle}
            </p>
            
            {/* Centered Gold Accent Divider Line */}
            <div className="w-12 sm:w-16 h-1 bg-gradient-gold-animated rounded-full mx-auto" />
          </div>

          {/* 2. Alternating Cards List (Image Left <-> Image Right) */}
          <div className="space-y-5 sm:space-y-6">
            {items.map((item, idx) => {
              const currentImg = failedImages[idx] ? defaultFallbackImg : item.image || defaultFallbackImg;
              const isImageLeftOnDesktop = idx % 2 === 0;

              return (
                <div
                  key={item.id || idx}
                  className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 border border-gray-200/90 hover:border-gold-main hover:shadow-xl hover:shadow-gold-main/10 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-7 lg:gap-8">
                    
                    {/* Image Column (Order 1 on mobile, alternates on desktop) */}
                    <div className={`w-full md:w-5/12 lg:w-5/12 shrink-0 order-1 ${
                      isImageLeftOnDesktop ? "md:order-1" : "md:order-2"
                    }`}>
                      <div className="relative w-full aspect-16/10 lg:aspect-4/3 max-h-[230px] sm:max-h-[260px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/60 group-hover:shadow-md transition-shadow duration-300">
                        <Image
                          src={currentImg}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          onError={() => setFailedImages((prev) => ({ ...prev, [idx]: true }))}
                        />
                      </div>
                    </div>

                    {/* Text Details Column (Order 2 on mobile, alternates on desktop) */}
                    <div className={`w-full md:w-7/12 lg:w-7/12 flex flex-col justify-center order-2 ${
                      isImageLeftOnDesktop ? "md:order-2" : "md:order-1"
                    }`}>
                      
                      {/* Category Tag Pill */}
                      {item.categoryTag && (
                        <div className="mb-2.5">
                          <span className="bg-gold-main/10 border border-gold-main/30 text-gold-main font-heading font-bold text-[11px] sm:text-xs uppercase tracking-wider px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-main" />
                            {item.categoryTag}
                          </span>
                        </div>
                      )}

                      {/* Application Title */}
                      <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-[#1a1a1a] tracking-tight mb-3 group-hover:text-gold-main transition-colors duration-300" style={{ fontWeight: 700 }}>
                        {item.title}
                      </h3>

                      {/* Bullet Points with Gold Checkmarks (✓) */}
                      {item.bulletPoints && item.bulletPoints.length > 0 && (
                        <ul className="space-y-2 sm:space-y-2.5">
                          {item.bulletPoints.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-gold-main shrink-0 mt-0.5 stroke-[2.5]" />
                              <span className="font-subheading text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed font-normal break-words">
                                {bullet}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                    </div>

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
