"use client";

import { PlanInsight } from "@/types";

interface MirrorTabProps {
  area: string;
  problem: string;
  futureVision: string;
  blocker: string;
  insight: PlanInsight;
}

export function MirrorTab({
  area,
  problem,
  futureVision,
  blocker,
  insight,
}: MirrorTabProps) {
  return (
    <div className="space-y-6">
      {/* 1. Triptych Section */}
      <div className="space-y-3">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-2 border-b border-[rgba(201,169,110,0.14)] flex items-center justify-between">
          <span>The mirror triptych</span>
          <span className="text-[10px] text-[#8A8070]">{area}</span>
        </div>

        <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.14)] rounded-md overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(201,169,110,0.14)]">
          {/* Card 1: Reality */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-[11px] text-[#C9A96E] font-normal mb-1">
                Where you are
              </p>
              <p className="text-xs font-medium text-[#F0EAE0] mb-2">
                Current reality
              </p>
              <p className="font-serif italic text-xs text-[#8A8070] leading-relaxed">
                &ldquo;{problem || "You haven't defined your starting point yet."}&rdquo;
              </p>
            </div>
            <p className="text-[10px] text-[#4A4438] mt-4">
              Pattern to break
            </p>
          </div>

          {/* Card 2: Horizon */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-[11px] text-[#C9A96E] font-normal mb-1">
                Where you want to be
              </p>
              <p className="text-xs font-medium text-[#F0EAE0] mb-2">
                Stated future
              </p>
              <p className="font-serif italic text-xs text-[#8A8070] leading-relaxed">
                &ldquo;{futureVision || "Define your desired future in survey."}&rdquo;
              </p>
            </div>
            <p className="text-[10px] text-[#4A4438] mt-4">
              1–2 year vision
            </p>
          </div>

          {/* Card 3: Friction */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-[11px] text-[#C9A96E] font-normal mb-1">
                What stands in the way
              </p>
              <p className="text-xs font-medium text-[#F0EAE0] mb-2">
                Named friction
              </p>
              <p className="font-serif italic text-xs text-[#8A8070] leading-relaxed">
                &ldquo;{blocker || "Identify your primary blocker."}&rdquo;
              </p>
            </div>
            <p className="text-[10px] text-[#4A4438] mt-4">
              Root resistance
            </p>
          </div>
        </div>
      </div>

      {/* 2. Compass Card (Action Priority) */}
      <div className="space-y-3">
        <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-2 border-b border-[rgba(201,169,110,0.14)]">
          <span>Strategic compass</span>
        </div>

        <div className="bg-[#242018] border border-[rgba(201,169,110,0.2)] rounded-md p-6 space-y-4">
          <div>
            <p className="text-[11px] text-[#C9A96E] font-normal mb-1">
              Starting point
            </p>
            <h3 className="font-serif italic text-xl sm:text-2xl text-[#F0EAE0] leading-snug mb-2">
              &ldquo;{insight.headline || "Don't quit — test quietly."}&rdquo;
            </h3>
            <p className="text-xs font-light text-[#8A8070] leading-relaxed">
              {insight.body ||
                "What you're describing isn't a lack of ability — it's a nervous system response to perceived risk. The antidote is evidence."}
            </p>
          </div>

          {insight.steps && insight.steps.length > 0 && (
            <div className="pt-3 border-t border-[rgba(201,169,110,0.14)] space-y-2">
              <p className="text-[11px] font-normal text-[#8A8070]">
                Execution sequence:
              </p>
              <ul className="space-y-2">
                {insight.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs font-light text-[#F0EAE0] leading-relaxed"
                  >
                    <span className="text-[#C9A96E] font-serif italic text-xs min-w-[16px]">
                      {idx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 3. Nudge Questions */}
      {insight.nudges && insight.nudges.length > 0 && (
        <div className="space-y-3">
          <div className="text-[11px] font-normal text-[#8A8070] tracking-[0.06em] pb-2 border-b border-[rgba(201,169,110,0.14)]">
            <span>Questions to sit with</span>
          </div>

          <div className="bg-[#1C1914] border border-[rgba(201,169,110,0.14)] rounded-md p-5 divide-y divide-[rgba(201,169,110,0.14)]">
            {insight.nudges.map((q, idx) => (
              <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                <span className="font-serif italic text-base text-[#C9A96E]/80 min-w-[20px] select-none">
                  0{idx + 1}
                </span>
                <p className="font-serif italic text-sm text-[#F0EAE0] leading-relaxed">
                  &ldquo;{q}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

