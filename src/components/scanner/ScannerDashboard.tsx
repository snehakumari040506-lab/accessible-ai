"use client";

import React, { useState } from "react";
import { useMascot } from "@/context/MascotContext";
import { useTranslation } from "@/context/LanguageContext";
import RobotAssistant from "../RobotAssistant";
import ScoreRing from "./ScoreRing";
import IssueCard from "./IssueCard";
import FixFirstRoadmap from "./FixFirstRoadmap";
import WebsitePreview from "./WebsitePreview";
import ReportExport from "./ReportExport";
import ScanHistoryCompare from "./ScanHistoryCompare";
import VoiceInputButton from "../voice/VoiceInputButton";
import { Severity, IssueCategory } from "@/types/scanner";

export default function ScannerDashboard() {
  const {
    activeScanResult,
    isScanning,
    scanProgressMessage,
    startScanningWorkflow,
    cancelScan,
    retryLastScan,
    scanError,
    lastScannedUrl,
    selectedFinding,
    setSelectedFinding,
    setActiveView,
  } = useMascot();

  const { t } = useTranslation();



  const [inputUrl, setInputUrl] = useState(activeScanResult?.url || "");
  const [activeTab, setActiveTab] = useState<"findings" | "roadmap" | "preview" | "history">("findings");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterReviewed, setFilterReviewed] = useState<"all" | "unresolved" | "reviewed">("all");

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    startScanningWorkflow(inputUrl.trim());
  };

  const handleScanFixture = (type: "barriers" | "clean") => {
    const fixtureUrl = type === "barriers" ? "test://civic-barriers" : "test://civic-clean";
    setInputUrl(fixtureUrl);
    startScanningWorkflow(fixtureUrl);
  };

  // Filter findings
  const filteredFindings = (activeScanResult?.findings || []).filter((f) => {
    if (selectedSeverity !== "all" && f.severity !== selectedSeverity) return false;
    if (selectedCategory !== "all" && f.category !== selectedCategory) return false;
    if (filterReviewed === "unresolved" && f.status === "reviewed") return false;
    if (filterReviewed === "reviewed" && f.status !== "reviewed") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.plainExplanation.toLowerCase().includes(q) ||
        f.wcagCriterion.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-20">
      
      {/* Top Banner & Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-stone-200/90 bg-[#FAF7F2]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Back to Home */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              type="button"
              onClick={() => setActiveView("homepage")}
              className="group flex items-center gap-2 rounded-xl p-1 text-xs font-bold text-stone-600 hover:text-purple-700 transition-colors"
            >
              <span>{t("scanner_back_home")}</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🩺</span>
              <span className="text-lg font-black text-stone-900 tracking-tight">
                AccessAble<span className="text-purple-600 ml-0.5">{t("scanner_title")}</span>
              </span>
            </div>
          </div>

          {/* Quick Rescan & URL Bar */}
          <form
            onSubmit={handleScanSubmit}
            className="flex-1 max-w-2xl w-full flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder={t("hero_input_placeholder")}
                className="w-full rounded-2xl border border-stone-300 bg-white py-2.5 pl-4 pr-12 text-xs sm:text-sm font-semibold text-stone-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <VoiceInputButton
                  onTranscript={(spokenUrl) => setInputUrl(spokenUrl)}
                  normalizeAsUrl={true}
                  size="sm"
                />
              </div>
            </div>
            {isScanning ? (
              <button
                type="button"
                onClick={cancelScan}
                className="rounded-2xl border border-rose-300 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-700 shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                ✕ {t("scanner_btn_cancel")}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isScanning}
                className="rounded-2xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-purple-700/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                {activeScanResult ? t("scanner_btn_rescan") : t("scanner_btn_scan")}
              </button>
            )}
          </form>


          {/* Fixture Quick Buttons */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-stone-400">Fixtures:</span>
            <button
              type="button"
              onClick={() => handleScanFixture("barriers")}
              className="rounded-full border border-amber-300 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900"
            >
              Barriers Demo
            </button>
            <button
              type="button"
              onClick={() => handleScanFixture("clean")}
              className="rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-900"
            >
              Clean Remediated
            </button>
          </div>

        </div>
      </div>

      {/* Main Scanner Workspace Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* =================================================================
             PERSISTENT ROBOT ASSISTANT (Dedicated Desktop Side Panel)
             ================================================================= */}
          <RobotAssistant variant="scanner-sidebar" />

          {/* =================================================================
             MAIN RESULTS WORKSPACE
             ================================================================= */}
          <main className="flex-1 w-full min-w-0 space-y-6" id="scanner-main">
            
            {/* Loading Banner with Rotating Sparkle & Cancel Button */}
            {isScanning && (
              <div className="rounded-3xl border-2 border-purple-300 bg-white p-8 text-center shadow-xl shadow-purple-900/5 space-y-4 animate-fade-in">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl animate-bounce">
                  ✨
                </div>
                <h3 className="text-xl font-black text-stone-900">
                  {t("scanner_loading_title")}
                </h3>
                <p className="text-sm font-semibold text-purple-700 animate-pulse">
                  {scanProgressMessage || t("scanner_loading_default_msg")}
                </p>
                <div className="max-w-md mx-auto h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 animate-pulse" />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={cancelScan}
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-4 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
                  >
                    <span>✕</span> {t("scanner_btn_cancel")}
                  </button>
                </div>
              </div>
            )}

            {/* Error State Banner with Retry */}
            {scanError && !isScanning && (
              <div className="rounded-3xl border-2 border-rose-200 bg-rose-50/80 p-6 sm:p-8 text-center space-y-4 animate-fade-in">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-2xl">
                  ⚠️
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-rose-950">
                    {t("scanner_error_title")}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-rose-800 max-w-xl mx-auto leading-relaxed">
                    {scanError}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {lastScannedUrl && (
                    <button
                      type="button"
                      onClick={retryLastScan}
                      className="rounded-2xl bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      🔄 {t("scanner_btn_retry")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleScanFixture("barriers")}
                    className="rounded-2xl border border-stone-300 bg-white hover:bg-stone-50 px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-800 shadow-xs transition-all cursor-pointer"
                  >
                    🏛️ Try Civic Barriers Fixture
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScanFixture("clean")}
                    className="rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-900 shadow-xs transition-all cursor-pointer"
                  >
                    ✨ Try Clean Remediated Fixture
                  </button>
                </div>
              </div>
            )}


            {/* Empty State (Before Any Scan Has Run) */}
            {!isScanning && !activeScanResult && (
              <div className="rounded-3xl border-2 border-dashed border-purple-200 bg-white p-10 text-center space-y-6">
                <span className="text-5xl block">🩺</span>
                <div className="max-w-md mx-auto space-y-2">
                  <h3 className="text-2xl font-black text-stone-900">
                    Ready to Scan for Digital Barriers
                  </h3>
                  <p className="text-sm font-medium text-stone-600 leading-relaxed">
                    Enter any public service website address above, or try one of our safe civic fixtures to inspect real WCAG 2.2 evaluations with Dr. Pip.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleScanFixture("barriers")}
                    className="rounded-full bg-purple-700 hover:bg-purple-800 text-white font-black text-xs px-5 py-2.5 shadow-md shadow-purple-700/20 active:scale-95"
                  >
                    ⚡ Test Civic Barriers Fixture (Simulate Failures)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScanFixture("clean")}
                    className="rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-black text-xs px-5 py-2.5 active:scale-95"
                  >
                    ✓ Test Clean Remediated Fixture (100% Pass)
                  </button>
                </div>
              </div>
            )}

            {/* Active Results View */}
            {!isScanning && activeScanResult && (
              <>
                {/* Results Header Card */}
                <div className="rounded-3xl border-2 border-stone-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-stone-200/40">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    
                    {/* Left: Target Info & Engine details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-purple-100 text-purple-900 font-bold px-2.5 py-0.5 text-xs">
                          Audit Completed
                        </span>
                        {activeScanResult.isTestFixture && (
                          <span className="rounded-full bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 text-xs">
                            Civic Fixture
                          </span>
                        )}
                        <span className="text-xs text-stone-400">
                          {new Date(activeScanResult.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                        {activeScanResult.pageTitle}
                      </h2>
                      <p className="text-xs sm:text-sm font-mono text-purple-800 break-all">
                        {activeScanResult.url}
                      </p>
                      <p className="text-xs text-stone-500 font-medium">
                        Engine: {activeScanResult.engine} • Scan duration: {activeScanResult.durationMs}ms
                      </p>
                    </div>

                    {/* Right: Score Ring & Report Export */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 self-center lg:self-auto">
                      <ScoreRing score={activeScanResult.score} />
                      <ReportExport scanResult={activeScanResult} />
                    </div>

                  </div>

                  {/* Severity Counts Bar */}
                  <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3 text-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block">
                        {t("sev_critical")}
                      </span>
                      <span className="text-2xl font-black text-rose-700 font-mono">
                        {activeScanResult.severityCounts.critical}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-3 text-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-800 block">
                        {t("sev_high")}
                      </span>
                      <span className="text-2xl font-black text-orange-700 font-mono">
                        {activeScanResult.severityCounts.high}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3 text-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                        {t("sev_medium")}
                      </span>
                      <span className="text-2xl font-black text-amber-700 font-mono">
                        {activeScanResult.severityCounts.medium}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-center">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 block">
                        {t("sev_low")}
                      </span>
                      <span className="text-2xl font-black text-stone-700 font-mono">
                        {activeScanResult.severityCounts.low}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs (Findings, Roadmap, Preview, History) */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
                  <div className="flex rounded-2xl bg-stone-100 p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTab("findings")}
                      className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "findings"
                          ? "bg-white text-purple-900 shadow-sm"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      🎯 {t("scanner_tab_findings")} ({activeScanResult.findings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("roadmap")}
                      className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "roadmap"
                          ? "bg-white text-purple-900 shadow-sm"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      🗺️ {t("scanner_tab_roadmap")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "preview"
                          ? "bg-white text-purple-900 shadow-sm"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      👁️ {t("scanner_tab_preview")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("history")}
                      className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        activeTab === "history"
                          ? "bg-white text-purple-900 shadow-sm"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      🔄 {t("scanner_tab_history")}
                    </button>
                  </div>

                  {/* Rescan shortcut */}
                  <button
                    type="button"
                    onClick={() => startScanningWorkflow(activeScanResult.url)}
                    className="rounded-full border border-purple-300 bg-white px-4 py-2 text-xs font-bold text-purple-800 hover:bg-purple-50 shadow-xs cursor-pointer"
                  >
                    ↻ {t("scanner_btn_rescan")}
                  </button>
                </div>

                {/* =============================================================
                   TAB 1: FINDINGS & INSPECTOR LIST
                   ============================================================= */}
                {activeTab === "findings" && (
                  <div className="space-y-4">
                    {/* Search & Filter Controls */}
                    <div className="rounded-2xl border border-stone-200 bg-white p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
                      <div className="w-full md:w-64">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search findings..."
                          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        {/* Severity filter */}
                        <select
                          value={selectedSeverity}
                          onChange={(e) => setSelectedSeverity(e.target.value)}
                          aria-label="Filter findings by severity"
                          className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-700"
                        >
                          <option value="all">{t("sev_all")}</option>
                          <option value="critical">{t("sev_critical")}</option>
                          <option value="high">{t("sev_high")}</option>
                          <option value="medium">{t("sev_medium")}</option>
                          <option value="low">{t("sev_low")}</option>
                        </select>

                        {/* Category filter */}
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          aria-label="Filter findings by category"
                          className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-700"
                        >
                          <option value="all">All Categories</option>
                          <option value="contrast">Color Contrast</option>
                          <option value="alt-text">Image Alt Text</option>
                          <option value="forms">Form Labels</option>
                          <option value="keyboard">Buttons & Keyboard</option>
                          <option value="structure">Headings & Structure</option>
                        </select>

                        {/* Reviewed status filter */}
                        <select
                          value={filterReviewed}
                          onChange={(e) => setFilterReviewed(e.target.value as "all" | "unresolved" | "reviewed")}
                          aria-label="Filter findings by reviewed status"
                          className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-700"
                        >
                          <option value="all">All Status</option>
                          <option value="unresolved">Unresolved Only</option>
                          <option value="reviewed">Reviewed Only</option>
                        </select>
                      </div>
                    </div>

                    {/* Filtered Findings List */}
                    {filteredFindings.length === 0 ? (
                      <div className="rounded-3xl border-2 border-stone-200 bg-white p-8 text-center text-stone-500">
                        <span className="text-3xl block mb-2">🔍</span>
                        <p className="font-bold">No findings match the current filter criteria.</p>
                      </div>
                    ) : (
                      filteredFindings.map((finding) => (
                        <IssueCard
                          key={finding.id}
                          finding={finding}
                          isSelected={selectedFinding?.id === finding.id}
                          onSelect={() => setSelectedFinding(finding)}
                        />
                      ))
                    )}
                  </div>
                )}

                {/* =============================================================
                   TAB 2: FIX-FIRST ROADMAP
                   ============================================================= */}
                {activeTab === "roadmap" && (
                  <FixFirstRoadmap findings={activeScanResult.findings} />
                )}

                {/* =============================================================
                   TAB 3: DOM SNAPSHOT & PREVIEW
                   ============================================================= */}
                {activeTab === "preview" && (
                  <WebsitePreview
                    scanResult={activeScanResult}
                    selectedFinding={selectedFinding}
                  />
                )}

                {/* =============================================================
                   TAB 4: RESCAN HISTORY & VERIFICATION
                   ============================================================= */}
                {activeTab === "history" && (
                  <ScanHistoryCompare />
                )}

              </>
            )}

          </main>

        </div>
      </div>

      {/* Persistent Floating Mobile Assistant */}
      <RobotAssistant variant="floating-mobile" />

    </div>
  );
}
