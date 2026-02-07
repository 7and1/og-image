"use client";

import { memo } from "react";
import { useStore } from "@/store/useStore";
import { Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function PreviewCanvasComponent() {
  const { previewUrl, isGenerating, error } = useStore();

  return (
    <div className="relative">
      {/* Preview container with aspect ratio */}
      <div
        className={cn(
          "relative aspect-[1200/630] w-full overflow-hidden rounded-xl",
          "border border-neutral-800 bg-neutral-900 shadow-2xl"
        )}
      >
        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
              <span className="text-sm text-neutral-300" role="status" aria-live="polite">
                Generating...
              </span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900" role="alert">
            <div className="text-red-500 text-sm">{error}</div>
          </div>
        )}

        {/* Preview image */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="OG Image Preview"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500">
            <ImageIcon className="h-12 w-12 mb-3 opacity-50" aria-hidden="true" />
            <span className="text-sm">
              {isGenerating ? "Initializing engine..." : "Preview will appear here"}
            </span>
          </div>
        )}
      </div>

      {/* Dimension badge */}
      <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2.5 py-1 text-xs text-neutral-400 backdrop-blur-sm">
        1200 × 630
      </div>
    </div>
  );
}

export const PreviewCanvas = memo(PreviewCanvasComponent);
export default PreviewCanvas;
