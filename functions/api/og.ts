import satori from "satori";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import wasmModule from "@resvg/resvg-wasm/index_bg.wasm";

import type { OgRequestParams } from "./_lib/og-types";
import type { ApiContextEnv } from "./_lib/og-params";
import { buildOgParams } from "./_lib/og-params";
import { renderTemplate } from "./_lib/og-templates";

interface CounterBucket {
  count: number;
  resetAt: number;
}

interface WindowConfig {
  name: "burst" | "minute" | "hour";
  limit: number;
  windowMs: number;
}

interface WindowResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

const DEFAULT_TITLE = "Free OG Image API";
const DEFAULT_DESCRIPTION = "Built for fast, no-auth social previews";
const DEFAULT_ICON = "⚡";

const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_ICON_LENGTH = 12;

const CACHE_VERSION = "2026-02-07-templates-v2";

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const MAX_BUCKETS = 10_000;

const RATE_WINDOWS: WindowConfig[] = [
  { name: "burst", limit: 2, windowMs: 10_000 },
  { name: "minute", limit: 5, windowMs: 60_000 },
  { name: "hour", limit: 25, windowMs: 3_600_000 },
];

const counters = new Map<string, CounterBucket>();
let lastCleanupAt = 0;
let pngWasmInitialized = false;
let pngWasmInitializing: Promise<void> | null = null;

let interFontBuffer: ArrayBuffer | null = null;
let interFontInitializing: Promise<ArrayBuffer> | null = null;

function getClientIp(request: Request): string {
  const directIp = request.headers.get("cf-connecting-ip");
  if (directIp && directIp.trim()) {
    return directIp.trim();
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  return "0.0.0.0";
}

function cleanupBuckets(now: number): void {
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS && counters.size < MAX_BUCKETS) {
    return;
  }

  for (const [key, bucket] of counters) {
    if (bucket.resetAt <= now) {
      counters.delete(key);
    }
  }

  if (counters.size > MAX_BUCKETS) {
    const sortedBuckets = [...counters.entries()].sort(
      (a, b) => a[1].resetAt - b[1].resetAt
    );
    const removeCount = counters.size - MAX_BUCKETS;
    for (let index = 0; index < removeCount; index += 1) {
      const key = sortedBuckets[index]?.[0];
      if (key) {
        counters.delete(key);
      }
    }
  }

  lastCleanupAt = now;
}

function consumeWindow(ip: string, config: WindowConfig, now: number): WindowResult {
  const key = `${config.name}:${ip}`;
  const existing = counters.get(key);

  if (!existing || existing.resetAt <= now) {
    counters.set(key, { count: 1, resetAt: now + config.windowMs });
    return {
      allowed: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt: now + config.windowMs,
    };
  }

  if (existing.count >= config.limit) {
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  counters.set(key, existing);

  return {
    allowed: true,
    limit: config.limit,
    remaining: Math.max(0, config.limit - existing.count),
    resetAt: existing.resetAt,
  };
}

function applyRateLimit(ip: string): {
  allowed: boolean;
  window: WindowResult;
  retryAfter?: number;
} {
  const now = Date.now();
  cleanupBuckets(now);

  let minuteWindow: WindowResult | null = null;

  for (const config of RATE_WINDOWS) {
    const window = consumeWindow(ip, config, now);

    if (config.name === "minute") {
      minuteWindow = window;
    }

    if (!window.allowed) {
      const retryAfter = Math.max(1, Math.ceil((window.resetAt - now) / 1000));
      return { allowed: false, window, retryAfter };
    }
  }

  return {
    allowed: true,
    window:
      minuteWindow ?? {
        allowed: true,
        limit: RATE_WINDOWS[0].limit,
        remaining: RATE_WINDOWS[0].limit - 1,
        resetAt: now + RATE_WINDOWS[0].windowMs,
      },
  };
}

function jsonError(
  status: number,
  code: string,
  message: string,
  extraHeaders?: HeadersInit
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code,
        message,
      },
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        ...(extraHeaders ?? {}),
      },
    }
  );
}

function withRateHeaders(headers: Headers, rateWindow: WindowResult): Headers {
  headers.set("X-RateLimit-Limit", String(rateWindow.limit));
  headers.set("X-RateLimit-Remaining", String(rateWindow.remaining));
  headers.set("X-RateLimit-Reset", String(Math.ceil(rateWindow.resetAt / 1000)));
  return headers;
}

function buildImageHeaders(): Headers {
  return new Headers({
    "Content-Type": "image/png",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control":
      "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    "X-Robots-Tag": "noindex, nofollow",
  });
}

function buildSvgHeaders(): Headers {
  return new Headers({
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control":
      "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    "X-Robots-Tag": "noindex, nofollow",
  });
}

function countChars(value: string): number {
  return Array.from(value).length;
}

async function ensurePngWasm(): Promise<void> {
  if (pngWasmInitialized) {
    return;
  }

  if (pngWasmInitializing) {
    await pngWasmInitializing;
    return;
  }

  pngWasmInitializing = (async () => {
    await initWasm(wasmModule);
    pngWasmInitialized = true;
  })();

  try {
    await pngWasmInitializing;
  } catch (error) {
    pngWasmInitializing = null;
    throw error;
  }
}

