"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getTemplate, getTemplateComponent, type TemplateId } from "@/templates";
import { useContent, useStyling, useActions } from "@/store/useStore";
import { renderToBlob, preloadEngine } from "@/lib/engine";
import { getBackgroundById } from "@/lib/background-catalog";
import { Button, Card, Input } from "@/components/ui";
import { toast } from "sonner";

interface TemplateEditorProps {
  slug: string;
}

function safeHexFromParam(raw: string | null): string | null {
  if (!raw) {
    return null;
  }
  const normalized = raw.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }
  return `#${normalized.toLowerCase()}`;
}

export default function TemplateEditor({ slug }: TemplateEditorProps) {
  const searchParams = useSearchParams();

  const { setContent, setStyling, setBackground } = useActions();
  const content = useContent();
  const styling = useStyling();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const template = getTemplate(slug as TemplateId);
  const currentPreviewRef = useRef<string | null>(null);

  const [resolvedBackgroundSrc, setResolvedBackgroundSrc] = useState<string | null>(
    null
  );

  // Initialize from URL params
  useEffect(() => {
    if (!template) return;

    const title = searchParams.get("title");
    const desc = searchParams.get("description") || searchParams.get("desc");
    const icon = searchParams.get("icon");

    const bgFromParam = safeHexFromParam(searchParams.get("bg"));
    const textFromParam = safeHexFromParam(searchParams.get("text"));
    const accentFromParam = safeHexFromParam(searchParams.get("accent"));

    const bgId = searchParams.get("bgId");
    const overlayRaw = searchParams.get("overlay");
    const overlay = overlayRaw ? Number(overlayRaw) : undefined;

    if (title || desc || icon) {
      setContent({
        title: title || content.title || "Your Amazing Title",
        description:
          desc ||
          content.description ||
          "A compelling description that captures attention",
        icon: icon || content.icon || "sparkles",
      });
    }

    setStyling({
      template: slug as TemplateId,
      backgroundColor:
        bgFromParam || template.defaultProps.backgroundColor || "#000000",
      textColor: textFromParam || template.defaultProps.textColor || "#ffffff",
      accentColor: accentFromParam || template.defaultProps.accentColor || "#3b82f6",
    });

    setBackground({
      backgroundMode:
        bgId || template.defaultProps.backgroundMode === "photo" ? "photo" : "color",
      backgroundId: bgId || template.defaultProps.backgroundId || null,
      backgroundImageSrc: template.defaultProps.backgroundImageSrc || null,
      overlayOpacity:
        typeof overlay === "number" && Number.isFinite(overlay)
          ? Math.min(1, Math.max(0, overlay))
          : template.defaultProps.overlayOpacity,
    });
  }, [
    slug,
    searchParams,
    template,
    setBackground,
    setContent,
    setStyling,
    content.title,
    content.description,
    content.icon,
  ]);

  // Resolve bgId -> image URL
  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      if (styling.backgroundMode !== "photo" || !styling.backgroundId) {
        setResolvedBackgroundSrc(null);
        return;
      }

      const item = await getBackgroundById(styling.backgroundId);
      if (cancelled) return;
      setResolvedBackgroundSrc(item?.urls.og ?? null);
    };

    resolve().catch(() => {
      if (cancelled) return;
      setResolvedBackgroundSrc(null);
    });

    return () => {
      cancelled = true;
    };
  }, [styling.backgroundMode, styling.backgroundId]);

  useEffect(() => {
    preloadEngine();
  }, []);

  useEffect(() => {
    if (!template) return;

    let cancelled = false;

    const generatePreview = async () => {
      setIsGenerating(true);
      try {
        const TemplateComponent = getTemplateComponent(slug as TemplateId);
        const element = (
          <TemplateComponent
            title={content.title || "Your Amazing Title"}
            description={content.description || "A compelling description"}
            icon={content.icon || "sparkles"}
            backgroundColor={styling.backgroundColor}
            textColor={styling.textColor}
            accentColor={styling.accentColor}
            backgroundMode={styling.backgroundMode}
            backgroundId={styling.backgroundId}
            backgroundImageSrc={resolvedBackgroundSrc ?? styling.backgroundImageSrc}
            overlayOpacity={styling.overlayOpacity}
          />
        );

        const url = await renderToBlob(element);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        const previousUrl = currentPreviewRef.current;
        currentPreviewRef.current = url;
        setPreviewUrl(url);

        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
      } catch (error) {
        console.error("Failed to generate preview:", error);
        if (!cancelled) {
          toast.error("Failed to generate preview");
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    };

    const debounce = setTimeout(generatePreview, 300);
    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [content, styling, template, slug, resolvedBackgroundSrc]);

  useEffect(() => {
    return () => {
      if (currentPreviewRef.current) {
        URL.revokeObjectURL(currentPreviewRef.current);
      }
    };
  }, []);

  const handleDownload = async () => {
    if (!previewUrl) return;

    setIsDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = `og-image-${slug}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("title", content.title || "");
    url.searchParams.set("description", content.description || "");
    if (content.icon) url.searchParams.set("icon", content.icon);

    const backgroundHex = safeHexFromParam(styling.backgroundColor);
    if (backgroundHex) {
      url.searchParams.set("bg", backgroundHex.replace("#", ""));
    } else {
      url.searchParams.delete("bg");
    }

    const textHex = safeHexFromParam(styling.textColor);
    if (textHex) {
      url.searchParams.set("text", textHex.replace("#", ""));
    } else {
      url.searchParams.delete("text");
    }

    const accentHex = safeHexFromParam(styling.accentColor);
    if (accentHex) {
      url.searchParams.set("accent", accentHex.replace("#", ""));
    } else {
      url.searchParams.delete("accent");
    }

    if (styling.backgroundMode === "photo" && styling.backgroundId) {
      url.searchParams.set("bgId", styling.backgroundId);
      if (typeof styling.overlayOpacity === "number") {
        url.searchParams.set("overlay", String(styling.overlayOpacity));
      }
    } else {
      url.searchParams.delete("bgId");
      url.searchParams.delete("overlay");
    }

    navigator.clipboard.writeText(url.toString());
    toast.success("Share URL copied to clipboard!");
  };

  if (!template) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/templates"
            className="mb-2 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Templates
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-white">{template.name} Template</h1>
          <p className="mt-1 text-neutral-400">{template.description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Card className="overflow-hidden">
              <div className="relative aspect-[1200/630] bg-neutral-800">
                {isGenerating && !previewUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-600 border-t-blue-500" aria-label="Loading preview" />
                  </div>
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={`${template.name} template preview`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                    Preview loading...
                  </div>
                )}
                {isGenerating && previewUrl && (
                  <div className="absolute right-2 top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                    Updating...
                  </div>
                )}
              </div>
            </Card>

            <div className="mt-4 flex gap-3">
              <Button
                onClick={handleDownload}
                disabled={!previewUrl || isDownloading}
                className="flex-1"
              >
                {isDownloading ? "Downloading..." : "Download PNG"}
              </Button>
              <Button variant="outline" onClick={handleCopyShareUrl}>
                Copy Share URL
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <h2 className="mb-4 text-lg font-semibold text-white">Content</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title-input" className="mb-1 block text-sm font-medium text-neutral-400">
                    Title
                  </label>
                  <Input
                    id="title-input"
                    value={content.title}
                    onChange={(e) => setContent({ title: e.target.value })}
                    placeholder="Your amazing title"
                  />
                </div>
                <div>
                  <label htmlFor="description-input" className="mb-1 block text-sm font-medium text-neutral-400">
                    Description
                  </label>
                  <Input
                    id="description-input"
                    value={content.description}
                    onChange={(e) => setContent({ description: e.target.value })}
                    placeholder="A compelling description"
                  />
                </div>
                <div>
                  <label htmlFor="icon-input" className="mb-1 block text-sm font-medium text-neutral-400">
                    Icon / Emoji
                  </label>
                  <Input
                    id="icon-input"
                    value={content.icon}
                    onChange={(e) => setContent({ icon: e.target.value })}
                    placeholder="⚡"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="mb-4 text-lg font-semibold text-white">Colors</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="bg-color" className="mb-1 block text-sm font-medium text-neutral-400">
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="bg-color"
                      value={safeHexFromParam(styling.backgroundColor) ?? "#000000"}
                      onChange={(e) => setStyling({ backgroundColor: e.target.value })}
                      className="h-10 w-10 cursor-pointer rounded border border-neutral-700 bg-transparent"
                      aria-label="Background color picker"
                    />
                    <Input
                      value={styling.backgroundColor}
                      onChange={(e) => setStyling({ backgroundColor: e.target.value })}
                      placeholder="#000000"
                      className="flex-1"
                      aria-label="Background color value"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="text-color" className="mb-1 block text-sm font-medium text-neutral-400">
                    Text Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="text-color"
                      value={safeHexFromParam(styling.textColor) ?? "#ffffff"}
                      onChange={(e) => setStyling({ textColor: e.target.value })}
                      className="h-10 w-10 cursor-pointer rounded border border-neutral-700 bg-transparent"
                      aria-label="Text color picker"
                    />
                    <Input
                      value={styling.textColor}
                      onChange={(e) => setStyling({ textColor: e.target.value })}
                      placeholder="#ffffff"
                      className="flex-1"
                      aria-label="Text color value"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="accent-color" className="mb-1 block text-sm font-medium text-neutral-400">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="accent-color"
                      value={safeHexFromParam(styling.accentColor) ?? "#3b82f6"}
                      onChange={(e) => setStyling({ accentColor: e.target.value })}
                      className="h-10 w-10 cursor-pointer rounded border border-neutral-700 bg-transparent"
                      aria-label="Accent color picker"
                    />
                    <Input
                      value={styling.accentColor}
                      onChange={(e) => setStyling({ accentColor: e.target.value })}
                      placeholder="#3b82f6"
                      className="flex-1"
                      aria-label="Accent color value"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStyling({
                    template: slug as TemplateId,
                    backgroundColor: styling.backgroundColor,
                    textColor: styling.textColor,
                    accentColor: styling.accentColor,
                  });
                }}
              >
                Open in Full Editor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
