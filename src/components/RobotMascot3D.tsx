"use client";

import React, { useState } from "react";
import { useMascot, MascotBehaviorState } from "@/context/MascotContext";

/**
 * RobotMascot3D
 * 
 * CHARACTER DESIGN:
 * - Tiny, rounded, soft clay-style robot.
 * - Pastel lavender body, peach cheeks, cream belly with tactile accessibility heart.
 * - Tiny arms and feet, large expressive glossy eyes with 3-point studio lighting highlights.
 * - Soft ambient occlusion, rim light, and gentle grounding drop shadow.
 * - Floating stars and sparkles.
 * 
 * BEHAVIORS SUPPORTED:
 * 1. IDLE: Natural float, periodic blinks, subtle head tilt.
 * 2. WAVE: Cheerful arm wave + "Hi there! Ready to make the web kinder? ✨".
 * 3. DANCE: Joyful bouncy hop with alternating arms.
 * 4. SLEEP: Closed eyes, head curl, floating Zs after 30s of inactivity; wakes on user input.
 * 5. THINK: Curious tilted head, thinking expression, spinning/glowing halo.
 * 6. CELEBRATE: Happy jumps, starry eyes, confetti burst on accessibility fix.
 * 7. ENCOURAGE: Kind, empathetic expression + "No worries! Let's fix these together 💜".
 */

