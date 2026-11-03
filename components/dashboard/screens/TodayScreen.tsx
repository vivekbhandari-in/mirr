"use client";

import { motion } from "framer-motion";
import { PersonalMirror, TodayProofState } from "@/types/identity";
import {
  Timer,
  Minimize2,
  Check,
  CircleAlert,
  ArrowRight,
  Sparkles,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";

interface TodayScreenProps {
  mirror: PersonalMirror;
  proofState: TodayProofState;
  onStartFocus: () => void;
  onOpenMinimumVersion: () => void;
  onOpenMissedModal: () => void;
  onGoToReflect: () => void;
}

export function TodayScreen({
  mirror,
  proofState,
  onStartFocus,
  onOpenMinimumVersion,
  onOpenMissedModal,
  onGoToReflect,
}: TodayScreenProps) {
  const isPending = proofState.status === "pending";
  const isCompleted = proofState.status === "completed";
  const isMinimum = proofState.status === "minimum";
  const isMissed = proofState.status === "missed";

  const isDone = isCompleted || isMinimum;

  return (
    <div className="w-full max-w-[760px] mx-auto py-4 sm:py-8 space-y-8 select-none">
      {/* ── 1. IDENTITY EYEBROW ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="space-y-1.5"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-primary block">
          You are becoming
        </span>
        <h1 className="text-xl sm:text-2xl font-editorial italic text-foreground tracking-tight">
          {mirror.desiredIdentity}
        </h1>
      </motion.div>

      {/* ── 2. HERO CARD: TODAY'S PROOF ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`rounded-card bg-surface border p-6 sm:p-8 space-y-6 shadow-card transition-all duration-200 ${
          isDone
            ? "border-success/30"
            : isMissed
            ? "border-warning/30"
            : "border-border"
        }`}
      >
        {/* Card Header & Circular Progress Ring */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-foreground-secondary">
                Today&apos;s proof · {mirror.todayAction.duration} min
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-tight">
              {mirror.todayAction.title}
            </h2>

            <p className="text-sm text-foreground-secondary max-w-[500px] leading-relaxed">
              {mirror.todayAction.description}
            </p>
          </div>

          {/* Progress Ring Primitive (4px stroke, 88px size) */}
          <ProgressRing
            progress={isDone ? 100 : 0}
            isCompleted={isDone}
            size={88}
            strokeWidth={4}
          >
            {isCompleted && <Check size={24} className="text-success animate-checkmark-spring" />}
            {isMinimum && <Minimize2 size={20} className="text-recovery animate-checkmark-spring" />}
            {isMissed && <CircleAlert size={20} className="text-warning" />}
            {isPending && (
              <span className="font-mono text-xs font-medium text-primary">
                0 / 1
              </span>
            )}
          </ProgressRing>
        </div>

        {/* ── 3 CONTEXTUAL SUPPORT ROWS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Main Enemy */}
          <div className="p-3.5 rounded-input bg-surface-muted border border-border space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-warning block">
              Main enemy today
            </span>
            <p className="text-xs font-medium text-foreground truncate">
              {mirror.mainBlocker}
            </p>
          </div>

          {/* Anchor */}
          <div className="p-3.5 rounded-input bg-surface-muted border border-border space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary block">
              Anchor
            </span>
            <p className="text-xs font-medium text-foreground truncate">
              {mirror.todayAction.anchor}
            </p>
          </div>

          {/* Minimum Version */}
          <div className="p-3.5 rounded-input bg-surface-muted border border-border space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-recovery block">
              Minimum version
            </span>
            <p
              className="text-xs font-medium text-foreground truncate"
              title={mirror.todayAction.minimumVersion}
            >
              {mirror.todayAction.minimumVersion}
            </p>
          </div>
        </div>

        {/* ── PRIMARY CTAS OR COMPLETION BANNER ── */}
        <div className="pt-3 border-t border-border">
          {isPending && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  icon={Timer}
                  onClick={onStartFocus}
                >
                  Start focused session
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  icon={Minimize2}
                  onClick={onOpenMinimumVersion}
                >
                  Do minimum version
                </Button>
              </div>

              <button
                type="button"
                onClick={onOpenMissedModal}
                className="text-[12px] font-mono text-foreground-muted hover:text-warning transition-colors py-2 px-1"
              >
                I drifted today
              </button>
            </div>
          )}

          {isCompleted && (
            <div className="flex items-center justify-between flex-wrap gap-4 py-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-success">
                  <Check size={18} />
                  <span>Proof logged — you acted like the person you want to become.</span>
                </div>
                <p className="text-[12px] text-foreground-muted font-mono">
                  {proofState.durationActual || mirror.todayAction.duration} minutes of evidence sealed.
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                iconRight={ArrowRight}
                onClick={onGoToReflect}
              >
                Reflect on session
              </Button>
            </div>
          )}

          {isMinimum && (
            <div className="flex items-center justify-between flex-wrap gap-4 py-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-recovery">
                  <Minimize2 size={16} />
                  <span>Small proof still counts. Momentum preserved.</span>
                </div>
                <p className="text-[12px] text-foreground-muted font-mono">
                  Completed via minimum version: {mirror.todayAction.minimumVersion}
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                iconRight={ArrowRight}
                onClick={onGoToReflect}
              >
                Evening reflection
              </Button>
            </div>
          )}

          {isMissed && (
            <div className="flex items-center justify-between flex-wrap gap-4 py-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium text-warning">
                  <CircleAlert size={16} />
                  <span>You drifted today. That does not erase your progress.</span>
                </div>
                <p className="text-[12px] text-foreground-secondary">
                  Friction: {proofState.missedReason || "Distraction"}. Tomorrow’s return action is ready.
                </p>
              </div>

              <Button
                variant="recovery"
                size="sm"
                icon={Undo2}
                onClick={onOpenMinimumVersion}
              >
                Complete micro proof now
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── 3. PROGRESSIVE DISCLOSURE: SUPPORTING CONTEXT ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="rounded-card bg-surface-muted border border-border p-4 sm:p-5 flex items-center justify-between text-xs text-foreground-secondary"
      >
        <div className="flex items-center gap-3">
          <Sparkles size={16} className="text-primary flex-shrink-0" />
          <p className="leading-relaxed">
            {isDone
              ? "Your proof is complete for today. Let the evidence settle."
              : "Mirr deliberately protects one block. You do not need to do ten things today; do this one."}
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToReflect}
          className="text-foreground hover:text-primary font-mono text-[11px] flex items-center gap-1 flex-shrink-0 ml-4 transition-colors"
        >
          <span>Reflect</span>
          <ArrowRight size={12} />
        </button>
      </motion.div>
    </div>
  );
}
