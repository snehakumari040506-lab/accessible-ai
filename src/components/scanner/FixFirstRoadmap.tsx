"use client";

import React, { useMemo } from "react";
import { AccessibilityFinding } from "@/types/scanner";
import { useMascot } from "@/context/MascotContext";

interface FixFirstRoadmapProps {
  findings: AccessibilityFinding[];
}

export default function FixFirstRoadmap({ findings }: FixFirstRoadmapProps) {
  const { markFindingReviewed, setSelectedFinding } = useMascot();

  // Prioritize findings into a logical phased remediation plan
  const prioritizedSteps = useMemo(() => {
    return [...findings].sort((a, b) => {
      // 1. Critical first
      const severityOrder: Record<string, number> = {
        critical: 1,
        high: 2,
        medium: 3,
        low: 4,
        "needs-review": 5,
      };
      const diff = (severityOrder[a.severity] || 5) - (severityOrder[b.severity] || 5);
      if (diff !== 0) return diff;

      // 2. Quick effort items prioritized for momentum
      const effortOrder: Record<string, number> = { Quick: 1, Moderate: 2, Complex: 3 };
      return (effortOrder[a.effort] || 2) - (effortOrder[b.effort] || 2);
    });
  }, [findings]);

  const reviewedCount = findings.filter((f) => f.status === "reviewed").length;
  const progressPercent = findings.length > 0 ? Math.round((reviewedCount / findings.length) * 100) : 100;

  return (
    <div className="rounded-3xl border-2 border-purple-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-purple-900/5">
      {/* Roadmap Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 border border-purple-200 px-3 py-1 text-xs font-black text-purple-900 uppercase tracking-wider mb-2">
            <span>🗺️</span>
            <span>Prioritized Remediation Sequence</span>
          </div>
          <h3 className="text-2xl font-black text-stone-900 tracking-tight">
            Your Accessibility Roadmap
          </h3>
          <p className="text-xs sm:text-sm font-medium text-stone-600 mt-1">
            Engineered sequence tackling critical blockers first, followed by high-leverage quick wins.
          </p>
        </div>

        {/* Progress Card */}
        <div className="w-full sm:w-64 rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <div className="flex justify-between items-center text-xs font-black text-stone-800 mb-1.5">
            <span>Roadmap Progress</span>
            <span className="text-purple-700">{progressPercent}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-stone-500 mt-1 block">
            {reviewedCount} of {findings.length} findings marked addressed
          </span>
        </div>
      </div>

      {/* Prioritized Steps List */}
      <div className="mt-6 space-y-4">
        {prioritizedSteps.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="font-bold">No accessibility barriers to remediate! Your roadmap is complete.</p>
          </div>
        ) : (
          prioritizedSteps.map((step, index) => {
            const isDone = step.status === "reviewed";

            return (
              <div
                key={step.id}
                className={`rounded-2xl border-2 p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDone
                    ? "border-emerald-200 bg-emerald-50/40 opacity-75"
                    : "border-stone-200 bg-white hover:border-purple-300 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step Sequence Badge */}
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl font-mono text-sm font-black shadow-xs ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : index === 0
                        ? "bg-rose-500 text-white"
                        : "bg-purple-100 text-purple-900 border border-purple-200"
                    }`}
                  >
                    {isDone ? "✓" : `#${index + 1}`}
                  </div>

                  {/* Step Description */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-black text-stone-900">
                        {step.title}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                          step.severity === "critical"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {step.severity}
                      </span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-600">
                        ⚡ {step.effort} effort
                      </span>
                    </div>

                    <p className="text-xs font-medium text-stone-600 leading-relaxed">
                      <strong>Why prioritized:</strong> {step.whyItMatters} ({step.effortRationale})
                    </p>

                    <div className="pt-1 flex items-center gap-3 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSelectedFinding(step)}
                        className="text-purple-700 hover:text-purple-900 font-bold underline"
                      >
                        Inspect Code Fix →
                      </button>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-500">
                        Standard: {step.wcagCriterion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mark Resolved Toggle */}
                <button
                  type="button"
                  onClick={() => markFindingReviewed(step.id)}
                  className={`flex-shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-all ${
                    isDone
                      ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                      : "border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700"
                  }`}
                >
                  {isDone ? "✓ Addressed in Code" : "Mark Addressed"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
