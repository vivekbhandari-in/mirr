"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Habit } from "@/types";

interface HabitRowProps {
  habit: Habit;
  isDone: boolean;
  isMissedOpen: boolean;
  onToggle: (habitId: string, completed: boolean, reason?: string) => void;
  onSelectMissedReason: (habitId: string, reason: string) => void;
  onEdit: (habit: Habit) => void;
}

const MISSED_OPTIONS = [
  { label: "Forgot", key: "Forgot" },
  { label: "Too hard", key: "Too hard" },
  { label: "No time", key: "No time" },
  { label: "Low energy", key: "Low energy" },
  { label: "Distractions", key: "Distractions" },
];

export function HabitRow({
  habit,
  isDone,
  isMissedOpen,
  onToggle,
  onSelectMissedReason,
  onEdit,
}: HabitRowProps) {
  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDone) {
      onToggle(habit.id, false);
    } else {
      onToggle(habit.id, true);
    }
  };

  return (
    <motion.div
      layout="position"
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-1.5"
    >
      <div
        className={`grid grid-cols-[44px_1fr_auto] items-start p-3.5 sm:p-4 rounded-md border transition-all duration-200 ${
          isDone
            ? "border-[rgba(201,169,110,0.2)] bg-[#181511] opacity-70"
            : "border-[rgba(201,169,110,0.1)] bg-[#1C1914] hover:border-[rgba(201,169,110,0.3)]"
        }`}
      >
        {/* Column 1: 44px Checkbox Column */}
        <div className="flex items-center justify-start pt-0.5">
          <button
            type="button"
            onClick={handleCheckClick}
            aria-label={isDone ? `Mark ${habit.name} incomplete` : `Mark ${habit.name} complete`}
            className={`w-[22px] h-[22px] rounded-full border flex items-center justify-center transition-colors duration-200 cursor-pointer ${
              isDone
                ? "bg-[#C9A96E] border-[#C9A96E] animate-check-burst"
                : "border-[#4A4438] hover:border-[#C9A96E] bg-transparent"
            }`}
          >
            {isDone && (
              <span className="text-[#141210] text-[11px] font-bold leading-none animate-checkmark-spring select-none">
                ✓
              </span>
            )}
          </button>
        </div>

        {/* Column 2: Fluid Text Column */}
        <div className="min-w-0 pr-3">
          <p
            className={`text-sm font-medium tracking-tight transition-all duration-200 ${
              isDone ? "line-through text-[#8A8070]" : "text-[#F0EAE0]"
            }`}
          >
            {habit.name}
          </p>

          <p className="text-xs text-[#8A8070] mt-0.5 leading-relaxed">
            {habit.action}
          </p>

          {/* Context Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[10px] font-normal text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-2 py-0.5 rounded-sm">
              Anchor: {habit.cue}
            </span>

            <span className="text-[10px] font-light text-[#8A8070] bg-[#242018] border border-[#4A4438]/60 px-2 py-0.5 rounded-sm">
              Min: {habit.minimum_version}
            </span>

            <span className="text-[10px] font-light text-[#8A8070] ml-1">
              {habit.frequency}
            </span>
          </div>
        </div>

        {/* Column 3: Edit Button */}
        <div>
          <button
            type="button"
            onClick={() => onEdit(habit)}
            className="text-[11px] text-[#8A8070] hover:text-[#C9A96E] px-2 py-1 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Inline Missed Reason Modal with Smooth Collapse via AnimatePresence */}
      <AnimatePresence>
        {isMissedOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="ml-11 overflow-hidden"
          >
            <div className="p-3 rounded-md bg-[#242018] border border-[rgba(201,169,110,0.2)] space-y-2">
              <p className="text-[11px] font-light text-[#8A8070]">
                What got in the way today?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MISSED_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onSelectMissedReason(habit.id, opt.key)}
                    className="text-[11px] text-[#F0EAE0] bg-[#1C1914] border border-[#4A4438] hover:border-[#C9A96E] hover:text-[#C9A96E] px-2.5 py-1 rounded-sm transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
