"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TrialBannerProps {
  streak: number;
  daysRemaining?: number;
}

export function TrialBanner({
  streak,
  daysRemaining = 5,
}: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(true); // default true until mounted

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("mirr_trial_banner_dismissed");
      if (!isDismissed && daysRemaining <= 5) {
        setDismissed(false);
      }
    }
  }, [daysRemaining]);

  if (dismissed || daysRemaining > 5) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mirr_trial_banner_dismissed", "true");
    }
  };

  return (
    <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.25)] rounded-md p-4 sm:p-5 text-[#F0EAE0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none mb-6">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-normal text-[#C9A96E] mb-1">
          {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining in your trial
        </p>
        <h3 className="font-serif italic text-lg sm:text-xl text-[#F0EAE0] leading-snug mb-1">
          You&apos;ve built a {streak}-day streak. Don&apos;t let it reset.
        </h3>
        <p className="text-xs font-light text-[#8A8070] leading-relaxed max-w-[620px]">
          Lock in your membership to maintain uninterrupted momentum, deep reflection vaults, and weekly habit analytics.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs font-light text-[#8A8070] hover:text-[#F0EAE0] py-1.5 px-3 transition-colors duration-200"
        >
          Later
        </button>
        <Link
          href="/pricing"
          className="text-xs font-medium text-[#141210] bg-[#C9A96E] hover:bg-[#A8864E] px-4 py-2 rounded-sm transition-colors duration-200 shadow-sm"
        >
          Keep going — $7/mo
        </Link>
      </div>
    </div>
  );
}
