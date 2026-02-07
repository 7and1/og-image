# Deployment Guide

> Deploying og-image.org to Cloudflare Pages

---

## Quick Deploy

Use the automated deployment script:

```bash
# Preview deployment
./scripts/deploy.sh preview

# Production deployment
./scripts/deploy.sh production
```

The script handles:
- Dependency installation
- Linting and testing
- Building the project
- Verifying build output
- Deploying to Cloudflare Pages
- Post-deployment health checks

---

## Prerequisites

- [ ] Cloudflare account
- [ ] GitHub repository with project code
- [ ] Domain configured in Cloudflare (for custom domain)
- [ ] Wrangler CLI authenticated (`npx wrangler login`)

---

## Build Configuration

### Local Build Test

```bash
# Build the project
npm run build

# Verify output directory
ls out/

# Should see:
# - index.html
# - validator.html
# - templates.html
# - _next/
# - etc.
```

### Environment Variables

No environment variables required for basic deployment.

Optional (for analytics):
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Cloudflare Pages Setup

### Step 1: Connect Repository

1. Go to Cloudflare Dashboard
2. Navigate to **Workers & Pages**
3. Click **Create application**
4. Select **Pages**
5. Click **Connect to Git**
6. Select your GitHub repository

### Step 2: Configure Build Settings

| Setting | Value |
|---------|-------|
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | `/` |
| Node.js version | `18` (or latest LTS) |

### Step 3: Deploy

Click **Save and Deploy**

---

## Critical: Static Asset Headers

### The `_headers` File

Create `/public/_headers`:

```
# WASM files must have correct Content-Type
/resvg.wasm
  Content-Type: application/wasm
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

# Font files with long cache
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

# Static assets
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

# HTML pages - allow revalidation
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Security headers
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
```

### Why This Matters

Without proper `Content-Type` for `.wasm` files:
- Chrome: Works (lenient)
- Firefox: **FAILS** (strict MIME checking)
- Safari: May fail

---

## Edge Functions Setup

### Directory Structure

```
og-image.org/
├── functions/
│   └── api/
│       ├── fetch-og.ts      # OG tag fetcher
│       └── proxy-image.ts   # Image proxy
```

### Function: fetch-og.ts

```typescript
// functions/api/fetch-og.ts

interface OGMeta {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

class OGHandler {
  meta: OGMeta = {};

  element(element: Element) {
    const property = element.getAttribute('property');
    const content = element.getAttribute('content');

    if (property?.startsWith('og:') && content) {
      const key = property.replace('og:', '') as keyof OGMeta;
      this.meta[key] = content;
    }
  }
}

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return Response.json({ error: 'URL parameter required' }, { status: 400 });
  }

  // Validate URL
  try {
    new URL(targetUrl);
  } catch {
    return Response.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'og-image.org/1.0 (+https://og-image.org)',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      return Response.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: 502 }
      );
    }

    const handler = new OGHandler();
    const rewriter = new HTMLRewriter().on('meta', handler);

    await rewriter.transform(response).text();

    return Response.json(handler.meta, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return Response.json(
      { error: 'Fetch failed' },
      { status: 500 }
    );
  }
};
```

### TypeScript Configuration for Functions

Create `functions/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020"],
    "types": ["@cloudflare/workers-types"]
  }
}
```

Install types:
```bash
npm install -D @cloudflare/workers-types
```

---

## Custom Domain Setup

### Step 1: Add Domain in Cloudflare

1. In Pages project settings
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Enter `og-image.org`

### Step 2: DNS Configuration

Cloudflare will automatically configure DNS if domain is already on Cloudflare.

For external DNS:
```
Type: CNAME
Name: @
Target: og-image.org.pages.dev
```

### Step 3: SSL/TLS

- Cloudflare Pages provides automatic SSL
- No configuration needed
- Supports HTTP/2 and HTTP/3

---

## Performance Optimization

### Enable Caching

In Cloudflare Dashboard:
1. Go to **Caching** > **Configuration**
2. Set **Browser Cache TTL** to 1 month
3. Enable **Always Online**

### Enable Compression

1. Go to **Speed** > **Optimization**
2. Enable **Brotli**
3. Enable **Auto Minify** (JS, CSS, HTML)

### Enable Early Hints

1. Go to **Speed** > **Optimization**
2. Enable **Early Hints**

---

## Monitoring

### Web Analytics

1. Go to **Analytics** in Cloudflare Dashboard
2. View traffic, performance, and errors

### Real User Monitoring

Add to `app/layout.tsx`:
```tsx
<Script
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_TOKEN"}'
/>
```

---

## Troubleshooting

### Issue: WASM fails to load

**Symptoms:**
- Console error: "Failed to fetch resvg.wasm"
- Or: "WebAssembly.instantiate(): Incorrect response MIME type"

**Solution:**
1. Verify `/public/resvg.wasm` exists
2. Check `_headers` file has correct Content-Type
3. Clear Cloudflare cache (Caching > Configuration > Purge Everything)

### Issue: Fonts not loading

**Symptoms:**
- Text renders in fallback font
- Console error about font fetch

**Solution:**
1. Verify font files exist in `/public/fonts/`
2. Check CORS headers in `_headers`
3. Verify font path in engine.ts matches

### Issue: Functions 404

**Symptoms:**
- `/api/fetch-og` returns 404

**Solution:**
1. Verify functions directory structure: `functions/api/fetch-og.ts`
2. Check function exports `onRequestGet` (not default export)
3. Redeploy project

### Issue: Build fails

**Symptoms:**
- Cloudflare build shows errors

**Solution:**
1. Test build locally first: `npm run build`
2. Check Node.js version matches
3. Verify all dependencies in `package.json`

---

## Deployment Checklist

### Pre-Deployment
- [ ] `npm run build` succeeds locally
- [ ] All TypeScript errors resolved
- [ ] `_headers` file in `/public`
- [ ] WASM and fonts in `/public`
- [ ] No hardcoded localhost URLs

### Post-Deployment
- [ ] Homepage loads without errors
- [ ] Generator renders images
- [ ] Templates work
- [ ] Validator (if implemented) works
- [ ] Custom domain SSL working
- [ ] Check Lighthouse score

---

## Rollback

If issues occur:

1. Go to Pages project in Cloudflare
2. Navigate to **Deployments**
3. Find previous working deployment
4. Click **...** > **Rollback to this deployment**

---

## Security Considerations

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

Key security features:
- **SSRF Protection**: All fetch endpoints validate URLs against internal/private ranges
- **Rate Limiting**: Multi-window rate limiting on `/api/og` endpoint
- **Response Size Limits**: Prevents memory exhaustion attacks
- **Content Type Validation**: Ensures fetched content matches expected types
- **Input Validation**: All user inputs are validated and sanitized

---

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/)
