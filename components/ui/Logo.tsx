import React from "react";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  showText?: boolean;
}

export function MirrLogoMark({
  className = "w-6 h-auto",
  width,
  height,
  fill = "#FC5111",
}: {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 521 470"
      fill="none"
      className={className}
      width={width}
      height={height}
      aria-label="Mirr Logo"
    >
      {/* Left Wing (Vivid Orange Facet) */}
      <path
        d="M40.0 17.0 L47.0 17.0 L62.0 24.0 L251.0 160.0 L224.0 333.0 L220.0 347.0 L206.0 362.0 L74.0 444.0 L57.0 452.0 L43.0 452.0 L29.0 445.0 L21.0 435.0 L17.0 422.0 L17.0 43.0 L24.0 26.0 L31.0 20.0 L40.0 17.0 Z"
        fill={fill}
      />
      {/* Right Wing (Vivid Orange Facet) */}
      <path
        d="M472.0 17.0 L482.0 17.0 L494.0 23.0 L500.0 32.0 L503.0 43.0 L503.0 418.0 L500.0 431.0 L492.0 443.0 L478.0 451.0 L463.0 452.0 L448.0 446.0 L308.0 360.0 L298.0 350.0 L291.0 329.0 L267.0 160.0 L456.0 25.0 L472.0 17.0 Z"
        fill={fill}
      />
    </svg>
  );
}

const SIZE_MAP = {
  xs: { icon: "w-3.5 h-auto", text: "text-xs" },
  sm: { icon: "w-5 h-auto", text: "text-sm sm:text-base font-semibold" },
  md: { icon: "w-6 h-auto", text: "text-base sm:text-lg font-semibold" },
  lg: { icon: "w-8 h-auto", text: "text-lg sm:text-xl font-bold" },
  xl: { icon: "w-12 h-auto", text: "text-2xl sm:text-3xl font-bold" },
};

export function Logo({
  className = "",
  iconClassName = "",
  textClassName = "",
  size = "md",
  showText = true,
}: LogoProps) {
  const sizeConfig = typeof size === "string" ? SIZE_MAP[size] : null;
  const iconClass = sizeConfig ? sizeConfig.icon : "w-6 h-auto";
  const defaultTextClass = sizeConfig ? sizeConfig.text : "text-base font-semibold";

  return (
    <div className={`inline-flex items-center gap-2 group select-none ${className}`}>
      <div className="relative flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
        <MirrLogoMark
          className={`${iconClass} ${iconClassName}`}
          width={typeof size === "number" ? size : undefined}
          height={typeof size === "number" ? Math.round(size * (470 / 521)) : undefined}
        />
      </div>

      {showText && (
        <span
          className={`tracking-tight text-foreground font-sans ${defaultTextClass} ${textClassName}`}
        >
          Mirr
        </span>
      )}
    </div>
  );
}
