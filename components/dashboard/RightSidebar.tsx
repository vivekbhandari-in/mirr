"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FocusTimer } from "./FocusTimer";

interface RightSidebarProps {
  streak: number;
  clarityPct: number;
  checks: Record<string, Record<string, boolean>>;
  totalHabitsCount: number;
  reflections: Record<string, any>;
  onExportJson: () => void;
  onExportText: () => void;
  onClearAll: () => void;
  className?: string;
}

export function RightSidebar({
  streak,
  clarityPct,
  checks,
  totalHabitsCount,
  reflections,
  onExportJson,
  onExportText,
  onClearAll,
  className,
}: RightSidebarProps) {
  // 1. Weekly Rhythm: Current week Monday to Sunday
  const weekDays = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Current day in 0 (Mon) to 6 (Sun)
    const currentDayIdx = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - currentDayIdx);

    const labels = ["M", "T", "W", "T", "F", "S", "S"];

    return labels.map((label, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const ds = d.toDateString();
      const isToday = idx === currentDayIdx;
      const isFuture = idx > currentDayIdx;

      let status: "done" | "today" | "future" | "partial" = "future";

      if (isFuture) {
        status = "future";
      } else {
        const dayChecks = checks[ds] || {};
        const doneCount = Object.values(dayChecks).filter(Boolean).length;
        const total = totalHabitsCount || Object.keys(dayChecks).length || 1;

        if (doneCount > 0 && doneCount >= total) {
          status = "done";
        } else if (doneCount > 0) {
          status = "partial";
        } else if (isToday) {
          status = "today";
        } else {
          status = "future"; // Past uncompleted acts as inactive background dot
        }
      }

      return { label, status, dateStr: ds };
    });
  }, [checks, totalHabitsCount]);

  // 2. Identity Milestone
  const milestone = useMemo(() => {
    if (streak < 7) {
      return {
        phase: "Resistance threshold",
        daysToUnlock: `${7 - streak} days to next unlock`,
        targetDays: 7,
      };
    }
    if (streak < 21) {
      return {
        phase: "Automaticity shift",
        daysToUnlock: `${21 - streak} days to next unlock`,
        targetDays: 21,
      };
    }
    if (streak < 66) {
      return {
        phase: "Identity consolidation",
        daysToUnlock: `${66 - streak} days to next unlock`,
        targetDays: 66,
      };
    }
    return {
      phase: "Integrated autonomy",
      daysToUnlock: "Mastery threshold achieved",
      targetDays: 100,
    };
  }, [streak]);

  const milestoneProgress = Math.min(100, Math.round((streak / milestone.targetDays) * 100));

  // 3. Last reflection calculation
  const lastReflection = useMemo(() => {
    const dates = Object.keys(reflections).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    if (dates.length === 0) return null;

    for (const d of dates) {
      const entry = reflections[d];
      if (entry) {
        const firstLine = entry.wentWell || entry.blockedBy || entry.changeNext;
        if (firstLine && firstLine.trim()) {
          return {
            date: d,
            snippet: firstLine.trim().split("\n")[0],
          };
        }
      }
    }
    return null;
  }, [reflections]);

  return (
    <aside
      className={`w-[320px] min-w-[320px] bg-[#1C1914] border-l border-[rgba(201,169,110,0.14)] p-5 space-y-6 select-none overflow-y-auto no-scrollbar flex-shrink-0 h-full ${
        className || ""
      }`}
      aria-label="Dashboard telemetry sidebar"
    >
      {/* 1. Weekly Rhythm */}
      <div className="space-y-3">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-1.5 border-b border-[rgba(201,169,110,0.14)]">
          Weekly rhythm
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-[#8A8070] font-light">{day.label}</span>
              <div
                title={`${day.dateStr}: ${day.status}`}
                className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs transition-colors duration-200 ${
                  day.status === "done"
                    ? "bg-[#C9A96E] text-[#141210] font-bold"
                    : day.status === "today"
                    ? "border border-[#C9A96E] bg-transparent text-[#C9A96E]"
                    : day.status === "partial"
                    ? "bg-[#C9A96E]/25 text-[#F0EAE0]"
                    : "bg-[#2E2A20] text-transparent"
                }`}
              >
                {day.status === "done" ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Clarity Score */}
      <div className="space-y-2">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-1.5 border-b border-[rgba(201,169,110,0.14)]">
          Clarity score
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="font-serif italic text-3xl text-[#F0EAE0] leading-none">
            {clarityPct}%
          </span>
          <span className="text-[11px] text-[#8A8070] font-light">
            Today&apos;s completion
          </span>
        </div>

        <div className="w-full h-1.5 bg-[#2E2A20] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clarityPct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="h-full bg-[#C9A96E] rounded-full"
          />
        </div>
      </div>

      {/* 3. Identity Milestone */}
      <div className="space-y-2">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-1.5 border-b border-[rgba(201,169,110,0.14)]">
          Identity milestone
        </div>

        <div className="pt-1">
          <p className="text-xs font-medium text-[#F0EAE0]">{milestone.phase}</p>
          <p className="text-[11px] text-[#8A8070] font-light mt-0.5">
            Day {streak} counter
          </p>
        </div>

        <div className="w-full h-1.5 bg-[#2E2A20] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${milestoneProgress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="h-full bg-[#C9A96E] rounded-full"
          />
        </div>

        <p className="text-[10px] text-[#8A8070] font-light">{milestone.daysToUnlock}</p>
      </div>

      {/* 4. Focus Timer */}
      <FocusTimer />

      {/* 5. Last Reflection */}
      <div className="space-y-2">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-1.5 border-b border-[rgba(201,169,110,0.14)]">
          Last reflection
        </div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-[#141210] border border-[rgba(201,169,110,0.1)] hover:border-[rgba(201,169,110,0.25)] rounded-md p-3.5 space-y-1.5 transition-colors"
        >
          {lastReflection ? (
            <>
              <p className="text-[10px] text-[#C9A96E] font-normal">
                {lastReflection.date}
              </p>
              <p className="font-serif italic text-xs text-[#F0EAE0] leading-relaxed line-clamp-3">
                &ldquo;{lastReflection.snippet}&rdquo;
              </p>
            </>
          ) : (
            <p className="font-serif italic text-xs text-[#8A8070] leading-relaxed">
              No reflection sealed yet. Fill out tonight&apos;s debrief.
            </p>
          )}
        </motion.div>
      </div>

      {/* 6. Data Section */}
      <div className="space-y-2.5 pt-2">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-1.5 border-b border-[rgba(201,169,110,0.14)]">
          Data &amp; privacy
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportJson}
            className="flex-1 py-1.5 px-2.5 bg-[#242018] hover:bg-[#2E2A20] text-[#F0EAE0] hover:text-[#C9A96E] text-[11px] font-light rounded-sm border border-[#4A4438] transition-colors duration-200"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={onExportText}
            className="flex-1 py-1.5 px-2.5 bg-[#242018] hover:bg-[#2E2A20] text-[#F0EAE0] hover:text-[#C9A96E] text-[11px] font-light rounded-sm border border-[#4A4438] transition-colors duration-200"
          >
            Export text
          </button>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="w-full py-1.5 text-[11px] font-normal text-[#B5402A] hover:bg-[#B5402A]/10 border border-[#B5402A]/30 rounded-sm transition-colors duration-200"
        >
          Clear all data
        </button>

        <p className="text-[10px] text-[#8A8070]/80 font-light leading-relaxed">
          Stored locally in your private sanctuary. Never leaves your browser.
        </p>
      </div>
    </aside>
  );
}

