import { filterTemplateItems, getTemplateCatalog } from "./_lib/catalog";

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

  const id = url.searchParams.get("id")?.trim() || null;
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");

  const { source, items } = await getTemplateCatalog({ env: context.env });

  if (id) {
    const item = items.find((candidate) => candidate.id === id) ?? null;
    if (!item) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Template '${id}' not found`,
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

  const filtered = filterTemplateItems(items, {
    category,
    search,
  });

  return jsonResponse({
    success: true,
    source,
    total: items.length,
    filtered: filtered.length,
    categories: [...new Set(items.map((item) => item.category))],
    items: filtered,
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
