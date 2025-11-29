# Risk Analysis & Mitigation

> Potential issues and proven solutions for og-image.org

---

## Overview

This document catalogues known risks, their likelihood, impact, and mitigation strategies.

---

## Category 1: WASM & Rendering Issues

### Risk 1.1: WASM Fails to Load

**Likelihood:** High (if not configured correctly)
**Impact:** Critical (entire app broken)

**Symptoms:**
- Console error: `Failed to fetch resvg.wasm`
- Console error: `WebAssembly.instantiate(): Incorrect response MIME type`
- Preview stays blank or shows "Initializing..."

**Root Causes:**
1. WASM file missing from `/public`
2. Incorrect `Content-Type` header
3. CORS issues in development

**Solutions:**

```bash
# 1. Verify WASM file exists
ls -la public/resvg.wasm
# Should be ~2.5MB

# 2. Ensure _headers file is correct
cat public/_headers
# Must include:
# /resvg.wasm
#   Content-Type: application/wasm
```

```typescript
// 3. Add error handling in engine.ts
try {
  await initWasm(fetch('/resvg.wasm'));
} catch (error) {
  console.error('WASM init failed:', error);
  // Show user-friendly error
  throw new Error('Failed to initialize image engine. Please refresh.');
}
```

### Risk 1.2: Font Loading Fails

**Likelihood:** Medium
**Impact:** High (text renders in fallback font)

**Symptoms:**
- Text appears in system font instead of Inter
- Console error: `Failed to fetch Inter-Bold.ttf`

**Solutions:**

```typescript
// Verify font path
const fontPath = '/fonts/Inter-Bold.ttf';
const response = await fetch(fontPath);
if (!response.ok) {
  throw new Error(`Font not found: ${response.status}`);
}

// Add fallback font
const fonts = [
  {
    name: 'Inter',
    data: fontBuffer,
    weight: 700,
    style: 'normal',
  },
];
// Satori will use this font, or fall back to system default
```

### Risk 1.3: Satori CSS Limitations

**Likelihood:** High (during development)
**Impact:** Medium (visual bugs)

**Symptoms:**
- Layout doesn't match expectation
- Styles ignored
- Console warnings from Satori

**Unsupported CSS:**
- CSS Grid (use Flexbox instead)
- Pseudo-elements (::before, ::after)
- CSS variables
- Complex gradients
- Animations

**Solutions:**

```typescript
// BAD - CSS Grid
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

// GOOD - Flexbox
<div style={{ display: 'flex', flexDirection: 'row' }}>
  <div style={{ flex: 1 }}>
  <div style={{ flex: 1 }}>
</div>

// BAD - Complex gradient
<div style={{ background: 'conic-gradient(...)' }}>

// GOOD - Linear gradient
<div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
```

### Risk 1.4: Memory Leaks from Blob URLs

**Likelihood:** High (if not handled)
**Impact:** Medium (performance degradation)

**Symptoms:**
- Browser memory usage grows over time
- Tab becomes slow after many renders
- Browser crashes on low-memory devices

**Solution:**

```typescript
// Track and revoke previous URLs
const previousUrlRef = useRef<string | null>(null);

useEffect(() => {
  const render = async () => {
    const newUrl = await renderToBlob(template);

    // CRITICAL: Revoke old URL before setting new one
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
    }

    previousUrlRef.current = newUrl;
    setPreviewUrl(newUrl);
  };

  render();

  // Cleanup on unmount
  return () => {
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
    }
  };
}, [dependencies]);
```

---

## Category 2: Performance Issues

### Risk 2.1: UI Jank During Render

**Likelihood:** High (without debouncing)
**Impact:** Medium (poor UX)

**Symptoms:**
- Input lag when typing
- Preview flashes rapidly
- Browser becomes unresponsive

**Solution:**

```typescript
// Debounce renders by 500ms
useEffect(() => {
  const timer = setTimeout(async () => {
    setIsGenerating(true);
    const url = await renderToBlob(template);
    setPreviewUrl(url);
    setIsGenerating(false);
  }, 500); // Wait 500ms after last change

  return () => clearTimeout(timer);
}, [title, description, icon, /* other deps */]);
```

### Risk 2.2: Long Initial Load Time

