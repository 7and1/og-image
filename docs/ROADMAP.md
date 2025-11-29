# Implementation Roadmap

> Step-by-step implementation guide for og-image.org

---

## Phase Overview

| Phase | Name | Status | Priority |
|-------|------|--------|----------|
| 0 | Project Setup | Pending | Critical |
| 1 | Core Generator | Pending | Critical |
| 2 | Templates & Export | Pending | High |
| 3 | Validator | Pending | Medium |
| 4 | Site Auditor | Pending | Low |
| 5 | Documentation | Pending | Medium |

---

## Phase 0: Project Setup

### Tasks

#### 0.1 Initialize Next.js Project
```bash
npx create-next-app@latest og-image.org --typescript --tailwind --eslint --app
cd og-image.org
```

#### 0.2 Install Dependencies
```bash
# Core
npm install satori @resvg/resvg-js zustand

# UI
npm install lucide-react clsx tailwind-merge react-colorful

# Dev
npm install -D @types/node @types/react
```

#### 0.3 Configure next.config.js
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

#### 0.4 Setup Static Assets
- [ ] Download `resvg.wasm` from node_modules or GitHub releases
- [ ] Download Inter font (Bold weight)
- [ ] Create `/public/_headers` for Cloudflare

#### 0.5 Configure Tailwind
```javascript
// tailwind.config.js
module.exports = {
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
    },
  },
};
```

#### 0.6 Setup TypeScript Aliases
Add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Deliverables
- [ ] Clean Next.js project structure
- [ ] All dependencies installed
- [ ] Static assets in place
- [ ] Build succeeds with `npm run build`

---

## Phase 1: Core Generator

### 1.1 Create Engine (`lib/engine.ts`)

**Priority:** Critical

```typescript
// Singleton WASM engine
export async function renderToBlob(node: React.ReactNode): Promise<string>
```

**Acceptance Criteria:**
- [ ] WASM initializes without errors
- [ ] Font loads correctly
- [ ] Returns valid PNG blob URL
- [ ] Handles errors gracefully

### 1.2 Create Store (`store/useStore.ts`)

**Priority:** Critical

```typescript
interface OGState {
  title: string;
  description: string;
  icon: string;
  template: TemplateId;
  backgroundColor: string;
  textColor: string;
  // ...
}
```

**Acceptance Criteria:**
- [ ] State updates trigger re-renders
- [ ] Persistence works (localStorage)
- [ ] Reset function works

### 1.3 Create First Template (`templates/gradient.tsx`)

**Priority:** Critical

```typescript
export function GradientTemplate(props: TemplateProps): React.ReactElement
```

**Acceptance Criteria:**
- [ ] Renders in Satori without errors
- [ ] Text wraps correctly
- [ ] Colors apply correctly
- [ ] Emoji renders

### 1.4 Build Editor Panel (`components/editor/EditorPanel.tsx`)

**Priority:** High

Components needed:
- [ ] TitleInput
- [ ] DescriptionInput
- [ ] IconPicker (text input for emoji)
- [ ] ColorPicker (using react-colorful)
- [ ] TemplatePicker (buttons/cards)

### 1.5 Build Preview Canvas (`components/preview/PreviewCanvas.tsx`)

**Priority:** High

Features:
- [ ] Displays rendered PNG
- [ ] Shows loading state
- [ ] Displays dimensions (1200×630)
- [ ] Debounced rendering (500ms)

### 1.6 Assemble Main Page (`app/page.tsx`)

**Priority:** High

