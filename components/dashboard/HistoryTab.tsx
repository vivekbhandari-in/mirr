"use client";

import { useMemo } from "react";

interface HistoryTabProps {
  streak: number;
  checks: Record<string, Record<string, boolean>>;
}

export function HistoryTab({ streak, checks }: HistoryTabProps) {
  const isUnlocked = streak >= 7;

  // Generate 28-day grid for history view
  const past28Days = useMemo(() => {
    const list = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = d.toDateString();
      const dayChecks = checks[ds] || {};
      const completedCount = Object.values(dayChecks).filter(Boolean).length;
      const totalCount = Object.keys(dayChecks).length;
      const isDone = completedCount > 0 && completedCount >= totalCount;
      const isPartial = completedCount > 0 && !isDone;

      list.push({
        date: d,
        dateStr: ds,
        completedCount,
        isDone,
        isPartial,
        isToday: i === 0,
      });
    }

    return list;
  }, [checks]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-2 border-b border-[rgba(201,169,110,0.14)] flex items-center justify-between">
          <span>Growth history</span>
          <span className="text-[10px] text-[#8A8070]">
            {isUnlocked ? "Full heatmap unlocked" : `Unlocks at 7 days`}
          </span>
        </div>

        {!isUnlocked ? (
          <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.14)] rounded-md p-8 sm:p-10 text-center space-y-3">
            <h3 className="font-serif italic text-2xl text-[#F0EAE0]">
              Your history is being written.
            </h3>
            <p className="text-xs text-[#8A8070] font-light max-w-[420px] mx-auto leading-relaxed">
              You&apos;re on day {streak}. The full consistency heatmap unlocks after 7 consecutive days of showing up.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-3 py-1 rounded-sm">
                {7 - streak} days remaining until unlock
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.14)] rounded-md p-6 space-y-4">
            <div>
              <p className="text-xs font-medium text-[#F0EAE0] mb-0.5">
                Past 4 weeks consistency
              </p>
              <p className="text-[11px] text-[#8A8070] font-light">
                Every square represents evidence recorded on that day.
              </p>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {past28Days.map((d, i) => (
                <div key={i} className="text-center">
                  <div
                    title={`${d.dateStr}: ${d.completedCount} habits done`}
                    className={`w-full aspect-square rounded-sm border transition-colors flex items-center justify-center text-[10px] ${
                      d.isDone
                        ? "bg-[#C9A96E] border-[#C9A96E] text-[#141210] font-bold"
                        : d.isPartial
                        ? "bg-[#C9A96E]/25 border-[rgba(201,169,110,0.3)] text-[#F0EAE0]"
                        : d.isToday
                        ? "border-[#C9A96E] bg-transparent text-[#C9A96E]"
                        : "bg-[#242018] border-[#4A4438]/50 text-transparent"
                    }`}
                  >
                    {d.isDone ? "✓" : ""}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[rgba(201,169,110,0.14)] flex items-center justify-between text-[11px] text-[#8A8070] font-light">
              <span>{streak}-day active momentum</span>
              <span className="text-[#C9A96E]">Consistent</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

