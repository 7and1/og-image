import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js OG Image Guide - Dynamic Open Graph Images | og-image.org",
  description:
    "The complete guide to implementing dynamic Open Graph images in Next.js 13+ with App Router. Learn static generation, dynamic routes, and edge rendering.",
  openGraph: {
    title: "Next.js OG Image Guide - Dynamic Open Graph Images",
    description:
      "The complete guide to implementing dynamic Open Graph images in Next.js 13+ with App Router.",
    url: "https://og-image.org/docs/guides/nextjs",
  },
};

export default function NextJsGuidePage() {
  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
        Next.js Open Graph Image Guide
      </h1>

      <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
        Next.js has become the default choice for React developers who want performance and SEO
        out of the box. With the App Router (Next.js 13+), handling OG images is more powerful
        than ever. Let me walk you through every approach—from simple static images to
        fully dynamic, on-demand generation.
      </p>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
        <p className="text-blue-400 font-medium">
          This guide covers Next.js 13+ with App Router. Using Pages Router? The concepts are
          similar, but the file structure and API routes differ slightly.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Understanding Your Options
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        When it comes to OG images in Next.js, you've got three main paths. Each has trade-offs,
        and the right choice depends on your specific needs:
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-white font-semibold">Approach</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Best For</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Trade-offs</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Static Images</td>
              <td className="py-3 px-4 text-neutral-400">Landing pages, fixed content</td>
              <td className="py-3 px-4 text-neutral-400">Manual updates required</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Build-time Generation</td>
              <td className="py-3 px-4 text-neutral-400">Blogs, docs with known pages</td>
              <td className="py-3 px-4 text-neutral-400">Rebuild needed for changes</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">On-demand (Edge)</td>
              <td className="py-3 px-4 text-neutral-400">User content, dynamic data</td>
              <td className="py-3 px-4 text-neutral-400">Slight latency, compute cost</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Method 1: Static OG Images
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        The simplest approach. Create your OG images using og-image.org, download them, and drop
        them in your public folder. This works perfectly for pages that don't change often—your
        homepage, about page, contact page.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">File Structure</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`public/
├── og-home.png          # Homepage OG image
├── og-about.png         # About page OG image
└── og-contact.png       # Contact page OG image

app/
├── layout.tsx           # Root layout with default OG
├── page.tsx             # Homepage
├── about/
│   └── page.tsx         # About page with custom OG
└── contact/
    └── page.tsx         # Contact page with custom OG`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Setting Up Metadata</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        In Next.js App Router, you export a <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">metadata</code> object
        from your page or layout. Here's how to set up OG images:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://yoursite.com'),
  title: {
    default: 'Your Site Name',
    template: '%s | Your Site Name',
  },
  openGraph: {
    type: 'website',
    siteName: 'Your Site Name',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Your Site Name - Description',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-home.png'],
  },
}`}</code>
      </pre>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        The <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">metadataBase</code> is crucial—it turns your
        relative image paths into absolute URLs. Without it, social platforms can't find your images.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Page-Specific Overrides</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about our mission and team.',
  openGraph: {
    title: 'About Us',
    description: 'Learn about our mission and team.',
    images: [
      {
        url: '/og-about.png',
        width: 1200,
        height: 630,
        alt: 'About Your Site Name',
      },
    ],
  },
}

export default function AboutPage() {
  return <div>About page content</div>
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Method 2: Build-Time Generation with generateStaticParams
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        For blogs and documentation sites with dynamic routes, you can generate OG images at build
        time. This gives you the performance of static images with the convenience of dynamic content.
      </p>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        The idea: create your OG images using og-image.org based on your content titles, then
        reference them in your metadata. If you have 100 blog posts, create 100 OG images during
        your build process or manually before deployment.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Dynamic Metadata Generation</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { getPostBySlug, getAllPosts } from '@/lib/posts'

type Props = {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: \`/og/blog/\${params.slug}.png\`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [\`/og/blog/\${params.slug}.png\`],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const post = await getPostBySlug(params.slug)
  return <article>{/* post content */}</article>
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Method 3: On-Demand Generation with @vercel/og
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Here's where things get interesting. Vercel's <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">@vercel/og</code> library
        (which uses Satori under the hood—the same technology we use at og-image.org) lets you
        generate images on-the-fly at the Edge.
      </p>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        This is perfect for user-generated content, real-time data, or when you have thousands of
        pages and can't pre-generate everything.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Installation</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">npm install @vercel/og</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Creating an OG Image Route</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') || 'Default Title'
  const description = searchParams.get('description') || ''

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
          backgroundColor: '#0a0a0a',
          padding: 80,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: 'white',
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: 32,
                color: '#a3a3a3',
                maxWidth: 800,
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Using the Dynamic Image</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  // Encode parameters for URL
  const ogUrl = new URL('/api/og', 'https://yoursite.com')
  ogUrl.searchParams.set('title', post.title)
  ogUrl.searchParams.set('description', post.excerpt)

  return {
    title: post.title,
    openGraph: {
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Next.js 14+ opengraph-image Convention
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Next.js 14 introduced a brilliant convention: just create an <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">opengraph-image.tsx</code> file
        in any route segment, and Next.js automatically generates and serves the OG image. No
        API routes needed.
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/posts'

export const runtime = 'edge'
export const alt = 'Blog Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(to bottom right, #1a1a2e, #16213e)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 48,
        }}
      >
        <h1 style={{ textAlign: 'center', maxWidth: 900 }}>{post.title}</h1>
      </div>
    ),
    { ...size }
  )
}`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        Next.js automatically adds the OG image meta tags. You don't even need to specify them
        in your metadata export. Magic.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Using Custom Fonts
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Default system fonts are boring. Here's how to use custom fonts in your OG images:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

