/**
 * MIRR RESTART ENGINE
 * Deterministic recovery-first algorithm.
 * 
 * "You don't need a perfect streak. You need a way back."
 */

export type TrackType =
  | "project"
  | "habit"
  | "study"
  | "fitness"
  | "routine"
  | "other";

export type MissedReason =
  | "low_energy"
  | "overwhelm"
  | "distraction"
  | "forgot"
  | "too_hard"
  | "life_happened"
  | "other";

export type HabitMaturity = "seed" | "rhythm" | "automatic" | "stacked";

export interface RestartEngineInput {
  daysSinceLastReturn: number;
  lastMissedReason?: MissedReason | string | null;
  availableMinutes: number; // e.g. 2, 5, 10, 25
  trackType: TrackType | string;
  habitMaturity: HabitMaturity | string;
  fullActionText?: string;
  minimumActionText?: string;
}

export interface RestartRecommendation {
  actionText: string;
  minimumActionText: string;
  plannedMinutes: number;
  isMinimumRecommended: boolean;
  adaptationReason: string;
  welcomeMessage: string;
  canStackHabit: boolean;
}

export const MISSED_REASON_LABELS: Record<MissedReason, string> = {
  low_energy: "Low energy",
  overwhelm: "Overwhelm",
  distraction: "Distraction",
  forgot: "Forgot",
  too_hard: "Too hard",
  life_happened: "Life happened",
  other: "Something else",
};

/**
 * Returns a compassionate, guilt-free return message based on days away.
 */
export function getReturnMessage(daysAway: number): string {
  if (daysAway <= 0) {
    return "Ready for today's focused momentum.";
  }
  if (daysAway === 1) {
    return "Welcome back. Yesterday is behind you. Today is clean.";
  }
  if (daysAway <= 7) {
    return `You were away for ${daysAway} days. That does not erase your progress.`;
  }
  return `You were away for ${daysAway} days. Returning is what matters most. Start small.`;
}

/**
 * Computes deterministic restart action based on drift duration and friction reason.
 */
export function computeRestartRecommendation(
  input: RestartEngineInput
): RestartRecommendation {
  const {
    daysSinceLastReturn,
    lastMissedReason,
    availableMinutes,
    trackType,
    habitMaturity,
    fullActionText = "Focus on your daily practice",
    minimumActionText = "Do the 2-minute starting step",
  } = input;

  let plannedMinutes = availableMinutes;
  let isMinimumRecommended = false;
  let adaptationReason = "Standard focused daily practice.";

  // 1. DURATION ADAPTATION BASED ON DRIFT DAYS
  if (daysSinceLastReturn >= 8) {
    // 8+ days away: offer only the minimum version first
    plannedMinutes = Math.min(2, availableMinutes);
    isMinimumRecommended = true;
    adaptationReason = "You've been away for over a week. We recommend the 2-minute minimum version to restart momentum easily.";
  } else if (daysSinceLastReturn >= 3) {
    // 3–7 days away: reduce to a 5–10 minute restart
    plannedMinutes = Math.min(10, Math.max(5, availableMinutes));
    isMinimumRecommended = false;
    adaptationReason = "You were away for a few days. We calibrated today to a gentle 5–10 minute restart.";
  } else {
    // 0–2 days away: normal action
    plannedMinutes = availableMinutes;
    isMinimumRecommended = false;
    adaptationReason = "You are in flow. Offering your standard practice.";
  }

  // 2. REASON-BASED ADAPTATIONS
  if (lastMissedReason) {
    const reason = lastMissedReason.toLowerCase();
    if (reason.includes("overwhelm")) {
      // Overwhelm: reduce scope and duration
      plannedMinutes = Math.min(5, plannedMinutes);
      isMinimumRecommended = true;
      adaptationReason = "Overwhelm noted previously. We lowered today's threshold so you can build momentum without pressure.";
    } else if (reason.includes("low") || reason.includes("energy")) {
      // Low energy: offer minimum version
      plannedMinutes = 2;
      isMinimumRecommended = true;
      adaptationReason = "Low energy noted. A 2-minute minimum action protects your identity with zero friction.";
    } else if (reason.includes("distraction")) {
      // Distraction: short timed session
      plannedMinutes = Math.min(10, plannedMinutes || 5);
      adaptationReason = "Distraction noted. A focused countdown session helps lock in attention.";
    }
  }

  // 3. HABIT STACKING ELIGIBILITY
  // After 7–14 consistent days and reaching 'automatic' maturity
  const canStackHabit =
    habitMaturity === "automatic" ||
    (habitMaturity === "rhythm" && daysSinceLastReturn <= 0);

  const welcomeMessage = getReturnMessage(daysSinceLastReturn);

  return {
    actionText: isMinimumRecommended ? minimumActionText : fullActionText,
    minimumActionText,
    plannedMinutes,
    isMinimumRecommended,
    adaptationReason,
    welcomeMessage,
    canStackHabit,
  };
}

/**
 * Calculates RETURN STREAK: Days since the user last returned.
 * Does NOT require an unbroken streak of zero missed days.
 * Returning after drift resets to 1; consecutive returns increment by 1.
 */
export function calculateReturnStreak(
  history: Array<{ date: string; completed: boolean; isReturn?: boolean }>
): number {
  if (!history || history.length === 0) return 0;

  // Sort descending by date (most recent first)
  const sorted = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  for (const entry of sorted) {
    if (entry.completed) {
      streak += 1;
    } else {
      // Encountered a missed day: break, because streak is consecutive returns
      break;
    }
  }

  return streak;
}

/**
 * Determines habit maturity label based on consecutive completed days.
 */
export function getHabitMaturity(consecutiveDays: number): HabitMaturity {
  if (consecutiveDays < 3) return "seed";
  if (consecutiveDays < 10) return "rhythm";
  return "automatic";
}

/**
 * Generates initial contextual actions during 3-step rapid onboarding.
 */
export function generateInitialActions(
  trackType: string,
  blocker: string,
  timeMinutes: number
): {
  suggestedAction: string;
  minimumAction: string;
  defaultIdentity: string;
} {
  const typeMap: Record<
    string,
    { full: string; min: string; identity: string }
  > = {
    project: {
      full: `Open your side project and solve one small TODO`,
      min: `Open the repository and read 5 lines of code`,
      identity: `A developer who finishes and ships side projects`,
    },
    habit: {
      full: `Complete your core habit session for ${timeMinutes} minutes`,
      min: `Perform the 2-minute starting gesture`,
      identity: `Someone disciplined and grounded in daily rituals`,
    },
    study: {
      full: `Read and synthesize notes for ${timeMinutes} minutes`,
      min: `Open your book or notes and read one paragraph`,
      identity: `A continuous learner who absorbs knowledge daily`,
    },
    fitness: {
      full: `Move your body with intention for ${timeMinutes} minutes`,
      min: `Put on your shoes and do 10 gentle stretches`,
      identity: `An athlete who values daily vitality and strength`,
    },
    routine: {
      full: `Execute your protected routine without multitasking`,
      min: `Take one conscious breath and clear your workspace`,
      identity: `Someone organized, intentional, and calm`,
    },
    other: {
      full: `Focus on your primary commitment for ${timeMinutes} minutes`,
      min: `Take the first 60-second step`,
      identity: `Someone who shows up and keeps small promises`,
    },
  };

  const selected = typeMap[trackType] || typeMap.other;

  return {
    suggestedAction: selected.full,
    minimumAction: selected.min,
    defaultIdentity: selected.identity,
  };
}

