"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BackgroundCatalog, BackgroundCatalogItem } from "@/types";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui";
import { getBackgroundCatalog } from "@/lib/background-catalog";

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

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function formatOverlay(value: number): string {
  return `${Math.round(clamp01(value) * 100)}%`;
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
  const [activeTab, setActiveTab] = useState<BackgroundTab>("photo");
  const [activeCategory, setActiveCategory] = useState<string>("abstract");
  const [search, setSearch] = useState("");
  const [catalogState, setCatalogState] = useState<CatalogState>({
    loading: true,
    error: null,
    catalog: null,
  });

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
        if (json.categories?.[0]?.id) {
          setActiveCategory((prev) => prev || json.categories[0].id);
        }
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Failed to load background catalog";
        setCatalogState({ loading: false, error: message, catalog: null });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = catalogState.catalog?.categories ?? [];

  const itemsForCategory = useMemo(() => {
    const catalog = catalogState.catalog;
    if (!catalog) return [];
    return catalog.items.filter((item) => item.category === activeCategory);
  }, [catalogState.catalog, activeCategory]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return itemsForCategory;
    const term = search.trim().toLowerCase();
    return itemsForCategory.filter((item) => {
      const title = item.title?.toLowerCase() ?? "";
      const photographer = item.attribution.photographerName?.toLowerCase() ?? "";
      return title.includes(term) || photographer.includes(term) || item.id.toLowerCase().includes(term);
    });
  }, [itemsForCategory, search]);

  const selectedFromCatalog = useMemo(() => {
    const catalog = catalogState.catalog;
    if (!catalog || !backgroundId) return null;
    return catalog.items.find((item) => item.id === backgroundId) ?? null;
  }, [catalogState.catalog, backgroundId]);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
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

      {/* Tabs */}
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
          Photo
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

      {/* Overlay */}
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

      {/* Selected */}
      {backgroundImageSrc && (
        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2">
          <div className="flex items-start gap-3">
            <div
              className="h-14 w-24 overflow-hidden rounded-md border border-neutral-800 bg-neutral-800"
              style={{ backgroundImage: `url(${backgroundImageSrc})`, backgroundSize: "cover" }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-neutral-200 truncate">
                {selectedFromCatalog?.title ?? selectedFromCatalog?.id ?? "Custom upload"}
              </div>
              {selectedFromCatalog?.attribution.photographerName && (
                <div className="text-[11px] text-neutral-500 truncate">
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
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            Uploads are local-only. Files are not sent to the server.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Category selector */}
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

          {catalogState.loading ? (
            <div className="text-xs text-neutral-500">Loading backgrounds...</div>
          ) : catalogState.error ? (
            <div className="text-xs text-red-400">{catalogState.error}</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {filteredItems.slice(0, 30).map((item) => {
                const selected = item.id === backgroundId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePickPhoto(item)}
                    className={cn(
                      "relative overflow-hidden rounded-lg border transition-transform hover:scale-[1.01]",
                      selected
                        ? "border-primary ring-1 ring-primary"
                        : "border-neutral-700 hover:border-neutral-600"
                    )}
                    title={item.title ?? item.id}
                  >
                    <div
                      className="aspect-[1200/630] w-full"
                      style={{
                        backgroundImage: `url(${item.urls.thumb})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-1">
                      <div className="text-[10px] text-neutral-200 truncate">
                        {item.title ?? item.id}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BackgroundPicker;
