import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata = {
  title: "About — Mirr",
  description: "Why we built Mirr. Behavioral design, quiet progress, and no shame.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col selection:bg-gold/20 selection:text-paper">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[760px] mx-auto w-full">
        <h1 className="font-serif text-[clamp(36px,4.5vw,52px)] text-paper leading-tight mb-6">
          The story behind <span className="italic text-gold">Mirr.</span>
        </h1>

        <div className="space-y-6 text-sm sm:text-base font-light text-muted leading-relaxed">
          <p>
            Most productivity apps treat you like a broken machine that needs more notifications, harsher streaks, and fake urgency. When you miss a day, they guilt-trip you.
          </p>

          <p>
            The truth is: you don&apos;t lack willpower. You lack an objective mirror.
          </p>

          <p>
            When you sit down, face your actual patterns honestly, and calibrate actions so small they feel almost ridiculous to skip, resistance evaporates.
          </p>

          <div className="bg-ink2 border-l-2 border-gold p-6 my-8 rounded-sm text-paper font-serif italic text-lg leading-relaxed">
            &ldquo;We don&apos;t rise to the level of our goals. We fall to the level of our systems.&rdquo;
          </div>

          <p>
            Mirr is built on James Clear&apos;s Atomic Habits, BJ Fogg&apos;s Tiny Habits, and compassionate cognitive psychology. Our promise is simple: we will never shame you, we will never sell your data, and we will always keep the bar low enough to show up today.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-rule text-center">
          <Link
            href="/survey"
            className="text-xs font-medium text-ink bg-gold hover:bg-gold2 px-7 py-3 rounded-sm transition-all inline-block"
          >
            Start your mirror — free for 30 days
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

