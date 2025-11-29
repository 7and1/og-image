import { useState, useCallback } from "react";
import type { OGMeta } from "@/types";

export interface ValidationIssue {
  type: "error" | "warning" | "success";
  tag: string;
  message: string;
}

export interface ValidationResult {
  url: string;
  meta: OGMeta;
  score: number;
  issues: ValidationIssue[];
}

export function useValidator() {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      const res = await fetch(
        `/api/parse?url=${encodeURIComponent(normalizedUrl)}`
      );
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Validation failed");
      }

      // Calculate score and issues
      const issues: ValidationIssue[] = [];
      let score = 100;

      // Required: og:title
      if (data.meta["og:title"]) {
        issues.push({
          type: "success",
          tag: "og:title",
          message: `"${data.meta["og:title"]}"`,
        });
      } else if (data.meta["title"]) {
        issues.push({
          type: "warning",
          tag: "og:title",
          message: `Missing, using <title>: "${data.meta["title"]}"`,
        });
        score -= 10;
      } else {
        issues.push({
          type: "error",
          tag: "og:title",
          message: "Missing - required for social previews",
        });
        score -= 25;
      }

      // Required: og:image
      if (data.meta["og:image"]) {
        issues.push({
          type: "success",
          tag: "og:image",
          message: "Present",
        });
      } else {
        issues.push({
          type: "error",
          tag: "og:image",
          message: "Missing - social cards won't show an image",
        });
        score -= 25;
      }

      // Recommended: og:description
      if (data.meta["og:description"]) {
        issues.push({
          type: "success",
          tag: "og:description",
          message: `"${data.meta["og:description"].substring(0, 60)}..."`,
        });
      } else if (data.meta["description"]) {
        issues.push({
          type: "warning",
          tag: "og:description",
          message: "Missing, using meta description",
        });
        score -= 5;
      } else {
        issues.push({
          type: "warning",
          tag: "og:description",
          message: "Missing - recommended for better previews",
        });
        score -= 10;
      }

      // Recommended: og:url
      if (data.meta["og:url"]) {
        issues.push({
          type: "success",
          tag: "og:url",
          message: data.meta["og:url"],
        });
      } else {
        issues.push({
          type: "warning",
          tag: "og:url",
          message: "Missing - helps with canonical URLs",
        });
        score -= 5;
      }

      // Recommended: og:type
      if (data.meta["og:type"]) {
        issues.push({
          type: "success",
          tag: "og:type",
          message: data.meta["og:type"],
        });
      } else {
        issues.push({
          type: "warning",
          tag: "og:type",
          message: 'Missing - defaults to "website"',
        });
        score -= 5;
      }

      // Twitter card
      if (data.meta["twitter:card"]) {
        issues.push({
          type: "success",
          tag: "twitter:card",
          message: data.meta["twitter:card"],
        });
      } else {
        issues.push({
          type: "warning",
          tag: "twitter:card",
          message: "Missing - Twitter will use OG tags as fallback",
        });
        score -= 5;
      }

      // Optional: og:site_name
      if (data.meta["og:site_name"]) {
        issues.push({
          type: "success",
          tag: "og:site_name",
          message: data.meta["og:site_name"],
        });
      }

      setResult({
        url: normalizedUrl,
        meta: data.meta,
        score: Math.max(0, score),
        issues,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, validate };
}
