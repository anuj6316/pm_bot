import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full bg-[var(--color-canvas)] text-[var(--color-ink)] text-body-default rounded-pill px-[20px] h-[44px] border border-[var(--color-hairline)] transition-colors file:border-0 file:bg-transparent file:text-body-default file:font-medium placeholder:text-[var(--color-ink-muted-48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
