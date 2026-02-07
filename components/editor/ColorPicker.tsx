"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

const defaultPresets = [
  "#000000",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#fbbf24",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export function ColorPicker({
  label,
  value,
  onChange,
  presets = defaultPresets,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstPresetRef = useRef<HTMLButtonElement>(null);

  // Extract hex color from gradients for the picker
  const displayColor = value.includes("gradient")
    ? value.match(/#[a-fA-F0-9]{6}/)?.[0] || "#000000"
    : value;

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key to close dropdown
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  }, []);

  // Focus trap within dropdown
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const focusableElements = dropdownRef.current.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e: globalThis.KeyboardEvent) => {
        if (e.key !== "Tab") return;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      };

      document.addEventListener("keydown", handleTabKey);
      return () => document.removeEventListener("keydown", handleTabKey);
    }
  }, [isOpen]);

  const pickerId = `color-picker-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-1.5" ref={containerRef} onKeyDown={handleKeyDown}>
      <label
        id={`${pickerId}-label`}
        className="block text-xs font-medium text-neutral-400"
      >
        {label}
      </label>

      <div className="relative">
        {/* Color trigger button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-labelledby={`${pickerId}-label`}
          aria-describedby={`${pickerId}-value`}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-lg border px-3",
            "border-neutral-700 bg-neutral-800 hover:border-neutral-600",
            "transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          )}
        >
          <div
            className="h-5 w-5 rounded border border-neutral-600"
            style={{ background: displayColor }}
            aria-hidden="true"
          />
          <span
            id={`${pickerId}-value`}
            className="flex-1 text-left text-sm text-white font-mono"
          >
            {displayColor.toUpperCase()}
          </span>
        </button>

        {/* Color picker dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            role="dialog"
            aria-label={`${label} color picker`}
            aria-modal="true"
            className="absolute left-0 top-full z-50 mt-2 animate-fade-in"
          >
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 shadow-xl">
              {/* Color picker */}
              <HexColorPicker
                color={displayColor}
                onChange={onChange}
                style={{ width: "200px", height: "160px" }}
                aria-label={`${label} color spectrum`}
              />

              {/* Hex input */}
              <div className="mt-3">
                <label className="sr-only" htmlFor={`${pickerId}-input`}>
                  Hex color value
                </label>
                <HexColorInput
                  id={`${pickerId}-input`}
                  color={displayColor}
                  onChange={onChange}
                  prefixed
                  aria-label="Hex color input"
                  className={cn(
                    "w-full rounded-lg border bg-neutral-800 px-3 py-2",
                    "border-neutral-700 text-sm text-white font-mono",
                    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  )}
                />
              </div>

              {/* Preset colors */}
              <div
                className="mt-3 grid grid-cols-9 gap-1.5"
                role="group"
                aria-label="Preset colors"
              >
                {presets.map((preset, index) => (
                  <button
                    key={preset}
                    ref={index === 0 ? firstPresetRef : undefined}
                    type="button"
                    onClick={() => {
                      onChange(preset);
                    }}
                    aria-label={`Select color ${preset}`}
                    aria-pressed={preset === displayColor}
                    className={cn(
                      "h-5 w-5 rounded border transition-transform hover:scale-110",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-900",
                      preset === displayColor
                        ? "border-white ring-1 ring-white"
                        : "border-neutral-600"
                    )}
                    style={{ background: preset }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColorPicker;
