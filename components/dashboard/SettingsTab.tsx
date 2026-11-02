"use client";

import Link from "next/link";

interface SettingsTabProps {
  area: string;
  timeAvailable: string;
  blocker: string;
}

export function SettingsTab({ area, timeAvailable, blocker }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-2 border-b border-[rgba(201,169,110,0.14)]">
          <span>Settings &amp; plan</span>
        </div>

        <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.14)] rounded-md p-6 space-y-5">
          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-[#8A8070] block mb-0.5">Focus area</span>
              <p className="text-sm font-medium text-[#F0EAE0]">{area || "Personal Growth"}</p>
            </div>

            <div>
              <span className="text-[11px] text-[#8A8070] block mb-0.5">Daily time window</span>
              <p className="text-sm font-medium text-[#F0EAE0]">{timeAvailable || "30 minutes"}</p>
            </div>

            <div>
              <span className="text-[11px] text-[#8A8070] block mb-0.5">Primary friction</span>
              <p className="text-sm font-medium text-[#F0EAE0]">{blocker || "Not specified"}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(201,169,110,0.14)] flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-[#F0EAE0]">Want to recalibrate?</p>
              <p className="text-[11px] text-[#8A8070] font-light">
                Retake the intake survey to adjust your focus and generate fresh habits.
              </p>
            </div>

            <Link
              href="/survey"
              className="text-xs font-normal text-[#F0EAE0] hover:text-[#C9A96E] hover:border-[#C9A96E] border border-[#4A4438] px-3 py-1.5 rounded-sm transition-colors"
            >
              Edit plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

