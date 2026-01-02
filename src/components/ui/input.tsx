"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-lg",
            "bg-[var(--bg-secondary)] text-[var(--text-primary)]",
            "border border-[var(--border)] focus:border-[var(--accent)]",
            "placeholder:text-[var(--text-muted)]",
            "transition-colors duration-[var(--duration-micro)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
