"use client";

import { useState } from "react";
import { ReflectionEntry } from "@/types/identity";
import { Lock, Check, Sparkles, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface ReflectScreenProps {
  currentEntry: ReflectionEntry;
  totalReflectionsCount: number;
  onSaveEntry: (entry: ReflectionEntry, isSealing?: boolean) => void;
  onShowToast: (msg: string) => void;
}

const MAX_CHARS = 500;

export function ReflectScreen({
  currentEntry,
  totalReflectionsCount,
  onSaveEntry,
  onShowToast,
}: ReflectScreenProps) {
  const [wentWell, setWentWell] = useState(currentEntry.wentWell || "");
  const [blockedBy, setBlockedBy] = useState(currentEntry.blockedBy || "");
  const [changeNext, setChangeNext] = useState(currentEntry.changeNext || "");
  const [isSealed, setIsSealed] = useState(currentEntry.isSealed || false);

  const handleBlur = () => {
    if (isSealed) return;
    onSaveEntry(
      {
        wentWell,
        blockedBy,
        changeNext,
        isSealed: false,
        savedAt: new Date().toISOString(),
      },
      false
    );
  };

  const handleSeal = () => {
    if (!wentWell && !blockedBy && !changeNext) {
      onShowToast("Write at least one honest sentence before sealing.");
      return;
    }
    setIsSealed(true);
    onSaveEntry(
      {
        wentWell,
        blockedBy,
        changeNext,
        isSealed: true,
        savedAt: new Date().toISOString(),
      },
      true
    );
    onShowToast("Reflection sealed.");
  };

  return (
    <div className="w-full max-w-[760px] mx-auto py-4 sm:py-8 space-y-8 select-none">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-primary block mb-1">
            Evening Debrief
          </span>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
            <NotebookPen size={22} className="text-primary" />
            <span>Daily Reflection</span>
          </h1>
        </div>

        <div>
          {isSealed ? (
            <Badge variant="success" dot>
              Reflection sealed
            </Badge>
          ) : (
            <span className="text-[11px] text-foreground-muted font-mono">
              Auto-saves on blur
            </span>
          )}
        </div>
      </div>

      {/* ── CALM PROMPT ── */}
      <Card padding="sm" className="bg-surface-muted flex items-center gap-3 text-xs text-foreground-secondary">
        <Sparkles size={16} className="text-primary flex-shrink-0" />
        <p className="leading-relaxed">
          <strong className="text-foreground font-medium">One honest sentence is enough.</strong> Avoid long essays. Debrief what happened so tomorrow starts clean.
        </p>
      </Card>

      {/* ── 3 PROMPT FIELDS ── */}
      <div className="space-y-6">
        {/* Field 1: What went well */}
        <Card padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span>What went well today?</span>
            </label>
            <span className="text-[11px] font-mono text-foreground-muted">
              {wentWell.length} / {MAX_CHARS}
            </span>
          </div>

          <textarea
            rows={3}
            maxLength={MAX_CHARS}
            disabled={isSealed}
            value={wentWell}
            onChange={(e) => setWentWell(e.target.value)}
            onBlur={handleBlur}
            placeholder="Protected 25 minutes of deep focus right after morning coffee…"
            className="w-full bg-surface-muted border border-border rounded-input p-3 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary-soft disabled:opacity-75 resize-none leading-relaxed transition-all"
          />
        </Card>

        {/* Field 2: What caused friction */}
        <Card padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-warning" />
              <span>What caused friction?</span>
            </label>
            <span className="text-[11px] font-mono text-foreground-muted">
              {blockedBy.length} / {MAX_CHARS}
            </span>
          </div>

          <textarea
            rows={3}
            maxLength={MAX_CHARS}
            disabled={isSealed}
            value={blockedBy}
            onChange={(e) => setBlockedBy(e.target.value)}
            onBlur={handleBlur}
            placeholder="Checked Twitter between tasks, lost 40 minutes of momentum…"
            className="w-full bg-surface-muted border border-border rounded-input p-3 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-warning focus:ring-4 focus:ring-warning/20 disabled:opacity-75 resize-none leading-relaxed transition-all"
          />
        </Card>

        {/* Field 3: What will you adjust tomorrow */}
        <Card padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-recovery" />
              <span>What will you adjust tomorrow?</span>
            </label>
            <span className="text-[11px] font-mono text-foreground-muted">
              {changeNext.length} / {MAX_CHARS}
            </span>
          </div>

          <textarea
            rows={3}
            maxLength={MAX_CHARS}
            disabled={isSealed}
            value={changeNext}
            onChange={(e) => setChangeNext(e.target.value)}
            onBlur={handleBlur}
            placeholder="Leave phone outside the room during the morning build block…"
            className="w-full bg-surface-muted border border-border rounded-input p-3 text-xs text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-recovery focus:ring-4 focus:ring-recovery/20 disabled:opacity-75 resize-none leading-relaxed transition-all"
          />
        </Card>
      </div>

      {/* ── SEAL ACTION ── */}
      <div className="pt-2 flex items-center justify-between">
        {!isSealed ? (
          <Button
            variant="primary"
            size="md"
            icon={Lock}
            onClick={handleSeal}
          >
            Seal reflection
          </Button>
        ) : (
          <div className="p-4 rounded-input bg-surface border border-border text-xs text-success flex items-center gap-2 w-full">
            <Check size={16} />
            <span>Reflection permanently sealed into your private evidence ledger.</span>
          </div>
        )}
      </div>

      {/* ── 7-REFLECTION WEEKLY INSIGHT TEASER ── */}
      <Card padding="md" className="bg-surface-muted/40 space-y-2">
        <div className="flex items-center justify-between text-xs text-foreground-secondary">
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
            Weekly Pattern Intelligence
          </span>
          <span className="font-mono text-[11px]">
            {Math.min(totalReflectionsCount, 7)} of 7 reflections sealed
          </span>
        </div>

        <div className="w-full h-1.5 bg-border rounded-pill overflow-hidden">
          <div
            className="h-full bg-primary rounded-pill transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((totalReflectionsCount / 7) * 100))}%` }}
          />
        </div>

        <p className="text-[11px] text-foreground-secondary leading-relaxed pt-1">
          {totalReflectionsCount >= 7
            ? "Your weekly pattern analysis is unlocked in the Evidence tab."
            : "After 7 reflections, Mirr analyzes your entries to surface your exact blindspots and peak momentum triggers."}
        </p>
      </Card>
    </div>
  );
}
