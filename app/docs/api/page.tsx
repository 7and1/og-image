import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "API Documentation - OG Image URL Parameters | og-image.org",
  description:
    "Complete API reference for og-image.org URL parameters. Learn how to generate OG images programmatically with query parameters.",
  openGraph: {
    title: "API Documentation - OG Image URL Parameters",
    description:
      "Complete API reference for og-image.org URL parameters.",
    url: "https://og-image.org/docs/api",
  },
};

export default function ApiDocsPage() {
  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
        API Documentation
      </h1>

      <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
        og-image.org supports URL parameters for creating shareable template links and
        pre-populated generators. This reference covers all available parameters and
        how to use them effectively.
      </p>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
        <p className="text-blue-400 font-medium">
          Note: og-image.org is a client-side tool. These URL parameters configure the generator
          interface—they don't generate images server-side. For server-side OG image generation,
          see our <Link href="/docs/guides/nextjs" className="underline">Next.js guide</Link>.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Template URL Structure
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Create shareable links to the generator with pre-filled values using query parameters:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`https://og-image.org/templates/{template-id}?title=Your+Title&description=Your+Description`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Available Parameters
      </h2>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-white font-semibold">Parameter</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Type</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">title</td>
              <td className="py-3 px-4 text-neutral-400">string</td>
              <td className="py-3 px-4 text-neutral-400">Main heading text for the OG image</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">description</td>
              <td className="py-3 px-4 text-neutral-400">string</td>
              <td className="py-3 px-4 text-neutral-400">Secondary text/subtitle (alias: desc)</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">icon</td>
              <td className="py-3 px-4 text-neutral-400">string</td>
              <td className="py-3 px-4 text-neutral-400">Icon identifier (e.g., "sparkles", "rocket")</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">bg</td>
              <td className="py-3 px-4 text-neutral-400">hex color</td>
              <td className="py-3 px-4 text-neutral-400">Background color (without #)</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">text</td>
              <td className="py-3 px-4 text-neutral-400">hex color</td>
              <td className="py-3 px-4 text-neutral-400">Text/foreground color (without #)</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">accent</td>
              <td className="py-3 px-4 text-neutral-400">hex color</td>
              <td className="py-3 px-4 text-neutral-400">Accent color for highlights (without #)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Available Templates
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Use these template IDs in your URLs:
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-white font-semibold">Template ID</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Name</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">gradient</td>
              <td className="py-3 px-4 text-neutral-400">Gradient</td>
              <td className="py-3 px-4 text-neutral-400">Modern SaaS, tech products</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">minimal</td>
              <td className="py-3 px-4 text-neutral-400">Minimal</td>
              <td className="py-3 px-4 text-neutral-400">Clean blogs, documentation</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">modern</td>
              <td className="py-3 px-4 text-neutral-400">Modern</td>
              <td className="py-3 px-4 text-neutral-400">Professional portfolios</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">bold</td>
              <td className="py-3 px-4 text-neutral-400">Bold</td>
              <td className="py-3 px-4 text-neutral-400">Statements, announcements</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">split</td>
              <td className="py-3 px-4 text-neutral-400">Split</td>
              <td className="py-3 px-4 text-neutral-400">Two-tone designs</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">glass</td>
              <td className="py-3 px-4 text-neutral-400">Glass</td>
              <td className="py-3 px-4 text-neutral-400">Trendy, modern look</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">startup</td>
              <td className="py-3 px-4 text-neutral-400">Startup</td>
              <td className="py-3 px-4 text-neutral-400">Product launches, startups</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300 font-mono">blog</td>
              <td className="py-3 px-4 text-neutral-400">Blog</td>
              <td className="py-3 px-4 text-neutral-400">Article previews, blogs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        URL Encoding
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Parameters must be URL-encoded. Here are common characters and their encodings:
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-white font-semibold">Character</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Encoding</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Space</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">%20 or +</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">Hello+World</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">&</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">%26</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">Tom%26Jerry</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">#</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">%23</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">%23trending</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">=</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">%3D</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">1%3D1</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">?</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">%3F</td>
              <td className="py-3 px-4 text-neutral-400 font-mono">What%3F</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        Most programming languages have built-in URL encoding. In JavaScript:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-8 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`const title = encodeURIComponent("What's New in 2024?")
const url = \`https://og-image.org/templates/gradient?title=\${title}\``}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Examples
      </h2>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Basic Template Link</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`https://og-image.org/templates/gradient?title=Hello+World&description=My+first+OG+image`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">With Custom Colors</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`https://og-image.org/templates/minimal?title=Product+Launch&bg=1a1a2e&text=ffffff&accent=e94560`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">With Icon</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`https://og-image.org/templates/startup?title=Launching+Soon&description=Join+the+waitlist&icon=rocket`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Full Example</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-8 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`https://og-image.org/templates/bold?title=The+Ultimate+Guide&description=Everything+you+need+to+know&icon=book&bg=0f172a&text=f8fafc&accent=3b82f6`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Available Icons
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        The <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">icon</code> parameter
        accepts the following values:
      </p>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 mb-8">
        {[
          "sparkles", "rocket", "lightning", "star", "heart", "fire",
          "globe", "code", "book", "briefcase", "chart", "check",
          "clock", "cloud", "cog", "cube", "document", "download",
          "flag", "folder", "gift", "home", "key", "link",
          "location", "lock", "mail", "megaphone", "moon", "music",
          "pencil", "phone", "photo", "play", "puzzle", "search",
          "shield", "shopping", "sun", "tag", "terminal", "trophy",
          "user", "video", "wifi", "zap"
        ].map((icon) => (
          <div
            key={icon}
            className="bg-neutral-900 border border-neutral-800 rounded px-3 py-2"
          >
            <code className="text-sm text-neutral-300">{icon}</code>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Color Format
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Colors are specified as 6-character hex codes without the # prefix:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// Correct
?bg=000000&text=ffffff&accent=3b82f6

// Incorrect (don't use #)
?bg=#000000  ❌`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Programmatic Usage
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Generate shareable links in your application:
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">JavaScript/TypeScript</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`function generateOgImageUrl(options: {
  template: string
  title: string
  description?: string
  icon?: string
  bg?: string
  text?: string
  accent?: string
}) {
  const params = new URLSearchParams()

  if (options.title) params.set('title', options.title)
  if (options.description) params.set('description', options.description)
  if (options.icon) params.set('icon', options.icon)
  if (options.bg) params.set('bg', options.bg)
  if (options.text) params.set('text', options.text)
  if (options.accent) params.set('accent', options.accent)

  return \`https://og-image.org/templates/\${options.template}?\${params.toString()}\`
}

// Usage
const url = generateOgImageUrl({
  template: 'gradient',
  title: 'My Awesome Article',
  description: 'Learn something new today',
  bg: '0f172a',
  accent: '3b82f6'
})`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Python</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`from urllib.parse import urlencode

def generate_og_image_url(template, **kwargs):
    params = {k: v for k, v in kwargs.items() if v}
    query = urlencode(params)
    return f"https://og-image.org/templates/{template}?{query}"

# Usage
url = generate_og_image_url(
    "gradient",
    title="My Awesome Article",
    description="Learn something new today",
    bg="0f172a",
    accent="3b82f6"
)`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Use Cases
      </h2>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Shareable Template Links</h3>
          <p className="text-neutral-400 text-sm">
            Let users share pre-configured templates with their team or community. They can
            click the link and immediately see the generator with their settings.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">CMS Integration</h3>
          <p className="text-neutral-400 text-sm">
            Generate "Create OG Image" links in your CMS that pre-populate the generator with
            article titles and descriptions.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Team Branding</h3>
          <p className="text-neutral-400 text-sm">
            Create a base URL with your brand colors, then share it with your team. Everyone
            creates on-brand images by just changing the title.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Documentation Links</h3>
          <p className="text-neutral-400 text-sm">
            Include "Generate OG Image" buttons in your documentation that open the generator
            with appropriate templates for different content types.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Limitations
      </h2>

      <ul className="list-disc list-inside text-neutral-300 mb-8 space-y-2">
        <li>URL parameters configure the interface; they don't generate images server-side</li>
        <li>Maximum URL length is ~2000 characters (browser limit)</li>
        <li>Custom fonts and advanced styling require using the interface directly</li>
        <li>Images must be downloaded manually or through automation</li>
      </ul>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-12">
        <h3 className="font-semibold text-white mb-3">Need Server-Side Generation?</h3>
        <p className="text-neutral-400 mb-4">
          For programmatic, server-side OG image generation, check out our framework guides.
          They cover how to generate images dynamically at build time or on-demand.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/guides/nextjs"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Next.js Guide
          </Link>
          <Link
            href="/docs/guides/react"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            React Guide
          </Link>
        </div>
      </div>
    </article>
  );
}
