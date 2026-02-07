import backgroundCatalogJson from "../../../public/catalog/backgrounds.json";
import { templateList } from "../../../templates";

import type {
  BackgroundCatalog,
  BackgroundCatalogItem,
  CatalogSource,
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

interface CatalogEnv {
  OG_DB?: D1DatabaseLike;
}

interface BackgroundCacheEntry {
  expiresAt: number;
  source: CatalogSource;
  catalog: BackgroundCatalog;
}

interface TemplateCacheEntry {
  expiresAt: number;
  source: CatalogSource;
  items: TemplateCatalogItem[];
}

interface D1BackgroundCategoryRow {
  id: string;
  label: string;
  query: string | null;
  count: number | null;
}

interface D1BackgroundItemRow {
  id: string;
  provider: string | null;
  category: string;
  title: string | null;
  dominantColor: string | null;
  width: number | null;
  height: number | null;
  blurHash: string | null;
  og: string;
  small: string;
  thumb: string;
  raw: string;
  photographerName: string | null;
  photographerUsername: string | null;
  photographerProfileUrl: string | null;
  unsplashPageUrl: string | null;
}

interface D1TemplateRow {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultProps: string | null;
}

const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_TEMPLATE_OVERLAY = 0.55;

const STATIC_BACKGROUND_CATALOG = backgroundCatalogJson as BackgroundCatalog;

let backgroundCache: BackgroundCacheEntry | null = null;
let templateCache: TemplateCacheEntry | null = null;

function isFinitePositiveInt(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 0;
}

function normalizeOverlay(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return Math.min(1, Math.max(0, value));
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function asCatalogItem(input: unknown): BackgroundCatalogItem | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const row = input as Partial<BackgroundCatalogItem>;
  if (!row.id || !row.category || !row.urls) {
    return null;
  }

  if (
    typeof row.id !== "string" ||
    typeof row.category !== "string" ||
    typeof row.urls.og !== "string" ||
    typeof row.urls.small !== "string" ||
    typeof row.urls.thumb !== "string" ||
    typeof row.urls.raw !== "string"
  ) {
    return null;
  }

  return {
    id: row.id,
    provider: "unsplash",
    category: row.category,
    title: row.title ?? null,
    dominantColor: row.dominantColor ?? null,
    width: row.width ?? null,
    height: row.height ?? null,
    blurHash: row.blurHash ?? null,
    urls: {
      og: row.urls.og,
      small: row.urls.small,
      thumb: row.urls.thumb,
      raw: row.urls.raw,
    },
    attribution: {
      photographerName: row.attribution?.photographerName ?? null,
      photographerUsername: row.attribution?.photographerUsername ?? null,
      photographerProfileUrl: row.attribution?.photographerProfileUrl ?? null,
      unsplashPageUrl: row.attribution?.unsplashPageUrl ?? null,
    },
  };
}

function buildStaticTemplateCatalog(): TemplateCatalogItem[] {
  return templateList.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    defaultProps: {
      backgroundColor:
        typeof template.defaultProps.backgroundColor === "string"
          ? template.defaultProps.backgroundColor
          : null,
      textColor:
        typeof template.defaultProps.textColor === "string"
          ? template.defaultProps.textColor
          : null,
      accentColor:
        typeof template.defaultProps.accentColor === "string"
          ? template.defaultProps.accentColor
          : null,
      backgroundMode:
        template.defaultProps.backgroundMode === "color" ||
        template.defaultProps.backgroundMode === "photo" ||
        template.defaultProps.backgroundMode === "upload"
          ? template.defaultProps.backgroundMode
          : null,
      backgroundId:
        typeof template.defaultProps.backgroundId === "string"
          ? template.defaultProps.backgroundId
          : null,
      overlayOpacity:
        normalizeOverlay(template.defaultProps.overlayOpacity) ??
        DEFAULT_TEMPLATE_OVERLAY,
    },
  }));
}

const STATIC_TEMPLATE_CATALOG = buildStaticTemplateCatalog();

function mapD1BackgroundRow(row: D1BackgroundItemRow): BackgroundCatalogItem | null {
  if (!row.id || !row.category || !row.og || !row.small || !row.thumb || !row.raw) {
    return null;
  }

  const width = row.width;
  const height = row.height;

  return {
    id: row.id,
    provider: "unsplash",
    category: row.category,
    title: row.title,
    dominantColor: row.dominantColor,
    width: isFinitePositiveInt(width ?? -1) ? width : null,
    height: isFinitePositiveInt(height ?? -1) ? height : null,
    blurHash: row.blurHash,
    urls: {
      og: row.og,
      small: row.small,
      thumb: row.thumb,
      raw: row.raw,
    },
    attribution: {
      photographerName: row.photographerName,
      photographerUsername: row.photographerUsername,
      photographerProfileUrl: row.photographerProfileUrl,
      unsplashPageUrl: row.unsplashPageUrl,
    },
  };
}

