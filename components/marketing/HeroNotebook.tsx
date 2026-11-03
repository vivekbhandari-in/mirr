"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Check, Minimize2, Sparkles, Undo2 } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const IDENTITIES = [
  { id: "career", label: "Developer" },
  { id: "writing", label: "Writer" },
  { id: "focus", label: "Indie Hacker" },
] as const;

type IdentityKey = typeof IDENTITIES[number]["id"];

const PREVIEWS: Record<
  IdentityKey,
  {
    identity: string;
    action: string;
    description: string;
    enemy: string;
    anchor: string;
    min: string;
    duration: number;
  }
> = {
  career: {
    identity: "A disciplined developer who ships consistently",
    action: "Build for 25 focused minutes",
    description: "Open your current project and make one visible improvement.",
    enemy: "Evening distraction",
    anchor: "After morning coffee",
    min: "Write one function",
    duration: 25,
  },
  writing: {
    identity: "A thoughtful creator who writes daily without self-editing",
    action: "Write 300 unfiltered words",
    description: "Draft your central argument before touching email or feeds.",
    enemy: "Premature perfectionism",
    anchor: "Before checking messages",
    min: "Draft one paragraph",
    duration: 20,
  },
  focus: {
    identity: "An indie founder building long-term leverage",
    action: "Ship one user-facing improvement",
    description: "Release one small fix or feature to production today.",
    enemy: "Busywork & refactoring",
    anchor: "First hour of the day",
    min: "Deploy one copy fix",
    duration: 30,
  },
};

export function HeroNotebook() {
  const [selectedKey, setSelectedKey] = useState<IdentityKey>("career");
  const [isDone, setIsDone] = useState(false);

  const cur = PREVIEWS[selectedKey];

  const handleToggle = () => {
    setIsDone(!isDone);
  };

  return (
    <div className="w-full max-w-[480px] bg-surface border border-border rounded-card shadow-card p-6 sm:p-7 space-y-6 select-none transition-all">
      {/* Top Segment Switcher */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-1.5">
          {IDENTITIES.map((tab) => {
            const isSelected = selectedKey === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedKey(tab.id);
                  setIsDone(false);
                }}
                className={`px-3.5 py-1.5 min-h-[36px] sm:min-h-[32px] rounded-btn text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-surface-elevated text-foreground border border-border"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <Badge variant={isDone ? "success" : "primary"} dot>
          {isDone ? "Proof logged" : "Pending proof"}
        </Badge>
      </div>

      {/* Identity Declaration */}
      <div className="space-y-1">
        <span className="text-[11px] font-editorial italic text-primary block">
          You are becoming:
        </span>
        <h3 className="text-base sm:text-lg font-medium text-foreground tracking-tight leading-snug">
          {cur.identity}
        </h3>
      </div>

      {/* Main Proof Card Preview */}
      <div className="p-4 sm:p-5 rounded-card-sm bg-surface-muted border border-border space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted block">
              Today&apos;s Proof · {cur.duration}m
            </span>
            <p className="text-base font-semibold text-foreground tracking-tight">
              {cur.action}
            </p>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              {cur.description}
            </p>
          </div>

          <ProgressRing
            progress={isDone ? 100 : 0}
            isCompleted={isDone}
            size={56}
            strokeWidth={3}
          >
            {isDone ? (
              <Check size={18} className="text-success" />
            ) : (
              <span className="font-mono text-[10px] text-primary">0/1</span>
            )}
          </ProgressRing>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-[11px]">
          <div>
            <span className="text-[10px] font-mono uppercase text-warning block">Enemy</span>
            <span className="text-foreground truncate block">{cur.enemy}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-primary block">Anchor</span>
            <span className="text-foreground truncate block">{cur.anchor}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-recovery block">Min</span>
            <span className="text-foreground truncate block">{cur.min}</span>
          </div>
        </div>
      </div>

      {/* Action Simulation Button */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-[12px] text-foreground-muted">
          {isDone ? "Momentum saved for today." : "Try clicking the daily proof:"}
        </p>

        <Button
          variant={isDone ? "secondary" : "primary"}
          size="sm"
          icon={isDone ? Undo2 : Check}
          onClick={handleToggle}
        >
          {isDone ? "Reset proof" : "Log proof"}
        </Button>
      </div>
    </div>
  );
}
