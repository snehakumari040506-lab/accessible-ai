"use client";

import React, { useState } from "react";
import MascotPlaceholder from "./MascotPlaceholder";
import FloatingShapes from "./FloatingShapes";

import { useMascot } from "@/context/MascotContext";
import { useTranslation } from "@/context/LanguageContext";
import VoiceInputButton from "./voice/VoiceInputButton";

export default function HeroSection() {
  const { triggerEvent, startScanningWorkflow, isScanning } = useMascot();
  const { t } = useTranslation();
  const [inputUrl, setInputUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const PUBLIC_SERVICE_PRESETS = [
    { name: t("hero_preset_barriers"), url: "test://civic-barriers", icon: "🏛️" },
    { name: t("hero_preset_clean"), url: "test://civic-clean", icon: "✨" },
    { name: t("hero_preset_transit"), url: "https://transit.sfmta.com", icon: "🚌" },
    { name: t("hero_preset_library"), url: "https://nypl.org", icon: "📚" },
  ];

  const handlePresetClick = (presetUrl: string) => {
    setInputUrl(presetUrl);
    setErrorMessage("");
    startScanningWorkflow(presetUrl);
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputUrl.trim();

    if (!trimmed) {
      setErrorMessage("Please enter a website URL or select a civic test preset.");
      return;
    }

    if (trimmed.startsWith("test://")) {
      setErrorMessage("");
      startScanningWorkflow(trimmed);
      return;
    }

    // Basic URL validation
    let valid = false;
    let formatted = trimmed;
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = "https://" + formatted;
    }

    try {
      const parsed = new URL(formatted);
      if (parsed.hostname.includes(".") || parsed.hostname === "localhost") {
        valid = true;
      }
    } catch {
      valid = false;
    }

    if (!valid) {
      setErrorMessage("Please enter a valid website address (e.g., https://your-civic-portal.gov).");
      return;
    }

    setErrorMessage("");
    // Trigger real server-side scan & transition to scanner view with persistent robot
    startScanningWorkflow(formatted);
  };

  return (
    <section
      id="scan-section"
      className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32 bg-[#FAF7F2]"
      aria-labelledby="hero-headline"
    >
      {/* Decorative Floating Shapes & Twinkling Stars */}
      <FloatingShapes />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Civic Hackathon Badge */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-200/90 bg-white/95 px-4 py-1.5 shadow-sm backdrop-blur-md transition-all hover:scale-[1.02]">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-800 tracking-wide">
              {t("hero_badge")}
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-black text-purple-800">
              WCAG 2.2 Ready
            </span>
          </div>
        </div>

        {/* Hero Grid: Left Content + Right Mascot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Playful Rounded Typography & Scanner Input */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Main Headline */}
            <h1
              id="hero-headline"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.12]"
            >
              {t("hero_title_prefix")}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
                  {t("hero_title_highlight")}
                </span>
                {/* Soft pastel underline highlighter */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-2 left-0 h-3.5 w-full -rotate-1 rounded-full bg-amber-200/60 -z-0"
                />
              </span>
              {t("hero_title_suffix")}
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 max-w-2xl text-lg sm:text-xl font-medium text-stone-600 leading-relaxed">
              {t("hero_subtitle")}
            </p>


            {/* Interactive Scanner Box */}
            <div className="mt-8 sm:mt-10 w-full max-w-xl">
              <div className="rounded-3xl border-2 border-purple-200/90 bg-white p-3 sm:p-4 shadow-xl shadow-purple-900/5 backdrop-blur-sm transition-all focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-200/50">
                <form
                  onSubmit={handleScanSubmit}
                  noValidate
                  aria-label="Website Accessibility Scanner Form"
                  className="flex flex-col sm:flex-row gap-3 items-stretch"
                >
                  <div className="relative flex-1">
                    <label htmlFor="url-input" className="sr-only">
                      Website URL to scan for accessibility barriers
                    </label>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                      <span className="text-base" role="img" aria-hidden="true">
                        🌐
                      </span>
                    </div>
                    <input
                      id="url-input"
                      type="url"
                      value={inputUrl}
                      onChange={(e) => {
                        setInputUrl(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder={t("hero_input_placeholder")}
                      className="w-full rounded-2xl border-0 bg-stone-50 py-3.5 pl-11 pr-14 text-sm sm:text-base font-semibold text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                      aria-invalid={!!errorMessage}
                      aria-describedby={errorMessage ? "url-error" : "scanner-helper"}
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
                      <VoiceInputButton
                        onTranscript={(spokenUrl) => {
                          setInputUrl(spokenUrl);
                          if (errorMessage) setErrorMessage("");
                        }}
                        normalizeAsUrl={true}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isScanning}
                    className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 p-0.5 shadow-md shadow-purple-600/30 hover:shadow-lg hover:shadow-purple-600/40 active:scale-98 transition-all cursor-pointer disabled:opacity-80"
                  >
                    <span className="flex h-full w-full items-center justify-center gap-2 rounded-[14px] bg-purple-700 group-hover:bg-purple-800 px-6 py-3.5 text-sm sm:text-base font-black text-white transition-colors">
                      <span role="img" aria-hidden="true" className={isScanning ? "animate-spin" : ""}>
                        {isScanning ? "🌀" : "🔍"}
                      </span>
                      <span>{isScanning ? t("hero_btn_scanning") : t("hero_btn_scan")}</span>
                    </span>
                  </button>
                </form>

                {/* Error message if validation fails */}
                {errorMessage && (
                  <p
                    id="url-error"
                    role="alert"
                    className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-rose-600 pl-2"
                  >
                    <span aria-hidden="true">⚠️</span>
                    <span>{errorMessage}</span>
                  </p>
                )}

                {/* Presets / Quick Picks */}
                <div id="scanner-helper" className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-stone-500">
                    {t("hero_presets_label")}
                  </span>

                  {PUBLIC_SERVICE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handlePresetClick(preset.url)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/80 px-2.5 py-1 text-xs font-medium text-stone-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-900 transition-all active:scale-95 cursor-pointer"
                    >
                      <span aria-hidden="true">{preset.icon}</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy & Guarantee Pill */}
              <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-stone-500">
                <span className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span> No tracking cookies
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span> Free for civic & public tools
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-600 font-bold">✓</span> WCAG 2.2 AA / AAA standards
                </span>
              </div>
            </div>

            {/* Micro Stats Banner */}
            <div className="mt-10 grid grid-cols-3 gap-4 w-full max-w-lg border-t border-stone-200/80 pt-6">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-purple-700">96.3%</span>
                <span className="text-xs font-bold text-stone-600 mt-0.5">Sites with Barriers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-rose-600">1 in 4</span>
                <span className="text-xs font-bold text-stone-600 mt-0.5">Citizens with Need</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">100%</span>
                <span className="text-xs font-bold text-stone-600 mt-0.5">Digital Dignity</span>
              </div>
            </div>
          </div>

          {/* Right Column: AI Accessibility Doctor Mascot (Dr. Pip) */}
          <div className="lg:col-span-5 flex justify-center">
            <MascotPlaceholder />
          </div>

        </div>
      </div>
    </section>
  );
}
