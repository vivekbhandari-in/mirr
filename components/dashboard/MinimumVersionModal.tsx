"use client";

import { useState, useEffect } from "react";
import { X, Check, Timer, Minimize2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface MinimumVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteMinimum: (durationMinutes: number) => void;
  minimumAction: string;
}

export function MinimumVersionModal({
  isOpen,
  onClose,
  onCompleteMinimum,
  minimumAction,
}: MinimumVersionModalProps) {
  const [timerMode, setTimerMode] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimerMode(false);
      setSecondsLeft(300);
      setTimerRunning(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerMode && timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerMode, timerRunning, secondsLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleInstantComplete = () => {
    onCompleteMinimum(5);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Minimum Version Proof"
      description="Too small to fail. When energy is low, momentum is preserved by tiny actions."
      maxWidth="md"
    >
      <div className="space-y-6 pt-1">
        {/* Action card */}
        <div className="p-4 rounded-input bg-surface-muted border border-border space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-recovery tracking-wider block">
            Today&apos;s Minimum Action
          </span>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {minimumAction}
          </p>
        </div>

        {/* Timer or Instant View */}
        {!timerMode ? (
          <div className="space-y-4">
            <p className="text-xs text-foreground-secondary leading-relaxed">
              When willpower is depleted or schedules collapse, doing the minimum version keeps the identity alive without breaking your psychological contract.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Button
                variant="recovery"
                size="lg"
                icon={Check}
                onClick={handleInstantComplete}
              >
                Mark done now (5m)
              </Button>

              <Button
                variant="secondary"
                size="lg"
                icon={Timer}
                onClick={() => {
                  setTimerMode(true);
                  setTimerRunning(true);
                }}
              >
                Start 5m timer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center py-2">
            <div className="font-mono text-5xl font-light text-foreground tabular-nums">
              {formatted}
            </div>

            <p className="text-xs text-foreground-secondary">
              Just write the function or read the page. Nothing else matters.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? "Pause" : "Resume"}
              </Button>

              <Button
                variant="recovery"
                size="md"
                onClick={handleInstantComplete}
              >
                Done · Log Minimum Proof
              </Button>
            </div>
          </div>
        )}

        <div className="pt-2 text-center border-t border-border">
          <p className="text-[11px] text-foreground-secondary italic">
            “Small proof still counts. Momentum preserved.”
          </p>
        </div>
      </div>
    </Modal>
  );
}
