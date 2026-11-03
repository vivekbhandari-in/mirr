"use client";

import { PersonalMirror } from "@/types/identity";
import { Habit } from "@/types";
import { ScanFace, Edit3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface MirrorScreenProps {
  mirror: PersonalMirror;
  habits?: Habit[];
  onOpenEditModal: () => void;
}

export function MirrorScreen({
  mirror,
  habits = [],
  onOpenEditModal,
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

      {/* ── 1. IDENTITY CONTRACT (4 PRIMARY PILLARS) ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          1. Core Declarations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* I am becoming */}
          <div className="p-5 sm:p-6 rounded-card bg-surface border border-primary/25 space-y-2">
            <span className="text-[11px] font-editorial italic text-primary block">
              You are becoming:
            </span>
            <p className="text-base sm:text-lg font-medium text-foreground leading-snug">
              {mirror.desiredIdentity}
            </p>
          </div>

          {/* I refuse to become */}
          <div className="p-5 sm:p-6 rounded-card bg-surface border border-danger/25 space-y-2">
            <span className="text-[11px] font-editorial italic text-danger block">
              You refuse to become:
            </span>
            <p className="text-base sm:text-lg font-medium text-foreground leading-snug">
              {mirror.antiFuture}
            </p>
          </div>

          {/* Main Blocker */}
          <div className="p-5 sm:p-6 rounded-card bg-surface border border-warning/25 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-warning block">
              Main Blocker
            </span>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {mirror.mainBlocker}
            </p>
          </div>

          {/* Daily Protected Time */}
          <div className="p-5 sm:p-6 rounded-card bg-surface border border-recovery/25 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-recovery block">
              Protected Daily Time
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-light text-foreground">
                {mirror.dailyProtectedTime}
              </span>
              <span className="text-xs text-foreground-secondary">minutes protected daily</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. REALITY VS FUTURE (TWO-COLUMN COMPARISON) ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          2. The Transition
        </h2>

        <div className="rounded-card bg-surface border border-border overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Current Reality */}
          <div className="p-6 space-y-2 bg-surface-muted/30">
            <span className="text-[11px] font-mono uppercase tracking-wider text-foreground-muted block">
              Current Reality
            </span>
            <p className="text-sm text-foreground-secondary leading-relaxed italic">
              “{mirror.currentReality}”
            </p>
          </div>

          {/* Future Self */}
          <div className="p-6 space-y-2 bg-surface-elevated/30">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary block">
              Future Self
            </span>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              “{mirror.desiredIdentity}”
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. STRATEGIC INSIGHT ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          3. Strategic Insight
        </h2>

        <div className="p-6 rounded-card bg-surface border border-border space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-primary tracking-wider">
            <Sparkles size={14} />
            <span>Why Mirr Protects One Block</span>
          </div>

          <p className="text-sm text-foreground leading-relaxed">
            Your problem is not lack of ambition. It is that your desired identity is not yet connected to a small daily action. Mirr protects one focused block per day and automatically reduces the action when life gets hard.
          </p>

          <p className="text-xs text-foreground-secondary leading-relaxed">
            When you show up for 25 minutes, your subconscious absorbs tangible proof. The old identity fades because it no longer matches your actual behavior.
          </p>
        </div>
      </section>

      {/* ── 4. CURRENT PLAN (MAX 1-3 ATOMIC HABITS) ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
            4. Current Plan (Max 3 Atomic Habits)
          </h2>
          <span className="text-[10px] font-mono text-foreground-muted">
            {displayHabits.length} of 3 active
          </span>
        </div>

        <div className="space-y-3">
          {displayHabits.map((habit, idx) => (
            <Card key={habit.id || idx} padding="sm">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <CardTitle className="text-sm">{habit.name}</CardTitle>
                  </div>
                  <p className="text-xs text-foreground-secondary">{habit.action}</p>
                </div>

                <Badge variant={idx === 0 ? "primary" : "neutral"}>
                  {idx === 0 ? "Daily Hero" : "Support"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 mt-2 text-[11px] font-mono text-foreground-muted border-t border-border">
                <div>
                  <span className="text-foreground-muted">Anchor: </span>
                  <span className="text-foreground">{habit.cue || mirror.todayAction.anchor}</span>
                </div>
                <span>·</span>
                <div>
                  <span className="text-foreground-muted">Min: </span>
                  <span className="text-recovery">{habit.minimum_version || mirror.todayAction.minimumVersion}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
