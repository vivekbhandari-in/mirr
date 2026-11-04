import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-[13px] font-medium text-foreground-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-11 px-3.5 bg-surface text-foreground border border-border rounded-input text-[14px] placeholder:text-foreground-muted outline-none transition-all duration-150 focus:border-primary focus:ring-4 focus:ring-primary-soft shadow-subtle disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-danger focus:border-danger focus:ring-danger/20" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-foreground-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", rows = 3, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label className="block text-[13px] font-medium text-foreground-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full p-3.5 bg-surface text-foreground border border-border rounded-input text-[14px] placeholder:text-foreground-muted outline-none transition-all duration-150 focus:border-primary focus:ring-4 focus:ring-primary-soft shadow-subtle disabled:opacity-50 disabled:cursor-not-allowed resize-none leading-relaxed ${
            error ? "border-danger focus:border-danger focus:ring-danger/20" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-foreground-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