// Load font at the edge
const interBold = fetch(
  new URL('./fonts/Inter-Bold.ttf', import.meta.url)
).then((res) => res.arrayBuffer())

export async function GET(request: Request) {
  const fontData = await interBold

  return new ImageResponse(
    (
      <div
        style={{
          fontFamily: 'Inter',
          // ... rest of your styles
        }}
      >
        Your Title Here
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Performance Optimization
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        OG image generation adds latency. Here's how to minimize it:
      </p>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">1. Use Edge Runtime</h3>
          <p className="text-neutral-400 text-sm">
            Always add <code className="bg-neutral-800 px-1 rounded">export const runtime = 'edge'</code> to
            your OG image routes. Edge functions start faster and run closer to users.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">2. Cache Aggressively</h3>
          <p className="text-neutral-400 text-sm">
            Set proper cache headers. OG images don't change often, so cache them for hours or days.
          </p>
          <pre className="bg-neutral-800 rounded p-2 mt-2 text-xs overflow-x-auto">
            <code>{`return new ImageResponse(jsx, {
  headers: {
    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
  },
})`}</code>
          </pre>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">3. Keep It Simple</h3>
          <p className="text-neutral-400 text-sm">
            Complex layouts take longer to render. Stick to basic flexbox layouts and avoid
            heavy gradients or too many elements.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Common Gotchas
      </h2>

      <ul className="list-disc list-inside text-neutral-300 mb-8 space-y-3">
        <li>
          <strong className="text-white">Missing metadataBase</strong>: Without it, relative URLs
          won't work. Always set it in your root layout.
        </li>
        <li>
          <strong className="text-white">CSS Limitations</strong>: Satori (the rendering engine)
          doesn't support all CSS. No CSS Grid, limited flexbox, no pseudo-elements. Keep styles simple.
        </li>
        <li>
          <strong className="text-white">Font Loading</strong>: Fonts must be loaded as ArrayBuffer.
          Can't use Google Fonts directly—download the .ttf files.
        </li>
        <li>
          <strong className="text-white">Image Loading in JSX</strong>: External images work, but
          you need to use <code className="bg-neutral-800 px-1 rounded text-sm">img</code> tags
          with <code className="bg-neutral-800 px-1 rounded text-sm">src</code> as the full URL.
        </li>
        <li>
          <strong className="text-white">Cache Invalidation</strong>: Social platforms cache
          OG images aggressively. Add cache-busting query params when testing.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Testing Your Implementation
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Before deploying, verify your OG images work:
      </p>

      <ol className="list-decimal list-inside text-neutral-300 mb-8 space-y-3">
        <li>Check the raw URL directly—visit <code className="bg-neutral-800 px-1 rounded text-sm">/api/og?title=Test</code> to see the image</li>
        <li>View page source and verify the <code className="bg-neutral-800 px-1 rounded text-sm">og:image</code> meta tag has the correct URL</li>
        <li>Use the <Link href="/validator" className="text-blue-400 hover:text-blue-300">og-image.org validator</Link> to check all platforms at once</li>
        <li>Test the actual share preview using platform debuggers</li>
      </ol>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        When to Use og-image.org vs @vercel/og
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Both tools use the same underlying technology (Satori). Here's when to use each:
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Use og-image.org when:</h3>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>• Creating static images manually</li>
            <li>• Designing templates visually</li>
            <li>• Non-technical users need to create images</li>
            <li>• You want zero-config, instant results</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Use @vercel/og when:</h3>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>• Generating images dynamically at runtime</li>
            <li>• Images depend on real-time data</li>
            <li>• You have thousands of pages</li>
            <li>• Full programmatic control is needed</li>
          </ul>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-12">
        <h3 className="font-semibold text-white mb-3">Next Steps</h3>
        <p className="text-neutral-400 mb-4">
          You've got the knowledge. Now implement it. Start with static images using og-image.org,
          then add dynamic generation as needed.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create OG Image
          </Link>
          <Link
            href="/docs/platforms/twitter"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Twitter/X Optimization
          </Link>
        </div>
      </div>
    </article>
  );
}
