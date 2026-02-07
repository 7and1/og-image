import {
  filterBackgroundItems,
  findBackgroundById,
  getBackgroundCatalog,
} from "./_lib/catalog";

interface D1QueryResult<T> {
  results: T[];
}

interface D1PreparedStatement {
  all<T = unknown>(): Promise<D1QueryResult<T>>;
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

function buildCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function parsePositiveInt(
  raw: string | null,
  fallback: number,
  options: { min: number; max: number }
): number {
  if (!raw) {
    return fallback;
  }

  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(options.max, Math.max(options.min, Math.floor(value)));
}

function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=86400",
      ...buildCorsHeaders(),
      ...(init?.headers ?? {}),
    },
  });
}

export const onRequestGet: PagesFunction<ApiContextEnv> = async (context) => {
  const url = new URL(context.request.url);
  const env = context.env;

  const id = url.searchParams.get("id")?.trim() || null;
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");

  const limit = parsePositiveInt(url.searchParams.get("limit"), 30, {
    min: 1,
    max: 200,
  });
  const offset = parsePositiveInt(url.searchParams.get("offset"), 0, {
    min: 0,
    max: 10_000,
  });

  if (id) {
    const { source, item } = await findBackgroundById(id, { env });
    if (!item) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Background '${id}' not found`,
          },
        },
        { status: 404 }
      );
    }

    return jsonResponse({
      success: true,
      source,
      item,
    });
  }

  const { source, catalog } = await getBackgroundCatalog({ env });
  const filtered = filterBackgroundItems(catalog.items, {
    category,
    search,
    limit,
    offset,
  });

  return jsonResponse({
    success: true,
    source,
    generatedAt: catalog.generatedAt,
    categories: catalog.categories,
    total: filtered.total,
    filtered: filtered.filtered,
    limit,
    offset,
    hasMore: filtered.hasMore,
    items: filtered.items,
  });
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      ...buildCorsHeaders(),
      "Access-Control-Max-Age": "86400",
    },
  });
};
