"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "GROW30";
  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : `https://mirr.app/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-gold/20 selection:text-ink">
      {/* Topbar */}
      <header className="bg-white border-b border-paper3 px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-serif italic text-lg text-ink">
          Mirr<em className="text-gold2 not-italic">.</em>
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-light text-muted hover:text-ink transition-colors"
        >
          ← Back to dashboard
        </Link>
      </header>

      <main className="max-w-[640px] mx-auto py-12 px-6">
        <div className="bg-white border border-paper3 rounded-md p-8 sm:p-10 shadow-sm text-center">
          <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block mb-3 animate-pulse-subtle" />
          <p className="text-[10px] font-medium tracking-[0.1em] text-gold2 uppercase mb-2">
            Referral loop
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-tight mb-3">
            Give 30 days. Get 30 days.
          </h1>

          <p className="text-xs sm:text-sm font-light text-muted leading-relaxed max-w-[460px] mx-auto mb-8">
            When you share Mirr with a friend or colleague, they get 30 days full access with zero credit card risk. When they continue, you get 30 free days added to your account.
          </p>

          {/* Referral link box */}
          <div className="bg-paper border border-paper3 rounded-sm p-4 text-left mb-6">
            <label className="block text-[10px] font-medium uppercase tracking-[0.06em] text-muted mb-1.5">
              Your unique invite link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralUrl}
                className="w-full bg-white border border-paper3 rounded-sm px-3 py-2 text-xs text-ink select-all outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs font-medium bg-gold hover:bg-gold2 text-ink px-4 py-2 rounded-sm flex-shrink-0 transition-colors"
              >
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 gap-4 text-center py-4 border-t border-paper3">
            <div>
              <p className="font-serif text-2xl italic text-ink">0</p>
              <p className="text-[11px] text-faint">Friends joined</p>
            </div>
            <div>
              <p className="font-serif text-2xl italic text-gold2">0</p>
              <p className="text-[11px] text-faint">Free days earned</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

