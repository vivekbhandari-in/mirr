"use client";

import Link from "next/link";

export default function HistoryPage() {
  const isPro = false;

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-gold/20 selection:text-ink">
      <header className="bg-white border-b border-paper3 px-6 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="font-serif italic text-lg text-ink">
            Mirr<em className="text-gold2 not-italic">.</em>
          </Link>
          <span className="text-xs text-muted">/ Habit History</span>
        </div>
        <Link href="/dashboard" className="text-xs font-light text-muted hover:text-ink transition-colors">
          ← Dashboard
        </Link>
      </header>

      <main className="max-w-[800px] mx-auto py-10 px-6">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-ink mb-1.5">Your journey in evidence</h1>
          <p className="text-xs font-light text-muted">
            Every check-in is an accumulation of proof that you are becoming who you said you&apos;d be.
          </p>
        </div>

        {/* 7 Recent Days (Free) */}
        <div className="bg-white border border-paper3 rounded-md p-6 sm:p-8 shadow-sm mb-6">
          <p className="text-[10px] font-medium tracking-[0.1em] text-gold2 uppercase mb-4">
            Recent 7 Days
          </p>

          <div className="space-y-3">
            {["Today", "Yesterday", "2 days ago", "3 days ago", "4 days ago", "5 days ago", "6 days ago"].map((d, i) => (
              <div key={d} className="flex items-center justify-between py-2 border-b border-paper3 last:border-0 text-xs">
                <span className="font-medium text-ink">{d}</span>
                <span className="text-gold2 bg-gold2/10 px-2 py-0.5 rounded-sm">
                  {3 - (i % 2)}/3 habits completed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Older Days (Blurred on Free post-trial) */}
        <div className="bg-white border border-paper3 rounded-md p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-medium tracking-[0.1em] text-muted uppercase mb-4">
            Earlier History &amp; Heatmap
          </p>

          <div className="filter blur-[4px] opacity-40 select-none space-y-3 pointer-events-none">
            {["Week 2", "Week 3", "Week 4", "Month 2"].map((w) => (
              <div key={w} className="flex items-center justify-between py-2 border-b border-paper3 text-xs">
                <span>{w}</span>
                <span>18/21 habits completed</span>
              </div>
            ))}
          </div>

          {!isPro && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
              <h2 className="font-serif text-xl text-ink mb-1.5">See your full journey</h2>
              <p className="text-xs font-light text-muted mb-4 max-w-[340px]">
                Your data is never deleted. Upgrade to Pro to unlock unlimited historical heatmaps, trend lines, and weekly review archives.
              </p>
              <Link
                href="/pricing"
                className="text-xs font-medium text-ink bg-gold hover:bg-gold2 px-6 py-2.5 rounded-sm transition-colors shadow-sm"
              >
                Unlock full history — $7/mo
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

