"use client";

import { ProofEvent, ReflectionEntry, TodayProofState } from "@/types/identity";
import { History, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ConsistencyGrid } from "../ConsistencyGrid";

interface EvidenceScreenProps {
  events: ProofEvent[];
  reflections?: Record<string, ReflectionEntry>;
  todayProofState?: TodayProofState;
  daysActedMonth: number;
  returnRate: string;
  trendText: string;
}

export function EvidenceScreen({
  events,
  reflections = {},
  todayProofState,
  daysActedMonth,
  returnRate,
  trendText,
}: EvidenceScreenProps) {
  return (
    <div className="w-full max-w-[840px] mx-auto py-4 sm:py-8 space-y-10 select-none">
      {/* ── HEADER ── */}
      <div className="border-b border-border pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-primary block mb-1">
          Identity Archive
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
          <History size={22} className="text-primary" />
          <span>Evidence of Change</span>
        </h1>
        <p className="text-xs text-foreground-secondary mt-1">
          A private, non-judgmental record proving you are becoming who you intended to be.
        </p>
      </div>

      {/* ── 1. THREE KEY NUMBERS (NO VANITY METRICS) ── */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          1. Honest Signals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1 */}
          <Card padding="md" className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted block">
              Days Acted This Month
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-light text-foreground">
                {daysActedMonth}
              </span>
              <span className="text-xs text-success font-mono">active days</span>
            </div>
          </Card>

          {/* Metric 2 */}
          <Card padding="md" className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-recovery block">
              Return Rate After Missing
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-light text-foreground">
                {returnRate}
              </span>
              <span className="text-xs text-recovery font-mono">resilience</span>
            </div>
          </Card>

          {/* Metric 3 */}
          <Card padding="md" className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary block">
              Consistency Trend
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-medium text-foreground">
                {trendText}
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* ── 2. YEARLY CONSISTENCY LANDSCAPE ── */}
      <section className="space-y-4">
        <ConsistencyGrid
          proofEvents={events}
          reflections={reflections}
          todayProofState={todayProofState}
        />
      </section>

      {/* ── 3. PROOF TIMELINE ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          3. Proof Timeline
        </h2>

        <Card padding="md" className="space-y-4">
          {events.map((ev, idx) => (
            <div key={ev.id || idx} className="flex items-start gap-4 text-xs">
              <div className="font-mono text-foreground-muted w-14 flex-shrink-0 text-right pt-0.5">
                {ev.date}
              </div>

              <div className="flex flex-col items-center flex-shrink-0 pt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    ev.type === "completed"
                      ? "bg-success"
                      : ev.type === "minimum"
                      ? "bg-recovery"
                      : ev.type === "returned"
                      ? "bg-recovery ring-2 ring-recovery/30"
                      : "bg-warning"
                  }`}
                />
                {idx !== events.length - 1 && (
                  <div className="w-[1px] h-10 bg-border my-1" />
                )}
              </div>

              <div className="space-y-1 pb-2">
                <p className="font-medium text-foreground">
                  {ev.title}
                </p>
                {ev.details && (
                  <p className="text-[12px] text-foreground-secondary leading-relaxed">
                    {ev.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* ── 4. WEEKLY MIRROR REPORT (NARRATIVE REVIEW) ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          4. Weekly Narrative Synthesis
        </h2>

        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider">
            <Sparkles size={14} />
            <span>Weekly Executive Summary</span>
          </div>

          <p className="text-sm font-medium text-foreground leading-relaxed">
            This week, you protected focus on 4 of 7 days.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-success tracking-wider block">
                Strongest Pattern
              </span>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                You completed deep work before noon. Your focus is 3× more resilient before 12 PM.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-warning tracking-wider block">
                Main Friction
              </span>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                Evening distraction. Attempts to work after 8 PM resulted in feed scrolling.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-recovery tracking-wider block">
                Next Week&apos;s Experiment
              </span>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                Move your focused session before lunch and deliberately use the 10-minute version on low-energy days.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
