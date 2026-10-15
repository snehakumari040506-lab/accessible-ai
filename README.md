# AccessAble AI 🩺✨

> **"Make the web a kinder place for everyone."**

**AccessAble AI** is a civic tech hackathon project dedicated to automated accessibility auditing of public digital services. It identifies website accessibility barriers, translates dense WCAG 2.2 regulatory guidelines into plain human language, and empowers developers to fix them with empathy and confidence.

---

## 🎨 Visual Identity & Design System

- **Warm Ivory/Cream Base:** `#FAF7F2` with warm surface contrasts (`#FFFDF9`, `#FFFFFF`).
- **Pastel Accents:**
  - 💜 **Lavender:** Primary buttons, focus rings, and badge accents (`#8B5CF6`, `#EDE9FE`)
  - 🍑 **Peach:** Warm alerts and workflow pills (`#EA580C`, `#FFEDD5`)
  - 🌸 **Soft Pink:** Gentle highlights and micro-states (`#DB2777`, `#FCE7F3`)
  - 🪸 **Coral:** Barrier badges and high-visibility alerts (`#E11D48`, `#FFE4E6`)
  - 🍃 **Mint:** Verification status and WCAG conformance badges (`#059669`, `#D1FAE5`)
- **High-Contrast Typography:** Deep Indigo Stone (`#1C1917` / `#1E1B4B`) providing WCAG AAA compliant contrast ratios (>12:1).
- **Lightweight CSS Animations:** Smooth floating geometric shapes, glowing ambient gradients, and twinkling 4-point stars with full `@media (prefers-reduced-motion: reduce)` support.

---

## 🤖 3D Soft Clay Robot Mascot (Dr. Pip)

The hero section features an adorable, original 3D robot mascot designed in a soft clay / animated-film aesthetic:
- **Material & Aesthetic:** Soft studio 3-point lighting, pastel lavender body, peach blushed cheeks, cream belly with tactile accessibility heart, tiny rounded arms & feet, and large expressive obsidian glossy eyes with specular reflections.
- **Floating Accents:** Twinkling stars and sparkles orbiting around the mascot.
- **Spline 3D Scene Support:** Toggle between the native 3D Soft Clay Mascot and Spline 3D Scene Viewer.

### 🎭 7 Interactive Behavior States:

1. **IDLE:** Gently floats up and down, blinks naturally, and tilts head periodically.
2. **WAVE:** When a visitor first opens the homepage, waves hello with its right arm and displays: *"Hi there! Ready to make the web kinder? ✨"*.
3. **DANCE:** When a scan confirms a clean pass, performs a joyful dance with little hops and arm movements.
4. **SLEEP:** After ~30 seconds of user inactivity, slowly closes its eyes into serene sleeping curves, curls its head, and displays floating `z Z Z` particles. When the user moves the mouse, types, or scrolls, it wakes up with a stretch!
5. **THINK:** While a scan is executing, shows a curious expression with one hand tapping its chin and a gentle spinning/glowing aura ring.
6. **CELEBRATE:** When an accessibility fix is confirmed (e.g. via the live contrast tool or feature remediation), celebrates with sparkles and happy jumps.
7. **ENCOURAGE:** When the scan identifies digital barriers, remains kind, empathetic, and supportive: *"No worries! Let's fix these together 💜"* — never shaming the user.

> **Interactive Playground:** You can also manually trigger all 7 states on demand using the state buttons below the mascot card!

---

## 🌟 Key Features on the Homepage

1. **Playful Hero with URL Scanner:**
   - Bold rounded typography: *"Make the web a kinder place for everyone."*
   - Accessible URL input form with validation and quick-pick civic presets (*Public Transit*, *Civic Library*, *Public Health*, *Community Services*).
   - **Honest Scan Engine Status:** Fully transparent dialog explaining pre-flight audit modules without fabricating fake results.
2. **Three Core Feature Pillars:**
   - **Detect Barriers:** Automated discovery of color contrast failures, keyboard traps, broken ARIA roles, and form labels.
   - **Understand Issues:** Plain-language translations of WCAG 2.2 criteria with real-world disability impact stories.
   - **Fix with Confidence:** Copy-paste accessible code snippets for React, Next.js, and HTML.
   - *Interactive Showcase:* Click between cards to inspect real before-and-after accessible code comparisons.
3. **Interactive WCAG 2.2 Contrast Calculator:**
   - Built-in mathematical luminance engine `(L1 + 0.05) / (L2 + 0.05)`.
   - Real-time color pickers and preset testing.
   - Live WCAG AA & AAA Pass/Fail matrix for normal and large text.
4. **How It Works 3-Step Walkthrough:**
   - Simple 1-2-3 guide from URL intake to deep DOM scan to prioritized remediation playbook.
5. **Civic Mission & Manifesto:**
   - Explains why digital accessibility is a fundamental civil right for public digital services.
6. **Accessible Navigation & Footer:**
   - Accessible skip link (`Skip to main content`).
   - Motion toggle button (calm motion mode for users sensitive to animations).
   - Visible focus rings, semantic HTML5 landmarks, and keyboard navigation instructions.

---

## 🚀 Running the Application Locally

### Prerequisites
- Node.js 18+ (tested with Node.js v24.20.0 LTS)
- npm 9+

### Commands

1. **Install dependencies (already installed):**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Create a production build:**
   ```bash
   npm run build
   ```

4. **Start the production server:**
   ```bash
   npm run start
   ```

---

## ♿ Accessibility & Conformance

- **WCAG 2.2 Conformance Target:** Level AA & AAA.
- **Keyboard Navigation:** Fully navigable with `Tab`, `Shift+Tab`, `Space`, `Enter`, and `Escape`.
- **Screen Reader Support:** Semantic HTML landmarks (`header`, `nav`, `main`, `section`, `footer`), `aria-label`, `aria-describedby`, `aria-modal`, and `aria-live`.
- **Prefers-Reduced-Motion:** Animations automatically scale to `0.01ms` when OS reduced-motion is enabled, with an interactive toggle in the header for manual testing.
