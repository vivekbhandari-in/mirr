"use client";

import { useState, useEffect } from "react";
import { Habit } from "@/types";

interface EditHabitModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Habit) => void;
}

export function EditHabitModal({ habit, isOpen, onClose, onSave }: EditHabitModalProps) {
  const [name, setName] = useState("");
  const [action, setAction] = useState("");
  const [cue, setCue] = useState("");
  const [minimumVersion, setMinimumVersion] = useState("");

  useEffect(() => {
    if (habit) {
      setName(habit.name || "");
      setAction(habit.action || "");
      setCue(habit.cue || "");
      setMinimumVersion(habit.minimum_version || "");
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...habit,
      name,
      action,
      cue,
      minimum_version: minimumVersion,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-habit-title"
    >
      <div className="bg-[#1C1914] rounded-md p-6 w-full max-w-[460px] border border-[rgba(201,169,110,0.2)] text-[#F0EAE0] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(201,169,110,0.14)]">
          <h3 id="edit-habit-title" className="font-serif italic text-xl text-[#F0EAE0]">
            Edit habit
          </h3>
          <span className="text-[11px] text-[#C9A96E] bg-[#C9A96E]/10 border border-[#C9A96E]/20 px-2 py-0.5 rounded-sm">
            {habit.frequency}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-normal text-[#8A8070] mb-1">
              Habit name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#242018] border border-[#4A4438] focus:border-[#C9A96E] rounded-sm p-2.5 text-xs text-[#F0EAE0] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-[#8A8070] mb-1">
              Physical action
            </label>
            <textarea
              required
              rows={2}
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-[#242018] border border-[#4A4438] focus:border-[#C9A96E] rounded-sm p-2.5 text-xs text-[#F0EAE0] outline-none resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-[#8A8070] mb-1">
              Anchor cue
            </label>
            <input
              type="text"
              required
              value={cue}
              onChange={(e) => setCue(e.target.value)}
              placeholder="e.g. Right after morning coffee"
              className="w-full bg-[#242018] border border-[#4A4438] focus:border-[#C9A96E] rounded-sm p-2.5 text-xs text-[#F0EAE0] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-[#8A8070] mb-1">
              Minimum version
            </label>
            <input
              type="text"
              required
              value={minimumVersion}
              onChange={(e) => setMinimumVersion(e.target.value)}
              placeholder="e.g. Just open the document for 1 minute"
              className="w-full bg-[#242018] border border-[#4A4438] focus:border-[#C9A96E] rounded-sm p-2.5 text-xs text-[#F0EAE0] outline-none transition-colors"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[rgba(201,169,110,0.14)]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#8A8070] hover:text-[#F0EAE0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#C9A96E] hover:bg-[#A8864E] text-[#141210] font-medium text-xs rounded-sm transition-colors"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
