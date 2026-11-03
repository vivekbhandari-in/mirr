import React, { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  interactive = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  const paddingStyles = {
    none: "p-0",
    sm: "p-4 sm:p-5",
    md: "p-5 sm:p-6", // 20-24px
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={`bg-surface border border-border rounded-card ${paddingStyles[padding]} ${
        interactive
          ? "hover:border-border-strong hover:bg-surface-elevated/40 transition-colors duration-150 cursor-pointer"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-base font-semibold text-foreground tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[15px] text-foreground-secondary leading-relaxed ${className}`}
    >
      {children}
    </p>
  );
}

