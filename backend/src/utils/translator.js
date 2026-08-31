/**
 * Universal Batch Translation Engine for Leela Gulf (English -> Arabic)
 * High-speed batch translation that handles entire product payloads in a single request.
 */

// Known chemical & industry terms
const KNOWN_TERMS = {
  "SURFACTANTS": "خافضات التوتر السطحي",
  "ANIONIC SURFACTANT": "خافض للتوتر السطحي أنيوني",
  "NON-IONIC SURFACTANT": "خافض للتوتر السطحي غير أيوني",
  "AMPHOTERIC SURFACTANT": "خافض للتوتر السطحي أمفوتيري",
  "HUMECTANT": "مرطب",
  "Industrial Chemicals": "كيماويات صناعية",
  "Water Treatment": "معالجة المياه",
  "Home Care & Personal Care (LEEPOL®)": "العناية المنزلية والشخصية (LEEPOL®)",
  "Pharmaceuticals API & Excipients": "المواد الفعالة والسواغ الدوائية",
  "Food & Beverage chemicals": "كيماويات الأغذية والمشروبات",
  "Mining & Metals": "التعدين والمعادن",
  "Oil & Gas": "النفط والغاز",
  "Textile Chemicals": "كيماويات النسيج",
  "Packaging & Paper pulp industries": "صناعات التعبئة ولب الورق",
  "Fertilizers chemicals": "كيماويات الأسمدة",
  "CASE – Coatings, Adhesives, Sealants & Elastomers": "الطلاء والمواد اللاصقة ومانعات التسرب",
  "Other": "أخرى",
};

/**
 * Translate a single raw string
 */
async function translateRaw(text, targetLang = "ar", sourceLang = "en") {
  if (!text || typeof text !== "string" || !text.trim()) return text || "";

  const trimmed = text.trim();

  // If text is pure chemical formula or code, preserve as is
  if (/^[0-9\s\-.,;:/()+#%™®©A-Z0-9]+$/i.test(trimmed) && trimmed.length < 15 && !trimmed.includes(" ")) {
    return trimmed;
  }

  // Check known terms
  if (KNOWN_TERMS[trimmed]) {
    return KNOWN_TERMS[trimmed];
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data[0])) {
      return data[0].map((item) => item[0]).join("");
    }

    return trimmed;
  } catch (error) {
    console.error("Translate raw error:", error.message);
    return trimmed;
  }
}

/**
 * Translate a single string public function
 */
export async function translateText(text, targetLang = "ar", sourceLang = "en") {
  return translateRaw(text, targetLang, sourceLang);
}

/**
 * Batch translate an array of texts by chunking
 */
export async function translateArray(arr, targetLang = "ar", sourceLang = "en") {
  if (!Array.isArray(arr) || arr.length === 0) return arr || [];

  // Filter non-empty strings
  const validItems = arr.map((item) => (typeof item === "string" ? item.trim() : ""));
  if (validItems.every((item) => !item)) return arr;

  // Process in small batches of 5 with slight delay to prevent rate limits
  const results = [];
  for (let i = 0; i < validItems.length; i += 4) {
    const chunk = validItems.slice(i, i + 4);
    const chunkResults = await Promise.all(chunk.map((item) => translateRaw(item, targetLang, sourceLang)));
    results.push(...chunkResults);
  }

  return results;
}

/**
 * Comprehensive Product Payload Translation Engine
 * Translates every single section without missing any field.
 */
