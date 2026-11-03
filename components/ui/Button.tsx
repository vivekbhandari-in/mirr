import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "recovery";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      icon: Icon,
      iconRight: IconRight,
      className = "",
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles: 8px radius, accessible focus, font weights, no text wrap
    const baseStyles =
      "inline-flex flex-row items-center justify-center gap-2 rounded-btn select-none transition-colors duration-150 outline-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer whitespace-nowrap";

    // Variants
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-primary hover:bg-primary-hover text-foreground-inverse font-semibold shadow-sm active:scale-[0.99]",
      secondary:
        "bg-transparent hover:bg-surface-elevated text-foreground border border-border font-normal active:scale-[0.99]",
      ghost:
        "bg-transparent hover:bg-surface-elevated text-foreground-secondary hover:text-foreground font-normal",
      danger:
        "bg-danger/15 hover:bg-danger/25 text-danger border border-danger/30 font-medium active:scale-[0.99]",
      recovery:
        "bg-recovery hover:bg-recovery/90 text-foreground-inverse font-semibold shadow-sm active:scale-[0.99]",
    };

    // Sizes
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-[13px]",
      lg: "h-12 px-6 text-sm",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {Icon && <Icon size={18} className="flex-shrink-0" />}
        {children}
        {IconRight && <IconRight size={18} className="flex-shrink-0" />}
      </button>
    );
  }
);

Button.displayName = "Button";
