"use client";

interface ArcProgressCircleProps {
  completedCount: number;
  totalCount: number;
}

export function ArcProgressCircle({ completedCount, totalCount }: ArcProgressCircleProps) {
  const percent = totalCount > 0 ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius; // ≈ 188.495
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-[76px] h-[76px] flex items-center justify-center flex-shrink-0">
      <svg className="w-[76px] h-[76px] -rotate-90" viewBox="0 0 76 76">
        {/* Track circle */}
        <circle
          cx="38"
          cy="38"
          r={radius}
          className="stroke-[#2E2A20]"
          strokeWidth="4"
          fill="transparent"
        />
        {/* Animated arc circle */}
        <circle
          cx="38"
          cy="38"
          r={radius}
          className="stroke-[#C9A96E]"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: "stroke-dashoffset 0.6s ease",
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="font-serif italic text-xl text-[#F0EAE0] leading-none">
          {completedCount}
        </span>
        <span className="text-[10px] text-[#8A8070] font-light leading-none mt-0.5">
          of {totalCount}
        </span>
      </div>
    </div>
  );
}

