"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useActions } from "@/store/useStore";
import { templateList, getTemplateComponent, type TemplateConfig, type TemplateId } from "@/templates";
import { renderToBlob, preloadEngine } from "@/lib/engine";
import { Button, Card } from "@/components/ui";

interface TemplatePreview {
  id: TemplateId;
  config: TemplateConfig;
  imageUrl: string | null;
  isLoading: boolean;
}

export default function TemplatesContent() {
  const { setStyling } = useActions();
  const [previews, setPreviews] = useState<TemplatePreview[]>(
    templateList.map((t) => ({
      id: t.id,
      config: t,
      imageUrl: null,
      isLoading: true,
    }))
  );

  // Preload engine
  useEffect(() => {
    preloadEngine();
  }, []);

  // Generate previews for all templates
  useEffect(() => {
    const generatePreviews = async () => {
      for (const template of templateList) {
        try {
          const TemplateComponent = getTemplateComponent(template.id);
          const defaults = template.defaultProps;
          const element = (
            <TemplateComponent
              title="Your Amazing Title"
              description="A compelling description that captures attention"
              icon="sparkles"
              backgroundColor={defaults.backgroundColor || "#000000"}
              textColor={defaults.textColor || "#ffffff"}
              accentColor={defaults.accentColor || "#3b82f6"}
            />
          );

          const url = await renderToBlob(element);

          setPreviews((prev) =>
            prev.map((p) =>
              p.id === template.id
                ? { ...p, imageUrl: url, isLoading: false }
                : p
            )
          );
        } catch (error) {
          console.error(`Failed to generate preview for ${template.id}:`, error);
          setPreviews((prev) =>
            prev.map((p) =>
              p.id === template.id ? { ...p, isLoading: false } : p
            )
          );
        }
      }
    };

    generatePreviews();
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.imageUrl) {
          URL.revokeObjectURL(p.imageUrl);
        }
      });
    };
  }, [previews]);

  const handleUseTemplate = (template: TemplateConfig) => {
    const defaults = template.defaultProps;
    setStyling({
      template: template.id,
      backgroundColor: defaults.backgroundColor || "#000000",
      textColor: defaults.textColor || "#ffffff",
      accentColor: defaults.accentColor || "#3b82f6",
    });
  };

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Template Gallery
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Choose from {templateList.length} professionally designed templates.
            Each template is fully customizable.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {previews.map((preview) => (
            <Card
              key={preview.id}
              className="group overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-blue-500"
            >
              {/* Preview Image */}
              <div className="relative aspect-[1200/630] bg-neutral-800">
                {preview.isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-600 border-t-blue-500" aria-label="Loading preview" />
                  </div>
                ) : preview.imageUrl ? (
                  <img
                    src={preview.imageUrl}
                    alt={`${preview.config.name} template preview`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                    Preview unavailable
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">
                  {preview.config.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  {preview.config.description}
                </p>

                {/* Category Tag */}
                <div className="mt-3">
                  <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400 capitalize">
                    {preview.config.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link href="/" className="flex-1">
                    <Button
                      className="w-full"
                      onClick={() => handleUseTemplate(preview.config)}
                    >
                      Use Template
                    </Button>
                  </Link>
                  <Link href={`/templates/${preview.id}`}>
                    <Button variant="outline">
                      Customize
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-400">
            Can't find what you're looking for?
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-4">
              Create Custom Design
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
