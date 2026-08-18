"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/locales";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLang = localStorage.getItem("leela_lang");
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLang(savedLang);
    }
  }, []);

  // Update document direction (RTL for Arabic, LTR for English)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      localStorage.setItem("leela_lang", lang);
    }
  }, [lang]);

  const toggleLanguage = (newLang) => {
    if (newLang === "en" || newLang === "ar") {
      setLang(newLang);
    }
  };

  /**
   * Universal translation helper t(pathKey)
   * Supports dot notation like t("hero.waterTreatment") as well as direct key search.
   */
  const t = (key) => {
    const currentDict = translations[lang] || translations["en"];
    const fallbackDict = translations["en"];

    // 1. Direct key match (e.g. t("waterTreatment"))
    if (currentDict[key]) return currentDict[key];
    if (fallbackDict[key]) return fallbackDict[key];

    // 2. Dot notation match (e.g. t("hero.waterTreatment"))
    const keys = key.split(".");
    let result = currentDict;
    for (const k of keys) {
      result = result?.[k];
      if (!result) break;
    }

    if (result) return result;

    // Fallback dot notation in English
    let fallbackResult = fallbackDict;
    for (const k of keys) {
      fallbackResult = fallbackResult?.[k];
      if (!fallbackResult) break;
    }

    if (fallbackResult) return fallbackResult;

    // 3. Search inside top-level categories if passed short key
    for (const category in currentDict) {
      if (typeof currentDict[category] === "object" && currentDict[category][key]) {
        return currentDict[category][key];
      }
    }
    for (const category in fallbackDict) {
      if (typeof fallbackDict[category] === "object" && fallbackDict[category][key]) {
        return fallbackDict[category][key];
      }
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLanguage, t, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
