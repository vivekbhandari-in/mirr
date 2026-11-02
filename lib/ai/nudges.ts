import Anthropic from "@anthropic-ai/sdk";
import { SurveyAnswers } from "@/stores/useSurveyStore";

export interface WeekData {
  checkins_count: number;
  total_possible: number;
  missed_reasons: string[];
  reflection_text?: string;
  streak: number;
}

export async function generateWeeklyNudges(
  survey: Partial<SurveyAnswers>,
  weekData: WeekData
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  const fallbackNudges = [
    "What worked better this week than you expected it would?",
    "When did you feel the least friction taking action?",
    "If you could remove one recurring distraction for the next 7 days, what would it be?",
  ];

  if (!apiKey || apiKey.trim() === "") {
    return fallbackNudges;
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const prompt = `User focus: ${survey.area || "Growth"}
Goal: ${survey.future_vision || "Progress"}
Blocker: ${survey.blocker || "Unclear"}
Week performance:
- Completed checkins: ${weekData.checkins_count} of ${weekData.total_possible}
- Current streak: ${weekData.streak} days
- Common missed reasons: ${weekData.missed_reasons.join(", ") || "None recorded"}
- Recent reflection: "${weekData.reflection_text || "None"}"

Generate 3 reflective questions for the user's weekly review.
They should be non-judgmental, curious, and grounded in behavioral psychology.
Return JSON array of 3 strings: ["Question 1?", "Question 2?", "Question 3?"]`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 400,
      temperature: 0.7,
      system:
        "You are an empathetic coach. Output strictly valid JSON array of 3 strings.",
      messages: [{ role: "user", content: prompt }],
    });

    const block = response.content[0];
    if (block && block.type === "text") {
      const text = block.text.trim();
      const cleanJson = text.startsWith("```json")
        ? text.replace(/^```json\n/, "").replace(/\n```$/, "")
        : text.startsWith("```")
        ? text.replace(/^```\n/, "").replace(/\n```$/, "")
        : text;

      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed.slice(0, 3);
      }
    }
  } catch (error) {
    console.warn("Weekly nudges Claude generation fallback:", error);
  }

  return fallbackNudges;
}

