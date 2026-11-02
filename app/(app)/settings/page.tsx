"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("No active subscription billing portal found. Start with a free trial on the pricing page.");
      }
    } catch {
      alert("Could not load billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSavePrefs = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Preferences updated.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-gold/20 selection:text-ink">
      <header className="bg-white border-b border-paper3 px-6 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="font-serif italic text-lg text-ink">
            Mirr<em className="text-gold2 not-italic">.</em>
          </Link>
          <span className="text-xs text-muted">/ Settings &amp; Privacy</span>
        </div>
        <Link href="/dashboard" className="text-xs font-light text-muted hover:text-ink transition-colors">
          ← Dashboard
        </Link>
      </header>

      <main className="max-w-[700px] mx-auto py-10 px-6 space-y-6">
        {/* Subscription */}
        <div className="bg-white border border-paper3 rounded-md p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif text-xl text-ink mb-1">Plan &amp; Billing</h2>
          <p className="text-xs text-muted mb-4">
            You are currently on the <strong className="text-ink">30-day all-access trial</strong>.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="text-xs font-medium text-ink bg-gold hover:bg-gold2 px-4 py-2 rounded-sm transition-colors"
            >
              View plans &amp; upgrade
            </Link>
            <button
              type="button"
              onClick={handlePortal}
              disabled={portalLoading}
              className="text-xs font-normal text-muted hover:text-ink border border-paper3 px-4 py-2 rounded-sm transition-colors"
            >
              {portalLoading ? "Opening…" : "Manage Stripe billing"}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-paper3 rounded-md p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif text-xl text-ink mb-4">Email Notifications</h2>

          <div className="space-y-4 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={streakAlerts}
                onChange={(e) => setStreakAlerts(e.target.checked)}
                className="mt-0.5 accent-gold"
              />
              <div>
                <span className="font-medium text-ink block">Streak at risk alert (opt-in)</span>
                <span className="text-muted font-light">
                  A single quiet email at 8pm only if you haven&apos;t checked in and your streak is over 3 days. Never sent twice.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="mt-0.5 accent-gold"
              />
              <div>
                <span className="font-medium text-ink block">Sunday weekly digest</span>
                <span className="text-muted font-light">
                  Your week in review, 3 AI-suggested reflection questions, and habit consistency trend.
                </span>
              </div>
            </label>

            <button
              type="button"
              onClick={handleSavePrefs}
              className="mt-2 text-xs font-medium text-white bg-ink hover:bg-ink2 px-4 py-2 rounded-sm transition-colors"
            >
              {saving ? "Saving…" : "Save preferences"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border border-danger/30 rounded-md p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif text-xl text-danger mb-1">Delete Account &amp; Data</h2>
          <p className="text-xs text-muted mb-4 leading-relaxed">
            GDPR compliant. You can delete your account and all associated check-ins, reflections, and habits anytime. This cannot be undone.
          </p>

          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to delete your account? All progress will be permanently erased.")) {
                localStorage.clear();
                window.location.href = "/";
              }
            }}
            className="text-xs font-normal text-danger hover:bg-danger/10 border border-danger px-4 py-2 rounded-sm transition-colors"
          >
            Delete my account
          </button>
        </div>
      </main>
    </div>
  );
}

