import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 sm:p-10 rounded-card bg-surface border border-border text-center space-y-4 max-w-[480px] mx-auto select-none ${className}`}
    >
      <div className="w-12 h-12 rounded-card-sm bg-surface-muted text-foreground-secondary border border-border flex items-center justify-center mx-auto">
        <Icon size={22} strokeWidth={1.75} />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-[13px] text-foreground-secondary leading-relaxed max-w-[360px] mx-auto">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

