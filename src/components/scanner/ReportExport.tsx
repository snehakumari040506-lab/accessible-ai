"use client";

import React, { useState } from "react";
import { ScanResult } from "@/types/scanner";

interface ReportExportProps {
  scanResult: ScanResult;
}

export default function ReportExport({ scanResult }: ReportExportProps) {
  const [downloading, setDownloading] = useState(false);

  // Generate and download JSON file
  const handleExportJson = () => {
    const reportData = {
      project: "AccessAble AI",
      scanId: scanResult.scanId,
      url: scanResult.url,
      timestamp: scanResult.timestamp,
      engine: scanResult.engine,
      accessAbleScore: {
        score: scanResult.score.totalScore,
        formula: scanResult.score.formula,
        deductions: {
          critical: scanResult.score.criticalDeductions,
          high: scanResult.score.highDeductions,
          medium: scanResult.score.mediumDeductions,
          low: scanResult.score.lowDeductions,
        },
      },
      severitySummary: scanResult.severityCounts,
      findings: scanResult.findings.map((f) => ({
        id: f.id,
        ruleId: f.ruleId,
        title: f.title,
        severity: f.severity,
        category: f.category,
        wcagCriterion: f.wcagCriterion,
        wcagLevel: f.wcagLevel,
        plainExplanation: f.plainExplanation,
        whyItMatters: f.whyItMatters,
        affectedCount: f.affectedCount,
        nodes: f.nodes,
        suggestedFix: f.suggestedFix,
        effort: f.effort,
        status: f.status,
      })),
      disclaimer:
        "This report was generated using automated axe-core rules. Automated audits typically detect 30-50% of WCAG barriers. Manual review and assistive technology user testing are essential for complete digital accessibility compliance.",
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accessable-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Generate and download standalone printable HTML report
  const handleExportHtml = () => {
    setDownloading(true);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Accessibility Audit Report: ${scanResult.pageTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 2rem; background: #FAF7F2; color: #1C1917; line-height: 1.5; }
    .container { max-width: 900px; margin: 0 auto; background: #fff; padding: 2.5rem; border-radius: 24px; border: 1px solid #EFE8DD; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    h1 { color: #1E1B4B; margin-top: 0; font-size: 2rem; }
    .meta-box { background: #FAF7F2; padding: 1rem; border-radius: 12px; margin-bottom: 2rem; font-size: 0.9rem; border: 1px solid #E9E2D5; }
    .score-badge { display: inline-block; font-size: 2.5rem; font-weight: 900; color: #7C3AED; }
    .card { border: 1px solid #E2E8F0; border-radius: 16px; padding: 1.25rem; margin-bottom: 1.25rem; background: #fff; }
    .critical { border-left: 6px solid #E11D48; }
    .high { border-left: 6px solid #EA580C; }
    .medium { border-left: 6px solid #D97706; }
    .low { border-left: 6px solid #64748B; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; margin-right: 6px; }
    .badge-critical { background: #FFE4E6; color: #BE123C; }
    .badge-high { background: #FFEDD5; color: #C2410C; }
    .badge-medium { background: #FEF3C7; color: #B45309; }
    pre { background: #0F172A; color: #F1F5F9; padding: 0.75rem; border-radius: 8px; overflow-x: auto; font-size: 0.8rem; }
    .disclaimer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #E2E8F0; font-size: 0.8rem; color: #64748B; font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <h1>AccessAble AI — Accessibility Audit Report</h1>
    
    <div class="meta-box">
      <div><strong>Target URL:</strong> ${scanResult.url}</div>
      <div><strong>Page Title:</strong> ${scanResult.pageTitle}</div>
      <div><strong>Scan Timestamp:</strong> ${new Date(scanResult.timestamp).toLocaleString()}</div>
      <div><strong>Audit Engine:</strong> ${scanResult.engine}</div>
    </div>

    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
      <div>
        <div class="score-badge">${scanResult.score.totalScore}/100</div>
        <div style="font-weight: bold; color: #64748B; font-size: 0.9rem;">AccessAble Score</div>
      </div>
      <div>
        <div><strong>Critical:</strong> ${scanResult.severityCounts.critical}</div>
        <div><strong>High:</strong> ${scanResult.severityCounts.high}</div>
        <div><strong>Medium:</strong> ${scanResult.severityCounts.medium}</div>
        <div><strong>Low:</strong> ${scanResult.severityCounts.low}</div>
      </div>
    </div>

    <h2>Accessibility Findings (${scanResult.findings.length})</h2>

    ${scanResult.findings
      .map(
        (f) => `
      <div class="card ${f.severity}">
        <div style="margin-bottom: 0.5rem;">
          <span class="badge badge-${f.severity}">${f.severity}</span>
          <span style="font-size: 0.8rem; color: #64748B;">WCAG: ${f.wcagCriterion}</span>
        </div>
        <h3 style="margin: 0.25rem 0 0.5rem 0;">${f.title}</h3>
        <p style="margin: 0.5rem 0; font-size: 0.9rem;">${f.plainExplanation}</p>
        <p style="margin: 0.5rem 0; font-size: 0.85rem; color: #475569;"><strong>Human Impact:</strong> ${f.whyItMatters}</p>
        <div style="margin-top: 0.75rem;">
          <strong>Suggested Fix:</strong> ${f.suggestedFix}
        </div>
        ${
          f.nodes[0]
            ? `
          <div style="margin-top: 0.75rem;">
            <strong>Selector:</strong> <code>${f.nodes[0].target.join(" > ")}</code>
            <pre><code>${f.nodes[0].html.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
          </div>
        `
            : ""
        }
      </div>
    `
      )
      .join("")}

    <div class="disclaimer">
      <strong>Limitations & Human Review Notice:</strong> Automated rules cannot guarantee 100% WCAG 2.2 conformance. Crucial criteria such as logical screen reader reading order, cognitive accessibility, accurate captions, and meaningful context require human evaluation.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `accessable-report-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportJson}
        className="rounded-full border border-stone-300 bg-white hover:bg-stone-50 px-3.5 py-2 text-xs font-bold text-stone-700 shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        title="Download structured JSON report data"
      >
        <span>📥</span>
        <span>Export JSON</span>
      </button>

      <button
        type="button"
        onClick={handleExportHtml}
        disabled={downloading}
        className="rounded-full border border-purple-300 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 text-xs font-bold text-purple-900 shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        title="Download printable HTML stakeholder report"
      >
        <span>📄</span>
        <span>{downloading ? "Generating..." : "Export HTML Report"}</span>
      </button>
    </div>
  );
}
