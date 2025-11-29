# System Architecture

> Deep dive into og-image.org's technical architecture

---

## High-Level Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                            USER BROWSER                                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │   UI Components  │    │   Zustand Store  │    │  Rendering Engine │  │
│  │                  │◄──►│                  │◄──►│                   │  │
│  │  - Editor Panel  │    │  - title         │    │  - Satori (SVG)   │  │
│  │  - Preview       │    │  - description   │    │  - Resvg (PNG)    │  │
│  │  - Code Export   │    │  - template      │    │  - WASM Runtime   │  │
│  │  - Downloads     │    │  - colors        │    │                   │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
│           │                       │                       │             │
│           └───────────────────────┼───────────────────────┘             │
│                                   │                                     │
│                          ┌────────▼────────┐                           │
│                          │   React Node    │                           │
│                          │   (Template)    │                           │
│                          └────────┬────────┘                           │
│                                   │                                     │
│                          ┌────────▼────────┐                           │
│                          │  PNG Blob URL   │                           │
│                          └─────────────────┘                           │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Core Engine Architecture

### Singleton Pattern for WASM

```typescript
// lib/engine.ts

// Global singleton state
let wasmInitialized = false;
let fontCache: ArrayBuffer | null = null;

export async function initializeEngine(): Promise<void> {
  if (wasmInitialized) return;

  // Initialize WASM (only once per session)
  await initWasm(fetch('/resvg.wasm'));
  wasmInitialized = true;

  // Load font (only once per session)
  fontCache = await fetch('/fonts/Inter-Bold.ttf')
    .then(res => res.arrayBuffer());
}

export async function renderToBlob(
  node: React.ReactNode
): Promise<string> {
  await initializeEngine();

  // Step 1: React → SVG (Satori)
  const svg = await satori(node, {
    width: 1200,
    height: 630,
    fonts: [{
      name: 'Inter',
      data: fontCache!,
      weight: 700,
      style: 'normal',
    }],
  });

  // Step 2: SVG → PNG (Resvg WASM)
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Step 3: Return Blob URL
  return URL.createObjectURL(
    new Blob([pngBuffer], { type: 'image/png' })
  );
}
```

### Rendering Pipeline

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │     │   Satori    │     │   Resvg     │     │   Blob      │
│   Element   │────►│   Engine    │────►│   WASM      │────►│   URL       │
│             │     │             │     │             │     │             │
│ <Template   │     │ SVG String  │     │ PNG Buffer  │     │ blob:...    │
│   props />  │     │ (Vector)    │     │ (Raster)    │     │ (Display)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
     JSX               ~100KB              ~200KB            Ready for
                                                             <img src>
```

---

## State Management

### Zustand Store Structure

```typescript
// store/useStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TemplateId =
  | 'simple'
  | 'gradient'
  | 'modern'
  | 'minimal'
  | 'bold';

interface OGState {
  // Content
  title: string;
  description: string;
  icon: string;

  // Styling
  template: TemplateId;
  backgroundColor: string;
  textColor: string;
  accentColor: string;

  // UI State
  isGenerating: boolean;
  previewUrl: string | null;
  error: string | null;

  // Actions
  set: (partial: Partial<OGState>) => void;
  reset: () => void;
}

export const useStore = create<OGState>()(
  persist(
    (set) => ({
      // Defaults
      title: 'Build faster with Next.js',
      description: 'The React Framework for the Web',
      icon: '⚡️',
      template: 'gradient',
      backgroundColor: '#000000',
      textColor: '#ffffff',
      accentColor: '#3b82f6',
      isGenerating: false,
      previewUrl: null,
      error: null,

      // Actions
      set: (partial) => set(partial),
      reset: () => set({
        title: 'Build faster with Next.js',
        description: 'The React Framework for the Web',
        icon: '⚡️',
        template: 'gradient',
      }),
    }),
    {
      name: 'og-generator-state',
      partialize: (state) => ({
        // Only persist content, not UI state
        title: state.title,
        description: state.description,
        icon: state.icon,
        template: state.template,
        backgroundColor: state.backgroundColor,
        textColor: state.textColor,
        accentColor: state.accentColor,
      }),
    }
  )
);
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Action                             │
│                    (type in input field)                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       store.set({ title })                       │
│                    (immediate state update)                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      useEffect dependency                        │
│                   (triggers debounced render)                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                          500ms delay
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        renderToBlob()                            │
│                  (async WASM rendering)                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    store.set({ previewUrl })                     │
│                   (update preview image)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Template System

