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

        {/* SEO Content Section */}
        <section className="mt-24 pt-16 border-t border-neutral-800">
          <h2 className="text-3xl font-bold text-white mb-6">
            Choosing the Right OG Image Template
          </h2>
          <div className="prose prose-invert prose-neutral max-w-none">
            <p className="text-lg text-neutral-300 leading-relaxed mb-6">
              Your OG image template isn't just about aesthetics—it's about instant
              recognition. When someone scrolls through their Twitter feed or LinkedIn
              timeline, your content has maybe half a second to register. The right
              template creates a visual pattern that people start to associate with
              your brand.
            </p>
            <p className="text-neutral-400 leading-relaxed mb-6">
              Think about it: every time someone sees your distinctive purple gradient
              or that clean minimal style with your logo, they're building a mental
              connection. After a while, they don't even need to read the title—they
              know it's from you. That's the power of consistent, template-based OG images.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Template Categories Explained
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-3">Gradient Templates</h3>
                <p className="text-neutral-400 text-sm">
                  Eye-catching color transitions that stand out in feeds. Best for tech
                  companies, startups, and modern brands. The gradient creates depth and
                  visual interest without needing images.
                </p>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-3">Minimal Templates</h3>
                <p className="text-neutral-400 text-sm">
                  Clean, typography-focused designs. Perfect for blogs, documentation,
                  and professional content. Let your words do the talking with maximum
                  readability.
                </p>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-3">Bold Templates</h3>
                <p className="text-neutral-400 text-sm">
                  High-contrast, attention-grabbing designs. Great for announcements,
                  product launches, and content that needs to cut through the noise.
                </p>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-3">Split Templates</h3>
                <p className="text-neutral-400 text-sm">
                  Two-panel layouts that balance text and visual elements. Ideal for
                  showcasing products, features, or comparisons with clear hierarchy.
                </p>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-3">Glass Templates</h3>
                <p className="text-neutral-400 text-sm">
                  Modern glassmorphism effects with frosted backgrounds. Perfect for
                  SaaS products, apps, and contemporary tech brands.
                </p>
              </div>

              <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-3">Blog Templates</h3>
                <p className="text-neutral-400 text-sm">
                  Content-focused layouts optimized for article previews. Include space
                  for titles, authors, and reading time indicators.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Best Practices for OG Templates
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-white">Stay Consistent</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    Use the same template family across your site. Consistency builds
                    recognition and trust over time.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-white">Match Your Brand</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    Customize colors to match your brand palette. Even a small color
                    tweak makes templates feel uniquely yours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-white">Test on Multiple Platforms</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    What looks great on Twitter might get cropped oddly on LinkedIn.
                    Use our validator to preview across platforms.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-neutral-900/50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-white">Keep Text Short</h3>
                  <p className="text-neutral-400 text-sm mt-1">
                    Aim for 5-10 words max. Long titles get truncated or become
                    unreadable on mobile feeds.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-2">
              Want to create dynamic templates?
            </h3>
            <p className="text-neutral-400 mb-4">
              Learn how to generate OG images programmatically with Satori for automatic
              template-based generation.
            </p>
            <Link
              href="/docs/dynamic-og"
              className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Read the Guide
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
