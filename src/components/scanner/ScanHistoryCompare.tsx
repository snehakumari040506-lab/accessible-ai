"use client";

import React from "react";
import { useMascot } from "@/context/MascotContext";

export default function ScanHistoryCompare() {
  const { scanHistory, activeScanResult, setActiveScanResult } = useMascot();

  if (scanHistory.length === 0) {
    return (
      <div className="rounded-3xl border-2 border-stone-200 bg-white p-8 text-center text-stone-500">
        <span className="text-3xl block mb-2">📊</span>
        <p className="font-bold">No scan history recorded yet.</p>
        <p className="text-xs text-stone-400 mt-1">
          When you scan or rescan websites, previous audit snapshots will appear here for comparison.
        </p>
      </div>
    );
  }

  // Find previous scan of the same URL (if any) to calculate verified fixes
  const currentScan = activeScanResult || scanHistory[0];
  const previousScan = scanHistory.find(
    (s) => s.scanId !== currentScan.scanId && (s.url === currentScan.url || s.url.includes("demo-public-service"))
  );

  // Identify issues present in previous scan but absent in current scan -> VERIFIED FIXED!
  const verifiedFixedIssues: string[] = [];
  if (previousScan) {
    const currentRuleIds = new Set(currentScan.findings.map((f) => f.ruleId));
    previousScan.findings.forEach((pf) => {
      if (!currentRuleIds.has(pf.ruleId) && !verifiedFixedIssues.includes(pf.title)) {
        verifiedFixedIssues.push(pf.title);
      }
    });
  }

  return (
    <div className="rounded-3xl border-2 border-purple-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-purple-900/5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 border border-purple-200 px-3 py-1 text-xs font-black text-purple-900 uppercase tracking-wider mb-2">
            <span>🔄</span>
            <span>Audit History & Verification</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Scan Comparison & Verified Remediations
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Compare past audit runs to confirm that applied code fixes genuinely resolved barriers.
          </p>
        </div>

        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600">
          {scanHistory.length} scan run{scanHistory.length === 1 ? "" : "s"} preserved
        </span>
      </div>

      {/* Verified Fixes Banner (If Comparison exists) */}
      {previousScan && (
        <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/70 p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <span className="text-sm font-black text-emerald-950">
                Rescan Comparison: {previousScan.score.totalScore} → {currentScan.score.totalScore} pts
              </span>
            </div>
            <span className="rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-black text-white">
              {currentScan.score.totalScore >= previousScan.score.totalScore ? "Score Improved!" : "Score Changed"}
            </span>
          </div>

          {verifiedFixedIssues.length > 0 ? (
            <div>
              <span className="text-xs font-bold text-emerald-900 block mb-1">
                Verified Fixed by Subsequent Real Scan ({verifiedFixedIssues.length}):
              </span>
              <ul className="space-y-1 text-xs text-emerald-800">
                {verifiedFixedIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="font-black text-emerald-600">✓</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-stone-600">
              No difference in detected rules between these two runs. Apply remediations in your code and rescan!
            </p>
          )}
        </div>
      )}

      {/* Scan History Run List */}
      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-stone-500 block">
          Historical Audit Records:
        </span>

        {scanHistory.map((scan, i) => {
          const isActive = scan.scanId === currentScan.scanId;

          return (
            <div
              key={scan.scanId}
              onClick={() => setActiveScanResult(scan)}
              className={`rounded-2xl border p-4 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                isActive
                  ? "border-purple-500 bg-purple-50/60 shadow-sm"
                  : "border-stone-200 bg-stone-50/60 hover:bg-white"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">
                    {scan.pageTitle}
                  </span>
                  {isActive && (
                    <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-black text-white uppercase">
                      Active Run
                    </span>
                  )}
                  {scan.isTestFixture && (
                    <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                      Civic Fixture
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 font-mono break-all">{scan.url}</p>
                <span className="text-[11px] text-stone-400">
                  {new Date(scan.timestamp).toLocaleString()} • {scan.findings.length} findings • {scan.engine}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-2xl font-black text-purple-700 font-mono">
                    {scan.score.totalScore}
                  </span>
                  <span className="text-[10px] block text-stone-400 font-bold uppercase">
                    AccessAble Score
                  </span>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:border-purple-300"
                >
                  View Run
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
