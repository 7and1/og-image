"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getTemplate, getTemplateComponent, type TemplateId } from "@/templates";
import { useContent, useStyling, useActions } from "@/store/useStore";
import { renderToBlob, preloadEngine } from "@/lib/engine";
import { Button, Card, Input } from "@/components/ui";
import { toast } from "sonner";

interface TemplateEditorProps {
  slug: string;
}

export default function TemplateEditor({ slug }: TemplateEditorProps) {
  const searchParams = useSearchParams();

  const { setContent, setStyling } = useActions();
  const content = useContent();
  const styling = useStyling();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const template = getTemplate(slug as TemplateId);

  // Initialize from URL params
  useEffect(() => {
    if (!template) return;

    // Get params from URL
    const title = searchParams.get("title");
    const desc = searchParams.get("description") || searchParams.get("desc");
    const icon = searchParams.get("icon");
    const bg = searchParams.get("bg");
    const text = searchParams.get("text");
    const accent = searchParams.get("accent");

    // Set content from URL or defaults
    if (title || desc || icon) {
      setContent({
        title: title || content.title || "Your Amazing Title",
        description: desc || content.description || "A compelling description that captures attention",
        icon: icon || content.icon || "sparkles",
      });
    }

    // Set styling from URL or template defaults
    setStyling({
      template: slug as TemplateId,
      backgroundColor: bg ? `#${bg}` : template.defaultProps.backgroundColor || "#000000",
      textColor: text ? `#${text}` : template.defaultProps.textColor || "#ffffff",
      accentColor: accent ? `#${accent}` : template.defaultProps.accentColor || "#3b82f6",
    });
  }, [slug, searchParams, template]);

  // Preload engine
  useEffect(() => {
    preloadEngine();
  }, []);

  // Generate preview when content/styling changes
  useEffect(() => {
    if (!template) return;

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
          />
        );

        const url = await renderToBlob(element);

        // Cleanup old URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(url);
      } catch (error) {
        console.error("Failed to generate preview:", error);
        toast.error("Failed to generate preview");
      } finally {
        setIsGenerating(false);
      }
    };

    const debounce = setTimeout(generatePreview, 300);
    return () => clearTimeout(debounce);
  }, [content, styling, template, slug]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
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
    } catch (error) {
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
    url.searchParams.set("bg", styling.backgroundColor.replace("#", ""));
    url.searchParams.set("text", styling.textColor.replace("#", ""));
    url.searchParams.set("accent", styling.accentColor.replace("#", ""));

    navigator.clipboard.writeText(url.toString());
    toast.success("Share URL copied to clipboard!");
  };

  if (!template) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/templates"
            className="text-sm text-neutral-400 hover:text-white mb-2 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Templates
          </Link>
          <h1 className="text-3xl font-bold text-white mt-2">{template.name} Template</h1>
          <p className="text-neutral-400 mt-1">{template.description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Preview */}
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
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Updating...
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
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

          {/* Editor */}
          <div className="space-y-6">
            {/* Content */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Content</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title-input" className="block text-sm font-medium text-neutral-400 mb-1">
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
                  <label htmlFor="description-input" className="block text-sm font-medium text-neutral-400 mb-1">
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
                  <label htmlFor="icon-select" className="block text-sm font-medium text-neutral-400 mb-1">
                    Icon
                  </label>
                  <select
                    id="icon-select"
                    value={content.icon}
                    onChange={(e) => setContent({ icon: e.target.value })}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {["sparkles", "rocket", "lightning", "star", "heart", "fire", "globe", "code", "book", "briefcase"].map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Colors */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Colors</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="bg-color" className="block text-sm font-medium text-neutral-400 mb-1">
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="bg-color"
                      value={styling.backgroundColor.startsWith("linear") ? "#000000" : styling.backgroundColor}
                      onChange={(e) => setStyling({ backgroundColor: e.target.value })}
                      className="h-10 w-10 rounded border border-neutral-700 bg-transparent cursor-pointer"
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
                  <label htmlFor="text-color" className="block text-sm font-medium text-neutral-400 mb-1">
                    Text Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="text-color"
                      value={styling.textColor}
                      onChange={(e) => setStyling({ textColor: e.target.value })}
                      className="h-10 w-10 rounded border border-neutral-700 bg-transparent cursor-pointer"
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
                  <label htmlFor="accent-color" className="block text-sm font-medium text-neutral-400 mb-1">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      id="accent-color"
                      value={styling.accentColor}
                      onChange={(e) => setStyling({ accentColor: e.target.value })}
                      className="h-10 w-10 rounded border border-neutral-700 bg-transparent cursor-pointer"
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

            {/* Use in Main Editor */}
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
