"use client";

import React from "react";
import { motion } from "framer-motion";
import { Timer, Minimize2, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";

export interface RestartCardProps {
  desiredIdentity: string;
  returnMessage: string;
  actionTitle: string;
  actionDescription?: string;
  plannedMinutes: number;
  minimumActionText: string;
  isMinimumRecommended?: boolean;
  adaptationReason?: string;
  status: "pending" | "completed" | "minimum" | "missed";
  onStartRestart: () => void;
  onDoMinimumVersion: () => void;
  onOpenMissedModal?: () => void;
  onUndoStatus?: () => void;
  className?: string;
}

export function RestartCard({
  desiredIdentity,
  returnMessage,
  actionTitle,
  actionDescription,
  plannedMinutes,
  minimumActionText,
  isMinimumRecommended = false,
  adaptationReason,
  status,
  onStartRestart,
  onDoMinimumVersion,
  onOpenMissedModal,
  onUndoStatus,
  className = "",
}: RestartCardProps) {
  const isDone = status === "completed" || status === "minimum";
  const isMissed = status === "missed";

  return (
    <div
      className={`rounded-card bg-surface border p-6 sm:p-8 space-y-6 shadow-card transition-all duration-200 select-none ${
        isDone
          ? "border-success/30 ring-1 ring-success/10"
          : isMissed
          ? "border-warning/30 ring-1 ring-warning/10"
          : "border-border hover:border-border-strong"
      } ${className}`}
    >
      {/* ── CARD HEADER & RETURN MESSAGE ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {/* Subtle identity anchor */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-foreground-secondary">
              Today&apos;s restart · {plannedMinutes} min
            </span>
            {isMinimumRecommended && (
              <Badge variant="recovery" className="ml-1">
                Gentle restart
              </Badge>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
            {actionTitle}
          </h2>

          <p className="text-sm text-foreground-secondary max-w-[520px] leading-relaxed">
            {returnMessage}
          </p>

          {adaptationReason && !isDone && (
            <p className="text-xs text-foreground-muted italic pt-0.5">
              {adaptationReason}
            </p>
          )}
        </div>

        {/* Circular Progress Ring */}
        <ProgressRing
          progress={isDone ? 100 : 0}
          isCompleted={isDone}
          size={84}
          strokeWidth={4}
        >
          {status === "completed" && (
            <Check size={26} className="text-success animate-checkmark-spring" />
          )}
          {status === "minimum" && (
            <Minimize2 size={22} className="text-recovery animate-checkmark-spring" />
          )}
          {isMissed && (
            <span className="text-xs font-mono font-bold text-warning">MISSED</span>
          )}
          {!isDone && !isMissed && (
            <span className="text-xs font-mono text-foreground-muted font-medium">
              {plannedMinutes}m
            </span>
          )}
        </ProgressRing>
      </div>

      {/* ── COMPLETED OR RECOVERY STATE ── */}
      {isDone ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                You returned. That matters more than being perfect.
              </p>
              <p className="text-xs text-foreground-secondary">
                Proof logged for today. Come back tomorrow.
              </p>
            </div>
          </div>

          {onUndoStatus && (
            <button
              type="button"
              onClick={onUndoStatus}
              className="text-xs text-foreground-muted hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Reset today
            </button>
          )}
        </motion.div>
      ) : isMissed ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <p className="text-sm text-foreground-secondary">
            Today was marked as missed. No guilt—returning tomorrow is the victory.
          </p>
          {onUndoStatus && (
            <Button variant="secondary" size="sm" onClick={onUndoStatus}>
              Change status
            </Button>
          )}
        </motion.div>
      ) : (
        /* ── PRIMARY & MINIMUM ACTIONS ── */
        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Primary Orange Pill CTA */}
            <Button
              variant="primary"
              size="md"
              withCircularArrow
              onClick={onStartRestart}
            >
              Start restart · {plannedMinutes} min
            </Button>

            {/* Minimum Version Pill */}
            <Button
              variant="secondary"
              size="md"
              icon={Minimize2}
              onClick={onDoMinimumVersion}
            >
              Do 2-minute version
            </Button>
          </div>

          {/* Missed / Blocker option */}
          {onOpenMissedModal && (
            <button
              type="button"
              onClick={onOpenMissedModal}
              className="text-xs text-foreground-muted hover:text-foreground transition-colors py-2 px-1"
            >
              Can&apos;t do it today?
            </button>
          )}
        </div>
      )}
    </div>
  );
}

