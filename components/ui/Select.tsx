import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-[13px] font-medium text-foreground-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full h-11 px-3.5 pr-10 bg-surface text-foreground border border-border rounded-input text-[14px] outline-none transition-all duration-150 focus:border-primary focus:ring-4 focus:ring-primary-soft shadow-subtle appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              error ? "border-danger focus:border-danger focus:ring-danger/20" : ""
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-foreground-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

