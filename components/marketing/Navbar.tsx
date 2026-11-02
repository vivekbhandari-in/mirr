"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center justify-between px-6 sm:px-8 transition-colors duration-200 border-b border-rule backdrop-blur-md ${
        scrolled ? "bg-ink/95" : "bg-ink/90"
      }`}
    >
      <Link
        href="/"
        className="font-serif text-[19px] text-paper tracking-[-0.01em] hover:text-white transition-colors"
      >
        Mirr<em className="text-gold not-italic">.</em>
      </Link>

      <div className="flex items-center gap-5 sm:gap-6">
        <Link
          href="/#how-it-works"
          className="text-xs font-light text-faint tracking-[0.04em] hover:text-paper transition-colors py-1 hidden sm:inline-block"
        >
          How it works
        </Link>
        <Link
          href="/wall"
          className="text-xs font-light text-faint tracking-[0.04em] hover:text-paper transition-colors py-1 hidden sm:inline-block"
        >
          Wall of change
        </Link>
        <Link
          href="/pricing"
          className="text-xs font-light text-faint tracking-[0.04em] hover:text-paper transition-colors py-1"
        >
          Pricing
        </Link>
        <Link
          href="/login"
          className="text-xs font-light text-faint tracking-[0.04em] hover:text-paper transition-colors py-1"
        >
          Sign in
        </Link>
        <Link
          href="/survey"
          className="text-xs font-medium text-ink bg-gold hover:bg-gold2 px-4 py-[7px] rounded-sm transition-all duration-200 tracking-[0.03em] shadow-sm active:scale-[0.98]"
        >
          Start for free
        </Link>
      </div>

      {/* Minimalist 1.5px gold scroll progress indicator */}
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A96E] pointer-events-none"
        aria-hidden="true"
      />
    </nav>
  );
}
