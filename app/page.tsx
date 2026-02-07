"use client";

import { useEffect, useMemo, useRef } from "react";
import { useStore, useActions } from "@/store/useStore";
import { getTemplateComponent } from "@/templates";
import { renderToBlob, preloadEngine } from "@/lib/engine";
import { getBackgroundById } from "@/lib/background-catalog";
import { EditorPanel } from "@/components/editor";
import { PreviewCanvas, SocialPreview } from "@/components/preview";
import { ExportSection } from "@/components/export";
import { ContentSection } from "@/components/home/ContentSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

export default function Home() {
  const {
    title,
    description,
    icon,
    template,
    backgroundColor,
    textColor,
    accentColor,
    backgroundMode,
    backgroundId,
    backgroundImageSrc,
    overlayOpacity,
    previewUrl,
  } = useStore();

  const { setUI, setBackground } = useActions();
  const previousUrlRef = useRef<string | null>(null);

  // Preload engine on mount
  useEffect(() => {
    preloadEngine();
  }, []);

  // Memoize the template element
  const templateElement = useMemo(() => {
    const TemplateComponent = getTemplateComponent(template);
    return (
      <TemplateComponent
        title={title}
        description={description}
        icon={icon}
        backgroundColor={backgroundColor}
        textColor={textColor}
        accentColor={accentColor}
        backgroundMode={backgroundMode}
        backgroundId={backgroundId}
        backgroundImageSrc={backgroundImageSrc}
        overlayOpacity={overlayOpacity}
      />
    );
  }, [
    title,
    description,
    icon,
    template,
    backgroundColor,
    textColor,
    accentColor,
    backgroundMode,
    backgroundId,
    backgroundImageSrc,
    overlayOpacity,
  ]);

  // When selecting a catalog photo background, map id -> actual image URL.
  useEffect(() => {
    const applyCatalogBackground = async () => {
      if (backgroundMode !== "photo" || !backgroundId) {
        return;
      }

      const item = await getBackgroundById(backgroundId);
      if (!item) {
        return;
      }

      if (backgroundImageSrc !== item.urls.og) {
        setBackground({ backgroundImageSrc: item.urls.og });
      }
    };

    applyCatalogBackground().catch(() => {});
  }, [backgroundMode, backgroundId, backgroundImageSrc, setBackground]);

  // Debounced render effect
  useEffect(() => {
    setUI({ isGenerating: true, error: null });

    const timer = setTimeout(async () => {
      try {
        const url = await renderToBlob(templateElement);

        // Revoke previous URL to prevent memory leak
        if (previousUrlRef.current) {
          URL.revokeObjectURL(previousUrlRef.current);
        }

        previousUrlRef.current = url;
        setUI({ previewUrl: url, isGenerating: false });
      } catch (error) {
        console.error("Render failed:", error);
        setUI({
          error: error instanceof Error ? error.message : "Render failed",
          isGenerating: false,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [templateElement, setUI]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* H1 - Core keyword for SEO */}
      <div className="bg-neutral-950 border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Free OG Image Generator
          </h1>
          <p className="mt-3 text-base sm:text-lg text-neutral-400">
            Create stunning social preview images in seconds
          </p>
        </div>
      </div>

      {/* Generator Tool */}
      <div id="generator" className="flex min-h-[calc(100vh-200px)]">
        {/* Left Panel - Editor */}
        <EditorPanel />

        {/* Right Panel - Preview & Export */}
        <div className="flex-1 overflow-y-auto bg-neutral-950 p-6 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Main Preview */}
            <section>
              <h2 className="mb-4 text-sm font-medium text-neutral-400">
                Preview
              </h2>
              <PreviewCanvas />
            </section>

            {/* Social Previews */}
            <section>
              <h2 className="mb-4 text-sm font-medium text-neutral-400">
                Social Media Previews
              </h2>
              <Tabs defaultValue="twitter">
                <TabsList>
                  <TabsTrigger value="twitter">Twitter</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                  <TabsTrigger value="facebook">Facebook</TabsTrigger>
                </TabsList>

                <TabsContent value="twitter">
                  <SocialPreview
                    platform="twitter"
                    title={title}
                    description={description}
                    imageUrl={previewUrl}
                  />
                </TabsContent>

                <TabsContent value="linkedin">
                  <SocialPreview
                    platform="linkedin"
                    title={title}
                    description={description}
                    imageUrl={previewUrl}
                  />
                </TabsContent>

                <TabsContent value="facebook">
                  <SocialPreview
                    platform="facebook"
                    title={title}
                    description={description}
                    imageUrl={previewUrl}
                  />
                </TabsContent>
              </Tabs>
            </section>

            {/* Export Section */}
            <section>
              <h2 className="mb-4 text-sm font-medium text-neutral-400">
                Export
              </h2>
              <ExportSection />
            </section>
          </div>
        </div>
      </div>

      {/* Educational Content Section - SEO */}
      <ContentSection />
    </>
  );
}
