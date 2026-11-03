export interface PersonalMirror {
  desiredIdentity: string;
  currentReality: string;
  mainBlocker: string;
  antiFuture: string;
  dailyProtectedTime: number; // in minutes
  focusArea: string;
  todayAction: {
    title: string;
    description: string;
    minimumVersion: string;
    anchor: string;
    duration: number; // in minutes
    driftPattern?: string;
  };
  driftPattern: string;
}

export type ActionStatus = "pending" | "completed" | "minimum" | "missed";

export interface TodayProofState {
  status: ActionStatus;
  completedAt?: string;
  durationActual?: number;
  missedReason?: string;
  recoveryNote?: string;
}

export interface ProofEvent {
  id: string;
  date: string; // e.g. "Nov 3"
  fullDate: string; // ISO
  type: "completed" | "minimum" | "returned" | "missed";
  title: string;
  details?: string;
}

export interface ReflectionEntry {
  wentWell: string;
  blockedBy: string;
  changeNext: string;
  isSealed: boolean;
  savedAt?: string;
}

export interface DriftDiagnostic {
  daysDrifted: number;
  likelyPattern: string;
  recommendation: string;
  returnAction: {
    title: string;
    duration: number;
  };
  daysSinceReturn: number;
}

