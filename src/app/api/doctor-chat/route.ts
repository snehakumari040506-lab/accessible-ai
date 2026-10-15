import { NextRequest, NextResponse } from "next/server";
import { AccessibilityFinding } from "@/types/scanner";

interface DoctorChatRequest {
  question: string;
  selectedFinding?: AccessibilityFinding | null;
  allFindings?: AccessibilityFinding[];
  score?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: DoctorChatRequest = await req.json();
    const { question, selectedFinding, allFindings, score } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a question." },
        { status: 400 }
      );
    }

    const lowerQ = question.toLowerCase();

    // 1. Check for server-side AI key (Optional enhancement)
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are Dr. Pip, the friendly AI accessibility doctor mascot for AccessAble AI.
Answer the user's accessibility question with warmth, encouragement, and practical technical precision.
Selected Finding: ${selectedFinding ? JSON.stringify(selectedFinding) : "None"}
Current Score: ${score ?? "Unknown"}
User Question: "${question}"
Keep your response conversational, concise (under 160 words), friendly, and include an emoji or two. Never shame developers.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const aiReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiReply) {
            return NextResponse.json({ success: true, reply: aiReply, source: "gemini" });
          }
        }
      } catch (aiErr) {
        console.warn("AI service fallback triggered:", aiErr);
      }
    }

    // 2. High-Fidelity Deterministic Expert Engine (Zero API Key Required)
    let reply = "";

    if (lowerQ.includes("why") || lowerQ.includes("problem") || lowerQ.includes("barrier")) {
      if (selectedFinding) {
        reply = `Great question! **${selectedFinding.title}** is an accessibility barrier because ${selectedFinding.whyItMatters.toLowerCase()}\n\nUsers who rely on ${selectedFinding.affectedUsers.join(" and ")} are directly impacted. When we fix this, we ensure everyone can navigate independently! 💜`;
      } else {
        reply = `Accessibility barriers happen whenever website code doesn't communicate clearly with assistive technologies like screen readers, or when visual styling excludes low-vision citizens. Making things accessible actually makes code cleaner, faster, and friendlier for everyone! ✨`;
      }
    } else if (lowerQ.includes("how do i fix") || lowerQ.includes("how to fix") || lowerQ.includes("solution")) {
      if (selectedFinding) {
        reply = `Here is how we fix **${selectedFinding.title}**:\n\n1. ${selectedFinding.suggestedFix}\n\n**Example snippet:**\n\`\`\`html\n${selectedFinding.codeAfter}\n\`\`\`\nEstimated effort: **${selectedFinding.effort}** (${selectedFinding.effortRationale}) 🛠️`;
      } else {
        reply = `To fix an issue, select any finding from the list on the right! I'll break down the exact HTML/CSS snippet, before-and-after code, and step-by-step instructions. Let's tackle them one by one! 🚀`;
      }
    } else if (lowerQ.includes("beginner") || lowerQ.includes("explain this code") || lowerQ.includes("simple terms")) {
      if (selectedFinding) {
        reply = `In plain English: ${selectedFinding.plainExplanation}\n\nThink of HTML like building a physical library: an image without an \`alt\` attribute is like putting up a photo behind a curtain without a description. Adding \`alt="Description"\` describes what is there so audio guides can read it aloud! 📚✨`;
      } else {
        reply = `Think of accessibility as digital curb cuts! The ramps on sidewalk corners were built for wheelchair users, but parents with strollers and travellers with rolling luggage use them every day. Semantic HTML works the same way! 🌟`;
      }
    } else if (lowerQ.includes("first") || lowerQ.includes("prioritize") || lowerQ.includes("which issue")) {
      if (allFindings && allFindings.length > 0) {
        const criticals = allFindings.filter((f) => f.severity === "critical");
        const highs = allFindings.filter((f) => f.severity === "high");
        const quickWins = allFindings.filter((f) => f.effort === "Quick");

        if (criticals.length > 0) {
          reply = `I recommend starting with **${criticals[0].title}**! It's marked as **Critical** because it completely blocks assistive device users. Fix that first, and your AccessAble score will jump significantly! 🎯`;
        } else if (quickWins.length > 0) {
          reply = `You don't have any Critical blockers! Let's grab a quick win with **${quickWins[0].title}** (estimated effort: Quick). It takes just a minute to resolve! ⚡`;
        } else if (highs.length > 0) {
          reply = `Tackle **${highs[0].title}** next! It's a High severity finding that will deliver huge usability improvements. 🛠️`;
        } else {
          reply = `Start with the top item on your Accessibility Roadmap! Each fix takes you closer to complete digital dignity. 💜`;
        }
      } else {
        reply = `Always tackle **Critical** issues first (like missing alt text on essential controls or unlabeled form inputs), followed by High-impact color contrast issues! 🎯`;
      }
    } else {
      // General supportive answer
      if (selectedFinding) {
        reply = `Regarding **${selectedFinding.title}** (${selectedFinding.wcagCriterion}): ${selectedFinding.suggestedFix} Check the "How to Verify" tab to make sure it passes when you rescan! 💜`;
      } else {
        reply = `I'm Dr. Pip, your AI accessibility doctor! Ask me anything about WCAG rules, fixing code barriers, or which issue to tackle first. Let's make the web a kinder place! ✨`;
      }
    }

    return NextResponse.json({ success: true, reply, source: "deterministic-expert" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing question.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