**Likelihood:** Medium
**Impact:** Medium (user bounces)

**Symptoms:**
- White screen for 2-3 seconds
- WASM takes time to download
- First render is slow

**Solutions:**

```typescript
// 1. Lazy load WASM engine
const initEngine = async () => {
  // Show loading UI while initializing
  setIsInitializing(true);

  // WASM loads in background
  await import('@/lib/engine');

  setIsInitializing(false);
};

// 2. Preload hint in HTML
<link rel="preload" href="/resvg.wasm" as="fetch" crossorigin />

// 3. Show skeleton UI while loading
{isInitializing ? <PreviewSkeleton /> : <PreviewCanvas />}
```

### Risk 2.3: Large Bundle Size

**Likelihood:** Low (with proper config)
**Impact:** Medium (slow load)

**Solutions:**

```typescript
// 1. Dynamic imports for heavy components
const ColorPicker = dynamic(
  () => import('@/components/editor/ColorPicker'),
  { ssr: false }
);

// 2. Tree-shake unused icons
// BAD
import * as Icons from 'lucide-react';

// GOOD
import { Download, Copy, Check } from 'lucide-react';
```

---

## Category 3: State Management Issues

### Risk 3.1: State Not Persisting

**Likelihood:** Low
**Impact:** Low (user loses work)

**Symptoms:**
- Design resets on page refresh
- Template selections don't save

**Solution:**

```typescript
// Verify persist middleware is working
const useStore = create<State>()(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'og-store', // localStorage key
      // Verify this is being set
      onRehydrateStorage: () => {
        console.log('Hydrating state...');
        return (state) => {
          console.log('State hydrated:', state);
        };
      },
    }
  )
);
```

### Risk 3.2: Unnecessary Re-renders

**Likelihood:** Medium
**Impact:** Low (performance)

**Solution:**

```typescript
// Use shallow comparison for selectors
import { shallow } from 'zustand/shallow';

// BAD - re-renders on any state change
const state = useStore();

// GOOD - only re-renders when these values change
const { title, description } = useStore(
  (state) => ({
    title: state.title,
    description: state.description,
  }),
  shallow
);
```

---

## Category 4: Edge Function Issues

### Risk 4.1: CORS Errors

**Likelihood:** Medium
**Impact:** High (validator broken)

**Symptoms:**
- Console error: `Access-Control-Allow-Origin`
- Fetch requests fail
- Validator shows "Failed to fetch"

**Solution:**

```typescript
// functions/api/parse.ts
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
});

// Handle OPTIONS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
```

### Risk 4.2: Target URL Blocks Requests

**Likelihood:** High
**Impact:** Medium (some URLs fail)

**Symptoms:**
- Validator returns 403 or 429
- "Failed to fetch" for certain sites
- Works for some URLs, not others

**Solutions:**

```typescript
// 1. Use realistic User-Agent
const response = await fetch(targetUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; og-image.org/1.0; +https://og-image.org/bot)',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-US,en;q=0.9',
  },
});

// 2. Handle errors gracefully
if (!response.ok) {
  return Response.json({
    success: false,
    error: `Site returned ${response.status}. This site may block automated requests.`,
  });
}

// 3. Add rate limiting info
if (response.status === 429) {
  return Response.json({
    success: false,
    error: 'Rate limited. Please wait a moment and try again.',
  });
}
```

### Risk 4.3: HTMLRewriter Missing Tags

**Likelihood:** Low
**Impact:** Medium (incomplete data)

**Symptoms:**
- Some OG tags not appearing
- Title missing
- Image URL incorrect

**Solutions:**

```typescript
// Handle multiple meta tag formats
class MetaExtractor {
  element(element: Element) {
    const property = element.getAttribute('property');
    const name = element.getAttribute('name');
    const content = element.getAttribute('content');

    // Open Graph
    if (property?.startsWith('og:')) {
      this.meta[property] = content;
    }

    // Twitter
    if (name?.startsWith('twitter:')) {
      this.meta[name] = content;
    }

    // Also check for itemprop (Schema.org)
    const itemprop = element.getAttribute('itemprop');
    if (itemprop === 'image' && content) {
      this.meta['schema:image'] = content;
    }
  }
}
```

---

## Category 5: Deployment Issues

