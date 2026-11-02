"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReflectionsPage() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("weekly");
  const isPro = false; // Soft paywall check for AI analysis of week

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-gold/20 selection:text-ink">
      {/* Topbar */}
      <header className="bg-white border-b border-paper3 px-6 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="font-serif italic text-lg text-ink">
            Mirr<em className="text-gold2 not-italic">.</em>
          </Link>
          <span className="text-xs text-muted">/ Reflections &amp; Reviews</span>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-light text-muted hover:text-ink transition-colors"
        >
          ← Dashboard
        </Link>
      </header>

      <main className="max-w-[800px] mx-auto py-10 px-6">
        {/* Toggle */}
        <div className="flex gap-4 border-b border-paper3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("weekly")}
            className={`pb-3 text-xs tracking-wider uppercase transition-colors border-b-2 font-medium ${
              activeTab === "weekly"
                ? "border-gold2 text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Weekly Review
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("daily")}
            className={`pb-3 text-xs tracking-wider uppercase transition-colors border-b-2 font-medium ${
              activeTab === "daily"
                ? "border-gold2 text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            Daily Archive
          </button>
        </div>

        {activeTab === "weekly" ? (
          <div className="space-y-6">
            {/* Free: Your week in numbers */}
            <div className="bg-white border border-paper3 rounded-md p-6 sm:p-8 shadow-sm">
              <p className="text-[10px] font-medium tracking-[0.1em] text-gold2 uppercase mb-2">
                Weekly Summary
              </p>
              <h2 className="font-serif text-2xl text-ink mb-6">
                Your week in numbers
              </h2>

              <div className="grid grid-cols-3 gap-4 text-center py-4 bg-paper rounded-sm border border-paper3 mb-6">
                <div>
                  <p className="font-serif text-3xl italic text-ink">14</p>
                  <p className="text-[11px] text-muted mt-1">Check-ins completed</p>
                </div>
                <div>
                  <p className="font-serif text-3xl italic text-gold2">85%</p>
                  <p className="text-[11px] text-muted mt-1">Completion rate</p>
                </div>
                <div>
                  <p className="font-serif text-3xl italic text-ink">6</p>
                  <p className="text-[11px] text-muted mt-1">Active days</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-muted leading-relaxed">
                <p>
                  <strong className="text-ink font-medium">Strongest cue:</strong> Right after morning coffee (100% adherence).
                </p>
                <p>
                  <strong className="text-ink font-medium">Primary obstacle recorded:</strong> &ldquo;Low energy after evening commute.&rdquo;
                </p>
              </div>
            </div>

            {/* Soft Paywall Moment 3: AI analysis of your patterns */}
            <div className="bg-white border border-paper3 rounded-md p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-medium tracking-[0.1em] text-gold2 uppercase">
                  AI Behavioral Analysis
                </p>
                <span className="text-[10px] bg-gold/15 text-gold2 px-2 py-0.5 rounded-sm font-medium">
                  Pro Feature
                </span>
              </div>

              <h3 className="font-serif text-xl text-ink mb-3">
                Subtle patterns detected in your week
              </h3>

              {isPro ? (
                <p className="text-xs text-muted leading-relaxed">
                  You consistently skip evening habits when your morning deep work block runs over 40 minutes. Try capping the morning session to preserve evening bandwidth.
                </p>
              ) : (
                <div className="relative">
                  <div className="filter blur-[4px] select-none text-xs text-muted leading-relaxed space-y-2 opacity-60">
                    <p>
                      Your cognitive fatigue correlates strongly with late-night phone usage. On days when you completed the sleep anchor habit, your morning intention consistency jumped by 42%.
                    </p>
                    <p>
                      Consider adjusting your evening cue from &lsquo;before Netflix&rsquo; to &lsquo;right after dinner&rsquo; to avoid the decision fatigue cliff.
                    </p>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-4 text-center">
                    <p className="font-serif italic text-base text-ink mb-2">
                      Unlock AI analysis of your week.
                    </p>
                    <p className="text-xs text-muted mb-4 max-w-[360px]">
                      Claude analyzes your reflections, missed cues, and checkin times to surface invisible behavioral loops.
                    </p>
                    <Link
                      href="/pricing"
                      className="text-xs font-medium text-ink bg-gold hover:bg-gold2 px-5 py-2.5 rounded-sm transition-all shadow-sm"
                    >
                      Upgrade to Pro — $7/mo
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-paper3 rounded-md p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-ink mb-4">Daily reflections archive</h2>
            <div className="divide-y divide-paper3 text-xs text-muted">
              <div className="py-4">
                <p className="text-[11px] font-medium text-ink mb-1">Today</p>
                <p className="italic">&ldquo;Felt resistant at 9am, but did the 2-minute minimum and got into flow.&rdquo;</p>
              </div>
              <div className="py-4">
                <p className="text-[11px] font-medium text-ink mb-1">Yesterday</p>
                <p className="italic">&ldquo;Stayed off phone during breakfast. Surprising amount of headspace.&rdquo;</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

