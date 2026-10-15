"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/types/i18n";

export default function LanguageSelector() {
  const { language, setLanguage, currentLanguageMeta } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select Interface Language. Currently selected: ${currentLanguageMeta.nativeName} (${currentLanguageMeta.name})`}
        className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/90 hover:bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-800 shadow-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-600"
      >
        <span className="text-sm" role="img" aria-hidden="true">
          🇮🇳
        </span>
        <span className="font-semibold">{currentLanguageMeta.nativeName}</span>
        <span className="text-[10px] text-stone-400">({currentLanguageMeta.name})</span>
        <span className="text-[10px] text-stone-500 transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Supported Indian Languages"
          className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-stone-200 bg-white py-1.5 shadow-2xl z-50 focus:outline-none animate-fade-in"
        >
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-purple-800 border-b border-stone-100 bg-purple-50/50">
            Indian Languages (13)
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-bold text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-purple-100/70 text-purple-950 font-black"
                    : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm">{lang.nativeName}</span>
                  <span className="text-[10px] text-stone-500 font-medium">{lang.name}</span>
                </div>
                {lang.dir === "rtl" && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900">
                    RTL
                  </span>
                )}
                {isSelected && (
                  <span className="text-purple-700 font-black text-sm ml-2">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