export async function translateProductPayload(enPayload, targetLang = "ar") {
  if (!enPayload) return null;

  const arPayload = {};

  // 1. General & Hero Info
  arPayload.title = await translateRaw(enPayload.title || "", targetLang);
  arPayload.categoryTag = KNOWN_TERMS[enPayload.categoryTag] || await translateRaw(enPayload.categoryTag || "", targetLang);
  arPayload.primaryIndustry = KNOWN_TERMS[enPayload.primaryIndustry] || await translateRaw(enPayload.primaryIndustry || "", targetLang);
  arPayload.gradeValue = enPayload.gradeValue || "";
  arPayload.shortOverview = await translateRaw(enPayload.shortOverview || "", targetLang);

  // 2. About Section & Operational Cards
  arPayload.aboutTitle = await translateRaw(enPayload.aboutTitle || `About ${enPayload.title || "Product"}`, targetLang);
  arPayload.aboutOverview = await translateRaw(enPayload.aboutOverview || "", targetLang);
  arPayload.card1Title = await translateRaw(enPayload.card1Title || "Manufacturing Process", targetLang);
  arPayload.manufacturingProcess = await translateRaw(enPayload.manufacturingProcess || "", targetLang);
  arPayload.card2Title = await translateRaw(enPayload.card2Title || "Packaging & Logistics", targetLang);
  arPayload.packagingLogistics = await translateRaw(enPayload.packagingLogistics || "", targetLang);
  arPayload.card3Title = await translateRaw(enPayload.card3Title || "Safety & Handling", targetLang);
  arPayload.safetyHandling = await translateRaw(enPayload.safetyHandling || "", targetLang);
  arPayload.card4Title = await translateRaw(enPayload.card4Title || "Bulk Pricing & Procurement", targetLang);
  arPayload.bulkPricing = await translateRaw(enPayload.bulkPricing || "", targetLang);
  arPayload.whyChooseTitle = await translateRaw(enPayload.whyChooseTitle || "Why Choose Leela Gulf as a Trusted Supplier?", targetLang);
  arPayload.whyChooseLeela = await translateRaw(enPayload.whyChooseLeela || "", targetLang);

  // 3. Application Tags
  if (Array.isArray(enPayload.applicationTags)) {
    arPayload.applicationTags = await translateArray(enPayload.applicationTags, targetLang);
  } else {
    arPayload.applicationTags = [];
  }

  // 4. Product Features (01-05)
  if (Array.isArray(enPayload.features)) {
    const transFeats = [];
    for (const f of enPayload.features) {
      transFeats.push({
        id: f.id,
        icon: f.icon,
        title: await translateRaw(f.title || "", targetLang),
        description: await translateRaw(f.description || "", targetLang),
      });
    }
    arPayload.features = transFeats;
  } else {
    arPayload.features = [];
  }

  // 5. Industry Application Cards
  if (Array.isArray(enPayload.applicationCards)) {
    const transCards = [];
    for (const c of enPayload.applicationCards) {
      const transBullets = await translateArray(c.bullets || [], targetLang);
      transCards.push({
        id: c.id,
        industry: await translateRaw(c.industry || "", targetLang),
        badge: await translateRaw(c.badge || "", targetLang),
        imageUrl: c.imageUrl || "",
        bullets: transBullets,
      });
    }
    arPayload.applicationCards = transCards;
  } else {
    arPayload.applicationCards = [];
  }

  // 6. Frequently Asked Questions
  if (Array.isArray(enPayload.faqs)) {
    const transFaqs = [];
    for (const faq of enPayload.faqs) {
      transFaqs.push({
        id: faq.id,
        question: await translateRaw(faq.question || "", targetLang),
        answer: await translateRaw(faq.answer || "", targetLang),
      });
    }
    arPayload.faqs = transFaqs;
  } else {
    arPayload.faqs = [];
  }

  // 7. Related Products
  arPayload.relatedHeading = await translateRaw(enPayload.relatedHeading || "Related Surfactants", targetLang);
  if (Array.isArray(enPayload.relatedProducts)) {
    const transRelated = [];
    for (const rel of enPayload.relatedProducts) {
      transRelated.push({
        id: rel.id,
        categoryTag: await translateRaw(rel.categoryTag || "", targetLang),
        title: await translateRaw(rel.title || "", targetLang),
        description: await translateRaw(rel.description || "", targetLang),
        slug: rel.slug || "",
      });
    }
    arPayload.relatedProducts = transRelated;
  } else {
    arPayload.relatedProducts = [];
  }

  return arPayload;
}
