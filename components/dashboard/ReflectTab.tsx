"use client";

import { useState, useEffect } from "react";

interface ReflectTabProps {
  initialWentWell?: string;
  initialBlockedBy?: string;
  initialChangeNext?: string;
  onSave: (data: { wentWell: string; blockedBy: string; changeNext: string }, isManual?: boolean) => void;
}

export function ReflectTab({
  initialWentWell = "",
  initialBlockedBy = "",
  initialChangeNext = "",
  onSave,
}: ReflectTabProps) {
  const [wentWell, setWentWell] = useState(initialWentWell);
  const [blockedBy, setBlockedBy] = useState(initialBlockedBy);
  const [changeNext, setChangeNext] = useState(initialChangeNext);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setWentWell(initialWentWell);
    setBlockedBy(initialBlockedBy);
    setChangeNext(initialChangeNext);
  }, [initialWentWell, initialBlockedBy, initialChangeNext]);

  // Auto-save silently on blur
  const handleBlur = () => {
    onSave({ wentWell, blockedBy, changeNext }, false);
  };

  // Manual save with user feedback
  const handleManualSave = () => {
    onSave({ wentWell, blockedBy, changeNext }, true);
    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-2 border-b border-[rgba(201,169,110,0.14)] flex items-center justify-between">
          <span>Daily reflection</span>
          <span className="text-[10px] text-[#8A8070]">Auto-saves on blur</span>
        </div>

        <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.14)] rounded-md p-6 space-y-4">
          <div>
            <label className="block text-xs font-normal text-[#F0EAE0] mb-1.5">
              What went well today?
            </label>
            <textarea
              rows={2}
              value={wentWell}
              onChange={(e) => setWentWell(e.target.value)}
              onBlur={handleBlur}
              placeholder="Even small wins count — what evidence did you record?"
              className="w-full bg-[#242018] border border-[#4A4438] focus:border-[#C9A96E] rounded-sm p-3 text-xs text-[#F0EAE0] font-light outline-none resize-none transition-colors leading-relaxed placeholder:text-[#8A8070]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-[#F0EAE0] mb-1.5">
              What got in the way?
            </label>
            <textarea
              rows={2}
              value={blockedBy}
              onChange={(e) => setBlockedBy(e.target.value)}
              onBlur={handleBlur}
              placeholder="Be candid. Friction is just data about where to adjust."
              className="w-full bg-[#242018] border border-[#4A4438] focus:border-[#C9A96E] rounded-sm p-3 text-xs text-[#F0EAE0] font-light outline-none resize-none transition-colors leading-relaxed placeholder:text-[#8A8070]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-[#F0EAE0] mb-1.5">
              One thing you&apos;d do differently tomorrow
            </label>
            <textarea
              rows={2}
              value={changeNext}
              onChange={(e) => setChangeNext(e.target.value)}
              onBlur={handleBlur}
              placeholder="A single micro-adjustment, not a major overhaul."
              className="w-full bg-[#242018] border border-[#4A4438] focus:border-[#C9A96E] rounded-sm p-3 text-xs text-[#F0EAE0] font-light outline-none resize-none transition-colors leading-relaxed placeholder:text-[#8A8070]/60"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#8A8070] font-light">
              Stored locally &amp; in your private vault
            </span>

            <button
              type="button"
              onClick={handleManualSave}
              className="text-xs font-medium bg-[#C9A96E] hover:bg-[#A8864E] text-[#141210] px-4 py-2 rounded-sm transition-colors shadow-sm"
            >
              {saved ? "Reflection sealed" : "Seal reflection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

