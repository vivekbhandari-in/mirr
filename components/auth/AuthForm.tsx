"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Check, AlertCircle } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState(searchParams.get("error") || "");

  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setMagicSent(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not sign in with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-surface border border-border rounded-modal p-8 sm:p-10 shadow-2xl text-foreground relative">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group mb-5">
          <span className="w-7 h-7 rounded-md bg-surface-elevated border border-border flex items-center justify-center text-primary font-mono text-xs font-semibold group-hover:border-primary/50 transition-colors">
            M
          </span>
          <span className="font-sans text-sm font-semibold tracking-tight text-foreground">
            Mirr<span className="text-primary">.</span>
          </span>
        </Link>
        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground mb-2">
          {mode === "signup" ? "Begin your contract" : "Welcome back"}
        </h1>
        <p className="text-xs text-foreground-secondary leading-relaxed max-w-[320px] mx-auto">
          {mode === "signup"
            ? "Your identity contract and daily consistency system, synced privately."
            : "Sign in with your email or Google account to enter your sanctuary."}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 rounded-btn bg-danger/10 border border-danger/25 text-xs text-danger flex items-start gap-2.5">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {magicSent ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center mb-4">
            <Mail size={20} />
          </div>
          <h2 className="font-sans text-lg font-semibold text-foreground mb-2">
            Check your inbox
          </h2>
          <p className="text-xs text-foreground-secondary leading-relaxed max-w-[320px] mx-auto mb-6">
            We sent a secure magic link to{" "}
            <strong className="font-medium text-foreground">{email}</strong>. Click it to sign in instantly.
          </p>
          <button
            type="button"
            onClick={() => setMagicSent(false)}
            className="text-xs text-primary hover:text-primary-hover hover:underline transition-colors"
          >
            Use a different email address
          </button>
        </div>
      ) : (
        <>
          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full h-11 flex items-center justify-center gap-3 rounded-btn border border-border bg-surface-elevated hover:bg-surface-muted text-foreground text-xs font-medium transition-colors mb-5 disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-border w-full" />
            <span className="bg-surface px-3 text-[10px] uppercase font-mono tracking-widest text-foreground-muted absolute">
              or email magic link
            </span>
          </div>

          {/* Email Magic Link Form */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-mono uppercase tracking-wider text-foreground-secondary mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full h-11 bg-background border border-border focus:border-primary rounded-btn px-3.5 text-xs text-foreground placeholder:text-foreground-muted/50 focus:outline-none transition-colors font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-btn bg-primary hover:bg-primary-hover text-foreground-inverse text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Sending link..." : "Send magic link"}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-8 text-center text-xs text-foreground-secondary">
            {mode === "signup" ? (
              <p>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-hover hover:underline transition-colors font-medium ml-1"
                >
                  Sign in
                </Link>
              </p>
            ) : (
              <p>
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary-hover hover:underline transition-colors font-medium ml-1"
                >
                  Start free
                </Link>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}