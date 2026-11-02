"use client";

import { useMemo } from "react";
import { ArcProgressCircle } from "./ArcProgressCircle";

interface TodayHeroProps {
  area: string;
  totalHabits: number;
  completedCount: number;
}

export function TodayHero({ area, totalHabits, completedCount }: TodayHeroProps) {
  const { greeting, formattedDate } = useMemo(() => {
    const now = new Date();
    const h = now.getHours();
    const g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    const d = now.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    return { greeting: g, formattedDate: d };
  }, []);

  const isAllComplete = totalHabits > 0 && completedCount === totalHabits;

  return (
    <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.14)] rounded-md p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div>
        <p className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] mb-1.5">
          {formattedDate} · {area}
        </p>
        <h2 className="font-serif italic text-2xl sm:text-[26px] text-[#F0EAE0] leading-snug mb-1">
          {greeting}. {isAllComplete ? "Today's commitments are sealed." : "Here is your focus for today."}
        </h2>
        <p className="text-xs font-light text-[#8A8070] leading-relaxed max-w-[500px]">
          {isAllComplete
            ? "You showed up and kept your word. Rest easy tonight."
            : `Showing up today is your only requirement. ${totalHabits - completedCount} atomic actions remaining.`}
        </p>
      </div>

      <ArcProgressCircle completedCount={completedCount} totalCount={totalHabits} />
    </div>
  );
}

