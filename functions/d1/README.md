# D1 Schema for OG Catalog + Template Presets

This project supports an optional D1-backed read path in Cloudflare Functions.
When D1 is not configured, catalog APIs automatically fall back to static data.

## Files

- `schema.sql`: Creates tables used by:
  - `GET /api/backgrounds`
  - `GET /api/templates`
  - `GET /api/og` (when resolving `bgId`)
  - `GET/POST/DELETE /api/my-templates`

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

- If `OG_DB` is present and query succeeds, catalog APIs return `source: "d1"`.
- If missing/error/empty, catalog APIs transparently return `source: "static"`.
- `/api/my-templates` requires D1 and returns `501 D1_UNAVAILABLE` without `OG_DB`.

## My Templates Table

`og_user_templates` stores user-saved snapshots:

- `id`: template row id
- `user_key`: user-defined namespace key
- `name`: template display name
- `template_id`: selected base template id
- `payload`: full editor payload JSON
- `created_at`, `updated_at`: timestamps

Indexes:

- `idx_og_user_templates_user_key`
- `idx_og_user_templates_updated_at`
