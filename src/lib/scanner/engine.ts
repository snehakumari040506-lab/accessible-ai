import { JSDOM } from "jsdom";
import axe from "axe-core";
import {
  AccessibilityFinding,
  IssueCategory,
  Severity,
  ScanResult,
  ScanScoreBreakdown,
  EffortEstimate,
} from "@/types/scanner";

// Documented knowledge dictionary for WCAG rules mapping
interface RuleKnowledge {
  category: IssueCategory;
  wcagCriterion: string;
  wcagLevel: "A" | "AA" | "AAA" | "Best Practice";
  plainExplanation: string;
  whyItMatters: string;
  affectedUsers: string[];
  suggestedFix: string;
  codeBefore: string;
  codeAfter: string;
  verificationChecklist: string[];
  effort: EffortEstimate;
  effortRationale: string;
}

const KNOWLEDGE_BASE: Record<string, RuleKnowledge> = {
  "image-alt": {
    category: "alt-text",
    wcagCriterion: "1.1.1 Non-text Content (Level A)",
    wcagLevel: "A",
    plainExplanation: "One or more images are missing alternative text (the `alt` attribute).",
    whyItMatters: "Screen readers announce the raw image file name or skip it altogether, leaving blind and low-vision users without vital context.",
    affectedUsers: ["Screen Reader Users", "Low-Bandwidth Mobile Citizens"],
    suggestedFix: "Add a concise, descriptive alt attribute that conveys the image purpose, or alt=\"\" if decorative.",
    codeBefore: `<img src="transit-map.jpg">`,
    codeAfter: `<img src="transit-map.jpg" alt="Downtown transit route map and stops">`,
    verificationChecklist: [
      "Inspect the <img> tag in HTML source",
      "Ensure alt attribute is present and accurately describes the image",
      "If decorative, use alt=\"\" so screen readers gracefully ignore it"
    ],
    effort: "Quick",
    effortRationale: "Can be resolved directly by adding an alt attribute to the image tag."
  },
  "button-name": {
    category: "keyboard",
    wcagCriterion: "4.1.2 Name, Role, Value (Level A)",
    wcagLevel: "A",
    plainExplanation: "One or more buttons have no text, aria-label, or discernible label.",
    whyItMatters: "Screen reader users will hear 'Button' with no indication of what clicking it will do.",
    affectedUsers: ["Screen Reader Users", "Voice Navigation Users"],
    suggestedFix: "Add visible button text, or if it is an icon button, include aria-label=\"Action description\".",
    codeBefore: `<button><svg>...</svg></button>`,
    codeAfter: `<button aria-label="Search public records"><svg>...</svg></button>`,
    verificationChecklist: [
      "Verify the button announces a clear purpose when focused with a screen reader",
      "Check that voice control users can activate it by speaking its name"
    ],
    effort: "Quick",
    effortRationale: "Adding an aria-label or text node takes under 5 minutes."
  },
  "label": {
    category: "forms",
    wcagCriterion: "1.3.1 Info and Relationships (Level A) & 4.1.2 Name, Role, Value",
    wcagLevel: "A",
    plainExplanation: "Form input elements lack associated <label> elements or accessible names.",
    whyItMatters: "When focusing the input, screen reader users are not told what information to enter, and users with motor tremors cannot click the label to focus the input.",
    affectedUsers: ["Screen Reader Users", "Users with Motor Impairments", "Cognitive & Neurodivergent Users"],
    suggestedFix: "Associate a <label for=\"id\"> with the input's matching id attribute.",
    codeBefore: `<input type="text" placeholder="Driver License Number">`,
    codeAfter: `<label for="license-id">Driver License Number</label>\n<input id="license-id" type="text">`,
    verificationChecklist: [
      "Click the label text and confirm the cursor immediately jumps into the text field",
      "Ensure the screen reader reads the exact label upon tab navigation"
    ],
    effort: "Moderate",
    effortRationale: "Requires adding paired label elements and verifying form field IDs."
  },
  "color-contrast": {
    category: "contrast",
    wcagCriterion: "1.4.3 Contrast (Minimum) (Level AA)",
    wcagLevel: "AA",
    plainExplanation: "The text color does not contrast sufficiently with its background color.",
    whyItMatters: "Low contrast text is difficult or impossible to read for seniors, people with low vision, color blindness, or anyone outdoors in direct sunlight.",
    affectedUsers: ["Low-Vision Citizens", "Aging Population", "Mobile Users in Glare"],
    suggestedFix: "Darken text or lighten background until the contrast ratio is at least 4.5:1 for normal text (or 3:1 for large text).",
    codeBefore: `color: #94A3B8; /* Ratio 2.4:1 on white */`,
    codeAfter: `color: #334155; /* Ratio 7.1:1 on white (WCAG AAA) */`,
    verificationChecklist: [
      "Test color hex values using our live contrast calculator",
      "Verify ratio is at least 4.5:1 for body text (16px) or 3.0:1 for large text (24px+)"
    ],
    effort: "Quick",
    effortRationale: "Simple CSS color token adjustment."
  },
  "document-title": {
    category: "semantics",
    wcagCriterion: "2.4.2 Page Titled (Level A)",
    wcagLevel: "A",
    plainExplanation: "The webpage document has no <title> element or the title is empty.",
    whyItMatters: "The page title is the very first thing announced by screen readers when navigating, and is displayed on browser tabs.",
    affectedUsers: ["Screen Reader Users", "Cognitive & Attention Diversity"],
    suggestedFix: "Add a meaningful, unique <title> element inside the <head> tag describing the civic service.",
    codeBefore: `<head>\n  <!-- Missing <title> -->\n</head>`,
    codeAfter: `<head>\n  <title>Renew Vehicle Registration | Civic Portal</title>\n</head>`,
    verificationChecklist: [
      "Check document <head> in source",
      "Ensure title is descriptive and unique for each page"
    ],
    effort: "Quick",
    effortRationale: "Requires adding one title tag in HTML."
  },
  "html-has-lang": {
    category: "semantics",
    wcagCriterion: "3.1.1 Language of Page (Level A)",
    wcagLevel: "A",
    plainExplanation: "The <html> element lacks a valid `lang` attribute (e.g. lang=\"en\").",
    whyItMatters: "Screen readers rely on the lang attribute to load the correct pronunciation synthesizer and accent. Without it, English words might be pronounced with French rules or vice versa.",
    affectedUsers: ["Screen Reader Users", "Multilingual Citizens"],
    suggestedFix: "Add the appropriate BCP 47 language code to the root <html> tag.",
    codeBefore: `<html>`,
    codeAfter: `<html lang="en">`,
    verificationChecklist: [
      "Verify <html lang=\"...\"> exists on the root tag",
      "Ensure the code matches the primary language of the page content"
    ],
    effort: "Quick",
    effortRationale: "One-line attribute addition on root html tag."
  },
  "heading-order": {
    category: "structure",
    wcagCriterion: "1.3.1 Info and Relationships (Level A)",
    wcagLevel: "Best Practice",
    plainExplanation: "Heading levels were skipped (e.g., jumping from <h1> directly to <h3>).",
    whyItMatters: "Users of assistive tech navigate pages by jumping through headings. Disordered headings create confusion about document hierarchy.",
    affectedUsers: ["Screen Reader Users", "Cognitive Diversity"],
    suggestedFix: "Organize heading tags sequentially (h1 -> h2 -> h3) without skipping levels.",
    codeBefore: `<h1>Public Clinics</h1>\n<h3>Downtown Location</h3>`,
    codeAfter: `<h1>Public Clinics</h1>\n<h2>Locations</h2>\n<h3>Downtown Location</h3>`,
    verificationChecklist: [
      "Inspect heading hierarchy tree",
      "Ensure levels descend sequentially without gaps"
    ],
    effort: "Moderate",
    effortRationale: "Reviewing page section structure and updating tag levels."
  },
  "duplicate-id": {
    category: "structure",
    wcagCriterion: "4.1.1 Parsing (Level A)",
    wcagLevel: "A",
    plainExplanation: "Multiple elements on the page share the exact same `id` attribute value.",
    whyItMatters: "Screen reader labels, form connections, and aria-describedby references can bind to the wrong element or fail entirely.",
    affectedUsers: ["Screen Reader Users", "Keyboard Navigators"],
    suggestedFix: "Ensure all id attributes are globally unique on the webpage.",
    codeBefore: `<input id="search">\n<button id="search">Go</button>`,
    codeAfter: `<input id="search-input">\n<button id="search-submit">Go</button>`,
    verificationChecklist: [
      "Search HTML source for duplicate ID strings",
      "Confirm each ID is unique across the entire DOM"
    ],
    effort: "Quick",
    effortRationale: "Rename duplicated ID and its corresponding references."
  },
  "link-name": {
    category: "keyboard",
    wcagCriterion: "2.4.4 Link Purpose (In Context) & 4.1.2 Name, Role, Value",
    wcagLevel: "A",
    plainExplanation: "One or more links have no discernible text (e.g. icon-only link without label).",
    whyItMatters: "Screen readers announce 'Link' without destination context. A blind user cannot tell where the link will take them.",
    affectedUsers: ["Screen Reader Users", "Speech Control Users"],
    suggestedFix: "Add descriptive visible text or an aria-label=\"Destination description\" to the link.",
    codeBefore: `<a href="/portal"><svg>...</svg></a>`,
    codeAfter: `<a href="/portal" aria-label="Access Citizen Portal"><svg>...</svg></a>`,
    verificationChecklist: [
      "Check link announcements in screen reader Rotor/Element list",
      "Confirm link clearly explains where it leads"
    ],
    effort: "Quick",
    effortRationale: "Add text or aria-label to anchor tag."
  },
  "region": {
    category: "structure",
    wcagCriterion: "1.3.1 Info and Relationships (Level A)",
    wcagLevel: "Best Practice",
    plainExplanation: "Important content is not contained within HTML5 landmark regions (<main>, <header>, <nav>, <footer>).",
    whyItMatters: "Landmarks allow screen reader users to jump straight to main content or skip repeated navigation.",
    affectedUsers: ["Screen Reader Users", "Keyboard-Only Navigators"],
    suggestedFix: "Wrap page layout areas with semantic HTML5 tags: <header>, <nav>, <main>, <aside>, and <footer>.",
    codeBefore: `<div class="content">...</div>`,
    codeAfter: `<main id="main-content">...</main>`,
    verificationChecklist: [
      "Ensure main content is inside <main>",
      "Verify landmark navigation shortcuts work in screen readers"
    ],
    effort: "Moderate",
    effortRationale: "Wrapping top-level containers with semantic tags."
  }
};

