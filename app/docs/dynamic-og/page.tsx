import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dynamic OG Images with Satori - Generate at Runtime | og-image.org",
  description:
    "Learn how to generate dynamic Open Graph images at runtime using Satori and Vercel OG. Complete guide with code examples for Next.js, Edge Functions, and more.",
  openGraph: {
    title: "Dynamic OG Images with Satori",
    description:
      "Generate beautiful OG images at runtime using Satori. Complete implementation guide.",
    url: "https://og-image.org/docs/dynamic-og",
  },
};

export default function DynamicOGPage() {
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/docs"
          className="text-sm text-neutral-500 hover:text-white transition-colors"
        >
          ← Back to Docs
        </Link>
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
        Dynamic OG Images with Satori
      </h1>
      <p className="text-xl text-neutral-400 mb-8 max-w-3xl">
        Generate beautiful Open Graph images at runtime. No design tools needed—just
        write JSX and let Satori handle the rest.
      </p>

      {/* What is Satori */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">What is Satori?</h2>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-300 mb-4">
            Satori is a library developed by Vercel that converts HTML and CSS into SVG.
            It's the engine behind <code className="text-blue-400">@vercel/og</code> and
            powers dynamic OG image generation for millions of websites.
          </p>
          <p className="text-neutral-400 mb-4">
            The key insight: instead of creating images in Photoshop or Figma, you write
            React components. Satori renders them to SVG, which can then be converted to
            PNG for use as OG images.
          </p>
          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-800">
            <p className="text-neutral-300 text-sm">
              <strong className="text-white">Why this matters:</strong> Dynamic OG images
              mean every blog post, product page, or user profile can have a unique,
              branded preview image—generated automatically from your data.
            </p>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <div className="text-2xl mb-2">1️⃣</div>
            <h3 className="font-semibold text-white mb-1">JSX Template</h3>
            <p className="text-sm text-neutral-400">
              Write your OG image as a React component with inline styles
            </p>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <div className="text-2xl mb-2">2️⃣</div>
            <h3 className="font-semibold text-white mb-1">Satori Converts</h3>
            <p className="text-sm text-neutral-400">
              Satori renders JSX to SVG using a subset of CSS Flexbox
            </p>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <div className="text-2xl mb-2">3️⃣</div>
            <h3 className="font-semibold text-white mb-1">PNG Output</h3>
            <p className="text-sm text-neutral-400">
              Resvg converts SVG to PNG at 1200×630 for social platforms
            </p>
          </div>
        </div>
      </section>

      {/* Vercel OG Quick Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Quick Start with @vercel/og
        </h2>
        <p className="text-neutral-400 mb-4">
          The easiest way to get started is with Vercel's official package. It bundles
          Satori with sensible defaults and works seamlessly with Next.js.
        </p>

        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-4">
          <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700">
            <span className="text-sm text-neutral-400">Terminal</span>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-green-400">npm install @vercel/og</code>
          </pre>
        </div>

        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-4">
          <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700">
            <span className="text-sm text-neutral-400">app/api/og/route.tsx</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code className="text-neutral-300">{`import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Default Title';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#fff',
          fontSize: 60,
          fontWeight: 'bold',
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}`}</code>
          </pre>
        </div>

        <p className="text-neutral-400 text-sm">
          Now visit <code className="text-blue-400">/api/og?title=Hello%20World</code> to
          see your dynamic OG image.
        </p>
      </section>

      {/* Using Raw Satori */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Using Satori Directly (Advanced)
        </h2>
        <p className="text-neutral-400 mb-4">
          For more control, you can use Satori directly. This is what og-image.org uses
          for client-side rendering.
        </p>

        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-4">
          <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700">
            <span className="text-sm text-neutral-400">Terminal</span>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-green-400">npm install satori @resvg/resvg-wasm</code>
          </pre>
        </div>

        <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden mb-4">
          <div className="px-4 py-2 bg-neutral-800 border-b border-neutral-700">
            <span className="text-sm text-neutral-400">lib/og-generator.ts</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code className="text-neutral-300">{`import satori from 'satori';
import { Resvg } from '@resvg/resvg-wasm';

// Load font (required for Satori)
const font = await fetch('/fonts/Inter-Bold.ttf')
  .then(res => res.arrayBuffer());

export async function generateOGImage(element: React.ReactNode) {
  // Step 1: Render JSX to SVG
  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: font,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  // Step 2: Convert SVG to PNG
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return pngBuffer;
}`}</code>
          </pre>
        </div>
      </section>

      {/* CSS Support */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Supported CSS Properties</h2>
        <p className="text-neutral-400 mb-4">
          Satori supports a subset of CSS. Here's what works:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <h3 className="font-semibold text-green-400 mb-2">✅ Supported</h3>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>• Flexbox (display: flex)</li>
              <li>• Colors (hex, rgb, hsl)</li>
              <li>• Borders and border-radius</li>
              <li>• Padding and margin</li>
              <li>• Font properties</li>
              <li>• Background colors and gradients</li>
              <li>• Box shadow</li>
              <li>• Position (absolute/relative)</li>
            </ul>
          </div>
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <h3 className="font-semibold text-red-400 mb-2">❌ Not Supported</h3>
            <ul className="text-sm text-neutral-300 space-y-1">
              <li>• CSS Grid</li>
              <li>• Animations</li>
              <li>• Pseudo-elements (::before, ::after)</li>
              <li>• Media queries</li>
              <li>• CSS variables</li>
              <li>• calc()</li>
              <li>• External stylesheets</li>
              <li>• Most transforms</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <p className="text-yellow-400 text-sm">
            <strong>Important:</strong> Always use inline styles with Satori. Tailwind
            classes won't work—you need to write raw CSS as JavaScript objects.
          </p>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Best Practices</h2>
        <div className="space-y-4">
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h3 className="font-semibold text-white mb-2">1. Always Specify Dimensions</h3>
            <p className="text-sm text-neutral-400">
              Every element needs explicit width/height or flex properties. Satori can't
              infer sizes like browsers do.
            </p>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h3 className="font-semibold text-white mb-2">2. Embed Fonts</h3>
            <p className="text-sm text-neutral-400">
              Load font files as ArrayBuffer and pass them to Satori. System fonts aren't
              available in Edge/serverless environments.
            </p>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h3 className="font-semibold text-white mb-2">3. Cache Generated Images</h3>
            <p className="text-sm text-neutral-400">
              OG image generation is CPU-intensive. Use CDN caching or store generated
              images to avoid regenerating on every request.
            </p>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h3 className="font-semibold text-white mb-2">4. Handle Text Overflow</h3>
            <p className="text-sm text-neutral-400">
              Long titles will overflow. Use <code className="text-blue-400">textOverflow: 'ellipsis'</code>
              {" "}and fixed max-width containers.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Common Use Cases</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h3 className="font-semibold text-white mb-2">Blog Posts</h3>
            <p className="text-sm text-neutral-400">
              Generate unique images for each post with title, author, and publish date
            </p>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h3 className="font-semibold text-white mb-2">E-commerce Products</h3>
            <p className="text-sm text-neutral-400">
              Show product image, name, and price in a branded template
            </p>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h3 className="font-semibold text-white mb-2">User Profiles</h3>
            <p className="text-sm text-neutral-400">
              Create shareable profile cards with avatar, name, and bio
            </p>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h3 className="font-semibold text-white mb-2">Documentation Pages</h3>
            <p className="text-sm text-neutral-400">
              Auto-generate images showing page title and section hierarchy
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Resources</h2>
        <div className="space-y-2">
          <a
            href="https://github.com/vercel/satori"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-blue-500/50 transition-colors"
          >
            <span className="font-semibold text-blue-400">Satori GitHub →</span>
            <p className="text-sm text-neutral-400 mt-1">
              Official repository with full documentation and examples
            </p>
          </a>
          <a
            href="https://vercel.com/docs/functions/og-image-generation"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-blue-500/50 transition-colors"
          >
            <span className="font-semibold text-blue-400">Vercel OG Docs →</span>
            <p className="text-sm text-neutral-400 mt-1">
              Official Vercel documentation for @vercel/og
            </p>
          </a>
          <a
            href="https://og-playground.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-blue-500/50 transition-colors"
          >
            <span className="font-semibold text-blue-400">OG Playground →</span>
            <p className="text-sm text-neutral-400 mt-1">
              Interactive playground to experiment with Satori
            </p>
          </a>
        </div>
      </section>

      {/* CTA */}
      <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-neutral-800">
        <h3 className="text-lg font-semibold text-white mb-2">
          Don't want to code?
        </h3>
        <p className="text-neutral-400 mb-4">
          Use our free generator to create OG images visually—no coding required.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Open Generator
        </Link>
      </div>
    </div>
  );
}
