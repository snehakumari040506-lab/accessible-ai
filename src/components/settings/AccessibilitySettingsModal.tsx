"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { TextZoomLevel } from "@/types/i18n";
import LanguageSelector from "../LanguageSelector";

interface AccessibilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilitySettingsModal({
  isOpen,
  onClose,
}: AccessibilitySettingsModalProps) {
  const {
    t,
    textZoom,
    setTextZoom,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
  } = useTranslation();

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const zoomLevels: Array<{ level: TextZoomLevel; label: string; pct: string }> = [
    { level: "normal", label: t("settings_size_normal") || "Normal", pct: "100%" },
    { level: "large", label: t("settings_size_large") || "Large", pct: "125%" },
    { level: "xlarge", label: t("settings_size_xlarge") || "Extra Large", pct: "150%" },
    { level: "xxlarge", label: t("settings_size_huge") || "Maximum", pct: "200%" },
  ];

  const handleReset = () => {
    setTextZoom("normal");
    setHighContrast(false);
    setReducedMotion(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-settings-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border-2 border-stone-200 bg-white p-6 sm:p-8 shadow-2xl text-stone-900 space-y-6 animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-hidden="true">
              ♿
            </span>
            <h2
              id="accessibility-settings-title"
              className="text-xl sm:text-2xl font-black tracking-tight text-stone-900"
            >
              {t("settings_title")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-stone-100 hover:bg-stone-200 p-2 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label={t("settings_close_btn")}
          >
            ✕
          </button>
        </div>

        {/* Section 1: Text Zoom / Font Size */}
        <div className="space-y-3">
          <label className="text-sm font-black text-stone-800 flex items-center justify-between">
            <span>🔍 {t("settings_text_size")}</span>
            <span className="text-xs font-mono font-bold text-purple-700">
              {zoomLevels.find((z) => z.level === textZoom)?.pct}
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {zoomLevels.map((z) => (
              <button
                key={z.level}
                type="button"
                onClick={() => setTextZoom(z.level)}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 p-3 font-bold transition-all cursor-pointer ${
                  textZoom === z.level
                    ? "border-purple-600 bg-purple-50 text-purple-950 shadow-sm ring-2 ring-purple-200"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <span className="text-xs">{z.label}</span>
                <span className="text-[11px] font-mono text-stone-400 mt-0.5">
                  {z.pct}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: High Contrast Theme (WCAG AAA) */}
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
          <div className="space-y-0.5 pr-4">
            <span className="text-sm font-black text-stone-900 block">
              🌓 {t("settings_high_contrast")}
            </span>
            <p className="text-xs text-stone-500">
              High contrast mode with darkened backgrounds and vivid WCAG AAA accents for low-vision users.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={highContrast}
            onClick={() => setHighContrast(!highContrast)}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
              highContrast ? "bg-purple-600" : "bg-stone-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                highContrast ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Section 3: Reduced Motion */}
        <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
          <div className="space-y-0.5 pr-4">
            <span className="text-sm font-black text-stone-900 block">
              🍃 {t("settings_reduced_motion")}
            </span>
            <p className="text-xs text-stone-500">
              Calms looping 3D floats and disables bouncy animations for users sensitive to motion.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
              reducedMotion ? "bg-purple-600" : "bg-stone-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                reducedMotion ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Section 4: Indian Language Selection */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <label className="text-sm font-black text-stone-800 block">
            🇮🇳 {t("settings_select_lang")}
          </label>
          <LanguageSelector />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            🔄 {t("settings_reset_btn")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-purple-700 hover:bg-purple-800 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-purple-700/20 active:scale-95 transition-all cursor-pointer"
          >
            {t("settings_close_btn")}
          </button>
        </div>
      </div>
    </div>
  );
}
