"use client";

import { useState, useRef, useEffect } from "react";
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

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-xs font-medium text-neutral-400">
        {label}
      </label>

      <div className="relative">
        {/* Color trigger button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center gap-3 rounded-lg border px-3",
            "border-neutral-700 bg-neutral-800 hover:border-neutral-600",
            "transition-colors duration-150"
          )}
        >
          <div
            className="h-5 w-5 rounded border border-neutral-600"
            style={{ background: displayColor }}
          />
          <span className="flex-1 text-left text-sm text-white font-mono">
            {displayColor.toUpperCase()}
          </span>
        </button>

        {/* Color picker dropdown */}
        {isOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 animate-fade-in">
            <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-3 shadow-xl">
              {/* Color picker */}
              <HexColorPicker
                color={displayColor}
                onChange={onChange}
                style={{ width: "200px", height: "160px" }}
              />

              {/* Hex input */}
              <div className="mt-3">
                <HexColorInput
                  color={displayColor}
                  onChange={onChange}
                  prefixed
                  className={cn(
                    "w-full rounded-lg border bg-neutral-800 px-3 py-2",
                    "border-neutral-700 text-sm text-white font-mono",
                    "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  )}
                />
              </div>

              {/* Preset colors */}
              <div className="mt-3 grid grid-cols-9 gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      onChange(preset);
                    }}
                    className={cn(
                      "h-5 w-5 rounded border transition-transform hover:scale-110",
                      preset === displayColor
                        ? "border-white ring-1 ring-white"
                        : "border-neutral-600"
                    )}
                    style={{ background: preset }}
                    title={preset}
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
