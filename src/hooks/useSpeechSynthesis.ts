"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { LANGUAGE_METAS } from "@/types/i18n";

export type TTSPlaybackState = "idle" | "playing" | "paused";

interface UseSpeechSynthesisProps {
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export function useSpeechSynthesis(props: UseSpeechSynthesisProps = {}) {
  const { currentLanguage } = useTranslation();
  const [playbackState, setPlaybackState] = useState<TTSPlaybackState>("idle");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      const targetBcp47 = LANGUAGE_METAS[currentLanguage]?.bcp47 || "en-IN";
      const targetLangPrefix = targetBcp47.split("-")[0].toLowerCase();

      // Find exact BCP 47 match first (e.g. 'hi-IN')
      let matchedVoice = voices.find(
        (v) => v.lang.toLowerCase() === targetBcp47.toLowerCase()
      );

      // Or match language prefix (e.g. 'hi')
      if (!matchedVoice) {
        matchedVoice = voices.find((v) =>
          v.lang.toLowerCase().startsWith(targetLangPrefix)
        );
      }

      // Or fallback to en-IN or default system voice
      if (!matchedVoice) {
        matchedVoice = voices.find((v) =>
          v.lang.toLowerCase().includes("en-in")
        ) || voices.find((v) => v.default) || voices[0] || null;
      }

      setCurrentVoice(matchedVoice);
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [currentLanguage, isSupported]);

  // Stop playback cleanly
  const stop = useCallback(() => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setPlaybackState("idle");
    utteranceRef.current = null;
  }, [isSupported]);

  // Pause playback
  const pause = useCallback(() => {
    if (!isSupported || playbackState !== "playing") return;
    try {
      window.speechSynthesis.pause();
      setPlaybackState("paused");
    } catch {}
  }, [isSupported, playbackState]);

  // Resume playback
  const resume = useCallback(() => {
    if (!isSupported || playbackState !== "paused") return;
    try {
      window.speechSynthesis.resume();
      setPlaybackState("playing");
    } catch {}
  }, [isSupported, playbackState]);

  // Speak text
  const speak = useCallback(
    (textToSpeak: string) => {
      if (!isSupported || !textToSpeak.trim()) return;

      // Cancel any ongoing speech
      stop();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      const targetBcp47 = LANGUAGE_METAS[currentLanguage]?.bcp47 || "en-IN";
      utterance.lang = targetBcp47;

      if (currentVoice) {
        utterance.voice = currentVoice;
      }

      // Gentle, friendly tone and cadence
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setPlaybackState("playing");
      };

      utterance.onpause = () => {
        setPlaybackState("paused");
      };

      utterance.onresume = () => {
        setPlaybackState("playing");
      };

      utterance.onend = () => {
        setPlaybackState("idle");
        utteranceRef.current = null;
        if (props.onEnd) props.onEnd();
      };

      utterance.onerror = (e) => {
        setPlaybackState("idle");
        utteranceRef.current = null;
        if (props.onError) props.onError(e);
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        setPlaybackState("idle");
      }
    },
    [currentLanguage, currentVoice, isSupported, props, stop]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    };
  }, [isSupported]);

  return {
    isSupported,
    playbackState,
    currentVoice,
    availableVoices,
    speak,
    pause,
    resume,
    stop,
  };
}
