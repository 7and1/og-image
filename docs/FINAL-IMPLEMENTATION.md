# Final Implementation Blueprint

> Complete coding specification for og-image.org

---

## Executive Summary

This document is the **final authority** for implementation. It consolidates all architectural decisions and provides copy-paste ready code patterns.

### Project Identity
- **Domain:** og-image.org
- **Tagline:** "The Open Standard for Open Graph Images"
- **Core Promise:** Generate, validate, and audit OG images—all in your browser

### Technical Foundation
```
Next.js 14 (App Router) + Static Export + Cloudflare Pages
├── Client-side: Satori + Resvg WASM (image generation)
├── State: Zustand (single store, persisted)
├── Edge: Cloudflare Functions (validator/audit proxy)
└── Cost: $0/month (static hosting)
```

---

## Part 1: Route Architecture

### Complete Route Map

```
og-image.org/
│
├── /                       # [P1] Core Generator - Interactive OG maker
│
├── /templates              # [P2] Template Gallery - Pre-designed layouts
│   └── /[slug]             #      Individual template with query params
│
├── /validator              # [P3] URL Validator - Social preview debugger
│
├── /meta-tags              # [P2] Meta Tag Generator - HTML code output
│
├── /audit                  # [P4] Site Auditor - Bulk OG checker
│
├── /docs                   # [P5] Knowledge Base - SEO content
│   ├── /getting-started    #      Quick start guide
│   ├── /guides             #      Platform-specific guides
│   │   ├── /nextjs         #      "OG Images in Next.js"
│   │   ├── /react          #      "OG Images in React"
│   │   └── /vue            #      "OG Images in Vue"
│   ├── /platforms          #      Social media specs
│   │   ├── /twitter        #      Twitter Card specs
│   │   ├── /linkedin       #      LinkedIn image specs
│   │   └── /facebook       #      Facebook OG specs
│   └── /dynamic-og         #      Dynamic generation with Satori
│
└── /api (Edge Functions)   # Backend services
    ├── /parse              #      Fetch & parse OG tags
    └── /sitemap            #      Parse sitemap for audit
```

### Priority Legend
- **[P1]** - Critical Path (MVP)
- **[P2]** - High Value
- **[P3]** - Medium Value
- **[P4]** - Nice to Have
- **[P5]** - SEO/Content

---

## Part 2: Page Specifications

### 2.1 Home Page (`/`) - Core Generator

**Purpose:** The flagship feature. Users design OG images interactively.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Header: Logo | Templates | Validator | Docs        [Theme]   │
├──────────────────┬─────────────────────────────────────────────┤
│                  │                                             │
│   EDITOR PANEL   │              PREVIEW AREA                   │
│   (380px fixed)  │              (flex-1)                       │
│                  │                                             │
│   ┌────────────┐ │   ┌─────────────────────────────────────┐  │
│   │ Template   │ │   │                                     │  │
│   │ Picker     │ │   │         Live Preview                │  │
│   └────────────┘ │   │         (1200×630 scaled)           │  │
│                  │   │                                     │  │
│   ┌────────────┐ │   │         [Loading Overlay]           │  │
│   │ Title      │ │   │                                     │  │
│   │ Input      │ │   └─────────────────────────────────────┘  │
│   └────────────┘ │                                             │
│                  │   ┌─────────────────────────────────────┐  │
│   ┌────────────┐ │   │  Social Preview Tabs                │  │
│   │ Description│ │   │  [Twitter] [LinkedIn] [Facebook]    │  │
│   │ Textarea   │ │   └─────────────────────────────────────┘  │
│   └────────────┘ │                                             │
│                  │   ┌─────────────────────────────────────┐  │
│   ┌────────────┐ │   │  Export Section                     │  │
│   │ Icon/Emoji │ │   │  [Download PNG] [Copy Code ▼]       │  │
│   │ Picker     │ │   │                                     │  │
│   └────────────┘ │   │  ┌─────────────────────────────┐    │  │
│                  │   │  │ // Next.js Code             │    │  │
│   ┌────────────┐ │   │  │ export default function...  │    │  │
│   │ Colors     │ │   │  └─────────────────────────────┘    │  │
│   │ - Bg       │ │   └─────────────────────────────────────┘  │
│   │ - Text     │ │                                             │
│   │ - Accent   │ │                                             │
│   └────────────┘ │                                             │
│                  │                                             │
├──────────────────┴─────────────────────────────────────────────┤
│  Footer: GitHub | Twitter | "Made with ♥ for developers"      │
└────────────────────────────────────────────────────────────────┘
```

**State Shape:**
```typescript
interface GeneratorState {
  // Content
  title: string;           // max 60 chars
  description: string;     // max 200 chars
  icon: string;            // emoji or text

