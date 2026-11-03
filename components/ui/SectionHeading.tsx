import React from "react";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  level?: "display" | "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = "h2",
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`space-y-1.5 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-[11px] font-mono uppercase tracking-wider text-primary block">
          {eyebrow}
        </span>
      )}

      {level === "display" && (
        <h1 className="text-[28px] sm:text-[32px] leading-[36px] sm:leading-[38px] font-semibold text-foreground tracking-[-0.01em]">
          {title}
        </h1>
      )}

      {level === "h1" && (
        <h1 className="text-[22px] sm:text-[24px] leading-[28px] sm:leading-[30px] font-semibold text-foreground tracking-[-0.01em]">
          {title}
        </h1>
      )}

      {level === "h2" && (
        <h2 className="text-[18px] sm:text-[20px] leading-[24px] sm:leading-[26px] font-semibold text-foreground tracking-tight">
          {title}
        </h2>
      )}

      {level === "h3" && (
        <h3 className="text-[15px] sm:text-[16px] leading-[20px] sm:leading-[22px] font-semibold text-foreground tracking-tight">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-[14px] sm:text-[15px] leading-[22px] text-foreground-secondary font-normal max-w-[600px]">
          {description}
        </p>
      )}
    </div>
  );
}

