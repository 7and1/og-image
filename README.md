# og-image.org

Production-ready Open Graph image generator built with Next.js + Cloudflare Functions.

## Highlights

- Browser-side OG editor with live preview and export
- Edge OG render API (`/api/og`) with PNG/SVG output
- Background catalog API (`/api/backgrounds`) with filtering/pagination
- Template catalog API (`/api/templates`) for UI/API integrations
- Optional D1 backend (`source: d1`) with static fallback (`source: static`)
- Strict TypeScript across frontend and functions

## Local Development

```bash
npm install
npm run dev
```

## Validation Commands

```bash
# Frontend type-check
npx tsc --noEmit

# Functions type-check
npx tsc -p functions/tsconfig.json --noEmit

# Unit/integration tests
npm run test:unit

# Production build
npm run build
```

## API Endpoints

- `GET /api/og`
  - Render OG image from template params
  - Supports `format=png|svg`
  - Supports `bgId`, `overlay`, color overrides, title/description/icon
- `GET /api/backgrounds`
  - List/search background catalog
  - Supports `id`, `category`, `search`, `limit`, `offset`
- `GET /api/templates`
  - List/search template metadata
  - Supports `id`, `category`, `search`

See full docs at `app/docs/api/page.tsx`.

## D1 (Optional)

D1 schema and setup notes:

- `functions/d1/schema.sql`
- `functions/d1/README.md`

If D1 is unavailable, APIs continue serving from bundled static data.

## Catalog Generation

```bash
npm run catalog:generate
```

This generates `public/catalog/backgrounds.json` from Unsplash seed queries.
