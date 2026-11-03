"use client";

import Link from "next/link";
import { ActionStatus } from "@/types/identity";
import { Settings, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface DashboardTopNavProps {
  focusArea: string;
  proofStatus: ActionStatus;
  userInitial?: string;
  onOpenSettings: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export function DashboardTopNav({
  focusArea,
  proofStatus,
  userInitial = "M",
  onOpenSettings,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}: DashboardTopNavProps) {
  return (
    <header className="h-[56px] w-full bg-background border-b border-border px-4 sm:px-6 flex items-center justify-between z-30 select-none flex-shrink-0">
      {/* Left zone: Logo + Mobile Toggle + Focus Area */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 -ml-1 text-foreground-secondary hover:text-foreground hover:bg-surface-elevated rounded-btn transition-colors"
          aria-label={isMobileSidebarOpen ? "Close navigation" : "Open navigation"}
        >
          {isMobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <Link
          href="/"
          className="flex items-center gap-1.5 group font-semibold text-base sm:text-lg tracking-tight text-foreground"
        >
          <span>Mirr</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform" />
        </Link>

        <div className="h-4 w-[1px] bg-border hidden sm:block" />

        <div className="inline-flex items-center gap-1.5 text-xs text-foreground-secondary">
          <span className="text-[11px] uppercase tracking-wider text-foreground-muted font-mono hidden md:inline">
            Focus
          </span>
          <Badge variant="neutral">{focusArea}</Badge>
        </div>
      </div>

      {/* Center: Daily Status Indicator */}
      <div className="flex items-center gap-2">
        {proofStatus === "pending" && (
          <Badge variant="primary" dot>
            Today&apos;s proof pending
          </Badge>
        )}

        {proofStatus === "completed" && (
          <Badge variant="success" dot>
            Proof logged · 1 of 1
          </Badge>
        )}

        {proofStatus === "minimum" && (
          <Badge variant="recovery" dot>
            Momentum saved · Minimum
          </Badge>
        )}

        {proofStatus === "missed" && (
          <Badge variant="warning" dot>
            Drift noted · Recovery ready
          </Badge>
        )}
      </div>

      {/* Right zone: Avatar Squircle + Settings */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 text-foreground-secondary hover:text-foreground hover:bg-surface-elevated rounded-btn transition-colors"
          title="Settings & Data"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>

        <div
          className="w-7 h-7 rounded-btn bg-surface-elevated border border-border text-foreground text-xs font-mono font-medium flex items-center justify-center select-none shadow-sm"
          title="Personal Sanctuary"
        >
          {userInitial}
        </div>
      </div>
    </header>
  );
}
