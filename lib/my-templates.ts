import type { MyTemplateItem, MyTemplatePayload } from "@/types";

interface ListResponse {
  success: boolean;
  items?: MyTemplateItem[];
  error?: {
    code?: string;
    message?: string;
  };
}

interface SaveResponse {
  success: boolean;
  item?: MyTemplateItem;
  error?: {
    code?: string;
    message?: string;
  };
}

interface DeleteResponse {
  success: boolean;
  error?: {
    code?: string;
    message?: string;
  };
}

interface SaveTemplateInput {
  userKey: string;
  name: string;
  payload: MyTemplatePayload;
}

interface DeleteTemplateInput {
  userKey: string;
  id: string;
}

interface RenameTemplateInput {
  userKey: string;
  id: string;
  name: string;
}

interface RenameResponse {
  success: boolean;
  item?: MyTemplateItem;
  error?: {
    code?: string;
    message?: string;
  };
}

const MY_TEMPLATES_ENDPOINT = "/api/my-templates";

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

export function safeTemplateError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}

export function createTemplateName(title: string): string {
  const base = title.trim() || "Untitled";
  const clipped = base.length > 48 ? `${base.slice(0, 48)}…` : base;
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  return `${clipped} · ${stamp}`;
}

export async function fetchMyTemplates(userKey: string): Promise<MyTemplateItem[]> {
  const normalizedKey = normalizeUserKey(userKey);
  if (!normalizedKey) {
    return [];
  }

  const response = await fetch(
    `${MY_TEMPLATES_ENDPOINT}?userKey=${encodeURIComponent(normalizedKey)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const json = await parseApiResponse<ListResponse>(response);
  if (!response.ok || !json.success) {
    throw new Error(unwrapApiError(json) ?? "Failed to load templates");
  }

  return Array.isArray(json.items) ? json.items : [];
}

export async function saveMyTemplate(input: SaveTemplateInput): Promise<MyTemplateItem> {
  const normalizedKey = normalizeUserKey(input.userKey);
  if (!normalizedKey) {
    throw new Error("userKey is required");
  }

  const response = await fetch(MY_TEMPLATES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      userKey: normalizedKey,
      name: input.name,
      payload: input.payload,
      templateId: input.payload.template,
    }),
  });

  const json = await parseApiResponse<SaveResponse>(response);
  if (!response.ok || !json.success || !json.item) {
    throw new Error(unwrapApiError(json) ?? "Failed to save template");
  }

  return json.item;
}

export async function deleteMyTemplate(input: DeleteTemplateInput): Promise<void> {
  const normalizedKey = normalizeUserKey(input.userKey);
  const normalizedId = input.id.trim();

  if (!normalizedKey || !normalizedId) {
    throw new Error("userKey and id are required");
  }

  const response = await fetch(
    `${MY_TEMPLATES_ENDPOINT}?userKey=${encodeURIComponent(normalizedKey)}&id=${encodeURIComponent(normalizedId)}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }
  );

  const json = await parseApiResponse<DeleteResponse>(response);
  if (!response.ok || !json.success) {
    throw new Error(unwrapApiError(json) ?? "Failed to delete template");
  }
}

export async function renameMyTemplate(input: RenameTemplateInput): Promise<MyTemplateItem> {
  const normalizedKey = normalizeUserKey(input.userKey);
  const normalizedId = input.id.trim();
  const normalizedName = input.name.trim();

  if (!normalizedKey || !normalizedId) {
    throw new Error("userKey and id are required");
  }

  if (!normalizedName) {
    throw new Error("name is required");
  }

  const response = await fetch(MY_TEMPLATES_ENDPOINT, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      userKey: normalizedKey,
      id: normalizedId,
      name: normalizedName,
    }),
  });

  const json = await parseApiResponse<RenameResponse>(response);
  if (!response.ok || !json.success || !json.item) {
    throw new Error(unwrapApiError(json) ?? "Failed to rename template");
  }

  return json.item;
}
