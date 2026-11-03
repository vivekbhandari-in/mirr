"use client";

import { motion } from "framer-motion";
import { DriftDiagnostic } from "@/types/identity";
import { Compass, Undo2, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

interface DriftScreenProps {
  diagnostic: DriftDiagnostic;
  onExecuteReturn: () => void;
  onShowToast: (msg: string) => void;
}

export function DriftScreen({
  diagnostic,
  onExecuteReturn,
  onShowToast,
}: DriftScreenProps) {
  const hasDrift = diagnostic.daysDrifted > 0;

  return (
    <div className="w-full max-w-[760px] mx-auto py-4 sm:py-8 space-y-8 select-none">
      {/* ── HEADER ── */}
      <div className="border-b border-border pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-recovery block mb-1">
          Drift &amp; Recovery
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Compass size={22} className="text-recovery" />
          <span>Return Without Shame</span>
        </h1>
        <p className="text-xs text-foreground-secondary mt-1">
          In Mirr, missing a day is not a failure. Returning is the single most important event in building an identity.
        </p>
      </div>

      {hasDrift ? (
        <div className="space-y-6">
          {/* ── 1. DIAGNOSTIC CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-card bg-surface border border-warning/30 p-6 sm:p-8 space-y-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <Badge variant="warning" dot>
                Drift Diagnostic
              </Badge>

              <span className="font-mono text-xs text-foreground-muted">
                {diagnostic.daysDrifted} {diagnostic.daysDrifted === 1 ? "day" : "days"} absent
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                You drifted for {diagnostic.daysDrifted} {diagnostic.daysDrifted === 1 ? "day" : "days"}.
              </h2>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                That does not erase your progress. Identity is not formed by never stumbling; it is formed by how quickly and kindly you return.
              </p>
            </div>

            {/* Pattern & Recommendation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-input bg-surface-muted border border-border space-y-1">
                <span className="text-[10px] font-mono uppercase text-warning tracking-wider block">
                  Likely Pattern
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {diagnostic.likelyPattern}
                </p>
              </div>

              <div className="p-4 rounded-input bg-surface-muted border border-border space-y-1">
                <span className="text-[10px] font-mono uppercase text-recovery tracking-wider block">
                  What Mirr Recommends
                </span>
                <p className="text-xs text-foreground leading-relaxed">
                  {diagnostic.recommendation}
                </p>
              </div>
            </div>

            {/* Micro Return Action Block */}
            <div className="p-5 rounded-input bg-surface-muted border border-recovery/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-recovery flex items-center gap-1.5">
                  <Undo2 size={14} />
                  <span>Your Return Action</span>
                </span>
                <span className="font-mono text-xs text-foreground-muted">
                  Duration: {diagnostic.returnAction.duration} minutes
                </span>
              </div>

              <p className="text-base font-medium text-foreground">
                {diagnostic.returnAction.title}
              </p>

              <Button
                variant="recovery"
                size="lg"
                icon={Undo2}
                onClick={onExecuteReturn}
              >
                Return now ({diagnostic.returnAction.duration}m micro-action)
              </Button>
            </div>
          </motion.div>

          {/* ── 2. RETURN STREAK & PHILOSOPHY ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card padding="md" className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-recovery block">
                Return Streak
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-light text-foreground">
                  {diagnostic.daysSinceReturn}
                </span>
                <span className="text-xs text-foreground-secondary">
                  days since you returned to yourself
                </span>
              </div>
            </Card>

            <Card padding="md" className="space-y-1.5 flex flex-col justify-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary block">
                The Core Principle
              </span>
              <p className="text-xs text-foreground-secondary leading-relaxed italic">
                “The gap between who you are and who you want to become is not bridged by never falling — it is bridged by returning quickly without shame.”
              </p>
            </Card>
          </div>
        </div>
      ) : (
        /* Thoughtful Empty State */
        <EmptyState
          icon={ShieldCheck}
          title="No drift detected."
          description="You are aligned with your daily proof. Keep protecting your focused block. If life intervenes, this sanctuary will be here with the smallest way back."
        />
      )}
    </div>
  );
}
