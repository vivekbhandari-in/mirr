"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Share2, ArrowLeft } from "lucide-react";

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "GROW30";
  const referralUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${referralCode}`
      : `https://mirr.app/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      {/* Topbar */}
      <header className="h-14 bg-surface/80 backdrop-blur-md border-b border-border px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <Link href="/dashboard" className="inline-flex items-center gap-2 group">
          <span className="w-6 h-6 rounded-md bg-surface-elevated border border-border flex items-center justify-center text-primary font-mono text-xs font-semibold group-hover:border-primary/50 transition-colors">
            M
          </span>
          <span className="font-sans text-sm font-semibold tracking-tight text-foreground">
            Mirr<span className="text-primary">.</span>
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="text-xs font-mono text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Dashboard</span>
        </Link>
      </header>

      <main className="max-w-[580px] mx-auto py-16 px-6">
        <div className="bg-surface border border-border rounded-modal p-8 sm:p-10 shadow-2xl text-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center mb-4">
            <Share2 size={18} />
          </div>

          <p className="text-[10px] font-mono tracking-widest text-primary uppercase mb-2">
            Referral Circle
          </p>

          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
            Give 30 days. Get 30 days.
          </h1>

          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed max-w-[440px] mx-auto mb-8">
            When you invite an ambitious colleague or friend to Mirr, they get 30 days full access with zero credit card risk. When they begin their contract, you get 30 days added to your account.
          </p>

          {/* Referral link box */}
          <div className="bg-background border border-border rounded-btn p-3.5 text-left mb-6 flex items-center justify-between gap-3">
            <div className="truncate">
              <p className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted mb-0.5">
                Your personal invitation link
              </p>
              <p className="font-mono text-xs text-foreground truncate">{referralUrl}</p>
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 h-9 px-3.5 rounded-btn bg-surface-elevated hover:bg-surface-muted border border-border text-foreground text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-success" />
                  <span className="text-success">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-surface-elevated/50 border border-border/50 rounded-btn">
              <span className="block font-mono text-xl font-bold text-foreground">0</span>
              <span className="text-[11px] text-foreground-muted font-mono">Members invited</span>
            </div>
            <div className="p-3 bg-surface-elevated/50 border border-border/50 rounded-btn">
              <span className="block font-mono text-xl font-bold text-primary">0</span>
              <span className="text-[11px] text-foreground-muted font-mono">Days earned</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
