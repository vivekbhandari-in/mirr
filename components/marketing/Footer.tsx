import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="px-6 sm:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border bg-background">
      <Link
        href="/"
        className="flex items-center text-foreground-secondary hover:text-foreground transition-colors"
        aria-label="Mirr Home"
      >
        <Logo size="xs" showText textClassName="text-sm font-semibold" />
      </Link>

      <span className="text-[12px] text-foreground-muted tracking-tight text-center">
        © 2026 Mirr · No card required · Zero guilt · Complete data sovereignty
      </span>

      <div className="flex gap-5 text-[12px] text-foreground-secondary">
        <Link href="/wall" className="hover:text-foreground transition-colors">
          Wall of honesty
        </Link>
        <Link href="/pricing" className="hover:text-foreground transition-colors">
          Pricing
        </Link>
        <Link href="/about" className="hover:text-foreground transition-colors">
          About
        </Link>
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
