"use client";

import Link from "next/link";
import { ActionStatus } from "@/types/identity";
import { Settings, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface DashboardTopNavProps {
  focusArea: string;
  proofStatus: ActionStatus;
  userInitial?: string;
  avatarUrl?: string | null;
  userEmail?: string | null;
  onOpenSettings: () => void;
  onToggleMobileSidebar: () => void;
  isMobileSidebarOpen: boolean;
}

export function DashboardTopNav({
  focusArea,
  proofStatus,
  userInitial = "M",
  avatarUrl,
  userEmail,
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
          className="lg:hidden p-1.5 -ml-1 text-foreground-secondary hover:text-foreground hover:bg-surface-elevated rounded-btn transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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

        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-foreground-secondary">
          <span className="text-[11px] uppercase tracking-wider text-foreground-muted font-mono hidden md:inline">
            Focus
          </span>
          <Badge variant="neutral">{focusArea}</Badge>
        </div>
      </div>

      {/* Center: Daily Status Indicator (Responsive compact label on mobile) */}
      <div className="flex items-center gap-2">
        {proofStatus === "pending" && (
          <Badge variant="primary" dot>
            <span className="hidden sm:inline">Today&apos;s proof pending</span>
            <span className="sm:hidden">Pending proof</span>
          </Badge>
        )}

        {proofStatus === "completed" && (
          <Badge variant="success" dot>
            <span className="hidden sm:inline">Proof logged · 1 of 1</span>
            <span className="sm:hidden">Proof logged</span>
          </Badge>
        )}

        {proofStatus === "minimum" && (
          <Badge variant="recovery" dot>
            <span className="hidden sm:inline">Momentum saved · Minimum</span>
            <span className="sm:hidden">Minimum version</span>
          </Badge>
        )}

        {proofStatus === "missed" && (
          <Badge variant="warning" dot>
            <span className="hidden sm:inline">Drift noted · Recovery ready</span>
            <span className="sm:hidden">Drift noted</span>
          </Badge>
        )}
      </div>

      {/* Right zone: Avatar Squircle (links to /profile) + Settings */}
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="p-2 text-foreground-secondary hover:text-foreground hover:bg-surface-elevated rounded-btn transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Settings & Profile"
          aria-label="Settings and Profile"
        >
          <Settings size={18} />
        </Link>

        <Link
          href="/profile"
          className="w-8 h-8 rounded-card-sm bg-surface-elevated border border-border hover:border-primary text-foreground text-xs font-mono font-medium flex items-center justify-center select-none shadow-sm overflow-hidden transition-colors"
          title={userEmail ? `Your Profile (${userEmail})` : "Your Profile"}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-semibold">{userInitial}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
