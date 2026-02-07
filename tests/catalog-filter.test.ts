import { describe, expect, it } from "vitest";

import {
  filterBackgroundItems,
  filterTemplateItems,
} from "../functions/api/_lib/catalog";
import type {
  BackgroundCatalogItem,
  TemplateCatalogItem,
} from "../functions/api/_lib/og-types";

const sampleBackgrounds: BackgroundCatalogItem[] = [
  {
    id: "bg-1",
    provider: "unsplash",
    category: "technology",
    title: "Neon Circuit",
    dominantColor: "#0ea5e9",
    width: 1200,
    height: 630,
    blurHash: null,
    urls: {
      og: "https://example.com/1-og.jpg",
      small: "https://example.com/1-small.jpg",
      thumb: "https://example.com/1-thumb.jpg",
      raw: "https://example.com/1-raw.jpg",
    },
    attribution: {
      photographerName: "Alice",
      photographerUsername: "alice",
      photographerProfileUrl: "https://example.com/alice",
      unsplashPageUrl: "https://example.com/photo/1",
    },
  },
  {
    id: "bg-2",
    provider: "unsplash",
    category: "nature",
    title: "Forest Morning",
    dominantColor: "#16a34a",
    width: 1200,
    height: 630,
    blurHash: null,
    urls: {
      og: "https://example.com/2-og.jpg",
      small: "https://example.com/2-small.jpg",
      thumb: "https://example.com/2-thumb.jpg",
      raw: "https://example.com/2-raw.jpg",
    },
    attribution: {
      photographerName: "Bob",
      photographerUsername: "bob",
      photographerProfileUrl: "https://example.com/bob",
      unsplashPageUrl: "https://example.com/photo/2",
    },
  },
  {
    id: "bg-3",
    provider: "unsplash",
    category: "technology",
    title: "Server Rack",
    dominantColor: "#1e293b",
    width: 1200,
    height: 630,
    blurHash: null,
    urls: {
      og: "https://example.com/3-og.jpg",
      small: "https://example.com/3-small.jpg",
      thumb: "https://example.com/3-thumb.jpg",
      raw: "https://example.com/3-raw.jpg",
    },
    attribution: {
      photographerName: "Carol",
      photographerUsername: "carol",
      photographerProfileUrl: "https://example.com/carol",
      unsplashPageUrl: "https://example.com/photo/3",
    },
  },
];

const sampleTemplates: TemplateCatalogItem[] = [
  {
    id: "gradient",
    name: "Gradient",
    description: "General purpose gradient",
    category: "general",
    defaultProps: {
      backgroundColor: "#000000",
      textColor: "#ffffff",
      accentColor: "#3b82f6",
      backgroundMode: "color",
      backgroundId: null,
      overlayOpacity: 0.55,
    },
  },
  {
    id: "photo-hero",
    name: "Photo Hero",
    description: "Large image hero layout",
    category: "social",
    defaultProps: {
      backgroundColor: null,
      textColor: "#ffffff",
      accentColor: "#3b82f6",
      backgroundMode: "photo",
      backgroundId: "bg-1",
      overlayOpacity: 0.55,
    },
  },
  {
    id: "photo-glass",
    name: "Photo Glass",
    description: "Glass card on top of image",
    category: "social",
    defaultProps: {
      backgroundColor: null,
      textColor: "#ffffff",
      accentColor: "#a78bfa",
      backgroundMode: "photo",
      backgroundId: "bg-3",
      overlayOpacity: 0.55,
    },
  },
];

describe("catalog filters", () => {
  it("filters backgrounds by category and search", () => {
    const result = filterBackgroundItems(sampleBackgrounds, {
      category: "technology",
      search: "server",
      limit: 10,
      offset: 0,
    });

    expect(result.total).toBe(3);
    expect(result.filtered).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe("bg-3");
    expect(result.hasMore).toBe(false);
  });

  it("applies pagination for backgrounds", () => {
    const result = filterBackgroundItems(sampleBackgrounds, {
      limit: 1,
      offset: 1,
    });

    expect(result.filtered).toBe(3);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.id).toBe("bg-2");
    expect(result.hasMore).toBe(true);
  });

  it("filters templates by category and search", () => {
    const filteredByCategory = filterTemplateItems(sampleTemplates, {
      category: "social",
    });
    expect(filteredByCategory).toHaveLength(2);

    const filteredBySearch = filterTemplateItems(sampleTemplates, {
      search: "glass",
    });
    expect(filteredBySearch).toHaveLength(1);
    expect(filteredBySearch[0]?.id).toBe("photo-glass");
  });
});
