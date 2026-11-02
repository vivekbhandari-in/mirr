import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { createAdminClient } from "@/lib/supabase/admin";

interface PublicMirrorProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PublicMirrorProps): Promise<Metadata> {
  const supabase = createAdminClient();
  const { data: mirror } = await supabase
    .from("public_mirrors")
    .select("*")
    .eq("slug", params.slug)
    .single();

  const area = mirror?.area || "Personal transformation";
  const title = `A look in the mirror: ${area}`;
  const description = mirror?.future_summary
    ? `Goal: "${mirror.future_summary}" — building better habits on Mirr.`
    : "Become who you said you'd be.";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mirr.app";
  const ogUrl = `${appUrl}/api/og?type=mirror&area=${encodeURIComponent(area)}&title=${encodeURIComponent(
    title
  )}&subtitle=${encodeURIComponent(description)}`;

  return {
    title: `${title} — Mirr`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function PublicMirrorPage({ params }: PublicMirrorProps) {
  const supabase = createAdminClient();
  const { data: mirror } = await supabase
    .from("public_mirrors")
    .select("*")
    .eq("slug", params.slug)
    .single();

  // If no DB row or test slug, provide fallback data
  const data = mirror || {
    area: "Career & focus",
    problem_summary: "Circling the same role for two years, executing someone else's vision.",
    future_summary: "Running an independent small product, having real autonomy.",
    blocker_summary: "Fear of failure and self-doubt during unstructured hours.",
    habits_count: 3,
    view_count: 142,
  };

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col selection:bg-gold/20 selection:text-paper">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[800px] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[0.1em] text-gold2 uppercase bg-gold2/10 px-3 py-1 rounded-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-subtle" />
            Anonymous Mirror · {data.area}
          </div>
          <h1 className="font-serif text-[clamp(32px,4vw,48px)] text-paper leading-[1.15] mb-3">
            What change looks like in the open.
          </h1>
          <p className="text-xs sm:text-sm font-light text-muted max-w-[480px] mx-auto leading-relaxed">
            This mirror was shared anonymously by someone doing the quiet work of self-discovery and habit building.
          </p>
        </div>

        {/* The 3 Cards */}
        <div className="bg-ink2 border border-rule rounded-md p-6 sm:p-8 space-y-6 shadow-xl mb-10">
          <div className="border-b border-rule pb-5">
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-gold2 mb-1.5">
              Where they started
            </p>
            <p className="font-serif italic text-base sm:text-lg text-paper/85 leading-relaxed">
              &ldquo;{data.problem_summary}&rdquo;
            </p>
          </div>

          <div className="border-b border-rule pb-5">
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-gold2 mb-1.5">
              The 1–2 year vision
            </p>
            <p className="font-serif italic text-base sm:text-lg text-paper/85 leading-relaxed">
              &ldquo;{data.future_summary}&rdquo;
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-gold2 mb-1.5">
              The identified blocker
            </p>
            <p className="font-serif italic text-base sm:text-lg text-paper/85 leading-relaxed">
              &ldquo;{data.blocker_summary}&rdquo;
            </p>
          </div>

          <div className="pt-4 border-t border-rule flex items-center justify-between text-xs text-faint">
            <span>{data.habits_count} daily atomic habits active</span>
            <span className="text-gold">Progress in motion</span>
          </div>
        </div>

        {/* Viral Acquisition Call to Action */}
        <div className="bg-ink3 border border-rule2 rounded-md p-8 text-center space-y-4">
          <h2 className="font-serif text-2xl text-paper">
            Build your own mirror — free.
          </h2>
          <p className="text-xs font-light text-muted leading-relaxed max-w-[420px] mx-auto">
            Answer six quiet questions. Understand what&apos;s really in the way, and get atomic habits designed for your day.
          </p>
          <Link
            href="/survey"
            className="inline-block text-xs font-medium text-ink bg-gold hover:bg-gold2 px-7 py-3 rounded-sm transition-all transform hover:-translate-y-0.5 shadow-sm"
          >
            Start your mirror — no card needed
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