  // Styling
  template: TemplateId;
  backgroundColor: string; // hex or gradient
  textColor: string;       // hex
  accentColor: string;     // hex

  // Advanced (collapsed by default)
  fontFamily: 'inter' | 'roboto' | 'space-grotesk';
  fontSize: 'small' | 'medium' | 'large';
  layout: 'center' | 'left' | 'split';

  // UI State
  isGenerating: boolean;
  previewUrl: string | null;
  activeExportTab: 'nextjs' | 'html' | 'vercel';
}
```

**Key Interactions:**
1. Any input change → 500ms debounce → re-render preview
2. Template change → instant state update → re-render
3. Download click → trigger blob download
4. Copy code → clipboard API with toast feedback

---

### 2.2 Templates Page (`/templates`)

**Purpose:** Gallery of pre-designed templates with live customization.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Header                                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  TEMPLATE GALLERY                                              │
│                                                                │
│  Filter: [All] [Startup] [Blog] [Product] [Event] [Social]    │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │          │  │          │  │          │  │          │       │
│  │ Gradient │  │ Minimal  │  │  Modern  │  │   Bold   │       │
│  │          │  │          │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │          │  │          │  │          │  │          │       │
│  │  Split   │  │  Glass   │  │ Startup  │  │  Blog    │       │
│  │          │  │          │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                │
│  Click any template to customize →                             │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Template URL API:**
```
/templates/gradient?title=Hello&desc=World&icon=🚀&bg=%23000
```

Query parameters allow:
- Shareable template links
- Embedding in documentation
- Quick generation via URL

---

### 2.3 Validator Page (`/validator`)

**Purpose:** Debug OG tags for any URL, preview across platforms.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Header                                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  🔍  Enter URL to validate                    [Validate] │ │
│  │  https://example.com/blog/my-post                        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌────────────────────────┬─────────────────────────────────┐ │
│  │                        │                                 │ │
│  │   META TAGS FOUND      │     SOCIAL PREVIEWS             │ │
│  │                        │                                 │ │
│  │   og:title ✓           │     ┌───────────────────────┐   │ │
│  │   "My Blog Post"       │     │   Twitter Preview     │   │ │
│  │                        │     │   ┌─────────────────┐ │   │ │
│  │   og:description ✓     │     │   │    [Image]      │ │   │ │
│  │   "A great article..." │     │   │                 │ │   │ │
│  │                        │     │   └─────────────────┘ │   │ │
│  │   og:image ✓           │     │   Title here          │   │ │
│  │   https://...image.png │     │   Description...      │   │ │
│  │   ⚠️ 800×400 (should   │     │   example.com         │   │ │
│  │      be 1200×630)      │     └───────────────────────┘   │ │
│  │                        │                                 │ │
│  │   twitter:card ✓       │     [LinkedIn] [Facebook]       │ │
│  │   "summary_large_image"│                                 │ │
│  │                        │                                 │ │
│  │   ❌ og:site_name      │                                 │ │
│  │   Missing              │                                 │ │
│  │                        │                                 │ │
│  └────────────────────────┴─────────────────────────────────┘ │
│                                                                │
│  VALIDATION SCORE: 85/100                                      │
│  ├── Required tags: 4/4 ✓                                      │
│  ├── Recommended tags: 2/4 ⚠️                                  │
│  └── Image dimensions: 0/1 ❌                                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
```
User Input URL
      │
      ▼