function mapD1TemplateRow(row: D1TemplateRow): TemplateCatalogItem | null {
  if (!row.id || !row.name || !row.description || !row.category) {
    return null;
  }

  let parsedDefaults: Record<string, unknown> = {};
  if (row.defaultProps) {
    try {
      const parsed = JSON.parse(row.defaultProps);
      if (parsed && typeof parsed === "object") {
        parsedDefaults = parsed as Record<string, unknown>;
      }
    } catch {
      parsedDefaults = {};
    }
  }

  const backgroundModeRaw = normalizeString(parsedDefaults.backgroundMode);
  const backgroundMode =
    backgroundModeRaw === "color" ||
    backgroundModeRaw === "photo" ||
    backgroundModeRaw === "upload"
      ? backgroundModeRaw
      : null;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    defaultProps: {
      backgroundColor: normalizeString(parsedDefaults.backgroundColor),
      textColor: normalizeString(parsedDefaults.textColor),
      accentColor: normalizeString(parsedDefaults.accentColor),
      backgroundMode,
      backgroundId: normalizeString(parsedDefaults.backgroundId),
      overlayOpacity:
        normalizeOverlay(parsedDefaults.overlayOpacity) ??
        DEFAULT_TEMPLATE_OVERLAY,
    },
  };
}

async function readBackgroundCatalogFromD1(db: D1DatabaseLike): Promise<BackgroundCatalog | null> {
  try {
    const [categoriesResponse, itemsResponse] = await Promise.all([
      db
        .prepare(
          `SELECT c.id, c.label, c.query, COALESCE(COUNT(i.id), 0) AS count
           FROM og_background_categories c
           LEFT JOIN og_background_items i ON i.category = c.id
           GROUP BY c.id, c.label, c.query
           ORDER BY COALESCE(c.sort_order, 9999) ASC, c.id ASC`
        )
        .all<D1BackgroundCategoryRow>(),
      db
        .prepare(
          `SELECT
             id,
             provider,
             category,
             title,
             dominant_color AS dominantColor,
             width,
             height,
             blur_hash AS blurHash,
             url_og AS og,
             url_small AS small,
             url_thumb AS thumb,
             url_raw AS raw,
             photographer_name AS photographerName,
             photographer_username AS photographerUsername,
             photographer_profile_url AS photographerProfileUrl,
             unsplash_page_url AS unsplashPageUrl
           FROM og_background_items
           ORDER BY id ASC`
        )
        .all<D1BackgroundItemRow>(),
    ]);

    const mappedItems = (itemsResponse.results ?? [])
      .map(mapD1BackgroundRow)
      .filter((item): item is BackgroundCatalogItem => Boolean(item));

    if (mappedItems.length === 0) {
      return null;
    }

    const categoryCountMap = new Map<string, number>();
    for (const item of mappedItems) {
      categoryCountMap.set(item.category, (categoryCountMap.get(item.category) ?? 0) + 1);
    }

    const categories = (categoriesResponse.results ?? [])
      .filter((row) => row.id && row.label)
      .map((row) => ({
        id: row.id,
        label: row.label,
        count: categoryCountMap.get(row.id) ?? Math.max(0, Number(row.count ?? 0)),
        query: row.query ?? "",
      }));

    for (const [categoryId, count] of categoryCountMap) {
      const exists = categories.some((category) => category.id === categoryId);
      if (!exists) {
        categories.push({
          id: categoryId,
          label: categoryId,
          count,
          query: "",
        });
      }
    }

    return {
      provider: "unsplash",
      app: "og-image.org",
      generatedAt: new Date().toISOString(),
      categories,
      items: mappedItems,
    };
  } catch {
    return null;
  }
}

