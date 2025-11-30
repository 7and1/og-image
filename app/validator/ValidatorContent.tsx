"use client";

import { useState, FormEvent } from "react";
import { Search, CheckCircle, AlertCircle, XCircle, ExternalLink } from "lucide-react";
import { useValidator, type ValidationIssue } from "@/hooks";
import { Button, Input, Card, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { SocialPreview } from "@/components/preview";

function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 80
      ? "text-green-500"
      : score >= 60
      ? "text-yellow-500"
      : "text-red-500";

  const bgColor =
    score >= 80
      ? "bg-green-500/10"
      : score >= 60
      ? "bg-yellow-500/10"
      : "bg-red-500/10";

  return (
    <div
      className={`flex h-24 w-24 items-center justify-center rounded-full ${bgColor}`}
    >
      <span className={`text-3xl font-bold ${color}`}>{score}</span>
    </div>
  );
}

function IssueIcon({ type }: { type: ValidationIssue["type"] }) {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />;
    case "warning":
      return <AlertCircle className="h-5 w-5 text-yellow-500" aria-hidden="true" />;
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" aria-hidden="true" />;
  }
}

export default function ValidatorContent() {
  const [url, setUrl] = useState("");
  const { result, isLoading, error, validate } = useValidator();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      validate(url);
    }
  };

  const title = result?.meta["og:title"] || result?.meta["title"] || "Page Title";
  const description =
    result?.meta["og:description"] ||
    result?.meta["description"] ||
    "Page description will appear here";
  const imageUrl = result?.meta["og:image"] || null;

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            OG Tag Validator
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Check how your website appears on social media. Enter any URL to
            analyze its Open Graph tags.
          </p>
        </div>

        {/* URL Input */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
              <Input
                type="text"
                placeholder="Enter URL to validate (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10"
                aria-label="URL to validate"
              />
            </div>
            <Button type="submit" disabled={isLoading || !url.trim()}>
              {isLoading ? "Validating..." : "Validate"}
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

        {/* Results */}
        {result && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Left: Meta Tags */}
            <div className="space-y-6">
              {/* Score */}
              <Card className="p-6">
                <div className="flex items-center gap-6">
                  <ScoreCircle score={result.score} />
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Validation Score
                    </h2>
                    <p className="mt-1 text-sm text-neutral-400">
                      {result.score >= 80
                        ? "Great! Your OG tags are well configured."
                        : result.score >= 60
                        ? "Good, but there's room for improvement."
                        : "Your page is missing important OG tags."}
                    </p>
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                    >
                      {result.url}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </Card>

              {/* Issues List */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Tag Analysis
                </h3>
                <div className="space-y-3" role="list">
                  {result.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg bg-neutral-800/50 p-3"
                      role="listitem"
                    >
                      <IssueIcon type={issue.type} />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-neutral-300">
                          {issue.tag}
                        </div>
                        <div className="mt-0.5 text-sm text-neutral-500 truncate">
                          {issue.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right: Previews */}
            <div>
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Social Previews
                </h3>
                <Tabs defaultValue="twitter">
                  <TabsList>
                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="facebook">Facebook</TabsTrigger>
                  </TabsList>

                  <TabsContent value="twitter">
                    <SocialPreview
                      platform="twitter"
                      title={title}
                      description={description}
                      imageUrl={imageUrl}
                      siteUrl={result.url}
                    />
                  </TabsContent>

                  <TabsContent value="linkedin">
                    <SocialPreview
                      platform="linkedin"
                      title={title}
                      description={description}
                      imageUrl={imageUrl}
                      siteUrl={result.url}
                    />
                  </TabsContent>

                  <TabsContent value="facebook">
                    <SocialPreview
                      platform="facebook"
                      title={title}
                      description={description}
                      imageUrl={imageUrl}
                      siteUrl={result.url}
                    />
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Raw Meta Data */}
              <Card className="mt-6 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Raw Meta Tags
                </h3>
                <div className="max-h-64 overflow-auto rounded-lg bg-neutral-900 p-4">
                  <pre className="font-mono text-xs text-neutral-400">
                    {JSON.stringify(result.meta, null, 2)}
                  </pre>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !error && !isLoading && (
          <div className="mt-16 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-neutral-800 flex items-center justify-center">
              <Search className="h-10 w-10 text-neutral-600" aria-hidden="true" />
            </div>
            <p className="mt-6 text-neutral-400">
              Enter a URL above to analyze its Open Graph tags
            </p>
          </div>
        )}

        {/* SEO Content Section */}
        <section className="mt-24 pt-16 border-t border-neutral-800">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Validate Your OG Tags?
          </h2>
          <div className="prose prose-invert prose-neutral max-w-none">
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              Here's the thing about social media previews—they're often the first
              impression people have of your content. When someone shares your link on
              Twitter, LinkedIn, or Facebook, that little preview card is doing the
              heavy lifting. If it looks broken, incomplete, or just plain boring,
              you've already lost the click.
            </p>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Open Graph tags are the invisible code that tells social platforms how
              to display your content. Miss one tag, and your beautiful blog post shows
              up with a generic placeholder. Get the image dimensions wrong, and it gets
              cropped in weird ways. This validator catches those issues before your
              audience does.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
              <h3 className="text-lg font-semibold text-white mb-3">What We Check</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-neutral-300">og:title</strong> — The headline that appears in previews</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-neutral-300">og:description</strong> — The snippet below the title</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-neutral-300">og:image</strong> — The preview image (1200×630 recommended)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-neutral-300">twitter:card</strong> — Twitter-specific display format</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
              <h3 className="text-lg font-semibold text-white mb-3">Common Issues We Find</h3>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Missing og:image tag (no preview image)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Image URL using relative path instead of absolute</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Title too long (truncated in previews)</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Missing Twitter Card meta tags</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Platform-Specific Requirements
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="py-3 px-4 text-left text-sm font-semibold text-white">Platform</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-white">Image Size</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-white">Title Length</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-white">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr>
                    <td className="py-3 px-4 text-neutral-300">Twitter/X</td>
                    <td className="py-3 px-4 text-neutral-400">1200 × 628 px</td>
                    <td className="py-3 px-4 text-neutral-400">70 characters</td>
                    <td className="py-3 px-4 text-neutral-400">200 characters</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-300">Facebook</td>
                    <td className="py-3 px-4 text-neutral-400">1200 × 630 px</td>
                    <td className="py-3 px-4 text-neutral-400">60 characters</td>
                    <td className="py-3 px-4 text-neutral-400">155 characters</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-300">LinkedIn</td>
                    <td className="py-3 px-4 text-neutral-400">1200 × 627 px</td>
                    <td className="py-3 px-4 text-neutral-400">70 characters</td>
                    <td className="py-3 px-4 text-neutral-400">150 characters</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-300">Discord</td>
                    <td className="py-3 px-4 text-neutral-400">1200 × 630 px</td>
                    <td className="py-3 px-4 text-neutral-400">256 characters</td>
                    <td className="py-3 px-4 text-neutral-400">350 characters</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-neutral-500">
              Source: Platform documentation, updated 2024
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              How to Fix Common Issues
            </h2>
            <div className="space-y-6">
              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="font-semibold text-white mb-2">Missing OG Image</h3>
                <p className="text-neutral-400 text-sm mb-3">
                  Add this to your HTML head section:
                </p>
                <pre className="bg-neutral-950 p-3 rounded-lg overflow-x-auto text-sm">
                  <code className="text-green-400">{`<meta property="og:image" content="https://yoursite.com/og-image.png" />`}</code>
                </pre>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="font-semibold text-white mb-2">Image Not Showing</h3>
                <p className="text-neutral-400 text-sm mb-3">
                  Make sure your image URL is absolute (includes https://) and the image
                  is publicly accessible. Also add dimensions:
                </p>
                <pre className="bg-neutral-950 p-3 rounded-lg overflow-x-auto text-sm">
                  <code className="text-green-400">{`<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`}</code>
                </pre>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="font-semibold text-white mb-2">Twitter Not Showing Large Image</h3>
                <p className="text-neutral-400 text-sm mb-3">
                  Add the Twitter-specific card type:
                </p>
                <pre className="bg-neutral-950 p-3 rounded-lg overflow-x-auto text-sm">
                  <code className="text-green-400">{`<meta name="twitter:card" content="summary_large_image" />`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-2">
              Need to create an OG image?
            </h3>
            <p className="text-neutral-400 mb-4">
              Use our free generator to create professional OG images in seconds.
            </p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Generator
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
