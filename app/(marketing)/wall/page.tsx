import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";

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
    area: "Career",
    problem: "Circling the same agency role for two years, executing other people's ideas.",
    goal: "Ship my first micro-SaaS and replace 50% of monthly burn with product revenue.",
    habitsCount: 3,
    timeAgo: "2 hours ago",
  },
  {
    id: "w2",
    area: "Discipline",
    problem: "Waking up and immediately doom-scrolling for 45 minutes in bed.",
    goal: "Win the first hour of every morning with zero screen time and clear intention.",
    habitsCount: 2,
    timeAgo: "4 hours ago",
  },
  {
    id: "w3",
    area: "Focus",
    problem: "Keeping quiet in executive meetings even when I know the answer.",
    goal: "Speak up with authority and take calculated professional risks without apologizing.",
    habitsCount: 3,
    timeAgo: "Yesterday",
  },
  {
    id: "w4",
    area: "Health",
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
  title: "Wall of Honesty — Mirr",
  description: "What people are working on right now. Anonymized, honest glimpses into personal growth.",
};

export default function WallOfHonestyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[1120px] mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-[620px] mx-auto mb-14 space-y-3">
          <Badge variant="primary" dot>
            Live anonymous commitments
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
            The Wall of Honesty.
          </h1>

          <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
            What real people are working on right now. Anonymized, honest reflections from members building clarity and self-respect on Mirr.
          </p>
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {FEATURED_WALL_ITEMS.map((item) => (
            <Card key={item.id} padding="md" className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="neutral">{item.area}</Badge>
                  <span className="font-mono text-[11px] text-foreground-muted">{item.timeAgo}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-foreground-muted block">
                    Current Struggle
                  </span>
                  <p className="text-xs text-foreground-secondary italic leading-relaxed">
                    “{item.problem}”
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-border">
                  <span className="text-[10px] font-mono uppercase text-primary block">
                    Becoming
                  </span>
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {item.goal}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-foreground-muted font-mono">
                <span>{item.habitsCount} atomic habits</span>
                <span className="text-primary font-medium">Committed</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 sm:p-12 rounded-card bg-surface border border-border text-center max-w-[640px] mx-auto space-y-4 shadow-card">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            Ready to name your blocker?
          </h2>
          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed max-w-[460px] mx-auto">
            Take the 3-minute diagnostic. It costs nothing, requires no card, and gives you today&apos;s single action.
          </p>
          <div className="pt-2 flex justify-center">
            <Link href="/survey" className="inline-block">
              <Button
                variant="primary"
                size="lg"
                iconRight={ArrowRight}
                className="min-w-[160px] shadow-md hover:shadow-lg transition-all"
              >
                Start here
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
