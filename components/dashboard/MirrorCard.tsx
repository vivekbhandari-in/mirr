"use client";

import React from "react";
import { ShieldCheck, Anchor, Plus, Sparkles, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HabitMaturity } from "@/lib/restart-engine";

export interface MirrorCardProps {
  desiredIdentity: string;
  antiFuture?: string;
  mainBlocker: string;
  dailyProtectedTime: number;
  activeHabit: {
    id: string;
    title: string;
    anchor?: string;
    fullAction: string;
    minimumAction: string;
    maturity: HabitMaturity;
  };
  canStackHabit: boolean;
  totalHabitsCount: number;
  onEditMirror: () => void;
  onAddStackedHabit?: () => void;
  className?: string;
}

const MATURITY_DESCRIPTIONS: Record<HabitMaturity, { label: string; desc: string }> = {
  seed: { label: "Seed", desc: "Just started. Building initial root momentum." },
  rhythm: { label: "Rhythm", desc: "Repeating consistently without shame." },
  automatic: { label: "Automatic", desc: "Feels natural and stable. Ready to stack." },
  stacked: { label: "Stacked", desc: "Supported by an anchor habit." },
};

export function MirrorCard({
  desiredIdentity,
  antiFuture,
  mainBlocker,
  dailyProtectedTime,
  activeHabit,
  canStackHabit,
  totalHabitsCount,
  onEditMirror,
  onAddStackedHabit,
  className = "",
}: MirrorCardProps) {
  const maturityConfig = MATURITY_DESCRIPTIONS[activeHabit.maturity] || MATURITY_DESCRIPTIONS.seed;

  return (
    <div className={`space-y-6 select-none ${className}`}>
      {/* ── 1. IDENTITY CONTRACT CARD ── */}
      <div className="p-6 sm:p-8 rounded-card bg-surface border border-border shadow-card space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
              Identity Contract
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              Your Mirror
            </h2>
          </div>
          <Button variant="secondary" size="sm" icon={Edit3} onClick={onEditMirror}>
            Edit Mirror
          </Button>
        </div>

        <div className="space-y-4 pt-2">
          {/* Desired Identity */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wide text-foreground-muted block">
              You are becoming
            </span>
            <p className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
              {desiredIdentity}
            </p>
          </div>

          {/* Anti-future */}
          {antiFuture && (
            <div className="p-4 rounded-xl bg-surface-elevated/60 border border-border space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wide text-foreground-muted block">
                You refuse to become
              </span>
              <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
                {antiFuture}
              </p>
            </div>
          )}

          {/* Core Safeguards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border space-y-1">
              <span className="text-[11px] font-mono text-foreground-muted block">
                Main blocker
              </span>
              <span className="text-sm font-semibold text-foreground capitalize">
                {mainBlocker}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border space-y-1">
              <span className="text-[11px] font-mono text-foreground-muted block">
                Protected daily time
              </span>
              <span className="text-sm font-semibold text-foreground">
                {dailyProtectedTime} minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. ACTIVE HABIT & MATURITY CARD ── */}
      <div className="p-6 sm:p-8 rounded-card bg-surface border border-border shadow-card space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
                Active Anchor Track
              </span>
              <Badge variant="primary" dot>
                {maturityConfig.label}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {activeHabit.title}
            </h3>
            <p className="text-xs text-foreground-muted">{maturityConfig.desc}</p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {activeHabit.anchor && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-foreground-secondary">
              <Anchor size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground">Daily Anchor Cue: </span>
                {activeHabit.anchor}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-surface-elevated/50 border border-border space-y-1">
              <span className="text-[11px] font-mono text-foreground-muted block">
                Full version
              </span>
              <p className="text-sm font-medium text-foreground">
                {activeHabit.fullAction}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-elevated/50 border border-border space-y-1">
              <span className="text-[11px] font-mono text-foreground-muted block">
                Minimum version (2 min fallback)
              </span>
              <p className="text-sm font-medium text-foreground">
                {activeHabit.minimumAction}
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. HABIT STACKING PROMPT (WHEN AUTOMATIC) ── */}
        {canStackHabit && totalHabitsCount < 3 && onAddStackedHabit && (
          <div className="p-5 rounded-xl bg-primary-soft border border-primary/25 space-y-3 mt-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                Your habit feels stable now
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              You&apos;ve reached an automatic rhythm. You can now stack one small supporting habit onto this anchor (e.g. &ldquo;After I finish writing, I will read 1 page&rdquo;). Maximum 3 active habits.
            </p>
            <div className="pt-1">
              <Button
                variant="primary"
                size="sm"
                withCircularArrow
                onClick={onAddStackedHabit}
              >
                Add stacked habit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

