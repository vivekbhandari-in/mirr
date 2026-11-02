import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

interface SegmentConfig {
  slug: string;
  name: string;
  tagline: string;
  headline: string;
  subhead: string;
  obstacleLabel: string;
  quote: string;
  author: string;
  authorRole: string;
}

const SEGMENTS: Record<string, SegmentConfig> = {
  students: {
    slug: "students",
    name: "Students",
    tagline: "study habits & focus for students",
    headline: "Stop cramming. Build a quiet rhythm that lasts.",
    subhead:
      "Balancing lectures, exams, and unstructured free time is overwhelming. Mirr helps students build small, consistent daily study habits without burnout.",
    obstacleLabel: "Procrastination and social media distraction",
    quote:
      "I went from all-nighter panic before exams to just doing one 25-minute deep block every afternoon. The difference in my anxiety is night and day.",
    author: "Arjun K.",
    authorRole: "Computer Science student, 21",
  },
  developers: {
    slug: "developers",
    name: "Developers",
    tagline: "deep work & habit design for engineers",
    headline: "Protect your flow state from constant context switching.",
    subhead:
      "Notifications, meetings, and endless tabs fragment your attention. Mirr provides engineers with single-task anchors and deliberate deep work blocks.",
    obstacleLabel: "Endless context switching and browser tabs",
    quote:
      "As an engineer, I used to negotiate with myself constantly. Mirr helped me reduce the activation energy for side project coding to under two minutes.",
    author: "Elena V.",
    authorRole: "Backend engineer, 27",
  },
  founders: {
    slug: "founders",
    name: "Founders",
    tagline: "mental clarity & execution for entrepreneurs",
    headline: "You don't lack ideas. You need one protected priority.",
    subhead:
      "When everything is urgent, nothing gets finished. Mirr acts as an objective mirror, helping founders stay grounded in daily execution over endless planning.",
    obstacleLabel: "Shiny object syndrome and fear of launch judgment",
    quote:
      "I thought I lacked discipline. Mirr made me see I was just hiding in busywork to avoid shipping. That realization changed my company.",
    author: "Sahil T.",
    authorRole: "Early-stage founder, 26",
  },
  anxiety: {
    slug: "anxiety",
    name: "Anxiety",
    tagline: "shame-free self-discovery for high-stress minds",
    headline: "Gentle habits for minds that overthink everything.",
    subhead:
      "Aggressive productivity apps make anxiety worse with red streaks and broken promises. Mirr is built with compassionate behavioral psychology: small steps, zero guilt.",
    obstacleLabel: "Perfectionism and paralysis by analysis",
    quote:
      "Every other habit tracker made me feel like a failure when I missed a day. Mirr's 'minimum version' philosophy gave me permission to be human.",
    author: "Riya M.",
    authorRole: "Product designer, 24",
  },
  "career-change": {
    slug: "career-change",
    name: "Career Change",
    tagline: "habit transition for ambitious professionals",
    headline: "Transition into your next chapter without quitting your day job.",
    subhead:
      "Building new skills while working full-time feels impossible. Mirr calibrates 15–30 minute daily focus blocks so you make steady progress quietly.",
    obstacleLabel: "Exhaustion after work and fear of starting over",
    quote:
      "Thirty minutes every morning before my corporate shift. In six months, I built a portfolio that landed me my first design role.",
    author: "David L.",
    authorRole: "Transitioned from Finance to UI Design",
  },
  discipline: {
    slug: "discipline",
    name: "Discipline",
    tagline: "atomic habit building without fake motivation",
    headline: "Motivation comes and goes. Evidence stays.",
    subhead:
      "Discipline isn't punishment — it's self-respect in action. Mirr helps you accumulate small wins that rebuild self-trust from the ground up.",
    obstacleLabel: "Relying on mood instead of systems",
    quote:
      "I stopped waiting to feel like doing it. Doing the 2-minute minimum version every morning rebuilt my identity completely.",
    author: "Marcus P.",
    authorRole: "Writer & creator, 29",
  },
};

