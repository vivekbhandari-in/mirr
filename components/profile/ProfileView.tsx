"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ScanFace,
  Edit3,
  Download,
  FileText,
  Trash2,
  Check,
  LogOut,
  KeyRound,
  Laptop,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PersonalMirror, ProofEvent, ReflectionEntry } from "@/types/identity";
import { DEFAULT_PERSONAL_MIRROR, INITIAL_PROOF_EVENTS } from "@/lib/identity-defaults";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "@/components/ui/Logo";
import { EditMirrorModal } from "@/components/dashboard/EditMirrorModal";

const TIMEZONES = [
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST · +05:30)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New York (EST · -05:00)" },
  { value: "America/Los_Angeles", label: "America/Los Angeles (PST · -08:00)" },
  { value: "America/Chicago", label: "America/Chicago (CST · -06:00)" },
  { value: "Europe/London", label: "Europe/London (GMT · +00:00)" },
  { value: "Europe/Berlin", label: "Europe/Berlin (CET · +01:00)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST · +09:00)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (SGT · +08:00)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AEST · +10:00)" },
];

const REMINDER_TIMES = [
  { value: "08:00", label: "8:00 AM (Early Morning)" },
  { value: "09:00", label: "9:00 AM (Morning Build Block)" },
  { value: "10:00", label: "10:00 AM (Mid-Morning)" },
  { value: "14:00", label: "2:00 PM (Afternoon Reset)" },
  { value: "20:00", label: "8:00 PM (Evening Debrief)" },
  { value: "off", label: "Off (Self-directed)" },
];

const THEME_OPTIONS = [
  { value: "warm", label: "Warm Editorial (Mirr Default)" },
  { value: "light", label: "Pure Minimal Light" },
  { value: "system", label: "System Default" },
];

