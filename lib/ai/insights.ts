import Anthropic from "@anthropic-ai/sdk";
import { SurveyAnswers } from "@/stores/useSurveyStore";
import { PlanInsight } from "@/types";

const SYSTEM_PROMPT = `You are a compassionate growth coach and behavioral psychologist for Mirr.
You help young adults understand their own patterns and take one small step forward.
You never diagnose, never shame, and never promise transformation.
You speak like a wise, warm friend — direct but kind.
Always end with the smallest possible action.

Return your response strictly as valid JSON matching this structure:
{
  "headline": "A short, provocative yet comforting realization in quotation style (e.g. Don't quit — test quietly.)",
  "body": "2 to 3 sentences explaining the root pattern empathetically.",
  "steps": ["Step 1: micro-action", "Step 2: micro-action", "Step 3: micro-action"],
  "nudges": ["Question 1 to sit with?", "Question 2?", "Question 3?"],
  "pattern_detected": "Brief 2-3 word pattern name",
  "confidence_notes": "One brief sentence of reassurance"
}`;

export function getFallbackInsights(survey: Partial<SurveyAnswers>): PlanInsight {
  const blocker = (survey.blocker || "").toLowerCase();
  const fearWords = ["afraid", "fear", "scared", "what if", "fail", "embarrass", "judge"];
  const procrastWords = ["procrastin", "later", "tomorrow", "start", "begin", "keep putting", "stuck"];
  const timeWords = ["time", "busy", "no time", "schedule", "hours", "exhausted"];

  if (fearWords.some((w) => blocker.includes(w))) {
    return {
      headline: "The fear is information, not a stop sign.",
      body: "What you're describing isn't a lack of ability — it's a nervous system response to perceived risk. The antidote isn't courage, it's evidence. Small actions that contradict the fear, done consistently, rebuild your self-concept from the inside out.",
      steps: [
        "Do one tiny version of the thing you fear today — so small it almost doesn't count.",
        "Write down what actually happened afterwards (usually: nothing terrible).",
        "Repeat until the evidence outweighs the story.",
      ],
      nudges: [
        "What's the smallest possible version of the scary thing you could try in the next 24 hours?",
        "If the outcome were neutral — just a learning — would you still hesitate?",
        "What would you do if no one you know could find out?",
      ],
      pattern_detected: "Fear of judgment",
      confidence_notes: "Acknowledge the fear without letting it steer.",
    };
  }

  if (procrastWords.some((w) => blocker.includes(w))) {
    return {
      headline: "Starting is the only habit that matters first.",
      body: "Procrastination isn't laziness — it's usually avoidance of a negative feeling associated with the task. The solution isn't willpower. It's reducing the starting cost until it's nearly zero. Two minutes of action changes the emotional equation.",
      steps: [
        "Identify the exact first physical action (open the file, write one sentence, send one message).",
        "Do only that. Give yourself full permission to stop after 2 minutes.",
        "Notice that you almost never stop at 2 minutes once you've started.",
      ],
      nudges: [
        "What is the exact first micro-action you'd need to take? Not the project — the first 30 seconds.",
        "Is there a specific time of day when this feels less difficult?",
        "What story are you telling yourself about why this is harder than it is?",
      ],
      pattern_detected: "Starting inertia",
      confidence_notes: "Lower the bar until failure is impossible.",
    };
  }

  if (timeWords.some((w) => blocker.includes(w))) {
    return {
      headline: "You don't need more time. You need one protected slot.",
      body: "Time isn't the real constraint — priority is. Everyone has the same hours. The question is which of your existing activities could be replaced, shortened, or moved to create a protected window for what actually matters.",
      steps: [
        "Audit tomorrow: write down every hour and what you did with it.",
        "Find one 15-minute slot that's currently wasted and protect it for your priority habit.",
        "Guard that slot like a meeting you can't cancel.",
      ],
      nudges: [
        "What's one thing you did this week that mattered less than your stated goal?",
        "What would you give up watching, scrolling, or doing to get 15 free minutes?",
        "What would your routine look like if this was your top priority — not just your stated one?",
      ],
      pattern_detected: "Time fragmentation",
      confidence_notes: "One guarded slot beats five scattered hours.",
    };
  }

  return {
    headline: "Clarity is the first action.",
    body: "Before building habits, you need a clear and honest picture of where you are, where you want to go, and the real obstacle. You've started that work. Now the key is: don't think, act. Start the smallest possible habit today and let the evidence build.",
    steps: [
      "Review your mirror honestly — are these your real answers, or the safe ones?",
      "Pick one habit and do it today, even a 2-minute version.",
      "At the end of the day, write one sentence about what you actually did.",
    ],
    nudges: [
      "Have you described your real goal — or the one that feels acceptable to admit?",
      "What would you tell a close friend who described your exact situation?",
      "What's the one change that would have the biggest ripple effect in your life right now?",
    ],
    pattern_detected: "Unfocused intention",
    confidence_notes: "Action produces clarity faster than thought.",
  };
}

export async function generateMirrorInsights(survey: Partial<SurveyAnswers>): Promise<PlanInsight> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return getFallbackInsights(survey);
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const userPrompt = `Survey responses:
- Life area: ${survey.area || "Not provided"}
- Current problem: ${survey.problem || "Not provided"}
- Desired 1-2 year future: ${survey.future_vision || "Not provided"}
- Stated blocker: ${survey.blocker || "Not provided"}
- Daily routine: ${survey.routine || "Not provided"}
- Available time: ${survey.time_available || "15-20 minutes"}

Generate compassionate, behavioral insights for this person following the JSON schema.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const contentBlock = response.content[0];
    if (contentBlock && contentBlock.type === "text") {
      const text = contentBlock.text.trim();
      const cleanJson = text.startsWith("```json")
        ? text.replace(/^```json\n/, "").replace(/\n```$/, "")
        : text.startsWith("```")
        ? text.replace(/^```\n/, "").replace(/\n```$/, "")
        : text;

      const parsed = JSON.parse(cleanJson);
      return {
        headline: parsed.headline || "Clarity is the first action.",
        body: parsed.body || "",
        steps: Array.isArray(parsed.steps) ? parsed.steps : [],
        nudges: Array.isArray(parsed.nudges) ? parsed.nudges : [],
        pattern_detected: parsed.pattern_detected,
        confidence_notes: parsed.confidence_notes,
      };
    }
  } catch (error) {
    console.warn("Anthropic API call failed, using graceful behavioral fallback:", error);
  }

  return getFallbackInsights(survey);
}

