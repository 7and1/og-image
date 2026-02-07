import satori from "satori";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import type { ReactNode } from "react";

// Singleton state for WASM and font initialization
let wasmInitialized = false;
let wasmInitializing: Promise<void> | null = null;
let fontBuffer: ArrayBuffer | null = null;
let fontLoading: Promise<ArrayBuffer> | null = null;

// LRU cache for emoji data URIs with size limit
const EMOJI_CACHE_MAX_SIZE = 200;
const emojiDataUriCache = new Map<string, string>();
const emojiLoadingCache = new Map<string, Promise<string | null>>();
const emojiMissCache = new Set<string>();

const TWEMOJI_CDN_BASE =
  "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg";

function evictOldestEmoji(): void {
  if (emojiDataUriCache.size >= EMOJI_CACHE_MAX_SIZE) {
    const firstKey = emojiDataUriCache.keys().next().value;
    if (firstKey) {
      emojiDataUriCache.delete(firstKey);
    }
  }
}

function toEmojiCodepoints(segment: string): string[] {
  return Array.from(segment)
    .map((char) => char.codePointAt(0)?.toString(16))
    .filter((value): value is string => Boolean(value));
}

function getEmojiCodepointCandidates(segment: string): string[] {
  const codepoints = toEmojiCodepoints(segment);
  if (codepoints.length === 0) {
    return [];
  }

  const candidates = new Set<string>();
  candidates.add(codepoints.join("-"));

  const withoutVariationSelector = codepoints.filter(
    (codepoint) => codepoint !== "fe0f"
  );

  if (withoutVariationSelector.length > 0) {
    candidates.add(withoutVariationSelector.join("-"));
  }

  return [...candidates].filter(Boolean);
}

function encodeToBase64(input: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(input, "utf-8").toString("base64");
  }

  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

