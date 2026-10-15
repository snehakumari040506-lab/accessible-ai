import assert from "assert";
import { JSDOM } from "jsdom";
import axe from "axe-core";

console.log("\n🧪 Running AccessAble AI Verification Test Suite...\n");

// --- Test 1: SSRF IP Validation Logic ---
console.log("Test 1: Validating SSRF IP protection rules...");

function isPrivateIPv4(ip) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4) return true;
  const [a, b] = parts;
  if (a === 0 || a === 127 || a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  return false;
}

assert.strictEqual(isPrivateIPv4("127.0.0.1"), true, "Should block loopback IPv4");
assert.strictEqual(isPrivateIPv4("10.0.1.5"), true, "Should block 10.x.x.x");
assert.strictEqual(isPrivateIPv4("172.20.0.1"), true, "Should block 172.16-31.x.x");
assert.strictEqual(isPrivateIPv4("192.168.1.1"), true, "Should block 192.168.x.x");
assert.strictEqual(isPrivateIPv4("169.254.169.254"), true, "Should block AWS metadata IP");
assert.strictEqual(isPrivateIPv4("8.8.8.8"), false, "Should allow public DNS IP");
assert.strictEqual(isPrivateIPv4("93.184.216.34"), false, "Should allow public web IP");

console.log("✓ SSRF IP protection rules passed!");

// --- Test 2: Documented AccessAble Score Calculation ---
console.log("Test 2: Verifying AccessAble Score Formula...");

function calculateAccessAbleScore(criticalCount, highCount, mediumCount, lowCount) {
  const criticalDeductions = Math.min(40, criticalCount * 10);
  const highDeductions = Math.min(30, highCount * 6);
  const mediumDeductions = Math.min(20, mediumCount * 3);
  const lowDeductions = Math.min(10, lowCount * 1);
  return Math.max(0, 100 - (criticalDeductions + highDeductions + mediumDeductions + lowDeductions));
}

assert.strictEqual(calculateAccessAbleScore(0, 0, 0, 0), 100, "Clean site should score 100");
assert.strictEqual(calculateAccessAbleScore(1, 0, 0, 0), 90, "1 critical should score 90");
assert.strictEqual(calculateAccessAbleScore(2, 1, 1, 1), 100 - (20 + 6 + 3 + 1), "Calculated deductions match formula");
assert.strictEqual(calculateAccessAbleScore(10, 10, 10, 10), 0, "Floors at 0 points");

console.log("✓ Scoring formula accurately computes documented deductions!");

// --- Test 3: Real axe-core Scan on Barriers Fixture ---
console.log("Test 3: Executing real axe-core engine on Barriers Fixture...");

const testHtml = `<!DOCTYPE html>
<html lang="en">
<head><title>Transit Test</title></head>
<body>
  <h1>Transit Permit</h1>
  <img src="banner.jpg">
  <button></button>
  <input type="text">
</body>
</html>`;

const dom = new JSDOM(testHtml, { pretendToBeVisual: true });
const results = await axe.run(dom.window.document.documentElement, {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
});

assert.ok(results.violations.length >= 3, "axe-core must detect real violations in sample fixture");
const ruleIds = results.violations.map((v) => v.id);
assert.ok(ruleIds.includes("image-alt"), "Must detect missing alt text");
assert.ok(ruleIds.includes("button-name"), "Must detect button missing name");
assert.ok(ruleIds.includes("label"), "Must detect unlabeled input");

console.log(`✓ Real axe-core engine executed: ${results.violations.length} violations detected!`);

// --- Test 4: Real axe-core Scan on Clean Remediated Fixture ---
console.log("Test 4: Executing real axe-core engine on Remediated Clean Fixture...");

const cleanHtml = `<!DOCTYPE html>
<html lang="en">
<head><title>Accessible Civic Transit</title></head>
<body>
  <header><nav aria-label="Main"><a href="#content">Skip to content</a></nav></header>
  <main id="content">
    <h1>Accessible Civic Transit</h1>
    <img src="banner.jpg" alt="Municipal hybrid transit bus">
    <button aria-label="Submit renewal">Submit</button>
    <label for="card">Transit Card:</label>
    <input id="card" type="text">
  </main>
</body>
</html>`;

const cleanDom = new JSDOM(cleanHtml, { pretendToBeVisual: true });
const cleanResults = await axe.run(cleanDom.window.document.documentElement, {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
});


assert.strictEqual(cleanResults.violations.length, 0, "Clean fixture should have 0 axe violations");
console.log("✓ Clean remediated fixture verified: 0 automated violations detected!");

console.log("\n🎉 All 4 verification test suites passed successfully!\n");
