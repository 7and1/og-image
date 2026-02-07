# D1 Schema for OG Catalog + Template Presets

This project supports an optional D1-backed read path in Cloudflare Functions.
When D1 is not configured, APIs automatically fall back to the static catalog
and local template registry.

## Files

- `schema.sql`: Creates tables used by:
  - `GET /api/backgrounds`
  - `GET /api/templates`
  - `GET /api/og` (when resolving `bgId`)

## Expected Bindings

Your Pages Functions environment can expose:

- `OG_DB` (D1 database binding)

## Suggested Setup

1. Create D1 database:

```bash
wrangler d1 create og-image-catalog
```

2. Add binding to your Pages/Workers config (example name: `OG_DB`).

3. Apply schema:

```bash
wrangler d1 execute OG_DB --file=functions/d1/schema.sql
```

4. Seed data from `public/catalog/backgrounds.json` and your template defaults.

## Runtime Behavior

- If `OG_DB` is present and query succeeds, APIs return `source: "d1"`.
- If missing/error/empty, APIs transparently return `source: "static"`.
- This ensures zero-downtime deployment and safe progressive rollout.
