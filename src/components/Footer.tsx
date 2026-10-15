"use client";

import React from "react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="border-t border-stone-200/90 bg-[#FAF7F2] py-12 text-stone-700"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-stone-200/80">
          
          {/* Brand & Mascot Farewell */}
          <div className="flex flex-col gap-2 max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-sm">
                <span className="text-lg" role="img" aria-hidden="true">
                  🩺
                </span>
              </div>
              <span className="text-xl font-black text-stone-900 tracking-tight">
                AccessAble<span className="text-purple-600 font-extrabold ml-0.5">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
              Automated accessibility auditing for public digital services. Designed to empower engineers and public servants to make the web a kinder, barrier-free place for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-8 text-xs font-bold">
            <div className="flex flex-col gap-2.5">
              <span className="uppercase tracking-wider text-stone-400 font-black text-[10px]">
                Standards & Docs
              </span>
              <a
                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-700 hover:underline transition-colors"
              >
                W3C WCAG 2.2 Guidelines ↗
              </a>
              <a
                href="https://www.section508.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-700 hover:underline transition-colors"
              >
                US Section 508 Standards ↗
              </a>
              <a
                href="https://www.w3.org/WAI/fundamentals/accessibility-intro/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-700 hover:underline transition-colors"
              >
                Introduction to Web Accessibility ↗
              </a>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="uppercase tracking-wider text-stone-400 font-black text-[10px]">
                App Navigation
              </span>
              <a href="#how-it-works" className="hover:text-purple-700 hover:underline transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-purple-700 hover:underline transition-colors">
                Features & Demos
              </a>
              <a href="#contrast-tool" className="hover:text-purple-700 hover:underline transition-colors">
                Live Contrast Tool
              </a>
              <button
                type="button"
                onClick={scrollToTop}
                className="text-left text-purple-700 font-black hover:underline cursor-pointer"
              >
                Back to Top ↑
              </button>
            </div>
          </div>

        </div>

        {/* Accessibility & Keyboard Helper Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-stone-500">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>Tested for full keyboard navigation and high contrast visibility</span>
          </div>

          <div className="text-center sm:text-right">
            <span>AccessAble AI • Built with empathy for civic inclusion • Hackathon 2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