### Template Interface

```typescript
// types/template.ts

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  defaultProps: {
    backgroundColor: string;
    textColor: string;
    accentColor: string;
  };
}

export interface TemplateProps {
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}
```

### Template Component Pattern

```typescript
// templates/gradient.tsx

export function GradientTemplate({
  title,
  description,
  icon,
  backgroundColor,
  textColor,
}: TemplateProps): React.ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${backgroundColor}, #1a1a2e)`,
        fontFamily: 'Inter',
      }}
    >
      <div style={{ fontSize: 80 }}>{icon}</div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: textColor,
          textAlign: 'center',
          marginTop: 20,
          padding: '0 60px',
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 28,
          color: textColor,
          opacity: 0.7,
          marginTop: 16,
          textAlign: 'center',
          padding: '0 80px',
        }}
      >
        {description}
      </div>
    </div>
  );
}
```

---

## Code Generation

### Next.js App Router Export

```typescript
// lib/code-gen.ts

export function generateNextJsCode(state: OGState): string {
  return `
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '${escapeString(state.title)}';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const interBold = await fetch(
    new URL('./Inter-Bold.ttf', import.meta.url)
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
          background: '${state.backgroundColor}',
          fontFamily: 'Inter',
        }}
      >
        <div style={{ fontSize: 80 }}>${state.icon}</div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: '${state.textColor}',
            textAlign: 'center',
            marginTop: 20,
            padding: '0 60px',
          }}
        >
          ${escapeString(state.title)}
        </div>
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
}
`.trim();
}

export function generateHtmlMeta(state: OGState): string {
  return `
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:title" content="${escapeHtml(state.title)}" />
<meta property="og:description" content="${escapeHtml(state.description)}" />
<meta property="og:image" content="https://yourdomain.com/opengraph-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(state.title)}" />
<meta name="twitter:description" content="${escapeHtml(state.description)}" />
<meta name="twitter:image" content="https://yourdomain.com/opengraph-image.png" />
`.trim();
}
```

---

## Edge Functions (Validator)

### URL Proxy with HTMLRewriter

```typescript
// functions/api/fetch-og.ts

interface OGMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

class OGExtractor {
  meta: OGMeta = {};

  element(element: Element) {
    const property = element.getAttribute('property');
    const content = element.getAttribute('content');
    const name = element.getAttribute('name');

    if (content) {
      // Open Graph tags
      if (property === 'og:title') this.meta.title = content;
      if (property === 'og:description') this.meta.description = content;
      if (property === 'og:image') this.meta.image = content;
      if (property === 'og:url') this.meta.url = content;
      if (property === 'og:type') this.meta.type = content;
      if (property === 'og:site_name') this.meta.siteName = content;

      // Twitter fallbacks
      if (name === 'twitter:title' && !this.meta.title) {
        this.meta.title = content;
      }
      if (name === 'twitter:description' && !this.meta.description) {
        this.meta.description = content;
      }
      if (name === 'twitter:image' && !this.meta.image) {
        this.meta.image = content;
      }
    }
  }
}

export async function onRequestGet(context: EventContext<any, any, any>) {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'URL required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'og-image.org Bot/1.0',
        'Accept': 'text/html',
      },
    });

    const extractor = new OGExtractor();
    const rewriter = new HTMLRewriter()
      .on('meta', extractor)
      .on('title', {
        text(text) {
          if (!extractor.meta.title) {
            extractor.meta.title = text.text;
          }
        },
      });

    await rewriter.transform(response).text();

    return new Response(JSON.stringify(extractor.meta), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch URL' }),
      { status: 500 }
    );
  }
}
```

---

## Debouncing Strategy

```typescript
// hooks/useDebounce.ts

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
```

---

## Memory Management

### Blob URL Cleanup

```typescript
// Proper cleanup pattern
useEffect(() => {
  let currentUrl: string | null = null;

  const render = async () => {
    const url = await renderToBlob(template);

    // Revoke previous URL to prevent memory leak
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }

    currentUrl = url;
    setPreviewUrl(url);
  };

  render();

  return () => {
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
  };
}, [dependencies]);
```

---

## Next Document

Continue to [FILE-STRUCTURE.md](./FILE-STRUCTURE.md) for project organization.
