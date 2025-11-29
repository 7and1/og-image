"use client";

import { useState, useEffect, useCallback } from "react";
import { renderToBlob, ensureEngineReady, isEngineReady } from "@/lib/engine";

interface UseEngineOptions {
  preload?: boolean;
}

interface UseEngineReturn {
  isReady: boolean;
  isRendering: boolean;
  error: Error | null;
  render: (element: React.ReactElement) => Promise<string | null>;
  preload: () => Promise<void>;
}

/**
 * Hook for using the WASM rendering engine
 *
 * @example
 * ```tsx
 * const { isReady, isRendering, render } = useEngine({ preload: true });
 *
 * const handleRender = async () => {
 *   const url = await render(<MyTemplate />);
 *   if (url) {
 *     setPreviewUrl(url);
 *   }
 * };
 * ```
 */
export function useEngine(options: UseEngineOptions = {}): UseEngineReturn {
  const { preload: shouldPreload = true } = options;

  // Initialize with sync check if engine is already ready
  const [isReady, setIsReady] = useState(() => isEngineReady());
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Preload engine on mount if requested and not already ready
  useEffect(() => {
    if (shouldPreload && !isEngineReady()) {
      ensureEngineReady()
        .then(() => setIsReady(true))
        .catch((err: unknown) => {
          setError(err instanceof Error ? err : new Error("Failed to preload engine"));
        });
    }
  }, [shouldPreload]);

  const handlePreload = useCallback(async () => {
    try {
      setError(null);
      await ensureEngineReady();
      setIsReady(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error("Failed to preload engine"));
    }
  }, []);

  const render = useCallback(async (element: React.ReactElement): Promise<string | null> => {
    try {
      setIsRendering(true);
      setError(null);
      const url = await renderToBlob(element);
      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Render failed");
      setError(error);
      return null;
    } finally {
      setIsRendering(false);
    }
  }, []);

  return {
    isReady,
    isRendering,
    error,
    render,
    preload: handlePreload,
  };
}

export default useEngine;