export default function RobotMascot3D() {
  const { behaviorState, speechText, setBehaviorState, wakeUp } = useMascot();
  const [viewMode, setViewMode] = useState<"clay-3d" | "spline">("clay-3d");
  const [splineUrl, setSplineUrl] = useState(
    "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
  );
  const [isHovered, setIsHovered] = useState(false);

  // Manual tester trigger
  const handleStateChange = (state: MascotBehaviorState) => {
    if (state === "sleep") {
      setBehaviorState("sleep");
    } else if (behaviorState === "sleep") {
      wakeUp();
      setTimeout(() => setBehaviorState(state), 400);
    } else {
      setBehaviorState(state);
    }
  };

  // Determine current animation class on the robot body
  const getBodyAnimationClass = () => {
    switch (behaviorState) {
      case "idle":
        return "animate-robot-idle";
      case "wave":
        return "animate-robot-idle";
      case "dance":
        return "animate-robot-dance";
      case "sleep":
        return "animate-robot-sleep";
      case "think":
        return "animate-robot-think";
      case "celebrate":
        return "animate-robot-celebrate";
      case "waking":
        return "animate-robot-waking";
      case "encourage":
        return "animate-robot-idle";
      default:
        return "animate-robot-idle";
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center p-2 sm:p-4 select-none max-w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Architecture Bar: 3D Soft Clay vs Spline Toggle */}
      <div className="mb-3 flex items-center gap-2 rounded-full border border-purple-200/90 bg-white/95 px-3 py-1 shadow-xs backdrop-blur-md">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] font-bold text-stone-700">Mascot Mode:</span>
        <button
          type="button"
          onClick={() => setViewMode("clay-3d")}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all cursor-pointer ${
            viewMode === "clay-3d"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
          aria-pressed={viewMode === "clay-3d"}
        >
          3D Soft Clay
        </button>
        <button
          type="button"
          onClick={() => setViewMode("spline")}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all cursor-pointer ${
            viewMode === "spline"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900"
          }`}
          aria-pressed={viewMode === "spline"}
        >
          Spline 3D Scene
        </button>
      </div>

      {/* Main Mascot Stage */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-[390px] aspect-square rounded-[36px] border-2 border-dashed border-purple-200/90 bg-gradient-to-b from-purple-100/50 via-amber-50/30 to-rose-50/40 p-4 sm:p-6 shadow-xl shadow-purple-900/5 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-all duration-300"
      >
        {/* Soft 3-Point Studio Lighting Ambient Behind Robot */}
        <div className="absolute inset-0 bg-radial from-purple-200/40 via-amber-100/25 to-transparent blur-2xl pointer-events-none" />

        {viewMode === "clay-3d" ? (
          <div
            className="relative w-full h-full flex flex-col items-center justify-center"
            aria-hidden="true"
          >
            {/* =================================================================
               Floating Stars & Ambient Sparkles
               ================================================================= */}
            {/* Top-Right Star (Lavender) */}
            <div className="animate-twinkle absolute top-5 right-8 h-4 w-4 text-purple-400 drop-shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>
            </div>

            {/* Left Star (Peach) */}
            <div className="animate-twinkle-delay-1 absolute top-16 left-6 h-3.5 w-3.5 text-orange-400 drop-shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>
            </div>

            {/* Bottom-Right Star (Mint) */}
            <div className="animate-twinkle-delay-2 absolute bottom-12 right-6 h-3.5 w-3.5 text-emerald-400 drop-shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>
            </div>

            {/* Bottom-Left Sparkle (Coral) */}
            <div className="animate-twinkle absolute bottom-14 left-8 h-3 w-3 text-rose-400 drop-shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>
            </div>

            {/* =================================================================
               State-Specific Ambient Effects
               ================================================================= */}

            {/* SLEEP STATE: Floating Z-Z-Z Particles */}
            {behaviorState === "sleep" && (
              <div className="absolute top-8 right-12 z-30 pointer-events-none select-none">
                <span className="animate-float-z-1 absolute text-xs font-black text-purple-600 font-mono">
                  z
                </span>
                <span className="animate-float-z-2 absolute text-sm font-black text-purple-700 font-mono">
                  Z
                </span>
                <span className="animate-float-z-1 absolute -top-4 -right-3 text-base font-black text-indigo-700 font-mono">
                  Z
                </span>
              </div>
            )}

            {/* THINK STATE: Curious Halo Ring */}
            {behaviorState === "think" && (
              <div className="animate-robot-think-ring absolute top-8 h-28 w-28 rounded-full border-2 border-dashed border-purple-400/70 pointer-events-none" />
            )}

            {/* CELEBRATE / DANCE STATE: Sparkle Bursts */}
            {(behaviorState === "celebrate" || behaviorState === "dance") && (
              <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                <div className="animate-ping absolute top-10 left-12 h-2.5 w-2.5 rounded-full bg-amber-400" />
                <div className="animate-ping absolute top-12 right-10 h-2 w-2 rounded-full bg-pink-400 delay-150" />
                <div className="animate-ping absolute bottom-16 left-10 h-2 w-2 rounded-full bg-emerald-400 delay-300" />
              </div>
            )}

            {/* =================================================================
               THE 3D SOFT CLAY ROBOT CHARACTER
               ================================================================= */}
            <div className={`relative flex flex-col items-center justify-center ${getBodyAnimationClass()}`}>
              
              {/* Antenna / Soft Clay Sensor Node */}
              <div className="relative flex flex-col items-center -mb-2 z-10">
                <div
                  className="h-4 w-4 rounded-full shadow-md transition-all duration-300"
                  style={{
                    background:
                      behaviorState === "think"
                        ? "radial-gradient(circle at 30% 30%, #FDE047, #EAB308 60%, #CA8A04)"
                        : behaviorState === "celebrate"
                        ? "radial-gradient(circle at 30% 30%, #F472B6, #EC4899 60%, #DB2777)"
                        : "radial-gradient(circle at 30% 30%, #DDD6FE, #A78BFA 60%, #7C3AED)",
                    boxShadow:
                      behaviorState === "think"
                        ? "0 0 12px rgba(250, 204, 21, 0.9)"
                        : "0 2px 6px rgba(124, 58, 237, 0.35)",
                  }}
                >
                  <span className="absolute inset-0 rounded-full bg-white/40 scale-50 -translate-x-0.5 -translate-y-0.5" />
                </div>
                {/* Antenna stem with clay shading */}
                <div className="h-3 w-1.5 rounded-full bg-gradient-to-r from-purple-300 via-purple-200 to-purple-400 shadow-xs" />
              </div>

              {/* Head + Body Assembly (Soft Rounded Clay Silhouette) */}
              <div className="relative flex flex-col items-center">
                
                {/* Soft Clay Ears / Side Sensor Pods */}
                <div
                  className="absolute -left-3.5 top-12 h-8 w-4 rounded-l-2xl shadow-md transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #E9D5FF 0%, #C084FC 50%, #9333EA 100%)",
                    boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.7), -2px 2px 5px rgba(0,0,0,0.12)",
                  }}
                />
                <div
                  className="absolute -right-3.5 top-12 h-8 w-4 rounded-r-2xl shadow-md transition-transform"
                  style={{
                    background:
                      "linear-gradient(225deg, #E9D5FF 0%, #C084FC 50%, #9333EA 100%)",
                    boxShadow: "inset -1px 1px 2px rgba(255,255,255,0.7), 2px 2px 5px rgba(0,0,0,0.12)",
                  }}
                />

                {/* 3D Soft Clay Head & Upper Torso */}
                <div
                  className="relative h-36 w-44 rounded-[42px] p-3 flex flex-col items-center justify-between shadow-2xl transition-all"
                  style={{
                    background:
                      "radial-gradient(circle at 32% 28%, #FAF5FF 0%, #E9D5FF 28%, #D8B4FE 55%, #C084FC 80%, #9333EA 100%)",
                    boxShadow:
                      "inset 2px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 8px rgba(109, 40, 217, 0.35), 0 16px 30px -8px rgba(88, 28, 135, 0.22)",
                  }}
                >
                  {/* Subtle 3D Top Rim Highlight */}
                  <div className="absolute top-2 left-6 right-6 h-2 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent blur-xs pointer-events-none" />

                  {/* Face Area: Large Expressive Eyes, Cheeks, and Mouth */}
                  <div className="w-full flex flex-col items-center mt-3 z-10">
                    
                    {/* Eyes Row */}
                    <div className="flex items-center justify-center gap-7 w-full px-2">
                      
                      {/* Left Eye */}
                      {behaviorState === "sleep" ? (
                        /* Sleeping Eye: Curved serene sleeping lashes */
                        <div className="h-5 w-7 border-b-[3.5px] border-stone-800 rounded-b-full transform -translate-y-1" />
                      ) : behaviorState === "celebrate" ? (
                        /* Starry Joyful Eye */
                        <div className="flex items-center justify-center h-8 w-8 text-amber-400 drop-shadow-md">
                          <span className="text-xl">★</span>
                        </div>
                      ) : behaviorState === "dance" ? (
                        /* Dancing Crescent Eye */
                        <div className="h-4 w-7 border-t-[3.5px] border-stone-800 rounded-t-full transform translate-y-1" />
                      ) : (
                        /* Standard Glossy 3D Clay Eye */
                        <div
                          className="relative h-8 w-8 rounded-full bg-stone-900 shadow-inner flex items-center justify-center overflow-hidden transition-transform animate-gloss"
                          style={{
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 2px rgba(255,255,255,0.4)",
                          }}
                        >
                          {/* Large Specular Reflection (Top-Left) */}
                          <div className="absolute top-1.5 left-1.5 h-3 w-3 rounded-full bg-white shadow-xs" />
                          {/* Secondary Soft Specular Reflection (Bottom-Right) */}
                          <div className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-white/60" />
                          {/* Micro reflection dot */}
                          <div className="absolute top-3.5 left-3.5 h-1 w-1 rounded-full bg-purple-200/80" />
                        </div>
                      )}

                      {/* Right Eye */}
                      {behaviorState === "sleep" ? (
                        /* Sleeping Eye */
                        <div className="h-5 w-7 border-b-[3.5px] border-stone-800 rounded-b-full transform -translate-y-1" />
                      ) : behaviorState === "celebrate" ? (
                        /* Starry Joyful Eye */
                        <div className="flex items-center justify-center h-8 w-8 text-amber-400 drop-shadow-md">
                          <span className="text-xl">★</span>
                        </div>
                      ) : behaviorState === "dance" ? (
                        /* Dancing Crescent Eye */
                        <div className="h-4 w-7 border-t-[3.5px] border-stone-800 rounded-t-full transform translate-y-1" />
                      ) : behaviorState === "wave" ? (
                        /* Winking Right Eye on Wave! */
                        <div className="h-4 w-7 border-t-[3.5px] border-stone-800 rounded-t-full transform translate-y-1" />
                      ) : (
                        /* Standard Glossy 3D Clay Eye */
                        <div
                          className="relative h-8 w-8 rounded-full bg-stone-900 shadow-inner flex items-center justify-center overflow-hidden transition-transform animate-gloss"
                          style={{
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 2px rgba(255,255,255,0.4)",
                          }}
                        >
                          <div className="absolute top-1.5 left-1.5 h-3 w-3 rounded-full bg-white shadow-xs" />
                          <div className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-white/60" />
                          <div className="absolute top-3.5 left-3.5 h-1 w-1 rounded-full bg-purple-200/80" />
                        </div>
                      )}

                    </div>

                    {/* Blushing Peach Cheeks & Mouth Row */}
                    <div className="flex items-center justify-between w-full px-4 -mt-1">
                      {/* Left Peach Cheek */}
                      <div
                        className="h-3 w-5 rounded-full shadow-xs"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, #FDBA74 0%, #FB923C 65%, transparent 100%)",
                          opacity: 0.85,
                        }}
                      />

                      {/* Dynamic State Mouth */}
                      {behaviorState === "sleep" ? (
                        <div className="h-1.5 w-3 rounded-full bg-stone-700/80" />
                      ) : behaviorState === "dance" || behaviorState === "celebrate" ? (
                        /* Open joyful smiling mouth with cute pink tongue */
                        <div className="h-4 w-5 rounded-b-full border-2 border-stone-800 bg-rose-400 overflow-hidden relative shadow-inner">
                          <div className="absolute bottom-0 inset-x-0 h-2 bg-rose-500 rounded-t-full" />
                        </div>
                      ) : behaviorState === "think" ? (
                        /* Curious little 'o' */
                        <div className="h-2.5 w-2.5 rounded-full border-2 border-stone-800 bg-stone-700" />
                      ) : behaviorState === "encourage" ? (
                        /* Gentle, warm, comforting smile */
                        <div className="h-2 w-4 border-b-2 border-stone-800 rounded-b-full" />
                      ) : (
                        /* Idle sweet smile */
                        <div className="h-2 w-3.5 border-b-2 border-stone-800 rounded-b-full" />
                      )}

                      {/* Right Peach Cheek */}
                      <div
                        className="h-3 w-5 rounded-full shadow-xs"
                        style={{
                          background:
                            "radial-gradient(ellipse at center, #FDBA74 0%, #FB923C 65%, transparent 100%)",
                          opacity: 0.85,
                        }}
                      />
                    </div>

                  </div>

                  {/* Cream Belly Insert with 3D Bevel & Heart */}
                  <div
                    className="relative w-28 h-12 rounded-[22px] flex items-center justify-center shadow-inner mb-0.5"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #FFFBEB 45%, #FEF3C7 85%, #FDE68A 100%)",
                      boxShadow:
                        "inset 1px 1px 3px rgba(255,255,255,0.9), inset -1px -2px 3px rgba(180, 83, 9, 0.15), 0 2px 4px rgba(88, 28, 135, 0.1)",
                    }}
                  >
                    {/* Cute tactile heart / accessibility icon */}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-rose-500 drop-shadow-xs" role="img" aria-hidden="true">
                        ❤️
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider text-purple-900/70">
                        a11y
                      </span>
                    </div>
                  </div>

                </div>

                {/* Tiny Rounded Arms */}
                {/* Left Arm */}
                <div
                  className={`absolute -left-3 top-20 h-10 w-4 rounded-full shadow-md ${
                    behaviorState === "dance"
                      ? "animate-robot-dance-arm-l"
                      : behaviorState === "celebrate" || behaviorState === "waking"
                      ? "-rotate-45 -translate-y-4"
                      : "rotate-12"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #FAF5FF 0%, #D8B4FE 50%, #9333EA 100%)",
                    boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.7), -1px 2px 4px rgba(0,0,0,0.15)",
                  }}
                />

                {/* Right Arm (Waves in WAVE state!) */}
                <div
                  className={`absolute -right-3 top-20 h-10 w-4 rounded-full shadow-md ${
                    behaviorState === "wave"
                      ? "animate-robot-wave-arm -translate-y-3"
                      : behaviorState === "dance"
                      ? "animate-robot-dance-arm-r"
                      : behaviorState === "celebrate" || behaviorState === "waking"
                      ? "rotate-45 -translate-y-4"
                      : behaviorState === "think"
                      ? "-rotate-45 -translate-y-2 -translate-x-1"
                      : "-rotate-12"
                  }`}
                  style={{
                    background:
                      "linear-gradient(225deg, #FAF5FF 0%, #D8B4FE 50%, #9333EA 100%)",
                    boxShadow: "inset -1px 1px 2px rgba(255,255,255,0.7), 1px 2px 4px rgba(0,0,0,0.15)",
                  }}
                />

                {/* Tiny Rounded Clay Feet */}
                <div className="flex items-center justify-between w-24 -mt-1 z-0 px-2">
                  <div
                    className="h-3.5 w-8 rounded-full shadow-md"
                    style={{
                      background:
                        "linear-gradient(to bottom, #E9D5FF 0%, #C084FC 60%, #7E22CE 100%)",
                      boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.15)",
                    }}
                  />
                  <div
                    className="h-3.5 w-8 rounded-full shadow-md"
                    style={{
                      background:
                        "linear-gradient(to bottom, #E9D5FF 0%, #C084FC 60%, #7E22CE 100%)",
                      boxShadow: "inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.15)",
                    }}
                  />
                </div>

              </div>

              {/* Soft Ground Contact Shadow (Breathes and stretches) */}
              <div
                className="w-32 h-3.5 rounded-full bg-purple-950/15 blur-xs mt-1.5 transition-all duration-300"
                style={{
                  transform:
                    behaviorState === "dance" || behaviorState === "celebrate"
                      ? "scale(0.85) translateY(4px)"
                      : "scale(1)",
                  opacity:
                    behaviorState === "dance" || behaviorState === "celebrate"
                      ? 0.15
                      : 0.3,
                }}
              />
            </div>
          </div>
        ) : (
          /* =================================================================
             Spline 3D Scene Viewer Container
             ================================================================= */
          <div className="flex flex-col items-center justify-center text-center p-3 w-full h-full bg-stone-900/95 rounded-2xl text-white">
            <div className="relative mb-2 flex items-center justify-center h-12 w-12 rounded-xl bg-purple-600/30 border border-purple-400/40">
              <span className="text-xl">🧊</span>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              Spline 3D Scene Runtime
            </h4>
            <p className="text-[11px] text-stone-300 max-w-xs mb-2 leading-tight">
              Embed your Spline export URL below to run WebGL 3D directly:
            </p>
            <input
              type="text"
              value={splineUrl}
              onChange={(e) => setSplineUrl(e.target.value)}
              className="w-full bg-stone-950 rounded-lg px-2.5 py-1.5 font-mono text-[10px] text-purple-300 border border-stone-800 focus:outline-none focus:border-purple-500 mb-2"
              placeholder="https://prod.spline.design/.../scene.splinecode"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("clay-3d")}
                className="rounded-full bg-purple-700 hover:bg-purple-800 px-3 py-1 text-[11px] font-bold text-white"
              >
                ← Back to 3D Clay
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Speech Bubble (Displays State Messages) */}
      {speechText && (
        <div
          role="status"
          aria-live="polite"
          className="mt-3 relative max-w-xs sm:max-w-sm rounded-2xl border border-stone-200/90 bg-white p-3 shadow-md shadow-stone-200/50 transition-all"
        >
          {/* Arrow Pointer */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-stone-200 rotate-45" />

          <div className="relative flex items-center gap-2">
            <span className="text-base" role="img" aria-hidden="true">
              {behaviorState === "sleep"
                ? "💤"
                : behaviorState === "think"
                ? "🤔"
                : behaviorState === "celebrate" || behaviorState === "dance"
                ? "🎉"
                : behaviorState === "encourage"
                ? "💜"
                : "✨"}
            </span>
            <p className="text-xs font-bold text-stone-800 leading-snug">
              {speechText}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Behavior Playground / State Tester */}
      <div className="mt-3 w-full max-w-xs sm:max-w-sm bg-white/80 rounded-2xl border border-stone-200/80 p-2 shadow-xs">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
            Current State: <span className="text-purple-700 font-bold uppercase">{behaviorState}</span>
          </span>
          <span className="text-[10px] font-medium text-stone-400">
            Auto-sleeps in 30s
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
          <button
            type="button"
            onClick={() => handleStateChange("wave")}
            title="1. Wave Hello"
            className={`rounded-lg py-1 px-1 text-[10px] font-bold transition-all cursor-pointer ${
              behaviorState === "wave"
                ? "bg-purple-600 text-white"
                : "bg-stone-50 hover:bg-purple-50 text-stone-700"
            }`}
          >
            👋 Wave
          </button>
          <button
            type="button"
            onClick={() => handleStateChange("idle")}
            title="2. Idle Float"
            className={`rounded-lg py-1 px-1 text-[10px] font-bold transition-all cursor-pointer ${
              behaviorState === "idle"
                ? "bg-purple-600 text-white"
                : "bg-stone-50 hover:bg-purple-50 text-stone-700"
            }`}
          >
            ✨ Idle
          </button>
          <button
            type="button"
            onClick={() => handleStateChange("think")}
            title="3. Think / Scanning"
            className={`rounded-lg py-1 px-1 text-[10px] font-bold transition-all cursor-pointer ${
              behaviorState === "think"
                ? "bg-purple-600 text-white"
                : "bg-stone-50 hover:bg-purple-50 text-stone-700"
            }`}
          >
            🤔 Think
          </button>
          <button
            type="button"
            onClick={() => handleStateChange("dance")}
            title="4. Dance Joyfully"
            className={`rounded-lg py-1 px-1 text-[10px] font-bold transition-all cursor-pointer ${
              behaviorState === "dance"
                ? "bg-purple-600 text-white"
                : "bg-stone-50 hover:bg-purple-50 text-stone-700"
            }`}
          >
            💃 Dance
          </button>
          <button
            type="button"
            onClick={() => handleStateChange("sleep")}
            title="5. Sleep (30s Inactivity)"
            className={`rounded-lg py-1 px-1 text-[10px] font-bold transition-all cursor-pointer ${
              behaviorState === "sleep"
                ? "bg-purple-600 text-white"
                : "bg-stone-50 hover:bg-purple-50 text-stone-700"
            }`}
          >
            💤 Sleep
          </button>
          <button
            type="button"
            onClick={() => handleStateChange("celebrate")}
            title="6. Celebrate Fix"
            className={`rounded-lg py-1 px-1 text-[10px] font-bold transition-all cursor-pointer ${
              behaviorState === "celebrate"
                ? "bg-purple-600 text-white"
                : "bg-stone-50 hover:bg-purple-50 text-stone-700"
            }`}
          >
            🎉 Hooray
          </button>
          <button
            type="button"
            onClick={() => handleStateChange("encourage")}
            title="7. Supportive Encourage"
            className={`rounded-lg py-1 px-1 text-[10px] font-bold transition-all cursor-pointer ${
              behaviorState === "encourage"
                ? "bg-purple-600 text-white"
                : "bg-stone-50 hover:bg-purple-50 text-stone-700"
            }`}
          >
            💜 Kind
          </button>
        </div>
      </div>
    </div>
  );
}
