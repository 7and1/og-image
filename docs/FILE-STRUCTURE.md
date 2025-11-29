# File Structure

> Complete project organization for og-image.org

---

## Directory Tree

```
og-image.org/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home - Generator UI
│   ├── globals.css              # Global styles + Tailwind
│   │
│   ├── validator/
│   │   └── page.tsx             # OG Tag Validator
│   │
│   ├── audit/
│   │   └── page.tsx             # Site-wide OG Auditor
│   │
│   ├── templates/
│   │   ├── page.tsx             # Template Gallery
│   │   └── [slug]/
│   │       └── page.tsx         # Individual template preview
│   │
│   └── docs/
│       ├── page.tsx             # Documentation index
│       └── [...slug]/
│           └── page.tsx         # MDX documentation pages
│
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Tabs.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Tooltip.tsx
│   │
│   ├── editor/                  # Generator editor components
│   │   ├── EditorPanel.tsx      # Left sidebar with controls
│   │   ├── TitleInput.tsx
│   │   ├── DescriptionInput.tsx
│   │   ├── IconPicker.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── TemplatePicker.tsx
│   │   └── GradientBuilder.tsx
│   │
│   ├── preview/                 # Preview area components
│   │   ├── PreviewCanvas.tsx    # Main preview container
│   │   ├── SocialPreview.tsx    # Twitter/LinkedIn/FB mock
│   │   ├── SizeIndicator.tsx    # Dimension display
│   │   └── LoadingOverlay.tsx
│   │
│   ├── export/                  # Export functionality
│   │   ├── CodeExport.tsx       # Code tabs (Next.js/HTML)
│   │   ├── DownloadButton.tsx
│   │   ├── CopyButton.tsx
│   │   └── CodeBlock.tsx        # Syntax highlighted code
│   │
│   ├── validator/               # Validator page components
│   │   ├── UrlInput.tsx
│   │   ├── MetaTagList.tsx
│   │   ├── SocialCardPreview.tsx
│   │   └── ValidationReport.tsx
│   │
│   └── layout/                  # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Navigation.tsx
│       └── ThemeToggle.tsx
│
├── lib/                         # Core utilities
│   ├── engine.ts               # Satori + Resvg WASM engine
│   ├── code-gen.ts             # Next.js/HTML code generator
│   ├── utils.ts                # General utilities (cn, etc.)
│   └── constants.ts            # App constants
│
├── templates/                   # OG image templates
│   ├── index.ts                # Template registry
│   ├── simple.tsx
│   ├── gradient.tsx
│   ├── modern.tsx
│   ├── minimal.tsx
│   ├── bold.tsx
│   └── types.ts                # Template type definitions
│
├── store/                       # Zustand state management
│   ├── useStore.ts             # Main store
│   └── slices/                 # Store slices (if needed)
│       ├── designSlice.ts
│       └── uiSlice.ts
│
├── hooks/                       # Custom React hooks
│   ├── useDebounce.ts
│   ├── useClipboard.ts
│   ├── useDownload.ts
│   └── useEngine.ts            # WASM engine hook
│
├── functions/                   # Cloudflare Pages Functions
│   └── api/
│       ├── fetch-og.ts         # OG tag fetcher (validator)
│       └── proxy-image.ts      # Image proxy for previews
│
├── public/                      # Static assets
│   ├── resvg.wasm              # WASM binary (CRITICAL)
│   ├── fonts/
│   │   ├── Inter-Bold.ttf
│   │   └── Inter-Regular.ttf
│   ├── _headers                # Cloudflare headers config
│   └── _redirects              # Cloudflare redirects (optional)
│
├── docs/                        # Implementation documentation
│   ├── MASTER-PLAN.md
│   ├── TECH-STACK.md
│   ├── ARCHITECTURE.md
│   ├── FILE-STRUCTURE.md       # This file
│   ├── ROADMAP.md
│   └── DEPLOYMENT.md
│
├── types/                       # TypeScript definitions
│   ├── template.ts
│   ├── store.ts
│   └── og-meta.ts
│
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
├── .gitignore
├── .env.example                # Environment variables template
└── README.md                   # Project README
```

---

## Key Files Explained

### `/app/layout.tsx`
Root layout with:
- Global metadata for SEO
- Font loading (Inter)
- Theme provider
- Analytics (if any)

### `/app/page.tsx`
The main generator page:
- Client component (`'use client'`)
- Imports EditorPanel and PreviewCanvas
- Orchestrates rendering via useEffect

### `/lib/engine.ts`
The heart of the application:
- Singleton WASM initialization
- Font buffer caching
- `renderToBlob()` function

### `/store/useStore.ts`
Central state management:
- All design properties
- UI state (loading, errors)
- Persistence configuration

### `/templates/*.tsx`
Each template is a function returning JSX:
- Must use inline styles (Satori requirement)
- No external CSS classes
- Flexbox layout only

### `/public/_headers`
Cloudflare-specific headers:
```
/resvg.wasm
  Content-Type: application/wasm
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

### `/functions/api/fetch-og.ts`
Edge function for validator:
- Fetches external URLs
- Parses OG tags with HTMLRewriter
- Returns JSON response

---

## Component Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Page | `page.tsx` | `app/validator/page.tsx` |
| Layout | `layout.tsx` | `app/layout.tsx` |
| Component | PascalCase | `EditorPanel.tsx` |
| Hook | camelCase with `use` | `useDebounce.ts` |
| Utility | camelCase | `code-gen.ts` |
| Type | PascalCase | `TemplateConfig` |
| Constant | SCREAMING_SNAKE | `MAX_TITLE_LENGTH` |

---

## Import Aliases

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/store/*": ["store/*"],
      "@/hooks/*": ["hooks/*"],
      "@/templates/*": ["templates/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

Usage:
```typescript
import { useStore } from '@/store/useStore';
import { renderToBlob } from '@/lib/engine';
import { Button } from '@/components/ui/Button';
```

---

## Next Document

Continue to [ROADMAP.md](./ROADMAP.md) for implementation phases.
