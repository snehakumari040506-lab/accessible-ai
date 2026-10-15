"use client";

import React from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useTranslation } from "@/context/LanguageContext";

interface ReadAloudButtonProps {
  textToRead: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function ReadAloudButton({
  textToRead,
  label,
  className = "",
  size = "sm",
}: ReadAloudButtonProps) {
  const { t } = useTranslation();
  const { isSupported, playbackState, currentVoice, speak, pause, resume, stop } =
    useSpeechSynthesis();

  if (!isSupported) {
    return null;
  }

  const isPlaying = playbackState === "playing";
  const isPaused = playbackState === "paused";

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {isPlaying ? (
        <div className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-purple-50 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              pause();
            }}
            className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-purple-900 shadow-xs hover:bg-stone-50 cursor-pointer"
            title={t("issue_card_pause_speech")}
            aria-label={t("issue_card_pause_speech")}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
            </span>
            <span>⏸️ {t("issue_card_pause_speech")}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stop();
            }}
            className="rounded-full bg-stone-100 px-2 py-1 text-[11px] font-bold text-stone-600 hover:bg-stone-200 cursor-pointer"
            title={t("issue_card_stop_speech")}
            aria-label={t("issue_card_stop_speech")}
          >
            ⏹️
          </button>
        </div>
      ) : isPaused ? (
        <div className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 p-0.5 shadow-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resume();
            }}
            className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-xs hover:bg-amber-100 cursor-pointer"
            title={t("issue_card_resume_speech")}
            aria-label={t("issue_card_resume_speech")}
          >
            <span>▶️ {t("issue_card_resume_speech")}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              stop();
            }}
            className="rounded-full bg-stone-100 px-2 py-1 text-[11px] font-bold text-stone-600 hover:bg-stone-200 cursor-pointer"
            title={t("issue_card_stop_speech")}
            aria-label={t("issue_card_stop_speech")}
          >
            ⏹️
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            speak(textToRead);
          }}
          className={`group flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-purple-50 hover:border-purple-300 font-bold text-stone-700 hover:text-purple-900 transition-all cursor-pointer shadow-xs ${
            size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
          }`}
          title={`${t("issue_card_read_aloud")}${
            currentVoice ? ` (${currentVoice.name})` : ""
          }`}
          aria-label={`${t("issue_card_read_aloud")}${
            currentVoice ? ` (${currentVoice.name})` : ""
          }`}
        >
          <span className="text-sm group-hover:scale-110 transition-transform">
            🔊
          </span>
          <span>{label || t("issue_card_read_aloud")}</span>
        </button>
      )}
    </div>
  );
}
