"use client";

import { useState } from "react";

interface ShareMirrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  area: string;
  problem: string;
  futureVision: string;
  blocker: string;
  habitsCount: number;
}

export function ShareMirrorModal({
  isOpen,
  onClose,
  area,
  problem,
  futureVision,
  blocker,
  habitsCount,
}: ShareMirrorModalProps) {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateSlug = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mirror/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          area,
          problem_summary: problem,
          future_summary: futureVision,
          blocker_summary: blocker,
          habits_count: habitsCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSlug(data.slug);
      } else {
        // Fallback slug for local offline use
        const fallback = Math.random().toString(36).substring(2, 9);
        setSlug(fallback);
      }
    } catch {
      const fallback = Math.random().toString(36).substring(2, 9);
      setSlug(fallback);
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = typeof window !== "undefined" && slug ? `${window.location.origin}/m/${slug}` : "";

  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#15120F] rounded-md p-7 sm:p-8 w-full max-w-[480px] shadow-2xl border border-[#2B231B] text-[#EDE8E0] relative">
        <h3 className="font-serif text-2xl italic text-[#F5F0E8] mb-2 tracking-tight">
          Share Your Mirror
        </h3>
        <p className="text-xs font-light text-[#9E958A] leading-relaxed mb-6">
          Generate an anonymous, read-only link showcasing your growth focus and active habits. Your name and private reflections are never revealed.
        </p>

        {!slug ? (
          <div className="space-y-4">
            <div className="bg-[#0E0C0A] border border-[#241E18] rounded-sm p-4 text-xs text-[#9E958A] space-y-1.5">
              <p>
                <strong className="text-[#EDE8E0] font-medium">Focus Area:</strong> {area}
              </p>
              <p>
                <strong className="text-[#EDE8E0] font-medium">Active Habits:</strong> {habitsCount}
              </p>
              <p className="text-[11px] text-[#756C60]">
                Stated problem and vision are summarized anonymously.
              </p>
            </div>

            <div className="flex gap-2.5 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-normal text-[#9E958A] hover:text-[#EDE8E0] border border-[#26211C] hover:border-gold/40 px-4 py-2 rounded-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateSlug}
                disabled={loading}
                className="text-xs font-medium text-ink bg-gold hover:bg-gold/90 px-5 py-2 rounded-sm transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? "Generating Link…" : "Generate Share Link"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#9E958A] mb-1.5 uppercase tracking-[0.05em]">
                Your Anonymous Mirror URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="w-full bg-[#0E0C0A] border border-[#241E18] rounded-sm px-3 py-2 text-xs text-gold select-all outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-medium bg-gold hover:bg-gold/90 text-ink px-4 py-2 rounded-sm flex-shrink-0 transition-all shadow-sm"
                >
                  {copied ? "Copied ✓" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-[#231E18]">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Looking at my mirror with @getmirr — clarity on my habits and where I'm going:\n${shareUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gold hover:underline flex items-center gap-1"
              >
                <span>Share on X</span>
                <span>↗</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="text-xs font-normal text-[#9E958A] hover:text-[#EDE8E0] px-3 py-1.5"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
