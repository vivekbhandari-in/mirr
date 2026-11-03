"use client";

import {
  Target,
  ScanFace,
  NotebookPen,
  History,
  Compass,
  Settings,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { SidebarItem } from "@/components/ui/SidebarItem";
import { Badge } from "@/components/ui/Badge";

export type IdentityDashboardTab =
  | "today"
  | "mirror"
  | "reflect"
  | "evidence"
  | "drift"
  | "settings";

interface DashboardSidebarProps {
  activeTab: IdentityDashboardTab;
  onSelectTab: (tab: IdentityDashboardTab) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  driftCount?: number;
  className?: string;
}

const NAV_ITEMS: {
  id: IdentityDashboardTab;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}[] = [
  {
    id: "today",
    label: "Today",
    sublabel: "One daily proof",
    icon: Target,
  },
  {
    id: "mirror",
    label: "Mirror",
    sublabel: "Identity contract",
    icon: ScanFace,
  },
  {
    id: "reflect",
    label: "Reflect",
    sublabel: "Evening debrief",
    icon: NotebookPen,
  },
  {
    id: "evidence",
    label: "Evidence",
    sublabel: "Consistency archive",
    icon: History,
  },
  {
    id: "drift",
    label: "Drift",
    sublabel: "Recovery without shame",
    icon: Compass,
  },
  {
    id: "settings",
    label: "Settings",
    sublabel: "Preferences & export",
    icon: Settings,
  },
];

export function DashboardSidebar({
  activeTab,
  onSelectTab,
  isCollapsed = false,
  onToggleCollapse,
  driftCount = 0,
  className = "",
}: DashboardSidebarProps) {
  return (
    <aside
      className={`h-full bg-background border-r border-border flex flex-col justify-between select-none transition-all duration-200 z-20 ${
        isCollapsed ? "w-[64px]" : "w-[240px]"
      } ${className}`}
    >
      {/* Top Nav Items */}
      <div className="py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            sublabel={item.sublabel}
            isActive={activeTab === item.id}
            isCollapsed={isCollapsed}
            onClick={() => onSelectTab(item.id)}
            badge={
              item.id === "drift" && driftCount > 0 ? (
                <Badge variant="warning">{driftCount}d</Badge>
              ) : undefined
            }
          />
        ))}
      </div>

      {/* Bottom info & collapse toggle */}
      <div className="p-3 border-t border-border space-y-2">
        {!isCollapsed && (
          <div className="px-3 py-2.5 rounded-input bg-surface border border-border text-[11px] text-foreground-secondary">
            <span className="font-mono text-[10px] uppercase text-primary tracking-wider block mb-0.5">
              Sanctuary Rule
            </span>
            <p className="text-[11px] text-foreground-secondary leading-snug">
              One proof today. Returning is always celebrated.
            </p>
          </div>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 text-foreground-secondary hover:text-foreground hover:bg-surface-elevated rounded-btn transition-colors text-xs"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!isCollapsed && <span className="ml-2 text-[12px]">Collapse</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
