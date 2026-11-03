import React from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "recovery"
  | "warning"
  | "danger"
  | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({
  variant = "neutral",
  children,
  dot = false,
  className = "",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    primary: "bg-primary-soft text-primary border-primary/25",
    success: "bg-success/10 text-success border-success/25",
    recovery: "bg-recovery/10 text-recovery border-recovery/25",
    warning: "bg-warning/10 text-warning border-warning/25",
    danger: "bg-danger/10 text-danger border-danger/25",
    neutral: "bg-surface-muted text-foreground-secondary border-border",
  };

  const dotColors: Record<BadgeVariant, string> = {
    primary: "bg-primary",
    success: "bg-success",
    recovery: "bg-recovery",
    warning: "bg-warning",
    danger: "bg-danger",
    neutral: "bg-foreground-muted",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill border text-[11px] font-mono tracking-tight font-medium ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
}

