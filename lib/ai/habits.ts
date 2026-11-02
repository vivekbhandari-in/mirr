import Anthropic from "@anthropic-ai/sdk";
import { SurveyAnswers } from "@/stores/useSurveyStore";
import { PlanInsight } from "@/types";

export interface GeneratedHabit {
  name: string;
  purpose: string;
  action: string;
  cue: string;
  minimum_version: string;
  frequency: string;
  why_this_connects?: string;
}

const HABIT_BANK: Record<string, GeneratedHabit[]> = {
  "Career & work": [
    {
      name: "One deep work block",
      purpose: "Build focused output capacity",
      action: "Work on one meaningful task with phone away",
      cue: "Right after morning coffee",
      minimum_version: "Just open the task and read it for 2 minutes",
      frequency: "Daily",
      why_this_connects: "Trains deep work stamina without cognitive switching",
    },
    {
      name: "End-of-day capture",
      purpose: "Close mental loops before sleep",
      action: "Write 3 things accomplished + top task for tomorrow",
      cue: "When you close your laptop",
      minimum_version: "Just write the one top task for tomorrow",
      frequency: "Weekdays",
      why_this_connects: "Eliminates morning friction and anxiety",
    },
  ],
  "Discipline & focus": [
    {
      name: "Morning intention",
      purpose: "Start with direction, not reaction",
      action: 'Before opening your phone, write one sentence: "Today I will…"',
      cue: "Right after waking up",
      minimum_version: "Say it silently in your head",
      frequency: "Daily",
      why_this_connects: "Protects the first 10 minutes of consciousness",
    },
    {
      name: "Single-task block",
      purpose: "Train distraction resistance",
      action: "Choose one task. Set a timer. Nothing else until it rings.",
      cue: "First thing after lunch",
      minimum_version: "5 minutes on the task — then you are free to stop",
      frequency: "Daily",
      why_this_connects: "Breaks the multi-tab dopamine trap",
    },
  ],
  "Health & energy": [
    {
      name: "Movement minimum",
      purpose: "Build physical baseline",
      action: "Walk outside for 10 minutes — no podcast, just walking",
      cue: "After your biggest meal of the day",
      minimum_version: "5 minutes of stretching at your desk",
      frequency: "Daily",
      why_this_connects: "Regulates nervous system and post-meal glucose",
    },
    {
      name: "Sleep anchor",
      purpose: "Protect recovery",
      action: "Screens off 30 minutes before target sleep time",
      cue: "Nightly wind-down alarm",
      minimum_version: "Put phone face down across the room 10 minutes earlier",
      frequency: "Daily",
      why_this_connects: "Restores circadian alignment",
    },
  ],
  Confidence: [
    {
      name: "One brave action",
      purpose: "Build confidence through evidence",
      action: "Do one small thing you've been avoiding — a message, a question, or a request",
      cue: "Morning, before checking notifications",
      minimum_version: "Write down what you'd do if you weren't afraid",
      frequency: "Daily",
      why_this_connects: "Evidence changes belief faster than affirmations",
    },
  ],
  Relationships: [
    {
      name: "One genuine connection",
      purpose: "Invest in people intentionally",
      action: "Send one message, make one call, or have one real conversation today",
      cue: "During your first break",
      minimum_version: "Think of one person you appreciate and why",
      frequency: "Daily",
      why_this_connects: "Maintains relational warmth without heavy effort",
    },
  ],
  "Daily routine": [
    {
      name: "Anchor habit",
      purpose: "Build a reliable daily structure",
      action: "Do one thing at the exact same time every day",
      cue: "Pick a time and set a daily reminder",
      minimum_version: "Show up for 2 minutes, even if you do nothing else",
      frequency: "Daily",
      why_this_connects: "Acts as a psychological tentpole for the entire day",
    },
  ],
  Finances: [
    {
      name: "Daily financial check",
      purpose: "Build money awareness",
      action: "Spend 5 minutes reviewing what you spent yesterday",
      cue: "With your morning coffee",
      minimum_version: "Just open your bank app and glance",
      frequency: "Daily",
      why_this_connects: "Dissolves avoidance around finances",
    },
  ],
  "Personal growth": [
    {
      name: "Reading block",
      purpose: "Feed your mind deliberately",
      action: "Read 5–10 pages of something that challenges you",
      cue: "Before bed, after putting your phone away",
      minimum_version: "Read one paragraph — even one is better than zero",
      frequency: "Daily",
      why_this_connects: "Compounds cognitive capital quietly",
    },
  ],
};

const DEFAULT_REFLECTION_HABIT: GeneratedHabit = {
  name: "Daily reflection",
  purpose: "Build self-awareness over time",
  action: "Write 2 sentences about your day — what worked, what didn't",
  cue: "When you get into bed",
  minimum_version: "Write one word describing how today felt",
  frequency: "Daily",
  why_this_connects: "Locks in lessons before sleep",
};

export function getFallbackHabits(survey: Partial<SurveyAnswers>): GeneratedHabit[] {
  const area = survey.area || "Personal growth";
  const bank = HABIT_BANK[area] || HABIT_BANK["Personal growth"];
  const list = [...bank];

  // Adjust actions to match user's time window if specified
  const time = survey.time_available || "15–20 minutes";
  const adjusted = list.map((h) => ({
    ...h,
    action: h.action.includes("minutes") ? h.action : `${h.action} for ${time}`,
  }));

  // Limit to 2 habits + 1 reflection habit
  const selected = adjusted.slice(0, 2);
  selected.push(DEFAULT_REFLECTION_HABIT);

  return selected;
}

export async function generatePersonalizedHabits(
  survey: Partial<SurveyAnswers>,
  insights: PlanInsight
): Promise<GeneratedHabit[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return getFallbackHabits(survey);
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const prompt = `Based on this user's situation and insight:
Area: ${survey.area}
Problem: ${survey.problem}
Goal: ${survey.future_vision}
Blocker: ${survey.blocker}
Routine: ${survey.routine}
Available daily time: ${survey.time_available}
Insight: ${insights.headline} — ${insights.body}

Generate exactly 2 to 3 atomic habits.
Follow James Clear's Atomic Habits principles (obvious cue, attractive, easy, satisfying).
Rules:
- Matched to user's ${survey.time_available} window.
- Never require buying anything or signing up for apps.
- Must include a "minimum_version" that takes under 2 minutes for bad/low-energy days.
- Include a specific, existing daily cue.

Return JSON array:
[
  {
    "name": "Habit Name",
    "purpose": "Why this matters",
    "action": "Exact physical action",
    "cue": "Clear trigger/cue",
    "minimum_version": "Ultra-small 2-minute fallback",
    "frequency": "Daily",
    "why_this_connects": "Brief explanation of how it tackles the blocker"
  }
]`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.7,
      system:
        "You are an expert in behavioral design and atomic habits. Output strictly valid JSON without preamble.",
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 3);
      }
    }
  } catch (error) {
    console.warn("Claude habits generation fallback:", error);
  }

  return getFallbackHabits(survey);
}

