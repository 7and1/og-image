import { asyncPool } from "@/lib/async-pool";
import { validateMetaTags, type ValidationResult } from "@/lib/meta-validator";

interface SitemapApiResponse {
  success: boolean;
  urls: string[];
  count: number;
  error?: string;
}

export type URLResult = ValidationResult;

export interface SiteAnalysis {
  domain: string;
  totalPages: number;
  averageScore: number;
  results: URLResult[];
  analyzedAt: string;
}

interface AnalyzeOptions {
  maxUrls?: number;
  concurrency?: number;
  onProgress?: (progress: number, currentUrl?: string) => void;
}

function sanitizeUrlList(input: string[], fallbackOrigin: string): string[] {
  const unique = new Set<string>();

  for (const raw of input) {
    const trimmed = raw.trim();
    if (!trimmed) {
      continue;
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        continue;
      }
      unique.add(parsed.toString());
    } catch {
      continue;
    }
  }

  if (unique.size === 0) {
    unique.add(fallbackOrigin);
  }

  return [...unique];
}

async function fetchSitemapUrls(targetUrl: string): Promise<string[]> {
  const response = await fetch(`/api/sitemap?url=${encodeURIComponent(targetUrl)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  const json = (await response.json()) as SitemapApiResponse;
  if (!json.success || !Array.isArray(json.urls)) {
    return [];
  }

  return json.urls;
}

function fallbackResult(url: string, message: string): URLResult {
  return {
    url,
    meta: {},
    score: 0,
    issues: [{ type: "error", message }],
  };
}

function calculateAverageScore(results: URLResult[]): number {
  if (results.length === 0) {
    return 0;
  }

  const total = results.reduce((sum, result) => sum + result.score, 0);
  return Math.round(total / results.length);
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

export async function analyzeMetaTags(
  targetUrl: string,
  options: AnalyzeOptions = {}
): Promise<SiteAnalysis> {
  const parsedTarget = new URL(targetUrl);
  const rootUrl = parsedTarget.origin;

  const maxUrls = Math.max(1, Math.min(200, options.maxUrls ?? 50));
  const concurrency = Math.max(1, Math.min(10, options.concurrency ?? 5));

  const sitemapUrls = await fetchSitemapUrls(targetUrl);
  const candidateUrls = sanitizeUrlList(sitemapUrls, rootUrl).slice(0, maxUrls);

  options.onProgress?.(0, candidateUrls[0]);

  const results = await asyncPool<string, URLResult>(
    concurrency,
    candidateUrls,
    async (url) => {
      options.onProgress?.(0, url);
      try {
        return await validateMetaTags(url);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Validation failed";
        return fallbackResult(url, message);
      }
    },
    (completed, total) => {
      const progress = Math.round((completed / total) * 100);
      options.onProgress?.(progress);
    }
  );

  return {
    domain: rootUrl,
    totalPages: results.length,
    averageScore: calculateAverageScore(results),
    results,
    analyzedAt: new Date().toISOString(),
  };
}

export function generateCSVData(analysis: SiteAnalysis): string {
  const header = [
    "url",
    "score",
    "issueCount",
    "issues",
    "ogTitle",
    "ogDescription",
    "ogImage",
    "twitterCard",
  ];

  const rows = analysis.results.map((result) => {
    const issues = result.issues.map((issue) => `${issue.type}:${issue.message}`).join(" | ");

    return [
      result.url,
      String(result.score),
      String(result.issues.length),
      issues,
      result.meta["og:title"] ?? "",
      result.meta["og:description"] ?? "",
      result.meta["og:image"] ?? "",
      result.meta["twitter:card"] ?? "",
    ].map((value) => escapeCsv(value));
  });

  return [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
