"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { X } from "lucide-react";
import LeadEnquiryForm from "@/components/common/LeadEnquiryForm";

/* ═══════════════════════════════════════════════════════════════════════
   DUMMY DATA — Will be replaced by backend API calls
   Categories and products structured exactly as they would arrive from
   the admin dashboard (category → products relationship).
   ═══════════════════════════════════════════════════════════════════════ */

const DUMMY_CATEGORIES = [
  { id: "all", name: "All Products", nameAr: "جميع المنتجات", count: 99 },
  { id: "strong-acids", name: "Strong Acids", nameAr: "الأحماض القوية", count: 9 },
  { id: "basic-chemicals", name: "Basic Chemicals", nameAr: "المواد الكيميائية الأساسية", count: 17 },
  { id: "cosmetic-personal-care", name: "Cosmetic & Personal Care Ingredients", nameAr: "مكونات مستحضرات التجميل والعناية الشخصية", count: 10 },
  { id: "water-treatment", name: "Water Treatment Chemicals", nameAr: "كيماويات معالجة المياه", count: 11 },
  { id: "food-additives", name: "Food Additives & Excipients", nameAr: "إضافات غذائية ومواد مساعدة", count: 12 },
  { id: "inorganic-chemicals", name: "Inorganic Chemicals", nameAr: "المواد الكيميائية غير العضوية", count: 28 },
  { id: "pharma-apis", name: "Active Pharmaceutical Ingredients (APIs)", nameAr: "المكونات الصيدلانية الفعالة", count: 18 },
  { id: "food-colors", name: "Food Colors", nameAr: "ألوان غذائية", count: 42 },
  { id: "fertilizers", name: "Fertilizers", nameAr: "الأسمدة", count: 12 },
  { id: "industrial-solvents", name: "Industrial & Specialty Solvents", nameAr: "المذيبات الصناعية والتخصصية", count: 0 },
];

