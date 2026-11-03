"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Check, X, Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FocusModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (durationMinutes: number) => void;
  actionTitle: string;
  actionDuration: number; // minutes
  desiredIdentity: string;
}

export function FocusModeModal({
  isOpen,
  onClose,
  onComplete,
  actionTitle,
  actionDuration,
  desiredIdentity,
}: FocusModeModalProps) {
  const totalSeconds = actionDuration * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer on open
  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(actionDuration * 60);
      setIsRunning(true);
      setIsFinished(false);
    }
  }, [isOpen, actionDuration]);

  // Tick countdown
  useEffect(() => {
    if (!isOpen) return;

    if (isRunning && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, runningOrRemaining(isRunning, secondsRemaining)]);

  function runningOrRemaining(r: boolean, s: number) {
    return `${r}-${s > 0}`;
  }

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const elapsedSeconds = totalSeconds - secondsRemaining;
  const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));

  const handleFinishEarly = () => {
    setIsFinished(true);
    setIsRunning(false);
  };

  const handleClaimEvidence = () => {
    onComplete(elapsedMinutes);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-background text-foreground flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none"
    >
      {/* Top Bar: Close & Mode indicator */}
      <header className="relative z-10 w-full max-w-[800px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-foreground-secondary font-mono tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Focused Session</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 text-foreground-secondary hover:text-foreground hover:bg-surface-elevated rounded-btn transition-colors"
          title="Exit focus mode"
          aria-label="Exit focus mode"
        >
          <X size={20} />
        </button>
      </header>

      {/* Main Focus Center */}
      <main className="relative z-10 w-full max-w-[680px] mx-auto text-center flex flex-col items-center justify-center my-auto space-y-8">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="timer"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 flex flex-col items-center"
            >
              {/* Action Headline */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-primary">
                  Today&apos;s Proof
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground max-w-[540px]">
                  {actionTitle}
                </h1>
              </div>

              {/* Large Monospace Timer */}
              <div className="py-2">
                <div className="font-mono text-7xl sm:text-9xl font-light tracking-tight text-foreground tabular-nums select-none">
                  {formattedTime}
                </div>

                {/* Progress bar line */}
                <div className="w-64 sm:w-80 h-1 bg-border rounded-pill mx-auto mt-4 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000 ease-linear rounded-pill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Why This Matters Line */}
              <p className="text-xs sm:text-sm font-normal text-foreground-secondary max-w-[440px] leading-relaxed italic">
                “Every minute of focus creates undeniable proof that you are becoming {desiredIdentity.toLowerCase()}.”
              </p>

              {/* Controls */}
              <div className="flex items-center justify-center flex-wrap sm:flex-nowrap gap-3 pt-3 w-full max-w-[380px] mx-auto">
                <Button
                  variant="secondary"
                  size="md"
                  icon={isRunning ? Pause : Play}
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-5 min-w-[120px]"
                >
                  {isRunning ? "Pause" : "Resume"}
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinishEarly}
                  className="px-5 min-w-[150px]"
                >
                  End &amp; log proof
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="finished"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-8 sm:p-10 rounded-modal bg-surface border border-border space-y-6 max-w-[460px] mx-auto shadow-modal"
            >
              <div className="w-12 h-12 rounded-card-sm bg-success/10 text-success border border-success/20 flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {elapsedMinutes} minutes of evidence created.
                </h2>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  You did not drift. You showed up and protected your focused block.
                  This proof has been permanently sealed into your archive.
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleClaimEvidence}
              >
                Return to Sanctuary
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Hint */}
      <footer className="relative z-10 w-full max-w-[800px] mx-auto text-center">
        <p className="text-[11px] font-mono text-foreground-muted">
          Phone away · Fullscreen focus · Press Esc anytime
        </p>
      </footer>
    </div>
  );
}
