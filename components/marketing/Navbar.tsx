"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Supabase auth subscription
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userInitial = (user?.user_metadata?.full_name || user?.email || "U").trim().charAt(0).toUpperCase();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[56px] flex items-center justify-between px-5 sm:px-8 transition-colors duration-150 border-b border-border backdrop-blur-md ${
          scrolled || mobileMenuOpen ? "bg-background/95" : "bg-background/85"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 group font-semibold text-lg tracking-tight text-foreground py-2"
        >
          <span>Mirr</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:scale-125 transition-transform" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex items-center gap-5 sm:gap-6">
          <Link
            href="/#how-it-works"
            className="text-[13px] font-normal text-foreground-secondary hover:text-foreground transition-colors py-2"
          >
            How it works
          </Link>
          <Link
            href="/wall"
            className="text-[13px] font-normal text-foreground-secondary hover:text-foreground transition-colors py-2"
          >
            Wall of honesty
          </Link>
          <Link
            href="/pricing"
            className="text-[13px] font-normal text-foreground-secondary hover:text-foreground transition-colors py-2"
          >
            Pricing
          </Link>

          {mounted && user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[13px] font-medium text-foreground hover:text-primary transition-colors py-2"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 group"
                title="Your Profile"
              >
                <div className="w-8 h-8 rounded-card-sm bg-surface-elevated border border-border group-hover:border-primary overflow-hidden flex items-center justify-center transition-colors shadow-sm">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-mono font-semibold text-primary">
                      {userInitial}
                    </span>
                  )}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-normal text-foreground-secondary hover:text-foreground transition-colors py-2"
              >
                Sign in
              </Link>
              <Link href="/survey">
                <Button variant="primary" size="sm">
                  Start for free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions: CTA + Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          {mounted && user ? (
            <Link href="/dashboard">
              <Button variant="primary" size="sm" className="min-h-[36px]">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/survey">
              <Button variant="primary" size="sm" className="min-h-[36px]">
                Start
              </Button>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground-secondary hover:text-foreground hover:bg-surface-elevated rounded-btn transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Minimalist 1.5px indigo scroll progress indicator */}
        <motion.div
          style={{ scaleX, transformOrigin: "left" }}
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary pointer-events-none"
          aria-hidden="true"
        />
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-[56px] left-0 right-0 z-40 bg-surface/98 backdrop-blur-xl border-b border-border p-6 shadow-2xl sm:hidden space-y-4"
          >
            <div className="space-y-1">
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary py-3 border-b border-border/50 min-h-[44px]"
              >
                <span>How it works</span>
                <ArrowRight size={14} className="text-foreground-muted" />
              </Link>
              <Link
                href="/wall"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary py-3 border-b border-border/50 min-h-[44px]"
              >
                <span>Wall of honesty</span>
                <ArrowRight size={14} className="text-foreground-muted" />
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary py-3 border-b border-border/50 min-h-[44px]"
              >
                <span>Pricing</span>
                <ArrowRight size={14} className="text-foreground-muted" />
              </Link>

              {mounted && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary py-3 border-b border-border/50 min-h-[44px]"
                  >
                    <span>Dashboard</span>
                    <ArrowRight size={14} className="text-foreground-muted" />
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary py-3 min-h-[44px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-btn bg-surface-elevated border border-border flex items-center justify-center overflow-hidden shrink-0">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] font-mono font-semibold text-primary">
                            {userInitial}
                          </span>
                        )}
                      </div>
                      <span>Your Profile</span>
                    </div>
                    <ArrowRight size={14} className="text-foreground-muted" />
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary py-3 min-h-[44px]"
                >
                  <span>Sign in</span>
                  <ArrowRight size={14} className="text-foreground-muted" />
                </Link>
              )}
            </div>

            <div className="pt-2">
              {mounted && user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                  <Button variant="primary" size="lg" className="w-full min-h-[44px]">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/survey" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                  <Button variant="primary" size="lg" className="w-full min-h-[44px]">
                    Take 3-minute diagnostic
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
