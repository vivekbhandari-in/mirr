import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata = {
  title: "Privacy & Data Pledge — Mirr",
  description: "Your data stays private. We never sell your reflections or target you with ads.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col selection:bg-gold/20 selection:text-paper">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-8 max-w-[760px] mx-auto w-full">
        <h1 className="font-serif text-[clamp(32px,4vw,48px)] text-paper leading-tight mb-4">
          Our Privacy &amp; Data <span className="italic text-gold">Pledge.</span>
        </h1>

        <p className="text-xs uppercase tracking-widest text-gold2 mb-8">
          Last updated: November 2026
        </p>

        <div className="space-y-6 text-xs sm:text-sm font-light text-muted leading-relaxed">
          <section className="bg-ink2 border border-rule p-6 rounded-md space-y-2">
            <h2 className="font-serif text-lg text-paper">1. Zero Ad Tracking or Data Brokering</h2>
            <p>
              We do not sell, rent, or trade your personal survey answers, reflections, or habit logs to any third-party brokers, advertisers, or data aggregators. Ever.
            </p>
          </section>

          <section className="bg-ink2 border border-rule p-6 rounded-md space-y-2">
            <h2 className="font-serif text-lg text-paper">2. Row Level Security &amp; Encryption</h2>
            <p>
              All personal records in our database are guarded by PostgreSQL Row Level Security (RLS) policies. Only your authenticated user account has cryptographic permission to read or modify your habits.
            </p>
          </section>

          <section className="bg-ink2 border border-rule p-6 rounded-md space-y-2">
            <h2 className="font-serif text-lg text-paper">3. AI Processing Terms</h2>
            <p>
              When you generate insights using Claude, your survey answers are submitted via private API calls with zero model-training retention agreements. Your reflections are never used to train public models.
            </p>
          </section>

          <section className="bg-ink2 border border-rule p-6 rounded-md space-y-2">
            <h2 className="font-serif text-lg text-paper">4. Immediate Data Export &amp; Deletion</h2>
            <p>
              You own your data. You can download your complete history anytime as a JSON file or plain text document from the dashboard. You can also delete your account with one click from settings, permanently wiping all records.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

