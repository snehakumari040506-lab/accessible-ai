"use client";

import React, { useState } from "react";
import { useMascot } from "@/context/MascotContext";

interface FeatureDetail {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  accentColor: string;
  tagline: string;
  description: string;
  icon: string;
  tags: string[];
  sampleTitle: string;
  beforeCode: string;
  afterCode: string;
  humanImpact: string;
}

const FEATURES: FeatureDetail[] = [
  {
    id: "detect",
    badge: "01 • Automated Discovery",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    title: "Detect Barriers",
    accentColor: "border-purple-200 hover:border-purple-400 bg-white",
    tagline: "Uncover invisible obstacles across civic portals",
    description:
      "Deep automated scanning scans beyond surface markup. AccessAble AI discovers low-contrast text, missing image alternatives, inaccessible modal dialogs, broken ARIA roles, and hidden keyboard traps that lock out assistive device users.",
    icon: "🎯",
    tags: ["Color Contrast", "Keyboard Traps", "ARIA Landmarks", "Form Field Labels", "Touch Target Sizes"],
    sampleTitle: "Barrier Detection: Unlabelled Public Form Field",
    beforeCode: `<input type="text" placeholder="Enter Transit Card Number" />
<!-- ❌ Missing accessible label or aria-describedby -->`,
    afterCode: `<label for="transit-id" className="font-semibold text-stone-900">
  Transit Card Number
</label>
<input 
  id="transit-id" 
  type="text" 
  aria-required="true"
  aria-describedby="transit-hint"
  className="focus-visible:ring-2"
/>
<span id="transit-hint" className="text-xs text-stone-500">
  16-digit card number on back of card
</span>
<!-- ✅ 100% accessible to screen readers & speech input -->`,
    humanImpact: "A blind commuter using Apple VoiceOver can now independently recharge their transit pass without relying on a sighted helper."
  },
  {
    id: "understand",
    badge: "02 • Empathetic Translation",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    title: "Understand Issues",
    accentColor: "border-orange-200 hover:border-orange-400 bg-white",
    tagline: "Turn dense compliance legalese into clear human empathy",
    description:
      "WCAG 2.2 documentation can feel overwhelming. AccessAble AI translates technical rules (like 1.4.3 or 2.1.2) into plain-language diagnostic summaries, explaining who is affected, why it matters, and the exact severity level.",
    icon: "💡",
    tags: ["Plain Language AI", "Low Vision Impact", "Screen Reader Stories", "Severity Matrix", "WCAG 2.2 Mapping"],
    sampleTitle: "Issue Understanding: Insufficient Contrast (WCAG 1.4.3)",
    beforeCode: `/* ❌ Muted grey text on white background: 2.3:1 ratio */
.notice-text {
  color: #94A3B8;
  background-color: #FFFFFF;
} /* Fails WCAG AA minimum threshold of 4.5:1 */`,
    afterCode: `/* ✅ High contrast slate on white: 7.2:1 ratio (WCAG AAA) */
.notice-text {
  color: #334155;
  background-color: #FFFFFF;
} /* Readable by seniors & in bright outdoor sunlight */`,
    humanImpact: "Elderly citizens renewing their driver licenses on a phone in sunlight can now easily read renewal fee notices without squinting."
  },
  {
    id: "fix",
    badge: "03 • Confident Remediation",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    title: "Fix with Confidence",
    accentColor: "border-emerald-200 hover:border-emerald-400 bg-white",
    tagline: "Empower developers with copy-paste accessible code",
    description:
      "No guesswork. AccessAble AI provides framework-specific code snippets for React, Next.js, and HTML. Every suggested fix includes testing instructions, ensuring zero regressions and true lasting conformance.",
    icon: "🛠️",
    tags: ["React & Next.js Snippets", "Keyboard Navigation Fixes", "Inert Dialogs", "Automated Pull Requests", "Regression Tests"],
    sampleTitle: "Remediation: Accessible Modal Dialog (WCAG 2.1.2)",
    beforeCode: `// ❌ Div-based modal without focus trapping or escape key
<div className="custom-popup">
  <h2>Confirm Application</h2>
  <button onClick={submit}>Yes</button>
</div>`,
    afterCode: `// ✅ Semantic accessible dialog with keyboard trap & escape
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="dialog-title"
  onKeyDown={(e) => e.key === 'Escape' && onClose()}
  className="p-6 rounded-3xl"
>
  <h2 id="dialog-title" className="text-xl font-bold">Confirm Application</h2>
  <button ref={firstFocusableRef} onClick={submit}>Yes</button>
</div>`,
    humanImpact: "Citizens with tremors or motor impairments navigating via keyboard can smoothly complete and close modals without getting trapped."
  }
];

