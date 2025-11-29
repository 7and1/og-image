import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "React OG Image Guide - Open Graph for React Apps | og-image.org",
  description:
    "Learn how to implement Open Graph images in React applications. Covers Create React App, Vite, and custom setups with best practices for social sharing.",
  openGraph: {
    title: "React OG Image Guide - Open Graph for React Apps",
    description:
      "Learn how to implement Open Graph images in React applications.",
    url: "https://og-image.org/docs/guides/react",
  },
};

export default function ReactGuidePage() {
  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
        React Open Graph Image Guide
      </h1>

      <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
        React itself doesn't handle meta tags—it's a UI library, not a framework. But that doesn't
        mean setting up OG images is hard. Whether you're using Create React App, Vite, or any
        other setup, this guide covers everything you need to make your social shares look professional.
      </p>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
        <p className="text-yellow-400 font-medium">
          Important: If you're using Next.js, check the <Link href="/docs/guides/nextjs" className="underline">Next.js guide</Link> instead.
          It has built-in metadata handling that's much simpler than manual React approaches.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Understanding the Challenge
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Here's the thing about React and OG images: social media crawlers don't execute JavaScript.
        When Twitter or LinkedIn fetches your page to get the OG image, they see your initial HTML—before
        React hydrates and renders your content.
      </p>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        This means if you're dynamically setting meta tags with React, those crawlers will never see them.
        They'll get whatever's in your static HTML file, which is usually nothing useful.
      </p>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        The solution? You need to either pre-render your meta tags at build time, or serve them from
        a server. Let's explore both approaches.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Method 1: Static OG Images (Simplest)
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        For single-page applications or sites with a handful of pages, the easiest approach is static
        OG images. Create them with og-image.org and hardcode the meta tags in your HTML.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Step 1: Create Your Images</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Head to <Link href="/" className="text-blue-400 hover:text-blue-300">og-image.org</Link>,
        design your images, and download them. Put them in your <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">public</code> folder.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Step 2: Add Meta Tags to index.html</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- public/index.html (Create React App) -->
<!-- index.html (Vite) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Your App Name</title>
  <meta name="description" content="Your app description here" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yoursite.com" />
  <meta property="og:title" content="Your App Name" />
  <meta property="og:description" content="Your app description here" />
  <meta property="og:image" content="https://yoursite.com/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Your App Name preview" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://yoursite.com" />
  <meta name="twitter:title" content="Your App Name" />
  <meta name="twitter:description" content="Your app description here" />
  <meta name="twitter:image" content="https://yoursite.com/og-image.png" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        That's it. When crawlers hit your site, they see these meta tags immediately. No JavaScript
        execution required.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Method 2: React Helmet for Dynamic Titles
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        What if you want different titles and descriptions for different routes? React Helmet lets
        you manage document head from within your React components. But remember—this only works
        if the crawler executes JavaScript (most don't).
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Installation</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">npm install react-helmet-async</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Setup in App Root</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// src/App.tsx
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* Your routes */}
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Using in Components</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// src/pages/About.tsx
import { Helmet } from 'react-helmet-async'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Your App Name</title>
        <meta name="description" content="Learn about our mission" />
        <meta property="og:title" content="About Us | Your App Name" />
        <meta property="og:description" content="Learn about our mission" />
        <meta property="og:image" content="https://yoursite.com/og-about.png" />
      </Helmet>

      <div>
        <h1>About Us</h1>
        {/* page content */}
      </div>
    </>
  )
}`}</code>
      </pre>

      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
        <p className="text-red-400 font-medium">
          Warning: React Helmet alone won't work for social media crawlers. You'll need server-side
          rendering or pre-rendering for crawlers to see your dynamic meta tags.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Method 3: Pre-Rendering with react-snap
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Pre-rendering takes your SPA and generates static HTML files for each route. When crawlers
        visit, they get the pre-rendered HTML with all meta tags intact.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Installation</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">npm install --save-dev react-snap</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Configuration</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "postbuild": "react-snap"
  },
  "reactSnap": {
    "puppeteerArgs": ["--no-sandbox"],
    "skipThirdPartyRequests": true,
    "include": ["/", "/about", "/contact", "/blog"]
  }
}`}</code>
      </pre>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Now when you build, react-snap crawls your app and generates static HTML for each page.
        Combined with React Helmet, you get proper meta tags that crawlers can read.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Method 4: Vite with vite-plugin-ssg
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Using Vite? There's a plugin that does static site generation at build time:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">npm install vite-ssg</code>
      </pre>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// src/main.ts
import { ViteSSG } from 'vite-ssg'
import App from './App'
import routes from './routes'

