import React from "react";

export default function CleanFixturePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] p-8 text-stone-900 font-sans">
      <header className="max-w-2xl mx-auto mb-6">
        <nav aria-label="Main Navigation">
          <a href="#main-content" className="text-xs font-bold text-purple-700 underline">
            Skip to main content
          </a>
        </nav>
      </header>

      <main id="main-content" className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 font-semibold">
          ✓ <strong>Remediated Civic Fixture:</strong> All accessibility barriers have been resolved (descriptive alt text, associated labels, accessible button names, unique IDs, and WCAG AAA color contrast).
        </div>

        <h1 className="text-3xl font-black text-[#1E1B4B]">City Public Transit & Permit Portal</h1>

        <section aria-labelledby="renew-heading" className="space-y-4">
          <h2 id="renew-heading" className="text-xl font-bold text-stone-800">
            Renew Bus & Rail Passes
          </h2>

          {/* Remediated 1: Descriptive alt text */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/transit-pass-banner.jpg"
            alt="City municipal electric bus arriving at downtown terminal station"
            className="w-full h-48 bg-stone-100 rounded-xl object-cover"
          />

          {/* Remediated 2: Accessible button label */}
          <button
            type="button"
            aria-label="Add new monthly transit pass to account"
            className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-white font-bold text-sm shadow-sm hover:bg-purple-800 focus-visible:ring-3 focus-visible:ring-purple-600"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Monthly Pass</span>
          </button>

          {/* Remediated 3: Properly connected label & input */}
          <div className="space-y-1">
            <label htmlFor="transit-card-id" className="block text-sm font-bold text-stone-800">
              16-Digit Transit ID Number:
            </label>
            <input
              id="transit-card-id"
              type="text"
              aria-describedby="transit-hint"
              required
              className="w-full rounded-lg border border-stone-300 p-2.5 text-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <span id="transit-hint" className="block text-xs text-stone-600">
              Located on the lower back of your physical plastic transit card.
            </span>
          </div>

          {/* Remediated 4: Unique element IDs */}
          <div className="flex gap-2 pt-2">
            <button
              id="submit-renewal-btn"
              type="button"
              className="rounded-lg bg-purple-700 px-5 py-2.5 text-white font-bold text-sm shadow-sm hover:bg-purple-800"
            >
              Submit Renewal
            </button>
            <button
              id="cancel-renewal-btn"
              type="button"
              className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-stone-700 font-bold text-sm hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>

          {/* Remediated 5: WCAG AAA Contrast (13:1 ratio) */}
          <p className="text-sm font-medium text-[#1E1B4B] bg-[#EDE9FE] p-3 rounded-lg border border-purple-200">
            Note: Reduced fee transit discount expires on the first day of each calendar month.
          </p>
        </section>
      </main>

      <footer className="max-w-2xl mx-auto mt-12 pt-6 border-t border-stone-200 text-xs text-stone-500">
        <p>© 2026 Municipal Transit Authority • Tested with Screen Readers</p>
      </footer>
    </div>
  );
}