export function ProfileView() {
  const router = useRouter();
  const supabase = createClient();

  // Auth User State
  const [user, setUser] = useState<any>(null);

  // Profile data
  const [displayName, setDisplayName] = useState("Aarav");
  const [memberSince, setMemberSince] = useState("Nov 2026");

  // Mirror & Consistency State
  const [personalMirror, setPersonalMirror] = useState<PersonalMirror>(DEFAULT_PERSONAL_MIRROR);
  const [, setProofEvents] = useState<ProofEvent[]>(INITIAL_PROOF_EVENTS);
  const [reflections, setReflections] = useState<Record<string, ReflectionEntry>>({});
  const [daysActedMonth, setDaysActedMonth] = useState(18);
  const [returnsCount, setReturnsCount] = useState(4);
  const [returnStreak, setReturnStreak] = useState(6);

  // Preferences State
  const [theme, setTheme] = useState("dark");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [weeklyReportEnabled, setWeeklyReportEnabled] = useState(true);
  const [savedPrefNotice, setSavedPrefNotice] = useState<string | null>(null);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditMirrorOpen, setIsEditMirrorOpen] = useState(false);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isReviewSessionsOpen, setIsReviewSessionsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [newEmailInput, setNewEmailInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [tempNameInput, setTempNameInput] = useState("");

  // Toast
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2400);
  };

  const flashPrefSaved = (key: string) => {
    setSavedPrefNotice(key);
    setTimeout(() => setSavedPrefNotice(null), 1800);
  };

  // Hydrate user and data
  useEffect(() => {
    async function loadUserAndData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Aarav";
          setDisplayName(fullName);
          setTempNameInput(fullName);

          if (user.created_at) {
            const date = new Date(user.created_at);
            setMemberSince(
              date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
            );
          }
        } else {
          setDisplayName("Aarav");
          setTempNameInput("Aarav");
          setMemberSince("Nov 2026");
        }
      } catch (err) {
        console.warn("Could not fetch user:", err);
      }

      // Hydrate local storage mirror & evidence
      if (typeof window !== "undefined") {
        try {
          const storedMirror = localStorage.getItem("mirror_personal_mirror");
          if (storedMirror) setPersonalMirror(JSON.parse(storedMirror));

          const storedEvents = localStorage.getItem("mirror_proof_events");
          if (storedEvents) {
            const evs = JSON.parse(storedEvents);
            if (Array.isArray(evs)) {
              setProofEvents(evs);
              const completedCount = evs.filter((e) => e.type === "completed" || e.type === "minimum").length;
              if (completedCount > 0) setDaysActedMonth(completedCount);
              const returnCount = evs.filter((e) => e.type === "returned").length;
              if (returnCount > 0) setReturnsCount(returnCount);
            }
          }

          const storedReflections = localStorage.getItem("mirror_reflections");
          if (storedReflections) setReflections(JSON.parse(storedReflections));

          const storedTheme = localStorage.getItem("mirr_pref_theme");
          if (storedTheme) setTheme(storedTheme);

          const storedTz = localStorage.getItem("mirr_pref_timezone");
          if (storedTz) setTimezone(storedTz);
          else {
            try {
              const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
              if (detected) setTimezone(detected);
            } catch {}
          }

          const storedReminder = localStorage.getItem("mirr_pref_reminder");
          if (storedReminder) setReminderTime(storedReminder);

          const storedWeekly = localStorage.getItem("mirr_pref_weekly");
          if (storedWeekly !== null) setWeeklyReportEnabled(storedWeekly === "true");
        } catch (e) {
          console.error("Hydration error:", e);
        }
      }
    }

    loadUserAndData();
  }, [supabase.auth]);

  // Save Preferences
  const handleThemeChange = (val: string) => {
    setTheme(val);
    localStorage.setItem("mirr_pref_theme", val);
    flashPrefSaved("theme");
  };

  const handleTimezoneChange = (val: string) => {
    setTimezone(val);
    localStorage.setItem("mirr_pref_timezone", val);
    flashPrefSaved("timezone");
  };

  const handleReminderChange = (val: string) => {
    setReminderTime(val);
    localStorage.setItem("mirr_pref_reminder", val);
    flashPrefSaved("reminder");
  };

  const handleToggleWeeklyReport = () => {
    const nextVal = !weeklyReportEnabled;
    setWeeklyReportEnabled(nextVal);
    localStorage.setItem("mirr_pref_weekly", String(nextVal));
    flashPrefSaved("weekly");
  };

  // Profile Edit
  const handleSaveProfile = async () => {
    if (!tempNameInput.trim()) return;
    const trimmed = tempNameInput.trim();
    setDisplayName(trimmed);
    setIsEditProfileOpen(false);

    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { full_name: trimmed },
        });
      } catch (err) {
        console.warn("Could not update remote profile:", err);
      }
    }
    showToast("Profile updated.");
  };

  // Change Email
  const handleChangeEmail = async () => {
    if (!newEmailInput.trim()) return;
    try {
      if (user) {
        const { error } = await supabase.auth.updateUser({ email: newEmailInput.trim() });
        if (error) throw error;
        showToast("Confirmation link sent to your new email.");
      } else {
        showToast("Email updated locally.");
      }
      setIsChangeEmailOpen(false);
      setNewEmailInput("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Could not update email.";
      alert(errorMsg);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (!newPasswordInput.trim()) return;
    try {
      if (user) {
        const { error } = await supabase.auth.updateUser({ password: newPasswordInput.trim() });
        if (error) throw error;
        showToast("Password updated successfully.");
      } else {
        showToast("Password updated locally.");
      }
      setIsChangePasswordOpen(false);
      setNewPasswordInput("");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Could not update password.";
      alert(errorMsg);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    router.push("/");
  };

  // Export JSON
  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user?.id || "guest",
        email: user?.email || "local@mirr.app",
        displayName,
        memberSince,
      },
      personalMirror,
      consistencySnapshot: {
        daysActedMonth,
        returnsCount,
        returnStreak,
      },
      reflections,
      preferences: {
        theme,
        timezone,
        reminderTime,
        weeklyReportEnabled,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mirr-profile-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON archive downloaded.");
  };

  // Export Plaintext Journal
  const handleExportJournal = () => {
    let journal = `MIRR IDENTITY ARCHIVE & PROFILE\n`;
    journal += `User: ${displayName} (${user?.email || "Local User"})\n`;
    journal += `Member Since: ${memberSince}\n`;
    journal += `Exported: ${new Date().toLocaleString()}\n`;
    journal += `==========================================\n\n`;
    journal += `DESIRED IDENTITY:\n${personalMirror.desiredIdentity}\n\n`;
    journal += `ANTI-FUTURE:\n${personalMirror.antiFuture}\n\n`;
    journal += `CURRENT FOCUS:\n${personalMirror.focusArea}\n\n`;
    journal += `MAIN BLOCKER:\n${personalMirror.mainBlocker}\n\n`;
    journal += `DAILY HERO ACTION:\n${personalMirror.todayAction.title} (${personalMirror.todayAction.duration}m)\n`;
    journal += `Anchor: ${personalMirror.todayAction.anchor}\n`;
    journal += `Minimum: ${personalMirror.todayAction.minimumVersion}\n\n`;
    journal += `==========================================\nCONSISTENCY SNAPSHOT:\n`;
    journal += `Days Acted This Month: ${daysActedMonth}\n`;
    journal += `Returns After Drift: ${returnsCount}\n`;
    journal += `Current Return Streak: ${returnStreak} days\n\n`;
    journal += `==========================================\nSEALED REFLECTIONS:\n`;

    Object.entries(reflections).forEach(([date, ref]) => {
      journal += `\n[${date}]\n`;
      if (ref.wentWell) journal += `  Went well: ${ref.wentWell}\n`;
      if (ref.blockedBy) journal += `  Friction:  ${ref.blockedBy}\n`;
      if (ref.changeNext) journal += `  Adjust:    ${ref.changeNext}\n`;
    });

    const blob = new Blob([journal], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mirr-journal-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Journal archive downloaded.");
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.trim() !== "DELETE") return;

    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      if (user) {
        await supabase.auth.signOut();
      }
      router.push("/?deleted=true");
    } catch {
      router.push("/");
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userInitial = (displayName || user?.email || "A").trim().charAt(0).toUpperCase();
  const isGoogleUser = user?.app_metadata?.provider === "google" || user?.identities?.some((id: any) => id.provider === "google");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 select-text">
      {/* ── TOPBAR NAVIGATION (56px) ── */}
      <header className="h-[56px] w-full bg-background border-b border-border px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center" aria-label="Mirr Dashboard">
          <Logo size="sm" showText />
        </Link>

        <Link
          href="/dashboard"
          className="text-xs font-mono text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-1.5 py-2 px-1 min-h-[44px]"
        >
          <ArrowLeft size={14} />
          <span>Dashboard</span>
        </Link>
      </header>

      {/* ── TOAST NOTIFICATION ── */}
      <div
        className={`fixed bottom-6 right-6 z-50 bg-surface text-foreground text-xs font-mono px-4 py-2.5 rounded-btn border-l-2 border-primary border-y border-r border-border shadow-modal transition-all duration-150 pointer-events-none ${
          toastMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {toastMsg}
      </div>

      {/* ── MAIN SCROLLING CONTAINER (Single Scrolling Page, Clear Sections) ── */}
      <main className="flex-1 w-full max-w-[760px] mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-12">
        {/* ── 1. PROFILE HEADER (Compact, < 200px tall on mobile) ── */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-8 border-b border-border">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar: 72px on desktop, 56px on mobile */}
            <div className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-card-sm bg-surface-elevated border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="font-mono text-2xl sm:text-3xl font-semibold text-primary">
                  {userInitial}
                </span>
              )}
            </div>

            {/* Identity Block: Name (20-24px semibold), Email (14px muted), Member since */}
            <div className="space-y-0.5">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight leading-snug">
                {displayName}
              </h1>
              <p className="text-sm text-foreground-secondary font-sans">
                {user?.email || "aarav@example.com"}
              </p>
              <p className="text-[11px] font-mono text-foreground-muted">
                Member since {memberSince}
              </p>
            </div>
          </div>

          {/* One primary action only: Edit profile */}
          <div className="self-start sm:self-center">
            <Button
              variant="secondary"
              size="md"
              icon={Edit3}
              onClick={() => {
                setTempNameInput(displayName);
                setIsEditProfileOpen(true);
              }}
              className="min-h-[44px]"
            >
              Edit profile
            </Button>
          </div>
        </section>

        {/* ── 2. IDENTITY MIRROR SECTION (Immediately below header) ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanFace size={18} className="text-primary" />
              <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
                Your Mirror
              </h2>
            </div>
          </div>

          <div className="rounded-card bg-surface border border-border border-l-4 border-l-primary p-6 sm:p-8 space-y-6 shadow-card">
            {/* Desired Identity: Largest text */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-editorial italic text-primary block">
                You are becoming
              </span>
              <p className="text-xl sm:text-2xl font-semibold text-foreground leading-snug tracking-tight">
                {personalMirror.desiredIdentity}
              </p>
            </div>

            {/* Core Pillars: Current focus, Main blocker, Protected daily time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted block">
                  Current focus
                </span>
                <p className="text-xs font-medium text-foreground">
                  {personalMirror.focusArea}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted block">
                  Main blocker
                </span>
                <p className="text-xs font-medium text-foreground truncate" title={personalMirror.mainBlocker}>
                  {personalMirror.mainBlocker}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted block">
                  Protected daily time
                </span>
                <p className="text-xs font-medium text-primary font-mono">
                  {personalMirror.dailyProtectedTime || 30} minutes
                </p>
              </div>
            </div>

            {/* Action to reopen contract questions */}
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Edit3}
                onClick={() => setIsEditMirrorOpen(true)}
                className="min-h-[44px]"
              >
                Edit Mirror
              </Button>
            </div>
          </div>
        </section>

        {/* ── 3. CONSISTENCY SNAPSHOT (3 Quiet Metrics, No Vanity Pressure) ── */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
            Your consistency
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="p-5 rounded-card bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted block">
                Days acted this month
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-light text-foreground">
                  {daysActedMonth}
                </span>
                <span className="text-[11px] text-success font-mono">days</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-card bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted block">
                Returns after drift
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-light text-recovery">
                  {returnsCount}
                </span>
                <span className="text-[11px] text-recovery font-mono">recoveries</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-card bg-surface border border-border space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted block">
                Current return streak
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-light text-primary">
                  {returnStreak}
                </span>
                <span className="text-[11px] text-primary font-mono">days</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. ACCOUNT SECTION ── */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
            Your account
          </h2>

          <div className="rounded-card bg-surface border border-border divide-y divide-border shadow-card">
            {/* Row 1: Email */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase text-foreground-muted block">
                  Email
                </span>
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {user?.email || "aarav@example.com"}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsChangeEmailOpen(true)}
                className="min-h-[44px]"
              >
                Change
              </Button>
            </div>

            {/* Row 2: Password */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase text-foreground-muted block">
                  Password
                </span>
                <p className="text-xs text-foreground-secondary font-mono">
                  {isGoogleUser ? "Managed via Google OAuth" : "Last updated 3 months ago"}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsChangePasswordOpen(true)}
                className="min-h-[44px]"
              >
                Change
              </Button>
            </div>

            {/* Row 3: Connected sign-in method */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase text-foreground-muted block">
                  Sign-in method
                </span>
                <div className="flex items-center gap-2 pt-0.5">
                  <Badge variant={user ? "success" : "neutral"} dot>
                    {isGoogleUser
                      ? "Google"
                      : user
                      ? "Email Magic Link"
                      : "Local Storage (Guest)"}
                  </Badge>
                  <span className="text-xs text-foreground-secondary font-mono">
                    {user ? "Connected" : "Unconnected"}
                  </span>
                </div>
              </div>

              {!user ? (
                <Link href="/login">
                  <Button variant="primary" size="sm" className="min-h-[44px]">
                    Connect
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleSignOut} icon={LogOut} className="min-h-[44px]">
                  Sign out
                </Button>
              )}
            </div>

            {/* Row 4: Active sessions */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono uppercase text-foreground-muted block">
                  Active sessions
                </span>
                <p className="text-xs text-foreground-secondary">
                  1 device signed in (Current browser)
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsReviewSessionsOpen(true)}
                className="min-h-[44px]"
              >
                Review
              </Button>
            </div>
          </div>
        </section>

        {/* ── 5. PREFERENCES SECTION ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-foreground-secondary">
              Your preferences
            </h2>
            {savedPrefNotice && (
              <span className="text-[11px] font-mono text-success flex items-center gap-1 animate-fade-in">
                <Check size={12} />
                <span>Saved</span>
              </span>
            )}
          </div>

          <div className="rounded-card bg-surface border border-border divide-y divide-border shadow-card">
            {/* Appearance */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-foreground block">
                  Appearance
                </span>
                <p className="text-[11px] text-foreground-muted">
                  Default dark-first sanctuary theme
                </p>
              </div>

              <select
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="bg-surface-elevated text-foreground border border-border rounded-btn px-3 py-2 text-xs font-mono outline-none focus:border-primary transition-colors cursor-pointer min-h-[44px]"
              >
                {THEME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-surface text-foreground">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Zone Dropdown */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-foreground block">
                  Time zone
                </span>
                <p className="text-[11px] text-foreground-muted">
                  Calibrates daily proof boundaries and evening reflections
                </p>
              </div>

              <select
                value={timezone}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                className="bg-surface-elevated text-foreground border border-border rounded-btn px-3 py-2 text-xs font-mono outline-none focus:border-primary transition-colors cursor-pointer min-h-[44px]"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value} className="bg-surface text-foreground">
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Daily Reminder Time */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-foreground block">
                  Daily reminder
                </span>
                <p className="text-[11px] text-foreground-muted">
                  A gentle, guilt-free nudge when your anchor arrives
                </p>
              </div>

              <select
                value={reminderTime}
                onChange={(e) => handleReminderChange(e.target.value)}
                className="bg-surface-elevated text-foreground border border-border rounded-btn px-3 py-2 text-xs font-mono outline-none focus:border-primary transition-colors cursor-pointer min-h-[44px]"
              >
                {REMINDER_TIMES.map((rt) => (
                  <option key={rt.value} value={rt.value} className="bg-surface text-foreground">
                    {rt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Weekly Mirror Report Toggle */}
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-foreground block">
                  Weekly Mirror report
                </span>
                <p className="text-[11px] text-foreground-muted">
                  Sunday evening summary of weekly proofs and friction points
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleWeeklyReport}
                className="w-12 h-6 rounded-pill bg-surface-muted border border-border p-0.5 transition-colors relative flex items-center focus:outline-none focus:border-primary min-h-[24px]"
                aria-label="Toggle weekly mirror report"
              >
                <div
                  className={`w-4 h-4 rounded-pill transition-all ${
                    weeklyReportEnabled ? "bg-primary ml-auto" : "bg-foreground-muted mr-auto"
                  }`}
                />
              </button>
            </div>

            {/* Data Export (Always visible, user data sovereignty) */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-foreground block">
                  Export data
                </span>
                <p className="text-[11px] text-foreground-muted">
                  Download a complete copy of your identity contract and evidence history
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  onClick={handleExportJson}
                  className="min-h-[44px]"
                >
                  Download JSON
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={FileText}
                  onClick={handleExportJournal}
                  className="min-h-[44px]"
                >
                  Download journal
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. DANGER ZONE (Separated at the very bottom) ── */}
        <section className="pt-6">
          <div className="rounded-card bg-danger/5 border border-danger/25 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-danger block">
                Danger zone
              </span>
              <h3 className="text-base font-semibold text-foreground">
                Delete account
              </h3>
              <p className="text-xs text-foreground-secondary leading-relaxed max-w-[540px]">
                This permanently deletes your Mirror, reflections, habit history, and personal data. This action is irreversible and immediately wipes your cloud and local sanctuary records.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="danger"
                size="md"
                icon={Trash2}
                onClick={() => setIsDeleteModalOpen(true)}
                className="min-h-[44px]"
              >
                Delete account
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── EDIT PROFILE MODAL ── */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit profile"
        description="Update your core identity details."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          <div>
            <label className="block text-[11px] font-mono uppercase text-foreground-secondary mb-1.5">
              Display name
            </label>
            <input
              type="text"
              value={tempNameInput}
              onChange={(e) => setTempNameInput(e.target.value)}
              placeholder="Your name"
              className="w-full h-11 bg-surface-muted text-foreground border border-border rounded-btn px-3.5 text-xs outline-none focus:border-primary transition-colors font-sans min-h-[44px]"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditProfileOpen(false)} className="min-h-[44px]">
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleSaveProfile} className="min-h-[44px]">
              Save changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── CHANGE EMAIL MODAL ── */}
      <Modal
        isOpen={isChangeEmailOpen}
        onClose={() => setIsChangeEmailOpen(false)}
        title="Change email"
        description="Enter your new email address. We will send a confirmation link."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          <div>
            <label className="block text-[11px] font-mono uppercase text-foreground-secondary mb-1.5">
              New email address
            </label>
            <input
              type="email"
              value={newEmailInput}
              onChange={(e) => setNewEmailInput(e.target.value)}
              placeholder="new@domain.com"
              className="w-full h-11 bg-surface-muted text-foreground border border-border rounded-btn px-3.5 text-xs outline-none focus:border-primary transition-colors font-sans min-h-[44px]"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsChangeEmailOpen(false)} className="min-h-[44px]">
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleChangeEmail} className="min-h-[44px]">
              Send confirmation
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── CHANGE PASSWORD MODAL ── */}
      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => {
          setIsChangePasswordOpen(false);
          setNewPasswordInput("");
        }}
        title="Change password"
        description={
          isGoogleUser
            ? "Your account signs in via Google OAuth. To update your password, use your Google Account security settings."
            : "Enter a new secure password for your sanctuary account."
        }
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          {isGoogleUser ? (
            <div className="p-4 rounded-btn bg-surface-elevated border border-border text-xs text-foreground-secondary space-y-3">
              <p>
                Because you signed in with Google, you don’t have an independent Mirr password.
              </p>
              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-mono text-xs"
              >
                <span>Google Account Security</span>
                <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-mono uppercase text-foreground-secondary mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full h-11 bg-surface-muted text-foreground border border-border rounded-btn px-3.5 text-xs outline-none focus:border-primary transition-colors font-mono min-h-[44px]"
                autoFocus
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsChangePasswordOpen(false);
                setNewPasswordInput("");
              }}
              className="min-h-[44px]"
            >
              Close
            </Button>
            {!isGoogleUser && (
              <Button
                variant="primary"
                size="md"
                onClick={handleChangePassword}
                disabled={newPasswordInput.trim().length < 8}
                className="min-h-[44px]"
              >
                Update password
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* ── REVIEW ACTIVE SESSIONS MODAL ── */}
      <Modal
        isOpen={isReviewSessionsOpen}
        onClose={() => setIsReviewSessionsOpen(false)}
        title="Active sessions"
        description="Devices currently authenticated to your Mirr sanctuary."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-card bg-surface-elevated border border-border flex items-start gap-3">
            <div className="p-2 rounded-btn bg-surface border border-border text-primary shrink-0">
              <Laptop size={18} />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Current Session</span>
                <Badge variant="success" dot>Active Now</Badge>
              </div>
              <p className="text-[11px] text-foreground-secondary">
                Web browser · Secure session token active
              </p>
              <p className="text-[10px] font-mono text-foreground-muted">
                Last checked: Just now
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReviewSessionsOpen(false)}
              className="min-h-[44px]"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── EDIT MIRROR MODAL (Reuses Contract Calibration) ── */}
      <EditMirrorModal
        isOpen={isEditMirrorOpen}
        onClose={() => setIsEditMirrorOpen(false)}
        mirror={personalMirror}
        onSave={(updated) => {
          setPersonalMirror(updated);
          localStorage.setItem("mirror_personal_mirror", JSON.stringify(updated));
          showToast("Personal Mirror updated.");
        }}
      />

      {/* ── DELETE ACCOUNT CONFIRMATION MODAL ── */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfirmText("");
        }}
        title="Permanently delete account?"
        description="This action cannot be undone. All your evidence, identity contract, reflections, and habits will be deleted."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-danger font-medium leading-relaxed">
            To confirm deletion, please type <strong className="font-mono font-bold">DELETE</strong> below:
          </p>

          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full h-11 bg-surface-muted text-foreground border border-danger/30 rounded-btn px-3.5 text-xs outline-none focus:border-danger transition-colors font-mono min-h-[44px]"
            autoFocus
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmText("");
              }}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              disabled={deleteConfirmText.trim() !== "DELETE"}
              onClick={handleDeleteAccount}
              className="min-h-[44px]"
            >
              Permanently delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
