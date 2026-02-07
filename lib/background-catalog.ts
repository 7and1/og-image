import type { BackgroundCatalog, BackgroundCatalogItem } from "@/types";

interface BackgroundListResponse {
  success: boolean;
  source: "d1" | "static";
  generatedAt: string;
  categories: BackgroundCatalog["categories"];
  items: BackgroundCatalogItem[];
}

interface BackgroundItemResponse {
  success: boolean;
  source: "d1" | "static";
  item: BackgroundCatalogItem;
}

let catalogPromise: Promise<BackgroundCatalog | null> | null = null;
const itemCache = new Map<string, BackgroundCatalogItem>();
const itemRequestCache = new Map<string, Promise<BackgroundCatalogItem | null>>();

function isCatalogItem(input: unknown): input is BackgroundCatalogItem {
  if (!input || typeof input !== "object") {
    return false;
  }

  const candidate = input as Partial<BackgroundCatalogItem>;
  return (
    typeof candidate.id === "string" &&
    candidate.provider === "unsplash" &&
    typeof candidate.category === "string" &&
    typeof candidate.urls?.og === "string" &&
    typeof candidate.urls?.small === "string" &&
    typeof candidate.urls?.thumb === "string" &&
    typeof candidate.urls?.raw === "string"
  );
}

function isCatalogResponse(input: unknown): input is BackgroundListResponse {
  if (!input || typeof input !== "object") {
    return false;
  }

  const candidate = input as Partial<BackgroundListResponse>;
  return (
    candidate.success === true &&
    typeof candidate.generatedAt === "string" &&
    Array.isArray(candidate.categories) &&
    Array.isArray(candidate.items) &&
    candidate.items.every(isCatalogItem)
  );
}

function isItemResponse(input: unknown): input is BackgroundItemResponse {
  if (!input || typeof input !== "object") {
    return false;
  }

  const candidate = input as Partial<BackgroundItemResponse>;
  return candidate.success === true && isCatalogItem(candidate.item);
}

async function loadFromApi(): Promise<BackgroundCatalog | null> {
  try {
    const response = await fetch("/api/backgrounds?limit=500", {
      cache: "default",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as unknown;
    if (!isCatalogResponse(json)) {
      return null;
    }

    return {
      provider: "unsplash",
      app: "og-image.org",
      generatedAt: json.generatedAt,
      categories: json.categories,
      items: json.items,
    };
  } catch {
    return null;
  }
}

async function loadFromStaticFile(): Promise<BackgroundCatalog | null> {
  try {
    const response = await fetch("/catalog/backgrounds.json", {
      cache: "force-cache",
    });
    if (!response.ok) {
      return null;
    }
    const json = (await response.json()) as BackgroundCatalog;
    if (!Array.isArray(json.items)) {
      return null;
    }
    return json;
  } catch {
    return null;
  }
}

async function loadCatalog(): Promise<BackgroundCatalog | null> {
  const apiCatalog = await loadFromApi();
  if (apiCatalog) {
    return apiCatalog;
  }

  return loadFromStaticFile();
}

export async function getBackgroundCatalog(): Promise<BackgroundCatalog | null> {
  if (!catalogPromise) {
    catalogPromise = loadCatalog();
  }
  return catalogPromise;
}

async function fetchBackgroundByIdFromApi(
  id: string
): Promise<BackgroundCatalogItem | null> {
  try {
    const response = await fetch(`/api/backgrounds?id=${encodeURIComponent(id)}`, {
      cache: "default",
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as unknown;
    if (!isItemResponse(json)) {
      return null;
    }

    return json.item;
  } catch {
    return null;
  }
}

export async function getBackgroundById(
  id: string
): Promise<BackgroundCatalogItem | null> {
  const normalizedId = id.trim();
  if (!normalizedId) {
    return null;
  }

  const cachedItem = itemCache.get(normalizedId);
  if (cachedItem) {
    return cachedItem;
  }

  const inFlight = itemRequestCache.get(normalizedId);
  if (inFlight) {
    return inFlight;
  }

  const request = (async () => {
    const fromApi = await fetchBackgroundByIdFromApi(normalizedId);
    if (fromApi) {
      itemCache.set(normalizedId, fromApi);
      return fromApi;
    }

    const catalog = await getBackgroundCatalog();
    if (!catalog) {
      return null;
    }

    const found = catalog.items.find((item) => item.id === normalizedId) ?? null;
    if (found) {
      itemCache.set(normalizedId, found);
    }
    return found;
  })();

  itemRequestCache.set(normalizedId, request);
  try {
    return await request;
  } finally {
    itemRequestCache.delete(normalizedId);
  }
}
