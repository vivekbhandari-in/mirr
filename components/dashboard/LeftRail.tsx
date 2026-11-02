"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Columns2,
  PenLine,
  Activity,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

export type DashboardTab = "today" | "mirror" | "reflect" | "history" | "settings";

interface TabItem {
  id: DashboardTab;
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { id: "today", label: "Today", icon: CheckCircle2 },
  { id: "mirror", label: "Mirror", icon: Columns2 },
  { id: "reflect", label: "Reflect", icon: PenLine },
  { id: "history", label: "History", icon: Activity },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
];

interface LeftRailProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
}

export function LeftRail({ activeTab, onSelectTab }: LeftRailProps) {
  return (
    <aside
      className="w-[56px] min-w-[56px] bg-[#141210] border-r border-[rgba(201,169,110,0.14)] flex flex-col items-center py-4 select-none z-30"
      aria-label="Dashboard navigation rail"
    >
      <nav className="flex flex-col items-center gap-2 w-full">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <div key={tab.id} className="relative w-full flex items-center justify-center">
              {/* Smooth Gliding Active Indicator Bar */}
              {isActive && (
                <motion.span
                  layoutId="activeRailIndicator"
                  className="absolute left-0 w-[2.5px] h-5 bg-[#C9A96E] rounded-r-sm shadow-[0_0_8px_rgba(201,169,110,0.4)]"
                  transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  aria-hidden="true"
                />
              )}

              <motion.button
                type="button"
                onClick={() => onSelectTab(tab.id)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                title={tab.label}
                className={`w-10 h-10 rounded-sm flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A96E] ${
                  isActive
                    ? "text-[#C9A96E] bg-[#1C1914]"
                    : "text-[#8A8070] hover:text-[#F0EAE0] hover:bg-[#1C1914]/50"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </motion.button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
