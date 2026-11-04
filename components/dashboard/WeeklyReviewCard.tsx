"use client";

import React from "react";
import { Sparkles, Compass, Lightbulb, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface WeeklyReviewData {
  weekLabel: string;
  returnCount: number;
  averageMinutes: number;
  mainFriction?: string;
  strongestReturnTime?: string;
  insight: string;
  nextExperiment: string;
}

export interface WeeklyReviewCardProps {
  data: WeeklyReviewData;
  onCommitExperiment?: () => void;
  className?: string;
}

export function WeeklyReviewCard({
  data,
  onCommitExperiment,
  className = "",
}: WeeklyReviewCardProps) {
  return (
    <div
      className={`rounded-card bg-surface border border-border p-6 sm:p-8 space-y-6 shadow-card select-none ${className}`}
    >
      {/* Eyebrow & Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
            Weekly Recovery Digest
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Your week in Mirr
          </h2>
          <p className="text-xs text-foreground-muted">{data.weekLabel}</p>
        </div>
        <Badge variant="primary" dot>
          Weekly Reflection
        </Badge>
      </div>

      {/* 4 Quiet Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
          <span className="text-[11px] font-mono text-foreground-muted block">
            Returns
          </span>
          <span className="text-2xl font-mono font-bold text-foreground">
            {data.returnCount}
          </span>
          <span className="text-[11px] text-foreground-secondary block">
            times came back
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
          <span className="text-[11px] font-mono text-foreground-muted block">
            Avg Duration
          </span>
          <span className="text-2xl font-mono font-bold text-foreground">
            {data.averageMinutes}m
          </span>
          <span className="text-[11px] text-foreground-secondary block">
            per restart
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
          <span className="text-[11px] font-mono text-foreground-muted block">
            Main Friction
          </span>
          <span className="text-sm font-semibold text-foreground truncate block pt-1">
            {data.mainFriction || "None recorded"}
          </span>
          <span className="text-[11px] text-foreground-secondary block">
            primary obstacle
          </span>
        </div>

        <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
          <span className="text-[11px] font-mono text-foreground-muted block">
            Best Rhythm
          </span>
          <span className="text-sm font-semibold text-foreground truncate block pt-1">
            {data.strongestReturnTime || "Mornings"}
          </span>
          <span className="text-[11px] text-foreground-secondary block">
            highest momentum
          </span>
        </div>
      </div>

      {/* Key Insight & One Next Experiment */}
      <div className="space-y-4 pt-2">
        <div className="p-4 rounded-xl bg-surface-elevated/70 border border-border space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Lightbulb size={14} className="text-amber-500" />
            <span>Weekly Insight</span>
          </div>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            {data.insight}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-primary-soft border border-primary/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Compass size={14} />
            <span>Next Week&apos;s Single Experiment</span>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {data.nextExperiment}
          </p>

          {onCommitExperiment && (
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                withCircularArrow
                onClick={onCommitExperiment}
              >
                Adopt experiment
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

