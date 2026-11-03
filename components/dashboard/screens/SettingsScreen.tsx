"use client";

import { useState } from "react";
import { PersonalMirror } from "@/types/identity";
import { Settings, Download, Trash2, Edit3, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface SettingsScreenProps {
  mirror: PersonalMirror;
  onOpenEditMirror: () => void;
  onExportJson: () => void;
  onExportText: () => void;
  onClearAll: () => void;
  onUpdateFocusArea: (area: string) => void;
  onUpdateDailyTime: (minutes: number) => void;
}

const LIFE_AREAS = [
  "Career",
  "Discipline",
  "Health",
  "Focus",
  "Money",
  "Relationships",
];

const TIME_PRESETS = [10, 20, 30, 45, 60];

export function SettingsScreen({
  mirror,
  onOpenEditMirror,
  onExportJson,
  onExportText,
  onClearAll,
  onUpdateFocusArea,
  onUpdateDailyTime,
}: SettingsScreenProps) {
  const [selectedArea, setSelectedArea] = useState(mirror.focusArea);
  const [selectedTime, setSelectedTime] = useState(mirror.dailyProtectedTime);

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    onUpdateFocusArea(area);
  };

  const handleTimeChange = (time: number) => {
    setSelectedTime(time);
    onUpdateDailyTime(time);
  };

  return (
    <div className="w-full max-w-[760px] mx-auto py-4 sm:py-8 space-y-10 select-none">
      {/* ── HEADER ── */}
      <div className="border-b border-border pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-primary block mb-1">
          Settings &amp; Sovereignty
        </span>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Settings size={22} className="text-primary" />
          <span>Sanctuary Configuration</span>
        </h1>
      </div>

      {/* ── 1. IDENTITY & CONTRACT CALIBRATION ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
              1. Personal Mirror &amp; Identity
            </h2>
            <p className="text-xs text-foreground-muted">
              Your stated declarations, blockers, and anti-future.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={Edit3}
            onClick={onOpenEditMirror}
          >
            Calibrate
          </Button>
        </div>

        <Card padding="md" className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-mono text-primary uppercase block">
              Desired Identity
            </span>
            <p className="text-sm font-medium text-foreground mt-0.5">
              {mirror.desiredIdentity}
            </p>
          </div>

          <div className="pt-2 border-t border-border">
            <span className="text-[10px] font-mono text-danger uppercase block">
              Anti-Future
            </span>
            <p className="text-xs text-foreground-secondary mt-0.5">
              {mirror.antiFuture}
            </p>
          </div>
        </Card>
      </section>

      {/* ── 2. FOCUS AREA & TIME ALLOCATION ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          2. Focus Area &amp; Daily Allocation
        </h2>

        <Card padding="md" className="space-y-5 text-xs">
          {/* Life Area Pills */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-foreground-secondary uppercase block">
              Primary Life Area
            </label>
            <div className="flex flex-wrap gap-2">
              {LIFE_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleAreaChange(area)}
                  className={`px-3 py-1.5 rounded-btn text-xs transition-colors border ${
                    selectedArea === area
                      ? "bg-primary-soft border-primary text-foreground font-medium"
                      : "bg-surface-muted border-border text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Time Presets */}
          <div className="space-y-2 pt-3 border-t border-border">
            <label className="text-[11px] font-mono text-foreground-secondary uppercase block">
              Daily Protected Time (Minutes)
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_PRESETS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleTimeChange(m)}
                  className={`px-3 py-1.5 rounded-btn text-xs font-mono transition-colors border ${
                    selectedTime === m
                      ? "bg-recovery/15 border-recovery text-recovery font-medium"
                      : "bg-surface-muted border-border text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* ── 3. DATA SOVEREIGNTY & EXPORT ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
            3. Data Sovereignty
          </h2>
          <p className="text-xs text-foreground-muted">
            You own your transformation. Export your complete identity record at any time.
          </p>
        </div>

        <Card padding="md" className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={onExportJson}
          >
            Export complete archive (JSON)
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={onExportText}
          >
            Export text journal (.txt)
          </Button>
        </Card>
      </section>

      {/* ── 4. PLAN & BILLING ── */}
      <section className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
          4. Plan &amp; Billing
        </h2>

        <Card padding="md" className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-foreground flex items-center gap-2">
              <CreditCard size={14} className="text-primary" />
              <span>Mirr Free Sanctuary</span>
            </span>
            <p className="text-xs text-foreground-secondary">
              Your core mirror and daily identity action are free forever.
            </p>
          </div>

          <Link href="/pricing">
            <Button variant="secondary" size="sm">
              View tiers
            </Button>
          </Link>
        </Card>
      </section>

      {/* ── 5. DANGER ZONE ── */}
      <section className="space-y-4 pt-4 border-t border-border">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-danger">
            5. Privacy Purge
          </h2>
          <p className="text-xs text-foreground-muted">
            Permanently delete all locally cached identity contracts, reflections, and evidence.
          </p>
        </div>

        <Card padding="md" className="border-danger/25 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-foreground">
              Purge local storage
            </p>
            <p className="text-[11px] text-foreground-muted">
              This resets your sanctuary to initial defaults. Cannot be undone.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={onClearAll}
          >
            Purge data
          </Button>
        </Card>
      </section>
    </div>
  );
}
