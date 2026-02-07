import { describe, expect, it } from "vitest";

import { onRequestGet as backgroundsGet } from "../functions/api/backgrounds";
import { onRequestGet as templatesGet } from "../functions/api/templates";

interface TestContext {
  request: Request;
  env: Record<string, never>;
  waitUntil: (promise: Promise<unknown>) => void;
}

function createContext(url: string): TestContext {
  return {
    request: new Request(url),
    env: {},
    waitUntil: () => {},
  };
}

describe("functions API endpoints", () => {
  it("returns background catalog list with pagination", async () => {
    const response = await backgroundsGet(
      createContext("https://og-image.org/api/backgrounds?limit=5&offset=0")
    );

    expect(response.status).toBe(200);

    const json = (await response.json()) as {
      success: boolean;
      items: unknown[];
      categories: unknown[];
      total: number;
      filtered: number;
      hasMore: boolean;
    };

    expect(json.success).toBe(true);
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBeLessThanOrEqual(5);
    expect(Array.isArray(json.categories)).toBe(true);
    expect(json.total).toBeGreaterThan(0);
    expect(json.filtered).toBeGreaterThan(0);
    expect(typeof json.hasMore).toBe("boolean");
  });

  it("returns 404 for missing background id", async () => {
    const response = await backgroundsGet(
      createContext("https://og-image.org/api/backgrounds?id=not-existing-id")
    );

    expect(response.status).toBe(404);

    const json = (await response.json()) as {
      success: boolean;
      error?: { code?: string };
    };

    expect(json.success).toBe(false);
    expect(json.error?.code).toBe("NOT_FOUND");
  });

  it("returns template catalog list", async () => {
    const response = await templatesGet(
      createContext("https://og-image.org/api/templates?category=social")
    );

    expect(response.status).toBe(200);

    const json = (await response.json()) as {
      success: boolean;
      items: Array<{ category: string }>;
      filtered: number;
    };

    expect(json.success).toBe(true);
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.filtered).toBe(json.items.length);
    for (const item of json.items) {
      expect(item.category).toBe("social");
    }
  });
});
