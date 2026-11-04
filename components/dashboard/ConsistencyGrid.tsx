"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  ProofEvent,
  ReflectionEntry,
  TodayProofState,
} from "@/types/identity";
import {
  generateConsistencyGrid,
  CalendarGridDay,
  CalendarGridWeek,
} from "@/lib/calendar-grid";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar,
  Check,
  Minimize2,
  Undo2,
  CircleAlert,
  Sparkles,
  BookOpen,
  Info,
  X,
} from "lucide-react";

interface ConsistencyGridProps {
  proofEvents?: ProofEvent[];
  reflections?: Record<string, ReflectionEntry>;
  todayProofState?: TodayProofState;
  className?: string;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ConsistencyGrid({
  proofEvents = [],
  reflections = {},
  todayProofState,
  className = "",
}: ConsistencyGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 52 weeks and stats
  const { weeks, monthLabels, stats } = useMemo(() => {
    return generateConsistencyGrid(proofEvents, reflections, todayProofState);
  }, [proofEvents, reflections, todayProofState]);

  // Selected day state (for mobile tap or keyboard activation)
  const [selectedDay, setSelectedDay] = useState<CalendarGridDay | null>(null);

  // Hover state (for desktop tooltip)
  const [hoveredDay, setHoveredDay] = useState<CalendarGridDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Auto-scroll to the rightmost (current) week on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const handleCellHover = useCallback((day: CalendarGridDay, e: React.MouseEvent<HTMLButtonElement>) => {
    if (day.isFuture) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay(day);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, []);

  const handleCellLeave = useCallback(() => {
    setHoveredDay(null);
    setTooltipPos(null);
  }, []);

  const handleCellClick = useCallback((day: CalendarGridDay) => {
    if (day.isFuture) return;
    if (selectedDay?.dateStr === day.dateStr) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  }, [selectedDay]);

  // Keyboard navigation within the grid
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, weekIdx: number, dayIdx: number) => {
      let targetWeek = weekIdx;
      let targetDay = dayIdx;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        targetDay = Math.max(0, dayIdx - 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        targetDay = Math.min(6, dayIdx + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        targetWeek = Math.max(0, weekIdx - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        targetWeek = Math.min(51, weekIdx + 1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const day = weeks[weekIdx].days[dayIdx];
        if (!day.isFuture) setSelectedDay(day);
        return;
      } else {
        return;
      }

      // Focus target element
      const targetId = `grid-cell-${targetWeek}-${targetDay}`;
      const elem = document.getElementById(targetId);
      if (elem) elem.focus();
    },
    [weeks]
  );

  return (
    <div
      className={`rounded-card bg-surface border border-border p-5 sm:p-7 space-y-6 shadow-card transition-all ${className}`}
    >
      {/* ── 1. HEADER & SUMMARY TELEMETRY ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
              Yearly Consistency Landscape
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            52-week visual archive of daily proofs, returns, and sealed reflections.
          </p>
        </div>

        {/* Quiet summary metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-1.5 rounded-input bg-surface-elevated border border-border flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">
              {stats.totalCompleted}
            </span>
            <span className="text-[11px] font-mono text-foreground-secondary">
              proofs in 12m
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-input bg-surface-elevated border border-border flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-success">
              {stats.consistencyRate}%
            </span>
            <span className="text-[11px] font-mono text-foreground-secondary">
              active rate
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. HEATMAP SCROLLABLE CONTAINER ── */}
      <div className="relative">
        <div
          ref={scrollRef}
          tabIndex={0}
          aria-label="Yearly consistency contribution matrix"
          className="overflow-x-auto pb-3 pt-1 scrollbar-thin select-none outline-none focus:ring-1 focus:ring-primary/40 rounded-btn"
        >
          <div className="inline-block min-w-full">
            {/* Month labels row */}
            <div className="flex pl-7 sm:pl-8 mb-2 h-4 relative">
              {monthLabels.map((m, idx) => (
                <span
                  key={idx}
                  style={{ left: `${m.columnIndex * 14}px` }}
                  className="absolute text-[10px] font-mono text-foreground-muted font-medium"
                >
                  {m.name}
                </span>
              ))}
            </div>

            {/* Grid Matrix: Weekday Labels + 52 Weeks */}
            <div className="flex gap-1 items-start">
              {/* Left Weekday Indicators (Mon, Wed, Fri) */}
              <div className="flex flex-col justify-between h-[105px] sm:h-[112px] w-6 sm:w-7 pr-1.5 text-right shrink-0">
                <span className="text-[9px] sm:text-[10px] font-mono text-foreground-muted leading-[11px] sm:leading-[12px]">
                  Mon
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-foreground-muted leading-[11px] sm:leading-[12px]">
                  Wed
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-foreground-muted leading-[11px] sm:leading-[12px]">
                  Fri
                </span>
              </div>

              {/* 52 Columns of 7 Weekdays */}
              <div className="flex gap-[3px]" role="grid" aria-label="Consistency calendar grid">
                {weeks.map((week) => (
                  <div
                    key={week.weekIndex}
                    className="flex flex-col gap-[3px]"
                    role="row"
                  >
                    {week.days.map((day) => {
                      const isSelected = selectedDay?.dateStr === day.dateStr;

                      // Color mapping according to Midnight Mirror token decisions:
                      let cellClass = "";
                      if (day.isFuture) {
                        cellClass =
                          "bg-surface-elevated/20 border border-dashed border-border/40 opacity-30 cursor-not-allowed";
                      } else if (day.status === "completed") {
                        if (day.intensity === 4) {
                          cellClass =
                            "bg-[#6366F1] border border-[#C7D2FE] shadow-[0_0_6px_rgba(99,102,241,0.4)]";
                        } else {
                          cellClass =
                            "bg-[#4338CA] border border-[#7C8CFF]/60";
                        }
                      } else if (day.status === "returned") {
                        cellClass =
                          "bg-[#0284C7] border border-[#38BDF8]/60";
                      } else if (day.status === "minimum") {
                        cellClass =
                          "bg-[#0F766E] border border-[#2DD4BF]/50";
                      } else if (day.status === "missed") {
                        cellClass =
                          "bg-warning/15 border border-warning/50";
                      } else {
                        // Rest / No commitment scheduled
                        cellClass =
                          "bg-surface-elevated border border-border/50 hover:border-foreground-muted/60";
                      }

                      // Additional rings for today & selected
                      const ringClass = isSelected
                        ? "ring-2 ring-primary ring-offset-1 ring-offset-background z-10"
                        : day.isToday
                        ? "ring-1 ring-primary/80 ring-offset-1 ring-offset-background"
                        : "";

                      return (
                        <button
                          key={day.dateStr}
                          id={`grid-cell-${week.weekIndex}-${day.dayOfWeek}`}
                          type="button"
                          role="gridcell"
                          tabIndex={day.isFuture ? -1 : 0}
                          aria-label={`${day.formattedDate}: ${
                            day.status === "completed"
                              ? "Full Proof Logged"
                              : day.status === "minimum"
                              ? "Minimum Version"
                              : day.status === "returned"
                              ? "Returned After Drift"
                              : day.status === "missed"
                              ? "Drift Noted"
                              : day.isFuture
                              ? "Future Date"
                              : "Rest / Open"
                          }`}
                          aria-selected={isSelected}
                          disabled={day.isFuture}
                          onMouseEnter={(e) => handleCellHover(day, e)}
                          onMouseLeave={handleCellLeave}
                          onClick={() => handleCellClick(day)}
                          onKeyDown={(e) => handleKeyDown(e, week.weekIndex, day.dayOfWeek)}
                          className={`w-[11px] h-[11px] sm:w-[12px] sm:h-[12px] rounded-[2.5px] transition-transform duration-100 outline-none hover:scale-125 focus:scale-125 ${cellClass} ${ringClass}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. FLOATING DESKTOP TOOLTIP ── */}
      {hoveredDay && tooltipPos && (
        <div
          role="tooltip"
          style={{
            position: "fixed",
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="z-50 pointer-events-none bg-surface-elevated text-foreground border border-border-strong px-3 py-2 rounded-btn shadow-xl max-w-[280px] space-y-1 animate-fade-in"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-medium text-foreground">
              {hoveredDay.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <Badge
              variant={
                hoveredDay.status === "completed"
                  ? "primary"
                  : hoveredDay.status === "returned"
                  ? "recovery"
                  : hoveredDay.status === "minimum"
                  ? "recovery"
                  : hoveredDay.status === "missed"
                  ? "warning"
                  : "neutral"
              }
              dot={hoveredDay.status !== "rest"}
            >
              {hoveredDay.status === "completed"
                ? "Full Proof"
                : hoveredDay.status === "returned"
                ? "Returned"
                : hoveredDay.status === "minimum"
                ? "Minimum"
                : hoveredDay.status === "missed"
                ? "Drift Noted"
                : "Open"}
            </Badge>
          </div>

          {hoveredDay.event && (
            <p className="text-[11px] text-foreground-secondary line-clamp-2">
              {hoveredDay.event.title}
            </p>
          )}

          {hoveredDay.reflection?.isSealed && (
            <div className="pt-1 border-t border-border flex items-center gap-1.5 text-[10px] text-primary font-mono">
              <Sparkles size={10} />
              <span>Evening reflection sealed</span>
            </div>
          )}
        </div>
      )}

      {/* ── 4. INSPECTION CARD (ACTIVE DAY DETAILS) ── */}
      {selectedDay && (
        <div className="p-4 rounded-btn bg-surface-elevated border border-border animate-fade-in space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted block">
                Selected Date
              </span>
              <h3 className="text-sm font-semibold text-foreground">
                {selectedDay.formattedDate}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  selectedDay.status === "completed"
                    ? "primary"
                    : selectedDay.status === "returned"
                    ? "recovery"
                    : selectedDay.status === "minimum"
                    ? "recovery"
                    : selectedDay.status === "missed"
                    ? "warning"
                    : "neutral"
                }
                dot
              >
                {selectedDay.status === "completed"
                  ? "Full Proof Logged"
                  : selectedDay.status === "returned"
                  ? "Returned After Drift"
                  : selectedDay.status === "minimum"
                  ? "Minimum Version"
                  : selectedDay.status === "missed"
                  ? "Drift Noted"
                  : "Rest / No Commitment"}
              </Badge>

              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="p-1 text-foreground-muted hover:text-foreground rounded-btn"
                aria-label="Close day details"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Event details if logged */}
          {selectedDay.event ? (
            <div className="text-xs space-y-1 bg-surface p-3 rounded-btn border border-border/50">
              <p className="font-medium text-foreground">
                {selectedDay.event.title}
              </p>
              {selectedDay.event.details && (
                <p className="text-foreground-secondary leading-relaxed">
                  {selectedDay.event.details}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-foreground-secondary italic">
              No daily commitment was scheduled for this date.
            </p>
          )}

          {/* Reflection snippet if sealed */}
          {selectedDay.reflection?.isSealed && (
            <div className="p-3 rounded-btn bg-primary/5 border border-primary/20 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-primary">
                <BookOpen size={12} />
                <span>Sealed Reflection</span>
              </div>
              {selectedDay.reflection.wentWell && (
                <p className="text-foreground-secondary">
                  <strong className="text-foreground">Went well:</strong> {selectedDay.reflection.wentWell}
                </p>
              )}
              {selectedDay.reflection.blockedBy && (
                <p className="text-foreground-secondary">
                  <strong className="text-foreground">Friction:</strong> {selectedDay.reflection.blockedBy}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 5. COMPACT FOOTER & INTENSITY LEGEND ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[11px] font-mono text-foreground-muted">
        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {/* Level 0: Rest */}
            <span
              className="w-2.5 h-2.5 rounded-[2px] bg-surface-elevated border border-border/50"
              title="Level 0: Rest / Open"
            />
            {/* Level 1: Minimum */}
            <span
              className="w-2.5 h-2.5 rounded-[2px] bg-[#0F766E] border border-[#2DD4BF]/50"
              title="Level 1: Minimum Proof Saved"
            />
            {/* Level 2: Returned */}
            <span
              className="w-2.5 h-2.5 rounded-[2px] bg-[#0284C7] border border-[#38BDF8]/60"
              title="Level 2: Returned After Drift"
            />
            {/* Level 3: Full Proof */}
            <span
              className="w-2.5 h-2.5 rounded-[2px] bg-[#4338CA] border border-[#7C8CFF]/60"
              title="Level 3: Full Proof Completed"
            />
            {/* Level 4: Proof + Reflection */}
            <span
              className="w-2.5 h-2.5 rounded-[2px] bg-[#6366F1] border border-[#C7D2FE]"
              title="Level 4: Full Proof + Sealed Reflection"
            />
          </div>
          <span>More</span>

          <span className="text-border mx-1">|</span>

          {/* Missed Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-warning/15 border border-warning/50" />
            <span>Drift</span>
          </div>

          {/* Future Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-surface-elevated/20 border border-dashed border-border/50 opacity-40" />
            <span>Future</span>
          </div>
        </div>

        <span className="text-[10px] text-foreground-muted">
          Click any day to inspect details
        </span>
      </div>

      {/* ── 6. GRACEFUL NEW MEMBER STATE ── */}
      {stats.totalCompleted === 0 && (
        <div className="p-4 rounded-btn bg-surface-elevated/60 border border-border/80 flex items-start gap-3 text-xs text-foreground-secondary">
          <Info size={16} className="text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <p className="font-medium text-foreground">
              Every transformation begins with day one.
            </p>
            <p className="text-[11px] text-foreground-muted">
              As you complete daily focus sessions in your sanctuary, your consistency landscape will illuminate here over time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
