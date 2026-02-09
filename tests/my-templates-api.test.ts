import { describe, expect, it } from "vitest";

import {
  onRequestDelete,
  onRequestGet,
  onRequestPost,
} from "../functions/api/my-templates";
import type { MyTemplatePayload } from "../types";

interface StoredTemplate {
  id: string;
  userKey: string;
  name: string;
  templateId: string | null;
  payload: string;
  createdAt: string;
  updatedAt: string;
}

interface D1QueryResult<T> {
  results: T[];
}

interface D1RunResult {
  success: boolean;
  meta?: {
    changes?: number;
  };
}

class FakeStatement {
  constructor(
    private readonly db: FakeD1,
    private readonly query: string,
    private readonly params: unknown[] = []
  ) {}

  bind(...values: unknown[]): FakeStatement {
    return new FakeStatement(this.db, this.query, values);
  }

  async all<T = unknown>(): Promise<D1QueryResult<T>> {
    return {
      results: this.db.executeAll(this.query, this.params) as T[],
    };
  }

  async run(): Promise<D1RunResult> {
    return this.db.executeRun(this.query, this.params);
  }
}

class FakeD1 {
  private rows: StoredTemplate[] = [];

  prepare(query: string): FakeStatement {
    return new FakeStatement(this, query);
  }

  executeAll(query: string, params: unknown[]): unknown[] {
    const sql = query.replace(/\s+/g, " ").trim().toLowerCase();

    if (sql.includes("from og_user_templates") && sql.includes("where user_key = ?") && sql.includes("limit ?")) {
      const userKey = String(params[0] ?? "");
      const limit = Number(params[1] ?? 50);

      return this.rows
        .filter((row) => row.userKey === userKey)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, limit)
        .map((row) => ({
          id: row.id,
          userKey: row.userKey,
          name: row.name,
          templateId: row.templateId,
          payload: row.payload,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        }));
    }

    if (sql.includes("from og_user_templates") && sql.includes("where id = ? and user_key = ?")) {
      const id = String(params[0] ?? "");
      const userKey = String(params[1] ?? "");
      const row = this.rows.find((candidate) => candidate.id === id && candidate.userKey === userKey);

      if (!row) {
        return [];
      }

      return [
        {
          id: row.id,
          userKey: row.userKey,
          name: row.name,
          templateId: row.templateId,
          payload: row.payload,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        },
      ];
    }

    return [];
  }

  executeRun(query: string, params: unknown[]): D1RunResult {
    const sql = query.replace(/\s+/g, " ").trim().toLowerCase();

    if (sql.startsWith("insert into og_user_templates")) {
      const now = new Date().toISOString();
      const row: StoredTemplate = {
        id: String(params[0] ?? ""),
        userKey: String(params[1] ?? ""),
        name: String(params[2] ?? ""),
        templateId: (params[3] as string | null) ?? null,
        payload: String(params[4] ?? "{}"),
        createdAt: now,
        updatedAt: now,
      };

      this.rows.push(row);
      return {
        success: true,
        meta: { changes: 1 },
      };
    }

    if (sql.startsWith("delete from og_user_templates")) {
      const id = String(params[0] ?? "");
      const userKey = String(params[1] ?? "");

      const before = this.rows.length;
      this.rows = this.rows.filter(
        (row) => !(row.id === id && row.userKey === userKey)
      );

      return {
        success: true,
        meta: { changes: before - this.rows.length },
      };
    }

    return {
      success: false,
      meta: { changes: 0 },
    };
  }
}

interface TestContext {
  request: Request;
  env: {
    OG_DB?: FakeD1;
  };
  waitUntil: (promise: Promise<unknown>) => void;
}

function createContext(request: Request, db?: FakeD1): TestContext {
  return {
    request,
    env: {
      OG_DB: db,
    },
    waitUntil: () => {},
  };
}

const samplePayload: MyTemplatePayload = {
  title: "My Launch",
  description: "Shipping a better OG experience",
  icon: "🚀",
  template: "photo-hero",
  backgroundColor: "#111111",
  textColor: "#ffffff",
  accentColor: "#22c55e",
  backgroundMode: "photo",
  backgroundId: "qOGTYdYWQ7I",
  backgroundImageSrc: "https://images.unsplash.com/photo-1",
  overlayOpacity: 0.6,
  fontFamily: "inter",
  fontSize: "medium",
  layout: "center",
};

describe("my-templates API", () => {
  it("returns 501 when D1 is unavailable", async () => {
    const response = await onRequestGet(
      createContext(new Request("https://og-image.org/api/my-templates?userKey=demo"))
    );

    expect(response.status).toBe(501);

    const json = (await response.json()) as {
      success: boolean;
      error?: { code?: string };
    };

    expect(json.success).toBe(false);
    expect(json.error?.code).toBe("D1_UNAVAILABLE");
  });

  it("validates missing userKey on GET", async () => {
    const db = new FakeD1();

    const response = await onRequestGet(
      createContext(new Request("https://og-image.org/api/my-templates"), db)
    );

    expect(response.status).toBe(400);

    const json = (await response.json()) as {
      success: boolean;
      error?: { code?: string };
    };

    expect(json.success).toBe(false);
    expect(json.error?.code).toBe("INVALID_USER_KEY");
  });

  it("creates, lists, and deletes templates", async () => {
    const db = new FakeD1();

    const createResponse = await onRequestPost(
      createContext(
        new Request("https://og-image.org/api/my-templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userKey: "demo-user",
            name: "Launch Hero",
            payload: samplePayload,
            templateId: samplePayload.template,
          }),
        }),
        db
      )
    );

    expect(createResponse.status).toBe(201);

    const createJson = (await createResponse.json()) as {
      success: boolean;
      item?: { id: string; userKey: string; name: string };
    };

    expect(createJson.success).toBe(true);
    expect(createJson.item?.id).toBeTruthy();
    expect(createJson.item?.userKey).toBe("demo-user");

    const listResponse = await onRequestGet(
      createContext(
        new Request("https://og-image.org/api/my-templates?userKey=demo-user&limit=20"),
        db
      )
    );

    expect(listResponse.status).toBe(200);

    const listJson = (await listResponse.json()) as {
      success: boolean;
      count: number;
      items: Array<{ id: string; name: string }>;
    };

    expect(listJson.success).toBe(true);
    expect(listJson.count).toBe(1);
    expect(listJson.items[0]?.name).toBe("Launch Hero");

    const itemId = listJson.items[0]?.id;
    expect(itemId).toBeTruthy();

    const deleteResponse = await onRequestDelete(
      createContext(
        new Request(
          `https://og-image.org/api/my-templates?userKey=demo-user&id=${encodeURIComponent(
            String(itemId)
          )}`,
          { method: "DELETE" }
        ),
        db
      )
    );

    expect(deleteResponse.status).toBe(200);
    const deleteJson = (await deleteResponse.json()) as { success: boolean };
    expect(deleteJson.success).toBe(true);

    const listAfterDelete = await onRequestGet(
      createContext(
        new Request("https://og-image.org/api/my-templates?userKey=demo-user"),
        db
      )
    );

    expect(listAfterDelete.status).toBe(200);
    const listAfterDeleteJson = (await listAfterDelete.json()) as {
      success: boolean;
      count: number;
      items: unknown[];
    };

    expect(listAfterDeleteJson.success).toBe(true);
    expect(listAfterDeleteJson.count).toBe(0);
    expect(listAfterDeleteJson.items).toHaveLength(0);
  });
});