export const createApp = ViteSSG(App, { routes })`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        This generates static HTML with hydration, so crawlers see your full content including meta tags.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Method 5: Server-Side Rendering
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        For full control, you can add SSR to your React app. This means every request gets server-rendered
        HTML before React takes over on the client.
      </p>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        The complexity is higher, but you get maximum flexibility. Popular options:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-8 space-y-2">
        <li><strong className="text-white">Next.js</strong> - Full framework with built-in SSR (recommended if starting fresh)</li>
        <li><strong className="text-white">Remix</strong> - Full framework with SSR and great data loading</li>
        <li><strong className="text-white">Custom Express + React</strong> - Roll your own with <code className="bg-neutral-800 px-1 rounded">renderToString</code></li>
      </ul>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        A Practical Example: Blog with React Router
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Let's put it together. Here's a blog setup using React Router and React Helmet:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// src/pages/BlogPost.tsx
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useBlogPost } from '../hooks/useBlogPost'

export default function BlogPost() {
  const { slug } = useParams()
  const { post, isLoading } = useBlogPost(slug)

  if (isLoading) return <div>Loading...</div>
  if (!post) return <div>Post not found</div>

  const ogImageUrl = \`https://yoursite.com/og/blog/\${slug}.png\`

  return (
    <>
      <Helmet>
        <title>{post.title} | Your Blog</title>
        <meta name="description" content={post.excerpt} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>

      <article>
        <h1>{post.title}</h1>
        <time>{post.date}</time>
        {/* SECURITY: Always sanitize HTML content before rendering! */}
        {/* Use DOMPurify or similar: sanitize(post.content) */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  )
}`}</code>
      </pre>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 my-6">
        <p className="text-yellow-400 text-sm font-medium mb-2">Security Warning</p>
        <p className="text-neutral-300 text-sm">
          The example above uses <code className="text-yellow-400">dangerouslySetInnerHTML</code>.
          Never render untrusted HTML directly. Always sanitize content using libraries like{" "}
          <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">DOMPurify</a>{" "}
          to prevent XSS attacks.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Generating Blog OG Images
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        For each blog post, you'll need an OG image. You have two options:
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Option A: Manual Creation</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Use og-image.org to create an image for each post. Save them in <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">public/og/blog/</code> with
        the post slug as the filename.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Option B: Build Script</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Create a build script that generates OG images for all posts at build time:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// scripts/generate-og-images.mjs
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Load your blog posts
import posts from '../src/data/posts.json'

// Load font
const inter = readFileSync('./fonts/Inter-Bold.ttf')

async function generateOgImage(post) {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: 80,
        },
        children: [
          {
            type: 'h1',
            props: {
              style: { color: 'white', fontSize: 64 },
              children: post.title,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: inter, weight: 700 }],
    }
  )

  const resvg = new Resvg(svg)
  const png = resvg.render().asPng()

  writeFileSync(\`./public/og/blog/\${post.slug}.png\`, png)
}

async function main() {
  mkdirSync('./public/og/blog', { recursive: true })

  for (const post of posts) {
    await generateOgImage(post)
    console.log(\`Generated: \${post.slug}.png\`)
  }
}

main()`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Which Approach Should You Use?
      </h2>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-white font-semibold">Your Situation</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Recommended Approach</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Simple SPA, few pages</td>
              <td className="py-3 px-4 text-neutral-400">Static images in index.html</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Multiple routes, CRA</td>
              <td className="py-3 px-4 text-neutral-400">React Helmet + react-snap</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Multiple routes, Vite</td>
              <td className="py-3 px-4 text-neutral-400">React Helmet + vite-ssg</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Full dynamic content</td>
              <td className="py-3 px-4 text-neutral-400">Switch to Next.js or Remix</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Starting new project</td>
              <td className="py-3 px-4 text-neutral-400">Use Next.js from the start</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Testing Your Implementation
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Before shipping, verify your setup works:
      </p>

      <ol className="list-decimal list-inside text-neutral-300 mb-8 space-y-3">
        <li>Build your app and serve the production build locally</li>
        <li>Disable JavaScript in your browser and visit each page</li>
        <li>View the page source—you should see all OG meta tags</li>
        <li>Use our <Link href="/validator" className="text-blue-400 hover:text-blue-300">validator tool</Link> to check how platforms see your pages</li>
      </ol>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-12">
        <h3 className="font-semibold text-white mb-3">Bottom Line</h3>
        <p className="text-neutral-400 mb-4">
          React alone can't solve the OG image problem because crawlers don't run JavaScript.
          You need pre-rendering, SSR, or static HTML. For new projects, seriously consider Next.js—it
          handles all of this out of the box.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create OG Image
          </Link>
          <Link
            href="/docs/guides/nextjs"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Next.js Guide
          </Link>
        </div>
      </div>
    </article>
  );
}
