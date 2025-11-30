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

        {/* SEO Content Section */}
        <section className="mt-24 pt-16 border-t border-neutral-800">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Audit Your Site's OG Tags?
          </h2>
          <div className="prose prose-invert prose-neutral max-w-none">
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              Most websites have hundreds of pages, and each one needs proper Open Graph
              tags if you want them to look good when shared on social media. The problem?
              It's tedious to check them one by one. A single missing og:image tag, and
              your carefully designed page shows up with a blank preview.
            </p>
            <p className="text-neutral-400 leading-relaxed mb-6">
              This audit tool crawls your sitemap or homepage links and checks every page
              for essential OG tags. In minutes, you'll have a complete picture of which
              pages are ready for social sharing and which need attention.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              How the Audit Works
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <div className="text-2xl mb-3">1️⃣</div>
                <h3 className="font-semibold text-white mb-2">Discover Pages</h3>
                <p className="text-neutral-400 text-sm">
                  We look for your sitemap.xml first. If not found, we crawl links from
                  your homepage. Up to 50 pages per audit.
                </p>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <div className="text-2xl mb-3">2️⃣</div>
                <h3 className="font-semibold text-white mb-2">Check Each Page</h3>
                <p className="text-neutral-400 text-sm">
                  For each URL, we fetch the HTML and extract all meta tags. We check
                  for og:title, og:description, og:image, and Twitter cards.
                </p>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <div className="text-2xl mb-3">3️⃣</div>
                <h3 className="font-semibold text-white mb-2">Generate Report</h3>
                <p className="text-neutral-400 text-sm">
                  See results in real-time as pages are checked. Export to CSV for
                  tracking fixes or sharing with your team.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              What We Check For
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                <h3 className="font-semibold text-green-400 mb-2">✓ Passing (OK)</h3>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• Has og:title or title tag</li>
                  <li>• Has og:description or meta description</li>
                  <li>• Has og:image with valid URL</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <h3 className="font-semibold text-yellow-400 mb-2">⚠ Warning</h3>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• Missing og:description (has fallback)</li>
                  <li>• Image dimensions not specified</li>
                  <li>• Missing Twitter-specific tags</li>
                </ul>
              </div>

              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <h3 className="font-semibold text-red-400 mb-2">✗ Failing (Error)</h3>
                <ul className="text-sm text-neutral-400 space-y-1">
                  <li>• Missing og:title and title tag</li>
                  <li>• Missing og:image entirely</li>
                  <li>• Page returned error status</li>
                </ul>
              </div>

              <div className="p-4 bg-neutral-800 rounded-lg border border-neutral-700">
                <h3 className="font-semibold text-neutral-400 mb-2">ℹ Info</h3>
                <ul className="text-sm text-neutral-500 space-y-1">
                  <li>• Pages per audit: up to 50</li>
                  <li>• Concurrent checks: 3 at a time</li>
                  <li>• Timeout per page: 10 seconds</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Tips for Large Sites
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-white">Have a sitemap.xml</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    A proper sitemap ensures we find your important pages. Without one,
                    we only check links from your homepage.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-white">Fix Templates First</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    If all your blog posts are failing, the issue is likely in your blog
                    post template. Fix it once, fix all pages.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-white">Use Dynamic OG Images</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    For sites with thousands of pages, generate OG images automatically
                    using Satori. Check our <a href="/docs/dynamic-og" className="text-blue-400 hover:underline">dynamic OG guide</a>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-white">Export and Track</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    Use the CSV export to create a spreadsheet. Track fixes over time
                    and assign specific pages to team members.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-2">
              Found pages without OG images?
            </h3>
            <p className="text-neutral-400 mb-4">
              Create professional OG images for your missing pages with our free generator.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Create OG Images
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
