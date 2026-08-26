"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { X } from "lucide-react";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";

// 11 Master Industries List for Applications Filter Dropdown (Strictly 11 Industries - No "All Products")
export const MASTER_INDUSTRIES = [
  { id: "industrial-chemicals", name: "Industrial Chemicals", ar: "المواد الكيميائية الصناعية" },
  { id: "water-treatment", name: "Water Treatment", ar: "معالجة المياه" },
  { id: "home-care-personal-care", name: "Home Care & Personal Care (LEEPOL®)", ar: "العناية المنزلية والشخصية (LEEPOL®)" },
  { id: "pharmaceuticals-api-excipients", name: "Pharmaceuticals API & Excipients", ar: "المواد الصيدلانية الفعالة والمكونات" },
  { id: "food-beverage-chemicals", name: "Food & Beverage Chemicals", ar: "كيماويات الأغذية والمشروبات" },
  { id: "mining-metals", name: "Mining & Metals", ar: "التعدين والمعادن" },
  { id: "oil-gas", name: "Oil & Gas", ar: "النفط والغاز" },
  { id: "textile-chemicals", name: "Textile Chemicals", ar: "كيماويات النسيج" },
  { id: "packaging-paper-pulp", name: "Packaging & Paper Pulp", ar: "التغليف ولب الورق" },
  { id: "fertilizers-chemicals", name: "Fertilizers Chemicals", ar: "أسمدة ومواد كيميائية زراعية" },
  { id: "case-coatings-adhesives", name: "CASE – Coatings & Adhesives", ar: "الدهانات واللاصقات (CASE)" },
];

