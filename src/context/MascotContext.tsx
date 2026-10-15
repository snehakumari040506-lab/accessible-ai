"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { AccessibilityFinding, ScanResult } from "@/types/scanner";
import { useTranslation } from "@/context/LanguageContext";

export type MascotBehaviorState =
  | "idle"
  | "wave"
  | "dance"
  | "sleep"
  | "think"
  | "celebrate"
  | "encourage"
  | "waking";

export type WebsiteEvent =
  | "initial_visit"
  | "scan_start"
  | "scan_complete_clean"
  | "scan_complete_issues"
  | "rescan_improvement"
  | "scan_error"
  | "fix_applied"
  | "user_active"
  | "manual_trigger";

export type ActiveAppView = "homepage" | "scanner";

interface MascotContextType {
  behaviorState: MascotBehaviorState;
  speechText: string | null;
  setBehaviorState: (state: MascotBehaviorState) => void;
  setSpeechText: (text: string | null) => void;
  triggerEvent: (event: WebsiteEvent, customSpeech?: string) => void;
  isSleeping: boolean;
  wakeUp: () => void;

  // Persistent App View & Scanner State
  activeView: ActiveAppView;
  setActiveView: (view: ActiveAppView) => void;
  selectedFinding: AccessibilityFinding | null;
  setSelectedFinding: (finding: AccessibilityFinding | null) => void;
  activeScanResult: ScanResult | null;
  setActiveScanResult: (result: ScanResult | null) => void;
  scanHistory: ScanResult[];
  addScanToHistory: (result: ScanResult) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  scanProgressMessage: string;
  setScanProgressMessage: (msg: string) => void;

  lastScannedUrl: string;
  scanError: string | null;

  // Integrated Workflow Handlers
  startScanningWorkflow: (targetUrl: string) => Promise<void>;
  cancelScan: () => void;
  retryLastScan: () => void;
  markFindingReviewed: (findingId: string) => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);


// 30 seconds inactivity timeout as required
const INACTIVITY_TIMEOUT_MS = 30000;

