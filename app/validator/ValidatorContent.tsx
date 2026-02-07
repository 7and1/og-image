"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/components/ui";
import { CheckCircle2, AlertCircle, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";
import { validateMetaTags, type ValidationResult } from "@/lib/meta-validator";

export default function ValidatorContent() {
  const [url, setUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = async () => {
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

    setIsValidating(true);
    setResult(null);

    try {
      const validationResult = await validateMetaTags(validatedUrl);
      setResult(validationResult);
      toast.success("Validation complete!");
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error(error instanceof Error ? error.message : "Validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusIcon = () => {
    if (!result) return null;
    if (result.score >= 90) {
      return <CheckCircle2 className="h-6 w-6 text-green-400" />;
    }
    return <AlertCircle className="h-6 w-6 text-yellow-400" />;
  };

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            OG Meta Tags Validator
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Validate a single page for Open Graph and Twitter Card metadata.
          </p>
        </div>

        <Card className="mb-8 p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="url-input" className="mb-2 block text-sm font-medium text-neutral-300">
                Page URL
              </label>
              <div className="flex gap-3">
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/blog/post"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isValidating) {
                      handleValidate();
                    }
                  }}
                  disabled={isValidating}
                  className="flex-1"
                />
                <Button onClick={handleValidate} disabled={isValidating || !url.trim()}>
                  {isValidating ? (
                    "Validating..."
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Validate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {result && (
          <>
            <Card className="mb-8 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon()}
                  <div>
                    <h2 className="text-xl font-semibold text-white">Validation Results</h2>
                    <p className="text-sm text-neutral-400">{result.url}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500">Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-sm text-neutral-400">OG Title</p>
                  <p className="mt-1 text-sm text-neutral-200">{result.meta["og:title"] || "Missing"}</p>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-sm text-neutral-400">OG Description</p>
                  <p className="mt-1 text-sm text-neutral-200">{result.meta["og:description"] || "Missing"}</p>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-sm text-neutral-400">OG Image</p>
                  <p className="mt-1 truncate text-sm text-neutral-200">{result.meta["og:image"] || "Missing"}</p>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-sm text-neutral-400">Twitter Card</p>
                  <p className="mt-1 text-sm text-neutral-200">{result.meta["twitter:card"] || "Missing"}</p>
                </div>
              </div>

              {result.issues.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-medium text-white">Issues</h3>
                  {result.issues.map((issue, index) => (
                    <p
                      key={index}
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

              <div className="mt-6">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                >
                  Open page <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
            </Card>

            <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
              <h3 className="mb-2 text-lg font-semibold text-white">Need to create an OG image?</h3>
              <p className="mb-4 text-neutral-400">
                Use our free generator to create professional OG images in seconds.
              </p>
              <Link
                href="/"
                className="inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Open Generator
              </Link>
            </div>
          </>
        )}

        {!result && !isValidating && (
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-white">Common Validation Checks</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <h3 className="mb-2 font-semibold text-white">Required OG Tags</h3>
                <ul className="space-y-1 text-sm text-neutral-400">
                  <li>• <code>og:title</code></li>
                  <li>• <code>og:description</code></li>
                  <li>• <code>og:image</code></li>
                  <li>• <code>og:type</code></li>
                  <li>• <code>og:url</code></li>
                </ul>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
                <h3 className="mb-2 font-semibold text-white">Recommended Twitter Tags</h3>
                <ul className="space-y-1 text-sm text-neutral-400">
                  <li>• <code>twitter:card</code> = <code>summary_large_image</code></li>
                  <li>• <code>twitter:title</code></li>
                  <li>• <code>twitter:description</code></li>
                  <li>• <code>twitter:image</code></li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
