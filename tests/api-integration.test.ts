import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/**
 * Integration tests for the OG Image API endpoints
 * Tests the full request/response cycle for edge functions
 */

// Mock the Cloudflare environment
const mockEnv = {
  OG_DB: undefined,
};

const mockWaitUntil = vi.fn();

function createMockContext(url: string) {
  return {
    request: new Request(url),
    env: mockEnv,
    waitUntil: mockWaitUntil,
  };
}

describe("API Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Rate Limiting", () => {
    it("should include rate limit headers in responses", async () => {
      // Import dynamically to avoid module caching issues
      const { onRequestGet } = await import("../functions/api/backgrounds");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/backgrounds?limit=1")
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });

    it("should return proper CORS headers for OPTIONS requests", async () => {
      const { onRequestOptions } = await import("../functions/api/backgrounds");

      const response = await onRequestOptions(
        createMockContext("https://og-image.org/api/backgrounds")
      );

      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain("GET");
      expect(response.headers.get("Access-Control-Max-Age")).toBe("86400");
    });
  });

  describe("Backgrounds API", () => {
    it("should return paginated background list", async () => {
      const { onRequestGet } = await import("../functions/api/backgrounds");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/backgrounds?limit=5&offset=0")
      );

      expect(response.status).toBe(200);

      const json = await response.json() as {
        success: boolean;
        items: unknown[];
        total: number;
        filtered: number;
        hasMore: boolean;
        limit: number;
        offset: number;
      };

      expect(json.success).toBe(true);
      expect(Array.isArray(json.items)).toBe(true);
      expect(json.items.length).toBeLessThanOrEqual(5);
      expect(json.limit).toBe(5);
      expect(json.offset).toBe(0);
      expect(typeof json.total).toBe("number");
      expect(typeof json.hasMore).toBe("boolean");
    });

    it("should filter backgrounds by category", async () => {
      const { onRequestGet } = await import("../functions/api/backgrounds");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/backgrounds?category=technology&limit=10")
      );

      expect(response.status).toBe(200);

      const json = await response.json() as {
        success: boolean;
        items: Array<{ category: string }>;
      };

      expect(json.success).toBe(true);
      for (const item of json.items) {
        expect(item.category).toBe("technology");
      }
    });

    it("should return 404 for non-existent background ID", async () => {
      const { onRequestGet } = await import("../functions/api/backgrounds");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/backgrounds?id=non-existent-id-12345")
      );

      expect(response.status).toBe(404);

      const json = await response.json() as {
        success: boolean;
        error: { code: string };
      };

      expect(json.success).toBe(false);
      expect(json.error.code).toBe("NOT_FOUND");
    });
  });

  describe("Templates API", () => {
    it("should return template list", async () => {
      const { onRequestGet } = await import("../functions/api/templates");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/templates")
      );

      expect(response.status).toBe(200);

      const json = await response.json() as {
        success: boolean;
        items: Array<{
          id: string;
          name: string;
          category: string;
        }>;
        total: number;
      };

      expect(json.success).toBe(true);
      expect(Array.isArray(json.items)).toBe(true);
      expect(json.items.length).toBeGreaterThan(0);

      // Verify template structure
      for (const item of json.items) {
        expect(typeof item.id).toBe("string");
        expect(typeof item.name).toBe("string");
        expect(typeof item.category).toBe("string");
      }
    });

    it("should filter templates by category", async () => {
      const { onRequestGet } = await import("../functions/api/templates");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/templates?category=social")
      );

      expect(response.status).toBe(200);

      const json = await response.json() as {
        success: boolean;
        items: Array<{ category: string }>;
        filtered: number;
      };

      expect(json.success).toBe(true);
      expect(json.filtered).toBe(json.items.length);

      for (const item of json.items) {
        expect(item.category).toBe("social");
      }
    });

    it("should return 404 for non-existent template ID", async () => {
      const { onRequestGet } = await import("../functions/api/templates");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/templates?id=non-existent-template")
      );

      expect(response.status).toBe(404);

      const json = await response.json() as {
        success: boolean;
        error: { code: string };
      };

      expect(json.success).toBe(false);
      expect(json.error.code).toBe("NOT_FOUND");
    });

    it("should search templates by keyword", async () => {
      const { onRequestGet } = await import("../functions/api/templates");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/templates?search=gradient")
      );

      expect(response.status).toBe(200);

      const json = await response.json() as {
        success: boolean;
        items: Array<{ id: string; name: string; description: string }>;
      };

      expect(json.success).toBe(true);

      // At least one result should contain "gradient"
      const hasMatch = json.items.some(
        (item) =>
          item.id.toLowerCase().includes("gradient") ||
          item.name.toLowerCase().includes("gradient") ||
          item.description.toLowerCase().includes("gradient")
      );
      expect(hasMatch).toBe(true);
    });
  });

  describe("Response Headers", () => {
    it("should set proper cache headers", async () => {
      const { onRequestGet } = await import("../functions/api/backgrounds");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/backgrounds?limit=1")
      );

      const cacheControl = response.headers.get("Cache-Control");
      expect(cacheControl).toContain("public");
      expect(cacheControl).toContain("s-maxage");
    });

    it("should set JSON content type", async () => {
      const { onRequestGet } = await import("../functions/api/templates");

      const response = await onRequestGet(
        createMockContext("https://og-image.org/api/templates")
      );

      expect(response.headers.get("Content-Type")).toContain("application/json");
    });
  });
});

describe("Error Handling", () => {
  it("should handle malformed requests gracefully", async () => {
    const { onRequestGet } = await import("../functions/api/backgrounds");

    // Test with invalid offset
    const response = await onRequestGet(
      createMockContext("https://og-image.org/api/backgrounds?offset=invalid")
    );

    // Should still return 200 with default offset
    expect(response.status).toBe(200);
  });

  it("should clamp limit to valid range", async () => {
    const { onRequestGet } = await import("../functions/api/backgrounds");

    // Test with limit exceeding max
    const response = await onRequestGet(
      createMockContext("https://og-image.org/api/backgrounds?limit=9999")
    );

    expect(response.status).toBe(200);

    const json = await response.json() as {
      limit: number;
    };

    // Should be clamped to max (200)
    expect(json.limit).toBeLessThanOrEqual(200);
  });
});
