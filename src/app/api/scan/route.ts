import { NextRequest, NextResponse } from "next/server";
import { validateTargetUrl, safeFetchHtml, ValidationError, SecurityError } from "@/lib/scanner/ssrfProtection";
import { runAccessibilityScan } from "@/lib/scanner/engine";

// Sample fixture HTML templates so the app can scan them directly without depending on an active dev server network fetch
const BARRIERS_FIXTURE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>City Public Transit & Permit Portal</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; background: #fff; color: #111; }
    .faded-text { color: #94A3B8; background: #ffffff; } /* Low contrast */
    .btn-icon { width: 40px; height: 40px; border-radius: 8px; border: 1px solid #ccc; }
  </style>
</head>
<body>
  <h1>City Public Transit & Permit Portal</h1>
  
  <section>
    <h2>Renew Bus & Rail Passes</h2>
    <!-- Issue 1: Image missing alt attribute -->
    <img src="/transit-pass-banner.jpg">

    <!-- Issue 2: Button missing text label or aria-label -->
    <button class="btn-icon">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"></path></svg>
    </button>

    <!-- Issue 3: Form input missing label -->
    <form>
      <input type="text" placeholder="Enter 16-Digit Transit ID">
      <!-- Issue 4: Duplicate ID -->
      <button id="submit-btn" type="submit">Submit Renewal</button>
      <button id="submit-btn" type="reset">Cancel</button>
    </form>

    <!-- Issue 5: Low contrast text -->
    <p class="faded-text">Note: Reduced fee transit discount expires on the first day of each month.</p>
  </section>
</body>
</html>`;

const CLEAN_FIXTURE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>City Public Transit & Permit Portal (Accessible & Remediated)</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; background: #FAF7F2; color: #1C1917; }
    .high-contrast-text { color: #1E1B4B; background: #FAF7F2; font-weight: 500; } /* 12:1 Contrast (AAA) */
    .btn-accessible { padding: 8px 16px; border-radius: 9999px; background: #7C3AED; color: #fff; font-weight: bold; border: none; }
  </style>
</head>
<body>
  <header>
    <nav aria-label="Main Navigation">
      <a href="#main-content">Skip to content</a>
    </nav>
  </header>

  <main id="main-content">
    <h1>City Public Transit & Permit Portal</h1>
    
    <section aria-labelledby="renew-heading">
      <h2 id="renew-heading">Renew Bus & Rail Passes</h2>
      
      <!-- Fixed 1: Image with descriptive alt text -->
      <img src="/transit-pass-banner.jpg" alt="City electric transit bus arriving at downtown terminal station">

      <!-- Fixed 2: Button with accessible label -->
      <button class="btn-accessible" aria-label="Emergency transit service alerts">
        Service Alerts
      </button>

      <!-- Fixed 3: Form input with proper label connection -->
      <form>
        <label for="transit-card-id" style="display: block; margin-top: 1rem; font-weight: bold;">
          16-Digit Transit ID Number:
        </label>
        <input id="transit-card-id" type="text" aria-describedby="transit-hint" required>
        <span id="transit-hint" style="font-size: 12px; display: block; color: #475569;">
          Located on the back of your physical transit card.
        </span>

        <!-- Fixed 4: Unique IDs -->
        <button id="renewal-submit" class="btn-accessible" type="submit" style="margin-top: 1rem;">
          Submit Renewal
        </button>
      </form>

      <!-- Fixed 5: High contrast text meeting WCAG AAA -->
      <p class="high-contrast-text">
        Note: Reduced fee transit discount expires on the first day of each month.
      </p>
    </section>
  </main>

  <footer>
    <p>© 2026 Municipal Transit Authority • Fully Accessible WCAG 2.2</p>
  </footer>
</body>
</html>`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid website URL in the request body." },
        { status: 400 }
      );
    }

    // Check for internal test fixture shortcuts
    const trimmed = rawUrl.trim();
    if (
      trimmed.includes("/test-fixture/barriers") ||
      trimmed === "test://civic-barriers" ||
      trimmed.endsWith("barriers")
    ) {
      const scanResult = await runAccessibilityScan(
        BARRIERS_FIXTURE_HTML,
        "https://demo-public-service.gov/transit-renewal",
        { isTestFixture: true }
      );
      return NextResponse.json({ success: true, result: scanResult });
    }

    if (
      trimmed.includes("/test-fixture/clean") ||
      trimmed === "test://civic-clean" ||
      trimmed.endsWith("clean")
    ) {
      const scanResult = await runAccessibilityScan(
        CLEAN_FIXTURE_HTML,
        "https://demo-public-service.gov/transit-renewal (Remediated)",
        { isTestFixture: true }
      );
      return NextResponse.json({ success: true, result: scanResult });
    }

    // SSRF Validation & Safe Fetch for real external websites
    const validatedUrl = await validateTargetUrl(trimmed);
    const { html, finalUrl } = await safeFetchHtml(validatedUrl.toString());

    // Execute real accessibility engine
    const scanResult = await runAccessibilityScan(html, finalUrl);

    return NextResponse.json({ success: true, result: scanResult });
  } catch (err: unknown) {
    console.error("API Scan route caught error:", err);
    if (err instanceof ValidationError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
    if (err instanceof SecurityError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }

    let message = "An unexpected scanning error occurred.";
    if (err instanceof Error) {
      message = err.message || err.toString();
    } else if (typeof err === "string") {
      message = err;
    } else if (typeof err === "object" && err !== null) {
      message = (err as Record<string, unknown>).message
        ? String((err as Record<string, unknown>).message)
        : JSON.stringify(err);
    }
    return NextResponse.json(
      { success: false, error: `Scan failed: ${message}` },
      { status: 500 }
    );
  }
}

