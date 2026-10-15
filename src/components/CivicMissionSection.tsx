"use client";

import React from "react";

const PILLARS = [
  {
    icon: "🏛️",
    title: "Essential Civic Services",
    description: "Vital public services—food assistance, court dates, healthcare access, and voting locations—must never be gated behind broken markup.",
    badge: "Civil Rights",
    accent: "bg-purple-50 border-purple-200 text-purple-900",
  },
  {
    icon: "👵",
    title: "Aging & Situational Need",
    description: "Accessibility aids everyone: seniors dealing with vision changes, citizens in noisy rooms needing captions, or someone navigating one-handed with an injury.",
    badge: "Lifelong Inclusion",
    accent: "bg-orange-50 border-orange-200 text-orange-900",
  },
  {
    icon: "🧠",
    title: "Cognitive & Plain Language",
    description: "Clear headings, predictable error prompts, and uncluttered layouts alleviate cognitive fatigue for neurodivergent and stressed users alike.",
    badge: "Cognitive Comfort",
    accent: "bg-emerald-50 border-emerald-200 text-emerald-900",
  },
  {
    icon: "🤝",
    title: "Developer Empowerment",
    description: "Engineers don't want to build inaccessible sites. They need automated, empathetic, educational tools that guide them directly to the fix.",
    badge: "Actionable Guidance",
    accent: "bg-rose-50 border-rose-200 text-rose-900",
  },
];

export default function CivicMissionSection() {
  return (
    <section
      id="civic-mission"
      className="py-16 sm:py-24 bg-[#FAF7F2] border-t border-stone-200/80"
      aria-labelledby="mission-headline"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-block rounded-full bg-rose-100 border border-rose-200 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-rose-800 mb-3">
            Civic Purpose
          </span>
          <h2
            id="mission-headline"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight"
          >
            Digital accessibility is a fundamental civic right.
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-stone-600 leading-relaxed">
            When public software is inaccessible, citizens are denied dignity, independence, and access to crucial democratic infrastructure. AccessAble AI bridges the divide between intention and execution.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className={`rounded-3xl border-2 p-6 shadow-md shadow-stone-200/40 transition-all hover:-translate-y-1 hover:shadow-lg ${p.accent}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl" role="img" aria-hidden="true">
                  {p.icon}
                </span>
                <span className="rounded-full bg-white/90 border border-current px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  {p.badge}
                </span>
              </div>
              <h3 className="text-lg font-black text-stone-900 mb-2">
                {p.title}
              </h3>
              <p className="text-xs font-medium text-stone-700 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* Civic Quote Banner */}
        <div className="mt-12 rounded-3xl border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-100/70 via-rose-50/50 to-orange-100/60 p-6 sm:p-10 text-center">
          <p className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight max-w-3xl mx-auto leading-snug">
            &ldquo;Accessibility is not a feature or a compliance hurdle. It is the practice of extending hospitality to all humanity in the digital sphere.&rdquo;
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
              AccessAble AI Manifesto
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
          </div>
        </div>

      </div>
    </section>
  );
}