/**
 * Maps axe impact string to standard Severity.
 */
function mapImpactToSeverity(impact?: string | null): Severity {
  switch (impact) {
    case "critical":
      return "critical";
    case "serious":
      return "high";
    case "moderate":
      return "medium";
    case "minor":
      return "low";
    default:
      return "needs-review";
  }
}

/**
 * Calculates the documented AccessAble Score.
 * Formula: Base 100 minus weighted penalties for unique rule violations.
 * Capped per severity category to prevent a single category from dropping score to 0.
 */
export function calculateAccessAbleScore(findings: AccessibilityFinding[]): ScanScoreBreakdown {
  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;
  const mediumCount = findings.filter((f) => f.severity === "medium").length;
  const lowCount = findings.filter((f) => f.severity === "low").length;

  const criticalDeductions = Math.min(40, criticalCount * 10);
  const highDeductions = Math.min(30, highCount * 6);
  const mediumDeductions = Math.min(20, mediumCount * 3);
  const lowDeductions = Math.min(10, lowCount * 1);

  const totalDeductions = criticalDeductions + highDeductions + mediumDeductions + lowDeductions;
  const totalScore = Math.max(0, 100 - totalDeductions);

  return {
    totalScore,
    formula: "Score = Math.max(0, 100 - (Critical×10 [max 40] + High×6 [max 30] + Medium×3 [max 20] + Low×1 [max 10]))",
    criticalDeductions,
    highDeductions,
    mediumDeductions,
    lowDeductions,
    passedRulesCount: 0, // populated after scan
    failedRulesCount: findings.length,
  };
}

