"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { HeroNotebook } from "@/components/marketing/HeroNotebook";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { PricingCard, PricingPlan } from "@/components/ui/PricingCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import {
  ArrowRight,
  Target,
  Sparkles,
  Compass,
  Check,
  Minimize2,
  Calendar,
  AlertTriangle,
  Flame,
  RotateCcw,
} from "lucide-react";

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Quiet, guilt-free momentum for one core commitment.",
    ctaLabel: "Start free — no card needed",
    features: [
      "1 active habit / project track",
      "Daily restart action & recovery engine",
      "2-minute minimum version fallback",
      "Focused session countdown timer",
      "30-day return history log",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$5",
    period: "month",
    description: "Deep recovery insights and up to 3 stacked habits.",
    ctaLabel: "Start 30-day trial",
    highlighted: true,
    popular: true,
    features: [
      "Up to 3 active habits / tracks",
      "Full 52-week consistency archive",
      "Automated Sunday weekly reviews",
      "Personalized return pattern insights",
      "JSON & plaintext data export",
      "Priority recovery updates",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "What happens if I miss a day?",
    answer:
      "Nothing is broken, lost, or stained red. In Mirr, missing a day is normal life—returning is the success event. The restart engine automatically lowers the threshold to a gentle 5-minute or 2-minute version so you come back without pressure.",
  },
  {
    question: "Do I need to track many habits?",
    answer:
      "No. Mirr intentionally limits you to 1 active anchor track at the start, and never more than 3 active habits at once. Cockpit clutter and long checklists dilute focus.",
  },
  {
    question: "Can I use Mirr for a project instead of a habit?",
    answer:
      "Yes. Mirr works seamlessly for software projects, writing, studying, fitness routines, or personal crafts. Any endeavor you fall off and need a way back to fits Mirr.",
  },
  {
    question: "Does Mirr use AI chat?",
    answer:
      "No. Mirr does not have distracting chatbots, avatars, or fake dialogues. It uses a deterministic restart engine that calculates the right action in under 60 seconds.",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes. You own your evidence. You can download all your check-ins and reflections as structured JSON or as a clean markdown/plaintext journal at any time.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can manage or cancel your subscription with one click through the secure Stripe Customer Portal directly from your settings.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-foreground">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* ── 1. HERO SECTION ── */}
        <section className="min-h-[calc(100vh-56px)] grid grid-cols-1 lg:grid-cols-2 border-b border-border">
          {/* Left: Philosophy & CTA */}
          <div className="px-6 py-16 sm:px-12 sm:py-24 lg:py-28 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border max-w-[640px] mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <Badge variant="primary" dot>
                Recovery-First Habit &amp; Focus Product
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.08] tracking-[-0.02em] text-foreground mb-6"
            >
              You don’t need a perfect streak. <br className="hidden sm:inline" />
              <span className="text-primary">You need a way back.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="text-base sm:text-lg text-foreground-secondary leading-relaxed mb-8 max-w-[500px]"
            >
              Mirr helps people who fall off a habit, project, routine, or goal return to it through one small restart action—without guilt, backlog, or starting over.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <Link href="/onboarding">
                <Button variant="primary" size="lg" withCircularArrow>
                  Start free — no credit card
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  Preview dashboard
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className="text-xs text-foreground-muted font-mono"
            >
              Under 90-second onboarding · 1 primary restart per day
            </motion.p>
          </div>

          {/* Right: Real Interactive Product Preview */}
          <div className="bg-surface/50 flex items-center justify-center p-6 sm:p-12 lg:p-14 relative overflow-hidden">
            <HeroNotebook />
          </div>
        </section>

        {/* ── 2. THE PROBLEM SECTION ── */}
        <section className="py-20 px-6 sm:px-8 border-b border-border bg-surface max-w-[1120px] mx-auto w-full">
          <div className="max-w-[700px] mx-auto text-center space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-warning font-semibold block">
              The Flaw In Habit Trackers
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-foreground tracking-tight leading-snug">
              Most productivity apps punish you for being human.
            </h2>
            <p className="text-base text-foreground-secondary leading-relaxed pt-2">
              They show broken streaks, red overdue tasks, and a guilt wall. When you miss three days, the backlog feels overwhelming—so you close the app and never open it again.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-card bg-surface-elevated/50 border border-border space-y-2">
              <span className="text-xs font-mono font-bold text-danger uppercase tracking-wider block">
                Broken Streaks
              </span>
              <h3 className="text-base font-semibold text-foreground">All-or-nothing mindset</h3>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                Missing one day resets a 30-day streak to zero, destroying intrinsic motivation.
              </p>
            </div>

            <div className="p-6 rounded-card bg-surface-elevated/50 border border-border space-y-2">
              <span className="text-xs font-mono font-bold text-warning uppercase tracking-wider block">
                Overdue Red Walls
              </span>
              <h3 className="text-base font-semibold text-foreground">Backlog shame</h3>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                Checklists pile up with dozens of red flags, turning your sanctuary into an anxious inbox.
              </p>
            </div>

            <div className="p-6 rounded-card bg-surface-elevated/50 border border-border space-y-2">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider block">
                The Mirr Way
              </span>
              <h3 className="text-base font-semibold text-foreground">Return is the success</h3>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                We calibrate today&apos;s action to your energy. Returning after drift is the victory.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. HOW MIRR WORKS (THE 3-STEP RECOVERY LOOP) ── */}
        <section id="how-it-works" className="py-24 px-6 sm:px-8 border-b border-border max-w-[1120px] mx-auto w-full">
          <div className="text-center max-w-[600px] mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold block">
              The Recovery Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Fall off. Check in. Return.
            </h2>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Designed to take under 60 seconds each morning to decide your next move.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="lg" className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold">
                1
              </div>
              <CardTitle>Check In</CardTitle>
              <CardDescription>
                Tell Mirr what you are returning to and what got in the way. Zero judgment, zero backlog.
              </CardDescription>
            </Card>

            <Card padding="lg" className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold">
                2
              </div>
              <CardTitle>Restart Small</CardTitle>
              <CardDescription>
                Mirr gives you one small action you can actually do today (2 to 10 minutes), adapted to your energy.
              </CardDescription>
            </Card>

            <Card padding="lg" className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold">
                3
              </div>
              <CardTitle>Return Again</CardTitle>
              <CardDescription>
                Each return builds momentum without shame. Your Return Streak counts how many times you came back.
              </CardDescription>
            </Card>
          </div>
        </section>

        {/* ── 4. FOUR CORE FEATURES ── */}
        <section className="py-24 px-6 sm:px-8 border-b border-border bg-surface-elevated/20 max-w-[1120px] mx-auto w-full">
          <div className="text-center max-w-[600px] mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold block">
              Core Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Built for real human consistency.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">One restart action</h3>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                No overwhelming checklists or endless priorities. Just one clear, protected action for today.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Minimize2 size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">2-minute minimum version</h3>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                A non-negotiable fallback for exhausted days. Showing up for 2 minutes keeps identity alive.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <RotateCcw size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Return Streak</h3>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                We track consecutive returns, not perfection. Coming back after missing 4 days resets your Return Streak to 1.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-card bg-surface border border-border space-y-3 shadow-subtle">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Sunday weekly review</h3>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Synthesizes your return count, main friction, and produces one actionable experiment for next week.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. SOCIAL PROOF (AUTHENTIC EARLY ACCESS PLACEHOLDER) ── */}
        <section className="py-20 px-6 sm:px-8 border-b border-border max-w-[1120px] mx-auto w-full">
          <div className="p-8 sm:p-12 rounded-card bg-surface border border-border shadow-card text-center space-y-4 max-w-[760px] mx-auto">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold block">
              Early Access &amp; Community
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Built with developers, creators, and indie builders.
            </h2>
            <p className="text-sm text-foreground-secondary leading-relaxed max-w-[560px] mx-auto">
              Mirr was conceived after observing hundreds of builders abandon side projects due to streak anxiety. Currently in private beta with early recovery-first practitioners.
            </p>
            <div className="pt-2 flex items-center justify-center gap-6 text-xs font-mono text-foreground-muted">
              <span>· Zero fabricated reviews</span>
              <span>· Real return data</span>
              <span>· Private by default</span>
            </div>
          </div>
        </section>

        {/* ── 6. PRICING SECTION ── */}
        <section id="pricing" className="py-24 px-6 sm:px-8 border-b border-border max-w-[1120px] mx-auto w-full">
          <div className="text-center max-w-[560px] mx-auto mb-16 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold block">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
              Start free. Upgrade for depth.
            </h2>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Your primary daily restart and minimum version are free forever. No credit card required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
            {PRICING_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                onSelect={(id) => {
                  window.location.href = id === "pro" ? "/pricing" : "/onboarding";
                }}
              />
            ))}
          </div>
        </section>

        {/* ── 7. FAQ SECTION ── */}
        <section className="py-24 px-6 sm:px-8 border-b border-border bg-surface-elevated/20 max-w-[1120px] mx-auto w-full">
          <div className="text-center max-w-[560px] mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold block">
              Common Questions
            </span>
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">
              Everything you need to know
            </h2>
          </div>

          <FAQAccordion items={FAQ_ITEMS} />
        </section>

        {/* ── 8. FINAL CTA ── */}
        <section className="py-24 px-6 sm:px-8 text-center max-w-[800px] mx-auto w-full space-y-6">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">
            Fall off. Learn. Return.
          </h2>
          <p className="text-base sm:text-lg text-foreground-secondary max-w-[480px] mx-auto leading-relaxed">
            Take 90 seconds to create your Mirror and log your first small restart today.
          </p>
          <div className="pt-2">
            <Link href="/onboarding">
              <Button variant="primary" size="lg" withCircularArrow>
                Start your first restart
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
