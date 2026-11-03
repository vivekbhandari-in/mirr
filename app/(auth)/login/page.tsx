import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign in — Mirr",
  description: "Sign in to your private identity sanctuary.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary/20 selection:text-foreground">
      <Suspense
        fallback={
          <div className="font-mono text-xs text-foreground-muted animate-pulse">
            Opening sanctuary...
          </div>
        }
      >
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}