┌─────────────────┐
│  /api/parse     │  ← Edge Function
│  ?url=...       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HTMLRewriter   │  ← Parse <meta> tags
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON Response  │
│  {              │
│    title: "...",│
│    image: "...",│
│    ...          │
│  }              │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Client renders │
│  - Meta list    │
│  - Previews     │
│  - Score        │
└─────────────────┘
```

---

### 2.4 Meta Tags Page (`/meta-tags`)

**Purpose:** Simple meta tag generator without image rendering.

**Use Case:** Users who already have an OG image and just need HTML code.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Header                                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  META TAG GENERATOR                                            │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Title                                                  │   │
│  │  [My Awesome Website                                  ] │   │
│  │                                                         │   │
│  │  Description                                            │   │
│  │  [The best website for...                             ] │   │
│  │                                                         │   │
│  │  Image URL                                              │   │
│  │  [https://example.com/og-image.png                    ] │   │
│  │                                                         │   │
│  │  Site Name (optional)                                   │   │
│  │  [My Company                                          ] │   │
│  │                                                         │   │
│  │  URL                                                    │   │
│  │  [https://example.com                                 ] │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  GENERATED CODE                                    [Copy All]  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  <!-- Open Graph -->                                    │   │
│  │  <meta property="og:type" content="website" />          │   │
│  │  <meta property="og:title" content="My Awesome..." />   │   │
│  │  <meta property="og:description" content="The best..."/>│   │
│  │  <meta property="og:image" content="https://..." />     │   │
│  │  ...                                                    │   │
│  │                                                         │   │
│  │  <!-- Twitter -->                                       │   │
│  │  <meta name="twitter:card" content="summary_large..." />│   │
│  │  ...                                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 2.5 Audit Page (`/audit`)

**Purpose:** Bulk check OG tags across an entire website.

**Critical Implementation:** Concurrent queue with rate limiting.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Header                                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  SITE AUDIT                                                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  🌐  Enter domain or sitemap URL              [Start]    │ │
│  │  https://example.com                                      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Progress: ████████████░░░░░░░░  12/20 pages  (60%)      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  RESULTS                                         [Export CSV] │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  URL                    │ Status  │ Title │ Image │ Desc │ │
│  │──────────────────────────────────────────────────────────│ │
│  │  /                      │  ✓ OK   │  ✓    │  ✓    │  ✓   │ │
│  │  /about                 │  ⚠ WARN │  ✓    │  ❌   │  ✓   │ │
│  │  /blog/post-1           │  ✓ OK   │  ✓    │  ✓    │  ✓   │ │
│  │  /blog/post-2           │  ❌ FAIL │  ❌   │  ❌   │  ❌  │ │
│  │  /contact               │  ✓ OK   │  ✓    │  ✓    │  ✓   │ │
│  │  ...                    │         │       │       │      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  SUMMARY                                                       │
│  ├── Total pages: 20                                          │
│  ├── Passing: 15 (75%)                                        │
│  ├── Warnings: 3 (15%)                                        │
│  └── Failing: 2 (10%)                                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Concurrent Queue Implementation:**
```typescript
// Critical: asyncPool pattern
async function asyncPool<T, R>(
  poolLimit: number,
  items: T[],
  iteratorFn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const promise = Promise.resolve()
      .then(() => iteratorFn(item, i))
      .then((result) => {
        results[i] = result;
      });

    const cleanup = promise.then(() => {
      executing.splice(executing.indexOf(cleanup), 1);
    });
    executing.push(cleanup);

    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// Usage
const results = await asyncPool(
  3, // Max 3 concurrent requests
  urlsToAudit,
  async (url) => {
    const res = await fetch(`/api/parse?url=${encodeURIComponent(url)}`);
    return res.json();
  }
);
```

---

## Part 3: Component Specifications

### 3.1 Component Hierarchy

```
app/
├── layout.tsx                    # Root layout
│   └── Header
│   └── Footer
│
├── page.tsx                      # Home (Generator)
│   └── GeneratorLayout
│       ├── EditorPanel
│       │   ├── TemplatePicker
│       │   ├── TitleInput
│       │   ├── DescriptionInput
│       │   ├── IconPicker
│       │   ├── ColorSection
│       │   │   ├── ColorPicker (bg)
│       │   │   ├── ColorPicker (text)
│       │   │   └── ColorPicker (accent)
│       │   └── AdvancedOptions (collapsed)
│       │
│       └── PreviewArea
│           ├── PreviewCanvas
│           │   ├── LoadingOverlay
│           │   └── DimensionBadge
│           ├── SocialPreviews
│           │   ├── TwitterPreview
│           │   ├── LinkedInPreview
│           │   └── FacebookPreview
│           └── ExportSection
│               ├── DownloadButton
│               ├── CodeTabs
│               │   ├── NextJsCode
│               │   ├── HtmlCode
│               │   └── VercelOgCode
│               └── CopyButton
│
├── templates/page.tsx            # Template Gallery
│   └── TemplateGrid
│       └── TemplateCard (×N)
│
├── templates/[slug]/page.tsx     # Template Customizer
│   └── (reuses GeneratorLayout)
│
├── validator/page.tsx            # URL Validator
│   └── ValidatorLayout
│       ├── UrlInput
│       ├── MetaTagList
│       │   └── MetaTagItem (×N)
│       ├── SocialPreviewTabs
│       │   ├── TwitterPreview
│       │   ├── LinkedInPreview
│       │   └── FacebookPreview
│       └── ValidationScore
│
├── meta-tags/page.tsx            # Meta Tag Generator
│   └── MetaTagsLayout
│       ├── MetaInputForm
│       └── CodeOutput
│
└── audit/page.tsx                # Site Auditor
    └── AuditLayout
        ├── DomainInput
        ├── ProgressBar
        ├── ResultsTable
        │   └── ResultRow (×N)
        └── AuditSummary
```

### 3.2 Core Component Specs

#### EditorPanel
```typescript
// components/editor/EditorPanel.tsx
interface EditorPanelProps {
  className?: string;
}

// Renders the left sidebar with all editing controls
// Width: 380px fixed
// Scroll: overflow-y-auto
// Background: neutral-900
```

#### PreviewCanvas
```typescript
// components/preview/PreviewCanvas.tsx
interface PreviewCanvasProps {
  previewUrl: string | null;
  isLoading: boolean;
  onDownload: () => void;
}

// Displays the rendered OG image
// Aspect ratio: 1200/630 (1.9:1)
// Shows loading overlay when generating
// Shows dimension badge (1200×630)
```

#### TemplatePicker
```typescript
// components/editor/TemplatePicker.tsx
interface TemplatePickerProps {
  selected: TemplateId;
  onChange: (id: TemplateId) => void;
}

// Horizontal scrollable row of template thumbnails
// Active state: ring-2 ring-blue-500
// Thumbnail size: 120×63 (maintains aspect ratio)
```

#### ColorPicker
```typescript
// components/editor/ColorPicker.tsx
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

// Uses react-colorful HexColorPicker
// Shows color presets as swatches
// Shows hex input for manual entry
```

#### SocialPreview
```typescript
// components/preview/SocialPreview.tsx
interface SocialPreviewProps {
  platform: 'twitter' | 'linkedin' | 'facebook';
  title: string;
  description: string;
  imageUrl: string;
  siteUrl?: string;
}

// Renders platform-specific card mockup
// Twitter: 506×253 image, title below
// LinkedIn: 1200×627 image, title below
// Facebook: 1200×630 image, title overlay
```

#### CodeBlock
```typescript
// components/export/CodeBlock.tsx
interface CodeBlockProps {
  code: string;
  language: 'typescript' | 'html';
  onCopy: () => void;
}

// Syntax highlighted code display
// Copy button in top-right
// Line numbers (optional)
// Dark theme matching UI
```

---

## Part 4: API Specifications

### 4.1 Edge Function: `/api/parse`

**Purpose:** Fetch any URL and extract OG meta tags.

**Request:**
```
GET /api/parse?url=https://example.com&links=true
```

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| url | Yes | URL to fetch |
| links | No | If "true", also return internal links |

**Response:**
```typescript
interface ParseResponse {
  success: boolean;
  url: string;
  meta: {
    'og:title'?: string;
    'og:description'?: string;
    'og:image'?: string;
    'og:image:width'?: string;
    'og:image:height'?: string;
    'og:url'?: string;
    'og:type'?: string;
    'og:site_name'?: string;
    'twitter:card'?: string;
    'twitter:title'?: string;
    'twitter:description'?: string;
    'twitter:image'?: string;
    'title'?: string; // <title> fallback
  };
  links?: string[]; // If links=true
  error?: string;
}
```

**Implementation:**
```typescript
// functions/api/parse.ts

interface MetaData {
  [key: string]: string;
}

class MetaExtractor {
  meta: MetaData = {};
  links: string[] = [];
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  handleMeta(element: Element) {
    const property = element.getAttribute('property');
    const name = element.getAttribute('name');
    const content = element.getAttribute('content');

    if (content) {
      if (property) this.meta[property] = content;
      if (name) this.meta[name] = content;
    }
  }

  handleTitle(text: Text) {
    if (!this.meta['title']) {
      this.meta['title'] = text.text.trim();
    }
  }

  handleLink(element: Element) {
    const href = element.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
      try {
        const url = new URL(href, this.baseUrl);
        if (url.origin === new URL(this.baseUrl).origin) {
          this.links.push(url.href);
        }
      } catch {}
    }
  }
}

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');
  const includeLinks = url.searchParams.get('links') === 'true';

  if (!targetUrl) {
    return Response.json({ success: false, error: 'URL required' }, { status: 400 });
  }

  try {
    new URL(targetUrl);
  } catch {
    return Response.json({ success: false, error: 'Invalid URL' }, { status: 400 });
  }

  // Check cache first
  const cache = caches.default;
  const cacheKey = new Request(url.toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'og-image.org/1.0 (Social Preview Bot)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      cf: { cacheTtl: 3600 },
    });

    if (!response.ok) {
      return Response.json(
        { success: false, error: `HTTP ${response.status}` },
        { status: 502 }
      );
    }

    const extractor = new MetaExtractor(targetUrl);

    let rewriter = new HTMLRewriter()
      .on('meta', {
        element: (el) => extractor.handleMeta(el),
      })
      .on('title', {
        text: (text) => extractor.handleTitle(text),
      });

    if (includeLinks) {
      rewriter = rewriter.on('a[href]', {
        element: (el) => extractor.handleLink(el),
      });
    }

    await rewriter.transform(response).text();

    const result: any = {
      success: true,
      url: targetUrl,
      meta: extractor.meta,
    };

    if (includeLinks) {
      result.links = [...new Set(extractor.links)].slice(0, 50);
    }

    const jsonResponse = Response.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });

    // Cache the response
    context.waitUntil(cache.put(cacheKey, jsonResponse.clone()));

    return jsonResponse;
  } catch (error) {
    return Response.json(
      { success: false, error: 'Fetch failed' },
      { status: 500 }
    );
  }
};
```

### 4.2 Edge Function: `/api/sitemap`

**Purpose:** Parse sitemap.xml and return list of URLs.

**Request:**
```
GET /api/sitemap?url=https://example.com/sitemap.xml
```

**Response:**
```typescript
interface SitemapResponse {
  success: boolean;
  urls: string[];
  count: number;
  error?: string;
}
```

---

## Part 5: State Management

### 5.1 Store Definition

```typescript
// store/useStore.ts

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type TemplateId =
  | 'gradient'
  | 'minimal'
  | 'modern'
  | 'bold'
  | 'split'
  | 'glass'
  | 'startup'
  | 'blog';

