"use client";

import { useState } from "react";
import { ArrowRight, Check, Sparkles, CircleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface MissedActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMissed: (reason: string, recoveryRecommendation: string) => void;
  anchor: string;
}

const MISSED_REASONS = [
  {
    id: "Distraction",
    label: "Distraction",
    recommendation: "Enable a 25-minute focus block and keep your phone in another room.",
  },
  {
    id: "Low energy",
    label: "Low energy",
    recommendation: "Use the minimum version after lunch or when energy dips.",
  },
  {
    id: "No time",
    label: "No time",
    recommendation: "Move the action before your first meeting or morning commitments.",
  },
  {
    id: "Too hard",
    label: "Too hard",
    recommendation: "Tomorrow, start with the 10-minute version. Shrink the friction.",
  },
  {
    id: "Forgot",
    label: "Forgot",
    recommendation: "Set the anchor firmly: right after morning coffee.",
  },
  {
    id: "Something else",
    label: "Something else",
    recommendation: "Strip away all expectations. One 2-minute micro-proof is enough.",
  },
];

export function MissedActionModal({
  isOpen,
  onClose,
  onConfirmMissed,
  anchor,
}: MissedActionModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSelection = MISSED_REASONS.find((r) => r.id === selectedReason);

  const handleConfirm = () => {
    if (!currentSelection) return;
    onConfirmMissed(currentSelection.label, currentSelection.recommendation);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="What got in the way?"
      description="Select the friction point. We use this to adapt tomorrow's prompt without guilt or judgment."
      maxWidth="md"
    >
      <div className="space-y-5 pt-1">
        {/* Reason Selector Pills */}
        <div className="grid grid-cols-2 gap-2">
          {MISSED_REASONS.map((reason) => {
            const isSelected = selectedReason === reason.id;
            return (
              <button
                key={reason.id}
                type="button"
                onClick={() => setSelectedReason(reason.id)}
                className={`px-3 py-2.5 rounded-btn text-left text-xs transition-colors border outline-none ${
                  isSelected
                    ? "bg-warning/15 border-warning text-foreground font-medium"
                    : "bg-surface-muted border-border text-foreground-secondary hover:text-foreground hover:bg-surface-elevated"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{reason.label}</span>
                  {isSelected && <Check size={14} className="text-warning" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Personalized Recovery Recommendation */}
        {currentSelection && (
          <div className="p-4 rounded-input bg-surface-muted border border-border space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-recovery tracking-wider">
              <Sparkles size={12} />
              <span>Mirr Recovery Recommendation</span>
            </div>

            <p className="text-xs text-foreground leading-relaxed">
              {currentSelection.recommendation}
            </p>

            <div className="pt-2 border-t border-border text-[11px] text-foreground-secondary leading-relaxed italic">
              “You drifted today. That does not erase your progress. Tomorrow’s return action is ready.”
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="secondary"
            size="md"
            disabled={!selectedReason}
            onClick={handleConfirm}
            iconRight={ArrowRight}
          >
            Acknowledge &amp; Ready Return
          </Button>
        </div>
      </div>
    </Modal>
  );
}
