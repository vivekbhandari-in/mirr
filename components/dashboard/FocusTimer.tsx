"use client";

import { useState, useEffect, useRef } from "react";

export function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [initialSeconds, setInitialSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleToggle = () => {
    if (!hasStarted) setHasStarted(true);
    setIsRunning(!isRunning);
  };

  const handlePreset = (minutes: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const secs = minutes * 60;
    setInitialSeconds(secs);
    setSecondsLeft(secs);
    setHasStarted(true);
    setIsRunning(true);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const displayTime = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const buttonLabel = !hasStarted
    ? "Begin"
    : isRunning
    ? "Pause"
    : "Resume";

  return (
    <div className="space-y-3">
      <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-1.5 border-b border-[rgba(201,169,110,0.14)]">
        Focus timer
      </div>

      <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.14)] rounded-md p-4 space-y-3">
        {/* Large Italic Serif Time Display */}
        <div className="text-center py-1">
          <span className="font-serif italic text-3xl sm:text-4xl text-[#F0EAE0] tracking-tight tabular-nums select-none">
            {displayTime}
          </span>
        </div>

        {/* Begin / Pause / Resume Button (Primary Gold) */}
        <button
          type="button"
          onClick={handleToggle}
          className="w-full py-2 bg-[#C9A96E] hover:bg-[#A8864E] text-[#141210] font-medium text-xs rounded-sm transition-colors duration-200 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E]"
        >
          {buttonLabel}
        </button>

        {/* 25m / 45m / 5m Preset Buttons */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {[
            { label: "25m", mins: 25 },
            { label: "45m", mins: 45 },
            { label: "5m", mins: 5 },
          ].map((preset) => {
            const isCurrentPreset = initialSeconds === preset.mins * 60;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset.mins)}
                className={`text-[11px] py-1 rounded-sm border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E] ${
                  isCurrentPreset && isRunning
                    ? "border-[#C9A96E] text-[#C9A96E] bg-[#242018]"
                    : "border-[#4A4438] text-[#8A8070] hover:text-[#F0EAE0] hover:border-[#8A8070] bg-[#141210]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
