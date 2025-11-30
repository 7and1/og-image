import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OG Image Automations - Batch Generation & API | og-image.org",
  description:
    "Automate OG image generation at scale. Batch processing, API integration, CI/CD pipelines, and programmatic solutions for generating thousands of images.",
  openGraph: {
    title: "OG Image Automations - Batch Generation & API",
    description:
      "Automate OG image generation at scale. Batch processing and API solutions.",
    url: "https://og-image.org/automations",
  },
};

export default function AutomationsPage() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Beta Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            🚧 Beta
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
          OG Image Automations
        </h1>
        <p className="text-xl text-neutral-400 mb-12 max-w-3xl">
          Generate OG images at scale. Batch processing, API integrations, and
          programmatic solutions for teams with thousands of pages.
        </p>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">When You Need Automation</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="text-2xl mb-3">📝</div>
              <h3 className="font-semibold text-white mb-2">Content Sites</h3>
              <p className="text-sm text-neutral-400">
                Blogs, news sites, and documentation with hundreds or thousands of pages
                that each need unique OG images
              </p>
            </div>
            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="text-2xl mb-3">🛒</div>
              <h3 className="font-semibold text-white mb-2">E-commerce</h3>
              <p className="text-sm text-neutral-400">
                Product catalogs where every item needs a social preview with name,
                price, and product image
              </p>
            </div>
            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="text-2xl mb-3">👤</div>
              <h3 className="font-semibold text-white mb-2">User-Generated Content</h3>
              <p className="text-sm text-neutral-400">
                Platforms where users create profiles, posts, or portfolios that get
                shared on social media
              </p>
            </div>
            <div className="p-5 bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-white mb-2">Data-Driven Pages</h3>
              <p className="text-sm text-neutral-400">
                Dynamic content like reports, dashboards, or analytics that need
                visual previews
              </p>
            </div>
          </div>
        </section>

        {/* Approach 1: Build-Time Generation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Approach 1: Build-Time Generation
          </h2>
          <p className="text-neutral-400 mb-4">
            Generate all OG images during your build process. Best for static sites
            with known content at build time.
          </p>

          <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-4">
            <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700">
              <span className="text-sm text-neutral-400">scripts/generate-og-images.ts</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-neutral-300">{`import { generateOGImage } from './lib/og-generator';
import { getAllPosts } from './lib/content';
import fs from 'fs/promises';
import path from 'path';

async function generateAll() {
  const posts = await getAllPosts();

  for (const post of posts) {
    const image = await generateOGImage({
      title: post.title,
      description: post.excerpt,
      author: post.author,
    });

    const outputPath = path.join(
      'public/og',
      \`\${post.slug}.png\`
    );

    await fs.writeFile(outputPath, image);
    console.log(\`Generated: \${outputPath}\`);
  }
}

generateAll();`}</code>
            </pre>
          </div>

          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <p className="text-green-400 text-sm">
              <strong>Pros:</strong> Fast page loads (images pre-generated), no runtime
              costs, works with any hosting
            </p>
          </div>
          <div className="mt-2 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <p className="text-yellow-400 text-sm">
              <strong>Cons:</strong> Longer build times, need to rebuild for content changes
            </p>
          </div>
        </section>

        {/* Approach 2: On-Demand API */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Approach 2: On-Demand API
          </h2>
          <p className="text-neutral-400 mb-4">
            Generate images on-the-fly via an API endpoint. Best for dynamic content
            that changes frequently.
          </p>

          <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-4">
            <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700">
              <span className="text-sm text-neutral-400">app/api/og/route.tsx (Next.js)</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-neutral-300">{`import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') ?? 'Default';
  const theme = searchParams.get('theme') ?? 'dark';

  return new ImageResponse(
    <YourTemplate title={title} theme={theme} />,
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}`}</code>
            </pre>
          </div>

          <p className="text-neutral-400 text-sm mb-4">
            Then reference in your meta tags:
          </p>
          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
            <code className="text-sm text-blue-400">
              {`<meta property="og:image" content="https://yoursite.com/api/og?title=Hello" />`}
            </code>
          </div>
        </section>

        {/* Approach 3: CI/CD Pipeline */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Approach 3: CI/CD Pipeline
          </h2>
          <p className="text-neutral-400 mb-4">
            Generate images as part of your deployment workflow. Best for content
            managed in a CMS or database.
          </p>

          <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-4">
            <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700">
              <span className="text-sm text-neutral-400">.github/workflows/generate-og.yml</span>
            </div>
            <pre className="p-4 overflow-x-auto text-sm">
              <code className="text-neutral-300">{`name: Generate OG Images

on:
  push:
    paths:
      - 'content/**'
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Generate OG images
        run: npm run generate:og

      - name: Upload to CDN
        run: |
          aws s3 sync public/og s3://your-bucket/og \\
            --cache-control "max-age=31536000"`}</code>
            </pre>
          </div>
        </section>

        {/* Batch Processing Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Batch Processing Tips</h2>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <h3 className="font-semibold text-white mb-2">1. Use Parallel Processing</h3>
              <p className="text-sm text-neutral-400">
                Generate multiple images concurrently using <code className="text-blue-400">Promise.all()</code>
                {" "}or worker threads. Limit concurrency to avoid memory issues.
              </p>
            </div>
            <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <h3 className="font-semibold text-white mb-2">2. Implement Caching</h3>
              <p className="text-sm text-neutral-400">
                Hash your input parameters and skip regeneration if the image already
                exists. Content hash + template version = cache key.
              </p>
            </div>
            <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <h3 className="font-semibold text-white mb-2">3. Handle Failures Gracefully</h3>
              <p className="text-sm text-neutral-400">
                Log failed generations and retry. Have a fallback default image for
                pages where generation fails.
              </p>
            </div>
            <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <h3 className="font-semibold text-white mb-2">4. Optimize Image Size</h3>
              <p className="text-sm text-neutral-400">
                Use tools like <code className="text-blue-400">sharp</code> or{" "}
                <code className="text-blue-400">squoosh</code> to compress PNGs after
                generation. Smaller files = faster social previews.
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 bg-neutral-900/50 rounded-xl border border-dashed border-neutral-700">
              <div className="text-2xl mb-3 opacity-50">🔌</div>
              <h3 className="font-semibold text-neutral-500 mb-2">REST API</h3>
              <p className="text-sm text-neutral-600">
                Hosted API endpoint for generating images without running your own infrastructure
              </p>
            </div>
            <div className="p-5 bg-neutral-900/50 rounded-xl border border-dashed border-neutral-700">
              <div className="text-2xl mb-3 opacity-50">📦</div>
              <h3 className="font-semibold text-neutral-500 mb-2">NPM Package</h3>
              <p className="text-sm text-neutral-600">
                Drop-in library with our templates for easy integration into any Node.js project
              </p>
            </div>
            <div className="p-5 bg-neutral-900/50 rounded-xl border border-dashed border-neutral-700">
              <div className="text-2xl mb-3 opacity-50">🔄</div>
              <h3 className="font-semibold text-neutral-500 mb-2">Webhook Integration</h3>
              <p className="text-sm text-neutral-600">
                Trigger image generation from CMS webhooks (Contentful, Sanity, Strapi)
              </p>
            </div>
            <div className="p-5 bg-neutral-900/50 rounded-xl border border-dashed border-neutral-700">
              <div className="text-2xl mb-3 opacity-50">📊</div>
              <h3 className="font-semibold text-neutral-500 mb-2">Bulk Upload</h3>
              <p className="text-sm text-neutral-600">
                Upload CSV/JSON and generate hundreds of images in one batch
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-neutral-800">
          <h3 className="text-lg font-semibold text-white mb-2">
            Need help with automation?
          </h3>
          <p className="text-neutral-400 mb-4">
            We're building automation tools based on user feedback. Let us know what
            you need.
          </p>
          <a
            href="mailto:hi@og-image.org"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Contact Us
          </a>
        </div>

        {/* Back Link */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            ← Back to Generator
          </Link>
        </div>
      </div>
    </div>
  );
}
