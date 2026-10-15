"use client";

import React, { useMemo } from "react";
import { ScanResult, AccessibilityFinding } from "@/types/scanner";

interface WebsitePreviewProps {
  scanResult: ScanResult;
  selectedFinding?: AccessibilityFinding | null;
}

export default function WebsitePreview({ scanResult, selectedFinding }: WebsitePreviewProps) {
  // Inject safe CSS highlighter into the sandboxed preview snapshot
  const highlightedHtml = useMemo(() => {
    if (!scanResult.rawHtmlPreview) return "";

    const activeSelector = selectedFinding?.nodes[0]?.target?.join(", ") || "";

    const highlightStyle = `
      <style>
        /* Safe AccessAble AI Inspector Highlight */
        ${activeSelector ? `
        ${activeSelector} {
          outline: 4px solid #E11D48 !important;
          outline-offset: 2px !important;
          background-color: rgba(225, 29, 72, 0.15) !important;
          box-shadow: 0 0 15px rgba(225, 29, 72, 0.5) !important;
          position: relative !important;
        }
        ${activeSelector}::before {
          content: "⚠️ A11y Barrier";
          position: absolute;
          top: -24px;
          left: 0;
          background: #E11D48;
          color: white;
          font-family: sans-serif;
          font-size: 11px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          z-index: 99999;
          white-space: nowrap;
        }
        ` : ""}
      </style>
    `;

    return scanResult.rawHtmlPreview + highlightStyle;
  }, [scanResult.rawHtmlPreview, selectedFinding]);

  return (
    <div className="rounded-3xl border-2 border-purple-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-purple-900/5 space-y-6">
      
      {/* Header & Disclosures */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 border border-purple-200 px-3 py-1 text-xs font-black text-purple-900 uppercase tracking-wider mb-2">
            <span>👁️</span>
            <span>DOM Inspector & Snapshot Preview</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Target Page Snapshot: {scanResult.pageTitle}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-mono break-all">
            {scanResult.url}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600 max-w-sm">
          <span className="font-bold text-stone-800 block mb-0.5">🔒 Sandboxed Snapshot:</span>
          Rendered from the server-captured DOM. All cross-origin tracking and external scripts are safely blocked.
        </div>
      </div>

      {/* Selected Element Inspector Pill */}
      {selectedFinding ? (
        <div className="rounded-2xl border border-purple-200 bg-purple-50/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-black text-purple-950 uppercase tracking-wider">
              Inspecting Element: {selectedFinding.title}
            </span>
            <span className="font-mono text-xs font-bold text-purple-800 bg-white px-2 py-0.5 rounded-lg border border-purple-200">
              {selectedFinding.nodes[0]?.target?.join(" > ") || "Target"}
            </span>
          </div>

          <div className="rounded-xl border border-stone-300 bg-stone-900 p-3 font-mono text-xs text-stone-200 overflow-x-auto">
            <code>{selectedFinding.nodes[0]?.html || "<!-- Element node preview -->"}</code>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-500 italic">
          Select any finding from the list on the Findings tab to highlight its element in the preview below.
        </div>
      )}

      {/* Sandboxed Iframe Preview */}
      <div className="rounded-2xl border-2 border-stone-300 bg-white overflow-hidden shadow-inner h-[500px] flex flex-col">
        <div className="bg-stone-100 px-4 py-2 border-b border-stone-200 flex items-center justify-between text-xs font-medium text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-[11px] text-stone-500">{scanResult.url}</span>
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            {selectedFinding ? "Highlighted with red outline" : "Full Page View"}
          </span>
        </div>

        <iframe
          title={`Snapshot preview for ${scanResult.url}`}
          srcDoc={highlightedHtml}
          sandbox="allow-same-origin"
          className="w-full flex-1 border-0 bg-white"
        />
      </div>

    </div>
  );
}
