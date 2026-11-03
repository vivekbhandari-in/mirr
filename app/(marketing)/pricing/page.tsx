"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { FoundingCounter } from "@/components/growth/FoundingCounter";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (tier: string) => {
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        window.location.href = `/signup?tier=${encodeURIComponent(tier)}`;
      }
    } catch {
      window.location.href = `/signup?tier=${encodeURIComponent(tier)}`;
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[1120px] mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-[620px] mx-auto mb-14 space-y-3">
          <Badge variant="primary" dot>
            30-day trial on all features · no card required
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
            Simple, honest pricing.
          </h1>

          <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
            Build your habits and experience clarity first. Upgrade only if Mirr has earned its place in your day.
          </p>

          {/* Billing Toggle (Touch-friendly 44px min-height) */}
          <div className="flex items-center justify-center gap-3 pt-4 min-h-[44px]">
            <span
              onClick={() => setIsYearly(false)}
              className={`text-xs cursor-pointer select-none py-2 transition-colors ${
                !isYearly ? "text-foreground font-medium" : "text-foreground-muted"
              }`}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 h-7 rounded-pill bg-surface-muted border border-border p-1 transition-colors relative flex items-center focus:outline-none focus:border-primary"
              aria-label="Toggle annual billing"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-5 h-5 rounded-pill bg-primary ${
                  isYearly ? "ml-auto" : "mr-auto"
                }`}
              />
            </button>
            <span
              onClick={() => setIsYearly(true)}
              className={`text-xs flex items-center gap-1.5 cursor-pointer select-none py-2 transition-colors ${
                isYearly ? "text-foreground font-medium" : "text-foreground-muted"
              }`}
            >
              Annual
              <Badge variant="primary">Save 42%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-16">
          {/* 1. Free Tier */}
          <div className="bg-surface border border-border rounded-card p-7 flex flex-col justify-between shadow-card">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                Free Forever
              </p>
              <h2 className="text-3xl font-semibold text-foreground mb-2">
                $0
              </h2>
              <p className="text-xs text-foreground-secondary leading-relaxed mb-6">
                Always available. You never lose access to your core mirror or reflection.
              </p>

              <ul className="space-y-3 text-xs text-foreground-secondary pt-4 border-t border-border">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Full survey &amp; personal mirror
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> 3 atomic habits maximum
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Daily reflection &amp; focus timer
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> 7-day consistency history
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Complete data export anytime
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link href="/survey" className="block w-full">
                <Button variant="secondary" size="md" className="w-full">
                  Start for free
                </Button>
              </Link>
            </div>
          </div>

          {/* 2. Pro Tier */}
          <div className="bg-surface border-2 border-primary rounded-card p-7 flex flex-col justify-between relative shadow-modal">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="primary">Most Popular · 30 Days Free</Badge>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-primary mb-2">
                Pro
              </p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <h2 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {isYearly ? "$49" : "$7"}
                </h2>
                <span className="text-xs text-foreground-muted font-mono">
                  {isYearly ? "/year ($4.08/mo)" : "/month"}
                </span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed mb-6">
                For those serious about compounding small actions into permanent identity shift.
              </p>

              <ul className="space-y-3 text-xs text-foreground pt-4 border-t border-border">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Unlimited atomic habits
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Unlimited AI regenerations
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Weekly AI pattern digest
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Full history &amp; consistency archive
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Priority support
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                disabled={loadingTier !== null}
                onClick={() => handleCheckout(isYearly ? "pro_yearly" : "pro_monthly")}
              >
                {loadingTier === (isYearly ? "pro_yearly" : "pro_monthly")
                  ? "Redirecting…"
                  : "Start 30-day free trial"}
              </Button>
              <p className="text-[11px] text-foreground-muted text-center mt-2 font-mono">
                No charge for 30 days · Cancel anytime in 1 click
              </p>
            </div>
          </div>

          {/* 3. Founding Member */}
          <div className="bg-surface border border-border rounded-card p-7 flex flex-col justify-between shadow-card">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-mono uppercase tracking-wider text-foreground-muted">
                  Founding Member
                </p>
                <FoundingCounter initialCount={14} totalSpots={50} />
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <h2 className="text-3xl font-semibold text-foreground">
                  $99
                </h2>
                <span className="text-xs text-foreground-muted font-mono">one-time · lifetime</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed mb-6">
                Lifetime access + direct input into product development.
              </p>

              <ul className="space-y-3 text-xs text-foreground-secondary pt-4 border-t border-border">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Lifetime access to all Pro features
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Never pay a subscription fee
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Permanent Founding Member badge
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Direct line to founders
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary flex-shrink-0" /> Featured on the Wall of Honesty
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                disabled={loadingTier !== null}
                onClick={() => handleCheckout("founding")}
              >
                {loadingTier === "founding"
                  ? "Redirecting…"
                  : "Claim founding membership"}
              </Button>
              <p className="text-[11px] text-foreground-muted text-center mt-2 font-mono">
                Limited to first 50 members
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
