"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export function FAQAccordion({ items, className = "" }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className={`space-y-3 max-w-[680px] mx-auto select-none ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-card bg-surface transition-all duration-150 overflow-hidden ${
              isOpen ? "border-border-strong shadow-subtle" : "border-border hover:border-border-strong"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 outline-none cursor-pointer"
            >
              <span className="text-base font-semibold text-foreground tracking-tight">
                {item.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-foreground-secondary shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-foreground-secondary leading-relaxed border-t border-border/50 pt-3">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

