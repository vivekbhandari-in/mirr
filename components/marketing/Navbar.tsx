"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/Button";

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
      className={`fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center justify-between px-6 sm:px-8 transition-colors duration-150 border-b border-border backdrop-blur-md ${
        scrolled ? "bg-background/95" : "bg-background/85"
      }`}
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 group font-semibold text-lg tracking-tight text-foreground"
      >
        <span>Mirr</span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform" />
      </Link>

      <div className="flex items-center gap-5 sm:gap-6">
        <Link
          href="/#how-it-works"
          className="text-[13px] font-normal text-foreground-secondary hover:text-foreground transition-colors py-1 hidden sm:inline-block"
        >
          How it works
        </Link>
        <Link
          href="/wall"
          className="text-[13px] font-normal text-foreground-secondary hover:text-foreground transition-colors py-1 hidden sm:inline-block"
        >
          Wall of honesty
        </Link>
        <Link
          href="/pricing"
          className="text-[13px] font-normal text-foreground-secondary hover:text-foreground transition-colors py-1"
        >
          Pricing
        </Link>
        <Link
          href="/login"
          className="text-[13px] font-normal text-foreground-secondary hover:text-foreground transition-colors py-1"
        >
          Sign in
        </Link>
        <Link href="/survey">
          <Button variant="primary" size="sm">
            Start for free
          </Button>
        </Link>
      </div>

      {/* Minimalist 1.5px indigo scroll progress indicator */}
      <motion.div
        style={{ scaleX, transformOrigin: "left" }}
        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary pointer-events-none"
        aria-hidden="true"
      />
    </nav>
  );
}