const DUMMY_PRODUCTS = [
  // Strong Acids
  { id: 1, title: "Hydrochloric Acid", code: "HCL-001", categoryId: "strong-acids", description: "Hydrochloric acid is a strong, highly corrosive acid used in various industrial processes.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 2, title: "Sulfuric Acid", code: "SA-002", categoryId: "strong-acids", description: "Sulfuric acid is a dense, oily liquid used as an industrial chemical and reagent.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 3, title: "Nitric Acid", code: "NA-003", categoryId: "strong-acids", description: "Nitric acid is a highly corrosive mineral acid used in fertilizer production.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 4, title: "Phosphoric Acid", code: "PA-004", categoryId: "strong-acids", description: "Phosphoric acid is used in rust removal, food flavoring, and dental applications.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 5, title: "Acetic Acid", code: "AA-005", categoryId: "strong-acids", description: "Acetic acid is a colorless organic compound widely used as a chemical reagent.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 6, title: "Formic Acid", code: "FA-006", categoryId: "strong-acids", description: "Formic acid is the simplest carboxylic acid, used in leather processing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 7, title: "Citric Acid", code: "CA-007", categoryId: "strong-acids", description: "Citric acid is a weak organic acid found in citrus fruits, widely used as a preservative.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 8, title: "Oxalic Acid", code: "OA-008", categoryId: "strong-acids", description: "Oxalic acid is a dicarboxylic acid used as a cleaning agent and mordant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 9, title: "Chromic Acid", code: "CRA-009", categoryId: "strong-acids", description: "Chromic acid is used in chrome plating and as an oxidizing agent.", image: "/images/prodcut/dummy-product.jpg" },

  // Basic Chemicals
  { id: 10, title: "Sodium Hydroxide", code: "NaOH-010", categoryId: "basic-chemicals", description: "Sodium hydroxide, also known as caustic soda, is a highly versatile alkali.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 11, title: "Calcium Carbonate", code: "CaCO3-011", categoryId: "basic-chemicals", description: "Calcium carbonate is a common substance found as chalk, limestone and marble.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 12, title: "Sodium Carbonate", code: "Na2CO3-012", categoryId: "basic-chemicals", description: "Sodium carbonate is used in glass manufacturing and as a water softener.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 13, title: "Potassium Chloride", code: "KCL-013", categoryId: "basic-chemicals", description: "Potassium chloride is a metal halide salt used in medicine and fertilizers.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 14, title: "Magnesium Oxide", code: "MGO-014", categoryId: "basic-chemicals", description: "Magnesium oxide is a white hygroscopic solid mineral used in fireproofing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 15, title: "Zinc Oxide", code: "ZNO-015", categoryId: "basic-chemicals", description: "Zinc oxide is an inorganic compound used as an additive in paints and coatings.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 16, title: "Barium Sulfate", code: "BASO4-016", categoryId: "basic-chemicals", description: "Barium sulfate is an inorganic compound used as a radiocontrast agent.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 17, title: "Titanium Dioxide", code: "TIO2-017", categoryId: "basic-chemicals", description: "Titanium dioxide is a naturally occurring oxide of titanium used as a pigment.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 18, title: "Ammonium Chloride", code: "NH4CL-018", categoryId: "basic-chemicals", description: "Ammonium chloride is an inorganic compound used as a flux in metalwork.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 19, title: "Sodium Bicarbonate", code: "NAHCO3-019", categoryId: "basic-chemicals", description: "Sodium bicarbonate, commonly known as baking soda, is a chemical compound.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 20, title: "Calcium Chloride", code: "CACL2-020", categoryId: "basic-chemicals", description: "Calcium chloride is an inorganic compound used for de-icing and dust control.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 21, title: "Ferric Chloride", code: "FECL3-021", categoryId: "basic-chemicals", description: "Ferric chloride is used in sewage treatment and circuit board production.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 22, title: "Aluminum Sulfate", code: "AL2SO4-022", categoryId: "basic-chemicals", description: "Aluminum sulfate is a chemical compound used in water purification.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 23, title: "Copper Sulfate", code: "CUSO4-023", categoryId: "basic-chemicals", description: "Copper sulfate is an inorganic compound used as a herbicide and fungicide.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 24, title: "Sodium Sulfate", code: "NA2SO4-024", categoryId: "basic-chemicals", description: "Sodium sulfate is used in detergent manufacturing and paper pulping.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 25, title: "Potassium Hydroxide", code: "KOH-025", categoryId: "basic-chemicals", description: "Potassium hydroxide is an inorganic compound used in soap manufacturing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 26, title: "Sodium Silicate", code: "NASI-026", categoryId: "basic-chemicals", description: "Sodium silicate, also known as waterglass, is used as an adhesive and sealant.", image: "/images/prodcut/dummy-product.jpg" },

  // Cosmetic & Personal Care
  { id: 27, title: "Cetyl Alcohol", code: "ELFAT-CTO", categoryId: "cosmetic-personal-care", description: "Cetyl alcohol, also known as 1-hexadecanol, is a 16-carbon fatty alcohol used.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 28, title: "Stearic Acid", code: "STA-028", categoryId: "cosmetic-personal-care", description: "Stearic acid is a saturated fatty acid used in cosmetics and candle making.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 29, title: "Glycerin", code: "GLY-029", categoryId: "cosmetic-personal-care", description: "Glycerin is a simple polyol compound used as a moisturizer in skincare.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 30, title: "Isopropyl Myristate", code: "IPM-030", categoryId: "cosmetic-personal-care", description: "Isopropyl myristate is used as an emollient and skin conditioning agent.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 31, title: "Lanolin", code: "LAN-031", categoryId: "cosmetic-personal-care", description: "Lanolin is a wax secreted by wool-bearing animals, used in skin ointments.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 32, title: "Sodium Lauryl Sulfate", code: "SLS-032", categoryId: "cosmetic-personal-care", description: "SLS is an anionic surfactant used in cleaning and hygiene products.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 33, title: "Dimethicone", code: "DMT-033", categoryId: "cosmetic-personal-care", description: "Dimethicone is a silicone-based polymer used as a skin protectant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 34, title: "Shea Butter", code: "SHB-034", categoryId: "cosmetic-personal-care", description: "Shea butter is a fat extracted from the nut, used in cosmetics and cooking.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 35, title: "Cocoa Butter", code: "COB-035", categoryId: "cosmetic-personal-care", description: "Cocoa butter is a pale-yellow edible fat extracted from cocoa beans.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 36, title: "Beeswax", code: "BWX-036", categoryId: "cosmetic-personal-care", description: "Beeswax is a natural wax produced by honey bees used in cosmetics.", image: "/images/prodcut/dummy-product.jpg" },

  // Water Treatment
  { id: 37, title: "Polyaluminum Chloride", code: "PAC-037", categoryId: "water-treatment", description: "PAC is a coagulant used in water purification and wastewater treatment.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 38, title: "Sodium Hypochlorite", code: "NAOCL-038", categoryId: "water-treatment", description: "Sodium hypochlorite is a chemical compound used as a disinfectant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 39, title: "Chlorine Gas", code: "CL2-039", categoryId: "water-treatment", description: "Chlorine gas is widely used for water disinfection and purification.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 40, title: "Activated Carbon", code: "AC-040", categoryId: "water-treatment", description: "Activated carbon is used to remove contaminants from water and air.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 41, title: "Ferrous Sulfate", code: "FESO4-041", categoryId: "water-treatment", description: "Ferrous sulfate is used in water treatment as a coagulant and flocculant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 42, title: "Calcium Hypochlorite", code: "CAOCL-042", categoryId: "water-treatment", description: "Calcium hypochlorite is used for water treatment and as a disinfectant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 43, title: "Alum", code: "ALM-043", categoryId: "water-treatment", description: "Alum is a chemical compound used as a flocculating agent in water purification.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 44, title: "Sodium Metabisulfite", code: "SMB-044", categoryId: "water-treatment", description: "Sodium metabisulfite is used as a disinfectant and antioxidant in water treatment.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 45, title: "Potassium Permanganate", code: "KMNO4-045", categoryId: "water-treatment", description: "Potassium permanganate is a strong oxidizer used in water treatment.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 46, title: "Ozone Generator Chemical", code: "OZN-046", categoryId: "water-treatment", description: "Ozone is a powerful oxidant used in advanced water treatment processes.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 47, title: "Ion Exchange Resin", code: "IER-047", categoryId: "water-treatment", description: "Ion exchange resins are polymers used in water softening and purification.", image: "/images/prodcut/dummy-product.jpg" },

  // Food Additives
  { id: 48, title: "Citric Acid Monohydrate", code: "CAM-048", categoryId: "food-additives", description: "Citric acid monohydrate is used as a flavoring and preservative in food.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 49, title: "Ascorbic Acid", code: "ASC-049", categoryId: "food-additives", description: "Ascorbic acid (Vitamin C) is used as an antioxidant in food processing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 50, title: "Sodium Benzoate", code: "NB-050", categoryId: "food-additives", description: "Sodium benzoate is a preservative used in acidic foods and beverages.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 51, title: "Maltodextrin", code: "MD-051", categoryId: "food-additives", description: "Maltodextrin is a polysaccharide used as a food additive and thickener.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 52, title: "Xanthan Gum", code: "XG-052", categoryId: "food-additives", description: "Xanthan gum is a polysaccharide used as a thickening agent in foods.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 53, title: "Potassium Sorbate", code: "PS-053", categoryId: "food-additives", description: "Potassium sorbate is the potassium salt of sorbic acid, used as a preservative.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 54, title: "CMC (Carboxymethyl Cellulose)", code: "CMC-054", categoryId: "food-additives", description: "CMC is a cellulose derivative used as a thickener and stabilizer.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 55, title: "Gelatin", code: "GEL-055", categoryId: "food-additives", description: "Gelatin is a protein obtained by boiling skin and bones, used in food production.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 56, title: "Lecithin", code: "LEC-056", categoryId: "food-additives", description: "Lecithin is a fatty substance used as an emulsifier in processed foods.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 57, title: "Pectin", code: "PEC-057", categoryId: "food-additives", description: "Pectin is a structural polysaccharide used as a gelling agent in jams.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 58, title: "Agar Agar", code: "AGA-058", categoryId: "food-additives", description: "Agar is a jelly-like substance obtained from red algae, used in food.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 59, title: "Malic Acid", code: "MA-059", categoryId: "food-additives", description: "Malic acid is an organic compound used as a flavor enhancer in food.", image: "/images/prodcut/dummy-product.jpg" },

  // Inorganic Chemicals (samples)
  { id: 60, title: "Silicon Dioxide", code: "SIO2-060", categoryId: "inorganic-chemicals", description: "Silicon dioxide is a chemical compound used in the production of glass.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 61, title: "Iron Oxide Red", code: "FE2O3-061", categoryId: "inorganic-chemicals", description: "Iron oxide red is a pigment used in paints, coatings, and construction.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 62, title: "Lead Oxide", code: "PBO-062", categoryId: "inorganic-chemicals", description: "Lead oxide is an inorganic compound used in battery manufacturing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 63, title: "Zinc Sulfate", code: "ZNSO4-063", categoryId: "inorganic-chemicals", description: "Zinc sulfate is an inorganic compound used in agriculture and medicine.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 64, title: "Manganese Dioxide", code: "MNO2-064", categoryId: "inorganic-chemicals", description: "Manganese dioxide is used in dry cell batteries and as a pigment.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 65, title: "Chromium Oxide Green", code: "CR2O3-065", categoryId: "inorganic-chemicals", description: "Chromium oxide green is a pigment used in paints and ceramics.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 66, title: "Cobalt Chloride", code: "COCL2-066", categoryId: "inorganic-chemicals", description: "Cobalt chloride is used as a humidity indicator and catalyst.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 67, title: "Nickel Sulfate", code: "NISO4-067", categoryId: "inorganic-chemicals", description: "Nickel sulfate is used in electroplating and battery manufacturing.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 68, title: "Tin Chloride", code: "SNCL2-068", categoryId: "inorganic-chemicals", description: "Tin chloride is a white crystalline solid used as a reducing agent.", image: "/images/prodcut/dummy-product.jpg" },

  // Pharma APIs
  { id: 69, title: "Paracetamol", code: "PCM-069", categoryId: "pharma-apis", description: "Paracetamol is a widely used over-the-counter analgesic and antipyretic.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 70, title: "Ibuprofen", code: "IBU-070", categoryId: "pharma-apis", description: "Ibuprofen is a nonsteroidal anti-inflammatory drug used for pain relief.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 71, title: "Metformin HCL", code: "MET-071", categoryId: "pharma-apis", description: "Metformin is an oral antidiabetic drug used in the treatment of type 2 diabetes.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 72, title: "Amoxicillin Trihydrate", code: "AMX-072", categoryId: "pharma-apis", description: "Amoxicillin is a penicillin antibiotic used to treat bacterial infections.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 73, title: "Omeprazole", code: "OMP-073", categoryId: "pharma-apis", description: "Omeprazole is a proton pump inhibitor used to treat acid reflux.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 74, title: "Ciprofloxacin", code: "CIP-074", categoryId: "pharma-apis", description: "Ciprofloxacin is a broad-spectrum antibiotic used to treat infections.", image: "/images/prodcut/dummy-product.jpg" },

  // Food Colors
  { id: 75, title: "Sunset Yellow FCF", code: "E110-075", categoryId: "food-colors", description: "Sunset Yellow FCF is a synthetic food dye used in beverages and confectionery.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 76, title: "Tartrazine", code: "E102-076", categoryId: "food-colors", description: "Tartrazine is a synthetic lemon yellow azo dye used as a food colorant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 77, title: "Allura Red AC", code: "E129-077", categoryId: "food-colors", description: "Allura Red AC is a red azo dye used as a food colorant in many products.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 78, title: "Brilliant Blue FCF", code: "E133-078", categoryId: "food-colors", description: "Brilliant Blue FCF is a synthetic blue dye used in food and beverages.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 79, title: "Indigo Carmine", code: "E132-079", categoryId: "food-colors", description: "Indigo Carmine is an organic salt used as a blue food colorant.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 80, title: "Carmoisine", code: "E122-080", categoryId: "food-colors", description: "Carmoisine is a synthetic red food dye used in confectionery and drinks.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 81, title: "Ponceau 4R", code: "E124-081", categoryId: "food-colors", description: "Ponceau 4R is a synthetic red dye used in a wide variety of food products.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 82, title: "Erythrosine", code: "E127-082", categoryId: "food-colors", description: "Erythrosine is a cherry-pink synthetic dye used in food coloring.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 83, title: "Quinoline Yellow", code: "E104-083", categoryId: "food-colors", description: "Quinoline Yellow is a synthetic dye used as a greenish-yellow food colorant.", image: "/images/prodcut/dummy-product.jpg" },

  // Fertilizers
  { id: 84, title: "Urea", code: "URE-084", categoryId: "fertilizers", description: "Urea is an organic compound widely used as a nitrogen-release fertilizer.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 85, title: "DAP (Diammonium Phosphate)", code: "DAP-085", categoryId: "fertilizers", description: "DAP is one of the most popular phosphorus fertilizers in the world.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 86, title: "NPK Complex", code: "NPK-086", categoryId: "fertilizers", description: "NPK complex fertilizer contains nitrogen, phosphorus, and potassium.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 87, title: "Ammonium Nitrate", code: "AN-087", categoryId: "fertilizers", description: "Ammonium nitrate is a chemical compound used as a high-nitrogen fertilizer.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 88, title: "Potassium Sulfate", code: "K2SO4-088", categoryId: "fertilizers", description: "Potassium sulfate is a non-chloride potassium fertilizer.", image: "/images/prodcut/dummy-product.jpg" },
  { id: 89, title: "Single Super Phosphate", code: "SSP-089", categoryId: "fertilizers", description: "SSP is a fertilizer produced by the reaction of rock phosphate with acid.", image: "/images/prodcut/dummy-product.jpg" },
];

const PRODUCTS_PER_PAGE = 9;

/**
 * ProductsListing - Full product listing section with search, category filtering,
 * product cards grid (3 per row), and working pagination.
 * Data structured for seamless backend API integration.
 */
export default function ProductsListing() {
  const { isRTL } = useLanguage();

  // ── State ──
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  // ── Derived: Active Category Object ──
  const activeCategory = useMemo(
    () => DUMMY_CATEGORIES.find((c) => c.id === selectedCategory) || DUMMY_CATEGORIES[0],
    [selectedCategory]
  );

  // ── Filtered Products (search + category) ──
  const filteredProducts = useMemo(() => {
    let products = DUMMY_PRODUCTS;

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.categoryId === selectedCategory);
    }

    // Filter by search query (real-time)
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
  }, [selectedCategory, searchQuery]);

  // ── Pagination Logic ──
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, totalProducts);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // ── Handlers ──
  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategoryDropdown(false);
  }, []);

  const handlePageChange = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
        // Scroll to top of section
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [totalPages]
  );

  // ── Generate Pagination Page Numbers ──
  const getPageNumbers = useCallback(() => {
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
  }, [totalPages, currentPage]);

  return (
    <section ref={sectionRef} className="w-full bg-[var(--color-primary)] pb-10 sm:pb-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">

        {/* ═══════════════════════════════════════════
            TOP BAR: Category Title + Search + Applications Filter
            ═══════════════════════════════════════════ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">

          {/* Active Category Title */}
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl text-white shrink-0 whitespace-nowrap" style={{ fontWeight: 700 }}>
            {selectedCategory === "all" ? (
              isRTL ? (
                <>جميع <span className="text-gradient-gold-animated">المنتجات</span></>
              ) : (
                <>All <span className="text-gradient-gold-animated">Products</span></>
              )
            ) : (
              (() => {
                const name = isRTL ? activeCategory.nameAr : activeCategory.name;
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
              })()
            )}
          </h2>

          {/* Search + Applications Button Container */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">

            {/* Search Bar */}
            <div className="relative flex-1 sm:flex-none sm:w-[320px] md:w-[380px]">
              {/* Search Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-[#e8b958]/15 border border-[#e8b958]/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? "ابحث بإسم المنتج..." : "Search By Product Name..."}
                className="w-full pl-14 pr-4 py-3 bg-transparent border border-[#e8b958]/70 rounded-xl text-white text-sm font-subheading placeholder-gray-400 focus:outline-none focus:border-gold-light focus:ring-1 focus:ring-[#e8b958] transition-all duration-200"
              />
            </div>

            {/* Applications Filter Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-4 sm:px-5 py-3 border border-[#e8b958]/60 rounded-xl text-white font-heading font-bold text-sm tracking-wide hover:border-gold-light hover:text-gold-light transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                <svg className="w-4 h-4 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="14" y2="12" />
                  <line x1="4" y1="18" x2="9" y2="18" />
                </svg>
                {isRTL ? "التطبيقات" : "Applications"}
              </button>

              {/* Category Dropdown */}
              {showCategoryDropdown && (
                <div className="absolute right-0 top-full mt-2 w-[320px] sm:w-[360px] bg-[#16181f] border border-[#e8b958]/50 rounded-2xl shadow-2xl shadow-black/70 z-50 overflow-hidden animate-[fadeInUp_0.2s_ease-out]">
                  <div className="p-3 border-b border-gray-700/50">
                    <h4 className="font-heading font-bold text-sm text-gold-light uppercase tracking-wider">
                      {isRTL ? "فئات المنتجات" : "Product Categories"}
                    </h4>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    {DUMMY_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-subheading transition-all duration-200 cursor-pointer ${selectedCategory === cat.id
                            ? "bg-[#e8b958]/20 text-gold-light font-bold"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                      >
                        <span className="truncate">{isRTL ? cat.nameAr : cat.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md shrink-0 ml-2 ${selectedCategory === cat.id
                            ? "bg-[#e8b958]/30 text-gold-light"
                            : "bg-white/5 text-gray-400"
                          }`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            PRODUCT CARDS GRID (3 per row)
            ═══════════════════════════════════════════ */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
            {currentProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isRTL={isRTL} 
                categories={DUMMY_CATEGORIES} 
                onQuoteRequest={setQuoteProduct}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#c4842f]/10 border border-[#c4842f]/30 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-gold-main" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl text-white mb-2">
              {isRTL ? "لم يتم العثور على منتجات" : "No Products Found"}
            </h3>
            <p className="font-subheading text-gray-400 text-sm max-w-md">
              {isRTL
                ? "حاول تعديل البحث أو تغيير الفئة للعثور على ما تبحث عنه."
                : "Try adjusting your search or changing the category to find what you're looking for."}
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            PAGINATION
            ═══════════════════════════════════════════ */}
        {totalProducts > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-800/60">

            {/* Page Numbers */}
            <div className="flex items-center gap-1.5">
              {/* Prev Arrow */}
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
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 cursor-pointer ${currentPage === page
                        ? "bg-gradient-gold-animated text-[#1a1a1a] shadow-sm shadow-[#c4842f]/30"
                        : "border border-gray-700 text-gray-400 hover:border-gold-main hover:text-gold-main"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Arrow */}
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
            <p className="font-subheading text-sm text-gray-300">
              {isRTL ? (
                <>
                  عرض <span className="font-bold text-gold-light">{startIndex + 1}</span> إلى{" "}
                  <span className="font-bold text-gold-light">{endIndex}</span> من{" "}
                  <span className="font-bold text-gold-light">{totalProducts}+</span> منتجات تم العثور عليها
                </>
              ) : (
                <>
                  Showing <span className="font-bold text-gold-light">{startIndex + 1}</span> to{" "}
                  <span className="font-bold text-gold-light">{endIndex}</span> in{" "}
                  <span className="font-bold text-gold-light">{totalProducts}+</span> Products Found
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
            className="relative w-full max-w-4xl bg-[#0e1015] border border-[#e8b958]/50 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl shadow-black/90 max-h-[92vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300"
          >

            {/* Close Button */}
            <button
              onClick={() => setQuoteProduct(null)}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b1e2a] border border-[#2e3344] text-gray-400 hover:text-white hover:border-[#e8b958] hover:bg-[#252a3a] flex items-center justify-center transition-all cursor-pointer z-20 shadow-lg"
              aria-label="Close quote modal"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>

            {/* Modal Header Product Info Card */}
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
                <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-widest text-[#e8b958] block mb-1">
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

            {/* Master Production Lead Enquiry Form */}
            <LeadEnquiryForm
              sourcePage={`Product Listing Quote - ${quoteProduct.title}`}
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

function ProductCard({ product, isRTL, categories, onQuoteRequest }) {
  return (
    <div className="group bg-white rounded-3xl p-4 sm:p-4.5 lg:p-5 border border-gray-100 hover:border-[#c4842f]/30 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 flex flex-col justify-between">

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
          {/* Product Title */}
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

          {/* Product Code */}
          <p className="font-subheading text-xs sm:text-[12.5px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wide truncate">
            {product.code}
          </p>

          {/* Description */}
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
            className="font-heading font-bold text-[11px] sm:text-xs text-gold-main hover:text-gold-dark transition-colors duration-200 whitespace-nowrap underline underline-offset-4 decoration-[#c4842f]/60"
          >
            {isRTL ? "عرض التفاصيل" : "View Details"}
          </Link>
        </div>
      </div>

    </div>
  );
}
