"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Habit, PlanInsight } from "@/types";

// Layout components
import { TopNav } from "./TopNav";
import { LeftRail, DashboardTab } from "./LeftRail";
import { RightSidebar } from "./RightSidebar";

// Tab contents
import { TodayHero } from "./TodayHero";
import { HabitsList } from "./HabitsList";
import { MirrorTab } from "./MirrorTab";
import { ReflectTab } from "./ReflectTab";
import { HistoryTab } from "./HistoryTab";
import { SettingsTab } from "./SettingsTab";

// Supporting modals & banners
import { TrialBanner } from "../paywall/TrialBanner";
import { MirrorBlurGate } from "../paywall/MirrorBlurGate";
import { ShareMirrorModal } from "../growth/ShareMirrorModal";

const DEFAULT_DEMO_SURVEY = {
  area: "Career & work",
  problem:
    "I have been in the same role for two years and feel like I'm executing someone else's vision. I want to build something of my own but keep waiting for the 'right time.'",
  future_vision:
    "In two years I want to be running a small product I built myself, earning enough to have real options.",
  blocker:
    "Honestly, I think I'm afraid of what it means about me if I try and it doesn't work.",
  routine: "Wake up at 7, commute, work 9–6, doom-scroll evenings, sleep late.",
  time_available: "30 minutes",
  completedAt: new Date().toISOString(),
};

