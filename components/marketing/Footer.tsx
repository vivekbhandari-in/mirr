import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-8 py-7 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-rule bg-ink">
      <Link
        href="/"
        className="font-serif italic text-base text-paper/30 hover:text-paper/60 transition-colors"
      >
        Mirr.
      </Link>

      <span className="text-[11px] font-light text-paper/40 tracking-[0.03em] text-center">
        © 2026 · No card required · Data never sold · GDPR compliant · Delete your account anytime
      </span>

      <div className="flex gap-5 text-[11px] font-light text-paper/40">
        <Link href="/wall" className="hover:text-faint transition-colors">
          Wall of change
        </Link>
        <Link href="/pricing" className="hover:text-faint transition-colors">
          Pricing
        </Link>
        <Link href="/about" className="hover:text-faint transition-colors">
          About
        </Link>
        <Link href="/privacy" className="hover:text-faint transition-colors">
          Privacy
        </Link>
      </div>
    </footer>
  );
}

