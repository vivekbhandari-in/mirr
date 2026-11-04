"use client";

import { useState } from "react";
import { PersonalMirror } from "@/types/identity";
import { Habit } from "@/types";
import { ScanFace, Edit3, Sparkles, Plus, Anchor } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HabitMaturity } from "@/lib/restart-engine";

interface MirrorScreenProps {
  mirror: PersonalMirror;
  habits?: Habit[];
  onOpenEditModal: () => void;
  onAddHabit?: () => void;
}

const MATURITY_STEPS: Record<HabitMaturity, { label: string; desc: string }> = {
  seed: { label: "Seed", desc: "Just started. Building root consistency." },
  rhythm: { label: "Rhythm", desc: "Repeating consistently without shame." },
  automatic: { label: "Automatic", desc: "Stable & natural. Ready to stack." },
  stacked: { label: "Stacked", desc: "Supported by an anchor habit." },
};

export function MirrorScreen({
  mirror,
  habits = [],
  onOpenEditModal,
  onAddHabit,
}: MirrorScreenProps) {
  const displayHabits =
    habits && habits.length > 0
      ? habits.slice(0, 3)
      : [
          {
            id: "h-primary",
            name: mirror.todayAction.title,
            action: mirror.todayAction.description,
            cue: mirror.todayAction.anchor,
            minimum_version: mirror.todayAction.minimumVersion,
            frequency: "Daily",
          },
        ];

  // Default primary habit maturity
  const maturity: HabitMaturity = displayHabits.length > 1 ? "stacked" : "rhythm";
  const maturityInfo = MATURITY_STEPS[maturity];
  const canStack = displayHabits.length < 3;

  return (
    <div className="w-full max-w-[840px] mx-auto py-4 sm:py-8 space-y-10 select-none">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-primary block mb-1">
            Personal Mirror
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <ScanFace size={22} className="text-primary" />
            <span>Identity Contract</span>
          </h1>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Edit3}
          onClick={onOpenEditModal}
        >
          Edit Mirror
        </Button>
      </div>

      {/* ── 1. IDENTITY CONTRACT (CORE DECLARATIONS) ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          1. Core Declarations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* I am becoming */}
          <div className="p-5 sm:p-6 rounded-card bg-surface border border-primary/25 space-y-2 shadow-subtle">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold block">
              You are becoming:
            </span>
            <p className="text-base sm:text-lg font-semibold text-foreground leading-snug">
              {mirror.desiredIdentity}
            </p>
          </div>

          {/* I refuse to become */}
          <div className="p-5 sm:p-6 rounded-card bg-surface border border-border space-y-2 shadow-subtle">
            <span className="text-[11px] font-mono uppercase tracking-wider text-foreground-muted block">
              You refuse to become:
            </span>
            <p className="text-base sm:text-lg font-medium text-foreground-secondary leading-snug">
              {mirror.antiFuture || "Someone who starts routines and abandons them in guilt."}
            </p>
          </div>

          {/* Main Blocker */}
          <div className="p-5 sm:p-6 rounded-card bg-surface border border-border space-y-2 shadow-subtle">
            <span className="text-[10px] font-mono uppercase tracking-widest text-warning font-semibold block">
              Main Blocker
            </span>
            <p className="text-sm font-medium text-foreground leading-relaxed capitalize">
              {mirror.mainBlocker}
            </p>
          </div>

          {/* Daily Protected Time */}
          <div className="p-5 sm:p-6 rounded-card bg-surface border border-border space-y-2 shadow-subtle">
            <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold block">
              Protected Daily Time
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold text-foreground">
                {mirror.dailyProtectedTime}
              </span>
              <span className="text-xs text-foreground-secondary font-mono">minutes protected daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ACTIVE HABITS & HABIT STACKING (MAX 3) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
              2. Active Tracks (Max 3 Habits)
            </h2>
            <p className="text-xs text-foreground-muted">
              {displayHabits.length} of 3 active habits
            </p>
          </div>

          {canStack && (
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={onAddHabit || onOpenEditModal}
            >
              Stack Habit
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {displayHabits.map((habit, idx) => (
            <Card key={habit.id || idx} padding="md" className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <CardTitle className="text-base">{habit.name}</CardTitle>
                  </div>
                  <p className="text-sm text-foreground-secondary">{habit.action}</p>
                </div>

                <Badge variant={idx === 0 ? "primary" : "neutral"} dot>
                  {idx === 0 ? "Anchor Habit" : "Stacked Habit"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border">
                <div className="p-3 rounded-xl bg-surface-elevated text-xs space-y-0.5">
                  <span className="font-mono text-foreground-muted text-[11px] block">Anchor Cue</span>
                  <span className="font-medium text-foreground">{habit.cue || mirror.todayAction.anchor}</span>
                </div>

                <div className="p-3 rounded-xl bg-surface-elevated text-xs space-y-0.5">
                  <span className="font-mono text-foreground-muted text-[11px] block">2-Min Minimum Version</span>
                  <span className="font-medium text-teal-700">{habit.minimum_version || mirror.todayAction.minimumVersion}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Habit Stacking Encouragement */}
        {canStack && (
          <div className="p-5 rounded-xl bg-primary-soft border border-primary/20 space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                Stacking Rule
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              Mirr limits you to 3 habits to protect focus. When your anchor habit feels automatic, stack one small action directly onto it (e.g. &ldquo;After morning coffee, I will write 5 minutes&rdquo;).
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
