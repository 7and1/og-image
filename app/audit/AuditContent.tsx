"use client";

import { useState, FormEvent, useCallback } from "react";
import {
  Globe,
  Search,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Loader2,
} from "lucide-react";
import { asyncPool } from "@/lib/async-pool";
import { Button, Input, Card } from "@/components/ui";

interface AuditResult {
  url: string;
  status: "ok" | "warning" | "error" | "pending";
  hasTitle: boolean;
  hasDescription: boolean;
  hasImage: boolean;
  title?: string;
  error?: string;
}

function StatusIcon({ status }: { status: AuditResult["status"] }) {
  switch (status) {
    case "ok":
      return <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-500" aria-hidden="true" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />;
    case "pending":
      return <Loader2 className="h-4 w-4 text-neutral-500 animate-spin" aria-hidden="true" />;
  }
}

function CheckMark({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
  );
}

export default function AuditContent() {
  const [domain, setDomain] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<AuditResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const startAudit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setIsAuditing(true);
    setResults([]);
    setError(null);
    setProgress({ current: 0, total: 0 });

    // Normalize domain
    let normalizedDomain = domain.trim();
    if (!normalizedDomain.startsWith("http")) {
      normalizedDomain = `https://${normalizedDomain}`;
    }

    try {
      // First, try to fetch sitemap
      const sitemapRes = await fetch(
        `/api/sitemap?url=${encodeURIComponent(normalizedDomain)}`
      );
      const sitemapData = await sitemapRes.json();

      let urls: string[] = [];

      if (sitemapData.success && sitemapData.urls.length > 0) {
        urls = sitemapData.urls;
      } else {
        // Fallback: try to get links from the homepage
        const parseRes = await fetch(
          `/api/parse?url=${encodeURIComponent(normalizedDomain)}&links=true`
        );
        const parseData = await parseRes.json();

        if (parseData.success && parseData.links) {
          urls = [normalizedDomain, ...parseData.links.slice(0, 19)];
        } else {
          urls = [normalizedDomain];
        }
      }

      // Limit to 50 URLs
      urls = [...new Set(urls)].slice(0, 50);
      setProgress({ current: 0, total: urls.length });

      // Initialize results as pending
      const initialResults: AuditResult[] = urls.map((url) => ({
        url,
        status: "pending",
        hasTitle: false,
        hasDescription: false,
        hasImage: false,
      }));
      setResults(initialResults);

      // Audit each URL with concurrent pool
      await asyncPool<string, AuditResult>(
        3, // Max 3 concurrent requests
        urls,
        async (url, index) => {
          const res = await fetch(
            `/api/parse?url=${encodeURIComponent(url)}`
          );
          const data = await res.json();

          const result: AuditResult = {
            url,
            status: "ok",
            hasTitle: false,
            hasDescription: false,
            hasImage: false,
          };

          if (!data.success) {
            result.status = "error";
            result.error = data.error || "Fetch failed";
          } else {
            result.hasTitle = !!(
              data.meta["og:title"] || data.meta["title"]
            );
            result.hasDescription = !!(
              data.meta["og:description"] || data.meta["description"]
            );
            result.hasImage = !!data.meta["og:image"];
            result.title =
              data.meta["og:title"] || data.meta["title"] || undefined;

            // Determine status
            if (!result.hasTitle || !result.hasImage) {
              result.status = "error";
            } else if (!result.hasDescription) {
              result.status = "warning";
            }
          }

          // Update this specific result
          setResults((prev) => {
            const updated = [...prev];
            updated[index] = result;
            return updated;
          });

          return result;
        },
        (completed, total) => {
          setProgress({ current: completed, total });
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed");
    } finally {
      setIsAuditing(false);
    }
  }, [domain]);

  const exportCsv = useCallback(() => {
    if (results.length === 0) return;

    const headers = ["URL", "Status", "Title", "Description", "Image", "Page Title"];
    const rows = results.map((r) => [
      r.url,
      r.status,
      r.hasTitle ? "Yes" : "No",
      r.hasDescription ? "Yes" : "No",
      r.hasImage ? "Yes" : "No",
      r.title || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `og-audit-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [results]);

  const summary = results.reduce(
    (acc, r) => {
      if (r.status === "ok") acc.ok++;
      else if (r.status === "warning") acc.warning++;
      else if (r.status === "error") acc.error++;
      return acc;
    },
    { ok: 0, warning: 0, error: 0 }
  );

  const progressPercent =
    progress.total > 0
      ? Math.round((progress.current / progress.total) * 100)
      : 0;

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Site Audit
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Check Open Graph tags across your entire website. Enter a domain or
            sitemap URL to get started.
          </p>
        </div>

        {/* Domain Input */}
        <Card className="p-6">
          <form onSubmit={startAudit} className="flex gap-4">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
              <Input
                type="text"
                placeholder="Enter domain (e.g., example.com) or sitemap URL"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="pl-10"
                disabled={isAuditing}
                aria-label="Domain or sitemap URL to audit"
              />
            </div>
            <Button type="submit" disabled={isAuditing || !domain.trim()}>
              {isAuditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Auditing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                  Start Audit
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mt-6 border-red-500/50 bg-red-500/10 p-4" role="alert">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
              <span className="text-red-400">{error}</span>
            </div>
          </Card>
        )}

        {/* Progress */}
        {(isAuditing || results.length > 0) && (
          <Card className="mt-6 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-400">
                {isAuditing ? "Auditing pages..." : "Audit complete"}
              </span>
              <span className="text-sm font-medium text-white">
                {progress.current}/{progress.total} pages ({progressPercent}%)
              </span>
            </div>
            <div
              className="h-2 rounded-full bg-neutral-800 overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </Card>
        )}

        {/* Results */}
        {results.length > 0 && (
          <>
            {/* Summary */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {summary.ok}
                </div>
                <div className="text-sm text-neutral-400">Passing</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {summary.warning}
                </div>
                <div className="text-sm text-neutral-400">Warnings</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">
                  {summary.error}
                </div>
                <div className="text-sm text-neutral-400">Failing</div>
              </Card>
            </div>

            {/* Results Table */}
            <Card className="mt-6 overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-800 p-4">
                <h2 className="font-semibold text-white">Results</h2>
                <Button variant="outline" size="sm" onClick={exportCsv} aria-label="Export results to CSV">
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Export CSV
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        URL
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase w-20">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase w-16">
                        Title
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase w-16">
                        Desc
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase w-16">
                        Image
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {results.map((result) => (
                      <tr
                        key={result.url}
                        className="hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:underline truncate block max-w-md"
                          >
                            {result.url.replace(/^https?:\/\//, "")}
                          </a>
                          {result.title && (
                            <span className="text-xs text-neutral-500 truncate block max-w-md mt-0.5">
                              {result.title}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <StatusIcon status={result.status} />
                            <span
                              className={`text-xs font-medium ${
                                result.status === "ok"
                                  ? "text-green-500"
                                  : result.status === "warning"
                                  ? "text-yellow-500"
                                  : result.status === "error"
                                  ? "text-red-500"
                                  : "text-neutral-500"
                              }`}
                            >
                              {result.status.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <CheckMark value={result.hasTitle} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <CheckMark value={result.hasDescription} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <CheckMark value={result.hasImage} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!isAuditing && results.length === 0 && !error && (
          <div className="mt-16 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-neutral-800 flex items-center justify-center">
              <Globe className="h-10 w-10 text-neutral-600" aria-hidden="true" />
            </div>
            <p className="mt-6 text-neutral-400">
              Enter a domain above to audit its Open Graph tags
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              We'll check your sitemap or crawl your homepage for links
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
