# Development Sequence

> Optimal order of implementation with dependencies and checkpoints

---

## Overview

This document defines the **exact order** of development to minimize rework and ensure each step has its prerequisites in place.

### Key Principles

1. **Foundation First** - Setup and infrastructure before features
2. **Core Before Edge** - Main functionality before edge cases
3. **Vertical Slices** - Complete one feature end-to-end before starting next
4. **Test as You Go** - Verify each step works before moving on

---

## Phase 0: Project Foundation (Day 1)

### Step 0.1: Initialize Project

```bash
# Create Next.js project
npx create-next-app@latest og-image.org \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd og-image.org
```

**Checkpoint:** `npm run dev` shows default Next.js page

### Step 0.2: Install Dependencies

```bash
# Core rendering
npm install satori @resvg/resvg-js

# State management
npm install zustand

# UI utilities
npm install lucide-react clsx tailwind-merge react-colorful

# Types (already included, but ensure latest)
npm install -D @types/node @types/react
```

**Checkpoint:** `npm run build` succeeds

### Step 0.3: Configure next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
```

**Checkpoint:** `npm run build` outputs to `/out` directory

### Step 0.4: Setup Static Assets

1. **Download WASM file:**
   ```bash
   # Copy from node_modules
   cp node_modules/@resvg/resvg-js/resvg.wasm public/
   ```

2. **Download Inter font:**
   ```bash
   mkdir -p public/fonts
   # Download from Google Fonts or Inter website
   # Place Inter-Bold.ttf in public/fonts/
   ```

3. **Create `public/_headers`:**
   ```
   /resvg.wasm
     Content-Type: application/wasm
     Cache-Control: public, max-age=31536000, immutable

   /fonts/*
     Cache-Control: public, max-age=31536000, immutable
   ```

**Checkpoint:** Files exist at:
- `/public/resvg.wasm` (~2.5MB)
- `/public/fonts/Inter-Bold.ttf` (~100KB)
- `/public/_headers`

### Step 0.5: Setup Tailwind Theme

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

**Checkpoint:** Tailwind styles apply correctly

### Step 0.6: Setup TypeScript Paths

```json
// tsconfig.json (add to compilerOptions)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Checkpoint:** Import `@/lib/something` works

---

## Phase 1: Core Engine (Day 1-2)

### Step 1.1: Create Utility Functions

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Step 1.2: Create WASM Engine

```typescript
// lib/engine.ts
import satori from 'satori';
import { initWasm, Resvg } from '@resvg/resvg-js';

let wasmInitialized = false;
let fontBuffer: ArrayBuffer | null = null;

async function ensureInitialized() {
  if (!wasmInitialized) {
    await initWasm(fetch('/resvg.wasm'));
    wasmInitialized = true;
  }

  if (!fontBuffer) {
    fontBuffer = await fetch('/fonts/Inter-Bold.ttf')
      .then((res) => res.arrayBuffer());
  }
}

export async function renderToBlob(
  node: React.ReactNode
): Promise<string> {
  await ensureInitialized();

  // React → SVG
  const svg = await satori(node, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: fontBuffer!,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  // SVG → PNG
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // PNG → Blob URL
  return URL.createObjectURL(
    new Blob([pngBuffer], { type: 'image/png' })
  );
}
```

**Checkpoint:** Create a test page that calls `renderToBlob()` and displays result

### Step 1.3: Create Test Page

```typescript
// app/test/page.tsx (temporary)
'use client';

import { useState } from 'react';
import { renderToBlob } from '@/lib/engine';

export default function TestPage() {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const test = async () => {
    setLoading(true);
    try {
      const result = await renderToBlob(
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            fontSize: 64,
            fontFamily: 'Inter',
          }}
        >
          Hello World
        </div>
      );
      setUrl(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <button onClick={test} disabled={loading}>
        {loading ? 'Rendering...' : 'Test Render'}
      </button>
      {url && <img src={url} alt="Test" className="mt-4 border" />}
    </div>
  );
}
```

**Checkpoint:** Click button, see rendered image (1200×630)

---

## Phase 2: State & Store (Day 2)

### Step 2.1: Create Zustand Store

```typescript
// store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type TemplateId = 'gradient' | 'minimal' | 'modern' | 'bold';

interface OGState {
  title: string;
  description: string;
  icon: string;
  template: TemplateId;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  isGenerating: boolean;
  previewUrl: string | null;

  set: (partial: Partial<OGState>) => void;
  reset: () => void;
}

const defaults = {
  title: 'Build faster with Next.js',
  description: 'The React Framework for Production',
  icon: '⚡',
  template: 'gradient' as TemplateId,
  backgroundColor: '#000000',
  textColor: '#ffffff',
  accentColor: '#3b82f6',
  isGenerating: false,
  previewUrl: null,
};

export const useStore = create<OGState>()(
  persist(
    (set) => ({
      ...defaults,
      set: (partial) => set(partial),
      reset: () => set(defaults),
    }),
    {
      name: 'og-store',
      partialize: (state) => ({
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

**Checkpoint:** Store values persist across page refreshes

---

## Phase 3: First Template (Day 2)

### Step 3.1: Create Template Types

```typescript
// templates/types.ts
export interface TemplateProps {
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}
```

### Step 3.2: Create Gradient Template

```typescript
// templates/gradient.tsx
import { TemplateProps } from './types';

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
        background: backgroundColor.includes('gradient')
          ? backgroundColor
          : `linear-gradient(135deg, ${backgroundColor}, #1a1a2e)`,
        fontFamily: 'Inter',
        padding: 60,
      }}
    >
      <div style={{ fontSize: 72, marginBottom: 24 }}>{icon}</div>
      <div
        style={{
          fontSize: title.length > 40 ? 48 : 56,
          fontWeight: 700,
          color: textColor,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>
      {description && (
        <div
          style={{
            fontSize: 28,
            color: textColor,
            opacity: 0.8,
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
```

### Step 3.3: Create Template Registry

```typescript
// templates/index.ts
import { GradientTemplate } from './gradient';
import { TemplateProps } from './types';
import { TemplateId } from '@/store/useStore';

export const templates: Record<
  TemplateId,
  React.FC<TemplateProps>
> = {
  gradient: GradientTemplate,
  minimal: GradientTemplate, // Placeholder
  modern: GradientTemplate,  // Placeholder
  bold: GradientTemplate,    // Placeholder
};

export function getTemplate(id: TemplateId) {
  return templates[id] || templates.gradient;
}
```

**Checkpoint:** Template renders correctly in test page

---

## Phase 4: UI Components (Day 2-3)

### Step 4.1: Create Base UI Components

Create these in order (each builds on previous):

```
components/ui/
├── Button.tsx      # Basic button with variants
├── Input.tsx       # Text input with label
├── Textarea.tsx    # Multi-line input
└── Card.tsx        # Container component
```

### Step 4.2: Create Editor Components

```
components/editor/
├── EditorPanel.tsx      # Container for all editors
├── TitleInput.tsx       # Title text input
├── DescriptionInput.tsx # Description textarea
├── IconPicker.tsx       # Emoji/text input
└── ColorPicker.tsx      # Color selection
```

### Step 4.3: Create Preview Components

```
components/preview/
├── PreviewCanvas.tsx    # Main preview display
├── LoadingOverlay.tsx   # Loading spinner
└── DimensionBadge.tsx   # Size indicator
```

**Checkpoint:** All components render without errors

---

## Phase 5: Main Generator Page (Day 3)

### Step 5.1: Create Layout

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OG Image Generator - Create Open Graph Images',
  description: 'Free, open-source Open Graph image generator. Create beautiful social media preview images.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-neutral-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
```

### Step 5.2: Create Home Page

```typescript
// app/page.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { getTemplate } from '@/templates';
import { renderToBlob } from '@/lib/engine';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { PreviewCanvas } from '@/components/preview/PreviewCanvas';

export default function Home() {
  const state = useStore();
  const { title, description, icon, template, backgroundColor, textColor, accentColor } = state;

  // Memoize template element
  const templateElement = useMemo(() => {
    const Template = getTemplate(template);
    return (
      <Template
        title={title}
        description={description}
        icon={icon}
        backgroundColor={backgroundColor}
        textColor={textColor}
        accentColor={accentColor}
      />
    );
  }, [title, description, icon, template, backgroundColor, textColor, accentColor]);

  // Debounced render
  useEffect(() => {
    state.set({ isGenerating: true });

    const timer = setTimeout(async () => {
      try {
        const url = await renderToBlob(templateElement);
        state.set({ previewUrl: url, isGenerating: false });
      } catch (error) {
        console.error('Render failed:', error);
        state.set({ isGenerating: false });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [templateElement]);

  return (
    <div className="flex min-h-screen">
      <EditorPanel />
      <PreviewCanvas />
    </div>
  );
}
```

**Checkpoint:** Full generator works - edit inputs, see preview update

---

## Phase 6: Export Features (Day 3-4)

### Step 6.1: Code Generation

```typescript
// lib/code-gen.ts
// (See FINAL-IMPLEMENTATION.md for full code)
```

### Step 6.2: Export Components

```
components/export/
├── CodeExport.tsx    # Tabbed code display
├── CodeBlock.tsx     # Syntax highlighting
├── DownloadButton.tsx
└── CopyButton.tsx
```

### Step 6.3: Integrate into Page

Add export section below preview canvas.

**Checkpoint:** Download PNG and copy code work correctly

---

## Phase 7: Additional Templates (Day 4)

### Step 7.1: Create Remaining Templates

```
templates/
├── gradient.tsx  ✓ (done)
├── minimal.tsx
├── modern.tsx
├── bold.tsx
├── split.tsx
├── glass.tsx
├── startup.tsx
└── blog.tsx
```

### Step 7.2: Template Picker UI

Create visual template selector in EditorPanel.

**Checkpoint:** All 8 templates work and can be selected

---

## Phase 8: Templates Page (Day 4-5)

### Step 8.1: Template Gallery

```typescript
// app/templates/page.tsx
```

### Step 8.2: Individual Template Pages

```typescript
// app/templates/[slug]/page.tsx
```

**Checkpoint:** `/templates` shows gallery, clicking opens customizer

---

## Phase 9: Validator (Day 5)

### Step 9.1: Edge Function

```typescript
// functions/api/parse.ts
```

### Step 9.2: Validator Hook

```typescript
// hooks/useValidator.ts
```

### Step 9.3: Validator Page

```typescript
// app/validator/page.tsx
```

**Checkpoint:** Enter URL, see OG tags and social previews

---

## Phase 10: Meta Tags Page (Day 5-6)

### Step 10.1: Meta Tags Form

```typescript
// app/meta-tags/page.tsx
```

**Checkpoint:** Input fields generate HTML meta tags

---

## Phase 11: Audit Page (Day 6)

### Step 11.1: Async Pool Utility

```typescript
// lib/async-pool.ts
```

### Step 11.2: Audit Page

```typescript
// app/audit/page.tsx
```

**Checkpoint:** Enter domain, see concurrent audit progress

---

## Phase 12: Polish & Deploy (Day 6-7)

### Step 12.1: Responsive Design

- Test all pages on mobile
- Add hamburger menu for mobile nav
- Ensure touch-friendly controls

### Step 12.2: Error Handling

- Add error boundaries
- Add toast notifications
- Handle edge cases

### Step 12.3: SEO

- Add metadata to all pages
- Create sitemap.xml
- Add robots.txt

### Step 12.4: Deploy

```bash
# Build
npm run build

# Test locally
npx serve out

# Deploy to Cloudflare Pages
# (via Git push to connected repo)
```

**Final Checkpoint:** Site live at og-image.org

---

## Dependency Graph

```
Phase 0 (Setup)
    │
    ▼
Phase 1 (Engine) ──────────────────┐
    │                              │
    ▼                              │
Phase 2 (Store)                    │
    │                              │
    ▼                              │
Phase 3 (Template)                 │
    │                              │
    ▼                              │
Phase 4 (Components)               │
    │                              │
    ▼                              │
Phase 5 (Home Page) ◄──────────────┘
    │
    ├──────────────┬──────────────┐
    ▼              ▼              ▼
Phase 6        Phase 7        Phase 8
(Export)     (Templates)    (Gallery)
    │              │              │
    └──────────────┴──────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
Phase 9       Phase 10       Phase 11
(Validator)  (Meta Tags)    (Audit)
    │              │              │
    └──────────────┴──────────────┘
                   │
                   ▼
              Phase 12
              (Deploy)
```

---

## Time Estimates

| Phase | Description | Estimate |
|-------|-------------|----------|
| 0 | Project Setup | 2 hours |
| 1 | Core Engine | 3 hours |
| 2 | State & Store | 1 hour |
| 3 | First Template | 2 hours |
| 4 | UI Components | 4 hours |
| 5 | Main Generator | 3 hours |
| 6 | Export Features | 3 hours |
| 7 | More Templates | 4 hours |
| 8 | Templates Page | 3 hours |
| 9 | Validator | 4 hours |
| 10 | Meta Tags | 2 hours |
| 11 | Audit | 4 hours |
| 12 | Polish & Deploy | 4 hours |
| **Total** | | **~39 hours** |

---

## Next Document

See [RISKS.md](./RISKS.md) for potential issues and solutions.
