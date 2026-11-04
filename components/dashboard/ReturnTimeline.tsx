"use client";

import React from "react";
import { Sparkles, Check, Minimize2, CircleAlert, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface ReturnTimelineItem {
  id: string;
  date: string; // e.g. "Nov 4"
  type: "return" | "completed" | "minimum" | "missed";
  title: string;
  details?: string;
  minutes?: number;
  daysDrifted?: number;
}

export interface ReturnTimelineProps {
  items: ReturnTimelineItem[];
  className?: string;
}

export function ReturnTimeline({ items, className = "" }: ReturnTimelineProps) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center rounded-card bg-surface border border-border select-none">
        <p className="text-sm text-foreground-secondary">
          No return events recorded yet. Complete your first restart today.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 select-none ${className}`}>
      {items.map((item) => {
        const isReturn = item.type === "return" || (item.daysDrifted && item.daysDrifted > 1);
        const isMin = item.type === "minimum";
        const isMissed = item.type === "missed";

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 sm:p-5 rounded-card bg-surface border border-border hover:border-border-strong transition-colors"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Event Icon Pill */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isReturn
                    ? "bg-primary/10 text-primary"
                    : isMin
                    ? "bg-teal-500/10 text-teal-600"
                    : isMissed
                    ? "bg-stone-200 text-stone-600"
                    : "bg-success/10 text-success"
                }`}
              >
                {isReturn ? (
                  <Sparkles size={16} />
                ) : isMin ? (
                  <Minimize2 size={16} />
                ) : isMissed ? (
                  <CircleAlert size={16} />
                ) : (
                  <Check size={16} />
                )}
              </div>

              {/* Text & Timing */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-mono font-semibold text-foreground">
                    {item.date}
                  </span>
                  <span className="text-foreground-muted">·</span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {item.title}
                  </span>
                </div>
                {item.details && (
                  <p className="text-xs text-foreground-secondary truncate pt-0.5">
                    {item.details}
                  </p>
                )}
              </div>
            </div>

            {/* Right Badge / Duration */}
            <div className="shrink-0 pl-3">
              {item.minutes ? (
                <span className="text-xs font-mono text-foreground-muted bg-surface-elevated px-2.5 py-1 rounded-full border border-border">
                  {item.minutes} min
                </span>
              ) : isMissed ? (
                <Badge variant="neutral">Rest / Reset</Badge>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

