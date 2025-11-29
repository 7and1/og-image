import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { templateIds, getTemplate, type TemplateId } from "@/templates";
import TemplateEditor from "./TemplateEditor";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return templateIds.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug as TemplateId);

  if (!template) {
    return {
      title: "Template Not Found | og-image.org",
    };
  }

  return {
    title: `${template.name} Template - OG Image Generator | og-image.org`,
    description: `${template.description} Customize colors, text, and icons. Free to use, instant preview, no signup required.`,
    openGraph: {
      title: `${template.name} OG Image Template`,
      description: template.description,
      url: `https://og-image.org/templates/${slug}`,
    },
  };
}

function TemplateEditorLoading() {
  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 animate-pulse">
          <div className="h-4 w-32 bg-neutral-800 rounded mb-2" />
          <div className="h-8 w-64 bg-neutral-800 rounded mt-2" />
          <div className="h-4 w-48 bg-neutral-800 rounded mt-2" />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[1200/630] bg-neutral-800 rounded-lg animate-pulse" />
          <div className="space-y-6">
            <div className="h-48 bg-neutral-800 rounded-lg animate-pulse" />
            <div className="h-64 bg-neutral-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;

  // Validate template exists
  if (!templateIds.includes(slug as TemplateId)) {
    notFound();
  }

  return (
    <Suspense fallback={<TemplateEditorLoading />}>
      <TemplateEditor slug={slug} />
    </Suspense>
  );
}
