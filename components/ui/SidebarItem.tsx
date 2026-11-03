"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  isActive: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
}

export function SidebarItem({
  icon: Icon,
  label,
  sublabel,
  isActive,
  isCollapsed = false,
  onClick,
  badge,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-btn text-left select-none transition-colors duration-150 outline-none ${
        isActive
          ? "bg-surface-elevated text-foreground"
          : "text-foreground-secondary hover:text-foreground hover:bg-surface"
      }`}
      title={isCollapsed ? label : undefined}
    >
      {/* 2px vertical indigo bar on the left */}
      {isActive && (
        <span
          className="absolute left-0 top-2 bottom-2 w-[2px] bg-primary rounded-r-full"
          aria-hidden="true"
        />
      )}

      {/* Icon: 18px currentColor */}
      <Icon
        size={18}
        strokeWidth={2}
        className={`flex-shrink-0 transition-colors ${
          isActive ? "text-primary" : "text-foreground-secondary group-hover:text-foreground"
        }`}
      />

      {/* Text Label & Sublabel */}
      {!isCollapsed && (
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <div className="truncate">
            <span className="block text-[13px] font-medium tracking-tight truncate leading-tight">
              {label}
            </span>
            {sublabel && (
              <span className="block text-[11px] text-foreground-muted font-normal truncate mt-0.5">
                {sublabel}
              </span>
            )}
          </div>
          {badge && <div className="ml-2 flex-shrink-0">{badge}</div>}
        </div>
      )}
    </button>
  );
}

