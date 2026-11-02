"use client";

import Link from "next/link";
import { PanelRight } from "lucide-react";

interface TopNavProps {
  area: string;
  streak: number;
  completedTodayCount: number;
  totalHabitsCount: number;
  clarityPct: number;
  onOpenShare: () => void;
  onToggleSidebar?: () => void;
}

export function TopNav({
  area,
  streak,
  completedTodayCount,
  totalHabitsCount,
  clarityPct,
  onOpenShare,
  onToggleSidebar,
}: TopNavProps) {
  return (
    <header className="h-[52px] w-full bg-[#141210] border-b border-[rgba(201,169,110,0.14)] px-4 sm:px-6 flex items-center justify-between gap-4 select-none z-30">
      {/* Left: Brand Glyph & Active Area Name */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/"
          className="font-serif italic text-base text-[#C9A96E] hover:opacity-80 transition-opacity flex-shrink-0"
          title="Mirr Home"
        >
          Mirr
        </Link>
        <span className="text-[#4A4438] text-xs">/</span>
        <span className="text-xs font-normal text-[#F0EAE0] truncate">
          {area || "Personal transformation"}
        </span>
      </div>

      {/* Center / Right Metrics */}
      <div className="flex items-center gap-3 sm:gap-6 text-xs text-[#8A8070] font-light">
        <div className="flex items-center gap-1.5">
          <span className="text-[#F0EAE0] font-medium">{streak}d</span>
          <span>streak</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#F0EAE0] font-medium">
            {completedTodayCount}/{totalHabitsCount}
          </span>
          <span>today</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-[#C9A96E] font-medium">{clarityPct}%</span>
          <span>clarity</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pl-2 border-l border-[rgba(201,169,110,0.14)]">
          <button
            type="button"
            onClick={onOpenShare}
            className="text-xs font-normal text-[#8A8070] hover:text-[#F0EAE0] hover:border-[#C9A96E] border border-[#4A4438] px-2.5 py-1 rounded-sm transition-colors"
          >
            Share
          </button>

          <Link
            href="/pricing"
            className="text-xs font-medium bg-[#C9A96E] hover:bg-[#A8864E] text-[#141210] px-3 py-1 rounded-sm transition-colors"
          >
            Get Pro
          </Link>

          {/* Mobile/Tablet Telemetry Toggle */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Toggle telemetry sidebar"
              className="lg:hidden text-xs text-[#8A8070] hover:text-[#F0EAE0] hover:border-[#C9A96E] border border-[#4A4438] p-1.5 rounded-sm transition-colors"
              title="Toggle sidebar"
            >
              <PanelRight className="w-3.5 h-3.5 text-[#C9A96E]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
