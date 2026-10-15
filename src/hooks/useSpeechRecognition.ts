"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";
import { LANGUAGE_METAS } from "@/types/i18n";

interface SpeechRecognitionHookOptions {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  normalizeAsUrl?: boolean;
}

export type SpeechState =
  | "idle"
  | "listening"
  | "processing"
  | "unsupported"
  | "denied"
  | "error";

export function useSpeechRecognition(options: SpeechRecognitionHookOptions = {}) {
  const { currentLanguage, t } = useTranslation();
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  // Check browser support
  const isSupported =
    typeof window !== "undefined" &&
    Boolean(
      (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
    );

  const normalizeUrlVoiceText = (raw: string): string => {
    let cleaned = raw.trim();

    // Convert common spoken punctuation in URL context
    cleaned = cleaned
      .replace(/\bdot\b/gi, ".")
      .replace(/\bpoint\b/gi, ".")
      .replace(/\bslash\b/gi, "/")
      .replace(/\bcolon\b/gi, ":")
      .replace(/\bhyphen\b/gi, "-")
      .replace(/\bdash\b/gi, "-")
      .replace(/\bunderscore\b/gi, "_")
      .replace(/\bat\s*(the)?\s*rate\b/gi, "@")
      .replace(/\bspace\b/gi, "");

    // Handle spoken "w w w" or "www dot"
    cleaned = cleaned
      .replace(/\bw\s+w\s+w\b/gi, "www")
      .replace(/\bwww\s*\./gi, "www.");

    // Remove unwanted spaces in common TLDs like ". com"
    cleaned = cleaned.replace(/\.\s+([a-z]{2,})/gi, ".$1");

    // If spoken as "https colon slash slash"
    cleaned = cleaned.replace(/https?\s*:\s*\/\s*\//gi, (match) =>
      match.replace(/\s+/g, "")
    );

    // Remove internal spaces
    cleaned = cleaned.replace(/\s+/g, "");

    return cleaned;
  };

  const cleanup = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setSpeechState("processing");
    }
  }, []);

  const cancelListening = useCallback(() => {
    cleanup();
    setSpeechState("idle");
    setTranscript("");
    setErrorMessage(null);
  }, [cleanup]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setSpeechState("unsupported");
      setErrorMessage(
        t("voice_unsupported_msg") ||
          "Speech recognition is not supported in this browser."
      );
      return;
    }

    cleanup();

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionConstructor();
    recognitionRef.current = recognition;

    const bcp47 = LANGUAGE_METAS[currentLanguage]?.bcp47 || "en-IN";
    recognition.lang = bcp47;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    setSpeechState("listening");
    setErrorMessage(null);

    recognition.onstart = () => {
      isListeningRef.current = true;
      setSpeechState("listening");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const rawText = finalTranscript || interimTranscript;
      const processed = options.normalizeAsUrl
        ? normalizeUrlVoiceText(rawText)
        : rawText;

      setTranscript(processed);

      if (options.onResult) {
        options.onResult(processed, Boolean(finalTranscript));
      }
    };

    recognition.onerror = (event: any) => {
      isListeningRef.current = false;
      const error = event.error;

      if (error === "not-allowed" || error === "service-not-allowed") {
        setSpeechState("denied");
        setErrorMessage(
          "Microphone permission was denied. Please allow microphone access in your browser settings."
        );
      } else if (error === "no-speech") {
        setSpeechState("idle");
        setErrorMessage("No speech was detected. Please try speaking again.");
      } else if (error === "network") {
        setSpeechState("error");
        setErrorMessage(
          "Network error occurred during speech recognition. Audio transcription requires connectivity."
        );
      } else {
        setSpeechState("error");
        setErrorMessage(`Speech recognition error: ${error}`);
      }

      if (options.onError) {
        options.onError(error);
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setSpeechState("idle");
    };

    try {
      recognition.start();
    } catch (err: any) {
      setSpeechState("error");
      setErrorMessage(
        err.message || "Failed to start speech recognition."
      );
    }
  }, [cleanup, currentLanguage, isSupported, options, t]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isSupported,
    speechState,
    transcript,
    errorMessage,
    startListening,
    stopListening,
    cancelListening,
    currentLanguage,
  };
}
