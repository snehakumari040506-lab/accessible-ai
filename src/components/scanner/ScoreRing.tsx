"use client";

import React, { useState } from "react";
import { ScanScoreBreakdown } from "@/types/scanner";

interface ScoreRingProps {
  score: ScanScoreBreakdown;
  size?: number;
}

export default function ScoreRing({ score, size = 160 }: ScoreRingProps) {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);

  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score.totalScore / 100) * circumference;

  // Determine score color
  const getScoreColor = (val: number) => {
    if (val >= 90) return { stroke: "#059669", text: "text-emerald-700", bg: "bg-emerald-50", badge: "WCAG High" };
    if (val >= 70) return { stroke: "#EA580C", text: "text-orange-700", bg: "bg-orange-50", badge: "Moderate" };
    return { stroke: "#E11D48", text: "text-rose-700", bg: "bg-rose-50", badge: "Barriers Detected" };
  };

  const style = getScoreColor(score.totalScore);

  return (
    <div className="flex flex-col items-center relative">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* SVG Circular Ring */}
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-stone-100"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated fill ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={style.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Score Number */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${style.text}`}>
            {score.totalScore}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
            out of 100
          </span>
        </div>
      </div>

      {/* Label & Formula Trigger */}
      <div className="mt-2 flex items-center gap-1.5 text-center">
        <span className="text-xs font-bold text-stone-800">AccessAble Score</span>
        <button
          type="button"
          onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
          className="text-stone-400 hover:text-purple-700 text-xs cursor-pointer"
          aria-label="View scoring formula explanation"
        >
          ℹ️
        </button>
      </div>

      {/* Documented Formula Popover */}
      {showFormulaTooltip && (
        <div className="absolute top-full mt-2 z-30 w-72 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl text-left text-xs text-stone-700 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
            <span className="font-black text-purple-900">Documented Formula</span>
            <button
              type="button"
              onClick={() => setShowFormulaTooltip(false)}
              className="text-stone-400 hover:text-stone-700 font-bold"
            >
              ✕
            </button>
          </div>
          <p className="font-mono text-[11px] bg-stone-50 p-2 rounded-lg text-purple-950 border border-stone-200">
            {score.formula}
          </p>
          <div className="text-[11px] space-y-1 text-stone-600">
            <div className="flex justify-between">
              <span>Critical Deductions:</span>
              <span className="font-bold text-rose-600">-{score.criticalDeductions} pts</span>
            </div>
            <div className="flex justify-between">
              <span>High Deductions:</span>
              <span className="font-bold text-orange-600">-{score.highDeductions} pts</span>
            </div>
            <div className="flex justify-between">
              <span>Medium Deductions:</span>
              <span className="font-bold text-amber-600">-{score.mediumDeductions} pts</span>
            </div>
            <div className="flex justify-between">
              <span>Low Deductions:</span>
              <span className="font-bold text-stone-500">-{score.lowDeductions} pts</span>
            </div>
          </div>
          <p className="text-[10px] text-stone-400 italic pt-1 border-t border-stone-100">
            *Indicative automated audit score, not an official legal certification or guarantee of complete WCAG 2.2 conformance.
          </p>
        </div>
      )}
    </div>
  );
}