const DEFAULT_DEMO_HABITS: Habit[] = [
  {
    id: "habit-0",
    user_id: "demo",
    name: "One deep work block",
    purpose: "Build focused output capacity",
    action: "Work on one meaningful task with phone away for 30 minutes",
    cue: "Right after morning coffee",
    minimum_version: "Just open the task and read it for 2 minutes",
    frequency: "Daily",
    sort_order: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "habit-1",
    user_id: "demo",
    name: "End-of-day capture",
    purpose: "Close mental loops before sleep",
    action: "Write 3 things accomplished + top task for tomorrow",
    cue: "When you close your laptop",
    minimum_version: "Just write the one top task for tomorrow",
    frequency: "Weekdays",
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "habit-2",
    user_id: "demo",
    name: "Evening reflection",
    purpose: "Build self-awareness over time",
    action: "Write 2 sentences — what worked today, what didn't",
    cue: "Before opening Netflix or YouTube",
    minimum_version: "Just write one word describing how today felt",
    frequency: "Daily",
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_DEMO_INSIGHT: PlanInsight = {
  headline: "Don't quit — test quietly.",
  body: "What you're describing isn't a lack of ability — it's a nervous system response to perceived risk. The antidote isn't courage, it's evidence. Small actions that contradict the fear, done consistently, rebuild your self-concept from the inside out.",
  steps: [
    "Identify the smallest physical test of your idea that takes under 30 minutes.",
    "Do that test before touching work email or daily obligations.",
    "Log only what you learned, completely ignoring external validation.",
  ],
  nudges: [
    "What is the exact first micro-action you'd need to take? Not the project — the first 30 seconds.",
    "If the outcome were neutral — just a learning — would you still hesitate?",
    "What story are you telling yourself about why this is harder than it is?",
  ],
};

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function DashboardView() {
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "true";

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("today");
  const [showBlurGate, setShowBlurGate] = useState(isNew);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Toast state (bottom-center, never stacks, replaces immediately, 2.2s auto-dismiss)
  const [toastMsg, setToastMsg] = useState("");
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to main scroll container to scroll to top on tab switch
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Core state
  const [survey, setSurvey] = useState(DEFAULT_DEMO_SURVEY);
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_DEMO_HABITS);
  const [insight, setInsight] = useState<PlanInsight>(DEFAULT_DEMO_INSIGHT);
  const [checks, setChecks] = useState<Record<string, Record<string, boolean>>>({});
  const [reflections, setReflections] = useState<Record<string, any>>({});
  const [streak, setStreak] = useState(3);

  const todayStr = useMemo(() => new Date().toDateString(), []);

  // Load stored state on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const storedSurvey = localStorage.getItem("mirror_survey");
        if (storedSurvey) {
          const parsed = JSON.parse(storedSurvey);
          setSurvey({ ...DEFAULT_DEMO_SURVEY, ...parsed });
        }

        const storedHabits = localStorage.getItem("mirror_habits");
        if (storedHabits) {
          const parsed = JSON.parse(storedHabits);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHabits(parsed);
          }
        }

        const storedChecks = localStorage.getItem("mirror_checks");
        if (storedChecks) {
          setChecks(JSON.parse(storedChecks));
        }

        const storedReflections = localStorage.getItem("mirror_reflections");
        if (storedReflections) {
          setReflections(JSON.parse(storedReflections));
        }

        const storedStreak = localStorage.getItem("mirror_streak");
        if (storedStreak) {
          setStreak(parseInt(storedStreak, 10));
        }

        // Maintain streak based on last active day
        const lastActive = localStorage.getItem("mirror_lastActive");
        if (lastActive && lastActive !== todayStr) {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const newStreak = lastActive === yesterday ? parseInt(storedStreak || "1", 10) + 1 : 1;
          setStreak(newStreak);
          localStorage.setItem("mirror_streak", String(newStreak));
        }
        localStorage.setItem("mirror_lastActive", todayStr);
      } catch (e) {
        console.warn("Error reading stored data:", e);
      }
    }
  }, [todayStr]);

  // Non-stacking 2.2s toast
  const showToast = (msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg("");
    }, 2200);
  };

  // Switch tab and scroll to top with no page reload
  const handleSelectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  };

  const todayChecks = useMemo(() => checks[todayStr] || {}, [checks, todayStr]);
  const completedTodayCount = habits.filter((h) => !!todayChecks[h.id]).length;
  const clarityPct =
    habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  // Optimistic habit toggle
  const handleToggleHabit = (habitId: string, completed: boolean, missedReason?: string) => {
    const updatedToday = { ...todayChecks, [habitId]: completed };
    const updatedChecks = { ...checks, [todayStr]: updatedToday };
    setChecks(updatedChecks);

    if (typeof window !== "undefined") {
      localStorage.setItem("mirror_checks", JSON.stringify(updatedChecks));
    }

    if (completed) {
      showToast("Habit sealed. Keep showing up.");
    }

    // Call background checkin endpoint
    fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        habit_id: habitId,
        date: new Date().toISOString().split("T")[0],
        completed,
        missed_reason: missedReason,
      }),
    }).catch(() => {
      // Offline fallback silent
    });
  };

  const handleUpdateHabit = (updated: Habit) => {
    const nextList = habits.map((h) => (h.id === updated.id ? updated : h));
    setHabits(nextList);
    if (typeof window !== "undefined") {
      localStorage.setItem("mirror_habits", JSON.stringify(nextList));
    }
    showToast("Habit calibrated.");
  };

  const handleSaveReflection = (
    data: { wentWell: string; blockedBy: string; changeNext: string },
    isManual = false
  ) => {
    const updated = {
      ...reflections,
      [todayStr]: { ...data, savedAt: new Date().toISOString() },
    };
    setReflections(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("mirror_reflections", JSON.stringify(updated));
    }

    if (isManual) {
      showToast("Reflection sealed.");
    }

    fetch("/api/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        type: "daily",
        went_well: data.wentWell,
        blocked_by: data.blockedBy,
        change_next: data.changeNext,
      }),
    }).catch(() => {
      // Offline fallback silent
    });
  };

  // Data exports
  const exportJson = () => {
    const data = { exportedAt: new Date().toISOString(), survey, habits, checks, reflections, streak };
    downloadFile(`mirr-sanctuary-${new Date().toISOString().split("T")[0]}.json`, JSON.stringify(data, null, 2), "application/json");
    showToast("JSON exported.");
  };

  const exportText = () => {
    let text = `MIRR SANCTUARY EXPORT\nGenerated: ${new Date().toLocaleString()}\nFocus Area: ${survey.area}\nStreak: ${streak} days\n\nHABITS:\n`;
    habits.forEach((h, idx) => {
      text += `${idx + 1}. ${h.name}\n   Action: ${h.action}\n   Anchor: ${h.cue}\n   Min: ${h.minimum_version}\n\n`;
    });
    text += `RECENT REFLECTIONS:\n`;
    Object.entries(reflections).forEach(([date, ref]: [string, any]) => {
      text += `[${date}]\n`;
      if (ref.wentWell) text += `Went well: ${ref.wentWell}\n`;
      if (ref.blockedBy) text += `Friction: ${ref.blockedBy}\n`;
      if (ref.changeNext) text += `Adjustment: ${ref.changeNext}\n\n`;
    });
    downloadFile(`mirr-journal-${new Date().toISOString().split("T")[0]}.txt`, text, "text/plain");
    showToast("Text journal exported.");
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your local data? This action cannot be undone."
      )
    ) {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      setSurvey(DEFAULT_DEMO_SURVEY);
      setHabits(DEFAULT_DEMO_HABITS);
      setInsight(DEFAULT_DEMO_INSIGHT);
      setChecks({});
      setReflections({});
      setStreak(1);
      showToast("Data cleared.");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#141210] flex items-center justify-center p-4">
        <span className="font-serif italic text-[#C9A96E] text-sm">
          Opening your sanctuary…
        </span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#141210] text-[#F0EAE0] flex flex-col select-text">
      {/* 1. FIXED TOP NAV (52px) */}
      <TopNav
        area={survey.area}
        streak={streak}
        completedTodayCount={completedTodayCount}
        totalHabitsCount={habits.length}
        clarityPct={clarityPct}
        onOpenShare={() => setShowShareModal(true)}
        onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)}
      />

      {/* 2. THREE-PANE SHELL: LEFT RAIL + FLUID EXPANDED MAIN CONTENT + FLUSH RIGHT SIDEBAR */}
      <div className="flex-1 flex overflow-hidden relative w-full">
        {/* Fixed Left Rail (56px) */}
        <LeftRail activeTab={activeTab} onSelectTab={handleSelectTab} />

        {/* Scrollable Main Content (Takes all available horizontal space between rail and right sidebar) */}
        <main
          ref={mainScrollRef}
          tabIndex={-1}
          className="flex-1 min-w-0 h-full overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 lg:px-10 focus:outline-none"
        >
          <div className="w-full max-w-[1040px] mx-auto space-y-6">
            {/* Trial Banner: Only shown if ≤ 5 days remain and not dismissed */}
            <TrialBanner streak={streak} daysRemaining={5} />

            {/* BUTTERY SMOOTH TAB TRANSITIONS VIA ANIMATEPRESENCE */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* TAB: TODAY (Default Hero) */}
                {activeTab === "today" && (
                  <div className="space-y-6">
                    <TodayHero
                      area={survey.area}
                      totalHabits={habits.length}
                      completedCount={completedTodayCount}
                    />

                    <HabitsList
                      habits={habits}
                      checks={todayChecks}
                      onToggleHabit={handleToggleHabit}
                      onUpdateHabit={handleUpdateHabit}
                      onShowToast={showToast}
                    />
                  </div>
                )}

                {/* TAB: MIRROR */}
                {activeTab === "mirror" && (
                  <MirrorTab
                    area={survey.area}
                    problem={survey.problem}
                    futureVision={survey.future_vision}
                    blocker={survey.blocker}
                    insight={insight}
                  />
                )}

                {/* TAB: REFLECT */}
                {activeTab === "reflect" && (
                  <ReflectTab
                    initialWentWell={reflections[todayStr]?.wentWell}
                    initialBlockedBy={reflections[todayStr]?.blockedBy}
                    initialChangeNext={reflections[todayStr]?.changeNext}
                    onSave={handleSaveReflection}
                  />
                )}

                {/* TAB: HISTORY */}
                {activeTab === "history" && (
                  <HistoryTab streak={streak} checks={checks} />
                )}

                {/* TAB: SETTINGS */}
                {activeTab === "settings" && (
                  <SettingsTab
                    area={survey.area}
                    timeAvailable={survey.time_available}
                    blocker={survey.blocker}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Desktop Fixed Right Sidebar (Permanently flush to the right viewport edge) */}
        <div className="hidden lg:block h-full flex-shrink-0">
          <RightSidebar
            streak={streak}
            clarityPct={clarityPct}
            checks={checks}
            totalHabitsCount={habits.length}
            reflections={reflections}
            onExportJson={exportJson}
            onExportText={exportText}
            onClearAll={handleClearAll}
          />
        </div>
      </div>

      {/* Mobile / Tablet Drawer Sidebar with Framer Motion slide-in & backdrop blur */}
      <AnimatePresence>
        {isSidebarOpenMobile && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setIsSidebarOpenMobile(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative w-[320px] max-w-[85vw] h-full bg-[#1C1914] z-10 flex flex-col shadow-2xl"
            >
              <div className="h-[52px] px-4 flex items-center justify-between border-b border-[rgba(201,169,110,0.14)] flex-shrink-0">
                <span className="text-xs font-normal text-[#F0EAE0]">Telemetry &amp; focus</span>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpenMobile(false)}
                  className="text-xs text-[#8A8070] hover:text-[#F0EAE0] py-1 px-2 transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <RightSidebar
                  streak={streak}
                  clarityPct={clarityPct}
                  checks={checks}
                  totalHabitsCount={habits.length}
                  reflections={reflections}
                  onExportJson={exportJson}
                  onExportText={exportText}
                  onClearAll={handleClearAll}
                  className="w-full border-l-0"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. TOAST: Bottom-center, slides up, auto-dismisses after 2.2s, gold left border, never stacks */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1C1914] text-[#F0EAE0] text-[13px] font-normal px-4 py-2.5 rounded-sm border-l-2 border-l-[#C9A96E] border-y border-r border-[#4A4438] shadow-2xl transition-all duration-200 pointer-events-none flex items-center gap-2 select-none ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <span>{toastMsg}</span>
      </div>

      {/* 4. MODALS & GATES */}
      {showBlurGate && (
        <MirrorBlurGate
          area={survey.area}
          onUnlock={() => setShowBlurGate(false)}
        />
      )}

      <ShareMirrorModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        area={survey.area}
        problem={survey.problem}
        futureVision={survey.future_vision}
        blocker={survey.blocker}
        habitsCount={habits.length}
      />
    </div>
  );
}
