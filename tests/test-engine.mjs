import { JSDOM } from "jsdom";
import axe from "axe-core";

const BARRIERS_FIXTURE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>City Public Transit & Permit Portal</title>
</head>
<body>
  <h1>City Public Transit & Permit Portal</h1>
  <section>
    <h2>Renew Bus & Rail Passes</h2>
    <img src="/transit-pass-banner.jpg">
    <button class="btn-icon">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"></path></svg>
    </button>
    <form>
      <input type="text" placeholder="Enter 16-Digit Transit ID">
      <button id="submit-btn" type="submit">Submit Renewal</button>
      <button id="submit-btn" type="reset">Cancel</button>
    </form>
  </section>
</body>
</html>`;

try {
  const dom = new JSDOM(BARRIERS_FIXTURE_HTML, {
    url: "https://demo.gov",
    runScripts: "dangerously",
    pretendToBeVisual: true,
  });

  dom.window.eval(axe.source);

  const axeResults = await dom.window.axe.run(dom.window.document, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
    },
    rules: {
      "color-contrast": { enabled: true },
    },
  });

  console.log("Violations detected:", axeResults.violations.length);
  axeResults.violations.forEach((v) => console.log(v.id, v.help));
} catch (e) {
  console.error("Caught error:", e);
}
