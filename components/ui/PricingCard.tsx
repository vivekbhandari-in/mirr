import React from "react";
import { Check } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaLabel: string;
  popular?: boolean;
  highlighted?: boolean;
}

export interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (planId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function PricingCard({
  plan,
  onSelect,
  isLoading = false,
  className = "",
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-card bg-surface border transition-all duration-200 select-none ${
        plan.highlighted
          ? "border-primary shadow-card ring-1 ring-primary/20"
          : "border-border shadow-subtle hover:border-border-strong"
      } ${className}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="primary" className="px-3 py-1 text-xs">
            Most thoughtful
          </Badge>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {plan.name}
          </h3>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            {plan.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 pt-2">
          <span className="text-4xl font-mono font-bold tracking-tight text-foreground">
            {plan.price}
          </span>
          <span className="text-sm font-mono text-foreground-muted">
            /{plan.period}
          </span>
        </div>

        <div className="w-full h-px bg-border my-4" />

        {/* Features List */}
        <ul className="space-y-3 text-sm text-foreground-secondary">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="stroke-[2.5]" />
              </span>
              <span className="leading-snug text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <div className="pt-8">
        <Button
          variant={plan.highlighted ? "primary" : "secondary"}
          size="lg"
          withCircularArrow={plan.highlighted}
          className="w-full"
          disabled={isLoading}
          onClick={() => onSelect(plan.id)}
        >
          {isLoading ? "Preparing..." : plan.ctaLabel}
        </Button>
      </div>
    </div>
  );
}

