import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary-pill" | "dark-utility" | "pearl-capsule" | "store-hero" | "icon-circular" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)] disabled:pointer-events-none disabled:opacity-50 disabled:text-[var(--color-ink-muted-48)] cursor-pointer",
          {
            // button-primary
            "bg-[var(--color-primary)] text-[var(--color-on-primary)] text-body-default rounded-pill px-[22px] py-[11px] hover:bg-[var(--color-primary-focus)] active:scale-[0.98]": variant === "primary",

            // button-secondary-pill
            "bg-[var(--color-canvas)] text-[var(--color-primary)] text-body-default rounded-pill px-[22px] py-[11px] shadow-[inset_0_0_0_1px_var(--color-divider-soft)] hover:bg-[var(--color-canvas-parchment)]": variant === "secondary-pill",

            // button-dark-utility
            "bg-[var(--color-ink)] text-[var(--color-on-dark)] text-button-utility rounded-sm px-[15px] py-[8px] hover:bg-[var(--color-surface-tile-1)]": variant === "dark-utility",

            // button-pearl-capsule
            "bg-[var(--color-surface-pearl)] text-[var(--color-ink-muted-80)] text-caption rounded-md px-[14px] py-[8px] hover:bg-[var(--color-canvas-parchment)]": variant === "pearl-capsule",

            // button-store-hero
            "bg-[var(--color-primary)] text-[var(--color-on-primary)] text-button-large rounded-pill px-[28px] py-[14px] hover:bg-[var(--color-primary-focus)] active:scale-[0.98]": variant === "store-hero",

            // button-icon-circular
            "bg-[var(--color-surface-chip-translucent)] text-[var(--color-ink)] rounded-full w-[44px] h-[44px] flex items-center justify-center hover:bg-[rgba(210,210,215,0.8)] backdrop-blur-md": variant === "icon-circular",

            // ghost/transparent for text links inside buttons (Not in spec, but good fallback for nav)
            "bg-transparent text-[var(--color-primary)] text-body-default hover:text-[var(--color-primary-focus)]": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
