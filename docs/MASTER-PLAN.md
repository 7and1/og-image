# og-image.org - Master Plan

> The Open Standard for Open Graph Image Generation

## Executive Summary

**og-image.org** is a zero-cost, privacy-first, client-side Open Graph image generator. It enables developers and marketers to create, preview, and export production-ready OG images without uploading any data to servers.

### Core Value Propositions

| Feature | Benefit |
|---------|---------|
| **Client-side Rendering** | Zero privacy risk - images never leave your browser |
| **Zero Cost Architecture** | Cloudflare Pages static hosting = $0/month |
| **Developer-First** | Copy-paste ready Next.js/HTML code export |
| **Industry Standard Output** | 1200×630px OG images (Twitter/LinkedIn/Facebook optimal) |

---

## Product Modules

### Phase 1: Core Generator (MVP)
**Route:** `/` (Home)

The interactive OG image generator with:
- Real-time preview (debounced, 500ms)
- Template selection (Simple, Gradient, Modern, etc.)
- Customization panel (title, description, icon, colors)
- Code export (Next.js App Router + HTML meta tags)
- PNG download (1200×630)

### Phase 2: Validator
**Route:** `/validator`

Social card preview & validation tool:
- Input any URL
- Fetch OG meta tags via Edge proxy
- Simulate Twitter/LinkedIn/Facebook card rendering
- Show warnings for missing/invalid tags
- SEO score calculation

### Phase 3: Site Auditor
**Route:** `/audit`

Bulk OG tag checker for entire websites:
- Input sitemap URL or domain
- Concurrent crawling (asyncPool pattern)
- Export CSV/JSON report
- Visual dashboard of site-wide OG health

### Phase 4: Template Library
**Route:** `/templates`

Pre-designed templates with query params:
- `/templates/blog` - Article/blog post style
- `/templates/product` - E-commerce product card
- `/templates/event` - Event announcement
- `/templates/profile` - Personal branding
- Each template driven by URL params for easy sharing

### Phase 5: Documentation & SEO Content
**Route:** `/docs/*`

Comprehensive guides:
- What are Open Graph images?
- Best practices for social sharing
- Platform-specific requirements
- API documentation (for template query params)

---

## Technical Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │   Next.js   │   │   Zustand   │   │   Satori + Resvg    │   │
│  │  App Router │◄──│    Store    │──►│   (WASM Engine)     │   │
│  └─────────────┘   └─────────────┘   └─────────────────────┘   │
│         │                                       │               │
│         ▼                                       ▼               │
│  ┌─────────────┐                     ┌─────────────────────┐   │
│  │    UI       │                     │   PNG Blob Output   │   │
│  │ Components  │                     │   (Download/Copy)   │   │
│  └─────────────┘                     └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Static Export
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐   │
│  │   Static    │   │   Edge      │   │   Cache API         │   │
│  │   Assets    │   │  Functions  │   │   (URL Proxy)       │   │
│  │  (HTML/JS)  │   │ (Validator) │   │                     │   │
│  └─────────────┘   └─────────────┘   └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Technical Decisions

### Why Satori over Canvas?

| Aspect | Canvas | Satori |
|--------|--------|--------|
| Text wrapping | Manual calculation | Automatic (CSS Flexbox) |
| Multi-language | Complex | Native support |
| Layout | Absolute positioning | Flexbox/CSS |
| Industry adoption | Custom solutions | Vercel/Next.js standard |

### Why Client-side over Server-side?

1. **Privacy**: No image data transmitted
2. **Cost**: No serverless function costs
3. **Latency**: Instant preview, no network round-trip
4. **Scalability**: Unlimited users at zero marginal cost

### Why Zustand over Context/Redux?

- Minimal boilerplate
- No provider wrapper needed
- Built-in persistence support
- Excellent TypeScript support
- ~1KB bundle size

---

## Success Metrics

### Technical KPIs
- [ ] Lighthouse Performance Score > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] WASM initialization < 500ms

### Product KPIs
- [ ] PNG generation time < 1s
- [ ] Code export accuracy 100%
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive design

---

## Competitive Analysis

| Feature | og-image.org | Vercel OG | Others |
|---------|-------------|-----------|--------|
| Client-side | ✅ | ❌ | ❌ |
| Zero cost | ✅ | Limited | Varies |
| Code export | ✅ | ❌ | ❌ |
| Validator | ✅ | ❌ | Some |
| Open source | ✅ | ✅ | Varies |

---

## Next Steps

1. **Read**: [TECH-STACK.md](./TECH-STACK.md) - Detailed technology choices
2. **Read**: [ARCHITECTURE.md](./ARCHITECTURE.md) - System design details
3. **Read**: [FILE-STRUCTURE.md](./FILE-STRUCTURE.md) - Project organization
4. **Read**: [ROADMAP.md](./ROADMAP.md) - Implementation phases
5. **Read**: [DEPLOYMENT.md](./DEPLOYMENT.md) - Cloudflare setup guide
