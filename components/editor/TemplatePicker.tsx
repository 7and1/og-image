"use client";

import { cn } from "@/lib/utils";
import { templateList } from "@/templates";
import type { TemplateId } from "@/types";

interface TemplatePickerProps {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
}

export function TemplatePicker({ selected, onChange }: TemplatePickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-neutral-400">
        Template
      </label>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {templateList.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={cn(
              "flex-shrink-0 rounded-lg border p-2 transition-all duration-150",
              selected === template.id
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
            )}
          >
            {/* Template preview thumbnail */}
            <div
              className="h-[40px] w-[76px] rounded overflow-hidden"
              style={{
                background:
                  template.defaultProps.backgroundColor || "#000000",
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center p-1">
                <div className="text-[10px]">⚡</div>
                <div
                  className="mt-0.5 h-1 w-8 rounded-full"
                  style={{
                    background:
                      template.defaultProps.textColor || "#ffffff",
                    opacity: 0.8,
                  }}
                />
                <div
                  className="mt-0.5 h-0.5 w-6 rounded-full"
                  style={{
                    background:
                      template.defaultProps.textColor || "#ffffff",
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>

            {/* Template name */}
            <p
              className={cn(
                "mt-1.5 text-center text-[10px] font-medium",
                selected === template.id
                  ? "text-primary"
                  : "text-neutral-400"
              )}
            >
              {template.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default TemplatePicker;
