interface FavoritesListResponse {
  success: boolean;
  ids?: string[];
  error?: {
    code?: string;
    message?: string;
  };
}

interface FavoritesSyncResponse {
  success: boolean;
  ids?: string[];
  error?: {
    code?: string;
    message?: string;
  };
}

interface FavoritesDeleteResponse {
  success: boolean;
  error?: {
    code?: string;
    message?: string;
  };
}

const FAVORITES_ENDPOINT = "/api/favorites";

function normalizeUserKey(userKey: string): string {
  return userKey.trim();
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`Unexpected response type: ${contentType || "unknown"}`);
  }

  return (await response.json()) as T;
}

function unwrapApiError(data: {
  error?: { code?: string; message?: string };
}): string | null {
  const message = data.error?.message?.trim();
  if (message) {
    return message;
  }

  const code = data.error?.code?.trim();
  return code || null;
}

export function safeFavoritesError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}

export async function fetchFavorites(userKey: string): Promise<string[]> {
  const normalizedKey = normalizeUserKey(userKey);
  if (!normalizedKey) {
    return [];
  }

  const response = await fetch(
    `${FAVORITES_ENDPOINT}?userKey=${encodeURIComponent(normalizedKey)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const json = await parseApiResponse<FavoritesListResponse>(response);
  if (!response.ok || !json.success) {
    throw new Error(unwrapApiError(json) ?? "Failed to load favorites");
  }

  return Array.isArray(json.ids) ? json.ids : [];
}

export async function syncFavorites(
  userKey: string,
  ids: string[]
): Promise<string[]> {
  const normalizedKey = normalizeUserKey(userKey);
  if (!normalizedKey) {
    throw new Error("userKey is required");
  }

  const response = await fetch(FAVORITES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      userKey: normalizedKey,
      ids,
    }),
  });

  const json = await parseApiResponse<FavoritesSyncResponse>(response);
  if (!response.ok || !json.success) {
    throw new Error(unwrapApiError(json) ?? "Failed to sync favorites");
  }

  return Array.isArray(json.ids) ? json.ids : [];
}

export async function deleteFavorite(
  userKey: string,
  backgroundId: string
): Promise<void> {
  const normalizedKey = normalizeUserKey(userKey);
  const normalizedId = backgroundId.trim();

  if (!normalizedKey || !normalizedId) {
    throw new Error("userKey and backgroundId are required");
  }

  const response = await fetch(
    `${FAVORITES_ENDPOINT}?userKey=${encodeURIComponent(normalizedKey)}&id=${encodeURIComponent(normalizedId)}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const json = await parseApiResponse<FavoritesDeleteResponse>(response);
  if (!response.ok || !json.success) {
    throw new Error(unwrapApiError(json) ?? "Failed to delete favorite");
  }
}
