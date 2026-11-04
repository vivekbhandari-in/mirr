"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Check, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { generateInitialActions } from "@/lib/restart-engine";
import { createClient } from "@/lib/supabase/client";

interface RapidStepConfig {
  number: number;
  title: string;
  question: string;
  hint: string;
  options: { label: string; value: string; desc?: string }[];
}

const ONBOARDING_STEPS: RapidStepConfig[] = [
  {
    number: 1,
    title: "Focus Area",
    question: "What are you returning to?",
    hint: "Choose the practice or goal you fell off and want to rebuild.",
    options: [
      { label: "A project", value: "project", desc: "Code, writing, design, side business" },
      { label: "A habit", value: "habit", desc: "Meditation, reading, journaling, breathwork" },
      { label: "Studying", value: "study", desc: "Courses, exams, reading, research" },
      { label: "Fitness", value: "fitness", desc: "Movement, gym, running, yoga" },
      { label: "A routine", value: "routine", desc: "Morning ritual, evening reset, shutdown" },
      { label: "Something else", value: "other", desc: "A personal craft or quiet commitment" },
    ],
  },
  {
    number: 2,
    title: "The Friction",
    question: "What is stopping you?",
    hint: "Understanding the friction lets Mirr protect you from it.",
    options: [
      { label: "I lose motivation", value: "motivation" },
      { label: "I get distracted", value: "distraction" },
      { label: "I feel overwhelmed", value: "overwhelm" },
      { label: "I forget", value: "forgetting" },
      { label: "I miss days and feel behind", value: "falling_behind" },
      { label: "I don't know", value: "unknown" },
    ],
  },
  {
    number: 3,
    title: "Protected Time",
    question: "How much time can you protect today?",
    hint: "Start small. Returning is what creates momentum, not heroics.",
    options: [
      { label: "2 minutes", value: "2", desc: "Micro threshold for high-friction days" },
      { label: "5 minutes", value: "5", desc: "Quick focused restart" },
      { label: "10 minutes", value: "10", desc: "Calm, grounded daily block" },
      { label: "25 minutes", value: "25", desc: "Full deep-work focus session" },
    ],
  },
];

