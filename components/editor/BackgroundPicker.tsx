"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Heart, CloudUpload, CloudDownload } from "lucide-react";
import type { BackgroundCatalog, BackgroundCatalogItem } from "@/types";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui";
import { getBackgroundCatalog } from "@/lib/background-catalog";
import { useActions, useLibrary } from "@/store/useStore";
import { fetchFavorites, syncFavorites, safeFavoritesError } from "@/lib/favorites";

type BackgroundTab = "photo" | "upload";

interface BackgroundPickerProps {
  backgroundId: string | null;
  backgroundImageSrc: string | null;
  overlayOpacity: number;
  onPickPhoto: (selection: { id: string; src: string }) => void;
  onUpload: (src: string) => void;
  onClear: () => void;
  onOverlayChange: (value: number) => void;
}

interface CatalogState {
  loading: boolean;
  error: string | null;
  catalog: BackgroundCatalog | null;
}

const FAVORITES_CATEGORY_ID = "favorites";
const INITIAL_VISIBLE_ITEMS = 36;
const PAGE_SIZE = 30;

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function formatOverlay(value: number): string {
  return `${Math.round(clamp01(value) * 100)}%`;
}

function isGenericUnsplashAlt(title: string): boolean {
  const normalized = title.trim().toLowerCase();
  if (!(normalized.startsWith("a ") || normalized.startsWith("an "))) {
    return false;
  }

  return (
    normalized.includes("blurry image") ||
    normalized.includes("close up") ||
    normalized.includes("image of") ||
    normalized.includes("photo of")
  );
}

function formatBackgroundCardLabel(item: BackgroundCatalogItem): string {
  const title = item.title?.trim();
  if (title && !isGenericUnsplashAlt(title)) {
    return title;
  }

  const photographer = item.attribution.photographerName?.trim();
  if (photographer) {
    return `by ${photographer}`;
  }

  return title || item.id;
}

function buildMasonryPreviewUrl(item: BackgroundCatalogItem): string {
  if (item.urls.raw) {
    const joiner = item.urls.raw.includes("?") ? "&" : "?";
    return `${item.urls.raw}${joiner}auto=format&fit=max&w=420&q=60`;
  }

  return item.urls.small || item.urls.thumb || item.urls.og;
}

