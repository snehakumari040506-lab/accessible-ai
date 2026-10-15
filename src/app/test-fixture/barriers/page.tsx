import React from "react";

export default function BarriersFixturePage() {
  return (
    <div className="min-h-screen bg-white p-8 text-stone-900 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900">
          <strong>Civic Test Fixture:</strong> This page deliberately contains standard accessibility barriers (missing alt, unlabeled input, missing button text, low contrast, duplicate IDs) for testing the AccessAble AI scanner.
        </div>

        <h1 className="text-3xl font-black">City Public Transit & Permit Portal</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Renew Bus & Rail Passes</h2>

          {/* Barrier 1: Missing alt text on img */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/transit-pass-banner.jpg" className="w-full h-48 bg-stone-100 rounded-xl object-cover" />

          {/* Barrier 2: Button missing accessible label */}
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-300 bg-stone-100">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Barrier 3: Input missing label */}
          <div>
            <input
              type="text"
              placeholder="Enter 16-Digit Transit ID"
              className="w-full rounded-lg border border-stone-300 p-2.5 text-sm"
            />
          </div>

          {/* Barrier 4: Duplicate ID */}
          <div className="flex gap-2">
            <button id="submit-btn" type="button" className="rounded-lg bg-blue-600 px-4 py-2 text-white font-bold text-sm">
              Submit Renewal
            </button>
            <button id="submit-btn" type="button" className="rounded-lg bg-stone-200 px-4 py-2 text-stone-700 font-bold text-sm">
              Cancel
            </button>
          </div>

          {/* Barrier 5: Low contrast text */}
          <p className="text-sm" style={{ color: "#94A3B8", backgroundColor: "#FFFFFF" }}>
            Note: Reduced fee transit discount expires on the first day of each calendar month.
          </p>
        </section>
      </div>
    </div>
  );
}
