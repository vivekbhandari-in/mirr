"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PersonalMirror } from "@/types/identity";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface EditMirrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mirror: PersonalMirror;
  onSave: (updated: PersonalMirror) => void;
}

export function EditMirrorModal({
  isOpen,
  onClose,
  mirror,
  onSave,
}: EditMirrorModalProps) {
  const [formData, setFormData] = useState<PersonalMirror>(mirror);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Calibrate Identity Contract"
      description="Update your stated declarations, anti-future, and daily action parameters."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Desired Identity */}
        <Input
          label="I am becoming (Desired Identity)"
          value={formData.desiredIdentity}
          onChange={(e) =>
            setFormData({ ...formData, desiredIdentity: e.target.value })
          }
          placeholder="A disciplined developer who ships consistently"
          required
        />

        {/* Anti-Future */}
        <Input
          label="I refuse to become (Anti-Future)"
          value={formData.antiFuture}
          onChange={(e) =>
            setFormData({ ...formData, antiFuture: e.target.value })
          }
          placeholder="Someone who consumes content but never finishes what they start"
          required
        />

        {/* Current Reality & Blocker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Textarea
            label="Current Reality"
            rows={2}
            value={formData.currentReality}
            onChange={(e) =>
              setFormData({ ...formData, currentReality: e.target.value })
            }
          />

          <Textarea
            label="Main Blocker"
            rows={2}
            value={formData.mainBlocker}
            onChange={(e) =>
              setFormData({ ...formData, mainBlocker: e.target.value })
            }
          />
        </div>

        {/* Today's Action Blueprint */}
        <div className="pt-2 border-t border-border space-y-3">
          <span className="text-[11px] font-mono uppercase text-primary tracking-wider block">
            Today&apos;s Action Blueprint
          </span>

          <Input
            label="Action Title"
            value={formData.todayAction.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                todayAction: {
                  ...formData.todayAction,
                  title: e.target.value,
                },
              })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Anchor (Trigger)"
              value={formData.todayAction.anchor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  todayAction: {
                    ...formData.todayAction,
                    anchor: e.target.value,
                  },
                })
              }
            />

            <Input
              label="Duration (Minutes)"
              type="number"
              min={5}
              max={120}
              value={formData.todayAction.duration}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  todayAction: {
                    ...formData.todayAction,
                    duration: parseInt(e.target.value, 10) || 25,
                  },
                })
              }
            />
          </div>

          <Input
            label="Minimum Version (Too small to fail)"
            value={formData.todayAction.minimumVersion}
            onChange={(e) =>
              setFormData({
                ...formData,
                todayAction: {
                  ...formData.todayAction,
                  minimumVersion: e.target.value,
                },
              })
            }
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="md"
            type="submit"
            icon={Check}
          >
            Save Contract
          </Button>
        </div>
      </form>
    </Modal>
  );
}
