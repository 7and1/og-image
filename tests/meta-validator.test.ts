import { afterEach, describe, expect, it, vi } from "vitest";

import { validateMetaTags } from "../lib/meta-validator";

describe("meta validator", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("scores pages highly when key tags exist", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          url: "https://example.com/post",
          meta: {
            "og:title": "Example Title",
            "og:description": "A descriptive summary for social cards.",
            "og:image": "https://example.com/og.png",
            "og:type": "article",
            "og:url": "https://example.com/post",
            "twitter:card": "summary_large_image",
            "twitter:title": "Example Title",
            "twitter:description": "A descriptive summary for social cards.",
            "twitter:image": "https://example.com/og.png",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const result = await validateMetaTags("https://example.com/post");

    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.meta["og:title"]).toBe("Example Title");
    expect(result.issues.some((issue) => issue.type === "error")).toBe(false);
  });

  it("returns lower score and errors when core tags are missing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          url: "https://example.com/missing",
          meta: {
            title: "Fallback title only",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const result = await validateMetaTags("https://example.com/missing");

    expect(result.score).toBeLessThan(70);
    expect(result.issues.some((issue) => issue.message.includes("og:image"))).toBe(true);
    expect(result.issues.some((issue) => issue.type === "error")).toBe(true);
  });
});
