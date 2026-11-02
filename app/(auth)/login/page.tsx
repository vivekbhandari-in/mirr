import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 selection:bg-gold/20 selection:text-ink">
      <Suspense fallback={<div className="text-muted text-xs">Loading sign in...</div>}>
        <AuthForm mode="login" />
      </Suspense>
    </div>
  );
}