export type FontFamily = 'inter' | 'roboto' | 'space-grotesk';
export type FontSize = 'small' | 'medium' | 'large';
export type Layout = 'center' | 'left' | 'split';
export type ExportTab = 'nextjs' | 'html' | 'vercel';

interface OGState {
  // === Content ===
  title: string;
  description: string;
  icon: string;

  // === Styling ===
  template: TemplateId;
  backgroundColor: string;
  textColor: string;
  accentColor: string;

  // === Advanced ===
  fontFamily: FontFamily;
  fontSize: FontSize;
  layout: Layout;

  // === UI State ===
  isGenerating: boolean;
  previewUrl: string | null;
  error: string | null;
  activeExportTab: ExportTab;

  // === Actions ===
  setContent: (content: Partial<Pick<OGState, 'title' | 'description' | 'icon'>>) => void;
  setStyling: (styling: Partial<Pick<OGState, 'template' | 'backgroundColor' | 'textColor' | 'accentColor'>>) => void;
  setAdvanced: (advanced: Partial<Pick<OGState, 'fontFamily' | 'fontSize' | 'layout'>>) => void;
  setUI: (ui: Partial<Pick<OGState, 'isGenerating' | 'previewUrl' | 'error' | 'activeExportTab'>>) => void;
  reset: () => void;
  loadTemplate: (templateId: TemplateId) => void;
}

