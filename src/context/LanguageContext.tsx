"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageMeta, TextZoomLevel } from "@/types/i18n";
import { TRANSLATIONS, TranslationKey } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: SupportedLanguage;
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLanguageMeta: LanguageMeta;
  currentLocale: string;
  isRTL: boolean;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  
  // Accessibility & Low-Vision settings
  textZoom: TextZoomLevel;
  setTextZoom: (level: TextZoomLevel) => void;
  highContrast: boolean;
  setHighContrast: (active: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (active: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [textZoom, setTextZoomState] = useState<TextZoomLevel>("normal");
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Initialize preferences from localStorage on client
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("accessable_lang") as SupportedLanguage;
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang);
      }

      const savedZoom = localStorage.getItem("accessable_text_zoom") as TextZoomLevel;
      if (savedZoom && ["normal", "large", "xlarge", "xxlarge"].includes(savedZoom)) {
        setTextZoomState(savedZoom);
      }

      const savedContrast = localStorage.getItem("accessable_high_contrast");
      if (savedContrast === "true") {
        setHighContrastState(true);
      }

      const savedMotion = localStorage.getItem("accessable_reduced_motion");
      if (savedMotion === "true" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setReducedMotionState(true);
      }
    } catch {
      // localStorage may be disabled in some sandboxes
    }
  }, []);

  const currentLanguageMeta = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const isRTL = currentLanguageMeta.dir === "rtl";
  const currentLocale = currentLanguageMeta.bcp47;

  // Sync HTML tag attributes & CSS classes whenever settings change
  useEffect(() => {
    if (typeof document === "undefined") return;

    // 1. Language & Direction
    document.documentElement.lang = currentLanguageMeta.code;
    document.documentElement.dir = currentLanguageMeta.dir;

    // 2. High Contrast Theme
    if (highContrast) {
      document.documentElement.classList.add("theme-high-contrast");
    } else {
      document.documentElement.classList.remove("theme-high-contrast");
    }

    // 3. Text Zoom Level
    document.documentElement.classList.remove(
      "text-zoom-normal",
      "text-zoom-large",
      "text-zoom-xlarge",
      "text-zoom-xxlarge"
    );
    document.documentElement.classList.add(`text-zoom-${textZoom}`);

    // 4. Reduced Motion
    if (reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }, [currentLanguageMeta, highContrast, textZoom, reducedMotion]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("accessable_lang", lang);
    } catch {
      // safe fallback
    }
  }, []);

  const setTextZoom = useCallback((level: TextZoomLevel) => {
    setTextZoomState(level);
    try {
      localStorage.setItem("accessable_text_zoom", level);
    } catch {
      // safe fallback
    }
  }, []);

  const setHighContrast = useCallback((active: boolean) => {
    setHighContrastState(active);
    try {
      localStorage.setItem("accessable_high_contrast", active ? "true" : "false");
    } catch {
      // safe fallback
    }
  }, []);

  const setReducedMotion = useCallback((active: boolean) => {
    setReducedMotionState(active);
    try {
      localStorage.setItem("accessable_reduced_motion", active ? "true" : "false");
    } catch {
      // safe fallback
    }
  }, []);

  // Translation lookup with guaranteed English fallback
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
      let text = langDict[key] || TRANSLATIONS.en[key] || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, val]) => {
          text = text.replace(new RegExp(`{${paramKey}}`, "g"), String(val));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage: language,
        setLanguage,
        currentLanguageMeta,
        currentLocale,
        isRTL,
        t,
        textZoom,
        setTextZoom,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        settingsOpen,
        setSettingsOpen,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
