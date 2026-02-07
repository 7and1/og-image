"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { Download, Search, ExternalLink, AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { analyzeMetaTags, generateCSVData, type SiteAnalysis, type URLResult } from "@/lib/meta-analyzer";

export default function AuditContent() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const [results, setResults] = useState<SiteAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    let validatedUrl = url.trim();
    if (!validatedUrl.startsWith("http://") && !validatedUrl.startsWith("https://")) {
      validatedUrl = `https://${validatedUrl}`;
    }

    try {
      new URL(validatedUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setResults(null);

    try {
      const analysis = await analyzeMetaTags(validatedUrl, {
        onProgress: (progressValue, current) => {
          setProgress(progressValue);
          if (current) setCurrentUrl(current);
        },
      });

      setResults(analysis);
      toast.success(`Analysis complete! Found ${analysis.totalPages} pages.`);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
      setCurrentUrl("");
    }
  };

  const handleExportCSV = () => {
    if (!results) return;

    const csv = generateCSVData(results);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const urlObject = URL.createObjectURL(blob);

    link.setAttribute("href", urlObject);
    link.setAttribute(
      "download",
      `og-audit-${new URL(results.domain).hostname}-${Date.now()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(urlObject);
    toast.success("CSV exported successfully!");
  };

  const getStatusIcon = (result: URLResult) => {
    if (result.issues.length === 0) {
      return <CheckCircle2 className="h-5 w-5 text-green-400" />;
    }

    const hasError = result.issues.some((issue) => issue.type === "error");
    if (hasError) {
      return <AlertCircle className="h-5 w-5 text-red-400" />;
    }

    return <Info className="h-5 w-5 text-yellow-400" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            OG Meta Tags Audit
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Analyze your site for Open Graph and Twitter Card metadata at scale.
          </p>
        </div>

        <Card className="mb-8 p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="url-input" className="mb-2 block text-sm font-medium text-neutral-300">
                Website URL
              </label>
              <div className="flex gap-3">
                <Input
                  id="url-input"
                  type="url"
                  placeholder="example.com or https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isAnalyzing) {
                      handleAnalyze();
                    }
                  }}
                  disabled={isAnalyzing}
                  className="flex-1"
                />
                <Button onClick={handleAnalyze} disabled={isAnalyzing || !url.trim()}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-neutral-400">
                  <span>Analyzing pages...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {currentUrl && (
                  <p className="truncate text-xs text-neutral-500">Current: {currentUrl}</p>
                )}
              </div>
            )}
          </div>
        </Card>

        {results && (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4">
                <p className="text-sm text-neutral-400">Total Pages</p>
                <p className="mt-1 text-3xl font-bold text-white">{results.totalPages}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-neutral-400">Average Score</p>
                <p className={`mt-1 text-3xl font-bold ${getScoreColor(results.averageScore)}`}>
                  {results.averageScore}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-neutral-400">Needs Attention</p>
                <p className="mt-1 text-3xl font-bold text-red-400">
                  {results.results.filter((r) => r.issues.length > 0).length}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-neutral-400">Perfect Pages</p>
                <p className="mt-1 text-3xl font-bold text-green-400">
                  {results.results.filter((r) => r.score === 100).length}
                </p>
              </Card>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Audit Results</h2>
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>

            <div className="space-y-4">
              {results.results.map((result, index) => (
                <Card key={index} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {getStatusIcon(result)}
                        <h3 className="truncate font-medium text-white">{result.url}</h3>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-white"
                          aria-label={`Open ${result.url} in new tab`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      {result.meta["og:title"] && (
                        <p className="mb-1 text-sm text-neutral-400">
                          OG Title: <span className="text-neutral-300">{result.meta["og:title"]}</span>
                        </p>
                      )}

                      {result.meta["og:image"] && (
                        <p className="mb-1 text-sm text-neutral-400">
                          OG Image: <span className="text-neutral-300">{result.meta["og:image"]}</span>
                        </p>
                      )}

                      {result.issues.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {result.issues.map((issue, issueIndex) => (
                            <p
                              key={issueIndex}
                              className={`text-sm ${
                                issue.type === "error"
                                  ? "text-red-400"
                                  : issue.type === "warning"
                                    ? "text-yellow-400"
                                    : "text-blue-400"
                              }`}
                            >
                              • {issue.message}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Score</p>
                      <p className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {!results && !isAnalyzing && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-white">How It Works</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="mb-3 text-2xl">1️⃣</div>
                <h3 className="mb-2 font-semibold text-white">Enter Domain</h3>
                <p className="text-sm text-neutral-400">
                  Start with your homepage URL. We discover pages using sitemap and internal links.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="mb-3 text-2xl">2️⃣</div>
                <h3 className="mb-2 font-semibold text-white">Crawl & Analyze</h3>
                <p className="text-sm text-neutral-400">
                  We inspect OG title, description, image, Twitter card tags, and image dimensions.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="mb-3 text-2xl">3️⃣</div>
                <h3 className="mb-2 font-semibold text-white">Get Actionable Issues</h3>
                <p className="text-sm text-neutral-400">
                  Every page receives a score and clear issue list, so you can prioritize fixes quickly.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="mb-3 text-2xl">4️⃣</div>
                <h3 className="mb-2 font-semibold text-white">Export and Track</h3>
                <p className="text-sm text-neutral-400">
                  Export CSV reports, assign ownership, and track quality improvements over time.
                </p>
              </div>
            </div>

            <div className="mt-12 rounded-xl border border-neutral-800 bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Found pages without OG images?</h3>
              <p className="mb-4 text-neutral-400">
                Create production-ready Open Graph images for your missing pages with our free generator.
              </p>
              <Link
                href="/"
                className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
              >
                Create OG Images
              </Link>
            </div>
          </section>
        )}

        {!isAnalyzing && (
          <div className="mt-12 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Tips for Better OG Metadata</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>• Keep titles under 60 characters for platform-safe display.</li>
              <li>• Use 1200×630 images to avoid unexpected crops.</li>
              <li>• Include <code className="rounded bg-neutral-800 px-1 py-0.5 text-xs">twitter:card=summary_large_image</code>.</li>
              <li>• Use absolute image URLs and ensure they are publicly accessible.</li>
              <li>• Revalidate with each deployment before shipping campaigns.</li>
            </ul>
          </div>
        )}

        {!isAnalyzing && results && (
          <div className="mt-12 rounded-xl border border-neutral-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">Need to create an OG image?</h3>
            <p className="mb-4 text-neutral-400">
              Use our free generator to create professional OG images in seconds.
            </p>
            <Button onClick={() => router.push("/")}>Open Generator</Button>
          </div>
        )}
      </div>
    </div>
  );
}
