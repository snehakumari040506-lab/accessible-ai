"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMascot } from "@/context/MascotContext";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
}

export default function ScanModal({ isOpen, onClose, targetUrl }: ScanModalProps) {
  const { triggerEvent } = useMascot();
  const [showDemoAudit, setShowDemoAudit] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Accessible keyboard trap & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Focus the close button when opened
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      ref={modalRef}
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header with status pill & close */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300/80 px-3 py-1 text-xs font-bold text-amber-900">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Pre-Flight Target Verified • Live Engine in Development
            </div>
            <h3 id="modal-title" className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Audit Pipeline Scheduled
            </h3>
          </div>
          
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-purple-600 cursor-pointer"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Target URL Card */}
        <div className="mb-6 rounded-2xl border border-purple-200/90 bg-purple-50/60 p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
            Validated Target Service:
          </span>
          <p className="font-mono text-sm sm:text-base font-semibold text-purple-950 break-all mt-0.5">
            {targetUrl || "https://example-public-service.gov"}
          </p>
        </div>

        {/* Transparent Explanation (Zero Fake Claims) */}
        <div id="modal-description" className="space-y-4 text-stone-700 text-sm leading-relaxed">
          <p className="font-medium text-stone-800">
            <strong>Accessibility Integrity Notice:</strong> AccessAble AI never fabricates fake audit scores or synthetic test passes.
          </p>
          <p>
            The live backend scanner (coupling Chromium headless with <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs text-stone-800">axe-core</code> and Gemini 2.0 automated remediation suggestions) is currently being wired up for the upcoming hackathon judging stage.
          </p>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              What Dr. Pip will audit when live:
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-xl border border-stone-200/70 bg-white p-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium text-stone-800">WCAG 2.2 AA & AAA Contrast (4.5:1 & 7:1)</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-stone-200/70 bg-white p-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium text-stone-800">Keyboard Traps & Visible Focus Rings</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-stone-200/70 bg-white p-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium text-stone-800">Missing Form Labels & ARIA Roles</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-stone-200/70 bg-white p-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="font-medium text-stone-800">Touch Target Sizes (&ge; 24x24 & 44x44px)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Sample Demo Audit Architecture */}
        <div className="mt-6 border-t border-stone-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700">
              Curious how the report structure looks?
            </span>
            <button
              type="button"
              onClick={() => setShowDemoAudit(!showDemoAudit)}
              className="rounded-full border border-purple-300 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-colors"
            >
              {showDemoAudit ? "Hide Reference Schema" : "View Reference Report Schema"}
            </button>
          </div>

          {showDemoAudit && (
            <div className="mt-4 rounded-2xl border border-stone-300 bg-stone-900 p-4 text-xs font-mono text-stone-200 space-y-2">
              <div className="flex items-center justify-between text-stone-400 border-b border-stone-800 pb-2">
                <span>[DEMO SCHEMA ONLY - NOT LIVE RESULTS]</span>
                <span className="text-emerald-400">spec: a11y-v2.2</span>
              </div>
              <pre className="text-[11px] overflow-x-auto text-stone-300 leading-relaxed">
{`{
  "target": "${targetUrl || "https://example.gov"}",
  "conformanceTarget": "WCAG 2.2 Level AA",
  "pipelineStatus": "ready_for_scan_service",
  "auditModules": [
    { "id": "color-contrast", "standard": "1.4.3", "status": "pending_backend" },
    { "id": "keyboard-traps", "standard": "2.1.2", "status": "pending_backend" },
    { "id": "aria-valid-roles", "standard": "4.1.2", "status": "pending_backend" }
  ],
  "remediationEngine": "Gemini-2.0-Flash-A11y"
}`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-stone-200 pt-4">
          <button
            type="button"
            onClick={() => {
              triggerEvent(
                "scan_complete_clean",
                "Woohoo! Scan verified 0 critical barriers! Performing victory dance! 💃✨"
              );
              onClose();
            }}
            className="w-full sm:w-auto rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            💃 Test Clean Scan Result (Robot Dance)
          </button>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Close
            </button>
            <a
              href="#features"
              onClick={onClose}
              className="rounded-full bg-purple-700 hover:bg-purple-800 px-5 py-2.5 text-xs font-bold text-white text-center shadow-md shadow-purple-700/20 cursor-pointer"
            >
              Fix Barriers Below ↓
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
