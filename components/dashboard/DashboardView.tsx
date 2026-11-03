"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Types
import {
  PersonalMirror,
  ActionStatus,
  TodayProofState,
  ProofEvent,
  ReflectionEntry,
  DriftDiagnostic,
} from "@/types/identity";
import { Habit } from "@/types";

// Defaults
import {
  DEFAULT_PERSONAL_MIRROR,
  synthesizePersonalMirror,
  INITIAL_PROOF_EVENTS,
} from "@/lib/identity-defaults";

// Shell & Navigation
import { DashboardTopNav } from "./DashboardTopNav";
import { DashboardSidebar, IdentityDashboardTab } from "./DashboardSidebar";

// Dedicated Screens
import { TodayScreen } from "./screens/TodayScreen";
import { MirrorScreen } from "./screens/MirrorScreen";
import { ReflectScreen } from "./screens/ReflectScreen";
import { EvidenceScreen } from "./screens/EvidenceScreen";
import { DriftScreen } from "./screens/DriftScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

// Interactive Modals
import { FocusModeModal } from "./FocusModeModal";
import { MinimumVersionModal } from "./MinimumVersionModal";
import { MissedActionModal } from "./MissedActionModal";
import { EditMirrorModal } from "./EditMirrorModal";

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
  const todayDateStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayReadable = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    []
  );

  const [mounted, setMounted] = useState(false);
  const initialTab = useMemo<IdentityDashboardTab>(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["today", "mirror", "reflect", "evidence", "drift", "settings"].includes(tabParam)) {
      return tabParam as IdentityDashboardTab;
    }
    return "today";
  }, [searchParams]);
  const [activeTab, setActiveTab] = useState<IdentityDashboardTab>(initialTab);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isMinimumModalOpen, setIsMinimumModalOpen] = useState(false);
  const [isMissedModalOpen, setIsMissedModalOpen] = useState(false);
  const [isEditMirrorOpen, setIsEditMirrorOpen] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(false);

  // Sync tab if URL search parameter changes
  useEffect(() => {
    const tabParam = searchParams.get("tab") as IdentityDashboardTab | null;
    if (tabParam && ["today", "mirror", "reflect", "evidence", "drift", "settings"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Toast state (bottom-center, replaces instantly, 2.2s auto-dismiss)
  const [toastMsg, setToastMsg] = useState("");
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Core Sanctuary State
  const [personalMirror, setPersonalMirror] = useState<PersonalMirror>(
    DEFAULT_PERSONAL_MIRROR
  );
  const [proofState, setProofState] = useState<TodayProofState>({
    status: "pending",
  });
  const [proofEvents, setProofEvents] = useState<ProofEvent[]>(
    INITIAL_PROOF_EVENTS
  );
  const [reflections, setReflections] = useState<
    Record<string, ReflectionEntry>
  >({});
  const [habitsList, setHabitsList] = useState<Habit[]>([]);
  const [driftDiagnostic, setDriftDiagnostic] = useState<DriftDiagnostic>({
    daysDrifted: 0,
    likelyPattern:
      "You tend to overcommit after a productive week, then avoid the app when you fall behind.",
    recommendation: "Do not try to recover everything today.",
    returnAction: {
      title: "Open your editor and write one function",
      duration: 5,
    },
    daysSinceReturn: 1,
  });

  // Load and hydrate stored state on mount
  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      try {
        // 1. Personal Mirror
        const customMirror = localStorage.getItem("mirror_personal_mirror");
        if (customMirror) {
          setPersonalMirror(JSON.parse(customMirror));
        } else {
          const storedSurvey = localStorage.getItem("mirror_survey");
          if (storedSurvey) {
            const parsed = JSON.parse(storedSurvey);
            const synthesized = synthesizePersonalMirror(parsed);
            setPersonalMirror(synthesized);
            localStorage.setItem(
              "mirror_personal_mirror",
              JSON.stringify(synthesized)
            );
          } else {
            setShowDemoBanner(true);
          }
        }

        // 2. Habits List
        const storedHabits = localStorage.getItem("mirror_habits");
        if (storedHabits) {
          const parsedH = JSON.parse(storedHabits);
          if (Array.isArray(parsedH)) setHabitsList(parsedH);
        }

        // 3. Today's Proof State
        const savedProofKey = `mirror_proof_${todayDateStr}`;
        const savedProof = localStorage.getItem(savedProofKey);
        if (savedProof) {
          setProofState(JSON.parse(savedProof));
        }

        // 4. Proof Events Archive
        const savedEvents = localStorage.getItem("mirror_proof_events");
        if (savedEvents) {
          setProofEvents(JSON.parse(savedEvents));
        }

        // 5. Reflections Archive
        const savedReflections = localStorage.getItem("mirror_reflections");
        if (savedReflections) {
          setReflections(JSON.parse(savedReflections));
        }

        // 6. Drift Calculation based on last active date
        const lastActive = localStorage.getItem("mirror_lastActiveDate");
        if (lastActive && lastActive !== todayDateStr) {
          const diffDays = Math.round(
            (new Date(todayDateStr).getTime() - new Date(lastActive).getTime()) /
              (1000 * 3600 * 24)
          );
          if (diffDays > 1) {
            setDriftDiagnostic((prev) => ({
              ...prev,
              daysDrifted: diffDays,
              daysSinceReturn: 0,
            }));
          }
        }
        localStorage.setItem("mirror_lastActiveDate", todayDateStr);
      } catch (e) {
        console.warn("Mirr sanctuary hydration note:", e);
      }
    }
  }, [todayDateStr]);

  // Non-stacking 2.2s toast
  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMsg("");
    }, 2200);
  };

  // Tab switch with smooth scroll reset
  const handleSelectTab = (tab: IdentityDashboardTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  };

  // ── COMPLETION HANDLERS ──

  // 1. Full Focus Session Complete
  const handleCompleteFull = (durationMinutes: number) => {
    const newState: TodayProofState = {
      status: "completed",
      completedAt: new Date().toISOString(),
      durationActual: durationMinutes,
    };
    setProofState(newState);
    localStorage.setItem(`mirror_proof_${todayDateStr}`, JSON.stringify(newState));

    // Append to Proof Events
    const newEvent: ProofEvent = {
      id: `pe-${Date.now()}`,
      date: todayReadable,
      fullDate: new Date().toISOString(),
      type: "completed",
      title: `Completed ${durationMinutes}-minute focused session`,
      details: personalMirror.todayAction.title,
    };
    const updatedEvents = [newEvent, ...proofEvents];
    setProofEvents(updatedEvents);
    localStorage.setItem("mirror_proof_events", JSON.stringify(updatedEvents));

    // Clear drift if any
    setDriftDiagnostic((prev) => ({
      ...prev,
      daysDrifted: 0,
      daysSinceReturn: prev.daysSinceReturn + 1,
    }));

    showToast("Proof logged — you acted like the person you want to become.");

    // Background sync to API (silent offline fallback)
    fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: todayDateStr,
        completed: true,
        note: `Full session: ${durationMinutes}m`,
      }),
    }).catch(() => {});
  };

  // 2. Minimum Version Complete
  const handleCompleteMinimum = (durationMinutes: number) => {
    const newState: TodayProofState = {
      status: "minimum",
      completedAt: new Date().toISOString(),
      durationActual: durationMinutes,
    };
    setProofState(newState);
    localStorage.setItem(`mirror_proof_${todayDateStr}`, JSON.stringify(newState));

    const newEvent: ProofEvent = {
      id: `pe-${Date.now()}`,
      date: todayReadable,
      fullDate: new Date().toISOString(),
      type: "minimum",
      title: "Used minimum version proof",
      details: personalMirror.todayAction.minimumVersion,
    };
    const updatedEvents = [newEvent, ...proofEvents];
    setProofEvents(updatedEvents);
    localStorage.setItem("mirror_proof_events", JSON.stringify(updatedEvents));

    setDriftDiagnostic((prev) => ({
      ...prev,
      daysDrifted: 0,
      daysSinceReturn: prev.daysSinceReturn + 1,
    }));

    showToast("Small proof still counts. Momentum preserved.");
  };

  // 3. Confirm Missed / Drift Flow
  const handleConfirmMissed = (reason: string, recommendation: string) => {
    const newState: TodayProofState = {
      status: "missed",
      completedAt: new Date().toISOString(),
      missedReason: reason,
      recoveryNote: recommendation,
    };
    setProofState(newState);
    localStorage.setItem(`mirror_proof_${todayDateStr}`, JSON.stringify(newState));

    const newEvent: ProofEvent = {
      id: `pe-${Date.now()}`,
      date: todayReadable,
      fullDate: new Date().toISOString(),
      type: "missed",
      title: `Missed: ${reason}`,
      details: `Recovery recommendation: ${recommendation}`,
    };
    const updatedEvents = [newEvent, ...proofEvents];
    setProofEvents(updatedEvents);
    localStorage.setItem("mirror_proof_events", JSON.stringify(updatedEvents));

    // Update drift state
    setDriftDiagnostic((prev) => ({
      ...prev,
      daysDrifted: prev.daysDrifted + 1,
      likelyPattern: `Friction caused by: ${reason}.`,
      recommendation,
    }));

    showToast("Friction noted without shame. Return action ready.");
  };

  // 4. Execute Return from Drift Screen
  const handleExecuteReturn = () => {
    handleCompleteMinimum(5);
    setActiveTab("today");
    showToast("Welcome back. You returned to yourself.");
  };

  // 5. Save Reflection
  const handleSaveReflection = (entry: ReflectionEntry, isSealing = false) => {
    const updated = {
      ...reflections,
      [todayDateStr]: entry,
    };
    setReflections(updated);
    localStorage.setItem("mirror_reflections", JSON.stringify(updated));

    if (isSealing) {
      showToast("Reflection sealed.");
    }

    fetch("/api/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: todayDateStr,
        type: "daily",
        went_well: entry.wentWell,
        blocked_by: entry.blockedBy,
        change_next: entry.changeNext,
      }),
    }).catch(() => {});
  };

  // 6. Update Personal Mirror
  const handleSaveMirror = (updated: PersonalMirror) => {
    setPersonalMirror(updated);
    localStorage.setItem("mirror_personal_mirror", JSON.stringify(updated));
    showToast("Identity contract updated.");
  };

  // 7. Update Focus Area
  const handleUpdateFocusArea = (area: string) => {
    const updated: PersonalMirror = { ...personalMirror, focusArea: area };
    handleSaveMirror(updated);
  };

  // 8. Update Daily Time
  const handleUpdateDailyTime = (time: number) => {
    const updated: PersonalMirror = {
      ...personalMirror,
      dailyProtectedTime: time,
      todayAction: {
        ...personalMirror.todayAction,
        duration: time,
      },
    };
    handleSaveMirror(updated);
  };

  // 9. Export JSON
  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      personalMirror,
      proofState,
      proofEvents,
      reflections,
      driftDiagnostic,
    };
    downloadFile(
      `mirr-identity-${todayDateStr}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
    showToast("JSON archive exported.");
  };

  // 10. Export Text Journal
  const handleExportText = () => {
    let journal = `MIRR IDENTITY ARCHIVE\nExported: ${new Date().toLocaleString()}\n`;
    journal += `==========================================\n`;
    journal += `DESIRED IDENTITY:\n${personalMirror.desiredIdentity}\n\n`;
    journal += `ANTI-FUTURE:\n${personalMirror.antiFuture}\n\n`;
    journal += `CURRENT REALITY:\n${personalMirror.currentReality}\n\n`;
    journal += `MAIN BLOCKER:\n${personalMirror.mainBlocker}\n\n`;
    journal += `DAILY ACTION BLUEPRINT:\n${personalMirror.todayAction.title} (${personalMirror.todayAction.duration}m)\n`;
    journal += `Anchor: ${personalMirror.todayAction.anchor}\n`;
    journal += `Minimum: ${personalMirror.todayAction.minimumVersion}\n\n`;
    journal += `==========================================\nEVIDENCE LOG:\n`;
    proofEvents.forEach((ev) => {
      journal += `[${ev.date}] ${ev.title}\n${ev.details ? `  ${ev.details}\n` : ""}`;
    });
    journal += `\n==========================================\nSEALED REFLECTIONS:\n`;
    Object.entries(reflections).forEach(([date, ref]) => {
      journal += `\n[${date}]\n`;
      if (ref.wentWell) journal += `  Went well: ${ref.wentWell}\n`;
      if (ref.blockedBy) journal += `  Friction:  ${ref.blockedBy}\n`;
      if (ref.changeNext) journal += `  Adjust:    ${ref.changeNext}\n`;
    });

    downloadFile(`mirr-journal-${todayDateStr}.txt`, journal, "text/plain");
    showToast("Text journal exported.");
  };

  // 11. Purge Local Storage
  const handleClearAll = () => {
    if (
      window.confirm(
        "Are you sure you want to purge your local identity record? This action cannot be undone."
      )
    ) {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      setPersonalMirror(DEFAULT_PERSONAL_MIRROR);
      setProofState({ status: "pending" });
      setProofEvents(INITIAL_PROOF_EVENTS);
      setReflections({});
      setDriftDiagnostic({
        daysDrifted: 0,
        likelyPattern: "Overcommitting after high productivity.",
        recommendation: "One micro proof is enough.",
        returnAction: {
          title: "Open your editor and write one function",
          duration: 5,
        },
        daysSinceReturn: 1,
      });
      showToast("Sanctuary data purged.");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="font-mono text-xs text-primary flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Entering sanctuary…</span>
        </div>
      </div>
    );
  }

  const userInitial = personalMirror.desiredIdentity
    ? personalMirror.desiredIdentity.trim().charAt(0).toUpperCase()
    : "M";

  const totalSealedReflections = Object.values(reflections).filter(
    (r) => r.isSealed
  ).length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col selection:bg-primary/20 select-text">
      {/* ── 1. FIXED TOP NAVIGATION (56px) ── */}
      <DashboardTopNav
        focusArea={personalMirror.focusArea}
        proofStatus={proofState.status}
        userInitial={userInitial}
        onOpenSettings={() => handleSelectTab("settings")}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* ── 2. MAIN SANCTUARY SHELL: SIDEBAR + CONTENT ── */}
      <div className="flex-1 flex overflow-hidden relative w-full">
        {/* Desktop Sidebar (240px, collapsible to 64px) */}
        <div className="hidden lg:block h-full flex-shrink-0">
          <DashboardSidebar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            driftCount={driftDiagnostic.daysDrifted}
          />
        </div>

        {/* Mobile / Tablet Drawer Sidebar */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 z-40 lg:hidden flex"
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setIsMobileSidebarOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="relative w-[260px] max-w-[80vw] h-full bg-background z-10 flex flex-col shadow-modal"
              >
                <DashboardSidebar
                  activeTab={activeTab}
                  onSelectTab={handleSelectTab}
                  isCollapsed={false}
                  driftCount={driftDiagnostic.daysDrifted}
                  className="w-full border-r-0"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── 3. PRIMARY CONTENT AREA (Fluid width, Single Screen at a Time) ── */}
        <main
          ref={mainScrollRef}
          tabIndex={-1}
          className="flex-1 min-w-0 h-full overflow-y-auto px-4 sm:px-8 lg:px-12 py-6 focus:outline-none"
        >
          <div className="w-full max-w-[960px] mx-auto pb-16">
            {/* Demo Preview Banner */}
            {showDemoBanner && (
              <div className="mb-6 p-3 px-4 rounded-btn bg-surface-elevated border border-border text-xs text-foreground-secondary flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="truncate">
                    Viewing preview mirror. Calibrate your own identity contract in the 3-minute diagnostic.
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/survey"
                    className="text-primary hover:text-primary-hover hover:underline font-mono text-xs font-medium"
                  >
                    Start survey →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowDemoBanner(false)}
                    className="text-foreground-muted hover:text-foreground text-xs p-1"
                    aria-label="Dismiss banner"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {/* 1. TODAY HERO SCREEN */}
                {activeTab === "today" && (
                  <TodayScreen
                    mirror={personalMirror}
                    proofState={proofState}
                    onStartFocus={() => setIsFocusModalOpen(true)}
                    onOpenMinimumVersion={() => setIsMinimumModalOpen(true)}
                    onOpenMissedModal={() => setIsMissedModalOpen(true)}
                    onGoToReflect={() => handleSelectTab("reflect")}
                  />
                )}

                {/* 2. MIRROR SCREEN */}
                {activeTab === "mirror" && (
                  <MirrorScreen
                    mirror={personalMirror}
                    habits={habitsList}
                    onOpenEditModal={() => setIsEditMirrorOpen(true)}
                  />
                )}

                {/* 3. REFLECT SCREEN */}
                {activeTab === "reflect" && (
                  <ReflectScreen
                    currentEntry={
                      reflections[todayDateStr] || {
                        wentWell: "",
                        blockedBy: "",
                        changeNext: "",
                        isSealed: false,
                      }
                    }
                    totalReflectionsCount={totalSealedReflections}
                    onSaveEntry={handleSaveReflection}
                    onShowToast={showToast}
                  />
                )}

                {/* 4. EVIDENCE SCREEN */}
                {activeTab === "evidence" && (
                  <EvidenceScreen
                    events={proofEvents}
                    daysActedMonth={Math.max(1, proofEvents.length)}
                    returnRate="100%"
                    trendText="Steadily building"
                  />
                )}

                {/* 5. DRIFT SCREEN */}
                {activeTab === "drift" && (
                  <DriftScreen
                    diagnostic={driftDiagnostic}
                    onExecuteReturn={handleExecuteReturn}
                    onShowToast={showToast}
                  />
                )}

                {/* 6. SETTINGS SCREEN */}
                {activeTab === "settings" && (
                  <SettingsScreen
                    mirror={personalMirror}
                    onOpenEditMirror={() => setIsEditMirrorOpen(true)}
                    onExportJson={handleExportJson}
                    onExportText={handleExportText}
                    onClearAll={handleClearAll}
                    onUpdateFocusArea={handleUpdateFocusArea}
                    onUpdateDailyTime={handleUpdateDailyTime}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* ── 4. QUIET TOAST NOTIFICATION ── */}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface text-foreground text-xs font-mono px-4 py-2.5 rounded-btn border-l-2 border-l-primary border-y border-r border-border shadow-modal transition-all duration-150 pointer-events-none select-none flex items-center gap-2 ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <span>{toastMsg}</span>
      </div>

      {/* ── 5. INTERACTIVE MODALS ── */}
      <FocusModeModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
        onComplete={handleCompleteFull}
        actionTitle={personalMirror.todayAction.title}
        actionDuration={personalMirror.todayAction.duration}
        desiredIdentity={personalMirror.desiredIdentity}
      />

      <MinimumVersionModal
        isOpen={isMinimumModalOpen}
        onClose={() => setIsMinimumModalOpen(false)}
        onCompleteMinimum={handleCompleteMinimum}
        minimumAction={personalMirror.todayAction.minimumVersion}
      />

      <MissedActionModal
        isOpen={isMissedModalOpen}
        onClose={() => setIsMissedModalOpen(false)}
        onConfirmMissed={handleConfirmMissed}
        anchor={personalMirror.todayAction.anchor}
      />

      <EditMirrorModal
        isOpen={isEditMirrorOpen}
        onClose={() => setIsEditMirrorOpen(false)}
        mirror={personalMirror}
        onSave={handleSaveMirror}
      />
    </div>
  );
}
