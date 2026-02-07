-- OG background categories
CREATE TABLE IF NOT EXISTS og_background_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  query TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- OG background items
CREATE TABLE IF NOT EXISTS og_background_items (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'unsplash',
  category TEXT NOT NULL,
  title TEXT,
  dominant_color TEXT,
  width INTEGER,
  height INTEGER,
  blur_hash TEXT,
  url_og TEXT NOT NULL,
  url_small TEXT NOT NULL,
  url_thumb TEXT NOT NULL,
  url_raw TEXT NOT NULL,
  photographer_name TEXT,
  photographer_username TEXT,
  photographer_profile_url TEXT,
  unsplash_page_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (category) REFERENCES og_background_categories(id)
);

CREATE INDEX IF NOT EXISTS idx_og_background_items_category
  ON og_background_items(category);

CREATE INDEX IF NOT EXISTS idx_og_background_items_provider
  ON og_background_items(provider);

-- Template presets that can override local defaults
CREATE TABLE IF NOT EXISTS og_template_presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  default_props TEXT,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_og_template_presets_category
  ON og_template_presets(category);

CREATE INDEX IF NOT EXISTS idx_og_template_presets_enabled
  ON og_template_presets(enabled);