export function MascotProvider({ children }: { children: React.ReactNode }) {
  const { t, language } = useTranslation();
  const [behaviorState, setBehaviorState] = useState<MascotBehaviorState>("wave");
  const [speechText, setSpeechText] = useState<string | null>(t("mascot_wave") || "Hi there! Ready to make the web kinder? ✨");
  const [isSleeping, setIsSleeping] = useState(false);

  // Sync mascot speech whenever language changes
  useEffect(() => {
    if (behaviorState === "wave") {
      setSpeechText(t("mascot_wave"));
    } else if (behaviorState === "think") {
      setSpeechText(t("mascot_think"));
    } else if (behaviorState === "encourage") {
      setSpeechText(t("mascot_encourage"));
    } else if (behaviorState === "celebrate" || behaviorState === "dance") {
      setSpeechText(t("mascot_celebrate"));
    }
  }, [language, t, behaviorState]);

  // Scanner workflow states
  const [activeView, setActiveView] = useState<ActiveAppView>("homepage");
  const [selectedFinding, setSelectedFinding] = useState<AccessibilityFinding | null>(null);
  const [activeScanResult, setActiveScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgressMessage, setScanProgressMessage] = useState("");
  const [lastScannedUrl, setLastScannedUrl] = useState("");
  const [scanError, setScanError] = useState<string | null>(null);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stateResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const isScanningRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // 35-second client-side scanning timeout
  const CLIENT_SCAN_TIMEOUT_MS = 35000;


  // Helper to transition state with optional auto-reset to idle after duration
  const transitionToState = useCallback(
    (newState: MascotBehaviorState, speech: string | null, autoResetMs?: number) => {
      if (stateResetTimerRef.current) {
        clearTimeout(stateResetTimerRef.current);
        stateResetTimerRef.current = null;
      }

      setBehaviorState(newState);
      if (speech !== undefined) {
        setSpeechText(speech);
      }
      setIsSleeping(newState === "sleep");

      if (autoResetMs && autoResetMs > 0) {
        stateResetTimerRef.current = setTimeout(() => {
          setBehaviorState("idle");
          stateResetTimerRef.current = null;
        }, autoResetMs);
      }
    },
    []
  );

  // Wake up routine from sleep
  const wakeUp = useCallback(() => {
    if (behaviorState === "sleep") {
      transitionToState("waking", "Mmh... I'm awake! Ready whenever you are ✨", 1500);
    }
  }, [behaviorState, transitionToState]);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (behaviorState === "sleep") {
      wakeUp();
      return;
    }

    inactivityTimerRef.current = setTimeout(() => {
      transitionToState("sleep", "Zzz... Resting until you need me 💤");
    }, INACTIVITY_TIMEOUT_MS);
  }, [behaviorState, transitionToState, wakeUp]);

  // Initial visit: Robot starts in WAVE state
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      transitionToState("wave", "Hi there! Ready to make the web kinder? ✨", 5500);
      resetInactivityTimer();
    }
  }, [resetInactivityTimer, transitionToState]);

  // Listen for user activity events
  useEffect(() => {
    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach((ev) => {
      window.addEventListener(ev, handleUserActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((ev) => {
        window.removeEventListener(ev, handleUserActivity);
      });
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (stateResetTimerRef.current) clearTimeout(stateResetTimerRef.current);
    };
  }, [resetInactivityTimer]);

  // Add scan to history
  const addScanToHistory = useCallback((result: ScanResult) => {
    setScanHistory((prev) => [result, ...prev.slice(0, 9)]); // keep last 10 scans
  }, []);

  // Central Website Event Dispatcher
  const triggerEvent = useCallback(
    (event: WebsiteEvent, customSpeech?: string) => {
      switch (event) {
        case "initial_visit":
          transitionToState(
            "wave",
            customSpeech || t("mascot_wave"),
            5000
          );
          break;

        case "scan_start":
          // Requirement 1 & 2: Scanning - curious expression, thinking animation, rotating sparkle
          transitionToState(
            "think",
            customSpeech || t("mascot_think")
          );
          break;

        case "scan_complete_clean":
          // Requirement 1: No issues detected by automated checks - celebrate gently with honest reminder
          transitionToState(
            "celebrate",
            customSpeech || t("mascot_celebrate")
          );
          break;

        case "scan_complete_issues":
          // Requirement 1: Issues found - concerned but friendly expression
          transitionToState(
            "encourage",
            customSpeech || t("mascot_encourage")
          );
          break;

        case "rescan_improvement":
          // Requirement 1: Fix verified by a new scan - dance and celebrate ONLY when new scan confirms improvement
          transitionToState(
            "dance",
            customSpeech || t("mascot_celebrate")
          );
          break;

        case "scan_error":
          // Requirement 1: Error - reassuring expression with helpful error message
          transitionToState(
            "encourage",
            customSpeech ||
              "I couldn't reach that website. Let's verify the URL or try our safe civic test fixture! 🤝"
          );
          break;

        case "fix_applied":
          transitionToState(
            "celebrate",
            customSpeech || "Awesome fix! That digital barrier is gone 🎉✨",
            6000
          );
          break;

        case "user_active":
          if (behaviorState === "sleep") {
            wakeUp();
          }
          break;

        case "manual_trigger":
          break;
      }
    },
    [behaviorState, transitionToState, wakeUp, t]
  );

  // Cancel active scan if in progress
  const cancelScan = useCallback(() => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
      activeAbortControllerRef.current = null;
    }
  }, []);

  // Full real scanning workflow integration with AbortController and timeout
  const startScanningWorkflow = useCallback(
    async (targetUrl: string) => {
      // Prevent duplicate concurrent scans
      if (isScanningRef.current) {
        return;
      }

      isScanningRef.current = true;
      setIsScanning(true);
      setLastScannedUrl(targetUrl);
      setScanError(null);
      setActiveView("scanner");
      setScanProgressMessage("Validating URL security & SSRF boundaries...");
      triggerEvent("scan_start", "Let's see how we can make this website more accessible! ✨");

      // Set up client-side 35-second timeout and AbortController
      const controller = new AbortController();
      activeAbortControllerRef.current = controller;
      let timedOut = false;

      const timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CLIENT_SCAN_TIMEOUT_MS);

      // Progress animation steps
      const p1 = setTimeout(() => {
        setScanProgressMessage("Fetching HTML content safely...");
      }, 700);

      const p2 = setTimeout(() => {
        setScanProgressMessage("Executing axe-core WCAG 2.1 & 2.2 rule matrix in JSDOM...");
      }, 1600);

      const p3 = setTimeout(() => {
        setScanProgressMessage("Categorizing barriers and generating fix playbooks...");
      }, 2600);

      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl }),
          signal: controller.signal,
        });

        clearTimeout(p1);
        clearTimeout(p2);
        clearTimeout(p3);
        clearTimeout(timeoutId);

        let data: { success: boolean; result?: ScanResult; error?: string };
        try {
          data = await res.json();
        } catch {
          throw new Error(`Server returned HTTP ${res.status} with invalid JSON.`);
        }

        if (!res.ok || !data.success || !data.result) {
          throw new Error(data.error || `HTTP ${res.status}: Failed to complete scan.`);
        }

        const newResult: ScanResult = data.result;
        const previousScan = activeScanResult;

        setActiveScanResult(newResult);
        addScanToHistory(newResult);
        setScanError(null);

        // Auto-select first finding if available
        if (newResult.findings.length > 0) {
          setSelectedFinding(newResult.findings[0]);
        } else {
          setSelectedFinding(null);
        }

        // Compare with previous scan to verify improvements
        if (previousScan) {
          const scoreDiff = newResult.score.totalScore - previousScan.score.totalScore;
          const fewerIssues = newResult.findings.length < previousScan.findings.length;

          if (scoreDiff > 0 || fewerIssues) {
            // FIX VERIFIED BY A NEW SCAN -> DANCE & CELEBRATE!
            triggerEvent(
              "rescan_improvement",
              `Fix verified! Your AccessAble score improved from ${previousScan.score.totalScore} to ${newResult.score.totalScore} (+${scoreDiff > 0 ? scoreDiff : 0} pts)! 💃🎉`
            );
          } else if (newResult.findings.length === 0) {
            triggerEvent("scan_complete_clean");
          } else {
            triggerEvent("scan_complete_issues");
          }
        } else {
          // First scan
          if (newResult.findings.length === 0) {
            triggerEvent("scan_complete_clean");
          } else {
            triggerEvent("scan_complete_issues");
          }
        }
      } catch (err: unknown) {
        clearTimeout(p1);
        clearTimeout(p2);
        clearTimeout(p3);
        clearTimeout(timeoutId);

        let friendlyError = "";
        if (timedOut) {
          friendlyError = "The scan took too long. Please try another page or retry.";
          triggerEvent("scan_error", friendlyError);
        } else if (controller.signal.aborted) {
          friendlyError = "Scan cancelled. Ready whenever you'd like to try again! ✨";
          triggerEvent("scan_error", friendlyError);
        } else {
          const rawMsg = err instanceof Error ? err.message : String(err);
          if (rawMsg.includes("Failed to fetch") || rawMsg.includes("NetworkError") || rawMsg.includes("ECONNREFUSED")) {
            friendlyError = "Unable to connect to the scanning service. Please ensure the backend is running on http://localhost:3000 or try a safe civic demo preset.";
          } else {
            friendlyError = rawMsg;
          }
          triggerEvent("scan_error", `I couldn't finish scanning: ${friendlyError}`);
        }
        setScanError(friendlyError);
      } finally {
        isScanningRef.current = false;
        activeAbortControllerRef.current = null;
        setIsScanning(false);
        setScanProgressMessage("");
      }
    },
    [activeScanResult, addScanToHistory, triggerEvent]
  );

  // Retry the last attempted scan URL
  const retryLastScan = useCallback(() => {
    if (lastScannedUrl) {
      startScanningWorkflow(lastScannedUrl);
    }
  }, [lastScannedUrl, startScanningWorkflow]);

  // Clean up any in-flight scan on unmount
  useEffect(() => {
    return () => {
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
    };
  }, []);

  // Mark finding as reviewed by user
  const markFindingReviewed = useCallback((findingId: string) => {
    setActiveScanResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        findings: prev.findings.map((f) =>
          f.id === findingId ? { ...f, status: f.status === "reviewed" ? "unresolved" : "reviewed" } : f
        ),
      };
    });
  }, []);

  return (
    <MascotContext.Provider
      value={{
        behaviorState,
        speechText,
        setBehaviorState: (state) => transitionToState(state, speechText),
        setSpeechText,
        triggerEvent,
        isSleeping,
        wakeUp,
        activeView,
        setActiveView,
        selectedFinding,
        setSelectedFinding,
        activeScanResult,
        setActiveScanResult,
        scanHistory,
        addScanToHistory,
        isScanning,
        setIsScanning,
        scanProgressMessage,
        setScanProgressMessage,
        lastScannedUrl,
        scanError,
        startScanningWorkflow,
        cancelScan,
        retryLastScan,
        markFindingReviewed,
      }}
    >
      {children}
    </MascotContext.Provider>
  );
}


export function useMascot() {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error("useMascot must be used within a MascotProvider");
  }
  return context;
}
