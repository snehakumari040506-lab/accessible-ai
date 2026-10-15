export type Severity = "critical" | "high" | "medium" | "low" | "needs-review";

export type IssueCategory =
  | "contrast"
  | "alt-text"
  | "forms"
  | "keyboard"
  | "aria"
  | "semantics"
  | "structure"
  | "general";

export type EffortEstimate = "Quick" | "Moderate" | "Complex";

export interface AffectedNode {
  html: string;
  target: string[];
  failureSummary?: string;
}

export interface AccessibilityFinding {
  id: string;
  ruleId: string;
  title: string;
  severity: Severity;
  category: IssueCategory;
  impact: "critical" | "serious" | "moderate" | "minor";
  wcagCriterion: string;
  wcagLevel: "A" | "AA" | "AAA" | "Best Practice";
  plainExplanation: string;
  whyItMatters: string;
  affectedUsers: string[];
  affectedCount: number;
  nodes: AffectedNode[];
  suggestedFix: string;
  codeBefore: string;
  codeAfter: string;
  verificationChecklist: string[];
  effort: EffortEstimate;
  effortRationale: string;
  status: "unresolved" | "reviewed" | "verified-fixed";
}

export interface ScanScoreBreakdown {
  totalScore: number;
  formula: string;
  criticalDeductions: number;
  highDeductions: number;
  mediumDeductions: number;
  lowDeductions: number;
  passedRulesCount: number;
  failedRulesCount: number;
}

export interface ScanResult {
  scanId: string;
  url: string;
  timestamp: string;
  pageTitle: string;
  engine: string;
  score: ScanScoreBreakdown;
  findings: AccessibilityFinding[];
  severityCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    needsReview: number;
  };
  summary: string;
  durationMs: number;
  rawHtmlPreview?: string;
  isTestFixture?: boolean;
}

export interface ScanHistoryItem {
  scanId: string;
  url: string;
  timestamp: string;
  score: number;
  totalFindings: number;
  resolvedFindingsCount: number;
  findingsIds: string[];
}
