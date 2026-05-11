import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface BadgeProps extends React.ComponentProps<"div"> {
  variant?: "default" | "outline" | "translucent";
  className?: string;
  children?: React.ReactNode;
}

// Adapting the `configurator-option-chip` aesthetic for Badges
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-pill px-[12px] py-[6px] text-caption transition-colors",
        {
          "bg-[var(--color-ink)] text-[var(--color-on-dark)]": variant === "default",
          "bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline)]": variant === "outline",
          "bg-[var(--color-surface-chip-translucent)] text-[var(--color-ink)] backdrop-blur-md": variant === "translucent",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
