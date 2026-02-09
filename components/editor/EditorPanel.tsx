"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore, useActions } from "@/store/useStore";
import { Input, Textarea } from "@/components/ui";
import { ColorPicker } from "./ColorPicker";
import { TemplatePicker } from "./TemplatePicker";
import { BackgroundPicker } from "./BackgroundPicker";
import { MyTemplatesPanel } from "./MyTemplatesPanel";
import { ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MyTemplatePayload } from "@/types";

const USER_KEY_STORAGE_KEY = "og-my-template-user-key";

export function EditorPanel() {
  const {
    title,
    description,
    icon,
    template,
    backgroundColor,
    textColor,
    accentColor,
    backgroundMode,
    backgroundId,
    backgroundImageSrc,
    overlayOpacity,
    fontFamily,
    fontSize,
    layout,
    isAdvancedOpen,
  } = useStore();

  const {
    setContent,
    setStyling,
    setBackground,
    setAdvanced,
    setUI,
    reset,
    loadTemplate,
  } = useActions();

  const [myTemplateUserKey, setMyTemplateUserKey] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem(USER_KEY_STORAGE_KEY);
    if (saved) {
      setMyTemplateUserKey(saved);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!myTemplateUserKey.trim()) {
      window.localStorage.removeItem(USER_KEY_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(USER_KEY_STORAGE_KEY, myTemplateUserKey.trim());
  }, [myTemplateUserKey]);

  const currentTemplateValues = useMemo<MyTemplatePayload>(
    () => ({
      title,
      description,
      icon,
      template,
      backgroundColor,
      textColor,
      accentColor,
      backgroundMode,
      backgroundId,
      backgroundImageSrc,
      overlayOpacity,
      fontFamily,
      fontSize,
      layout,
    }),
    [
      title,
      description,
      icon,
      template,
      backgroundColor,
      textColor,
      accentColor,
      backgroundMode,
      backgroundId,
      backgroundImageSrc,
      overlayOpacity,
      fontFamily,
      fontSize,
      layout,
    ]
  );

  const applySavedTemplate = (payload: MyTemplatePayload) => {
    setContent({
      title: payload.title,
      description: payload.description,
      icon: payload.icon,
    });

    setStyling({
      template: payload.template,
      backgroundColor: payload.backgroundColor,
      textColor: payload.textColor,
      accentColor: payload.accentColor,
    });

    setBackground({
      backgroundMode: payload.backgroundMode,
      backgroundId: payload.backgroundId,
      backgroundImageSrc: payload.backgroundImageSrc,
      overlayOpacity: payload.overlayOpacity,
    });

    setAdvanced({
      fontFamily: payload.fontFamily,
      fontSize: payload.fontSize,
      layout: payload.layout,
    });
  };

  return (
    <div className="flex h-full w-full flex-shrink-0 flex-col border-r border-neutral-800 bg-neutral-900 lg:w-[380px]">
      <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Editor</h2>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <TemplatePicker selected={template} onChange={(id) => loadTemplate(id)} />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-300">Content</h3>

          <Input
            label="Title"
            placeholder="Enter your title..."
            value={title}
            onChange={(event) => setContent({ title: event.target.value })}
            maxLength={80}
          />

          <Textarea
            label="Description"
            placeholder="Add a short description..."
            value={description}
            onChange={(event) => setContent({ description: event.target.value })}
            maxLength={200}
            showCount
            rows={3}
          />

          <Input
            label="Icon / Emoji"
            placeholder="⚡"
            value={icon}
            onChange={(event) => setContent({ icon: event.target.value })}
            hint="Use an emoji or short text"
          />
        </div>

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

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-300">Background</h3>

          <BackgroundPicker
            backgroundId={backgroundId}
            backgroundImageSrc={backgroundImageSrc}
            overlayOpacity={overlayOpacity}
            onPickPhoto={({ id, src }) => {
              setBackground({
                backgroundMode: "photo",
                backgroundId: id,
                backgroundImageSrc: src,
              });
            }}
            onUpload={(src) => {
              setBackground({
                backgroundMode: "upload",
                backgroundId: null,
                backgroundImageSrc: src,
              });
            }}
            onClear={() => {
              setBackground({
                backgroundMode: "color",
                backgroundId: null,
                backgroundImageSrc: null,
              });
            }}
            onOverlayChange={(value) => {
              setBackground({ overlayOpacity: value });
            }}
          />

          <p className="text-xs leading-relaxed text-neutral-500">
            Selected mode: <span className="text-neutral-300">{backgroundMode}</span>
          </p>
        </div>

        <MyTemplatesPanel
          userKey={myTemplateUserKey}
          onUserKeyChange={setMyTemplateUserKey}
          values={currentTemplateValues}
          onApply={applySavedTemplate}
        />

        <div className="border-t border-neutral-800 pt-4">
          <button
            type="button"
            onClick={() => setUI({ isAdvancedOpen: !isAdvancedOpen })}
            className="flex w-full items-center justify-between py-2 text-sm font-medium text-neutral-300 transition-colors hover:text-white"
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
            <div className="mt-3 animate-slide-up space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-neutral-400">
                  Custom Background (CSS)
                </label>
                <Textarea
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  value={backgroundColor}
                  onChange={(event) =>
                    setStyling({ backgroundColor: event.target.value })
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

      <div className="border-t border-neutral-800 p-4">
        <label className="mb-2 block text-xs font-medium text-neutral-400">
          Quick Gradients
        </label>
        <div className="grid grid-cols-6 gap-2">
          {gradientPresets.map((gradient, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setStyling({ backgroundColor: gradient })}
              className={cn(
                "h-8 rounded-lg border transition-transform hover:scale-105",
                backgroundColor === gradient
                  ? "border-white ring-1 ring-white"
                  : "border-neutral-700"
              )}
              style={{ background: gradient }}
              title={`Gradient ${index + 1}`}
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
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)",
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
];

export default EditorPanel;
