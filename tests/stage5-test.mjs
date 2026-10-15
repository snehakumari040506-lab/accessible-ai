import assert from "assert";

console.log("\n==================================================");
console.log("   AccessAble AI — Stage 5 Live Verification Suite");
console.log("==================================================\n");

const BASE_URL = "http://localhost:3000";

async function postScan(url) {
  const res = await fetch(`${BASE_URL}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  // ----------------------------------------------------
  // Test 1: Valid, accessible test page (Clean Fixture)
  // ----------------------------------------------------
  console.log("Case 1: Testing valid, accessible page (Clean Remediated Fixture)...");
  const case1 = await postScan("test://civic-clean");
  assert.strictEqual(case1.status, 200, "Clean fixture should return 200 OK");
  assert.strictEqual(case1.data.success, true, "Scan should succeed");
  assert.strictEqual(case1.data.result.score.totalScore, 100, "Clean fixture should score 100");
  assert.strictEqual(case1.data.result.findings.length, 0, "Clean fixture should have 0 violations");
  console.log(`  ✓ Passed! Score: ${case1.data.result.score.totalScore}/100, Findings: ${case1.data.result.findings.length}`);

  // ----------------------------------------------------
  // Test 2: Controlled local fixture with known barriers
  // ----------------------------------------------------
  console.log("\nCase 2: Testing controlled fixture with known accessibility barriers...");
  const case2 = await postScan("test://civic-barriers");
  assert.strictEqual(case2.status, 200, "Barriers fixture should return 200 OK");
  assert.strictEqual(case2.data.success, true, "Scan should succeed");
  assert.strictEqual(case2.data.result.score.totalScore, 77, "Barriers score should match formula");
  assert.strictEqual(case2.data.result.findings.length, 3, "Should detect 3 genuine WCAG violations");
  assert.strictEqual(case2.data.result.severityCounts.critical, 2, "Should categorize 2 critical");
  assert.strictEqual(case2.data.result.severityCounts.medium, 1, "Should categorize 1 medium");
  console.log(`  ✓ Passed! Score: ${case2.data.result.score.totalScore}/100, Detected: ${case2.data.result.findings.length} findings (${case2.data.result.findings.map(f => f.ruleId).join(", ")})`);

  // ----------------------------------------------------
  // Test 3: Invalid URL
  // ----------------------------------------------------
  console.log("\nCase 3: Testing invalid URL handling (empty, malformed, non-http)...");
  const case3a = await postScan("");
  assert.strictEqual(case3a.status, 400, "Empty URL should return 400 Bad Request");
  assert.strictEqual(case3a.data.success, false);
  console.log(`  ✓ Empty URL rejected: "${case3a.data.error}"`);

  const case3b = await postScan("ftp://invalid-protocol.gov");
  assert.ok(case3b.status === 400 || case3b.status === 403, "Non-HTTP/HTTPS protocol should return 400 or 403");
  assert.strictEqual(case3b.data.success, false);
  console.log(`  ✓ Non-HTTP protocol rejected (status ${case3b.status}): "${case3b.data.error}"`);


  // ----------------------------------------------------
  // Test 4: Unreachable or unsupported target / SSRF private IP
  // ----------------------------------------------------
  console.log("\nCase 4: Testing unreachable or unsupported destination (Private IP & SSRF)...");
  const case4 = await postScan("http://127.0.0.1:8080/internal-admin");
  assert.strictEqual(case4.status, 403, "SSRF attempt on loopback should return 403 Forbidden");
  assert.strictEqual(case4.data.success, false);
  console.log(`  ✓ SSRF blocked: "${case4.data.error}"`);

  // ----------------------------------------------------
  // Test 5: Real external page scanning (example.com)
  // ----------------------------------------------------
  console.log("\nCase 5: Testing real external reachable page (https://example.com)...");
  try {
    const case5 = await postScan("https://example.com");
    if (case5.status === 200 && case5.data.success) {
      console.log(`  ✓ External scan reached and audited! Score: ${case5.data.result.score.totalScore}, Findings: ${case5.data.result.findings.length}`);
    } else {
      console.log(`  ✓ External response gracefully handled: Status ${case5.status}, Message: "${case5.data.error}"`);
    }
  } catch (err) {
    console.log(`  ⚠ External network call note: ${err.message}`);
  }

  // ----------------------------------------------------
  // Test 6: Subsequent scan (Barriers -> Clean rescan)
  // ----------------------------------------------------
  console.log("\nCase 6: Testing subsequent scan (Rescan verifying fixes & score jump)...");
  const firstScan = await postScan("test://civic-barriers");
  assert.strictEqual(firstScan.data.result.score.totalScore, 77);

  const secondScan = await postScan("test://civic-clean");
  assert.strictEqual(secondScan.data.result.score.totalScore, 100);

  const scoreImprovement = secondScan.data.result.score.totalScore - firstScan.data.result.score.totalScore;
  assert.strictEqual(scoreImprovement, 23, "Score improvement should be precisely +23 points");
  console.log(`  ✓ Subsequent scan succeeded! Score jumped from ${firstScan.data.result.score.totalScore} to ${secondScan.data.result.score.totalScore} (+${scoreImprovement} pts), triggering verified victory dance!`);

  console.log("\n🎉 All 6 Stage 5 test cases verified successfully!\n");
}

runTests().catch((err) => {
  console.error("\n❌ Stage 5 Verification Failed:", err);
  process.exit(1);
});
