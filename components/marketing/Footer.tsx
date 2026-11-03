import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 sm:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-border bg-background">
      <Link
        href="/"
        className="font-semibold text-sm text-foreground-secondary hover:text-foreground transition-colors flex items-center gap-1"
      >
        <span>Mirr</span>
        <span className="w-1 h-1 rounded-full bg-primary" />
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
