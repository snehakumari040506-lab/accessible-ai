"use client";

import React from "react";

const STEPS = [
  {
    number: "01",
    title: "Input Civic Service URL",
    subtitle: "No installation required",
    description:
      "Paste any municipal portal, healthcare appointment form, transit ticketing app, or public school board service to begin.",
    badge: "1-Click Intake",
    accent: "bg-purple-100 text-purple-900 border-purple-200",
    icon: "🔗",
  },
  {
    number: "02",
    title: "Multi-Modal A11y Audit",
    subtitle: "axe-core + AI inspection",
    description:
      "Our automated engine traverses the live DOM, simulating screen readers, calculating mathematical contrast ratios, and verifying keyboard focus order.",
    badge: "Automated Deep Scan",
    accent: "bg-orange-100 text-orange-900 border-orange-200",
    icon: "🔬",
  },
  {
    number: "03",
    title: "Prioritized Remediation Playbook",
    subtitle: "Developer-ready fixes",
    description:
      "Receive prioritized issues ranked by human disability impact, complete with copy-paste code snippets for React, Next.js, or plain HTML.",
    badge: "Ready-to-Merge Code",
    accent: "bg-emerald-100 text-emerald-900 border-emerald-200",
    icon: "🚀",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-stone-200/80"
      aria-labelledby="how-it-works-headline"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="inline-block rounded-full bg-emerald-100 border border-emerald-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-800 mb-3">
            Workflow Overview
          </span>
          <h2
            id="how-it-works-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight"
          >
            How AccessAble AI Works
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-stone-600">
            A frictionless three-step path from identifying hidden digital barriers to deploying certified accessible public services.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Subtle connecting line for desktop */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-1/2 left-12 right-12 h-1 -translate-y-12 border-t-2 border-dashed border-stone-300 -z-0"
          />

          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative z-10 rounded-3xl border-2 border-stone-200/90 bg-white p-6 sm:p-8 shadow-lg shadow-stone-200/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-purple-300 flex flex-col justify-between"
            >
              <div>
                {/* Step Pill & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-purple-700 font-mono">
                      {step.number}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${step.accent}`}
                    >
                      {step.badge}
                    </span>
                  </div>
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {step.icon}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mb-1">
                  {step.title}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-4">
                  {step.subtitle}
                </p>

                {/* Description */}
                <p className="text-sm font-medium text-stone-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom detail */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-semibold text-stone-500">
                <span className="text-purple-600 font-black">✓</span>
                <span>Optimized for municipal and civic portals</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Prompt */}
        <div className="mt-12 text-center">
          <a
            href="#scan-section"
            className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 hover:bg-purple-100 px-6 py-3 text-sm font-black text-purple-900 transition-all shadow-xs active:scale-95"
          >
            <span>Ready to test a website?</span>
            <span className="text-purple-600 font-black">Scroll to Scanner ↑</span>
          </a>
        </div>

      </div>
    </section>
  );
}
