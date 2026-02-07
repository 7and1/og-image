import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_SEED_PATH = path.join("catalog", "unsplash", "seed-queries.json");
const DEFAULT_OUT_PATH = path.join("public", "catalog", "backgrounds.json");
const DEFAULT_LOCK_PATH = path.join("catalog", "unsplash", "backgrounds.lock.json");
const DEFAULT_APP_NAME = "og-image-org";

function getArgValue(args, name) {
  const index = args.indexOf(name);
  if (index === -1) {
    return null;
  }
  return args[index + 1] ?? null;
}

function getFlag(args, name) {
  return args.includes(name);
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing env var ${name}`);
  }
  return value.trim();
}

function normalizeKeys(rawKeys) {
  return rawKeys
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

function withUtm(url, appName) {
  const parsed = new URL(url);
  parsed.searchParams.set("utm_source", appName);
  parsed.searchParams.set("utm_medium", "referral");
  return parsed.toString();
}

function buildImageUrl(rawUrl, { width, height, quality, fit = "crop" }) {
  const url = new URL(rawUrl);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", fit);
  url.searchParams.set("w", String(width));
  url.searchParams.set("h", String(height));
  url.searchParams.set("q", String(quality));
  return url.toString();
}

async function fetchJson(url, keys, keyIndex) {
  const accessKey = keys[keyIndex % keys.length];
  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const detail = text ? ` ${text.slice(0, 200)}` : "";
    throw new Error(`Unsplash request failed (${response.status})${detail}`);
  }

  return response.json();
}

async function searchPhotos({ query, page, perPage, orientation }, keys, keyIndex) {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", orientation);
  return fetchJson(url.toString(), keys, keyIndex);
}

function mapPhoto(photo, category, appName) {
  const raw = photo?.urls?.raw;
  if (!raw) {
    return null;
  }

  const title = photo.alt_description || photo.description || null;
  const photographerName = photo?.user?.name || null;
  const photographerUsername = photo?.user?.username || null;

  const photographerProfileUrl = photo?.user?.links?.html
    ? withUtm(photo.user.links.html, appName)
    : null;
  const unsplashPageUrl = photo?.links?.html
    ? withUtm(photo.links.html, appName)
    : null;

  const ogUrl = buildImageUrl(raw, {
    width: 1200,
    height: 630,
    quality: 80,
    fit: "crop",
  });

  const smallUrl = buildImageUrl(raw, {
    width: 640,
    height: 336,
    quality: 70,
    fit: "crop",
  });

  const thumbUrl = buildImageUrl(raw, {
    width: 320,
    height: 168,
    quality: 60,
    fit: "crop",
  });

  return {
    id: photo.id,
    provider: "unsplash",
    category,
    title,
    dominantColor: photo.color || null,
    width: photo.width || null,
    height: photo.height || null,
    blurHash: photo.blur_hash || null,
    urls: {
      og: ogUrl,
      small: smallUrl,
      thumb: thumbUrl,
      raw,
    },
    attribution: {
      photographerName,
      photographerUsername,
      photographerProfileUrl,
      unsplashPageUrl,
    },
  };
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const args = process.argv.slice(2);
  const seedPath = getArgValue(args, "--seed") ?? DEFAULT_SEED_PATH;
  const outPath = getArgValue(args, "--out") ?? DEFAULT_OUT_PATH;
  const lockPath = getArgValue(args, "--lock") ?? DEFAULT_LOCK_PATH;
  const appName = getArgValue(args, "--app") ?? DEFAULT_APP_NAME;
  const perPage = Number(getArgValue(args, "--per-page") ?? 30);
  const orientation = getArgValue(args, "--orientation") ?? "landscape";
  const writeLock = !getFlag(args, "--no-lock");

  const rawKeys =
    process.env.UNSPLASH_ACCESS_KEYS ??
    process.env.UNSPLASH_ACCESS_KEY ??
    requireEnv("UNSPLASH_ACCESS_KEY");
  const keys = normalizeKeys(rawKeys);
  if (keys.length === 0) {
    throw new Error("No UNSPLASH access keys provided");
  }

  const seed = JSON.parse(await fs.readFile(seedPath, "utf8"));
  const categories = seed.categories ?? [];
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new Error(`Seed file ${seedPath} has no categories`);
  }

  const seen = new Set();
  const items = [];
  const lock = {
    provider: "unsplash",
    app: appName,
    generatedAt: new Date().toISOString(),
    categories: {},
  };

  let keyIndex = 0;

  for (const category of categories) {
    const categoryId = category.id;
    const query = category.query;
    const desired = Number(category.count ?? 0);
    if (!categoryId || !query || desired <= 0) {
      continue;
    }

    const picked = [];
    let page = 1;
    let guard = 0;

    while (picked.length < desired) {
      guard += 1;
      if (guard > 20) {
        break;
      }

      let result;
      try {
        result = await searchPhotos({ query, page, perPage, orientation }, keys, keyIndex);
      } catch (error) {
        keyIndex += 1;
        if (keyIndex >= keys.length * 3) {
          throw error;
        }
        continue;
      }

      const photos = result?.results ?? [];
      if (!Array.isArray(photos) || photos.length === 0) {
        break;
      }

      for (const photo of photos) {
        if (!photo?.id || seen.has(photo.id)) {
          continue;
        }

        const mapped = mapPhoto(photo, categoryId, appName);
        if (!mapped) {
          continue;
        }

        seen.add(mapped.id);
        picked.push(mapped);
        items.push(mapped);

        if (picked.length >= desired) {
          break;
        }
      }

      page += 1;
    }

    lock.categories[categoryId] = picked.map((item) => item.id);
    console.log(`[catalog] ${categoryId}: ${picked.length}/${desired}`);
  }

  const out = {
    provider: "unsplash",
    app: appName,
    generatedAt: new Date().toISOString(),
    categories: categories.map((category) => ({
      id: category.id,
      label: category.label,
      count: category.count,
      query: category.query,
    })),
    items,
  };

  await ensureDir(outPath);
  await fs.writeFile(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`[catalog] wrote ${outPath} (${items.length} items)`);

  if (writeLock) {
    await ensureDir(lockPath);
    await fs.writeFile(lockPath, JSON.stringify(lock, null, 2) + "\n", "utf8");
    console.log(`[catalog] wrote ${lockPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

