"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export default function LaunchPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/launch/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "producthunt" }),
      });
      if (res.ok) {
        setSubscribed(true);
      }
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col selection:bg-gold/20 selection:text-paper">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[800px] mx-auto w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.1em] text-gold uppercase bg-gold/10 px-3 py-1 rounded-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-subtle" />
          Product Hunt Launch Deal · 40% Off Pro Forever
        </div>

        <h1 className="font-serif text-[clamp(36px,5vw,60px)] text-paper leading-[1.08] tracking-[-0.02em] mb-4">
          Mirr is launching on <span className="italic text-gold">Product Hunt.</span>
        </h1>

        <p className="text-sm sm:text-base font-light text-muted leading-relaxed max-w-[560px] mx-auto mb-10">
          We&apos;re giving Product Hunt supporters an exclusive 40% lifetime discount on Pro, plus immediate access to our 30-day card-free trial.
        </p>

        {/* Upvote CTA Card */}
        <div className="bg-ink2 border border-rule rounded-md p-8 sm:p-10 mb-10 shadow-xl max-w-[560px] mx-auto">
          <h2 className="font-serif text-xl sm:text-2xl text-paper mb-2">
            Get notified the moment we go live
          </h2>
          <p className="text-xs font-light text-muted mb-6 leading-relaxed">
            Drop your email to receive our launch link, direct discount code, and day-one community perks.
          </p>

          {subscribed ? (
            <div className="p-4 bg-gold/10 border border-gold/30 rounded-sm text-xs text-gold">
              ✓ You&apos;re on the launch list! We&apos;ll email you when the PH listing goes live.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-[420px] mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-ink3 border border-rule2 rounded-sm px-3.5 py-2.5 text-xs text-paper placeholder:text-muted/40 focus:outline-none focus:border-gold font-sans"
              />
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-5 rounded-sm bg-gold hover:bg-gold2 text-ink text-xs font-medium tracking-[0.02em] transition-colors flex-shrink-0 disabled:opacity-50"
              >
                {loading ? "Saving…" : "Notify me"}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-rule flex items-center justify-center gap-6 text-xs text-faint">
            <div className="flex items-center gap-2">
              <span className="text-gold">★</span>
              <span>40% off Pro for life</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold">★</span>
              <span>Founding badge</span>
            </div>
          </div>
        </div>

        <div>
          <Link
            href="/survey"
            className="text-xs text-gold hover:underline"
          >
            Or start building your mirror right now →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

