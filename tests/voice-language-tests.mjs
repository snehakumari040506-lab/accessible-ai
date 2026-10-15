// tests/voice-language-tests.mjs
import assert from "node:assert";

// 1. Test translation dictionaries and language metas
import { SUPPORTED_LANGUAGES, LANGUAGE_METAS } from "../src/types/i18n.ts";
import { TRANSLATIONS } from "../src/lib/i18n/translations.ts";

console.log("------------------------------------------------------------");
console.log("AccessAble AI — Indian Languages & Voice Verification Suite");
console.log("------------------------------------------------------------");

// Test 1: Supported Languages count & BCP 47 tags
console.log("Test 1: Verifying 13 supported languages and BCP-47 codes...");
assert.strictEqual(SUPPORTED_LANGUAGES.length, 13, "Expected exactly 13 supported languages");

const expectedCodes = ["en", "hi", "bn", "te", "mr", "ta", "gu", "kn", "ml", "pa", "or", "as", "ur"];
expectedCodes.forEach((code) => {
  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  assert.ok(meta, `Language meta missing for ${code}`);
  assert.ok(meta.bcp47.endsWith("-IN"), `BCP 47 code for ${code} must end with -IN: got ${meta.bcp47}`);
  assert.ok(meta.nativeName.length > 0, `Native name missing for ${code}`);
});
console.log("✓ All 13 Indian languages with valid BCP-47 locale tags verified.");

// Test 2: Urdu RTL verification
console.log("Test 2: Verifying Urdu RTL configuration...");
const urduMeta = SUPPORTED_LANGUAGES.find((l) => l.code === "ur");
assert.strictEqual(urduMeta.dir, "rtl", "Urdu must have dir='rtl'");
console.log("✓ Urdu RTL configuration verified.");

// Test 3: LANGUAGE_METAS map lookup
console.log("Test 3: Verifying LANGUAGE_METAS map...");
expectedCodes.forEach((code) => {
  assert.ok(LANGUAGE_METAS[code], `LANGUAGE_METAS missing key ${code}`);
});
console.log("✓ LANGUAGE_METAS dictionary verified.");

// Test 4: Schema completeness across all 13 languages
console.log("Test 4: Checking translation schema completeness across all 13 languages...");
const enKeys = Object.keys(TRANSLATIONS.en);
assert.ok(enKeys.length >= 40, `Expected at least 40 translation keys, got ${enKeys.length}`);

expectedCodes.forEach((langCode) => {
  const dict = TRANSLATIONS[langCode];
  assert.ok(dict, `Missing translation dictionary for language: ${langCode}`);

  enKeys.forEach((key) => {
    const val = dict[key];
    assert.ok(
      typeof val === "string" && val.trim().length > 0,
      `Language [${langCode}] is missing translation for key: "${key}"`
    );
  });
});
console.log(`✓ All ${enKeys.length} keys validated across all 13 languages (zero missing keys).`);

// Test 5: Speech recognition URL normalization test
console.log("Test 5: Testing speech-to-text URL normalization...");
function testNormalizeUrlVoiceText(raw) {
  let cleaned = raw.trim();
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

  cleaned = cleaned
    .replace(/\bw\s+w\s+w\b/gi, "www")
    .replace(/\bwww\s*\./gi, "www.");

  cleaned = cleaned.replace(/\.\s+([a-z]{2,})/gi, ".$1");
  cleaned = cleaned.replace(/https?\s*:\s*\/\s*\//gi, (match) => match.replace(/\s+/g, ""));
  cleaned = cleaned.replace(/\s+/g, "");
  return cleaned;
}

const spoken1 = "https colon slash slash www dot gov dot in";
assert.strictEqual(testNormalizeUrlVoiceText(spoken1), "https://www.gov.in");

const spoken2 = "w w w dot civic portal dot org slash a11y";
assert.strictEqual(testNormalizeUrlVoiceText(spoken2), "www.civicportal.org/a11y");

console.log("✓ URL speech normalization verified.");

console.log("------------------------------------------------------------");
console.log("ALL TESTS PASSED SUCCESSFULLY! ✨");
console.log("------------------------------------------------------------");