export default function FeaturesSection() {
  const { triggerEvent } = useMascot();
  const [activeFeatureId, setActiveFeatureId] = useState<string>("detect");
  const activeFeature = FEATURES.find((f) => f.id === activeFeatureId) || FEATURES[0];

  return (
    <section
      id="features"
      className="relative py-16 sm:py-24 bg-[#FAF7F2] border-t border-stone-200/80"
      aria-labelledby="features-headline"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="inline-block rounded-full bg-purple-100 border border-purple-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-purple-800 mb-3">
            Core Capabilities
          </span>
          <h2
            id="features-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight"
          >
            Built for civic engineers who care deeply about inclusion.
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-stone-600">
            Three interconnected pillars designed to transform public digital services from compliance headaches into joyful, barrier-free experiences.
          </p>
        </div>

        {/* 3 Main Feature Cards (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feature) => {
            const isSelected = activeFeatureId === feature.id;

            return (
              <div
                key={feature.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveFeatureId(feature.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveFeatureId(feature.id);
                  }
                }}
                className={`group relative rounded-3xl border-2 p-6 sm:p-8 transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? "border-purple-600 bg-white shadow-xl shadow-purple-900/10 ring-2 ring-purple-400/40"
                    : `${feature.accentColor} shadow-md shadow-stone-200/50 hover:shadow-lg hover:-translate-y-1`
                }`}
                aria-pressed={isSelected}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${feature.badgeColor}`}
                    >
                      {feature.badge}
                    </span>
                    <span className="text-3xl group-hover:scale-110 transition-transform" role="img" aria-hidden="true">
                      {feature.icon}
                    </span>
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-2xl font-black text-stone-900 tracking-tight mb-2">
                    {feature.title}
                  </h3>

                  {/* Tagline */}
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-3">
                    {feature.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-sm font-medium text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Feature Tags & Selection Indicator */}
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {feature.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={isSelected ? "text-purple-700" : "text-stone-500 group-hover:text-stone-900"}>
                      {isSelected ? "● Viewing Demonstration" : "Inspect Interactive Demo →"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Demonstration Drawer */}
        <div className="mt-12 rounded-3xl border-2 border-stone-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-stone-200/40">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            
            {/* Left: Explanation and Disability Impact */}
            <div className="lg:w-5/12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-800 mb-3">
                  <span>Interactive Walkthrough</span>
                  <span>•</span>
                  <span>{activeFeature.title}</span>
                </div>

                <h4 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mb-3">
                  {activeFeature.sampleTitle}
                </h4>

                <p className="text-sm text-stone-600 leading-relaxed mb-6 font-medium">
                  {activeFeature.description}
                </p>

                {/* Real-world disability empathy highlight */}
                <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base" role="img" aria-hidden="true">
                      🤝
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-rose-800">
                      Real-World Human Impact
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed">
                    &ldquo;{activeFeature.humanImpact}&rdquo;
                  </p>
                </div>
              </div>

              {/* Supported Standards */}
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-stone-500">
                <span className="rounded-full bg-stone-100 px-3 py-1">WCAG 2.2 Level AA & AAA</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">Section 508</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">EN 301 549</span>
              </div>
            </div>

            {/* Right: Before vs After Code Comparison */}
            <div className="lg:w-7/12 w-full flex flex-col gap-4">
              
              {/* Before Code (With Accessible Barrier) */}
              <div className="rounded-2xl border border-rose-200 bg-stone-900 overflow-hidden shadow-md">
                <div className="flex items-center justify-between px-4 py-2 bg-stone-950 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-rose-300">Before: Inaccessible Barrier</span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">HTML / JSX</span>
                </div>
                <pre className="p-4 text-xs font-mono text-stone-300 overflow-x-auto leading-relaxed">
                  <code>{activeFeature.beforeCode}</code>
                </pre>
              </div>

              {/* After Code (Remediated by AccessAble AI) */}
              <div className="rounded-2xl border border-emerald-300 bg-stone-900 overflow-hidden shadow-md">
                <div className="flex items-center justify-between px-4 py-2 bg-stone-950 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-300">After: AccessAble AI Remediated Fix</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">WCAG Compliant</span>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-100 overflow-x-auto leading-relaxed">
                  <code>{activeFeature.afterCode}</code>
                </pre>
              </div>

              {/* Action Button to test remediation with Mascot reaction */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    triggerEvent(
                      "fix_applied",
                      `Barrier resolved! ${activeFeature.title} remediation verified and clean! 🎉✨`
                    );
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-900 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span role="img" aria-hidden="true">🎉</span>
                  <span>Verify & Apply Accessible Fix (Mascot Celebrates)</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
