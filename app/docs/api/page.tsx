import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "OG Image API - PNG/SVG Templates + Background Catalog | og-image.org",
  description:
    "Free OG API with template rendering, SVG/PNG output, photo background catalog, and strict rate limiting. No auth required.",
  openGraph: {
    title: "OG Image API - PNG/SVG Templates + Background Catalog",
    description:
      "Use /api/og, /api/templates, and /api/backgrounds to generate and integrate social images.",
    url: "https://og-image.org/docs/api",
  },
};

const baseUrl = "https://og-image.org";

const apiExamples = [
  {
    title: "Template + PNG (default)",
    image: "/docs/api-examples/api-dark.png",
    url: "/api/og?template=photo-hero&title=Product+Launch&description=Ship+faster+with+og-image.org&bgId=qOGTYdYWQ7I",
  },
  {
    title: "Template + SVG",
    image: "/docs/api-examples/api-light.png",
    url: "/api/og?template=minimal&title=Weekly+Report&description=KPI+up+34%25&format=svg&bg=ffffff&text=171717&accent=3b82f6",
  },
  {
    title: "Catalog photo + overlay",
    image: "/docs/api-examples/api-sunset-brand.png",
    url: "/api/og?template=photo-glass&title=Design+System&description=Production+UI+in+days&bgId=Q1p7bh3SHj8&overlay=0.65",
  },
];

export default function ApiDocsPage() {
  return (
    <article>
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-white">API Documentation</h1>

      <p className="mb-8 text-xl leading-relaxed text-neutral-300">
        og-image.org exposes a no-auth API surface for image rendering and catalog discovery.
        The API is designed for static sites, edge functions, and backend automation workflows.
      </p>

      <div className="mb-8 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-5">
        <h2 className="mb-2 text-lg font-semibold text-emerald-300">Available Endpoints</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-emerald-200/90">
          <li>
            <code className="text-emerald-100">GET /api/og</code> — render OG images from template parameters.
          </li>
          <li>
            <code className="text-emerald-100">GET /api/templates</code> — list available templates and defaults.
          </li>
          <li>
            <code className="text-emerald-100">GET /api/backgrounds</code> — list/search curated background photos.
          </li>
        </ul>
      </div>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-white">1) Render Endpoint: /api/og</h2>

      <p className="mb-4 leading-relaxed text-neutral-300">
        Generate Open Graph images via URL parameters. Default output is PNG.
        Set <code>format=svg</code> for SVG output.
      </p>

      <pre className="mb-6 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <code className="text-sm text-neutral-300">
          {`GET ${baseUrl}/api/og?template=photo-hero&title=Hello+World&description=Launch+day&bgId=qOGTYdYWQ7I&format=png`}
        </code>
      </pre>

      <h3 className="mb-3 mt-8 text-lg font-semibold text-white">Query Parameters</h3>

      <div className="mb-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="px-4 py-3 text-left font-semibold text-white">Parameter</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Required</th>
              <th className="px-4 py-3 text-left font-semibold text-white">Rules</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">template</td>
              <td className="px-4 py-3 text-neutral-400">string</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">Template ID from <code>/api/templates</code>. Defaults to <code>gradient</code>.</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">title</td>
              <td className="px-4 py-3 text-neutral-400">string</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">Max 80 characters.</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">description</td>
              <td className="px-4 py-3 text-neutral-400">string</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">Max 200 characters. Alias: <code>subtitle</code>.</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">icon</td>
              <td className="px-4 py-3 text-neutral-400">string</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">Max 12 characters (emoji supported).</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">bg / backgroundColor</td>
              <td className="px-4 py-3 text-neutral-400">string</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">Background string used by template (hex or gradient).</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">text / textColor</td>
              <td className="px-4 py-3 text-neutral-400">hex</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">6-digit hex, with or without <code>#</code>.</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">accent / accentColor</td>
              <td className="px-4 py-3 text-neutral-400">hex</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">6-digit hex, with or without <code>#</code>.</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">bgId</td>
              <td className="px-4 py-3 text-neutral-400">string</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">Background ID from <code>/api/backgrounds</code>.</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">overlay</td>
              <td className="px-4 py-3 text-neutral-400">number</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400">Clamped to <code>0..1</code>. Default <code>0.55</code>.</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="px-4 py-3 font-mono text-neutral-300">format</td>
              <td className="px-4 py-3 text-neutral-400">enum</td>
              <td className="px-4 py-3 text-neutral-400">No</td>
              <td className="px-4 py-3 text-neutral-400"><code>png</code> (default) or <code>svg</code>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mb-3 mt-8 text-lg font-semibold text-white">Example Outputs</h3>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {apiExamples.map((example) => (
          <figure key={example.title} className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
            <div className="relative aspect-[1200/630] bg-neutral-800">
              <Image
                src={example.image}
                alt={example.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <figcaption className="space-y-2 p-3">
              <div className="text-sm font-medium text-white">{example.title}</div>
              <pre className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-3">
                <code className="text-xs text-neutral-400">{`GET ${baseUrl}${example.url}`}</code>
              </pre>
            </figcaption>
          </figure>
        ))}
      </div>

      <h3 className="mb-3 mt-8 text-lg font-semibold text-white">Rate Limits</h3>
      <ul className="mb-8 list-inside list-disc space-y-2 text-neutral-300">
        <li>2 requests / 10 seconds / IP</li>
        <li>5 requests / minute / IP</li>
        <li>25 requests / hour / IP</li>
      </ul>

      <p className="mb-6 text-sm text-neutral-400">
        Response headers include <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>,
        <code> X-RateLimit-Reset</code>, and <code>Retry-After</code> on 429 responses.
      </p>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-white">2) Catalog Endpoint: /api/backgrounds</h2>

      <pre className="mb-6 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <code className="text-sm text-neutral-300">
          {`GET ${baseUrl}/api/backgrounds?category=technology&search=neon&limit=30&offset=0`}
        </code>
      </pre>

      <ul className="mb-6 list-inside list-disc space-y-2 text-neutral-300">
        <li><code>id</code>: fetch single item by ID.</li>
        <li><code>category</code>: filter by category.</li>
        <li><code>search</code>: fuzzy text search over ID/title/author.</li>
        <li><code>limit</code>: 1..200 (default 30).</li>
        <li><code>offset</code>: pagination offset (default 0).</li>
      </ul>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-white">3) Template Catalog Endpoint: /api/templates</h2>

      <pre className="mb-6 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <code className="text-sm text-neutral-300">
          {`GET ${baseUrl}/api/templates?category=social&search=photo`}
        </code>
      </pre>

      <ul className="mb-6 list-inside list-disc space-y-2 text-neutral-300">
        <li><code>id</code>: fetch single template item.</li>
        <li><code>category</code>: filter templates by category.</li>
        <li><code>search</code>: search by name/description/id.</li>
      </ul>

      <h2 className="mb-4 mt-12 text-2xl font-bold text-white">Error Format</h2>

      <pre className="mb-6 overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900 p-4">
        <code className="text-sm text-neutral-300">
          {`{
  "success": false,
  "error": {
    "code": "TITLE_TOO_LONG",
    "message": "title must be <= 80 characters"
  }
}`}
        </code>
      </pre>
    </article>
  );
}
