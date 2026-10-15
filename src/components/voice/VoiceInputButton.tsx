"use client";

import React, { useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTranslation } from "@/context/LanguageContext";
import { LANGUAGE_METAS } from "@/types/i18n";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  normalizeAsUrl?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export default function VoiceInputButton({
  onTranscript,
  normalizeAsUrl = true,
  className = "",
  size = "md",
}: VoiceInputButtonProps) {
  const { currentLanguage, t } = useTranslation();
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  const {
    isSupported,
    speechState,
    transcript,
    errorMessage,
    startListening,
    stopListening,
    cancelListening,
  } = useSpeechRecognition({
    normalizeAsUrl,
    onResult: (text, isFinal) => {
      onTranscript(text);
    },
  });

  const languageName = LANGUAGE_METAS[currentLanguage]?.nativeName || "English";

  const isListening = speechState === "listening";
  const isProcessing = speechState === "processing";

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Active Listening Popover Controls */}
      {isListening && (
        <div
          role="status"
          aria-live="assertive"
          className="absolute -top-14 right-0 z-50 flex items-center gap-2 rounded-2xl border-2 border-rose-300 bg-white px-3 py-1.5 shadow-xl shadow-rose-900/10 animate-fade-in whitespace-nowrap text-xs"
        >
          {/* Animated pulsing red audio indicator */}
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600" />
          </span>

          <span className="font-bold text-stone-800">
            {t("voice_listening_indicator")} ({languageName})
          </span>

          <button
            type="button"
            onClick={stopListening}
            className="rounded-lg bg-stone-900 px-2.5 py-0.5 font-bold text-white hover:bg-stone-800 active:scale-95 text-[11px]"
            title={t("voice_stop_btn")}
          >
            ✓ {t("voice_stop_btn")}
          </button>

          <button
            type="button"
            onClick={cancelListening}
            className="rounded-lg bg-stone-100 px-2 py-0.5 font-bold text-stone-600 hover:bg-stone-200 active:scale-95 text-[11px]"
            title={t("voice_cancel_btn")}
          >
            ✕
          </button>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div
          role="status"
          aria-live="polite"
          className="absolute -top-12 right-0 z-50 flex items-center gap-2 rounded-2xl border border-purple-300 bg-purple-50 px-3 py-1.5 shadow-lg text-xs font-bold text-purple-900 animate-pulse whitespace-nowrap"
        >
          <span>✨</span>
          <span>{t("voice_processing_indicator")}</span>
        </div>
      )}

      {/* Main Microphone Action Button */}
      <button
        type="button"
        onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
        }}
        disabled={!isSupported}
        aria-label={
          isListening
            ? t("voice_stop_btn")
            : `${t("voice_dictate_tooltip")} (${languageName})`
        }
        title={
          !isSupported
            ? t("voice_unsupported_msg")
            : `${t("voice_dictate_tooltip")} (${languageName})`
        }
        className={`relative group inline-flex items-center justify-center rounded-xl transition-all cursor-pointer ${
          size === "sm" ? "h-8 w-8 text-sm" : "h-9 w-9 text-base"
        } ${
          isListening
            ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 ring-2 ring-rose-400"
            : isProcessing
            ? "bg-purple-100 text-purple-700 animate-spin"
            : !isSupported
            ? "opacity-40 cursor-not-allowed bg-stone-100 text-stone-400"
            : "bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-900 border border-purple-200/90 active:scale-95"
        }`}
      >
        {isListening ? (
          <span className="animate-pulse">🔴</span>
        ) : isProcessing ? (
          <span>⏳</span>
        ) : (
          <span>🎙️</span>
        )}
      </button>

      {/* Privacy disclosure info button */}
      <button
        type="button"
        onClick={() => setShowPrivacyNotice(!showPrivacyNotice)}
        className="ml-1 text-[11px] text-stone-400 hover:text-stone-700 p-0.5 rounded-full"
        title="Voice Speech Privacy Information"
        aria-label="Voice Speech Privacy Information"
      >
        ℹ️
      </button>

      {/* Privacy Notice Card */}
      {showPrivacyNotice && (
        <div
          role="dialog"
          aria-label="Speech Privacy Notice"
          className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-stone-200 bg-white p-3.5 shadow-xl text-xs space-y-2 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <span>🔒</span> Voice Privacy & Technology
            </span>
            <button
              type="button"
              onClick={() => setShowPrivacyNotice(false)}
              className="text-stone-400 hover:text-stone-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <p className="text-stone-600 leading-relaxed text-[11px]">
            {t("voice_disclaimer")}
          </p>
          <div className="rounded-lg bg-purple-50 p-2 text-[10px] text-purple-900">
            Current recognition locale: <strong>{LANGUAGE_METAS[currentLanguage]?.bcp47}</strong> ({languageName})
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {errorMessage && (
        <div
          role="alert"
          className="absolute -bottom-12 right-0 z-50 flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-800 shadow-md animate-fade-in whitespace-nowrap"
        >
          <span>⚠️</span>
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={cancelListening}
            className="text-rose-700 hover:text-rose-900 ml-1 font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
