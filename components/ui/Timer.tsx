"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface TimerProps {
  initialMinutes: number;
  actionTitle: string;
  whyThisMatters?: string;
  onComplete: (actualMinutes: number) => void;
  onFinishEarly?: (actualMinutes: number) => void;
  onCancel?: () => void;
  className?: string;
}

export function Timer({
  initialMinutes,
  actionTitle,
  whyThisMatters,
  onComplete,
  onFinishEarly,
  onCancel,
  className = "",
}: TimerProps) {
  const totalSeconds = Math.max(1, initialMinutes * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const elapsedSeconds = totalSeconds - secondsRemaining;
  const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100));

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete(initialMinutes);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, initialMinutes, onComplete]);

  const togglePause = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const handleFinishEarly = useCallback(() => {
    setIsRunning(false);
    if (onFinishEarly) {
      onFinishEarly(elapsedMinutes);
    } else {
      onComplete(elapsedMinutes);
    }
  }, [elapsedMinutes, onFinishEarly, onComplete]);

  // Stroke calculations for SVG ring
  const ringSize = 220;
  const strokeWidth = 8;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center text-center space-y-6 select-none ${className}`}>
      {/* Action Title */}
      <div className="space-y-1.5 max-w-[480px]">
        <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
          Active Restart Session
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {actionTitle}
        </h2>
        {whyThisMatters && (
          <p className="text-sm text-foreground-secondary leading-relaxed pt-1">
            <span className="font-medium text-foreground">Why this matters: </span>
            {whyThisMatters}
          </p>
        )}
      </div>

      {/* Circular Progress & Digits */}
      <div className="relative w-[220px] h-[220px] flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${ringSize} ${ringSize}`}>
          {/* Background circle track */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            className="stroke-border"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress fill */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            className="stroke-primary transition-all duration-1000 ease-linear"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-foreground">
            {formatTime(secondsRemaining)}
          </span>
          <span className="text-xs font-mono text-foreground-muted uppercase tracking-wider mt-1">
            {isRunning ? "Focusing" : "Paused"}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          variant={isRunning ? "secondary" : "primary"}
          size="md"
          icon={isRunning ? Pause : Play}
          onClick={togglePause}
        >
          {isRunning ? "Pause" : "Resume"}
        </Button>

        <Button
          variant="primary"
          size="md"
          withCircularArrow
          onClick={handleFinishEarly}
        >
          Finish early
        </Button>

        {onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-foreground-muted"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

