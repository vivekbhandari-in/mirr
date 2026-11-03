import React from "react";

export interface ProgressRingProps {
  progress: number; // 0 to 100
  isCompleted?: boolean;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  className?: string;
}

export function ProgressRing({
  progress,
  isCompleted = false,
  size = 88,
  strokeWidth = 4,
  children,
  className = "",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#232833]"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Dynamic Animated Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`transition-all duration-500 ease-out ${
            isCompleted ? "stroke-success" : "stroke-primary"
          }`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

