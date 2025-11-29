"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, hint, maxLength, showCount, id, value, ...props },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label
              htmlFor={inputId}
              className="block text-xs font-medium text-neutral-400"
            >
              {label}
            </label>
          )}
          {showCount && maxLength && (
            <span
              className={cn(
                "text-xs",
                currentLength > maxLength ? "text-red-500" : "text-neutral-500"
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          className={cn(
            "w-full rounded-lg border bg-neutral-800 px-3 py-2 text-sm text-white placeholder:text-neutral-500",
            "border-neutral-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "transition-colors duration-150 resize-none",
            "min-h-[80px]",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-neutral-500">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
