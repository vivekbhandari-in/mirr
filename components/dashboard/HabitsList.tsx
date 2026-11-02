"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Habit } from "@/types";
import { HabitRow } from "./HabitRow";
import { EditHabitModal } from "./EditHabitModal";

interface HabitsListProps {
  habits: Habit[];
  checks: Record<string, boolean>;
  onToggleHabit: (habitId: string, completed: boolean, missedReason?: string) => void;
  onUpdateHabit: (habit: Habit) => void;
  onShowToast: (msg: string) => void;
}

const MISSED_TOASTS: Record<string, string> = {
  Forgot: "Try linking it to something you already do daily.",
  "Too hard": "Use the minimum version — it still counts.",
  "No time": "Try moving it earlier in your day.",
  "Low energy": "Minimum version only. Show up, even briefly.",
  Distractions: "Phone face-down during this one habit.",
};

export function HabitsList({
  habits,
  checks,
  onToggleHabit,
  onUpdateHabit,
  onShowToast,
}: HabitsListProps) {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [missedHabitId, setMissedHabitId] = useState<string | null>(null);

  const handleToggle = (habitId: string, completed: boolean) => {
    if (completed) {
      setMissedHabitId(null);
      onToggleHabit(habitId, true);
    } else {
      // Unchecking shows missed reason modal inline below row
      setMissedHabitId((prev) => (prev === habitId ? null : habitId));
      onToggleHabit(habitId, false);
    }
  };

  const handleSelectMissedReason = (habitId: string, reason: string) => {
    setMissedHabitId(null);
    const toast = MISSED_TOASTS[reason] || "Tomorrow is a fresh start.";
    onShowToast(toast);
    onToggleHabit(habitId, false, reason);
  };

  return (
    <section className="space-y-3" aria-label="Daily habit commitments">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(201,169,110,0.14)]">
        <h2 className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em]">
          Daily commitments
        </h2>
        <span className="text-[11px] text-[#8A8070] font-light">
          {habits.filter((h) => !!checks[h.id]).length} of {habits.length} sealed
        </span>
      </div>

      {/* Habit Rows (Staggered Entrance) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
          },
        }}
        className="space-y-2.5"
      >
        {habits.map((habit) => (
          <motion.div
            key={habit.id}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <HabitRow
              habit={habit}
              isDone={!!checks[habit.id]}
              isMissedOpen={missedHabitId === habit.id}
              onToggle={handleToggle}
              onSelectMissedReason={handleSelectMissedReason}
              onEdit={setEditingHabit}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Edit Habit Modal */}
      <EditHabitModal
        habit={editingHabit}
        isOpen={!!editingHabit}
        onClose={() => setEditingHabit(null)}
        onSave={onUpdateHabit}
      />
    </section>
  );
}