export function generateStaticParams() {
  return Object.keys(SEGMENTS).map((segment) => ({ segment }));
}

export function generateMetadata({ params }: { params: { segment: string } }): Metadata {
  const config = SEGMENTS[params.segment];
  if (!config) return {};

  return {
    title: `Mirr for ${config.name} — ${config.headline}`,
    description: config.subhead,
    openGraph: {
      title: `Mirr for ${config.name}`,
      description: config.subhead,
    },
  };
}

export default function SegmentPage({ params }: { params: { segment: string } }) {
  const config = SEGMENTS[params.segment];
  if (!config) notFound();

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col selection:bg-gold/20 selection:text-paper">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[1000px] mx-auto w-full">
        {/* Hero */}
        <div className="max-w-[720px] mb-14">
          <div className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.1em] text-gold uppercase bg-gold/10 px-3 py-1 rounded-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            Mirr for {config.name} · {config.tagline}
          </div>

          <h1 className="font-serif text-[clamp(40px,5vw,64px)] text-paper leading-[1.08] tracking-[-0.02em] mb-4">
            {config.headline}
          </h1>

          <p className="text-base sm:text-lg font-light text-muted leading-relaxed mb-8">
            {config.subhead}
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/survey"
              className="text-sm font-medium text-ink bg-gold hover:bg-gold2 px-8 py-3.5 rounded-sm transition-all transform hover:-translate-y-0.5 shadow-sm"
            >
              Start for free — no card needed
            </Link>
            <span className="text-xs text-faint">
              30-day full access · 2-minute onboarding
            </span>
          </div>
        </div>

        {/* Segment Testimonial Spotlight */}
        <div className="bg-ink2 border border-rule rounded-md p-8 sm:p-10 mb-14 shadow-lg">
          <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-gold2 mb-3">
            Case in point · Tackling {config.obstacleLabel}
          </p>
          <p className="font-serif italic text-lg sm:text-xl text-paper/90 leading-relaxed mb-6">
            &ldquo;{config.quote}&rdquo;
          </p>
          <p className="text-xs text-muted">
            <strong className="text-paper block mb-0.5">{config.author}</strong>
            {config.authorRole}
          </p>
        </div>

        {/* Feature comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-ink3 border border-rule2 p-6 rounded-md">
            <p className="font-serif text-2xl text-paper mb-2">1</p>
            <h3 className="text-sm font-medium text-paper mb-1">Name the obstacle</h3>
            <p className="text-xs font-light text-muted leading-relaxed">
              Answer 6 focused questions. Strip away the surface symptoms and identify what is really blocking your progress.
            </p>
          </div>

          <div className="bg-ink3 border border-rule2 p-6 rounded-md">
            <p className="font-serif text-2xl text-paper mb-2">2</p>
            <h3 className="text-sm font-medium text-paper mb-1">Atomic habits only</h3>
            <p className="text-xs font-light text-muted leading-relaxed">
              No unrealistic 2-hour workout plans. Small, calibrated habits that take under 15 minutes with a 2-minute fallback.
            </p>
          </div>

          <div className="bg-ink3 border border-rule2 p-6 rounded-md">
            <p className="font-serif text-2xl text-paper mb-2">3</p>
            <h3 className="text-sm font-medium text-paper mb-1">Evidence over guilt</h3>
            <p className="text-xs font-light text-muted leading-relaxed">
              Missed days happen. Log reasons without shame, adjust your cue, and let consistency compound quietly.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-12 border-t border-rule">
          <h2 className="font-serif text-3xl text-paper mb-3">
            Build your personal mirror today.
          </h2>
          <p className="text-xs font-light text-muted mb-6 max-w-[400px] mx-auto">
            Free for 30 days. No credit card required. Your data remains strictly private.
          </p>
          <Link
            href="/survey"
            className="inline-block text-sm font-medium text-ink bg-gold hover:bg-gold2 px-8 py-3.5 rounded-sm transition-all shadow-md"
          >
            Start your survey
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

