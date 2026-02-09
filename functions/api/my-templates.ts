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

type BackgroundMode = "color" | "photo" | "upload";
type FontFamily = "inter" | "roboto" | "space-grotesk";
type FontSize = "small" | "medium" | "large";
type Layout = "center" | "left" | "split";

interface MyTemplatePayload {
  title: string;
  description: string;
  icon: string;
  template: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundMode: BackgroundMode;
  backgroundId: string | null;
  backgroundImageSrc: string | null;
  overlayOpacity: number;
  fontFamily: FontFamily;
  fontSize: FontSize;
  layout: Layout;
}

interface MyTemplateItem {
  id: string;
  userKey: string;
  name: string;
  templateId: string | null;
  payload: MyTemplatePayload;
  createdAt: string;
  updatedAt: string;
}

interface MyTemplateRow {
  id: string;
  userKey: string;
  name: string;
  templateId: string | null;
  payload: string;
  createdAt: string;
  updatedAt: string;
}

function buildCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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
  const key = parseString(value, { maxLength: 64 });
  if (!key) {
    return null;
  }

  return key;
}

function parsePositiveInt(raw: string | null, fallback: number, max: number): number {
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(1, Math.min(max, Math.floor(parsed)));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBackgroundMode(value: unknown): value is BackgroundMode {
  return value === "color" || value === "photo" || value === "upload";
}

function isFontFamily(value: unknown): value is FontFamily {
  return value === "inter" || value === "roboto" || value === "space-grotesk";
}

function isFontSize(value: unknown): value is FontSize {
  return value === "small" || value === "medium" || value === "large";
}

function isLayout(value: unknown): value is Layout {
  return value === "center" || value === "left" || value === "split";
}

function isMyTemplatePayload(value: unknown): value is MyTemplatePayload {
  if (!isRecord(value)) {
    return false;
  }

  const backgroundIdValid = value.backgroundId === null || typeof value.backgroundId === "string";
  const backgroundImageValid =
    value.backgroundImageSrc === null || typeof value.backgroundImageSrc === "string";

  return (
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.icon === "string" &&
    typeof value.template === "string" &&
    typeof value.backgroundColor === "string" &&
    typeof value.textColor === "string" &&
    typeof value.accentColor === "string" &&
    isBackgroundMode(value.backgroundMode) &&
    backgroundIdValid &&
    backgroundImageValid &&
    typeof value.overlayOpacity === "number" &&
    Number.isFinite(value.overlayOpacity) &&
    isFontFamily(value.fontFamily) &&
    isFontSize(value.fontSize) &&
    isLayout(value.layout)
  );
}

function clampOverlay(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function sanitizePayload(payload: MyTemplatePayload): MyTemplatePayload {
  return {
    ...payload,
    title: payload.title.slice(0, 160),
    description: payload.description.slice(0, 300),
    icon: payload.icon.slice(0, 32),
    template: payload.template.slice(0, 80),
    backgroundColor: payload.backgroundColor.slice(0, 300),
    textColor: payload.textColor.slice(0, 64),
    accentColor: payload.accentColor.slice(0, 64),
    backgroundId: payload.backgroundId ? payload.backgroundId.slice(0, 120) : null,
    backgroundImageSrc: payload.backgroundImageSrc
      ? payload.backgroundImageSrc.slice(0, 4096)
      : null,
    overlayOpacity: clampOverlay(payload.overlayOpacity),
  };
}

function createTemplateId(): string {
  const random = Math.random().toString(36).slice(2, 12);
  return `tpl_${Date.now().toString(36)}_${random}`;
}

function createTemplateName(title: string): string {
  const base = title.trim() || "Untitled";
  const clipped = base.length > 40 ? `${base.slice(0, 40)}…` : base;
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  return `${clipped} · ${stamp}`;
}

function parseTemplateRow(row: MyTemplateRow): MyTemplateItem | null {
  if (!row.id || !row.userKey || !row.name || !row.payload || !row.createdAt || !row.updatedAt) {
    return null;
  }

  let payloadUnknown: unknown;
  try {
    payloadUnknown = JSON.parse(row.payload);
  } catch {
    return null;
  }

  if (!isMyTemplatePayload(payloadUnknown)) {
    return null;
  }

  return {
    id: row.id,
    userKey: row.userKey,
    name: row.name,
    templateId: row.templateId,
    payload: sanitizePayload(payloadUnknown),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function queryTemplateById(
  db: D1DatabaseLike,
  id: string,
  userKey: string
): Promise<MyTemplateItem | null> {
  const result = await db
    .prepare(
      `SELECT
         id,
         user_key AS userKey,
         name,
         template_id AS templateId,
         payload,
         created_at AS createdAt,
         updated_at AS updatedAt
       FROM og_user_templates
       WHERE id = ? AND user_key = ?
       LIMIT 1`
    )
    .bind(id, userKey)
    .all<MyTemplateRow>();

  const row = result.results?.[0] ?? null;
  if (!row) {
    return null;
  }

  return parseTemplateRow(row);
}

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

  const limit = parsePositiveInt(url.searchParams.get("limit"), 50, 200);

  try {
    const result = await context.env.OG_DB
      .prepare(
        `SELECT
           id,
           user_key AS userKey,
           name,
           template_id AS templateId,
           payload,
           created_at AS createdAt,
           updated_at AS updatedAt
         FROM og_user_templates
         WHERE user_key = ?
         ORDER BY updated_at DESC, created_at DESC
         LIMIT ?`
      )
      .bind(userKey, limit)
      .all<MyTemplateRow>();

    const items = (result.results ?? [])
      .map(parseTemplateRow)
      .filter((item): item is MyTemplateItem => Boolean(item));

    return jsonResponse({
      success: true,
      userKey,
      count: items.length,
      items,
    });
  } catch {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "QUERY_FAILED",
          message: "Failed to query templates",
        },
      },
      { status: 500 }
    );
  }
};

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

  const payload = body.payload;
  if (!isMyTemplatePayload(payload)) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_PAYLOAD",
          message: "payload is invalid or missing required fields",
        },
      },
      { status: 400 }
    );
  }

  const normalizedPayload = sanitizePayload(payload);
  const providedName = parseString(body.name, { maxLength: 80 });
  const name = providedName ?? createTemplateName(normalizedPayload.title);

  const templateId =
    parseString(body.templateId, { maxLength: 80 }) ??
    parseString(normalizedPayload.template, { maxLength: 80 });

  const id = createTemplateId();

  try {
    const writeResult = await context.env.OG_DB
      .prepare(
        `INSERT INTO og_user_templates (
           id,
           user_key,
           name,
           template_id,
           payload,
           created_at,
           updated_at
         ) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
      )
      .bind(id, userKey, name, templateId, JSON.stringify(normalizedPayload))
      .run();

    if (!writeResult.success) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "INSERT_FAILED",
            message: "Failed to save template",
          },
        },
        { status: 500 }
      );
    }

    const item = await queryTemplateById(context.env.OG_DB, id, userKey);
    if (!item) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "READ_AFTER_WRITE_FAILED",
            message: "Template saved but failed to read it back",
          },
        },
        { status: 500 }
      );
    }

    return jsonResponse(
      {
        success: true,
        item,
      },
      { status: 201 }
    );
  } catch {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "SAVE_FAILED",
          message: "Failed to save template",
        },
      },
      { status: 500 }
    );
  }
};

export const onRequestPatch: PagesFunction<ApiContextEnv> = async (context) => {
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
  const id = parseString(body.id, { maxLength: 80 });
  const newName = parseString(body.name, { maxLength: 80 });

  if (!userKey || !id) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_PARAMS",
          message: "id and userKey are required",
        },
      },
      { status: 400 }
    );
  }

  if (!newName) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_NAME",
          message: "name is required and cannot be empty",
        },
      },
      { status: 400 }
    );
  }

  try {
    const result = await context.env.OG_DB
      .prepare(
        `UPDATE og_user_templates
         SET name = ?, updated_at = datetime('now')
         WHERE id = ? AND user_key = ?`
      )
      .bind(newName, id, userKey)
      .run();

    const changes = Number(result.meta?.changes ?? 0);
    if (!result.success || changes < 1) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Template not found",
          },
        },
        { status: 404 }
      );
    }

    const item = await queryTemplateById(context.env.OG_DB, id, userKey);
    if (!item) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "READ_AFTER_UPDATE_FAILED",
            message: "Template updated but failed to read it back",
          },
        },
        { status: 500 }
      );
    }

    return jsonResponse({ success: true, item });
  } catch {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "UPDATE_FAILED",
          message: "Failed to update template",
        },
      },
      { status: 500 }
    );
  }
};

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
  const id = parseString(url.searchParams.get("id"), { maxLength: 80 });

  if (!userKey || !id) {
    return jsonResponse(
      {
        success: false,
        error: {
          code: "INVALID_PARAMS",
          message: "id and userKey query parameters are required",
        },
      },
      { status: 400 }
    );
  }

  try {
    const result = await context.env.OG_DB
      .prepare(`DELETE FROM og_user_templates WHERE id = ? AND user_key = ?`)
      .bind(id, userKey)
      .run();

    const changes = Number(result.meta?.changes ?? 0);
    if (!result.success || changes < 1) {
      return jsonResponse(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Template not found",
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
          message: "Failed to delete template",
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