### Risk 5.1: Build Fails on Cloudflare

**Likelihood:** Medium
**Impact:** Critical (can't deploy)

**Symptoms:**
- Build error in Cloudflare dashboard
- "Cannot find module" errors
- TypeScript errors

**Solutions:**

```bash
# 1. Always test build locally first
npm run build

# 2. Check Node version matches
# In Cloudflare dashboard, set:
NODE_VERSION=18

# 3. Ensure all dependencies are in package.json
npm install # Don't use --save-dev for required deps
```

### Risk 5.2: Static Export Issues

**Likelihood:** Low
**Impact:** High (pages missing)

**Symptoms:**
- Some pages return 404
- Dynamic routes broken
- Images not loading

**Solutions:**

```typescript
// 1. Ensure static export is configured
// next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true },
};

// 2. For dynamic routes, use generateStaticParams
// app/templates/[slug]/page.tsx
export function generateStaticParams() {
  return [
    { slug: 'gradient' },
    { slug: 'minimal' },
    // ... all template slugs
  ];
}
```

### Risk 5.3: Functions Not Deploying

**Likelihood:** Medium
**Impact:** High (validator broken)

**Symptoms:**
- `/api/parse` returns 404
- Functions directory ignored

**Solutions:**

```
# 1. Verify directory structure
functions/
└── api/
    └── parse.ts  # Must be .ts, not .js

# 2. Verify export format
// CORRECT
export const onRequestGet: PagesFunction = async (context) => { }

// INCORRECT
export default async function handler() { }

# 3. Check Cloudflare Pages settings
# Functions directory: functions
```

---

## Category 6: Browser Compatibility

### Risk 6.1: Safari WASM Issues

**Likelihood:** Low
**Impact:** Medium (Safari users affected)

**Symptoms:**
- Works in Chrome, fails in Safari
- WASM initialization hangs

**Solution:**

```typescript
// Add Safari-specific handling
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
  // Safari needs explicit CORS mode
  await initWasm(fetch('/resvg.wasm', { mode: 'cors' }));
}
```

### Risk 6.2: Mobile Performance

**Likelihood:** Medium
**Impact:** Medium (slow on mobile)

**Symptoms:**
- Rendering takes 3-5 seconds on mobile
- UI unresponsive while rendering

**Solutions:**

```typescript
// 1. Detect mobile and adjust
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const debounceTime = isMobile ? 1000 : 500; // Longer debounce on mobile

// 2. Show clear loading state
{isGenerating && (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <div className="text-white">Generating image...</div>
  </div>
)}

// 3. Reduce render frequency on mobile
// Don't render on every keystroke, only on blur
```

---

## Category 7: Security Issues

### Risk 7.1: XSS in Code Export

**Likelihood:** Low
**Impact:** Medium

**Symptoms:**
- Malicious code in generated output
- Script injection possible

**Solution:**

```typescript
// Always escape user input in generated code
function escapeForCode(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}

function escapeForHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

### Risk 7.2: SSRF in Validator

**Likelihood:** Low
**Impact:** Medium

**Symptoms:**
- Validator used to probe internal networks

**Solution:**

```typescript
// Validate URL before fetching
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Block internal IPs
    const hostname = parsed.hostname;
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('172.16.') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
```

---

## Quick Reference: Error → Solution

| Error | Likely Cause | Quick Fix |
|-------|--------------|-----------|
| "Failed to fetch resvg.wasm" | File missing | Copy from node_modules |
| "Incorrect MIME type" | Missing _headers | Add Content-Type header |
| Font renders wrong | Font file missing | Download Inter-Bold.ttf |
| Layout broken | Using CSS Grid | Switch to Flexbox |
| Memory grows | Blob URL leak | Revoke old URLs |
| Input lag | No debounce | Add 500ms debounce |
| CORS error | Missing headers | Add CORS headers |
| 404 on deploy | Static export issue | Check generateStaticParams |

---

## Monitoring Checklist

Before each release:

- [ ] Test WASM loading in Chrome, Firefox, Safari
- [ ] Test on mobile device (iPhone + Android)
- [ ] Check memory usage after 10+ renders
- [ ] Verify all templates render correctly
- [ ] Test validator with 5+ different URLs
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Check bundle size hasn't grown unexpectedly
