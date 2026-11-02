"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSurveyStore, SurveyAnswers } from "@/stores/useSurveyStore";

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
      <div className="min-h-screen bg-ink flex items-center justify-center p-4">
        <div className="font-serif italic text-gold text-base animate-pulse-subtle">
          Entering the quiet…
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

  const progressPercent = Math.round(((step + 1) / SURVEY_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-[#110F0D] text-paper flex flex-col items-center justify-between px-4 py-8 sm:py-14 selection:bg-gold/25 selection:text-paper relative overflow-hidden">
      {/* ── THE ENLIGHTENMENT DOORWAY (BACKGROUND LIGHT SHAFT) ── */}
      <div 
        className="doorway-light-shaft absolute inset-x-0 top-0 h-[640px] pointer-events-none z-0 animate-doorway-breathe"
        aria-hidden="true"
      />

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-ink3 text-paper text-xs font-light px-5 py-3 rounded-sm border-l-2 border-gold shadow-2xl transition-all duration-300 pointer-events-none ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {toastMsg}
      </div>

      {/* ── MINIMAL TOPBAR WITH STEP COUNTER ── */}
      <header className="w-full max-w-[620px] relative z-10 flex flex-col items-center mb-6">
        <Link
          href="/"
          className="font-serif text-[20px] text-paper tracking-[-0.01em] hover:text-white transition-colors mb-5 group inline-flex items-center gap-1"
        >
          <span>Mirr</span>
          <span className="text-gold italic font-serif">.</span>
        </Link>

        {/* Streamlined Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between items-center text-[11px] text-faint mb-2 px-0.5">
            <span className="font-mono text-gold/90 font-medium">
              0{step + 1} <span className="text-faint/60">/ 06</span>
            </span>
            <span className="tracking-wider uppercase text-[10px] text-faint">
              {curConfig.area}
            </span>
          </div>

          <div className="w-full bg-ink3/70 h-[1.5px] overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-gold2 to-gold"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      {/* ── THE SANCTUARY CARD ── */}
      <main className="w-full max-w-[620px] relative z-10 my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-[#181512]/95 border border-rule2/75 rounded-[4px] p-7 sm:p-10 sanctuary-card-glow relative overflow-hidden backdrop-blur-xl"
          >
            {/* Top gold highlight line */}
            <div 
              className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" 
              aria-hidden="true" 
            />

            {/* Simple Step Eyebrow */}
            <div className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] text-gold uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Step {step + 1} of 6 — {curConfig.area}</span>
            </div>

            {/* Primary Reflective Question */}
            <h1 className="font-serif text-[26px] sm:text-[30px] text-paper leading-[1.25] tracking-[-0.015em] mb-2 font-normal">
              {curConfig.question}
            </h1>

            {/* Compassionate Hint */}
            <p className="text-xs sm:text-[13px] font-light italic text-gold/80 leading-relaxed mb-6">
              {curConfig.hint}
            </p>

            {/* Interactive Chips (when applicable) */}
            {curConfig.chips && (
              <div className="flex flex-wrap gap-2 mb-6">
                {curConfig.chips.map((chip) => {
                  const isSelected = currentText === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className={`text-xs px-3.5 py-1.5 rounded-sm border transition-all duration-200 tracking-[0.02em] select-none ${
                        isSelected
                          ? "border-gold text-paper bg-gold/15 shadow-[0_0_12px_rgba(201,169,110,0.2)] font-medium"
                          : "border-rule2 text-faint hover:border-gold/60 hover:text-paper bg-ink2/60"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Elevated Editorial Journal Input */}
            <div className="relative mb-6 group">
              <div className="w-full bg-[#141210]/90 hover:bg-[#141210] border border-rule2/80 focus-within:border-gold/80 focus-within:shadow-[0_0_30px_-5px_rgba(201,169,110,0.18)] rounded-[4px] p-5 sm:p-6 transition-all duration-300 relative shadow-inner">
                {/* Subtle opening quotation accent */}
                <span className="font-serif italic text-2xl text-gold/30 absolute left-4 sm:left-5 top-3.5 select-none pointer-events-none">
                  “
                </span>

                <textarea
                  value={currentText}
                  onChange={handleTextChange}
                  placeholder={curConfig.placeholder}
                  rows={4}
                  className="w-full bg-transparent border-none pl-6 sm:pl-7 pr-2 py-0 font-serif text-[18px] sm:text-[20px] text-paper placeholder:text-muted/35 placeholder:font-serif placeholder:italic placeholder:text-[17px] sm:placeholder:text-[19px] outline-none resize-none leading-[1.85] tracking-[-0.01em] caret-gold selection:bg-gold/30 selection:text-white block min-h-[130px]"
                />

                {/* Subtle closing quotation accent */}
                {currentText.length > 0 && (
                  <span className="font-serif italic text-2xl text-gold/30 inline-block ml-1 select-none pointer-events-none">
                    ”
                  </span>
                )}
              </div>

              {/* Adaptive Contemplative Microcopy */}
              <div className="flex justify-between items-center mt-2.5 px-1 text-[11px] text-faint font-light">
                <span className="transition-colors duration-300">
                  {currentText.length === 0
                    ? "Take a breath. Write what is true, not what sounds impressive."
                    : currentText.length < 40
                    ? "Keep going. Let the unfiltered thought out…"
                    : "Honest reflection captured."}
                </span>
                <span className="font-mono text-[10px] text-faint/70">
                  {currentText.length} chars
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center pt-2">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-xs font-light text-faint hover:text-paper tracking-[0.04em] transition-colors py-2 px-1"
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="text-xs sm:text-[13px] font-medium text-ink bg-gold hover:bg-gold2 px-7 py-2.5 sm:py-3 rounded-sm tracking-[0.03em] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  "Synthesizing your mirror…"
                ) : step === SURVEY_STEPS.length - 1 ? (
                  "See my mirror"
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── FOOTER PRIVACY NOTE ── */}
      <footer className="w-full max-w-[620px] relative z-10 text-center mt-6">
        <p className="text-[11px] font-light text-faint tracking-wide leading-relaxed">
          Your answers are private. Mirr never shares or sells your personal reflections.
        </p>
      </footer>
    </div>
  );
}
