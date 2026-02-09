interface D1QueryResult<T> {
  results: T[];
}

interface D1RunMeta {
  changes?: number;
}

interface D1RunResult {
  success: boolean;
  meta?: D1RunMeta;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = unknown>(): Promise<D1QueryResult<T>>;
  run(): Promise<D1RunResult>;
}

interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatement;
}

interface ApiContextEnv {
  OG_DB?: D1DatabaseLike;
}

interface PagesContext<Env = unknown> {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}

type PagesFunction<Env = unknown> = (context: PagesContext<Env>) => Promise<Response>;

interface FavoriteRow {
  backgroundId: string;
  createdAt: string;
}

function buildCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...buildCorsHeaders(),
      ...(init?.headers ?? {}),
    },
  });
}

function parseString(value: unknown, options?: { maxLength?: number }): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (options?.maxLength && normalized.length > options.maxLength) {
    return normalized.slice(0, options.maxLength);
  }

  return normalized;
}

function parseUserKey(value: unknown): string | null {
  return parseString(value, { maxLength: 64 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

// GET /api/favorites?userKey=xxx
export const onRequestGet: PagesFunction<ApiContextEnv> = async (context) => {
  if (!context.env.OG_DB) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "D1_UNAVAILABLE",
          message: "D1 binding OG_DB is not configured",
        },
      },
      { status: 501 }
    );
  }

  const url = new URL(context.request.url);
  const userKey = parseUserKey(url.searchParams.get("userKey"));
  if (!userKey) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_USER_KEY",
          message: "userKey query parameter is required",
        },
      },
      { status: 400 }
    );
  }

  try {
    const result = await context.env.OG_DB
      .prepare(
        `SELECT background_id AS backgroundId, created_at AS createdAt
         FROM og_user_favorites
         WHERE user_key = ?
         ORDER BY created_at DESC`
      )
      .bind(userKey)
      .all<FavoriteRow>();

    const ids = (result.results ?? []).map((row) => row.backgroundId);

    return jsonResponse({
      success: true,
      userKey,
      count: ids.length,
      ids,
    });
  } catch {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "QUERY_FAILED",
          message: "Failed to query favorites",
        },
      },
      { status: 500 }
    );
  }
};

// POST /api/favorites - Sync all favorites (replace)
export const onRequestPost: PagesFunction<ApiContextEnv> = async (context) => {
  if (!context.env.OG_DB) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "D1_UNAVAILABLE",
          message: "D1 binding OG_DB is not configured",
        },
      },
      { status: 501 }
    );
  }

  let body: unknown;
  try {
    body = (await context.request.json()) as unknown;
  } catch {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON",
        },
      },
      { status: 400 }
    );
  }

  if (!isRecord(body)) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_BODY",
          message: "Body must be a JSON object",
        },
      },
      { status: 400 }
    );
  }

  const userKey = parseUserKey(body.userKey);
  if (!userKey) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_USER_KEY",
          message: "userKey is required",
        },
      },
      { status: 400 }
    );
  }

  const ids = body.ids;
  if (!isStringArray(ids)) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_IDS",
          message: "ids must be an array of strings",
        },
      },
      { status: 400 }
    );
  }

  // Sanitize and dedupe
  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))].slice(0, 500);

  try {
    // Delete all existing favorites for this user
    await context.env.OG_DB
      .prepare(`DELETE FROM og_user_favorites WHERE user_key = ?`)
      .bind(userKey)
      .run();

    // Insert new favorites
    for (const backgroundId of uniqueIds) {
      await context.env.OG_DB
        .prepare(
          `INSERT INTO og_user_favorites (user_key, background_id)
           VALUES (?, ?)`
        )
        .bind(userKey, backgroundId.slice(0, 120))
        .run();
    }

    return jsonResponse({
      success: true,
      userKey,
      count: uniqueIds.length,
      ids: uniqueIds,
    });
  } catch {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "SYNC_FAILED",
          message: "Failed to sync favorites",
        },
      },
      { status: 500 }
    );
  }
};

// DELETE /api/favorites?userKey=xxx&id=xxx - Remove single favorite
export const onRequestDelete: PagesFunction<ApiContextEnv> = async (context) => {
  if (!context.env.OG_DB) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "D1_UNAVAILABLE",
          message: "D1 binding OG_DB is not configured",
        },
      },
      { status: 501 }
    );
  }

  const url = new URL(context.request.url);
  const userKey = parseUserKey(url.searchParams.get("userKey"));
  const backgroundId = parseString(url.searchParams.get("id"), { maxLength: 120 });

  if (!userKey || !backgroundId) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_PARAMS",
          message: "userKey and id query parameters are required",
        },
      },
      { status: 400 }
    );
  }

  try {
    const result = await context.env.OG_DB
      .prepare(`DELETE FROM og_user_favorites WHERE user_key = ? AND background_id = ?`)
      .bind(userKey, backgroundId)
      .run();

    const changes = Number(result.meta?.changes ?? 0);
    if (!result.success || changes < 1) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Favorite not found",
          },
        },
        { status: 404 }
      );
    }

    return jsonResponse({ success: true });
  } catch {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "DELETE_FAILED",
          message: "Failed to delete favorite",
        },
      },
      { status: 500 }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      ...buildCorsHeaders(),
      "Access-Control-Max-Age": "86400",
    },
  });
};
