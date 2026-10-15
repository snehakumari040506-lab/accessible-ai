import React, { useState } from "react";
import { useMascot } from "@/context/MascotContext";
import { useTranslation } from "@/context/LanguageContext";
import LanguageSelector from "./LanguageSelector";

export default function Navbar() {
  const { activeView, setActiveView } = useMascot();
  const { t, reducedMotion, setReducedMotion, setSettingsOpen } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };

  const handleStartScanning = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveView("scanner");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-[#FAF7F2]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20 gap-3">
        
        {/* Brand Logo: AccessAble AI */}
        <button
          type="button"
          onClick={() => setActiveView("homepage")}
          className="group flex items-center gap-3 rounded-2xl p-1.5 focus-visible:ring-3 focus-visible:ring-purple-600 focus-visible:outline-none transition-transform active:scale-95 text-left cursor-pointer flex-shrink-0"
          aria-label={`${t("nav_brand_title")} - ${t("nav_brand_tagline")}`}
        >
          {/* Logo Mark: Cute Stethoscope + Heart + A11y Spark */}
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 p-0.5 shadow-md shadow-purple-600/20 group-hover:rotate-3 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white">
              <span className="text-xl" role="img" aria-hidden="true">
                🩺
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow-xs">
              ✓
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-purple-700 transition-colors">
              AccessAble<span className="text-purple-600 font-extrabold ml-1">AI</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              {t("nav_brand_tagline")}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden xl:flex items-center gap-1 rounded-full border border-stone-200 bg-white/80 p-1.5 shadow-xs backdrop-blur-sm"
          aria-label="Primary navigation"
        >
          <button
            type="button"
            onClick={() => setActiveView("scanner")}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
              activeView === "scanner"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-purple-700 hover:bg-purple-50 font-black"
            }`}
          >
            {t("nav_scanner_suite")}
          </button>
          <a
            href="#how-it-works"
            onClick={() => setActiveView("homepage")}
            className="rounded-full px-3.5 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            {t("nav_how_it_works")}
          </a>
          <a
            href="#features"
            onClick={() => setActiveView("homepage")}
            className="rounded-full px-3.5 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            {t("nav_features")}
          </a>
          <a
            href="#contrast-tool"
            onClick={() => setActiveView("homepage")}
            className="rounded-full px-3.5 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            {t("nav_contrast_tool")}
          </a>
          <a
            href="#civic-mission"
            onClick={() => setActiveView("homepage")}
            className="rounded-full px-3.5 py-2 text-sm font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            {t("nav_civic_mission")}
          </a>
        </nav>

        {/* Right CTA Actions: Indian Language Selector + Accessibility Settings + Start Scanning */}
        <div className="hidden lg:flex items-center gap-2.5">
          
          {/* Language Selector Dropdown (13 Indian Languages) */}
          <LanguageSelector />

          {/* Accessibility Settings Modal Button */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/90 hover:bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 shadow-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-600"
            title={t("nav_accessibility_settings")}
            aria-label={t("nav_accessibility_settings")}
          >
            <span role="img" aria-hidden="true" className="text-sm">
              ♿
            </span>
            <span className="hidden xl:inline">{t("nav_accessibility_settings")}</span>
            <span className="xl:hidden">A11y</span>
          </button>

          {/* Reduced Motion Toggle Helper */}
          <button
            type="button"
            onClick={toggleReducedMotion}
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              reducedMotion
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
            }`}
            title="Toggle reduced motion preference"
            aria-pressed={reducedMotion}
          >
            <span className="text-xs" aria-hidden="true">
              {reducedMotion ? "🍃" : "✨"}
            </span>
            <span className="hidden 2xl:inline">{reducedMotion ? t("nav_calm_motion") : t("nav_standard_motion")}</span>
          </button>

          {/* Start Scanning Primary Button */}
          <button
            type="button"
            onClick={handleStartScanning}
            className="relative group overflow-hidden rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 p-0.5 shadow-md shadow-purple-600/25 transition-all hover:shadow-lg hover:shadow-purple-600/35 active:scale-95 cursor-pointer flex-shrink-0"
          >
            <span className="flex items-center gap-2 rounded-full bg-purple-700 group-hover:bg-purple-800 px-4 py-2 text-xs sm:text-sm font-bold text-white transition-colors">
              <span role="img" aria-hidden="true">
                🚀
              </span>
              <span>{t("nav_start_scanning")}</span>
            </span>
          </button>
        </div>

        {/* Mobile Controls & Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSelector />
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-800 shadow-xs"
            aria-label={t("nav_accessibility_settings")}
          >
            <span>♿</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-800 shadow-xs hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-purple-600"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="text-lg">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-fade-in">
          <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
            <button
              type="button"
              onClick={() => {
                setActiveView("scanner");
                setMobileMenuOpen(false);
              }}
              className="text-left rounded-xl px-4 py-3 text-base font-bold text-purple-900 bg-purple-50"
            >
              {t("nav_scanner_suite")}
            </button>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-900"
            >
              {t("nav_how_it_works")}
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-900"
            >
              {t("nav_features")}
            </a>
            <a
              href="#contrast-tool"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-900"
            >
              {t("nav_contrast_tool")}
            </a>
            <a
              href="#civic-mission"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-900"
            >
              {t("nav_civic_mission")}
            </a>
            
            <div className="pt-3 border-t border-stone-200 flex flex-col gap-3">
              <button
                type="button"
                onClick={toggleReducedMotion}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-200 py-2.5 text-xs font-bold text-stone-700"
              >
                <span>{reducedMotion ? t("nav_calm_motion") : t("nav_standard_motion")}</span>
              </button>

              <button
                type="button"
                onClick={handleStartScanning}
                className="w-full rounded-full bg-purple-700 py-3 text-center text-sm font-bold text-white shadow-md shadow-purple-700/30"
              >
                {t("nav_start_scanning")}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