/**
 * Executes a real accessibility evaluation using axe-core inside JSDOM.
 */
export async function runAccessibilityScan(
  html: string,
  targetUrl: string,
  options: { isTestFixture?: boolean } = {}
): Promise<ScanResult> {
  const startTime = Date.now();

  // Strip script tags so malicious or broken third-party scripts are never evaluated
  const safeHtml = (html || "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  const dom = new JSDOM(safeHtml, {
    pretendToBeVisual: true,
  });

  const { window } = dom;
  const doc = window.document;

  const pageTitle = doc.title || "Untitled Civic Page";

  // Run axe-core directly on documentElement with WCAG 2.1 / 2.2 rules
  const axeResults = await axe.run(doc.documentElement, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
    },
    rules: {
      "color-contrast": { enabled: true },
    },
  });


  const rawViolations = axeResults.violations || [];
  const passedRulesCount = (axeResults.passes || []).length;

  // Transform violations into rich, empathetic AccessibilityFinding objects
  const findings: AccessibilityFinding[] = rawViolations.map((v: axe.Result, idx: number) => {
    const knowledge = KNOWLEDGE_BASE[v.id] || {
      category: "general" as IssueCategory,
      wcagCriterion: v.tags.find((t: string) => t.startsWith("wcag")) || "WCAG 2.2 Best Practice",
      wcagLevel: "AA" as const,
      plainExplanation: v.description,
      whyItMatters: v.help,
      affectedUsers: ["All Users with Disabilities"],
      suggestedFix: `Inspect elements matching this rule and address: ${v.help}`,
      codeBefore: v.nodes[0]?.html || "<!-- Inaccessible element -->",
      codeAfter: "<!-- Remediation pending review -->",
      verificationChecklist: ["Verify in DOM that rule passes after remediation"],
      effort: "Moderate" as EffortEstimate,
      effortRationale: "Requires standard DOM markup remediation.",
    };

    const severity = mapImpactToSeverity(v.impact);

    return {
      id: `${v.id}-${idx}`,
      ruleId: v.id,
      title: v.help,
      severity,
      category: knowledge.category,
      impact: (v.impact as "critical" | "serious" | "moderate" | "minor") || "moderate",
      wcagCriterion: knowledge.wcagCriterion,
      wcagLevel: knowledge.wcagLevel,
      plainExplanation: knowledge.plainExplanation,
      whyItMatters: knowledge.whyItMatters,
      affectedUsers: knowledge.affectedUsers,
      affectedCount: v.nodes.length,
      nodes: v.nodes.map((node: axe.NodeResult) => ({
        html: node.html,
        target: node.target as string[],
        failureSummary: node.failureSummary,
      })),
      suggestedFix: knowledge.suggestedFix,
      codeBefore: knowledge.codeBefore,
      codeAfter: knowledge.codeAfter,
      verificationChecklist: knowledge.verificationChecklist,
      effort: knowledge.effort,
      effortRationale: knowledge.effortRationale,
      status: "unresolved" as const,
    };
  });

  // Calculate score
  const scoreBreakdown = calculateAccessAbleScore(findings);
  scoreBreakdown.passedRulesCount = passedRulesCount;

  const severityCounts = {
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
    needsReview: findings.filter((f) => f.severity === "needs-review").length,
  };

  const durationMs = Date.now() - startTime;

  let summary = "";
  if (findings.length === 0) {
    summary = "Outstanding! The automated scan detected zero WCAG violations on this page. Note that automated tools catch 30-50% of barriers; manual user testing is always recommended.";
  } else {
    summary = `Detected ${findings.length} accessibility barriers across ${findings.reduce((acc, f) => acc + f.affectedCount, 0)} elements. Prioritize ${severityCounts.critical} critical and ${severityCounts.high} high severity issues first.`;
  }

  // Generate a clean safe HTML preview snapshot (stripped of dangerous scripts)
  const cleanSnapshot = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .slice(0, 150000); // 150KB snapshot cap

  return {
    scanId: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    url: targetUrl,
    timestamp: new Date().toISOString(),
    pageTitle,
    engine: `axe-core v${axe.version} via JSDOM DOM Engine`,
    score: scoreBreakdown,
    findings,
    severityCounts,
    summary,
    durationMs,
    rawHtmlPreview: cleanSnapshot,
    isTestFixture: options.isTestFixture ?? false,
  };
}
