"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className = "" }: TabsProps) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1 p-1 bg-surface-elevated border border-border rounded-full select-none ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 outline-none flex items-center gap-1.5 ${
              isActive ? "text-foreground font-semibold" : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-surface rounded-full shadow-subtle border border-border"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-primary text-white" : "bg-surface-muted text-foreground-secondary"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

