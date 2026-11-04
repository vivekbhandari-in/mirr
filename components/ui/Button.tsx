import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { LucideIcon, ArrowRight } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "recovery";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  withCircularArrow?: boolean;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      icon: Icon,
      iconRight: IconRight,
      withCircularArrow = false,
      className = "",
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles: pill shape by default, accessible focus, font weights, no text wrap
    const baseStyles =
      "inline-flex flex-row items-center justify-center gap-2 rounded-full select-none transition-all duration-150 outline-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer whitespace-nowrap active:scale-[0.98]";

    // Variants
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-primary hover:bg-primary-hover text-white font-medium shadow-sm hover:shadow",
      secondary:
        "bg-surface hover:bg-surface-elevated text-foreground border border-border font-medium shadow-subtle",
      outline:
        "bg-transparent hover:bg-surface-elevated text-foreground border border-border-strong font-medium",
      ghost:
        "bg-transparent hover:bg-surface-elevated text-foreground-secondary hover:text-foreground font-normal",
      danger:
        "bg-danger/10 hover:bg-danger/20 text-danger border border-danger/25 font-medium",
      recovery:
        "bg-recovery hover:bg-recovery/90 text-white font-medium shadow-sm",
    };

    // Sizes
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "h-8 px-3.5 text-xs gap-1.5",
      md: "h-10 px-5 text-[13px] sm:text-sm gap-2",
      lg: "h-12 px-6 text-sm sm:text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {Icon && <Icon size={size === "sm" ? 14 : 18} className="flex-shrink-0" />}
        {children}
        {IconRight && <IconRight size={size === "sm" ? 14 : 18} className="flex-shrink-0" />}
        {withCircularArrow && (
          <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 ml-0.5">
            <ArrowRight size={11} className="stroke-[2.5]" />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
