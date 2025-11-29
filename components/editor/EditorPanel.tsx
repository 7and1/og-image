"use client";

import { useStore, useActions } from "@/store/useStore";
import { Input, Textarea } from "@/components/ui";
import { ColorPicker } from "./ColorPicker";
import { TemplatePicker } from "./TemplatePicker";
import { ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditorPanel() {
  const {
    title,
    description,
    icon,
    template,
    backgroundColor,
    textColor,
    accentColor,
    isAdvancedOpen,
  } = useStore();

  const { setContent, setStyling, setUI, reset, loadTemplate } = useActions();

  return (
    <div className="flex h-full w-[380px] flex-shrink-0 flex-col border-r border-neutral-800 bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Editor</h2>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Template Picker */}
        <TemplatePicker
          selected={template}
          onChange={(id) => loadTemplate(id)}
        />

        {/* Content Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-300">Content</h3>

          <Input
            label="Title"
            placeholder="Enter your title..."
            value={title}
            onChange={(e) => setContent({ title: e.target.value })}
            maxLength={80}
          />

          <Textarea
            label="Description"
            placeholder="Add a short description..."
            value={description}
            onChange={(e) => setContent({ description: e.target.value })}
            maxLength={200}
            showCount
            rows={3}
          />

          <Input
            label="Icon / Emoji"
            placeholder="⚡"
            value={icon}
            onChange={(e) => setContent({ icon: e.target.value })}
            hint="Use an emoji or short text"
          />
        </div>

        {/* Colors Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-300">Colors</h3>

          <ColorPicker
            label="Background"
            value={backgroundColor}
            onChange={(color) => setStyling({ backgroundColor: color })}
          />

          <ColorPicker
            label="Text Color"
            value={textColor}
            onChange={(color) => setStyling({ textColor: color })}
          />

          <ColorPicker
            label="Accent Color"
            value={accentColor}
            onChange={(color) => setStyling({ accentColor: color })}
          />
        </div>

        {/* Advanced Options (Collapsible) */}
        <div className="border-t border-neutral-800 pt-4">
          <button
            type="button"
            onClick={() => setUI({ isAdvancedOpen: !isAdvancedOpen })}
            className="flex w-full items-center justify-between py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
          >
            Advanced Options
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isAdvancedOpen && "rotate-180"
              )}
            />
          </button>

          {isAdvancedOpen && (
            <div className="mt-3 space-y-4 animate-slide-up">
              {/* Gradient input for advanced users */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-400">
                  Custom Background (CSS)
                </label>
                <Textarea
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  value={backgroundColor}
                  onChange={(e) =>
                    setStyling({ backgroundColor: e.target.value })
                  }
                  rows={2}
                  className="font-mono text-xs"
                />
                <p className="text-xs text-neutral-500">
                  Supports hex colors and CSS gradients
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gradient presets */}
      <div className="border-t border-neutral-800 p-4">
        <label className="block text-xs font-medium text-neutral-400 mb-2">
          Quick Gradients
        </label>
        <div className="grid grid-cols-6 gap-2">
          {gradientPresets.map((gradient, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStyling({ backgroundColor: gradient })}
              className={cn(
                "h-8 rounded-lg border transition-transform hover:scale-105",
                backgroundColor === gradient
                  ? "border-white ring-1 ring-white"
                  : "border-neutral-700"
              )}
              style={{ background: gradient }}
              title={`Gradient ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const gradientPresets = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)",
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
];

export default EditorPanel;