export function BackgroundPicker({
  backgroundId,
  backgroundImageSrc,
  overlayOpacity,
  onPickPhoto,
  onUpload,
  onClear,
  onOverlayChange,
}: BackgroundPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<BackgroundTab>("photo");
  const [activeCategory, setActiveCategory] = useState<string>("abstract");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ITEMS);
  const [catalogState, setCatalogState] = useState<CatalogState>({
    loading: true,
    error: null,
    catalog: null,
  });

  const { favoriteBackgroundIds, favoritesUserKey } = useLibrary();
  const { toggleFavoriteBackground, clearFavoriteBackgrounds, setFavoritesUserKey, setFavoriteBackgroundIds } = useActions();

  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const json = await getBackgroundCatalog();
        if (!json) {
          throw new Error("Failed to load background catalog");
        }
        if (cancelled) return;

        setCatalogState({ loading: false, error: null, catalog: json });

        const hasCurrentCategory = json.categories.some(
          (category) => category.id === activeCategory
        );

        if (!hasCurrentCategory && json.categories[0]?.id) {
          setActiveCategory(json.categories[0].id);
        }
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : "Failed to load background catalog";
        setCatalogState({ loading: false, error: message, catalog: null });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const catalogItems = catalogState.catalog?.items ?? [];
  const categoryItems = catalogState.catalog?.categories ?? [];

  const categories = useMemo(() => {
    const favoritesCount = favoriteBackgroundIds.length;
    return [
      {
        id: FAVORITES_CATEGORY_ID,
        label: `Favorites (${favoritesCount})`,
        count: favoritesCount,
        query: "favorites",
      },
      ...categoryItems,
    ];
  }, [categoryItems, favoriteBackgroundIds.length]);

  const favoriteIdSet = useMemo(
    () => new Set(favoriteBackgroundIds),
    [favoriteBackgroundIds]
  );

  useEffect(() => {
    const categoryExists = categories.some((category) => category.id === activeCategory);
    if (!categoryExists) {
      setActiveCategory(categoryItems[0]?.id ?? FAVORITES_CATEGORY_ID);
    }
  }, [categories, activeCategory, categoryItems]);

  const itemsForCategory = useMemo(() => {
    if (activeCategory === FAVORITES_CATEGORY_ID) {
      return catalogItems.filter((item) => favoriteIdSet.has(item.id));
    }

    return catalogItems.filter((item) => item.category === activeCategory);
  }, [catalogItems, activeCategory, favoriteIdSet]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return itemsForCategory;

    const term = search.trim().toLowerCase();
    return itemsForCategory.filter((item) => {
      const title = item.title?.toLowerCase() ?? "";
      const photographer = item.attribution.photographerName?.toLowerCase() ?? "";
      return title.includes(term) || photographer.includes(term) || item.id.toLowerCase().includes(term);
    });
  }, [itemsForCategory, search]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_ITEMS);
  }, [activeCategory, search, favoriteBackgroundIds]);

  const hasMore = visibleCount < filteredItems.length;
  const visibleItems = filteredItems.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    setVisibleCount((previous) => Math.min(previous + PAGE_SIZE, filteredItems.length));
  }, [filteredItems.length]);

  const handleLoadFavoritesFromD1 = useCallback(async () => {
    const userKey = favoritesUserKey?.trim();
    if (!userKey) {
      setSyncError("Please enter a user key first");
      return;
    }

    setSyncLoading(true);
    setSyncError(null);

    try {
      const ids = await fetchFavorites(userKey);
      setFavoriteBackgroundIds(ids);
    } catch (err) {
      setSyncError(safeFavoritesError(err, "Failed to load favorites"));
    } finally {
      setSyncLoading(false);
    }
  }, [favoritesUserKey, setFavoriteBackgroundIds]);

  const handleSyncFavoritesToD1 = useCallback(async () => {
    const userKey = favoritesUserKey?.trim();
    if (!userKey) {
      setSyncError("Please enter a user key first");
      return;
    }

    setSyncLoading(true);
    setSyncError(null);

    try {
      await syncFavorites(userKey, favoriteBackgroundIds);
    } catch (err) {
      setSyncError(safeFavoritesError(err, "Failed to sync favorites"));
    } finally {
      setSyncLoading(false);
    }
  }, [favoritesUserKey, favoriteBackgroundIds]);

  useEffect(() => {
    if (!hasMore || activeTab !== "photo") {
      return;
    }

    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadMore();
          }
        }
      },
      {
        root: null,
        rootMargin: "240px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, activeTab, loadMore]);

  const selectedFromCatalog = useMemo(() => {
    if (!backgroundId) return null;
    return catalogItems.find((item) => item.id === backgroundId) ?? null;
  }, [catalogItems, backgroundId]);

  const selectedLabel = useMemo(() => {
    if (!selectedFromCatalog) {
      return "Custom upload";
    }

    const title = selectedFromCatalog.title?.trim();
    if (title && !isGenericUnsplashAlt(title)) {
      return title;
    }

    return selectedFromCatalog.id;
  }, [selectedFromCatalog]);

  const handleFileChange = async (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });

    if (!dataUrl.startsWith("data:image")) {
      return;
    }

    onUpload(dataUrl);
  };

  const handlePickPhoto = (item: BackgroundCatalogItem) => {
    onPickPhoto({ id: item.id, src: item.urls.og });
  };

  const overlayLabel = formatOverlay(overlayOpacity);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-neutral-400">Background Image</label>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-neutral-500 hover:text-neutral-300"
        >
          Clear
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("photo")}
          className={cn(
            "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
            activeTab === "photo"
              ? "border-primary bg-primary/10 text-primary"
              : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-600"
          )}
        >
          Photo Library
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={cn(
            "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
            activeTab === "upload"
              ? "border-primary bg-primary/10 text-primary"
              : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-600"
          )}
        >
          Upload
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500">Overlay</span>
          <span className="text-xs text-neutral-400">{overlayLabel}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={clamp01(overlayOpacity)}
          onChange={(event) => onOverlayChange(Number(event.target.value))}
          className="w-full"
          aria-label="Overlay opacity"
        />
      </div>

      {backgroundImageSrc && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2">
          <div className="flex items-start gap-3">
            <div
              className="h-14 w-24 overflow-hidden rounded-md border border-neutral-800 bg-neutral-800"
              style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: "cover" }}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs text-neutral-200">{selectedLabel}</div>
              {selectedFromCatalog?.attribution.photographerName && (
                <div className="truncate text-[11px] text-neutral-500">
                  by {selectedFromCatalog.attribution.photographerName}
                </div>
              )}
              {selectedFromCatalog?.attribution.unsplashPageUrl && (
                <a
                  href={selectedFromCatalog.attribution.unsplashPageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-neutral-500 hover:text-neutral-300"
                >
                  View on Unsplash
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "upload" ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              handleFileChange(file).catch(() => {});
              event.target.value = "";
            }}
            className="hidden"
          />
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            Choose Image
          </Button>
          <p className="text-[11px] leading-relaxed text-neutral-500">
            Uploads are local-only. Files are not sent to the server.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "flex-shrink-0 rounded-full border px-3 py-1 text-[11px] transition-colors",
                  activeCategory === category.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-600"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title / author / id"
          />

          {activeCategory === FAVORITES_CATEGORY_ID && (
            <div className="space-y-2">
              <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={favoritesUserKey ?? ""}
                      onChange={(e) => setFavoritesUserKey(e.target.value || null)}
                      placeholder="User key for D1 sync"
                      className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLoadFavoritesFromD1}
                      disabled={syncLoading || !favoritesUserKey?.trim()}
                      className="gap-1"
                    >
                      <CloudDownload className="h-3 w-3" />
                      Load
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSyncFavoritesToD1}
                      disabled={syncLoading || !favoritesUserKey?.trim()}
                      className="gap-1"
                    >
                      <CloudUpload className="h-3 w-3" />
                      Save
                    </Button>
                  </div>
                  {syncError && (
                    <div className="text-[11px] text-red-400">{syncError}</div>
                  )}
                </div>
              </div>

              {favoriteBackgroundIds.length > 0 && (
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] text-neutral-400">
                    {favoriteBackgroundIds.length} favorite(s)
                  </span>
                  <button
                    type="button"
                    onClick={clearFavoriteBackgrounds}
                    className="text-[11px] text-neutral-500 hover:text-neutral-300"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}

          {catalogState.loading ? (
            <div className="text-xs text-neutral-500">Loading backgrounds...</div>
          ) : catalogState.error ? (
            <div className="text-xs text-red-400">{catalogState.error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-4 text-xs text-neutral-500">
              {activeCategory === FAVORITES_CATEGORY_ID
                ? "No favorites yet. Tap the heart icon to collect backgrounds you like."
                : "No backgrounds matched your filter."}
            </div>
          ) : (
            <>
              <div className="columns-2 gap-2 sm:columns-3">
                {visibleItems.map((item) => {
                  const selected = item.id === backgroundId;
                  const isFavorite = favoriteIdSet.has(item.id);
                  const cardLabel = formatBackgroundCardLabel(item);

                  return (
                    <div key={item.id} className="relative mb-2 break-inside-avoid">
                      <button
                        type="button"
                        onClick={() => handlePickPhoto(item)}
                        className={cn(
                          "group relative block w-full overflow-hidden rounded-lg border transition-transform hover:scale-[1.01]",
                          selected
                            ? "border-primary ring-1 ring-primary"
                            : "border-neutral-700 hover:border-neutral-600"
                        )}
                        title={cardLabel}
                      >
                        <img
                          src={buildMasonryPreviewUrl(item)}
                          alt={cardLabel}
                          loading="lazy"
                          className="h-auto w-full"
                          style={{
                            aspectRatio:
                              item.width && item.height ? `${item.width}/${item.height}` : "4/3",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          className={cn(
                            "pointer-events-none absolute inset-x-0 bottom-0 bg-black/55 px-1.5 py-1 transition-opacity",
                            selected
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                          )}
                        >
                          <div className="truncate text-[10px] text-neutral-100">{cardLabel}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavoriteBackground(item.id);
                        }}
                        className={cn(
                          "absolute right-2 top-2 z-10 rounded-full border p-1.5 backdrop-blur-sm transition-colors",
                          isFavorite
                            ? "border-rose-400/60 bg-black/45"
                            : "border-white/20 bg-black/30 hover:border-white/35"
                        )}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          className={cn(
                            "h-3.5 w-3.5",
                            isFavorite ? "fill-rose-500 text-rose-400" : "text-white/85"
                          )}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div ref={loadMoreRef} className="h-2 w-full" aria-hidden="true" />

              {hasMore && (
                <Button variant="outline" className="w-full" onClick={loadMore}>
                  Load more ({filteredItems.length - visibleCount} left)
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default BackgroundPicker;
