import { Suspense } from "react";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata = {
  title: "Growth Dashboard — Mirr",
  description: "Daily priorities, habit tracking, focus timer, and weekly reflection.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D0B09] flex items-center justify-center p-4">
          <div className="font-serif italic text-gold text-base flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Opening your sanctuary…
          </div>
        </div>
      }
    >
      <DashboardView />
    </Suspense>
  );
}

