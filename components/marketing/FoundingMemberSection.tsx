"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FoundingCounter } from "../growth/FoundingCounter";

interface FoundingMemberSectionProps {
  claimedCount?: number;
}

export function FoundingMemberSection({ claimedCount = 14 }: FoundingMemberSectionProps) {
  const isClosed = claimedCount >= 50;

  return (
    <section className="border-b border-rule bg-ink2/60 relative overflow-hidden py-16 px-6 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1000px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="flex-1 text-left">
          <div className="mb-4">
            <FoundingCounter initialCount={claimedCount} totalSpots={50} />
          </div>

          <h2 className="font-serif text-[clamp(28px,3vw,38px)] text-paper leading-[1.15] mb-3">
            {isClosed ? (
              <>Founding membership is now closed.</>
            ) : (
              <>
                Founding Member — <span className="italic text-gold">$49 lifetime</span>
              </>
            )}
          </h2>

          <p className="text-sm font-light text-muted leading-relaxed max-w-[540px] mb-4">
            {isClosed
              ? "All 50 founding member spots have been claimed. You can still experience Mirr with 30 days completely free."
              : "For the first 50 believers who want lifetime access to every Pro feature we ever build, a permanent spot on our founding wall, and a direct line to the founder."}
          </p>

          {!isClosed && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-faint mb-2">
              <li className="flex items-center gap-2">
                <span className="text-gold">✓</span> Everything in Pro, forever (no recurring charge)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">✓</span> Name in the Founding Members wall
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">✓</span> Direct WhatsApp / email line for feedback
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gold">✓</span> Honest cap: automatically locks after 50 sales
              </li>
            </ul>
          )}
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 flex-shrink-0">
          {isClosed ? (
            <Link
              href="/pricing"
              className="text-sm font-medium text-ink bg-gold hover:bg-gold2 px-7 py-3 rounded-sm transition-all shadow-sm"
            >
              Join Pro
            </Link>
          ) : (
            <>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/pricing?tier=founding"
                  className="text-sm font-medium text-ink bg-gold hover:bg-gold2 px-8 py-3.5 rounded-sm transition-all shadow-md active:translate-y-0 text-center block"
                >
                  Claim your spot — $49
                </Link>
              </motion.div>
              <span className="text-[11px] font-light text-faint">
                One-time payment · No subscription
              </span>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
