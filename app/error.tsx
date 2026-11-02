"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ink text-paper flex items-center justify-center p-6 text-center">
      <div className="max-w-[420px] space-y-4">
        <h1 className="font-serif text-3xl text-paper">Something went wrong</h1>
        <p className="text-xs font-light text-muted">
          An unexpected error occurred. You can try refreshing or returning to the home page.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="text-xs font-medium text-ink bg-gold hover:bg-gold2 px-5 py-2.5 rounded-sm transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-xs font-normal text-muted hover:text-paper border border-rule2 px-4 py-2.5 rounded-sm transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

