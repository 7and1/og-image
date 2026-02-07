"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useActions } from "@/store/useStore";
import {
  templateList,
  getTemplateComponent,
  getTemplate,
  type TemplateConfig,
  type TemplateId,
} from "@/templates";
import { renderToBlob, preloadEngine } from "@/lib/engine";
import { getTemplateCatalog } from "@/lib/template-catalog";
import { Button, Card } from "@/components/ui";

interface TemplatePreview {
  id: TemplateId;
  config: TemplateConfig;
  imageUrl: string | null;
  isLoading: boolean;
}

interface TemplateDetails {
  name: string;
  description: string;
  category: string;
}

function mapTemplateDetailsById(
  source: Awaited<ReturnType<typeof getTemplateCatalog>>
): Record<TemplateId, TemplateDetails> {
  const details = {} as Record<TemplateId, TemplateDetails>;

  for (const item of source) {
    if (item.id in details) {
      continue;
    }

    const maybeTemplate = templateList.find((template) => template.id === item.id);
    if (!maybeTemplate) {
      continue;
    }

    const id = maybeTemplate.id;
    details[id] = {
      name: item.name,
      description: item.description,
      category: item.category,
    };
  }

  return details;
}

export default function TemplatesContent() {
  const { setStyling } = useActions();
  const [previews, setPreviews] = useState<TemplatePreview[]>(
    templateList.map((template) => ({
      id: template.id,
      config: template,
      imageUrl: null,
      isLoading: true,
    }))
  );
  const [templateDetails, setTemplateDetails] = useState<
    Partial<Record<TemplateId, TemplateDetails>>
  >({});

  const previewsRef = useRef<TemplatePreview[]>(previews);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  // Preload render engine
  useEffect(() => {
    preloadEngine();
  }, []);

  // Load template metadata from API (D1-aware) with local fallback baked into lib
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const items = await getTemplateCatalog();
      if (cancelled) {
        return;
      }
      const detailsById = mapTemplateDetailsById(items);
      setTemplateDetails(detailsById);
    };

    load().catch(() => {
      if (cancelled) {
        return;
      }
      setTemplateDetails({});
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Generate previews for all templates
  useEffect(() => {
    let cancelled = false;

    const generatePreviews = async () => {
      for (const template of templateList) {
        if (cancelled) {
          return;
        }

        try {
          const TemplateComponent = getTemplateComponent(template.id);
          const defaults = template.defaultProps;
          const element = (
            <TemplateComponent
              title="Your Amazing Title"
              description="A compelling description that captures attention"
              icon="✨"
              backgroundColor={defaults.backgroundColor || "#000000"}
              textColor={defaults.textColor || "#ffffff"}
              accentColor={defaults.accentColor || "#3b82f6"}
              backgroundMode={defaults.backgroundMode}
              backgroundId={defaults.backgroundId ?? null}
              backgroundImageSrc={defaults.backgroundImageSrc ?? null}
              overlayOpacity={defaults.overlayOpacity}
            />
          );

          const url = await renderToBlob(element);

          if (cancelled) {
            URL.revokeObjectURL(url);
            return;
          }

          setPreviews((previous) => {
            const existing = previous.find((item) => item.id === template.id);
            if (existing?.imageUrl) {
              URL.revokeObjectURL(existing.imageUrl);
            }

            return previous.map((item) =>
              item.id === template.id
                ? { ...item, imageUrl: url, isLoading: false }
                : item
            );
          });
        } catch (error) {
          console.error(`Failed to generate preview for ${template.id}:`, error);
          if (cancelled) {
            return;
          }
          setPreviews((previous) =>
            previous.map((item) =>
              item.id === template.id ? { ...item, isLoading: false } : item
            )
          );
        }
      }
    };

    generatePreviews().catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  // Cleanup all blob URLs on unmount
  useEffect(() => {
    return () => {
      for (const preview of previewsRef.current) {
        if (preview.imageUrl) {
          URL.revokeObjectURL(preview.imageUrl);
        }
      }
    };
  }, []);

  const cards = useMemo(() => {
    return previews.map((preview) => {
      const fallback = getTemplate(preview.id);
      const details = templateDetails[preview.id] ?? {
        name: fallback.name,
        description: fallback.description,
        category: fallback.category,
      };

      return {
        ...preview,
        details,
      };
    });
  }, [previews, templateDetails]);

  const handleUseTemplate = (templateId: TemplateId) => {
    const template = getTemplate(templateId);
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
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Template Gallery
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Choose from {templateList.length} production-ready templates and customize every detail.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              className="group overflow-hidden transition-all duration-200 hover:ring-2 hover:ring-blue-500"
            >
              <div className="relative aspect-[1200/630] bg-neutral-800">
                {card.isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-600 border-t-blue-500"
                      aria-label="Loading preview"
                    />
                  </div>
                ) : card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={`${card.details.name} template preview`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                    Preview unavailable
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-white">{card.details.name}</h2>
                <p className="mt-1 text-sm text-neutral-400">{card.details.description}</p>

                <div className="mt-3">
                  <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400 capitalize">
                    {card.details.category}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link href="/" className="flex-1">
                    <Button className="w-full" onClick={() => handleUseTemplate(card.id)}>
                      Use Template
                    </Button>
                  </Link>
                  <Link href={`/templates/${card.id}`}>
                    <Button variant="outline">Customize</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
