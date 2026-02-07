import type { OGMeta, ValidationResult } from "@/types";

interface ParseApiResponse {
  success: boolean;
  url: string;
  meta: OGMeta;
  error?: string;
}

function normalizeMeta(meta: OGMeta): OGMeta {
  const normalized: OGMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    if (typeof value === "string") {
      normalized[key] = value.trim();
    }
  }
  return normalized;
}

function pushIssue(
  issues: ValidationResult["issues"],
  type: "error" | "warning" | "info",
  message: string
): void {
  issues.push({ type, message });
}

function hasValue(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function safeScoreFromIssueCount(base: number): number {
  return Math.max(0, Math.min(100, Math.round(base)));
}

function evaluateMeta(url: string, meta: OGMeta): ValidationResult {
  const issues: ValidationResult["issues"] = [];
  let score = 100;

  const ogTitle = meta["og:title"] ?? meta.title;
  const ogDescription = meta["og:description"] ?? meta.description;
  const ogImage = meta["og:image"];
  const ogType = meta["og:type"];
  const ogUrl = meta["og:url"];

  const twitterCard = meta["twitter:card"];
  const twitterTitle = meta["twitter:title"];
  const twitterDescription = meta["twitter:description"];
  const twitterImage = meta["twitter:image"];

  if (!hasValue(ogTitle)) {
    pushIssue(issues, "error", "Missing og:title");
    score -= 20;
  } else if ((ogTitle ?? "").length > 70) {
    pushIssue(issues, "warning", "og:title is longer than 70 characters");
    score -= 5;
  }

  if (!hasValue(ogDescription)) {
    pushIssue(issues, "error", "Missing og:description");
    score -= 15;
  } else {
    const length = (ogDescription ?? "").length;
    if (length > 200) {
      pushIssue(issues, "warning", "og:description is longer than 200 characters");
      score -= 4;
    } else if (length < 40) {
      pushIssue(issues, "info", "og:description is short; consider adding more context");
      score -= 2;
    }
  }

  if (!hasValue(ogImage)) {
    pushIssue(issues, "error", "Missing og:image");
    score -= 25;
  }

  if (!hasValue(ogType)) {
    pushIssue(issues, "warning", "Missing og:type");
    score -= 6;
  }

  if (!hasValue(ogUrl)) {
    pushIssue(issues, "warning", "Missing og:url");
    score -= 4;
  }

  if (!hasValue(twitterCard)) {
    pushIssue(issues, "warning", "Missing twitter:card");
    score -= 8;
  } else if (twitterCard !== "summary_large_image") {
    pushIssue(issues, "info", "twitter:card is not summary_large_image");
    score -= 2;
  }

  if (!hasValue(twitterTitle)) {
    pushIssue(issues, "info", "Missing twitter:title");
    score -= 3;
  }

  if (!hasValue(twitterDescription)) {
    pushIssue(issues, "info", "Missing twitter:description");
    score -= 3;
  }

  if (!hasValue(twitterImage)) {
    pushIssue(issues, "info", "Missing twitter:image");
    score -= 4;
  }

  if (!hasValue(twitterImage) && hasValue(ogImage)) {
    pushIssue(issues, "info", "Twitter image can reuse og:image if twitter:image is omitted");
  }

  if (issues.length === 0) {
    pushIssue(issues, "info", "All core OG tags are present.");
  }

  return {
    url,
    meta,
    score: safeScoreFromIssueCount(score),
    issues,
  };
}

async function fetchParsedMeta(targetUrl: string): Promise<ParseApiResponse> {
  const response = await fetch(`/api/parse?url=${encodeURIComponent(targetUrl)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Parse API returned ${response.status}`);
  }

  const json = (await response.json()) as ParseApiResponse;
  if (!json.success || !json.meta) {
    throw new Error(json.error || "Failed to parse metadata");
  }

  return json;
}

export async function validateMetaTags(targetUrl: string): Promise<ValidationResult> {
  const parsed = await fetchParsedMeta(targetUrl);
  const meta = normalizeMeta(parsed.meta);
  return evaluateMeta(targetUrl, meta);
}

export type { ValidationResult };
