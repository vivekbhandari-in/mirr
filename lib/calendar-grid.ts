import { ProofEvent, ReflectionEntry, TodayProofState } from "@/types/identity";

export interface CalendarGridDay {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Mon, 6 = Sun
  month: number; // 0-11
  dayOfMonth: number;
  isToday: boolean;
  isFuture: boolean;
  intensity: 0 | 1 | 2 | 3 | 4;
  status: "future" | "completed" | "minimum" | "returned" | "missed" | "rest";
  event?: ProofEvent;
  reflection?: ReflectionEntry;
  formattedDate: string; // e.g. "Wednesday, Nov 4, 2026"
}

export interface CalendarGridWeek {
  weekIndex: number;
  days: CalendarGridDay[];
}

export interface MonthLabel {
  name: string;
  columnIndex: number;
}

export interface ConsistencyStats {
  totalCompleted: number;
  fullProofCount: number;
  minimumCount: number;
  returnedCount: number;
  missedCount: number;
  sealedReflectionsCount: number;
  pastDaysCount: number;
  consistencyRate: number; // percentage (0-100)
  longestStreak: number;
  currentStreak: number;
}

export function formatDateToYYYYMMDD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/**
 * Builds a 52-week Monday-aligned grid ending on the current week's Sunday.
 */
export function generateConsistencyGrid(
  proofEvents: ProofEvent[] = [],
  reflections: Record<string, ReflectionEntry> = {},
  todayProofState?: TodayProofState,
  referenceDate: Date = new Date()
): {
  weeks: CalendarGridWeek[];
  monthLabels: MonthLabel[];
  stats: ConsistencyStats;
} {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDateToYYYYMMDD(today);

  // 1. Build lookup maps for fast access
  const eventsByDate = new Map<string, ProofEvent>();
  for (const ev of proofEvents) {
    if (!ev.fullDate) continue;
    try {
      const d = new Date(ev.fullDate);
      if (!isNaN(d.getTime())) {
        const key = formatDateToYYYYMMDD(d);
        eventsByDate.set(key, ev);
      }
    } catch {}
  }

  // 2. Determine current week's Monday and ending Sunday
  // JS day: 0=Sun, 1=Mon, ..., 6=Sat
  const jsDay = today.getDay();
  const isoDay = jsDay === 0 ? 7 : jsDay; // 1=Mon, 7=Sun
  
  const currentWeekMonday = new Date(today);
  currentWeekMonday.setDate(today.getDate() - (isoDay - 1));

  // 52 weeks = 51 weeks before current week Monday
  const startDate = new Date(currentWeekMonday);
  startDate.setDate(currentWeekMonday.getDate() - 51 * 7);

  const weeks: CalendarGridWeek[] = [];
  const monthLabels: MonthLabel[] = [];
  let lastLabeledMonth = -1;
  let lastLabeledCol = -4;

  let totalCompleted = 0;
  let fullProofCount = 0;
  let minimumCount = 0;
  let returnedCount = 0;
  let missedCount = 0;
  let sealedReflectionsCount = 0;
  let pastDaysCount = 0;

  // Running streak trackers
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const cursor = new Date(startDate);

  for (let w = 0; w < 52; w++) {
    const days: CalendarGridDay[] = [];

    for (let dIdx = 0; dIdx < 7; dIdx++) {
      const dayDate = new Date(cursor);
      const dateStr = formatDateToYYYYMMDD(dayDate);
      const isToday = dateStr === todayStr;
      const isFuture = dayDate.getTime() > today.getTime();

      let event = eventsByDate.get(dateStr);
      const reflection = reflections[dateStr];

      // Inject today's live proofState if today has no saved archive event yet
      if (isToday && !event && todayProofState && todayProofState.status !== "pending") {
        event = {
          id: `today-${Date.now()}`,
          date: "Today",
          fullDate: today.toISOString(),
          type: todayProofState.status,
          title: todayProofState.status === "completed"
            ? "Completed daily focus"
            : todayProofState.status === "minimum"
            ? "Minimum version completed"
            : "Missed / Drift noted",
          details: todayProofState.missedReason || undefined,
        };
      }

      // Determine Intensity & Status
      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      let status: CalendarGridDay["status"] = "rest";

      if (isFuture) {
        status = "future";
        intensity = 0;
      } else {
        pastDaysCount++;

        if (event) {
          if (event.type === "completed") {
            status = "completed";
            intensity = reflection?.isSealed ? 4 : 3;
            fullProofCount++;
            totalCompleted++;
          } else if (event.type === "returned") {
            status = "returned";
            intensity = reflection?.isSealed ? 3 : 2;
            returnedCount++;
            totalCompleted++;
          } else if (event.type === "minimum") {
            status = "minimum";
            intensity = reflection?.isSealed ? 2 : 1;
            minimumCount++;
            totalCompleted++;
          } else if (event.type === "missed") {
            status = "missed";
            intensity = 0;
            missedCount++;
          }
        }

        if (reflection?.isSealed) {
          sealedReflectionsCount++;
        }

        // Streak calculation
        if (status === "completed" || status === "minimum" || status === "returned") {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          tempStreak = 0;
        }
      }

      const formattedDate = dayDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      days.push({
        date: dayDate,
        dateStr,
        dayOfWeek: dIdx, // 0=Mon, 6=Sun
        month: dayDate.getMonth(),
        dayOfMonth: dayDate.getDate(),
        isToday,
        isFuture,
        intensity,
        status,
        event,
        reflection,
        formattedDate,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    // Month label generation (check first 3 days of week for month change)
    const midWeekMonth = days[2].month;
    if (midWeekMonth !== lastLabeledMonth && w - lastLabeledCol >= 3) {
      monthLabels.push({
        name: MONTH_NAMES[midWeekMonth],
        columnIndex: w,
      });
      lastLabeledMonth = midWeekMonth;
      lastLabeledCol = w;
    }

    weeks.push({ weekIndex: w, days });
  }

  // Calculate current streak ending today
  currentStreak = 0;
  for (let w = weeks.length - 1; w >= 0; w--) {
    let broken = false;
    for (let d = weeks[w].days.length - 1; d >= 0; d--) {
      const day = weeks[w].days[d];
      if (day.isFuture) continue;
      if (day.status === "completed" || day.status === "minimum" || day.status === "returned") {
        currentStreak++;
      } else {
        // If today is pending, allow streak from yesterday
        if (day.isToday && day.status === "rest") {
          continue;
        }
        broken = true;
        break;
      }
    }
    if (broken) break;
  }

  const consistencyRate = pastDaysCount > 0
    ? Math.round((totalCompleted / Math.max(1, pastDaysCount)) * 100)
    : 0;

  return {
    weeks,
    monthLabels,
    stats: {
      totalCompleted,
      fullProofCount,
      minimumCount,
      returnedCount,
      missedCount,
      sealedReflectionsCount,
      pastDaysCount,
      consistencyRate,
      longestStreak,
      currentStreak,
    },
  };
}

