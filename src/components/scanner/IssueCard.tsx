"use client";

import React, { useState } from "react";
import { AccessibilityFinding } from "@/types/scanner";
import { useMascot } from "@/context/MascotContext";
import { useTranslation } from "@/context/LanguageContext";
import ReadAloudButton from "../voice/ReadAloudButton";

interface IssueCardProps {
  finding: AccessibilityFinding;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function IssueCard({ finding, isSelected, onSelect }: IssueCardProps) {
  const { markFindingReviewed, setSelectedFinding } = useMascot();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"fix" | "code" | "verify" | "nodes">("fix");

  const textToRead = `${finding.title}. Severity: ${finding.severity}. ${finding.plainExplanation}. Fix recommendation: ${finding.suggestedFix}`;

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "critical":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "low":
        return "bg-stone-100 text-stone-700 border-stone-300";
      default:
        return "bg-purple-100 text-purple-800 border-purple-300";
    }
  };

  const getEffortBadge = (eff: string) => {
    switch (eff) {
      case "Quick":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Moderate":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Complex":
        return "bg-rose-50 text-rose-800 border-rose-200";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`rounded-3xl border-2 transition-all cursor-pointer p-5 sm:p-6 ${
        isSelected
          ? "border-purple-600 bg-white shadow-xl shadow-purple-900/10 ring-2 ring-purple-300/40"
          : "border-stone-200/90 bg-white shadow-sm hover:border-purple-300 hover:shadow-md"
      }`}
    >
      {/* Top Meta: Badges, Affected count, Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${getSeverityBadge(
              finding.severity
            )}`}
          >
            {finding.severity}
          </span>
          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-600 capitalize">
            {finding.category}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase ${getEffortBadge(
              finding.effort
            )}`}
          >
            ⚡ {finding.effort} Fix
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500">
            {finding.affectedCount} {t("scanner_elements_affected")}
          </span>
          <ReadAloudButton textToRead={textToRead} size="sm" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              markFindingReviewed(finding.id);
            }}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
              finding.status === "reviewed"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
            }`}
          >
            {finding.status === "reviewed" ? `✓ ${t("issue_card_reviewed")}` : t("issue_card_mark_reviewed")}
          </button>
        </div>
      </div>

      {/* Issue Title */}
      <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight mb-2">
        {finding.title}
      </h3>

      {/* Plain Language Summary */}
      <p className="text-sm font-medium text-stone-600 leading-relaxed mb-4">
        {finding.plainExplanation}
      </p>

      {/* Human Impact Pill Box */}
      <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-3 mb-4 flex items-start gap-2.5">
        <span className="text-base" role="img" aria-hidden="true">
          👥
        </span>
        <div className="flex-1 text-xs">
          <span className="font-bold text-rose-950 block mb-0.5">
            {t("issue_card_affected_users")}: {finding.affectedUsers.join(", ")}
          </span>
          <p className="text-stone-700 leading-normal">{finding.whyItMatters}</p>
        </div>
      </div>

      {/* Tab Switcher for Details (Fix, Code, Verification, Selectors) */}
      <div className="border-t border-stone-100 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex rounded-xl bg-stone-100 p-1 gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("fix");
                setExpanded(true);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                expanded && activeTab === "fix"
                  ? "bg-white text-purple-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {t("issue_card_fix_tab")}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("code");
                setExpanded(true);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                expanded && activeTab === "code"
                  ? "bg-white text-purple-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {t("issue_card_code_tab")}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("verify");
                setExpanded(true);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                expanded && activeTab === "verify"
                  ? "bg-white text-purple-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {t("issue_card_verify_tab")}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("nodes");
                setExpanded(true);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                expanded && activeTab === "nodes"
                  ? "bg-white text-purple-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {t("issue_card_nodes_tab")} ({finding.nodes.length})
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-xs font-bold text-purple-700 hover:text-purple-900"
          >
            {expanded ? "Collapse Details ↑" : "Expand Details ↓"}
          </button>
        </div>

        {/* Tab Content Panes */}
        {expanded && (
          <div className="pt-2 text-xs animate-fade-in">
            {activeTab === "fix" && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-2">
                <span className="font-black text-stone-800 uppercase tracking-wider text-[10px]">
                  Step-by-Step Fix Recommendation:
                </span>
                <p className="text-stone-800 font-medium leading-relaxed">
                  {finding.suggestedFix}
                </p>
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                  <span>WCAG Standard: <strong>{finding.wcagCriterion}</strong></span>
                  <span className="font-mono">Effort: {finding.effort}</span>
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div className="space-y-3">
                <div className="rounded-xl border border-rose-200 bg-stone-900 overflow-hidden">
                  <div className="bg-stone-950 px-3 py-1.5 text-[10px] font-bold text-rose-400 border-b border-stone-800">
                    {t("issue_card_code_before")}
                  </div>
                  <pre className="p-3 font-mono text-[11px] text-stone-300 overflow-x-auto">
                    <code>{finding.codeBefore}</code>
                  </pre>
                </div>
                <div className="rounded-xl border border-emerald-300 bg-stone-900 overflow-hidden">
                  <div className="bg-stone-950 px-3 py-1.5 text-[10px] font-bold text-emerald-400 border-b border-stone-800">
                    {t("issue_card_code_after")}
                  </div>
                  <pre className="p-3 font-mono text-[11px] text-emerald-100 overflow-x-auto">
                    <code>{finding.codeAfter}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === "verify" && (
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-2">
                <span className="font-black text-stone-800 uppercase tracking-wider text-[10px]">
                  Verification Checklist:
                </span>
                <ul className="space-y-1.5 text-stone-700">
                  {finding.verificationChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-600 font-black">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "nodes" && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {finding.nodes.map((node, i) => (
                  <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-mono text-[11px]">
                    <div className="text-purple-700 font-bold mb-1 break-all">
                      Selector: {node.target.join(" > ")}
                    </div>
                    <pre className="bg-stone-900 text-stone-200 p-2 rounded-lg overflow-x-auto text-[10px]">
                      <code>{node.html}</code>
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