async function ensureInterFont(origin: string): Promise<ArrayBuffer> {
  if (interFontBuffer) {
    return interFontBuffer;
  }

  if (interFontInitializing) {
    return interFontInitializing;
  }

  interFontInitializing = (async () => {
    const response = await fetch(`${origin}/fonts/Inter-Bold.ttf`, {
      cf: { cacheTtl: 86_400 },
    });

    if (!response.ok) {
      throw new Error(`Failed to load Inter font (${response.status})`);
    }

    interFontBuffer = await response.arrayBuffer();
    return interFontBuffer;
  })();

  try {
    return await interFontInitializing;
  } catch (error) {
    interFontInitializing = null;
    throw error;
  }
}

async function renderSvg(
  params: OgRequestParams,
  fontBuffer: ArrayBuffer
): Promise<string> {
  const element = renderTemplate(params);
  return satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: fontBuffer,
        weight: 700,
        style: "normal",
      },
    ],
  });
}

async function renderPng(
  params: OgRequestParams,
  fontBuffer: ArrayBuffer
): Promise<Uint8Array> {
  const svg = await renderSvg(params, fontBuffer);

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const pngBuffer = resvg.render().asPng();
  return new Uint8Array(pngBuffer);
}

export const onRequestGet: PagesFunction<ApiContextEnv> = async (context) => {
  const requestUrl = new URL(context.request.url);
  const { params, warnings } = await buildOgParams(requestUrl, context.env);

  const cacheUrl = new URL(requestUrl.toString());
  cacheUrl.searchParams.set("_v", CACHE_VERSION);
  cacheUrl.searchParams.set("_fmt", params.format);
  cacheUrl.searchParams.set("_tpl", params.template);
  cacheUrl.searchParams.set("_bg", params.backgroundColor);
  cacheUrl.searchParams.set("_text", params.textColor);
  cacheUrl.searchParams.set("_accent", params.accentColor);
  cacheUrl.searchParams.set("_bgMode", params.backgroundMode);
  cacheUrl.searchParams.set("_overlay", params.overlayOpacity.toFixed(3));
  if (params.backgroundId) {
    cacheUrl.searchParams.set("_bgId", params.backgroundId);
  }
  const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });
  const cache = caches.default;

  const clientIp = getClientIp(context.request);
  const rate = applyRateLimit(clientIp);

  if (!rate.allowed) {
    return jsonError(429, "RATE_LIMITED", "Too many requests. Please retry later.", {
      "Retry-After": String(rate.retryAfter ?? 60),
      "X-RateLimit-Limit": String(rate.window.limit),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.ceil(rate.window.resetAt / 1000)),
    });
  }

  const cached = await cache.match(cacheKey);
  if (cached) {
    const body = await cached.arrayBuffer();
    const headers = withRateHeaders(
      params.format === "svg" ? buildSvgHeaders() : buildImageHeaders(),
      rate.window
    );
    headers.set("X-Cache", "HIT");
    return new Response(body, { status: 200, headers });
  }

  if (countChars(params.title) > MAX_TITLE_LENGTH) {
    return jsonError(400, "TITLE_TOO_LONG", `title must be <= ${MAX_TITLE_LENGTH} characters`, {
      "X-RateLimit-Limit": String(rate.window.limit),
      "X-RateLimit-Remaining": String(rate.window.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rate.window.resetAt / 1000)),
    });
  }

  if (countChars(params.description) > MAX_DESCRIPTION_LENGTH) {
    return jsonError(
      400,
      "DESCRIPTION_TOO_LONG",
      `description/subtitle must be <= ${MAX_DESCRIPTION_LENGTH} characters`,
      {
        "X-RateLimit-Limit": String(rate.window.limit),
        "X-RateLimit-Remaining": String(rate.window.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rate.window.resetAt / 1000)),
      }
    );
  }

  if (countChars(params.icon) > MAX_ICON_LENGTH) {
    return jsonError(400, "ICON_TOO_LONG", `icon must be <= ${MAX_ICON_LENGTH} characters`, {
      "X-RateLimit-Limit": String(rate.window.limit),
      "X-RateLimit-Remaining": String(rate.window.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rate.window.resetAt / 1000)),
    });
  }

  try {
    const fontBuffer = await ensureInterFont(requestUrl.origin);

    let imageBody: string | Uint8Array;
    if (params.format === "svg") {
      imageBody = await renderSvg(params, fontBuffer);
    } else {
      await ensurePngWasm();
      imageBody = await renderPng(params, fontBuffer);
    }

    const headers = withRateHeaders(
      params.format === "svg" ? buildSvgHeaders() : buildImageHeaders(),
      rate.window
    );
    headers.set("X-Cache", "MISS");
    if (warnings.length) {
      headers.set("X-OG-Warnings", warnings.join(" | "));
    }

    const cacheResponse = new Response(imageBody, {
      status: 200,
      headers: params.format === "svg" ? buildSvgHeaders() : buildImageHeaders(),
    });
    context.waitUntil(cache.put(cacheKey, cacheResponse));

    return new Response(imageBody, {
      status: 200,
      headers,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("[api/og] render failed:", detail);
    return jsonError(500, "RENDER_FAILED", "Failed to render image. Retry later.", {
      "X-RateLimit-Limit": String(rate.window.limit),
      "X-RateLimit-Remaining": String(rate.window.remaining),
      "X-RateLimit-Reset": String(Math.ceil(rate.window.resetAt / 1000)),
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
};