Layout:
```
┌─────────────────────────────────────────────┐
│  Header (Logo + Nav)                        │
├───────────────┬─────────────────────────────┤
│               │                             │
│   Editor      │        Preview              │
│   Panel       │        Canvas               │
│   (400px)     │        (flex)               │
│               │                             │
├───────────────┴─────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

### Deliverables
- [ ] Working generator UI
- [ ] Real-time preview
- [ ] At least 1 template
- [ ] Debounced rendering

---

## Phase 2: Templates & Export

### 2.1 Add More Templates

Templates to create:
- [ ] `simple.tsx` - Solid color background
- [ ] `modern.tsx` - Split layout with accent
- [ ] `minimal.tsx` - Clean, lots of whitespace
- [ ] `bold.tsx` - Large text, high contrast

### 2.2 Template Gallery UI

**Location:** `components/editor/TemplatePicker.tsx`

Features:
- [ ] Grid of template thumbnails
- [ ] Active state indicator
- [ ] Preview on hover (optional)

### 2.3 Code Export (`lib/code-gen.ts`)

Functions to implement:
- [ ] `generateNextJsCode(state)` - App Router format
- [ ] `generateHtmlMeta(state)` - Standard meta tags
- [ ] `generateVercelOgCode(state)` - Vercel OG format

### 2.4 Export UI (`components/export/CodeExport.tsx`)

Features:
- [ ] Tabs: Next.js / HTML / Vercel OG
- [ ] Syntax highlighted code
- [ ] Copy button with feedback
- [ ] Download PNG button

### 2.5 Download Functionality (`hooks/useDownload.ts`)

```typescript
function downloadPng(blobUrl: string, filename: string): void
```

### Deliverables
- [ ] 5+ templates available
- [ ] Code export working (all formats)
- [ ] PNG download working
- [ ] Copy to clipboard working

---

## Phase 3: Validator

### 3.1 Edge Function (`functions/api/fetch-og.ts`)

Features:
- [ ] Accept URL parameter
- [ ] Fetch with proper User-Agent
- [ ] Parse with HTMLRewriter
- [ ] Extract og:* and twitter:* tags
- [ ] Return JSON response
- [ ] Cache responses (1 hour)

### 3.2 Validator Page (`app/validator/page.tsx`)

Features:
- [ ] URL input field
- [ ] Fetch button / auto-fetch on Enter
- [ ] Display all OG tags found
- [ ] Show missing required tags as warnings

### 3.3 Social Card Previews

Simulate how cards appear on:
- [ ] Twitter (summary_large_image)
- [ ] LinkedIn
- [ ] Facebook
- [ ] Discord (optional)
- [ ] Slack (optional)

### 3.4 Validation Report

Score based on:
- [ ] Required tags present (og:title, og:image)
- [ ] Image dimensions correct (1200×630)
- [ ] Description length (optimal: 55-200 chars)
- [ ] Image file size (warn if > 1MB)

### Deliverables
- [ ] Working URL validator
- [ ] Social card previews
- [ ] Validation scoring
- [ ] Edge function deployed

---

## Phase 4: Site Auditor

### 4.1 Sitemap Parser

Features:
- [ ] Accept sitemap.xml URL
- [ ] Parse XML and extract URLs
- [ ] Handle sitemap index files
- [ ] Limit to 100 URLs per audit

### 4.2 Concurrent Crawler

Using asyncPool pattern:
```typescript
async function asyncPool<T>(
  poolLimit: number,
  items: T[],
  iteratorFn: (item: T) => Promise<any>
): Promise<any[]>
```

Features:
- [ ] Concurrent limit: 5 requests
- [ ] Progress indicator
- [ ] Error handling per URL

### 4.3 Audit Results UI

Features:
- [ ] Table of all URLs
- [ ] Status column (pass/warn/fail)
- [ ] Expandable details
- [ ] Sort by status

### 4.4 Export Report

Formats:
- [ ] CSV download
- [ ] JSON download
- [ ] PDF (optional, complex)

### Deliverables
- [ ] Working site auditor
- [ ] Concurrent crawling
- [ ] Export functionality

---

## Phase 5: Documentation

### 5.1 Documentation Pages

Pages to create:
- [ ] `/docs` - Overview
- [ ] `/docs/getting-started` - Quick start guide
- [ ] `/docs/templates` - Template customization
- [ ] `/docs/api` - Query parameter API
- [ ] `/docs/best-practices` - OG image guidelines

### 5.2 SEO Content

Target keywords:
- "open graph image generator"
- "og image maker"
- "social media preview"
- "twitter card generator"
- "linkedin preview image"

### 5.3 API Documentation

Document query parameter API:
```
/templates/gradient?title=Hello&icon=🚀&bg=%23000000
```

### Deliverables
- [ ] Complete documentation
- [ ] SEO-optimized content
- [ ] API reference

---

## Quality Checklist

### Before Each Phase Completion

- [ ] All TypeScript errors resolved
- [ ] No console errors in browser
- [ ] Responsive design tested
- [ ] Dark mode tested
- [ ] Build succeeds (`npm run build`)
- [ ] Lighthouse score > 90

### Before Production

- [ ] Security review (no API keys exposed)
- [ ] Performance audit
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Error boundaries in place
- [ ] Analytics configured (optional)

---

## Next Document

Continue to [DEPLOYMENT.md](./DEPLOYMENT.md) for Cloudflare setup.