// Rich Master Products Dataset (7 to 8 Products Per Industry for Real Multi-Page Pagination)
export const DUMMY_PRODUCTS = [
  // 1. Industrial Chemicals (8 Products)
  { id: 101, title: "Hydrochloric Acid", code: "HCL-001", industryId: "industrial-chemicals", description: "Hydrochloric acid is a strong, highly corrosive acid used in various industrial processes.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 102, title: "Sulfuric Acid", code: "SA-002", industryId: "industrial-chemicals", description: "Sulfuric acid is a dense, oily liquid used as an industrial chemical and reagent.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 103, title: "Nitric Acid", code: "NA-003", industryId: "industrial-chemicals", description: "Nitric acid is a highly corrosive mineral acid used in fertilizer production.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 104, title: "Phosphoric Acid", code: "PA-004", industryId: "industrial-chemicals", description: "Phosphoric acid is used in rust removal, food flavoring, and chemical synthesis.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 105, title: "Acetic Acid", code: "AA-005", industryId: "industrial-chemicals", description: "Acetic acid is a colorless organic compound widely used as a chemical reagent.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 106, title: "Formic Acid", code: "FA-006", industryId: "industrial-chemicals", description: "Formic acid is the simplest carboxylic acid, used in leather processing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 107, title: "Sodium Hydroxide Flakes", code: "NaOH-010", industryId: "industrial-chemicals", description: "Caustic soda flakes used as an alkali in chemical processing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 108, title: "Linear Alkylbenzene Sulfonic Acid", code: "LABSA-96", industryId: "industrial-chemicals", description: "High-grade LABSA raw material for detergent manufacturing.", image: "/images/prodcut/dummy-product.jpg" },

  // 2. Water Treatment (8 Products)
  { id: 201, title: "Polyaluminum Chloride", code: "PAC-037", industryId: "water-treatment", description: "PAC is a coagulant used in water purification and wastewater treatment.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 202, title: "Sodium Hypochlorite", code: "NAOCL-038", industryId: "water-treatment", description: "Liquid disinfectant and oxidant used for municipal water chlorination.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 203, title: "Chlorine Gas", code: "CL2-039", industryId: "water-treatment", description: "Used for large-scale water disinfection and industrial purification.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 204, title: "Activated Carbon Pellets", code: "AC-040", industryId: "water-treatment", description: "High surface area carbon for contaminant filtration.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 205, title: "Ferrous Sulfate Heptahydrate", code: "FESO4-041", industryId: "water-treatment", description: "Used in industrial wastewater treatment for heavy metal precipitation.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 206, title: "Anionic Polyacrylamide", code: "APAM-100", industryId: "water-treatment", description: "High molecular weight polymer flocculant for sludge dewatering.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 207, title: "Calcium Hypochlorite 70%", code: "CH-070", industryId: "water-treatment", description: "Granular water treatment sanitizer and swimming pool disinfectant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 208, title: "Sodium Metabisulfite", code: "SMB-99", industryId: "water-treatment", description: "Dechlorination chemical agent for reverse osmosis membrane treatment.", image: "/images/prodcut/dummy-product.jpg" },

  // 3. Home Care & Personal Care (8 Products)
  { id: 301, title: "Sodium Lauryl Ether Sulfate", code: "SLES-70", industryId: "home-care-personal-care", description: "High-foaming anionic surfactant for shampoos and liquid cleansers.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 302, title: "Cocamidopropyl Betaine", code: "CAPB-30", industryId: "home-care-personal-care", description: "Mild amphoteric surfactant providing rich lather and skin feel.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 303, title: "LEEPOL® Carbomer 940", code: "LPL-940", industryId: "home-care-personal-care", description: "High-efficiency thickening polymer for sanitizers and topical gels.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 304, title: "Polyquaternium-7", code: "PQ7-100", industryId: "home-care-personal-care", description: "Cationic conditioning polymer for hair care and body wash products.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 305, title: "Refined Vegetable Glycerin", code: "GLY-99.5", industryId: "home-care-personal-care", description: "Pure USP grade glycerin acting as a skin humectant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 306, title: "Cetyl Stearyl Alcohol", code: "CSA-50", industryId: "home-care-personal-care", description: "Emulsifying wax and consistency factor for lotions and creams.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 307, title: "Alpha Olefin Sulfonate", code: "AOS-92", industryId: "home-care-personal-care", description: "High-foaming surfactant for liquid dishwashing and bar soaps.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 308, title: "Benzalkonium Chloride 80%", code: "BKC-80", industryId: "home-care-personal-care", description: "Cationic surfactant and disinfectant active ingredient.", image: "/images/prodcut/dummy-product.jpg" },

  // 4. Pharma APIs (7 Products)
  { id: 401, title: "Povidone (PVP K30)", code: "PVP-K30", industryId: "pharmaceuticals-api-excipients", description: "Pharma-grade tablet binder and solubilizer for oral solids.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 402, title: "Propylene Glycol USP", code: "PG-USP", industryId: "pharmaceuticals-api-excipients", description: "USP grade solvent carrier for pharmaceutical syrup formulations.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 403, title: "Microcrystalline Cellulose 102", code: "MCC-102", industryId: "pharmaceuticals-api-excipients", description: "Direct compression tablet diluent and disintegrant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 404, title: "Paracetamol API", code: "PCM-API", industryId: "pharmaceuticals-api-excipients", description: "cGMP-certified active pharmaceutical ingredient for fever and pain.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 405, title: "Metformin Hydrochloride API", code: "MET-API", industryId: "pharmaceuticals-api-excipients", description: "High purity antidiabetic active pharmaceutical ingredient.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 406, title: "Crosscarmellose Sodium", code: "CCS-USP", industryId: "pharmaceuticals-api-excipients", description: "Superdisintegrant polymer for fast dissolving oral tablets.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 407, title: "Magnesium Stearate USP", code: "MGS-USP", industryId: "pharmaceuticals-api-excipients", description: "High quality tablet lubricant for capsule filling machinery.", image: "/images/prodcut/dummy-product.jpg" },

  // 5. Food & Beverage Chemicals (7 Products)
  { id: 501, title: "Citric Acid Anhydrous", code: "CAA-100", industryId: "food-beverage-chemicals", description: "Food grade acidulant and preservative widely used in food & beverages.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 502, title: "Sodium Benzoate Food Grade", code: "SB-FOOD", industryId: "food-beverage-chemicals", description: "Food preservative preventing microbial growth in acidic drinks.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 503, title: "Xanthan Gum 80 Mesh", code: "XG-80", industryId: "food-beverage-chemicals", description: "Natural food thickener and stabilizer for sauces and bakery.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 504, title: "Potassium Sorbate Granular", code: "PS-GR", industryId: "food-beverage-chemicals", description: "Preservative extending shelf life in dairy and bakery items.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 505, title: "Food Grade Ascorbic Acid", code: "ASC-100", industryId: "food-beverage-chemicals", description: "Vitamin C antioxidant agent preventing oxidation in juices.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 506, title: "Maltodextrin DE 15-20", code: "MD-20", industryId: "food-beverage-chemicals", description: "Carbohydrate food carrier and spray-drying aid.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 507, title: "Sodium Acid Pyrophosphate", code: "SAPP-28", industryId: "food-beverage-chemicals", description: "Leavening acidulant for industrial bakery formulations.", image: "/images/prodcut/dummy-product.jpg" },

  // 6. Mining & Metals (7 Products)
  { id: 601, title: "Sodium Isopropyl Xanthate", code: "SIPX-90", industryId: "mining-metals", description: "High-activity flotation collector for sulfide mineral ore processing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 602, title: "Methyl Isobutyl Carbinol", code: "MIBC-99", industryId: "mining-metals", description: "Frothing agent ensuring stable froth formation in flotation cells.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 603, title: "Sodium Isobutyl Xanthate", code: "SIBX-90", industryId: "mining-metals", description: "Strong mineral collector for copper and gold flotation.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 604, title: "Copper Sulfate Pentahydrate", code: "CUSO4-25", industryId: "mining-metals", description: "Flotation activator reagent in mineral processing plants.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 605, title: "Flocculant Powder for Mining", code: "MPAM-90", industryId: "mining-metals", description: "Tailings thickening and liquid-solid clarification polymer.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 606, title: "Sodium Cyanide Briquettes", code: "NACN-98", industryId: "mining-metals", description: "Gold and silver extraction leaching agent.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 607, title: "Lead Nitrate Technical", code: "LN-99", industryId: "mining-metals", description: "Cyanidation accelerant for precious metal metallurgy.", image: "/images/prodcut/dummy-product.jpg" },

  // 7. Oil & Gas (7 Products)
  { id: 701, title: "Polyanionic Cellulose LV", code: "PAC-LV", industryId: "oil-gas", description: "API Spec 13A fluid loss reducer for water-based drilling muds.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 702, title: "Polyanionic Cellulose HV", code: "PAC-HV", industryId: "oil-gas", description: "Viscosifier and fluid loss control agent for deep drilling wells.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 703, title: "Xanthan Gum Oilfield Grade", code: "XG-OIL", industryId: "oil-gas", description: "Biopolymer viscosifier for horizontal drilling muds.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 704, title: "Imidazoline Corrosion Inhibitor", code: "ICI-100", industryId: "oil-gas", description: "Film-forming inhibitor protecting subsea pipelines.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 705, title: "Crude Oil Demulsifier Concentrate", code: "DEM-50", industryId: "oil-gas", description: "Effective emulsion breaker separating water from crude oil.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 706, title: "Sulfur Scavenger Triazine", code: "SST-70", industryId: "oil-gas", description: "Hydrogen sulfide scavenger for natural gas streams.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 707, title: "Pour Point Depressant", code: "PPD-10", industryId: "oil-gas", description: "Wax inhibitor improving cold flow properties of heavy crude.", image: "/images/prodcut/dummy-product.jpg" },

  // 8. Textile Chemicals (7 Products)
  { id: 801, title: "Non-Ionic Wetting Agent", code: "NWA-10", industryId: "textile-chemicals", description: "Scouring auxiliary ensuring uniform fabric dye penetration.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 802, title: "Silicone Softener Emulsion", code: "SSE-50", industryId: "textile-chemicals", description: "Finishing agent providing silky hand-feel to knitted fabrics.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 803, title: "Textile Levelling Agent", code: "TLA-100", industryId: "textile-chemicals", description: "Dyeing assistant preventing streakiness on polyester.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 804, title: "Sodium Hydrosulfite 85%", code: "SHS-85", industryId: "textile-chemicals", description: "Reducing agent for vat dyeing and denim bleaching.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 805, title: "Acetic Acid 99% Glacial", code: "GAA-99", industryId: "textile-chemicals", description: "pH buffer and acid bath agent for textile dyeing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 806, title: "Cationic Dye Fixing Agent", code: "DFA-50", industryId: "textile-chemicals", description: "Improves wash fastness of reactive dyes on cotton.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 807, title: "Acrylic Sizing Polymer", code: "ASP-30", industryId: "textile-chemicals", description: "Yarn sizing agent increasing tensile strength during weaving.", image: "/images/prodcut/dummy-product.jpg" },

  // 9. Packaging & Paper Pulp (7 Products)
  { id: 901, title: "Alkyl Ketene Dimer Wax", code: "AKD-1840", industryId: "packaging-paper-pulp", description: "Internal paper sizing agent imparting moisture resistance.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 902, title: "Cationic Polyacrylamide", code: "CPAM-10", industryId: "packaging-paper-pulp", description: "Retention and drainage aid for paper machinery.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 903, title: "Wet Strength Resin Polyamide", code: "WSR-12.5", industryId: "packaging-paper-pulp", description: "Imparts wet burst strength to packaging cartons and tissues.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 904, title: "Starch Ether Derivative", code: "SED-100", industryId: "packaging-paper-pulp", description: "Surface sizing additive improving paper printability.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 905, title: "Paper Defoamer Emulsion", code: "PDF-50", industryId: "packaging-paper-pulp", description: "Antifoam agent eliminating foam in pulp washing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 906, title: "Rosin Sizing Emulsion", code: "RSE-30", industryId: "packaging-paper-pulp", description: "Traditional sizing agent for corrugated box manufacturing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 907, title: "De-Inking Chemical Aid", code: "DIC-10", industryId: "packaging-paper-pulp", description: "Surfactant blend removing ink from recycled waste paper.", image: "/images/prodcut/dummy-product.jpg" },

  // 10. Fertilizers (7 Products)
  { id: 1001, title: "Monoammonium Phosphate", code: "MAP-61", industryId: "fertilizers-chemicals", description: "Water-soluble phosphorus fertilizer for fertigation.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1002, title: "Zinc Sulfate Monohydrate", code: "ZNSO4-36", industryId: "fertilizers-chemicals", description: "Agricultural micronutrient correcting zinc deficiency.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1003, title: "Potassium Nitrate Soluble", code: "NOP-13.5", industryId: "fertilizers-chemicals", description: "High purity nitrogen-potassium fertilizer for hydroponics.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1004, title: "Monopotassium Phosphate", code: "MKP-0-52-34", industryId: "fertilizers-chemicals", description: "Chloride-free fertilizer rich in P2O5 and K2O.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1005, title: "Chelated Iron EDTA 13%", code: "EDTA-FE", industryId: "fertilizers-chemicals", description: "Micronutrient preventing iron chlorosis in crops.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1006, title: "Magnesium Sulfate Heptahydrate", code: "MGSO4-9.8", industryId: "fertilizers-chemicals", description: "Epsom salt fertilizer boosting chlorophyll synthesis.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1007, title: "Humic Acid Granules 70%", code: "HUG-70", industryId: "fertilizers-chemicals", description: "Organic soil conditioner improving root development.", image: "/images/prodcut/dummy-product.jpg" },

  // 11. CASE (7 Products)
  { id: 1101, title: "Pure Acrylic Emulsion Resin", code: "PAR-50", industryId: "case-coatings-adhesives", description: "Water-borne binder for architectural paints and coatings.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1102, title: "Hydroxyethyl Cellulose 100K", code: "HEC-100K", industryId: "case-coatings-adhesives", description: "Rheology modifier and thickener for latex paints.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1103, title: "Styrene Acrylic Emulsion", code: "SAE-48", industryId: "case-coatings-adhesives", description: "Binder for primer coats, waterproofing, and sealants.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1104, title: "Polyurethane Thickener HEUR", code: "HEUR-200", industryId: "case-coatings-adhesives", description: "Non-ionic associative thickener for gloss paints.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1105, title: "Dispersing Agent Polycarboxylate", code: "DAP-40", industryId: "case-coatings-adhesives", description: "Pigment dispersant preventing flocculation in paints.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1106, title: "Mineral Oil Defoamer", code: "MOD-100", industryId: "case-coatings-adhesives", description: "Antifoam additive for emulsion paints and adhesives.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 1107, title: "Coalescing Solvent Texanol", code: "TEX-99", industryId: "case-coatings-adhesives", description: "Film-forming solvent agent for waterborne acrylic coatings.", image: "/images/prodcut/dummy-product.jpg" },
];

// Show 6 products per page so pagination (‹ 1 2 ›) works on every single Industry page!
const PRODUCTS_PER_PAGE = 6;

export default function IndustryProductsListing({ selectedIndustry, onIndustrySelect }) {
  const { isRTL } = useLanguage();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState(null);

  const dropdownRef = useRef(null);
  const sectionRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute REAL Product Counts for each Industry Dynamically
  const dynamicCounts = useMemo(() => {
    const counts = {};
    MASTER_INDUSTRIES.forEach((ind) => {
      counts[ind.id] = DUMMY_PRODUCTS.filter((p) => p.industryId === ind.id).length;
    });
    return counts;
  }, []);

  // Active Industry Info
  const activeIndustryInfo = useMemo(() => {
    return (
      MASTER_INDUSTRIES.find((ind) => ind.id === selectedIndustry) ||
      MASTER_INDUSTRIES[0]
    );
  }, [selectedIndustry]);

  // Filtered Products (Strictly filtered by selectedIndustry & searchQuery)
  const filteredProducts = useMemo(() => {
    let products = DUMMY_PRODUCTS.filter((p) => p.industryId === selectedIndustry);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return products;
  }, [selectedIndustry, searchQuery]);

  // Pagination Logic
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedIndustry, searchQuery]);

  // Handlers
  const handleSelect = (indId) => {
    onIndustrySelect(indId);
    setShowCategoryDropdown(false);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section ref={sectionRef} className="w-full bg-[var(--color-primary)] pb-10 sm:pb-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ═══════════════════════════════════════════
            TOP BAR: Clean Header Layout (Prevents Long Title Wrapping Bugs)
            ═══════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">

          {/* Active Industry Title */}
          <h2
            className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-white max-w-full lg:max-w-[55%] leading-tight tracking-tight"
            style={{ fontWeight: 700 }}
          >
            {(() => {
              const name = isRTL ? activeIndustryInfo.nameAr : activeIndustryInfo.name;
              const words = name.split(" ");
              if (words.length > 1) {
                return (
                  <>
                    {words.slice(0, -1).join(" ")}{" "}
                    <span className="text-gradient-gold-animated">{words[words.length - 1]}</span>
                  </>
                );
              }
              return <span className="text-gradient-gold-animated">{name}</span>;
            })()}
          </h2>

          {/* Search + Applications Dropdown Container */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto shrink-0">

            {/* Search Input Bar */}
            <div className="relative flex-1 sm:flex-none sm:w-[280px] md:w-[340px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md bg-gold-light/15 border border-gold-light/50 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? "ابحث بإسم المنتج..." : "Search By Product Name..."}
                className="w-full pl-12 pr-4 py-2.5 bg-transparent border border-gold-main/50 rounded-xl text-white text-xs sm:text-sm font-subheading placeholder-gray-400 focus:outline-none focus:border-gold-light focus:ring-1 focus:ring-gold-light transition-all duration-200"
              />
            </div>

            {/* Applications Filter Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gold-main/50 bg-transparent text-white font-heading font-bold text-xs sm:text-sm hover:border-gold-light hover:bg-gold-light/10 transition-all duration-200 cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="16" y2="12" />
                  <line x1="4" y1="18" x2="12" y2="18" />
                </svg>
                <span>{isRTL ? "التطبيقات" : "Applications"}</span>
              </button>

              {/* FLOATING DARK APPLICATIONS DROPDOWN */}
              {showCategoryDropdown && (
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-[290px] sm:w-[330px] bg-[#11131a] border border-gold-light/50 rounded-2xl p-3.5 shadow-2xl z-40 animate-[fadeIn_0.15s_ease-out]">
                  <div className="text-[10px] sm:text-[11px] font-heading font-bold text-gold-light uppercase tracking-widest px-2.5 py-1.5 border-b border-gray-800 mb-2">
                    {isRTL ? "القطاعات الصناعية" : "INDUSTRIES / APPLICATIONS"}
                  </div>

                  <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1 border-t border-transparent scrollbar-thin scrollbar-thumb-gold-main/40">
                    {MASTER_INDUSTRIES.map((ind) => {
                      const isSelected = selectedIndustry === ind.id;
                      const realCount = dynamicCounts[ind.id] || 0;
                      return (
                        <button
                          key={ind.id}
                          type="button"
                          onClick={() => handleSelect(ind.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-subheading transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#252836] text-gold-light font-bold border border-gold-main/40"
                              : "text-gray-300 hover:bg-[#1a1d28] hover:text-white"
                          }`}
                        >
                          <span className="truncate pr-2">{isRTL ? ind.nameAr : ind.name}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                            isSelected ? "bg-gold-main/20 text-gold-light font-bold" : "bg-gray-800 text-gray-400"
                          }`}>
                            {realCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════
            PRODUCT CARDS GRID (Exact Horizontal Card Layout 1-to-1)
            ═══════════════════════════════════════════ */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isRTL={isRTL}
                onQuoteRequest={setQuoteProduct}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center bg-white/5 rounded-3xl border border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-gold-main/10 border border-gold-main/30 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gold-main" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-lg text-white mb-1.5">
              {isRTL ? "لم يتم العثور على منتجات" : "No Products Available"}
            </h3>
            <p className="font-subheading text-gray-400 text-xs sm:text-sm max-w-md">
              {isRTL
                ? "حاول اختيار قطاع صناعي آخر لعرض المنتجات المتاحة."
                : "Try selecting a different industrial category to view available chemical products."}
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            WORKING PAGINATION (Multi-Page Navigation Enabled)
            ═══════════════════════════════════════════ */}
        {totalProducts > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800/60">

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border border-gray-700 text-gray-400 hover:border-gold-main hover:text-gold-main disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                aria-label="Previous page"
              >
                ‹
              </button>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-gray-500 text-sm">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 cursor-pointer ${
                      currentPage === page
                        ? "bg-gradient-gold-animated text-[#1a1a1a] shadow-sm shadow-gold-main/30 font-bold"
                        : "border border-gray-700 text-gray-400 hover:border-gold-main hover:text-gold-main"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border border-gray-700 text-gray-400 hover:border-gold-main hover:text-gold-main disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
                aria-label="Next page"
              >
                ›
              </button>
            </div>

            {/* Products Count Info */}
            <p className="font-subheading text-xs sm:text-sm text-gray-300">
              {isRTL ? (
                <>
                  عرض <span className="font-bold text-gold-light">{startIndex + 1}</span> إلى{" "}
                  <span className="font-bold text-gold-light">{endIndex}</span> من{" "}
                  <span className="font-bold text-gold-light">{totalProducts}</span> منتجات
                </>
              ) : (
                <>
                  Showing <span className="font-bold text-gold-light">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-gold-light">{endIndex}</span> of{" "}
                  <span className="font-bold text-gold-light">{totalProducts}</span> products
                </>
              )}
            </p>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════
          REQUEST QUOTE POPUP MODAL
          ═══════════════════════════════════════════ */}
      {quoteProduct && (
        <div
          onClick={() => setQuoteProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#0e1015] border border-gold-light/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300"
          >
            <button
              onClick={() => setQuoteProduct(null)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e2a] border border-[#2e3344] text-gray-400 hover:text-white hover:border-gold-light hover:bg-[#252a3a] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>

            <div className="mb-6 bg-[#161822] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 shadow-lg relative overflow-hidden">
              <div className="w-1.5 h-12 bg-gradient-gold-animated rounded-full shrink-0" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#1d202d] border border-[#33394a] overflow-hidden shrink-0 shadow-md">
                <Image
                  src={quoteProduct.image}
                  alt={quoteProduct.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="pr-8">
                <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-gold-light block mb-1">
                  {isRTL ? "طلب عرض سعر للمنتج" : "Request Product Quote"}
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-2xl text-white leading-tight">
                  {quoteProduct.title}
                </h3>
                <p className="font-subheading text-xs sm:text-sm text-gray-400 mt-0.5">
                  {quoteProduct.code}
                </p>
              </div>
            </div>

            <LeadEnquiryForm
              sourcePage={`Industry Quote - ${quoteProduct.title}`}
              productName={quoteProduct.title}
              showHeading={false}
              isModal={true}
            />
          </div>
        </div>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// PRODUCT CARD COMPONENT (Matches ProductsListing 1-to-1 Horizontal Layout)
// ═══════════════════════════════════════════════════════════════════════
function ProductCard({ product, isRTL, onQuoteRequest }) {
  return (
    <div className="group bg-white rounded-3xl p-4 sm:p-4.5 lg:p-5 border border-gray-100 hover:border-gold-main/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 flex flex-col justify-between">

      {/* Top Section: Image (Left) + Details (Right) */}
      <div className="flex flex-row items-start gap-3.5 sm:gap-4">

        {/* Left: Rounded Product Image (Clickable Link) */}
        <Link
          href={`/products/${product.id}`}
          className="relative w-[44%] sm:w-[42%] aspect-square rounded-2xl bg-[#f5f5f7] overflow-hidden shrink-0 block group/img"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 44vw, (max-width: 1024px) 20vw, 15vw"
          />
        </Link>

        {/* Right: Title, Code & Description */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3
            className="font-heading font-bold text-[15px] sm:text-base lg:text-[17px] text-[#0d0e11] leading-snug mb-0.5 truncate"
            style={{ fontWeight: 700 }}
          >
            <Link
              href={`/products/${product.id}`}
              className="hover:text-gold-main transition-colors"
            >
              {product.title}
            </Link>
          </h3>

          <p className="font-subheading text-xs sm:text-[12.5px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wide truncate">
            {product.code}
          </p>

          <p className="font-subheading text-xs sm:text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {product.description}
          </p>
        </div>
      </div>

      {/* Bottom Section: Action Buttons */}
      <div className="flex items-center gap-3.5 sm:gap-4 mt-3.5 pt-3 border-t border-gray-100">
        {/* Left Action Box (Aligned under Image) */}
        <div className="w-[44%] sm:w-[42%] shrink-0 flex items-center justify-start">
          <button
            type="button"
            onClick={() => onQuoteRequest(product)}
            className="px-3.5 sm:px-4 py-1.5 rounded-full font-heading font-bold text-[11px] sm:text-xs tracking-wide btn-gold-outline-hover whitespace-nowrap cursor-pointer"
          >
            {isRTL ? "طلب عرض سعر" : "Request Quote"}
          </button>
        </div>

        {/* Right Action Box (Aligned under Right Text Column Start) */}
        <div className="flex-1 min-w-0 flex items-center justify-start">
          <Link
            href={`/products/${product.id}`}
            className="font-heading font-bold text-[11px] sm:text-xs text-gold-main hover:text-gold-dark transition-colors duration-200 whitespace-nowrap underline underline-offset-4 decoration-gold-main/60"
          >
            {isRTL ? "عرض التفاصيل" : "View Details"}
          </Link>
        </div>
      </div>

    </div>
  );
}
