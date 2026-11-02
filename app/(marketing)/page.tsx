"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { HeroNotebook } from "@/components/marketing/HeroNotebook";
import { FoundingMemberSection } from "@/components/marketing/FoundingMemberSection";

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col selection:bg-gold/20 selection:text-paper">
      <Navbar />

      <main className="flex-1 pt-[52px]">
        {/* ── HERO ── */}
        <section className="min-h-[calc(100vh-52px)] grid grid-cols-1 lg:grid-cols-2 border-b border-rule">
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="px-6 py-14 sm:px-12 sm:py-20 lg:py-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-rule"
          >
            <motion.div
              variants={heroItemVariants}
              className="inline-flex items-center gap-2 text-[11px] font-normal tracking-[0.08em] text-gold mb-7"
            >
              <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0 animate-pulse" />
              personal transformation — private &amp; free
            </motion.div>

            <motion.h1
              variants={heroItemVariants}
              className="font-serif text-[clamp(44px,5.2vw,76px)] font-normal leading-[1.05] tracking-[-0.02em] text-paper mb-5"
            >
              Become who<br />
              you said <span className="italic text-gold">you&apos;d be.</span>
            </motion.h1>

            <motion.p
              variants={heroItemVariants}
              className="text-base font-light text-muted leading-[1.8] max-w-[440px] mb-8"
            >
              Understand what&apos;s holding you back. Build better habits. Make progress, one day at a time — without shame, guilt, or artificial pressure.
            </motion.p>

            <motion.div variants={heroItemVariants} className="flex flex-wrap gap-3 items-center mb-4">
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/survey"
                  className="text-sm font-medium text-ink bg-gold hover:bg-gold2 px-7 py-3.5 rounded-sm transition-colors shadow-sm tracking-[0.02em] inline-block"
                >
                  Start for free — no card needed
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/dashboard?demo=true"
                  className="text-[13px] font-light text-muted hover:text-paper hover:border-gold border border-rule2 px-5 py-3 rounded-sm transition-colors tracking-[0.02em] inline-block"
                >
                  Preview dashboard
                </Link>
              </motion.div>
            </motion.div>

            <motion.p variants={heroItemVariants} className="text-xs font-light text-faint mb-8 tracking-[0.02em]">
              30-day full access · Cancel anytime · Your data stays private
            </motion.p>

            <motion.div variants={heroItemVariants} className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["R", "A", "S", "M"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-ink3 border-[1.5px] border-ink text-[9px] font-medium text-faint flex items-center justify-center"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <p className="text-xs font-light text-faint pl-2">
                <strong className="font-medium text-paper">3,200+ people</strong> building better habits this month
              </p>
            </motion.div>
          </motion.div>

          <div className="bg-ink2 flex items-center justify-center p-8 sm:p-12 lg:p-14 relative overflow-hidden">
            {/* Ambient subtle light glow behind notebook */}
            <div
              className="absolute w-[450px] h-[450px] rounded-full bg-gold/5 blur-[90px] pointer-events-none"
              aria-hidden="true"
            />
            <HeroNotebook />
          </div>
        </section>

        {/* ── STATS STRIP (Scroll-triggered stagger) ── */}
        <motion.section
          variants={staggerGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 border-b border-rule"
        >
          <motion.div variants={cardItemVariants} className="py-9 px-8 border-b md:border-b-0 md:border-r border-rule text-center">
            <div className="font-serif text-[44px] italic text-paper leading-none mb-1.5">
              3.2k
            </div>
            <p className="text-xs font-light text-muted tracking-[0.03em]">
              clarity sessions this month
            </p>
          </motion.div>
          <motion.div variants={cardItemVariants} className="py-9 px-8 border-b md:border-b-0 md:border-r border-rule text-center">
            <div className="font-serif text-[44px] italic text-paper leading-none mb-1.5">
              &lt;12m
            </div>
            <p className="text-xs font-light text-muted tracking-[0.03em]">
              average onboarding time
            </p>
          </motion.div>
          <motion.div variants={cardItemVariants} className="py-9 px-8 text-center">
            <div className="font-serif text-[44px] italic text-paper leading-none mb-1.5">
              91%
            </div>
            <p className="text-xs font-light text-muted tracking-[0.03em]">
              surfaced something they hadn&apos;t named
            </p>
          </motion.div>
        </motion.section>

        {/* ── FEATURES / HOW IT WORKS ── */}
        <motion.section
          id="how-it-works"
          variants={staggerGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-rule"
        >
          {[
            {
              step: "1",
              title: "Self-discovery survey",
              desc: "Six focused questions that help you articulate your situation, goal, and the thing standing in the way.",
            },
            {
              step: "2",
              title: "Your personal mirror",
              desc: "Your answers reflected back clearly — your stated problem, desired future, identified obstacles, and one starting priority.",
            },
            {
              step: "3",
              title: "Personalized habits",
              desc: "1–3 small, realistic habits built around your goal. Grounded in behavior design. Editable and skippable without shame.",
            },
            {
              step: "4",
              title: "Growth dashboard",
              desc: "Daily priorities, habit tracking, a focus timer, weekly reflection, and progress history — all private and intentional.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardItemVariants}
              whileHover={{ y: -3 }}
              className="p-8 lg:p-7 border-b sm:border-r last:border-r-0 border-rule transition-colors hover:bg-ink2/30"
            >
              <span className="font-serif text-[32px] italic text-ink3 leading-none mb-3.5 block">
                {item.step}
              </span>
              <h3 className="text-[13px] font-medium text-paper mb-2 tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="text-xs font-light text-muted leading-[1.7]">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* ── FOUNDING MEMBER LAUNCH MECHANIC ── */}
        <FoundingMemberSection claimedCount={14} />

        {/* ── TESTIMONIALS ── */}
        <section className="py-16 sm:py-20 px-6 sm:px-8 border-b border-rule max-w-[1200px] mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="mb-12"
          >
            <h2 className="font-serif text-[clamp(32px,3.5vw,48px)] text-paper leading-[1.1] tracking-[-0.02em] mb-2.5">
              What clarity <em className="italic text-gold">actually</em><br />feels like
            </h2>
            <p className="text-sm font-light text-muted leading-[1.75] max-w-[400px]">
              From real people who used Mirr to understand themselves and take their next step.
            </p>
          </motion.div>

          <motion.div
            variants={staggerGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-rule border border-rule"
          >
            {[
              {
                quote: "I've been circling the same problem for a year. Writing it down and seeing it reflected back — organized — felt like the fog finally lifted.",
                author: "Riya M.",
                role: "Product designer, 24",
              },
              {
                quote: "The habits it suggested were embarrassingly small. Which is exactly why I've actually done them for three weeks.",
                author: "Arjun K.",
                role: "Engineering student, 21",
              },
              {
                quote: "I thought I lacked motivation. The mirror showed me I hadn't actually decided what I wanted. That was the real problem.",
                author: "Sahil T.",
                role: "Aspiring founder, 26",
              },
            ].map((t, idx) => (
              <motion.div
                key={idx}
                variants={cardItemVariants}
                whileHover={{ y: -3 }}
                className="bg-ink p-7 transition-colors hover:bg-[#1A1713]"
              >
                <p className="font-serif italic text-sm text-paper/75 leading-[1.75] mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-[11px] font-normal text-muted">
                  <strong className="text-paper font-medium block mb-0.5">{t.author}</strong> {t.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── SEO SEGMENT LINKS ── */}
        <section className="py-10 px-6 sm:px-8 border-b border-rule bg-ink2/30 text-center">
          <p className="text-xs font-light text-muted tracking-wide">
            Built for{" "}
            <Link href="/for/students" className="text-paper underline underline-offset-4 decoration-rule2 hover:text-gold transition-colors">
              students
            </Link>{" "}
            ·{" "}
            <Link href="/for/developers" className="text-paper underline underline-offset-4 decoration-rule2 hover:text-gold transition-colors">
              developers
            </Link>{" "}
            ·{" "}
            <Link href="/for/founders" className="text-paper underline underline-offset-4 decoration-rule2 hover:text-gold transition-colors">
              founders
            </Link>{" "}
            ·{" "}
            <Link href="/for/discipline" className="text-paper underline underline-offset-4 decoration-rule2 hover:text-gold transition-colors">
              anyone who keeps saying &apos;I&apos;ll start Monday.&apos;
            </Link>
          </p>
        </section>

        {/* ── CTA ── */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="py-20 px-6 sm:px-8 text-center border-b border-rule relative overflow-hidden"
        >
          {/* Subtle aperture light shaft */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold/5 blur-[100px] pointer-events-none -z-0"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <h2 className="font-serif text-[clamp(40px,5vw,64px)] italic text-paper leading-[1.05] tracking-[-0.02em] mb-3.5">
              Ten minutes.<br />
              One <em className="text-gold not-italic">clear</em> picture.
            </h2>
            <p className="text-[15px] font-light text-muted leading-[1.8] max-w-[420px] mx-auto mb-8">
              No credit card required. 30 days full access. Your data stays private.
            </p>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Link
                href="/survey"
                className="text-[15px] font-medium text-ink bg-gold hover:bg-gold2 px-8 py-3.5 rounded-sm transition-colors shadow-md inline-block"
              >
                Start for free — no card needed
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