const defaultState = {
  // Content
  title: 'Build faster with Next.js',
  description: 'The React Framework for Production',
  icon: '⚡',

  // Styling
  template: 'gradient' as TemplateId,
  backgroundColor: '#000000',
  textColor: '#ffffff',
  accentColor: '#3b82f6',

  // Advanced
  fontFamily: 'inter' as FontFamily,
  fontSize: 'medium' as FontSize,
  layout: 'center' as Layout,

  // UI
  isGenerating: false,
  previewUrl: null,
  error: null,
  activeExportTab: 'nextjs' as ExportTab,
};

export const useStore = create<OGState>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,

        setContent: (content) => set((state) => ({ ...state, ...content })),
        setStyling: (styling) => set((state) => ({ ...state, ...styling })),
        setAdvanced: (advanced) => set((state) => ({ ...state, ...advanced })),
        setUI: (ui) => set((state) => ({ ...state, ...ui })),

        reset: () => set(defaultState),

        loadTemplate: (templateId) => {
          const presets: Record<TemplateId, Partial<OGState>> = {
            gradient: {
              backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textColor: '#ffffff',
            },
            minimal: {
              backgroundColor: '#ffffff',
              textColor: '#000000',
            },
            modern: {
              backgroundColor: '#0f172a',
              textColor: '#f8fafc',
              accentColor: '#38bdf8',
            },
            bold: {
              backgroundColor: '#dc2626',
              textColor: '#ffffff',
            },
            split: {
              backgroundColor: '#000000',
              textColor: '#ffffff',
              layout: 'split',
            },
            glass: {
              backgroundColor: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              textColor: '#ffffff',
            },
            startup: {
              backgroundColor: '#000000',
              textColor: '#ffffff',
              accentColor: '#22c55e',
            },
            blog: {
              backgroundColor: '#fafafa',
              textColor: '#171717',
            },
          };

          set({
            template: templateId,
            ...presets[templateId],
          });
        },
      }),
      {
        name: 'og-generator-storage',
        partialize: (state) => ({
          // Only persist user content, not UI state
          title: state.title,
          description: state.description,
          icon: state.icon,
          template: state.template,
          backgroundColor: state.backgroundColor,
          textColor: state.textColor,
          accentColor: state.accentColor,
          fontFamily: state.fontFamily,
          fontSize: state.fontSize,
          layout: state.layout,
        }),
      }
    ),
    { name: 'og-store' }
  )
);
```

### 5.2 Selectors (Optional Optimization)

```typescript
// store/selectors.ts

