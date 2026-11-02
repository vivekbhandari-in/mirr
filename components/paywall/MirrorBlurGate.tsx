"use client";

import { motion } from "framer-motion";

interface MirrorBlurGateProps {
  area: string;
  onUnlock: () => void;
}

export function MirrorBlurGate({ area, onUnlock }: MirrorBlurGateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[520px] bg-[#15120F] border border-[#2B231B] rounded-md p-8 sm:p-10 shadow-2xl text-center text-[#EDE8E0] relative"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block mb-3 animate-pulse" />

        <p className="text-[10px] font-medium tracking-[0.12em] text-gold uppercase mb-2">
          Diagnostic Synthesis Complete
        </p>

        <h2 className="font-serif text-3xl sm:text-4xl italic text-[#F5F0E8] leading-tight mb-3">
          Your mirror is ready.
        </h2>

        <p className="text-xs sm:text-sm font-light text-[#9E958A] leading-relaxed max-w-[420px] mx-auto mb-7">
          We analyzed your reality in <strong className="font-medium text-[#EDE8E0]">{area}</strong>, pinpointed your internal friction, and calibrated 3 atomic habits for your daily window.
        </p>

        {/* Sneak peek mirror tags */}
        <div className="bg-[#0E0C0A] border border-[#241E18] rounded-sm p-4 mb-7 text-left space-y-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-gold text-xs">✓</span>
            <span className="text-xs text-[#EDE8E0] font-medium">Unfiltered reflection of your current obstacle</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-gold text-xs">✓</span>
            <span className="text-xs text-[#EDE8E0] font-medium">3 calibrated atomic habits (under 2m fallback)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-gold text-xs">✓</span>
            <span className="text-xs text-[#EDE8E0] font-medium">Strategic starting point &amp; daily focus timer</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onUnlock}
          className="w-full py-3.5 px-6 rounded-sm bg-gold hover:bg-gold/90 text-ink font-medium text-sm tracking-[0.02em] transition-all transform hover:-translate-y-0.5 shadow-lg active:translate-y-0"
        >
          Enter Your Sanctuary — Free for 30 Days
        </button>

        <p className="text-[11px] font-light text-[#756C60] mt-4 tracking-wide">
          No credit card required · Instant access · Stored privately
        </p>
      </motion.div>
    </div>
  );
}
