"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { useClipboard } from "@/hooks";
import { Button, Input, Textarea, Card } from "@/components/ui";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function MetaTagsContent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  const { copied, copy } = useClipboard();

  const generatedCode = useMemo(() => {
    if (!title) return "";

    const safeTitle = escapeHtml(title);
    const safeDesc = escapeHtml(description);
    const safeSiteName = escapeHtml(siteName);

    let code = `<!-- Primary Meta Tags -->
<title>${safeTitle}</title>
<meta name="title" content="${safeTitle}" />`;

    if (description) {
      code += `
<meta name="description" content="${safeDesc}" />`;
    }

    code += `

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />`;

    if (siteUrl) {
      code += `
<meta property="og:url" content="${siteUrl}" />`;
    }

    code += `
<meta property="og:title" content="${safeTitle}" />`;

    if (description) {
      code += `
<meta property="og:description" content="${safeDesc}" />`;
    }

    if (imageUrl) {
      code += `
<meta property="og:image" content="${imageUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />`;
    }

    if (siteName) {
      code += `
<meta property="og:site_name" content="${safeSiteName}" />`;
    }

    code += `

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />`;

    if (siteUrl) {
      code += `
<meta name="twitter:url" content="${siteUrl}" />`;
    }

    code += `
<meta name="twitter:title" content="${safeTitle}" />`;

    if (description) {
      code += `
<meta name="twitter:description" content="${safeDesc}" />`;
    }

    if (imageUrl) {
      code += `
<meta name="twitter:image" content="${imageUrl}" />`;
    }

    if (twitterHandle) {
      const handle = twitterHandle.startsWith("@")
        ? twitterHandle
        : `@${twitterHandle}`;
      code += `
<meta name="twitter:site" content="${handle}" />
<meta name="twitter:creator" content="${handle}" />`;
    }

    return code;
  }, [title, description, imageUrl, siteUrl, siteName, twitterHandle]);

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Meta Tag Generator
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Generate Open Graph and Twitter Card meta tags for your website.
            Copy and paste into your HTML &lt;head&gt;.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Form */}
          <Card className="p-6">
            <h2 className="mb-6 text-lg font-semibold text-white">
              Page Information
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-neutral-300">
                  Title <span className="text-red-400">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="Your page title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={60}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  {title.length}/60 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium text-neutral-300">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your page"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  rows={3}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  {description.length}/200 characters
                </p>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium text-neutral-300">
                  Image URL
                </label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/og-image.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Recommended: 1200×630 pixels
                </p>
              </div>

              {/* Site URL */}
              <div>
                <label htmlFor="siteUrl" className="mb-2 block text-sm font-medium text-neutral-300">
                  Page URL
                </label>
                <Input
                  id="siteUrl"
                  type="url"
                  placeholder="https://example.com/page"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                />
              </div>

              {/* Site Name */}
              <div>
                <label htmlFor="siteName" className="mb-2 block text-sm font-medium text-neutral-300">
                  Site Name
                </label>
                <Input
                  id="siteName"
                  placeholder="Your Company Name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>

              {/* Twitter Handle */}
              <div>
                <label htmlFor="twitterHandle" className="mb-2 block text-sm font-medium text-neutral-300">
                  Twitter Handle
                </label>
                <Input
                  id="twitterHandle"
                  placeholder="@yourhandle"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Right: Generated Code */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Code2 className="h-5 w-5" aria-hidden="true" />
                  Generated Code
                </h2>
                {generatedCode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copy(generatedCode)}
                    aria-label={copied ? "Copied to clipboard" : "Copy all code to clipboard"}
                  >
                    {copied ? (
                      <>
                        <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Copy All
                      </>
                    )}
                  </Button>
                )}
              </div>

              {generatedCode ? (
                <div className="max-h-[500px] overflow-auto rounded-lg bg-neutral-900 p-4">
                  <pre className="font-mono text-sm text-neutral-300 whitespace-pre-wrap">
                    {generatedCode}
                  </pre>
                </div>
              ) : (
                <div className="rounded-lg bg-neutral-900 p-8 text-center">
                  <Code2 className="mx-auto h-10 w-10 text-neutral-600" aria-hidden="true" />
                  <p className="mt-4 text-neutral-500">
                    Enter a title to generate meta tags
                  </p>
                </div>
              )}
            </Card>

            {/* Usage Instructions */}
            <Card className="p-6">
              <h3 className="mb-3 font-semibold text-white">How to Use</h3>
              <ol className="space-y-2 text-sm text-neutral-400">
                <li className="flex gap-2">
                  <span className="font-mono text-blue-400">1.</span>
                  Fill in your page information above
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-blue-400">2.</span>
                  Click "Copy All" to copy the generated code
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-blue-400">3.</span>
                  Paste into your HTML &lt;head&gt; section
                </li>
                <li className="flex gap-2">
                  <span className="font-mono text-blue-400">4.</span>
                  Use the <a href="/validator" className="text-blue-400 hover:underline">Validator</a> to test your tags
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
