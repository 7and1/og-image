# CLAUDE.md

This file provides guidance to Claude Code when working with og-image.org.

## Project Overview

**og-image.org** is a zero-cost, privacy-first, client-side Open Graph image generator. All heavy lifting (Satori/Resvg WASM) happens in the browser. No data is ever uploaded to servers.

**Domain:** og-image.org
**Architecture:** Next.js 14 (App Router) + Static Export + Cloudflare Pages

## Core Architecture

### Rendering Pipeline
```
React Element → Satori (SVG) → Resvg WASM (PNG) → Blob URL
```

### Key Technical Decisions
1. **Client-side rendering** - Zero privacy risk, zero server cost
2. **Static export** - `output: 'export'` for Cloudflare Pages
3. **WASM singleton** - Initialize once, reuse for all renders
4. **Debounced preview** - 500ms delay to prevent UI jank

### State Management
Single Zustand store at `store/useStore.ts` manages:
- Design state (title, description, template, colors)
- UI state (isGenerating, previewUrl, errors)
- Persistence via localStorage

## Critical Files

These files MUST exist in `/public`:
- `resvg.wasm` - WASM binary from @resvg/resvg-js
- `fonts/Inter-Bold.ttf` - Primary font for rendering
- `_headers` - Cloudflare MIME type configuration

## File Organization

```
/app              - Next.js App Router pages
/components       - React components (ui/, editor/, preview/, export/)
/lib              - Core utilities (engine.ts, code-gen.ts)
/store            - Zustand state management
/templates        - OG image template components
/functions/api    - Cloudflare Pages Functions (edge)
/public           - Static assets (WASM, fonts, headers)
/docs             - Implementation documentation
```

## Development Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production (outputs to /out)
npm run start     # Start production server (local test)
```

## Key Patterns

### WASM Engine (lib/engine.ts)
```typescript
// Singleton pattern - initialize once
let isWasmInit = false;
let fontBuffer: ArrayBuffer | null = null;

export async function renderToBlob(node: React.ReactNode): Promise<string>
```

### Debounced Rendering
```typescript
useEffect(() => {
  const timer = setTimeout(async () => {
    const url = await renderToBlob(template);
    setPreviewUrl(url);
  }, 500);
  return () => clearTimeout(timer);
}, [dependencies]);
```

### Blob URL Cleanup
```typescript
// Always revoke previous URLs to prevent memory leaks
if (previousUrl) URL.revokeObjectURL(previousUrl);
```

## Template Requirements

Templates must:
1. Use **inline styles only** (Satori doesn't support CSS classes)
2. Use **Flexbox layout** (CSS Grid not supported)
3. Return a **React element** (not JSX fragment)
4. Have dimensions **1200×630** (OG image standard)

Example:
```tsx
export function GradientTemplate(props: TemplateProps): React.ReactElement {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', ... }}>
      {/* content */}
    </div>
  );
}
```

## Cloudflare Specifics

### _headers file
```
/resvg.wasm
  Content-Type: application/wasm
  Cache-Control: public, max-age=31536000, immutable
```

### Edge Functions
Located at `/functions/api/*.ts`
- Use `HTMLRewriter` for HTML parsing
- Export `onRequestGet` for GET handlers
- Use Cloudflare Cache API for performance

## Implementation Phases

1. **Phase 0** - Project setup, dependencies, static assets
2. **Phase 1** - Core generator (engine, store, first template, UI)
3. **Phase 2** - More templates, code export, download
4. **Phase 3** - Validator (edge function, social previews)
5. **Phase 4** - Site auditor (sitemap parser, concurrent crawler)
6. **Phase 5** - Documentation and SEO content

## Documentation

Full implementation docs in `/docs`:
- MASTER-PLAN.md - Vision and architecture
- TECH-STACK.md - Dependencies and configuration
- ARCHITECTURE.md - System design details
- FILE-STRUCTURE.md - Project organization
- ROADMAP.md - Implementation tasks
- DEPLOYMENT.md - Cloudflare setup

## Common Issues

### WASM fails to load
- Check `/public/resvg.wasm` exists
- Verify `_headers` has correct Content-Type
- Clear Cloudflare cache if deployed

### Fonts not rendering
- Verify `/public/fonts/Inter-Bold.ttf` exists
- Check font path in engine.ts matches

### Build fails
- Ensure `output: 'export'` in next.config.js
- Check `images: { unoptimized: true }`
- Verify webpack fallbacks for fs/path

## Quality Standards

- TypeScript strict mode (no `any`)
- No console errors in browser
- Lighthouse Performance > 95
- Cross-browser tested (Chrome, Firefox, Safari, Edge)
- Responsive design
- Dark mode support
