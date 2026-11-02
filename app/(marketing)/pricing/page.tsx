"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { FoundingCounter } from "@/components/growth/FoundingCounter";

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
        // Fallback to survey if unconfigured
        window.location.href = "/survey";
      }
    } catch {
      window.location.href = "/survey";
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col selection:bg-gold/20 selection:text-paper">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[1160px] mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-[640px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] font-normal tracking-[0.08em] text-gold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            30-day trial on all features · no card required
          </div>

          <h1 className="font-serif text-[clamp(36px,4.5vw,56px)] text-paper leading-[1.08] tracking-[-0.02em] mb-4">
            Simple, honest <span className="italic text-gold">pricing.</span>
          </h1>

          <p className="text-sm sm:text-base font-light text-muted leading-relaxed">
            Build your habits and experience clarity first. After 30 days, upgrade if Mirr has earned its place in your day.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs transition-colors duration-200 ${!isYearly ? "text-paper font-medium" : "text-faint"}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className="w-12 h-6 rounded-full bg-ink3 border border-rule2 p-0.5 transition-colors relative flex items-center"
              aria-label="Toggle annual billing"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-4 h-4 rounded-full bg-gold ${
                  isYearly ? "ml-auto" : "mr-auto"
                }`}
              />
            </button>
            <span className={`text-xs flex items-center gap-1.5 transition-colors duration-200 ${isYearly ? "text-paper font-medium" : "text-faint"}`}>
              Annual
              <span className="text-[10px] text-gold2 bg-gold/10 border border-gold2/30 px-1.5 py-0.5 rounded-sm">
                Save 42%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid (Staggered Entrance + Micro Hover Lift) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-16"
        >
          {/* 1. Free Tier */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={{ y: -4 }}
            className="bg-ink2 border border-rule hover:border-rule2 rounded-md p-7 flex flex-col justify-between transition-colors shadow-sm"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-faint mb-2">
                Free Forever
              </p>
              <h2 className="font-serif text-3xl text-paper mb-2">
                $0
              </h2>
              <p className="text-xs font-light text-muted leading-relaxed mb-6">
                Always available. You never lose access to your core mirror or reflection.
              </p>

              <ul className="space-y-3 text-xs text-muted pt-4 border-t border-rule">
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Full survey &amp; personal mirror
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> 3 atomic habits maximum
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Daily reflection &amp; focus timer
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> 7-day check-in history
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> 1-time AI plan generation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Complete data export anytime
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/survey"
                className="w-full block text-center py-3 px-4 rounded-sm border border-rule2 text-xs font-medium text-paper hover:border-gold hover:text-gold transition-colors"
              >
                Start for free
              </Link>
            </div>
          </motion.div>

          {/* 2. Pro Tier */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={{ y: -4 }}
            className="bg-ink3 border-2 border-gold rounded-md p-7 flex flex-col justify-between relative shadow-xl"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink text-[10px] font-medium uppercase tracking-wider px-3 py-0.5 rounded-sm">
              Most Popular · 30 Days Free
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-gold mb-2">
                Pro
              </p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <h2 className="font-serif text-3xl sm:text-4xl text-paper">
                  {isYearly ? "$49" : "$7"}
                </h2>
                <span className="text-xs font-light text-faint">
                  {isYearly ? "/year ($4.08/mo)" : "/month"}
                </span>
              </div>
              <p className="text-xs font-light text-muted leading-relaxed mb-6">
                For those serious about compounding small actions into permanent identity shift.
              </p>

              <ul className="space-y-3 text-xs text-paper/85 pt-4 border-t border-rule">
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Unlimited atomic habits
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Unlimited AI regenerations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Weekly AI reflection digest
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Full history + heatmap calendar
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Weekly review with pattern detection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Priority email support
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleCheckout(isYearly ? "pro_yearly" : "pro_monthly")}
                disabled={loadingTier !== null}
                className="w-full text-center py-3 px-4 rounded-sm bg-gold hover:bg-gold2 text-xs font-medium text-ink transition-colors shadow-sm disabled:opacity-50"
              >
                {loadingTier === (isYearly ? "pro_yearly" : "pro_monthly")
                  ? "Redirecting…"
                  : "Start 30-day free trial"}
              </button>
              <p className="text-[10px] text-faint text-center mt-2">
                No charge for 30 days · Cancel anytime in 1 click
              </p>
            </div>
          </motion.div>

          {/* 3. Founding Member */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={{ y: -4 }}
            className="bg-ink2 border border-rule hover:border-rule2 rounded-md p-7 flex flex-col justify-between transition-colors shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-faint">
                  Founding Member
                </p>
                <FoundingCounter initialCount={14} totalSpots={50} />
              </div>

              <div className="flex items-baseline gap-1.5 mb-2">
                <h2 className="font-serif text-3xl text-paper">
                  $49
                </h2>
                <span className="text-xs font-light text-faint">
                  one-time · lifetime
                </span>
              </div>
              <p className="text-xs font-light text-muted leading-relaxed mb-6">
                Limited to the first 50 early adopters. No subscription ever.
              </p>

              <ul className="space-y-3 text-xs text-muted pt-4 border-t border-rule">
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Lifetime access to all Pro features
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Name in the Founding Members wall
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Direct WhatsApp / email line to founder
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Every future update included forever
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold">✓</span> Locks permanently after 50 sales
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleCheckout("founding")}
                disabled={loadingTier !== null}
                className="w-full text-center py-3 px-4 rounded-sm border border-gold text-xs font-medium text-gold hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
              >
                {loadingTier === "founding" ? "Connecting…" : "Claim founding spot — $49"}
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Honest Paywall FAQ */}
        <section className="border-t border-rule pt-14 max-w-[760px] mx-auto">
          <h2 className="font-serif text-2xl text-paper text-center mb-10">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-paper mb-1.5">
                Do I really get 30 days without entering a credit card?
              </h3>
              <p className="text-xs font-light text-muted leading-relaxed">
                Yes. Complete the survey and start building habits immediately. We do not ask for card details up front. We believe you should experience real value before deciding to pay.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-paper mb-1.5">
                What happens on day 31 if I don&apos;t upgrade?
              </h3>
              <p className="text-xs font-light text-muted leading-relaxed">
                Nothing breaks. You keep your full mirror, your top 3 habits, your daily reflection, and complete export of your data. We never delete your entries or hold your habits hostage.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-paper mb-1.5">
                Is my personal reflection private?
              </h3>
              <p className="text-xs font-light text-muted leading-relaxed">
                100%. We never sell your personal data or use your personal answers for ad targeting. Your reflections are for your eyes only.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

