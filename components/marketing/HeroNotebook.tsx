"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHIP_EXAMPLES: Record<string, string> = {
  Career: "I want to be building my own product, not just executing…",
  Discipline: "I want to stop negotiating with myself every single morning…",
  Confidence: "I want to trust my own voice in rooms that matter…",
  Routine: "I want mornings where I don't touch my phone for the first hour…",
};

export function HeroNotebook() {
  const [activeChip, setActiveChip] = useState("Career");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className="w-full max-w-[400px] bg-ink3 border border-rule2 rounded-[4px] overflow-hidden shadow-2xl transition-shadow duration-300"
    >
      <div className="bg-ink2 px-3.5 py-2.5 border-b border-rule flex items-center gap-1.5">
        <div className="w-[9px] h-[9px] rounded-full bg-[#E87C7C]" />
        <div className="w-[9px] h-[9px] rounded-full bg-[#E8C47C]" />
        <div className="w-[9px] h-[9px] rounded-full bg-[#7CE87C]" />
        <span className="text-[11px] text-faint ml-2 tracking-[0.04em]">mirr.app/survey</span>
      </div>

      <div className="p-6">
        <p className="text-[10px] tracking-[0.1em] text-gold mb-2.5 font-normal">
          Step 2 of 6 — Your goal
        </p>
        <p className="font-serif text-[18px] italic text-paper leading-[1.35] mb-4">
          &ldquo;What do you want your life to look like in 1–2 years?&rdquo;
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {Object.keys(CHIP_EXAMPLES).map((chip) => {
            const isSelected = activeChip === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveChip(chip)}
                className={`relative text-[11px] font-light px-2.5 py-1 rounded-sm tracking-[0.02em] transition-colors duration-200 ${
                  isSelected ? "text-gold font-normal" : "text-faint hover:text-paper"
                }`}
              >
                {/* Smooth Morphing Pill */}
                {isSelected ? (
                  <motion.span
                    layoutId="heroChipActive"
                    className="absolute inset-0 rounded-sm border border-gold bg-gold/10 -z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                ) : (
                  <span className="absolute inset-0 rounded-sm border border-rule2 -z-0" />
                )}
                <span className="relative z-10">{chip}</span>
              </button>
            );
          })}
        </div>

        {/* Animated preview text */}
        <div className="bg-ink2 border-b border-rule py-2.5 px-0 font-serif italic text-[13px] text-paper/70 w-full mb-3.5 tracking-[0.01em] min-h-[42px] flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeChip}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="line-clamp-2"
            >
              &ldquo;{CHIP_EXAMPLES[activeChip]}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="h-[2px] bg-rule mt-1.5 overflow-hidden">
          <motion.div
            className="h-full w-1/3 bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
        </div>
        <p className="text-[10px] text-faint mt-1.5 text-right tracking-[0.04em]">
          2 of 6 answered
        </p>
      </div>
    </motion.div>
  );
}
