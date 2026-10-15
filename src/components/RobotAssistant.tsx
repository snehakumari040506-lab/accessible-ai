"use client";

import React, { useState } from "react";
import { useMascot } from "@/context/MascotContext";
import RobotMascot3D from "./RobotMascot3D";

interface RobotAssistantProps {
  variant?: "hero" | "scanner-sidebar" | "floating-mobile";
}

export default function RobotAssistant({ variant = "hero" }: RobotAssistantProps) {
  const {
    behaviorState,
    speechText,
    isScanning,
    scanProgressMessage,
    selectedFinding,
    activeScanResult,
  } = useMascot();

  const [chatOpen, setChatOpen] = useState(false);
  const [questionInput, setQuestionInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ sender: "user" | "doctor"; text: string }>
  >([]);
  const [isAsking, setIsAsking] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleAskDoctor = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg = questionText.trim();
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setQuestionInput("");
    setIsAsking(true);
    setChatOpen(true);

    try {
      const res = await fetch("/api/doctor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMsg,
          selectedFinding,
          allFindings: activeScanResult?.findings || [],
          score: activeScanResult?.score.totalScore,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setChatHistory((prev) => [...prev, { sender: "doctor", text: data.reply }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { sender: "doctor", text: "I'm having a little trouble connecting right now, but feel free to review the fix instructions on the issue card! 💜" },
        ]);
      }
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { sender: "doctor", text: "Dr. Pip is momentarily offline. Let's inspect the code before-and-after snippet! ✨" },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  // 1. Scanner Sidebar Variant (Desktop Side Panel beside Scanner & Results)
  if (variant === "scanner-sidebar") {
    return (
      <aside
        className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4 sticky top-24 z-20 self-start"
        aria-label="AI Accessibility Assistant Panel"
      >
        <div className="rounded-3xl border-2 border-purple-200/90 bg-white p-4 shadow-xl shadow-purple-900/5">
          {/* Header Label */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                Dr. Pip • Live Assistant
              </span>
            </div>
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 uppercase">
              {behaviorState}
            </span>
          </div>

          {/* Persistent Animated Robot Mascot */}
          <div className="py-2 flex justify-center">
            <div className="scale-85 sm:scale-90 origin-top">
              <RobotMascot3D />
            </div>
          </div>

          {/* Scanning Progress Notification */}
          {isScanning && scanProgressMessage && (
            <div className="rounded-2xl border border-purple-300 bg-purple-50/80 p-3 text-xs text-purple-950 font-medium animate-pulse flex items-center gap-2.5">
              <span className="animate-spin text-base">✨</span>
              <span>{scanProgressMessage}</span>
            </div>
          )}

          {/* Ask the Accessibility Doctor Card */}
          <div className="mt-2 pt-3 border-t border-stone-100 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <span>🩺</span>
                <span>Ask the Accessibility Doctor</span>
              </span>
              <button
                type="button"
                onClick={() => setChatOpen(!chatOpen)}
                className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
              >
                {chatOpen ? "Hide Chat" : "Open Chat"}
              </button>
            </div>

            {/* Quick Consultation Chips */}
            <div className="flex flex-col gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => handleAskDoctor("Why is this an accessibility problem?")}
                className="text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-300 p-2 text-xs font-semibold text-stone-700 transition-all cursor-pointer"
              >
                ❓ Why is this an accessibility problem?
              </button>
              <button
                type="button"
                onClick={() => handleAskDoctor("How do I fix this?")}
                className="text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-300 p-2 text-xs font-semibold text-stone-700 transition-all cursor-pointer"
              >
                🛠️ How do I fix this?
              </button>
              <button
                type="button"
                onClick={() => handleAskDoctor("Can you explain this code to a beginner?")}
                className="text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-300 p-2 text-xs font-semibold text-stone-700 transition-all cursor-pointer"
              >
                👶 Explain to a beginner
              </button>
              <button
                type="button"
                onClick={() => handleAskDoctor("Which issue should I fix first?")}
                className="text-left rounded-xl border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-300 p-2 text-xs font-semibold text-stone-700 transition-all cursor-pointer"
              >
                🎯 Which issue should I fix first?
              </button>
            </div>

            {/* Chat Drawer / History */}
            {chatOpen && (
              <div className="mt-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 max-h-60 overflow-y-auto space-y-2.5 text-xs">
                {chatHistory.length === 0 ? (
                  <p className="text-stone-500 italic text-[11px]">
                    No messages yet. Click any quick question above or type your own below!
                  </p>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white ml-4 font-medium"
                          : "bg-white text-stone-800 border border-stone-200 mr-2 leading-relaxed"
                      }`}
                    >
                      <span className="block font-black text-[10px] uppercase tracking-wider mb-0.5 opacity-80">
                        {msg.sender === "user" ? "You" : "Dr. Pip"}
                      </span>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                  ))
                )}
                {isAsking && (
                  <div className="p-2 bg-white rounded-xl text-stone-500 italic text-xs animate-pulse">
                    Dr. Pip is diagnosing... ✨
                  </div>
                )}
              </div>
            )}

            {/* Freeform question input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskDoctor(questionInput);
              }}
              className="mt-2 flex gap-1.5"
            >
              <input
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask Dr. Pip anything..."
                className="flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                disabled={isAsking || !questionInput.trim()}
                className="rounded-xl bg-purple-700 px-3 py-2 text-xs font-black text-white hover:bg-purple-800 disabled:opacity-50 cursor-pointer"
              >
                Ask
              </button>
            </form>
          </div>
        </div>
      </aside>
    );
  }

  // 2. Floating Mobile Variant (Sticky Bottom Assistant on mobile screens)
  if (variant === "floating-mobile") {
    return (
      <div className="lg:hidden fixed bottom-4 right-4 z-40 max-w-[90vw]">
        {!mobileExpanded ? (
          <button
            type="button"
            onClick={() => setMobileExpanded(true)}
            className="flex items-center gap-2 rounded-full border-2 border-purple-300 bg-white/95 px-4 py-2.5 shadow-xl shadow-purple-900/15 backdrop-blur-md active:scale-95 cursor-pointer"
            aria-label="Open Dr. Pip Assistant"
          >
            <span className="text-xl" role="img" aria-hidden="true">
              🩺
            </span>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black text-purple-950">Dr. Pip</span>
              <span className="text-[9px] font-bold text-stone-500 truncate max-w-[140px]">
                {speechText || "Ready to assist ✨"}
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        ) : (
          <div className="w-[320px] rounded-3xl border-2 border-purple-300 bg-white p-4 shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-black text-purple-900">Dr. Pip • Mobile Assistant</span>
              <button
                type="button"
                onClick={() => setMobileExpanded(false)}
                className="rounded-full bg-stone-100 p-1 text-stone-600 hover:bg-stone-200 text-xs px-2"
              >
                ✕ Close
              </button>
            </div>
            <div className="scale-75 origin-top -my-8">
              <RobotMascot3D />
            </div>
            <div className="mt-4 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => {
                  handleAskDoctor("How do I fix this?");
                  setChatOpen(true);
                }}
                className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-bold text-stone-700"
              >
                🛠️ How do I fix this?
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAskDoctor("Which issue should I fix first?");
                  setChatOpen(true);
                }}
                className="rounded-xl border border-stone-200 bg-stone-50 p-2 text-xs font-bold text-stone-700"
              >
                🎯 Which issue should I fix first?
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Default Hero Variant
  return <RobotMascot3D />;
}
