"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSurveyStore, SurveyAnswers } from "@/stores/useSurveyStore";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

interface SurveyStepConfig {
  key: keyof SurveyAnswers;
  area: string;
  question: string;
  hint: string;
  placeholder: string;
  chips: string[] | null;
}

const SURVEY_STEPS: SurveyStepConfig[] = [
  {
    key: "area",
    area: "Life area",
    question: "What area of life do you most want to improve?",
    hint: "Choose what creates the most silent friction when your head hits the pillow.",
    placeholder: "Describe the specific area in your own words…",
    chips: [
      "Career & work",
      "Discipline & focus",
      "Health & energy",
      "Confidence",
      "Relationships",
      "Daily routine",
      "Finances",
      "Personal growth",
    ],
  },
  {
    key: "problem",
    area: "Your reality",
    question: "What problem are you facing right now?",
    hint: "Be specific and honest. No one else will ever read this.",
    placeholder: "The thing I keep running into is…",
    chips: null,
  },
  {
    key: "future_vision",
    area: "Your future",
    question: "What do you want your life to look like in 1–2 years?",
    hint: "Not the safe, compromised answer. The real one.",
    placeholder: "In two years, I want my days to be…",
    chips: null,
  },
  {
    key: "blocker",
    area: "The blocker",
    question: "What's stopping you?",
    hint: "One core obstacle — the root from which the excuses grow.",
    placeholder: "If I'm honest, what's really stopping me is…",
    chips: null,
  },
  {
    key: "routine",
    area: "Your routine",
    question: "What does your current daily routine look like?",
    hint: "Morning to night — honest observation without self-criticism.",
    placeholder: "I usually wake up at… and spend my days…",
    chips: null,
  },
  {
    key: "time_available",
    area: "Available time",
    question: "How much time can you realistically give each day?",
    hint: "10 minutes of consistency will always beat two hours of chaotic willpower.",
    placeholder: "I can realistically protect…",
    chips: [
      "5–10 minutes",
      "15–20 minutes",
      "30 minutes",
      "1 hour",
      "More than 1 hour",
    ],
  },
];

export function SurveyWizard() {
  const router = useRouter();
  const { step, answers, setStep, setAnswer } = useSurveyStore();
  const [mounted, setMounted] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const curConfig = SURVEY_STEPS[step];

  useEffect(() => {
    if (mounted && curConfig) {
      setCurrentText(answers[curConfig.key] || "");
    }
  }, [step, mounted, curConfig, answers]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-3 select-none">
        <Logo size="md" showText={false} className="animate-pulse" />
        <div className="font-mono text-xs text-foreground-muted flex items-center gap-2">
          <span>Entering the quiet…</span>
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  const handleChipClick = (val: string) => {
    setAnswer(curConfig.key, val);
    setCurrentText(val);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
    setAnswer(curConfig.key, e.target.value);
  };

  const handleNext = async () => {
    const val = currentText.trim();
    if (!val) {
      showToast("Please answer before continuing");
      return;
    }

    setAnswer(curConfig.key, val);

    if (step < SURVEY_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      try {
        const finalAnswers = {
          ...answers,
          [curConfig.key]: val,
          completedAt: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
          localStorage.setItem("mirror_survey", JSON.stringify(finalAnswers));
        }

        const res = await fetch("/api/survey/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalAnswers),
        });

        if (res.ok) {
          const data = await res.json();
          router.push(`/dashboard?new=true${data.planId ? `&planId=${data.planId}` : ""}`);
        } else {
          router.push("/dashboard?new=true&local=true");
        }
      } catch (err) {
        console.error("Survey submission error:", err);
        router.push("/dashboard?new=true&local=true");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-between px-4 py-8 sm:py-12 selection:bg-primary/20 select-none">
      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-surface text-foreground text-xs font-mono px-4 py-2.5 rounded-btn border-l-2 border-primary border-y border-r border-border shadow-modal transition-all duration-150 pointer-events-none ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {toastMsg}
      </div>

      {/* Top Header */}
      <header className="w-full max-w-[620px] flex items-center justify-between mb-8 select-none">
        <Link
          href="/"
          className="flex items-center"
          aria-label="Mirr Home"
        >
          <Logo size="sm" showText />
        </Link>

        {/* Minimal Progress Indicator */}
        <span className="font-mono text-xs text-foreground-secondary">
          Question {step + 1} of {SURVEY_STEPS.length}
        </span>
      </header>

      {/* Main Conversation Container */}
      <main className="w-full max-w-[620px] my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-surface border border-border rounded-card p-6 sm:p-10 shadow-card space-y-6"
          >
            {/* Step Question */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-primary block">
                {curConfig.area}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground leading-snug">
                {curConfig.question}
              </h1>
              <p className="text-xs sm:text-[13px] text-foreground-secondary leading-relaxed">
                {curConfig.hint}
              </p>
            </div>

            {/* Interactive Chips (if present) */}
            {curConfig.chips && (
              <div className="flex flex-wrap gap-2 pt-1">
                {curConfig.chips.map((chip) => {
                  const isSelected = currentText === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className={`text-xs px-3.5 py-1.5 rounded-btn border transition-colors ${
                        isSelected
                          ? "bg-primary-soft border-primary text-foreground font-medium"
                          : "bg-surface-muted border-border text-foreground-secondary hover:text-foreground hover:bg-surface-elevated"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Generous Text Input */}
            <div className="pt-2">
              <textarea
                rows={4}
                value={currentText}
                onChange={handleTextChange}
                placeholder={curConfig.placeholder}
                className="w-full bg-surface-muted text-foreground border border-border rounded-input p-3.5 text-sm placeholder:text-foreground-muted outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary-soft resize-none leading-relaxed"
                autoFocus
              />
            </div>

            {/* Reassuring Helper Text & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-[11px] text-foreground-muted font-light italic">
                “There are no wrong answers.”
              </p>

              <div className="flex items-center gap-3">
                {step > 0 && (
                  <Button
                    variant="ghost"
                    size="md"
                    icon={ArrowLeft}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}

                <Button
                  variant="primary"
                  size="md"
                  disabled={submitting}
                  iconRight={ArrowRight}
                  onClick={handleNext}
                >
                  {submitting
                    ? "Synthesizing…"
                    : step === SURVEY_STEPS.length - 1
                    ? "Generate Personal Mirror"
                    : "Continue"}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-[620px] text-center pt-8">
        <p className="text-[11px] text-foreground-muted font-mono">
          Private session · Your responses are never shared
        </p>
      </footer>
    </div>
  );
}
