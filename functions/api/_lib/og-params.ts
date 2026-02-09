import {
  DEFAULT_TEMPLATE,
  isOgTemplateId,
} from "./og-templates";
import { findBackgroundById, getTemplateCatalog } from "./catalog";

import type {
  OgRequestParams,
  OutputFormat,
  TemplateCatalogItem,
} from "./og-types";

interface D1QueryResult<T> {
  results: T[];
}

interface D1PreparedStatement {
  all<T = unknown>(): Promise<D1QueryResult<T>>;
}

interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
}

export interface ApiContextEnv {
  OG_DB?: D1DatabaseLike;
}

const DEFAULT_TITLE = "Free OG Image API";
const DEFAULT_DESCRIPTION = "Built for fast, no-auth social previews";
const DEFAULT_ICON = "⚡";

const DEFAULT_BACKGROUND = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
const DEFAULT_TEXT_COLOR = "#ffffff";
const DEFAULT_ACCENT_COLOR = "#fbbf24";
const DEFAULT_OVERLAY_OPACITY = 0.55;

function normalizeString(input: string | null): string | null {
  if (!input) {
    return null;
  }

  const trimmed = input.trim();
  return trimmed ? trimmed : null;
}

function parseHexColor(input: string | null): string | null {
  const value = normalizeString(input);
  if (!value) {
    return null;
  }

  const normalized = value.startsWith("#") ? value.slice(1) : value;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  return `#${normalized.toLowerCase()}`;
}

function parseBackgroundValue(input: string | null): string | null {
  const value = normalizeString(input);
  if (!value) {
    return null;
  }

  return parseHexColor(value) ?? value;
}

function parseFloatClamped(input: string | null, fallback: number): number {
  const value = normalizeString(input);
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(1, Math.max(0, parsed));
}

function clampOpacity(value: number | null | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_OVERLAY_OPACITY;
  }
  return Math.min(1, Math.max(0, value));
}

function findTemplateDefaults(
  items: readonly TemplateCatalogItem[],
  templateId: string
): TemplateCatalogItem["defaultProps"] | null {
  const match = items.find((candidate) => candidate.id === templateId);
  return match?.defaultProps ?? null;
}

export async function buildOgParams(
  url: URL,
  env: ApiContextEnv
): Promise<{
  params: OgRequestParams;
  warnings: string[];
}> {
  const warnings: string[] = [];

  const rawTemplate = normalizeString(url.searchParams.get("template"));
  const template = rawTemplate && isOgTemplateId(rawTemplate)
    ? rawTemplate
    : DEFAULT_TEMPLATE;
  if (rawTemplate && rawTemplate !== template) {
    warnings.push("Unknown template; falling back to default.");
  }

  const { items: templateCatalog } = await getTemplateCatalog({ env });
  const templateDefaults = findTemplateDefaults(templateCatalog, template);

  const title = normalizeString(url.searchParams.get("title")) ?? DEFAULT_TITLE;
  const description =
    normalizeString(url.searchParams.get("description")) ??
    normalizeString(url.searchParams.get("subtitle")) ??
    DEFAULT_DESCRIPTION;
  const icon = normalizeString(url.searchParams.get("icon")) ?? DEFAULT_ICON;

  const defaultBackgroundColor =
    parseBackgroundValue(templateDefaults?.backgroundColor ?? null) ?? DEFAULT_BACKGROUND;
  const defaultTextColor =
    parseHexColor(templateDefaults?.textColor ?? null) ?? DEFAULT_TEXT_COLOR;
  const defaultAccentColor =
    parseHexColor(templateDefaults?.accentColor ?? null) ?? DEFAULT_ACCENT_COLOR;
  const defaultOverlayOpacity = clampOpacity(templateDefaults?.overlayOpacity);

  const backgroundColor =
    parseBackgroundValue(url.searchParams.get("backgroundColor")) ??
    parseBackgroundValue(url.searchParams.get("bg")) ??
    defaultBackgroundColor;
  const textColor =
    parseHexColor(url.searchParams.get("textColor")) ??
    parseHexColor(url.searchParams.get("text")) ??
    defaultTextColor;
  const accentColor =
    parseHexColor(url.searchParams.get("accentColor")) ??
    parseHexColor(url.searchParams.get("accent")) ??
    defaultAccentColor;

  const defaultModeRaw = normalizeString(templateDefaults?.backgroundMode ?? null);
  const defaultMode = defaultModeRaw === "photo" ? "photo" : "color";
  const defaultBackgroundId =
    defaultMode === "photo"
      ? normalizeString(templateDefaults?.backgroundId ?? null)
      : null;

  let backgroundMode: "color" | "photo" = defaultMode;
  let backgroundId: string | null = defaultBackgroundId;
  let backgroundImageSrc: string | null = null;

  if (backgroundMode === "photo" && backgroundId) {
    const { item } = await findBackgroundById(backgroundId, { env });
    if (item) {
      backgroundImageSrc = item.urls.og;
    } else {
      warnings.push("Default bgId missing; ignoring background image.");
      backgroundMode = "color";
      backgroundId = null;
    }
  }

  const requestedBgId = normalizeString(url.searchParams.get("bgId"));
  if (requestedBgId) {
    const { item } = await findBackgroundById(requestedBgId, { env });
    if (item) {
      backgroundMode = "photo";
      backgroundId = item.id;
      backgroundImageSrc = item.urls.og;
    } else {
      warnings.push("Unknown bgId; ignoring background image.");
    }
  }

  const overlayOpacity = parseFloatClamped(
    url.searchParams.get("overlay"),
    defaultOverlayOpacity
  );

  const rawFormat = normalizeString(url.searchParams.get("format"))?.toLowerCase();
  let format: OutputFormat = "png";
  if (rawFormat === "svg") {
    format = "svg";
  } else if (rawFormat === "png" || !rawFormat) {
    format = "png";
  } else {
    warnings.push("Unknown format; falling back to png.");
  }

  return {
    params: {
      template,
      title,
      description,
      icon,
      backgroundColor,
      textColor,
      accentColor,
      backgroundMode,
      backgroundId,
      backgroundImageSrc,
      overlayOpacity,
      format,
    },
    warnings,
  };
}