import { useStore } from './useStore';
import { shallow } from 'zustand/shallow';

// Content selector
export const useContent = () => useStore(
  (state) => ({
    title: state.title,
    description: state.description,
    icon: state.icon,
  }),
  shallow
);

// Styling selector
export const useStyling = () => useStore(
  (state) => ({
    template: state.template,
    backgroundColor: state.backgroundColor,
    textColor: state.textColor,
    accentColor: state.accentColor,
  }),
  shallow
);

// UI selector
export const useUIState = () => useStore(
  (state) => ({
    isGenerating: state.isGenerating,
    previewUrl: state.previewUrl,
    error: state.error,
  }),
  shallow
);
```

---

## Part 6: Template System

### 6.1 Template Interface

```typescript
// templates/types.ts

export interface TemplateProps {
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily?: string;
  fontSize?: 'small' | 'medium' | 'large';
  layout?: 'center' | 'left' | 'split';
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  category: 'general' | 'startup' | 'blog' | 'product' | 'event';
  thumbnail: string; // Base64 or URL
  component: React.FC<TemplateProps>;
  defaultProps: Partial<TemplateProps>;
}
```

### 6.2 Template Registry

```typescript
// templates/index.ts

import { TemplateConfig, TemplateId } from './types';
import { GradientTemplate } from './gradient';
import { MinimalTemplate } from './minimal';
import { ModernTemplate } from './modern';
import { BoldTemplate } from './bold';
import { SplitTemplate } from './split';
import { GlassTemplate } from './glass';
import { StartupTemplate } from './startup';
import { BlogTemplate } from './blog';

