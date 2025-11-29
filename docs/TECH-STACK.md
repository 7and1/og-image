# Technology Stack

> Complete technical specification for og-image.org

---

## Framework & Build

### Next.js 14+ (App Router)

**Version:** `^14.0.0`

**Configuration:**
```javascript
// next.config.js
const nextConfig = {
  output: 'export',           // Static HTML export for Cloudflare
  images: { unoptimized: true }, // Disable server image optimization
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};
```

**Why App Router:**
- Server Components for SEO pages
- Client Components for interactive generator
- Built-in metadata API
- Improved performance with RSC

---

## Styling

### Tailwind CSS v3.4+

**Key utilities:**
- `clsx` - Conditional class names
- `tailwind-merge` - Merge conflicting classes

**Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Linear/Vercel-style palette
        neutral: {
          950: '#0a0a0a',
          900: '#171717',
          800: '#262626',
          700: '#404040',
        }
      }
    }
  }
}
```

### lucide-react

**Version:** `^0.300.0`

Icon library for UI elements (download, copy, settings icons).

---

## State Management

### Zustand v4+

**Store structure:**
```typescript
interface OGStore {
  // Design state
  title: string;
  description: string;
  template: TemplateId;
  themeColor: string;
  icon: string;

  // UI state
  isGenerating: boolean;
  previewUrl: string | null;

  // Actions
  set: (partial: Partial<OGStore>) => void;
  reset: () => void;
}
```

**Why Zustand:**
- No Provider wrapper needed
- Minimal API surface
- Built-in devtools
- TypeScript-first

---

## Core Rendering Engine

### Satori

**Version:** `^0.10.0`

**Purpose:** Convert React elements to SVG

**Supported CSS:**
- Flexbox layout (full support)
- Basic text styling
- Backgrounds & gradients
- Borders & border-radius
- Box shadows

**Limitations:**
- No CSS Grid
- No pseudo-elements
- No animations
- Limited font support (must provide buffers)

### @resvg/resvg-js

**Version:** `^2.6.0`

**Purpose:** Convert SVG to PNG using WASM

**Configuration:**
```typescript
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    loadSystemFonts: false, // Use provided fonts only
  },
});
```

**Critical Files (must be in /public):**
- `resvg.wasm` - WASM binary (~2.5MB)
- `fonts/Inter-Bold.ttf` - Primary font

---

## Color Picker

### react-colorful

**Version:** `^5.6.0`

**Why this library:**
- Zero dependencies
- ~2KB bundle
- Accessible
- Touch-friendly

**Usage:**
```tsx
import { HexColorPicker } from 'react-colorful';

<HexColorPicker color={color} onChange={setColor} />
```

---

## Backend (Edge Functions)

### Cloudflare Pages Functions

**Location:** `/functions/api/*.ts`

**Used for:**
1. **Validator proxy** - Fetch external URLs with proper headers
2. **OG tag parser** - Extract meta tags using HTMLRewriter

**HTMLRewriter pattern:**
```typescript
// Extracting OG tags at the edge
class OGMetaHandler {
  meta: Record<string, string> = {};

  element(element: Element) {
    const property = element.getAttribute('property');
    const content = element.getAttribute('content');
    if (property?.startsWith('og:') && content) {
      this.meta[property] = content;
    }
  }
}
```

---

## Development Tools

### TypeScript

**Version:** `^5.0.0`

**Strict mode enabled:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### ESLint + Prettier

Standard Next.js ESLint config with Prettier integration.

---

## Dependencies Summary

### Production
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "satori": "^0.10.0",
    "@resvg/resvg-js": "^2.6.0",
    "zustand": "^4.4.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "react-colorful": "^5.6.0"
  }
}
```

### Development
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | Full support |
| Firefox | 90+ | Full support |
| Safari | 15+ | Full support |
| Edge | 90+ | Full support |

**Requirements:**
- WebAssembly support
- ES2020 features
- Fetch API
- Blob API

---

## Performance Budget

| Metric | Target | Notes |
|--------|--------|-------|
| JS Bundle | < 200KB | Gzipped |
| WASM | ~2.5MB | Lazy loaded |
| Fonts | ~100KB | Single weight |
| FCP | < 1.5s | First paint |
| TTI | < 3s | Interactive |

---

## Next Document

Continue to [ARCHITECTURE.md](./ARCHITECTURE.md) for system design details.
