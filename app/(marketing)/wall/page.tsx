import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

interface WallItem {
  id: string;
  area: string;
  problem: string;
  goal: string;
  habitsCount: number;
  timeAgo: string;
}

const FEATURED_WALL_ITEMS: WallItem[] = [
  {
    id: "w1",
    area: "Career & focus",
    problem: "Circling the same agency role for two years, executing other people's ideas.",
    goal: "Ship my first micro-SaaS and replace 50% of my monthly burn with product revenue.",
    habitsCount: 3,
    timeAgo: "2 hours ago",
  },
  {
    id: "w2",
    area: "Discipline & routine",
    problem: "Waking up and immediately doom-scrolling for 45 minutes in bed.",
    goal: "Win the first hour of every morning with zero screen time and clear intention.",
    habitsCount: 2,
    timeAgo: "4 hours ago",
  },
  {
    id: "w3",
    area: "Confidence & bravery",
    problem: "Keeping quiet in executive meetings even when I know the answer.",
    goal: "Speak up with authority and take calculated professional risks without apologizing.",
    habitsCount: 3,
    timeAgo: "Yesterday",
  },
  {
    id: "w4",
    area: "Health & vitality",
    problem: "Sitting 11 hours straight without moving and collapsing into bed fatigued.",
    goal: "A sustainable physical rhythm: daily outdoor walks and consistent sleep window.",
    habitsCount: 2,
    timeAgo: "Yesterday",
  },
  {
    id: "w5",
    area: "Finances",
    problem: "Avoiding checking bank balances out of subtle anxiety.",
    goal: "Calm, proactive money management with weekly review and zero impulse orders.",
    habitsCount: 3,
    timeAgo: "2 days ago",
  },
  {
    id: "w6",
    area: "Personal growth",
    problem: "Buying books and saving bookmarks that I never read.",
    goal: "Read 10 pages every night and take one concrete insight into daily life.",
    habitsCount: 2,
    timeAgo: "3 days ago",
  },
];

export const metadata = {
  title: "Wall of Change — Mirr",
  description: "What people are working on right now. Anonymized, honest glimpses into personal growth.",
};

export default function WallOfChangePage() {
  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col selection:bg-gold/20 selection:text-paper">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[1100px] mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.1em] text-gold uppercase bg-gold/10 px-3 py-1 rounded-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-subtle" />
            Live reflections
          </div>

          <h1 className="font-serif text-[clamp(36px,4.5vw,56px)] text-paper leading-[1.08] tracking-[-0.02em] mb-4">
            The Wall of <span className="italic text-gold">Change.</span>
          </h1>

          <p className="text-sm font-light text-muted leading-relaxed">
            What real people are working on right now. Anonymized, honest reflections from members building clarity and better habits on Mirr.
          </p>
        </div>

        {/* Bento / Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURED_WALL_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-ink2 border border-rule rounded-md p-6 flex flex-col justify-between hover:border-gold/50 transition-colors shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-faint mb-4">
                  <span className="text-gold uppercase tracking-[0.08em] font-medium">
                    {item.area}
                  </span>
                  <span>{item.timeAgo}</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-[10px] uppercase font-light text-muted tracking-wider mb-1">
                      Current Reality
                    </p>
                    <p className="font-serif italic text-sm text-paper/80 leading-relaxed">
                      &ldquo;{item.problem}&rdquo;
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-light text-muted tracking-wider mb-1">
                      Target Future
                    </p>
                    <p className="font-serif italic text-sm text-paper/90 leading-relaxed">
                      &ldquo;{item.goal}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-rule flex items-center justify-between">
                <span className="text-[11px] text-faint">
                  {item.habitsCount} habits calibrated
                </span>
                <Link
                  href="/survey"
                  className="text-xs text-gold hover:underline font-medium"
                >
                  Build yours →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center py-10 border-t border-rule">
          <h2 className="font-serif text-2xl text-paper mb-2">
            Ready to name your own obstacle?
          </h2>
          <p className="text-xs font-light text-muted mb-6">
            Two minutes. Completely private. 30 days full access.
          </p>
          <Link
            href="/survey"
            className="inline-block text-xs font-medium text-ink bg-gold hover:bg-gold2 px-7 py-3 rounded-sm transition-all"
          >
            Start for free — no card needed
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