export const templates: Record<TemplateId, TemplateConfig> = {
  gradient: {
    id: 'gradient',
    name: 'Gradient',
    description: 'Beautiful gradient backgrounds',
    category: 'general',
    thumbnail: '/thumbnails/gradient.png',
    component: GradientTemplate,
    defaultProps: {
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple',
    category: 'general',
    thumbnail: '/thumbnails/minimal.png',
    component: MinimalTemplate,
    defaultProps: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
    },
  },
  // ... more templates
};

export const templateList = Object.values(templates);
export const templatesByCategory = templateList.reduce((acc, template) => {
  if (!acc[template.category]) acc[template.category] = [];
  acc[template.category].push(template);
  return acc;
}, {} as Record<string, TemplateConfig[]>);
```

### 6.3 Example Template Implementation

```typescript
// templates/gradient.tsx

import { TemplateProps } from './types';

export function GradientTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
  accentColor,
}: TemplateProps): React.ReactElement {
  // Font sizes based on title length
  const titleFontSize = title.length > 40 ? 48 : title.length > 25 ? 56 : 64;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: backgroundColor,
        fontFamily: 'Inter',
        padding: 60,
      }}
    >
      {/* Icon */}
      <div
        style={{
          fontSize: 72,
          marginBottom: 24,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: titleFontSize,
          fontWeight: 700,
          color: textColor,
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: '90%',
        }}
      >
        {title}
      </div>

      {/* Description */}
      {description && (
        <div
          style={{
            fontSize: 28,
            color: textColor,
            opacity: 0.8,
            marginTop: 20,
            textAlign: 'center',
            maxWidth: '80%',
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      )}

      {/* Accent line */}
      <div
        style={{
          width: 80,
          height: 4,
          background: accentColor,
          borderRadius: 2,
          marginTop: 32,
        }}
      />
    </div>
  );
}
```

---

## Part 7: Code Generation

### 7.1 Next.js App Router Code

```typescript
// lib/code-gen.ts

