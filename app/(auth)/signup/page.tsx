import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 selection:bg-gold/20 selection:text-ink">
      <Suspense fallback={<div className="text-muted text-xs">Loading sign up...</div>}>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}

