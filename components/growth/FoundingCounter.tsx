"use client";

import { useEffect, useState } from "react";

interface FoundingCounterProps {
  initialCount?: number;
  totalSpots?: number;
}

export function FoundingCounter({
  initialCount = 14,
  totalSpots = 50,
}: FoundingCounterProps) {
  const [claimed, setClaimed] = useState(initialCount);

  useEffect(() => {
    // Optionally fetch live count from api if available
    fetch("/api/stripe/founding-count")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.count !== undefined) {
          setClaimed(data.count);
        }
      })
      .catch(() => {
        // Fallback to initialCount
      });
  }, []);

  const remaining = Math.max(0, totalSpots - claimed);

  if (remaining === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-faint">
        <span className="w-2 h-2 rounded-full bg-muted" />
        All 50 founding spots claimed
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-gold/10 border border-rule2 text-xs">
      <span className="w-2 h-2 rounded-full bg-gold animate-pulse-subtle" />
      <span className="text-paper font-medium">{remaining} of {totalSpots}</span>
      <span className="text-faint">founding member spots remaining</span>
    </div>
  );
}