async function loadEmojiDataUri(segment: string): Promise<string | null> {
  const cached = emojiDataUriCache.get(segment);
  if (cached) {
    // Move to end for LRU behavior
    emojiDataUriCache.delete(segment);
    emojiDataUriCache.set(segment, cached);
    return cached;
  }

  if (emojiMissCache.has(segment)) {
    return null;
  }

  const loading = emojiLoadingCache.get(segment);
  if (loading) {
    return loading;
  }

  const promise = (async () => {
    const candidates = getEmojiCodepointCandidates(segment);
    if (candidates.length === 0) {
      return null;
    }

    for (const codepoint of candidates) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${TWEMOJI_CDN_BASE}/${codepoint}.svg`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          continue;
        }

        const svg = await response.text();
        const dataUri = `data:image/svg+xml;base64,${encodeToBase64(svg)}`;

        // Evict oldest entry if cache is full
        evictOldestEmoji();
        emojiDataUriCache.set(segment, dataUri);
        return dataUri;
      } catch {
        continue;
      }
    }

    emojiMissCache.add(segment);
    return null;
  })();

  emojiLoadingCache.set(segment, promise);
  try {
    return await promise;
  } finally {
    emojiLoadingCache.delete(segment);
  }
}

/**
 * Initializes the WASM module
 * Uses singleton pattern to ensure it's only initialized once
 */
async function initializeWasm(): Promise<void> {
  if (wasmInitialized) return;

  if (wasmInitializing) {
    await wasmInitializing;
    return;
  }

  wasmInitializing = (async () => {
    try {
      // Fetch WASM file from public directory
      const wasmResponse = await fetch("/resvg.wasm");
      if (!wasmResponse.ok) {
        throw new Error(`Failed to fetch WASM: ${wasmResponse.status}`);
      }

      const wasmBuffer = await wasmResponse.arrayBuffer();
      await initWasm(wasmBuffer);
      wasmInitialized = true;
      if (process.env.NODE_ENV === "development") {
        console.log("[og-engine] WASM initialized successfully");
      }
    } catch (error) {
      wasmInitializing = null;
      console.error("[og-engine] WASM initialization failed:", error);
      throw new Error(
        "Failed to initialize image engine. Please refresh the page."
      );
    }
  })();

  await wasmInitializing;
}

/**
 * Loads the Inter Bold font
 * Uses singleton pattern with caching
 */
async function loadFont(): Promise<ArrayBuffer> {
  if (fontBuffer) return fontBuffer;

  if (fontLoading) {
    return fontLoading;
  }

  fontLoading = (async () => {
    try {
      const response = await fetch("/fonts/Inter-Bold.ttf");
      if (!response.ok) {
        throw new Error(`Failed to fetch font: ${response.status}`);
      }

      fontBuffer = await response.arrayBuffer();
      if (process.env.NODE_ENV === "development") {
        console.log("[og-engine] Font loaded successfully");
      }
      return fontBuffer;
    } catch (error) {
      fontLoading = null;
      console.error("[og-engine] Font loading failed:", error);
      throw new Error("Failed to load font. Please refresh the page.");
    }
  })();

  return fontLoading;
}

/**
 * Ensures the engine is ready for rendering
 */
export async function ensureEngineReady(): Promise<void> {
  await Promise.all([initializeWasm(), loadFont()]);
}

/**
 * Configuration options for rendering
 */
export interface RenderOptions {
  width?: number;
  height?: number;
  scale?: number;
}

const DEFAULT_OPTIONS: Required<RenderOptions> = {
  width: 1200,
  height: 630,
  scale: 1,
};

/**
 * Renders a React element to a PNG blob URL
 *
 * Pipeline:
 * 1. React Element → Satori → SVG string
 * 2. SVG string → Resvg (WASM) → PNG buffer
 * 3. PNG buffer → Blob URL
 *
 * @param node - React element to render (must use inline styles)
 * @param options - Render options (width, height, scale)
 * @returns Promise<string> - Blob URL for the generated PNG
 */
export async function renderToBlob(
  node: ReactNode,
  options: RenderOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startTime = performance.now();

  // Ensure engine is initialized
  await ensureEngineReady();

  // Step 1: React → SVG using Satori
  const svg = await satori(node as React.ReactNode, {
    width: opts.width,
    height: opts.height,
    fonts: [
      {
        name: "Inter",
        data: fontBuffer!,
        weight: 700,
        style: "normal",
      },
    ],
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === "emoji") {
        const dataUri = await loadEmojiDataUri(segment);
        if (dataUri) {
          return dataUri;
        }
      }
      return [];
    },
  });

  const satoriTime = performance.now();
  console.log(`[og-engine] Satori: ${(satoriTime - startTime).toFixed(2)}ms`);

  // Step 2: SVG → PNG using Resvg WASM
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: opts.width * opts.scale,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const resvgTime = performance.now();
  console.log(`[og-engine] Resvg: ${(resvgTime - satoriTime).toFixed(2)}ms`);

  // Step 3: Create Blob URL
  const blob = new Blob([new Uint8Array(pngBuffer)], { type: "image/png" });
  const url = URL.createObjectURL(blob);

  console.log(`[og-engine] Total: ${(performance.now() - startTime).toFixed(2)}ms`);

  return url;
}

/**
 * Renders a React element directly to a PNG Blob
 * Useful when you need the blob itself (e.g., for download)
 */
export async function renderToPngBlob(
  node: ReactNode,
  options: RenderOptions = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  await ensureEngineReady();

  const svg = await satori(node as React.ReactNode, {
    width: opts.width,
    height: opts.height,
    fonts: [
      {
        name: "Inter",
        data: fontBuffer!,
        weight: 700,
        style: "normal",
      },
    ],
    loadAdditionalAsset: async (code: string, segment: string) => {
      if (code === "emoji") {
        const dataUri = await loadEmojiDataUri(segment);
        if (dataUri) {
          return dataUri;
        }
      }
      return [];
    },
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: opts.width * opts.scale,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Blob([new Uint8Array(pngBuffer)], { type: "image/png" });
}

/**
 * Checks if the engine is ready without blocking
 */
export function isEngineReady(): boolean {
  return wasmInitialized && fontBuffer !== null;
}

/**
 * Preloads the engine in the background
 * Call this early in the app lifecycle to minimize first-render delay
 */
export function preloadEngine(): void {
  ensureEngineReady().catch((error) => {
    console.warn("[og-engine] Preload failed:", error);
  });
}
