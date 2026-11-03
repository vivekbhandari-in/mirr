"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { HeroNotebook } from "@/components/marketing/HeroNotebook";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { ArrowRight, Target, ScanFace, Compass, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-foreground">
      <Navbar />

      <main className="flex-1 pt-[56px]">
        {/* ── 1. HERO SECTION ── */}
        <section className="min-h-[calc(100vh-56px)] grid grid-cols-1 lg:grid-cols-2 border-b border-border">
          {/* Left Column: Headline & Value Proposition */}
          <div className="px-6 py-16 sm:px-12 sm:py-24 lg:py-28 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border max-w-[620px] mx-auto lg:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6"
            >
              <Badge variant="primary" dot>
                Personal Identity System · Private &amp; Quiet
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="text-[34px] sm:text-[46px] lg:text-[54px] font-semibold leading-[1.08] tracking-[-0.02em] text-foreground mb-6"
            >
              Become the person you keep saying you’ll become.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="text-base sm:text-lg text-foreground-secondary leading-relaxed mb-8 max-w-[500px]"
            >
              Mirr turns your intention into one daily proof—and helps you return when you drift. No guilt, no shame, and no gamified noise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3 mb-8"
            >
              <Link href="/survey">
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  Start for free
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  Preview sanctuary
                </Button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.2 }}
              className="text-xs text-foreground-muted font-mono"
            >
              No credit card required · Data stays private on your machine
            </motion.p>
          </div>

          {/* Right Column: Real Product Preview */}
          <div className="bg-surface/50 flex items-center justify-center p-6 sm:p-12 lg:p-14 relative overflow-hidden">
            <HeroNotebook />
          </div>
        </section>

        {/* ── 2. THREE QUIET STEPS ── */}
        <section id="how-it-works" className="py-20 px-6 sm:px-8 border-b border-border max-w-[1120px] mx-auto w-full">
          <div className="text-center max-w-[580px] mx-auto mb-16 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary block">
              How Mirr Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              One focal point. Zero cockpit clutter.
            </h2>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Traditional habit trackers overwhelm you with lists and punish you for missing days. Mirr is designed around self-respect.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <Card padding="lg" className="space-y-3">
              <div className="w-10 h-10 rounded-card-sm bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                <ScanFace size={20} />
              </div>
              <span className="text-[11px] font-mono text-primary uppercase block">
                01 · Identity Synthesis
              </span>
              <CardTitle>Define who you want to become</CardTitle>
              <CardDescription>
                A quiet 3-minute diagnostic helps you articulate your desired future, your honest obstacles, and the anti-future you refuse to become.
              </CardDescription>
            </Card>

            {/* Step 2 */}
            <Card padding="lg" className="space-y-3">
              <div className="w-10 h-10 rounded-card-sm bg-success/10 text-success border border-success/20 flex items-center justify-center">
                <Target size={20} />
              </div>
              <span className="text-[11px] font-mono text-success uppercase block">
                02 · The Daily Hero
              </span>
              <CardTitle>Protect one proof per day</CardTitle>
              <CardDescription>
                Everything in the sanctuary supports today’s one action. It comes with a clear anchor and a minimum version that is too small to fail.
              </CardDescription>
            </Card>

            {/* Step 3 */}
            <Card padding="lg" className="space-y-3">
              <div className="w-10 h-10 rounded-card-sm bg-recovery/10 text-recovery border border-recovery/20 flex items-center justify-center">
                <Compass size={20} />
              </div>
              <span className="text-[11px] font-mono text-recovery uppercase block">
                03 · Friction &amp; Recovery
              </span>
              <CardTitle>Return without shame</CardTitle>
              <CardDescription>
                A missed day is normal friction, not a moral failure. Mirr detects drift and provides a 5-minute micro action to bring you back immediately.
              </CardDescription>
            </Card>
          </div>
        </section>

        {/* ── 3. HONEST MEMBER COMMITMENTS ── */}
        <section className="py-20 px-6 sm:px-8 border-b border-border max-w-[1120px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-primary block">
                Wall of Honesty
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
                Real commitments. No fake reviews.
              </h2>
            </div>

            <Link href="/wall">
              <Button variant="ghost" size="sm" iconRight={ArrowRight}>
                View all commitments
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="md" className="space-y-4">
              <p className="text-sm text-foreground-secondary leading-relaxed italic">
                “I circled the same startup idea for eight months. The mirror showed me I was afraid of looking foolish if I shipped. Protecting 25 minutes before morning standup changed everything.”
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Karan S.</span>
                <span className="text-foreground-muted font-mono">Full-stack dev</span>
              </div>
            </Card>

            <Card padding="md" className="space-y-4">
              <p className="text-sm text-foreground-secondary leading-relaxed italic">
                “Other apps made me feel guilty whenever I had a crazy work week. Mirr told me: ‘You drifted. That does not erase your progress. Here is a 5-minute way back.’ That saved my momentum.”
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Elena V.</span>
                <span className="text-foreground-muted font-mono">Product designer</span>
              </div>
            </Card>

            <Card padding="md" className="space-y-4">
              <p className="text-sm text-foreground-secondary leading-relaxed italic">
                “The minimum version rule is pure psychology. Writing just one function kept my streak alive when my brain was completely fried after exams.”
              </p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Marcus T.</span>
                <span className="text-foreground-muted font-mono">CS Student</span>
              </div>
            </Card>
          </div>
        </section>

        {/* ── 4. TRANSPARENT PRICING SUMMARY ── */}
        <section className="py-20 px-6 sm:px-8 border-b border-border max-w-[1120px] mx-auto w-full text-center space-y-8">
          <div className="max-w-[540px] mx-auto space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary block">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
              Start free. Upgrade only if it earns its place.
            </h2>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Your core identity mirror and daily proof action remain free forever. No credit card required.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/survey">
              <Button variant="primary" size="lg">
                Start for free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="lg">
                View all pricing tiers
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