async function readTemplateCatalogFromD1(db: D1DatabaseLike): Promise<TemplateCatalogItem[] | null> {
  try {
    const response = await db
      .prepare(
        `SELECT id, name, description, category, default_props AS defaultProps
         FROM og_template_presets
         ORDER BY id ASC`
      )
      .all<D1TemplateRow>();

    const items = (response.results ?? [])
      .map(mapD1TemplateRow)
      .filter((item): item is TemplateCatalogItem => Boolean(item));

    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

function mergeTemplateCatalog(
  baseItems: readonly TemplateCatalogItem[],
  overrideItems: readonly TemplateCatalogItem[]
): TemplateCatalogItem[] {
  const merged = new Map<string, TemplateCatalogItem>();

  for (const item of baseItems) {
    merged.set(item.id, item);
  }

  for (const item of overrideItems) {
    const current = merged.get(item.id);
    if (!current) {
      merged.set(item.id, item);
      continue;
    }

    merged.set(item.id, {
      ...current,
      ...item,
      defaultProps: {
        ...current.defaultProps,
        ...item.defaultProps,
      },
    });
  }

  return [...merged.values()];
}

export async function getBackgroundCatalog(options?: {
  env?: CatalogEnv;
  now?: number;
  forceRefresh?: boolean;
}): Promise<{ source: CatalogSource; catalog: BackgroundCatalog }> {
  const now = options?.now ?? Date.now();

  if (!options?.forceRefresh && backgroundCache && backgroundCache.expiresAt > now) {
    return {
      source: backgroundCache.source,
      catalog: backgroundCache.catalog,
    };
  }

  if (options?.env?.OG_DB) {
    const d1Catalog = await readBackgroundCatalogFromD1(options.env.OG_DB);
    if (d1Catalog) {
      backgroundCache = {
        expiresAt: now + CATALOG_CACHE_TTL_MS,
        source: "d1",
        catalog: d1Catalog,
      };
      return { source: "d1", catalog: d1Catalog };
    }
  }

  const staticItems = STATIC_BACKGROUND_CATALOG.items
    .map(asCatalogItem)
    .filter((item): item is BackgroundCatalogItem => Boolean(item));

  const staticCatalog: BackgroundCatalog = {
    provider: "unsplash",
    app: STATIC_BACKGROUND_CATALOG.app || "og-image.org",
    generatedAt: STATIC_BACKGROUND_CATALOG.generatedAt,
    categories: STATIC_BACKGROUND_CATALOG.categories,
    items: staticItems,
  };

  backgroundCache = {
    expiresAt: now + CATALOG_CACHE_TTL_MS,
    source: "static",
    catalog: staticCatalog,
  };

  return { source: "static", catalog: staticCatalog };
}

export async function getTemplateCatalog(options?: {
  env?: CatalogEnv;
  now?: number;
  forceRefresh?: boolean;
}): Promise<{ source: CatalogSource; items: TemplateCatalogItem[] }> {
  const now = options?.now ?? Date.now();

  if (!options?.forceRefresh && templateCache && templateCache.expiresAt > now) {
    return {
      source: templateCache.source,
      items: templateCache.items,
    };
  }

  if (options?.env?.OG_DB) {
    const d1Items = await readTemplateCatalogFromD1(options.env.OG_DB);
    if (d1Items && d1Items.length > 0) {
      const merged = mergeTemplateCatalog(STATIC_TEMPLATE_CATALOG, d1Items);
      templateCache = {
        expiresAt: now + CATALOG_CACHE_TTL_MS,
        source: "d1",
        items: merged,
      };
      return { source: "d1", items: merged };
    }
  }

  templateCache = {
    expiresAt: now + CATALOG_CACHE_TTL_MS,
    source: "static",
    items: STATIC_TEMPLATE_CATALOG,
  };

  return { source: "static", items: STATIC_TEMPLATE_CATALOG };
}

export async function findBackgroundById(
  id: string,
  options?: {
    env?: CatalogEnv;
    now?: number;
    forceRefresh?: boolean;
  }
): Promise<{ source: CatalogSource; item: BackgroundCatalogItem | null }> {
  const { source, catalog } = await getBackgroundCatalog(options);
  const item = catalog.items.find((candidate) => candidate.id === id) ?? null;
  return { source, item };
}

export function filterBackgroundItems(
  items: readonly BackgroundCatalogItem[],
  options: {
    category?: string | null;
    search?: string | null;
    limit: number;
    offset: number;
  }
): {
  total: number;
  filtered: number;
  items: BackgroundCatalogItem[];
  hasMore: boolean;
} {
  const category = options.category?.trim() || null;
  const search = options.search?.trim().toLowerCase() || null;

  const filteredItems = items.filter((item) => {
    if (category && item.category !== category) {
      return false;
    }

    if (!search) {
      return true;
    }

    const haystacks = [
      item.id,
      item.category,
      item.title ?? "",
      item.attribution.photographerName ?? "",
      item.attribution.photographerUsername ?? "",
    ];

    return haystacks.some((value) => value.toLowerCase().includes(search));
  });

  const start = Math.max(0, options.offset);
  const end = start + Math.max(1, options.limit);
  const paginated = filteredItems.slice(start, end);

  return {
    total: items.length,
    filtered: filteredItems.length,
    items: paginated,
    hasMore: end < filteredItems.length,
  };
}

export function filterTemplateItems(
  items: readonly TemplateCatalogItem[],
  options: {
    category?: string | null;
    search?: string | null;
  }
): TemplateCatalogItem[] {
  const category = options.category?.trim() || null;
  const search = options.search?.trim().toLowerCase() || null;

  return items.filter((item) => {
    if (category && item.category !== category) {
      return false;
    }

    if (!search) {
      return true;
    }

    return [item.id, item.name, item.description, item.category]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });
}