export function SurveyWizard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0); // 0, 1, 2, or 3 (Summary)
  const [answers, setAnswers] = useState({
    area: "project",
    blocker: "distraction",
    minutes: 10,
    customAreaText: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const curConfig = ONBOARDING_STEPS[stepIndex];

  // Synthesized actions from restart engine
  const synthesized = generateInitialActions(
    answers.area,
    answers.blocker,
    answers.minutes
  );

  const handleSelectOption = (val: string) => {
    if (stepIndex === 0) {
      setAnswers((prev) => ({ ...prev, area: val }));
      setStepIndex(1);
    } else if (stepIndex === 1) {
      setAnswers((prev) => ({ ...prev, blocker: val }));
      setStepIndex(2);
    } else if (stepIndex === 2) {
      setAnswers((prev) => ({ ...prev, minutes: parseInt(val, 10) || 10 }));
      setStepIndex(3); // Go to summary
    }
  };

  const handleStartRestart = async () => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Save to Supabase user_mirrors & plans if logged in
        await supabase.from("user_mirrors").upsert(
          {
            user_id: user.id,
            focus_area: answers.area,
            main_blocker: answers.blocker,
            daily_minutes: answers.minutes,
            desired_identity: synthesized.defaultIdentity,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        // Create initial habit track
        await supabase.from("habits").insert({
          user_id: user.id,
          name: `Daily ${answers.area}`,
          action: synthesized.suggestedAction,
          cue: "Daily protected time",
          minimum_version: synthesized.minimumAction,
          purpose: synthesized.defaultIdentity,
          frequency: "Daily",
          is_active: true,
        });

        // Set onboarded_at on profile
        await supabase
          .from("profiles")
          .update({ onboarded_at: new Date().toISOString() })
          .eq("id", user.id);
      }

      // Store in localStorage for instant offline access
      localStorage.setItem(
        "mirr_local_mirror",
        JSON.stringify({
          desiredIdentity: synthesized.defaultIdentity,
          mainBlocker: answers.blocker,
          dailyProtectedTime: answers.minutes,
          focusArea: answers.area,
          todayAction: {
            title: synthesized.suggestedAction,
            description: `A protected ${answers.minutes}-minute return session to overcome ${answers.blocker}.`,
            minimumVersion: synthesized.minimumAction,
            anchor: "Daily protected time",
            duration: answers.minutes,
          },
        })
      );

      // Navigate straight to dashboard with focus primed
      router.push("/dashboard?focus=true");
    } catch (err) {
      console.error("Onboarding error:", err);
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-foreground-secondary text-sm font-mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Preparing your return…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between items-center p-4 sm:p-8 select-none">
      {/* Top Header */}
      <header className="w-full max-w-[620px] flex items-center justify-between py-4">
        <Link href="/" className="inline-flex items-center" aria-label="Mirr Home">
          <Logo size="sm" showText />
        </Link>

        <span className="font-mono text-xs text-foreground-secondary">
          {stepIndex < 3 ? `Step ${stepIndex + 1} of 3` : "Your Mirror"}
        </span>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-[620px] my-auto">
        <AnimatePresence mode="wait">
          {stepIndex < 3 ? (
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-surface border border-border rounded-card p-6 sm:p-10 shadow-card space-y-6"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold block">
                  {curConfig.title}
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
                  {curConfig.question}
                </h1>
                <p className="text-xs sm:text-[13px] text-foreground-secondary leading-relaxed">
                  {curConfig.hint}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {curConfig.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className="p-4 rounded-xl text-left border border-border bg-surface-elevated/40 hover:bg-surface-elevated hover:border-primary/50 transition-all duration-150 flex flex-col justify-between group active:scale-[0.99] cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {opt.label}
                    </span>
                    {opt.desc && (
                      <span className="text-xs text-foreground-secondary pt-1 leading-snug">
                        {opt.desc}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Back navigation */}
              {stepIndex > 0 && (
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                    onClick={() => setStepIndex((prev) => prev - 1)}
                  >
                    Back
                  </Button>
                  <span className="text-[11px] font-mono text-foreground-muted">
                    Takes under 90 seconds
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            /* ── STEP 4: SYNTHESIZED MIRROR SUMMARY ── */
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-surface border border-border rounded-card p-6 sm:p-10 shadow-card space-y-6"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
                    Your Mirror Synthesized
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                  Your way back is ready.
                </h1>
              </div>

              <div className="p-5 rounded-xl bg-surface-elevated border border-border space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-foreground-muted font-mono text-xs">Returning to:</span>
                  <span className="font-semibold text-foreground capitalize">{answers.area}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-foreground-muted font-mono text-xs">Main blocker:</span>
                  <span className="font-semibold text-foreground capitalize">{answers.blocker}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-foreground-muted font-mono text-xs">Protected today:</span>
                  <span className="font-semibold text-foreground">{answers.minutes} minutes</span>
                </div>
              </div>

              {/* Today's Restart Preview */}
              <div className="p-5 rounded-xl bg-primary-soft border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles size={14} />
                  <span>Today&apos;s Single Restart</span>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {synthesized.suggestedAction}
                </p>
                <p className="text-xs text-foreground-secondary leading-relaxed">
                  2-minute fallback: {synthesized.minimumAction}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  withCircularArrow
                  className="w-full sm:w-auto flex-1"
                  disabled={submitting}
                  onClick={handleStartRestart}
                >
                  {submitting ? "Opening sanctuary…" : `Start ${answers.minutes}-minute restart`}
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setStepIndex(0)}
                  className="text-foreground-muted"
                >
                  Adjust
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[620px] text-center py-4">
        <p className="text-[11px] text-foreground-muted font-mono">
          Private &amp; distraction-free · Mirr recovery-first companion
        </p>
      </footer>
    </div>
  );
}
