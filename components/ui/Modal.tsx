"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: "max-w-[420px]",
    md: "max-w-[520px]",
    lg: "max-w-[640px]",
    xl: "max-w-[760px]",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-surface border border-border rounded-modal shadow-modal p-6 sm:p-7 z-10 select-none overflow-hidden`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-border mb-5">
            <div className="space-y-1">
              {title && (
                <h2 className="text-lg font-semibold text-foreground tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-[13px] text-foreground-secondary leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-foreground-secondary hover:text-foreground hover:bg-surface-elevated transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {children}
      </motion.div>
    </div>
  );
}

