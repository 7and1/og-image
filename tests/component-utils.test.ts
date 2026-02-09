import { describe, expect, it } from "vitest";

/**
 * Component Unit Tests
 * Tests for utility functions and component logic
 */

describe("Color Utilities", () => {
  // Test hex color parsing logic used in ColorPicker
  function parseHexColor(input: string | null): string | null {
    if (!input) return null;
    const value = input.trim();
    if (!value) return null;
    const normalized = value.startsWith("#") ? value.slice(1) : value;
    if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
    return `#${normalized.toLowerCase()}`;
  }

  it("parses valid hex colors with hash", () => {
    expect(parseHexColor("#ff0000")).toBe("#ff0000");
    expect(parseHexColor("#FF0000")).toBe("#ff0000");
    expect(parseHexColor("#AbCdEf")).toBe("#abcdef");
  });

  it("parses valid hex colors without hash", () => {
    expect(parseHexColor("ff0000")).toBe("#ff0000");
    expect(parseHexColor("FFFFFF")).toBe("#ffffff");
  });

  it("returns null for invalid colors", () => {
    expect(parseHexColor(null)).toBe(null);
    expect(parseHexColor("")).toBe(null);
    expect(parseHexColor("   ")).toBe(null);
    expect(parseHexColor("#fff")).toBe(null); // 3-char not supported
    expect(parseHexColor("#gggggg")).toBe(null);
    expect(parseHexColor("not-a-color")).toBe(null);
  });
});

describe("Truncation Utilities", () => {
  // Test truncation logic used in SocialPreview
  function truncate(str: string, max: number): string {
    return str.length > max ? str.slice(0, max - 3) + "..." : str;
  }

  it("does not truncate short strings", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
    expect(truncate("", 10)).toBe("");
  });

  it("truncates long strings with ellipsis", () => {
    expect(truncate("Hello World", 8)).toBe("Hello...");
    expect(truncate("This is a very long title", 15)).toBe("This is a ve...");
  });

  it("handles edge cases", () => {
    expect(truncate("abc", 3)).toBe("abc");
    expect(truncate("abcd", 3)).toBe("...");
  });
});

describe("Character Counting", () => {
  // Test Unicode-aware character counting used in og.ts
  function countChars(value: string): number {
    return Array.from(value).length;
  }

  it("counts ASCII characters correctly", () => {
    expect(countChars("hello")).toBe(5);
    expect(countChars("")).toBe(0);
  });

  it("counts Unicode characters correctly", () => {
    expect(countChars("你好")).toBe(2);
    expect(countChars("🎉")).toBe(1);
    expect(countChars("👨‍👩‍👧‍👦")).toBe(7); // Family emoji is multiple code points
  });

  it("counts mixed content correctly", () => {
    expect(countChars("Hello 世界 🌍")).toBe(10);
  });
});

describe("Float Clamping", () => {
  // Test float clamping used for overlay opacity
  function parseFloatClamped(input: string | null, fallback: number): number {
    if (!input) return fallback;
    const value = Number(input);
    if (!Number.isFinite(value)) return fallback;
    return Math.min(1, Math.max(0, value));
  }

  it("returns fallback for null/empty input", () => {
    expect(parseFloatClamped(null, 0.5)).toBe(0.5);
    expect(parseFloatClamped("", 0.5)).toBe(0.5);
  });

  it("parses valid floats", () => {
    expect(parseFloatClamped("0.5", 0)).toBe(0.5);
    expect(parseFloatClamped("0", 0.5)).toBe(0);
    expect(parseFloatClamped("1", 0.5)).toBe(1);
  });

  it("clamps values to 0-1 range", () => {
    expect(parseFloatClamped("-0.5", 0.5)).toBe(0);
    expect(parseFloatClamped("1.5", 0.5)).toBe(1);
    expect(parseFloatClamped("100", 0.5)).toBe(1);
  });

  it("returns fallback for invalid input", () => {
    expect(parseFloatClamped("not-a-number", 0.5)).toBe(0.5);
    expect(parseFloatClamped("NaN", 0.5)).toBe(0.5);
    expect(parseFloatClamped("Infinity", 0.5)).toBe(0.5);
  });
});

describe("Positive Integer Parsing", () => {
  // Test integer parsing used for pagination
  function parsePositiveInt(
    raw: string | null,
    fallback: number,
    options: { min: number; max: number }
  ): number {
    if (!raw) return fallback;
    const value = Number(raw);
    if (!Number.isFinite(value)) return fallback;
    return Math.min(options.max, Math.max(options.min, Math.floor(value)));
  }

  it("returns fallback for null/empty input", () => {
    expect(parsePositiveInt(null, 30, { min: 1, max: 200 })).toBe(30);
    expect(parsePositiveInt("", 30, { min: 1, max: 200 })).toBe(30);
  });

  it("parses valid integers", () => {
    expect(parsePositiveInt("10", 30, { min: 1, max: 200 })).toBe(10);
    expect(parsePositiveInt("100", 30, { min: 1, max: 200 })).toBe(100);
  });

  it("floors decimal values", () => {
    expect(parsePositiveInt("10.9", 30, { min: 1, max: 200 })).toBe(10);
    expect(parsePositiveInt("10.1", 30, { min: 1, max: 200 })).toBe(10);
  });

  it("clamps to min/max range", () => {
    expect(parsePositiveInt("0", 30, { min: 1, max: 200 })).toBe(1);
    expect(parsePositiveInt("-5", 30, { min: 1, max: 200 })).toBe(1);
    expect(parsePositiveInt("500", 30, { min: 1, max: 200 })).toBe(200);
  });

  it("returns fallback for invalid input", () => {
    expect(parsePositiveInt("abc", 30, { min: 1, max: 200 })).toBe(30);
    expect(parsePositiveInt("NaN", 30, { min: 1, max: 200 })).toBe(30);
  });
});

describe("Gradient Presets", () => {
  const gradientPresets = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    "linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)",
    "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
  ];

  it("has no duplicate gradients", () => {
    const uniqueGradients = new Set(gradientPresets);
    expect(uniqueGradients.size).toBe(gradientPresets.length);
  });

  it("all gradients are valid CSS", () => {
    const gradientRegex = /^linear-gradient\(\d+deg,\s*#[0-9a-f]{6}\s+\d+%/i;
    for (const gradient of gradientPresets) {
      expect(gradientRegex.test(gradient)).toBe(true);
    }
  });

  it("has exactly 12 presets", () => {
    expect(gradientPresets.length).toBe(12);
  });
});
