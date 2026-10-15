"use client";

import React from "react";

/**
 * FloatingShapes:
 * Lightweight decorative 2D shapes, glowing ambient blurs, and twinkling stars.
 * Designed to create a warm, distinctive, friendly aesthetic while maintaining
 * zero accessibility interference (aria-hidden="true") and respecting reduced-motion.
 */
export default function FloatingShapes() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    >
      {/* Soft Ambient Pastel Glows */}
      <div
        className="animate-glow absolute -top-24 left-1/4 h-96 w-96 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(221, 214, 254, 0.5) 0%, rgba(254, 215, 170, 0.3) 50%, transparent 75%)",
        }}
      />
      <div
        className="animate-glow absolute top-1/3 -right-24 h-80 w-80 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(254, 205, 211, 0.5) 0%, rgba(167, 243, 208, 0.3) 50%, transparent 75%)",
          animationDelay: "2s",
        }}
      />
      <div
        className="animate-glow absolute bottom-10 left-10 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(167, 243, 208, 0.4) 0%, rgba(221, 214, 254, 0.3) 50%, transparent 75%)",
          animationDelay: "3.5s",
        }}
      />

      {/* Floating 2D Pastel Pill (Lavender) */}
      <div
        className="animate-float absolute top-28 left-[8%] hidden md:block"
        style={{ animationDuration: "5s" }}
      >
        <div className="h-6 w-16 rotate-12 rounded-full border border-purple-200/80 bg-purple-100/70 shadow-sm backdrop-blur-xs" />
      </div>

      {/* Floating Donut Ring (Coral / Pink) */}
      <div
        className="animate-float-reverse absolute top-40 right-[10%] hidden sm:block"
        style={{ animationDuration: "6s" }}
      >
        <div className="h-10 w-10 rounded-full border-4 border-dashed border-rose-300/80 bg-rose-50/40 shadow-xs" />
      </div>

      {/* Floating Rounded Diamond (Mint) */}
      <div
        className="animate-float-slow absolute top-[62%] left-[5%] hidden lg:block"
        style={{ animationDuration: "5.5s" }}
      >
        <div className="h-8 w-8 rotate-45 rounded-xl border border-emerald-200 bg-emerald-100/60 shadow-xs" />
      </div>

      {/* Floating Peach Arc / Capsule */}
      <div
        className="animate-float absolute top-[70%] right-[7%] hidden md:block"
        style={{ animationDuration: "4.8s" }}
      >
        <div className="h-12 w-12 rounded-2xl border border-orange-200/90 bg-orange-100/70 shadow-xs rotate-[-15deg] flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-orange-300/70" />
        </div>
      </div>

      {/* Twinkling 4-Point Star 1 (Lavender) */}
      <svg
        className="animate-twinkle absolute top-20 right-[25%] h-6 w-6 text-purple-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>

      {/* Twinkling 4-Point Star 2 (Peach) */}
      <svg
        className="animate-twinkle-delay-1 absolute top-[48%] left-[12%] h-5 w-5 text-orange-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>

      {/* Twinkling 4-Point Star 3 (Mint) */}
      <svg
        className="animate-twinkle-delay-2 absolute top-[32%] right-[5%] h-5 w-5 text-emerald-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>

      {/* Twinkling 4-Point Star 4 (Coral Pink) */}
      <svg
        className="animate-twinkle absolute bottom-32 left-[28%] h-4 w-4 text-rose-400"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>

      {/* Soft Floating Dot Matrix */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex gap-3 opacity-30">
        <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" style={{ animationDelay: "0.3s" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "0.6s" }} />
      </div>
    </div>
  );
}
