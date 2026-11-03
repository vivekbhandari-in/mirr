import { PersonalMirror, ProofEvent, ReflectionEntry } from "@/types/identity";

export const DEFAULT_PERSONAL_MIRROR: PersonalMirror = {
  desiredIdentity: "A disciplined developer who ships consistently",
  currentReality: "I start projects but abandon them after a few days",
  mainBlocker: "Distraction and low energy at night",
  antiFuture: "Someone who consumes content but never finishes what they start",
  dailyProtectedTime: 30,
  focusArea: "Career",
  todayAction: {
    title: "Build for 25 focused minutes",
    description: "Open your current project and make one small visible improvement",
    minimumVersion: "Open the editor and write one function",
    anchor: "After morning coffee",
    duration: 25,
    driftPattern: "You usually skip deep work after late nights",
  },
  driftPattern: "You tend to overcommit after a productive week, then avoid the app when you fall behind.",
};

export function synthesizePersonalMirror(rawSurvey: any): PersonalMirror {
  if (!rawSurvey) return DEFAULT_PERSONAL_MIRROR;

  const area = rawSurvey.area || "Career";
  const problem = rawSurvey.problem || "I start projects but abandon them after a few days";
  const future = rawSurvey.future_vision || "A disciplined builder who ships consistently";
  const blocker = rawSurvey.blocker || "Distraction and scattered attention";
  const routine = rawSurvey.routine || "Work during the day, distracted in evenings";
  
  // Extract minutes from time_available (e.g. "30 minutes" -> 30)
  let timeNum = 30;
  if (typeof rawSurvey.time_available === "string") {
    const match = rawSurvey.time_available.match(/\d+/);
    if (match) timeNum = parseInt(match[0], 10);
  }

  // Derive anti-future
  const antiFuture = `Someone who remains trapped in ${problem.slice(0, 70).toLowerCase()}${problem.length > 70 ? "…" : ""}`;

  return {
    desiredIdentity: future.length > 80 ? future.slice(0, 80) + "…" : future,
    currentReality: problem,
    mainBlocker: blocker,
    antiFuture,
    dailyProtectedTime: timeNum || 30,
    focusArea: area,
    todayAction: {
      title: `Protect ${Math.min(timeNum || 25, 45)} focused minutes for ${area.toLowerCase()}`,
      description: `Complete one meaningful milestone toward: "${future.slice(0, 60)}"`,
      minimumVersion: "Open your primary tool and complete one 5-minute micro-action",
      anchor: routine.includes("morning") ? "Right after morning coffee" : "Before beginning reactive email or feeds",
      duration: Math.min(timeNum || 25, 45),
      driftPattern: `Avoidance triggered by "${blocker.slice(0, 40)}"`,
    },
    driftPattern: `You tend to lose momentum when ${blocker.toLowerCase()} creates silent friction.`,
  };
}

export const INITIAL_PROOF_EVENTS: ProofEvent[] = [
  {
    id: "pe-1",
    date: "Nov 3",
    fullDate: new Date(Date.now() - 86400000 * 0).toISOString(),
    type: "completed",
    title: "Completed 25-minute focused build session",
    details: "Built the database migration and pushed to main.",
  },
  {
    id: "pe-2",
    date: "Nov 2",
    fullDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    type: "minimum",
    title: "Used minimum version after low energy",
    details: "Wrote one API handler function. Momentum preserved.",
  },
  {
    id: "pe-3",
    date: "Nov 1",
    fullDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    type: "returned",
    title: "Returned after 3 missed days",
    details: "Showed up without guilt. Re-established the morning anchor.",
  },
  {
    id: "pe-4",
    date: "Oct 31",
    fullDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    type: "missed",
    title: "Missed: Distraction",
    details: "Drifted into social feed rabbit hole after evening fatigue.",
  },
  {
    id: "pe-5",
    date: "Oct 30",
    fullDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    type: "completed",
    title: "Completed 30-minute deep work block",
    details: "Refactored user authentication without checking phone.",
  },
];