import { OGState } from '@/store/useStore';

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateNextJsCode(state: OGState): string {
  const { title, description, icon, backgroundColor, textColor, template } = state;

  return `// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '${escapeString(title)}';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // Load font from local file
  const interBold = await fetch(
    new URL('./fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '${backgroundColor}',
          fontFamily: 'Inter',
          padding: 60,
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 24 }}>${icon}</div>
        <div
          style={{
            fontSize: ${title.length > 40 ? 48 : 56},
            fontWeight: 700,
            color: '${textColor}',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          ${escapeString(title)}
        </div>
        ${description ? `<div
          style={{
            fontSize: 28,
            color: '${textColor}',
            opacity: 0.8,
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          ${escapeString(description)}
        </div>` : ''}
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}`;
}

export function generateHtmlMetaTags(state: OGState): string {
  const { title, description, icon } = state;

  return `<!-- Primary Meta Tags -->
<title>${escapeHtml(title)}</title>
<meta name="title" content="${escapeHtml(title)}" />
<meta name="description" content="${escapeHtml(description)}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yourdomain.com/" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="https://yourdomain.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://yourdomain.com/" />
<meta property="twitter:title" content="${escapeHtml(title)}" />
<meta property="twitter:description" content="${escapeHtml(description)}" />
<meta property="twitter:image" content="https://yourdomain.com/og-image.png" />`;
}

export function generateVercelOgCode(state: OGState): string {
  return `// pages/api/og.tsx (Pages Router)
// or use @vercel/og directly

import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '${state.backgroundColor}',
          fontFamily: 'Inter',
        }}
      >
        <div style={{ fontSize: 72 }}>${state.icon}</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: '${state.textColor}' }}>
          ${escapeString(state.title)}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}`;
}
```

---

## Part 8: Hooks

### 8.1 useEngine

```typescript
// hooks/useEngine.ts

import { useState, useCallback, useRef, useEffect } from 'react';
import { renderToBlob } from '@/lib/engine';

interface UseEngineOptions {
  debounceMs?: number;
}

export function useEngine(options: UseEngineOptions = {}) {
  const { debounceMs = 500 } = options;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousUrlRef = useRef<string | null>(null);

  const render = useCallback(async (node: React.ReactNode) => {
    // Clear any pending render
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setIsGenerating(true);
      setError(null);

      try {
        const url = await renderToBlob(node);

        // Revoke previous URL to prevent memory leak
        if (previousUrlRef.current) {
          URL.revokeObjectURL(previousUrlRef.current);
        }

        previousUrlRef.current = url;
        setPreviewUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Render failed');
        console.error('Render error:', err);
      } finally {
        setIsGenerating(false);
      }
    }, debounceMs);
  }, [debounceMs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const download = useCallback((filename = 'og-image.png') => {
    if (!previewUrl) return;

    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [previewUrl]);

  return {
    previewUrl,
    isGenerating,
    error,
    render,
    download,
  };
}
```

### 8.2 useClipboard

```typescript
// hooks/useClipboard.ts

import { useState, useCallback } from 'react';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  }, [timeout]);

  return { copied, copy };
}
```

### 8.3 useValidator

```typescript
// hooks/useValidator.ts

import { useState, useCallback } from 'react';

interface OGMeta {
  'og:title'?: string;
  'og:description'?: string;
  'og:image'?: string;
  'og:url'?: string;
  'og:type'?: string;
  'og:site_name'?: string;
  'twitter:card'?: string;
  'twitter:title'?: string;
  'twitter:description'?: string;
  'twitter:image'?: string;
  title?: string;
}

interface ValidationResult {
  url: string;
  meta: OGMeta;
  score: number;
  issues: Array<{ type: 'error' | 'warning'; message: string }>;
}

export function useValidator() {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/parse?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Validation failed');
      }

      // Calculate score
      const issues: ValidationResult['issues'] = [];
      let score = 100;

      // Required tags
      if (!data.meta['og:title'] && !data.meta.title) {
        issues.push({ type: 'error', message: 'Missing og:title' });
        score -= 25;
      }
      if (!data.meta['og:image']) {
        issues.push({ type: 'error', message: 'Missing og:image' });
        score -= 25;
      }

      // Recommended tags
      if (!data.meta['og:description']) {
        issues.push({ type: 'warning', message: 'Missing og:description' });
        score -= 10;
      }
      if (!data.meta['og:url']) {
        issues.push({ type: 'warning', message: 'Missing og:url' });
        score -= 5;
      }
      if (!data.meta['twitter:card']) {
        issues.push({ type: 'warning', message: 'Missing twitter:card' });
        score -= 5;
      }

      setResult({
        url,
        meta: data.meta,
        score: Math.max(0, score),
        issues,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, validate };
}
```

---

Continue to next document...
