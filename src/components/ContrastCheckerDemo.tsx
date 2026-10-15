"use client";

import React, { useState } from "react";

// Accurate WCAG 2.2 Luminance and Contrast Ratio calculation
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

function calculateContrast(fgHex: string, bgHex: string): number {
  const fg = hexToRgb(fgHex);
  const bg = hexToRgb(bgHex);
  if (!fg || !bg) return 1;

  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

const PALETTE_PRESETS = [
  { name: "AccessAble Ivory & Deep Indigo", fg: "#1E1B4B", bg: "#FAF7F2", label: "Brand Primary" },
  { name: "Lavender Tint & Deep Violet", fg: "#3B0764", bg: "#EDE9FE", label: "Brand Accent" },
  { name: "Mint Foam & Deep Pine", fg: "#064E3B", bg: "#D1FAE5", label: "Success State" },
  { name: "Peach Glow & Deep Stone", fg: "#292524", bg: "#FFEDD5", label: "Warm Warning" },
  { name: "Low Contrast Barrier (FAIL Demo)", fg: "#94A3B8", bg: "#FFFFFF", label: "Common Web Flaw" },
];

import { useMascot } from "@/context/MascotContext";

export default function ContrastCheckerDemo() {
  const { triggerEvent } = useMascot();
  const [fgColor, setFgColor] = useState("#1E1B4B");
  const [bgColor, setBgColor] = useState("#FAF7F2");

  const ratio = calculateContrast(fgColor, bgColor);
  const formattedRatio = ratio.toFixed(2);

  const normalAaPass = ratio >= 4.5;
  const normalAaaPass = ratio >= 7.0;
  const largeAaPass = ratio >= 3.0;
  const largeAaaPass = ratio >= 4.5;

  const handleSelectPreset = (preset: (typeof PALETTE_PRESETS)[0]) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);

    const testRatio = calculateContrast(preset.fg, preset.bg);
    if (testRatio >= 7.0) {
      triggerEvent(
        "fix_applied",
        `Fantastic fix! ${preset.name} passed WCAG AAA at ${testRatio.toFixed(1)}:1 ratio! 🎉`
      );
    } else if (testRatio < 4.5) {
      triggerEvent(
        "scan_complete_issues",
        "That low-contrast grey is hard for low-vision users to read. No worries! Let's fix these together 💜"
      );
    }
  };

  return (
    <section
      id="contrast-tool"
      className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-stone-200/80"
      aria-labelledby="contrast-tool-headline"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block rounded-full bg-orange-100 border border-orange-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-orange-900 mb-3">
            Interactive Accessibility Mini-Tool
          </span>
          <h2
            id="contrast-tool-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight"
          >
            Live WCAG 2.2 Contrast Calculator
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-stone-600">
            Real mathematical luminance calculation. Test color combinations in real time to guarantee reading comfort for low-vision users and mobile citizens in outdoor glare.
          </p>
        </div>

        {/* Main Interactive Tool Container */}
        <div className="rounded-3xl border-2 border-stone-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-stone-200/50">
          
          {/* Quick Presets Bar */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 block">
              Quick Test Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PALETTE_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 px-3.5 py-1.5 text-xs font-bold text-stone-800 transition-all active:scale-95 cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Controls: Color Pickers */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {/* Foreground (Text) Picker */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
                <label htmlFor="fg-color" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Foreground (Text Color)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="fg-color"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-11 w-11 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    aria-label="Foreground hex color"
                    className="flex-1 font-mono text-sm font-bold text-stone-900 uppercase rounded-xl border border-stone-300 bg-white px-3 py-2.5 focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Background Picker */}
              <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
                <label htmlFor="bg-color" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-11 w-11 rounded-xl border border-stone-300 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    aria-label="Background hex color"
                    className="flex-1 font-mono text-sm font-bold text-stone-900 uppercase rounded-xl border border-stone-300 bg-white px-3 py-2.5 focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ratio Score Hero */}
              <div className="rounded-2xl border-2 border-purple-200 bg-purple-50/50 p-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                    Calculated Contrast Ratio
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-purple-950 font-mono mt-0.5">
                    {formattedRatio}:1
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${
                      normalAaPass
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-rose-100 text-rose-900 border border-rose-300"
                    }`}
                  >
                    {normalAaPass ? "✓ WCAG AA Pass" : "✕ Fails WCAG"}
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Live Visual Preview Canvas & Pass/Fail Matrix */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              
              {/* Dynamic Contrast Sandbox Card */}
              <div
                className="rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-inner flex flex-col justify-between transition-colors min-h-[220px]"
                style={{ backgroundColor: bgColor, color: fgColor }}
              >
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest opacity-80">
                    Sample Public Notice Preview
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 mb-2">
                    Civic Digital Service Title
                  </h3>
                  <p className="text-sm sm:text-base font-medium leading-relaxed opacity-95 max-w-lg">
                    This sample paragraph demonstrates legibility for residents checking vaccine schedules, renewing library books, or reviewing transit maps.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-current/20 flex items-center justify-between text-xs font-bold opacity-90">
                  <span>Standard Body Font (16px / Regular)</span>
                  <span>Header Font (24px / Bold)</span>
                </div>
              </div>

              {/* WCAG Compliance Matrix Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                
                {/* Normal AA */}
                <div
                  className={`rounded-2xl p-3 border ${
                    normalAaPass
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-rose-300 bg-rose-50 text-rose-950"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Normal Text AA
                  </span>
                  <span className="text-lg font-black block mt-0.5">
                    {normalAaPass ? "PASS" : "FAIL"}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">req &ge; 4.5:1</span>
                </div>

                {/* Normal AAA */}
                <div
                  className={`rounded-2xl p-3 border ${
                    normalAaaPass
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-rose-300 bg-rose-50 text-rose-950"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Normal Text AAA
                  </span>
                  <span className="text-lg font-black block mt-0.5">
                    {normalAaaPass ? "PASS" : "FAIL"}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">req &ge; 7.0:1</span>
                </div>

                {/* Large AA */}
                <div
                  className={`rounded-2xl p-3 border ${
                    largeAaPass
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-rose-300 bg-rose-50 text-rose-950"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Large Text AA
                  </span>
                  <span className="text-lg font-black block mt-0.5">
                    {largeAaPass ? "PASS" : "FAIL"}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">req &ge; 3.0:1</span>
                </div>

                {/* Large AAA */}
                <div
                  className={`rounded-2xl p-3 border ${
                    largeAaaPass
                      ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                      : "border-rose-300 bg-rose-50 text-rose-950"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Large Text AAA
                  </span>
                  <span className="text-lg font-black block mt-0.5">
                    {largeAaaPass ? "PASS" : "FAIL"}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">req &ge; 4.5:1</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
