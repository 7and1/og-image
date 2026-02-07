import { templateList } from "@/templates";
import type { TemplateCatalogItem } from "@/types";

interface TemplateListResponse {
  success: boolean;
  source: "d1" | "static";
  items: TemplateCatalogItem[];
}

let catalogPromise: Promise<TemplateCatalogItem[]> | null = null;

function isTemplateItem(input: unknown): input is TemplateCatalogItem {
  if (!input || typeof input !== "object") {
    return false;
  }

  const candidate = input as Partial<TemplateCatalogItem>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.description === "string" &&
    typeof candidate.category === "string"
  );
}

function isTemplateListResponse(input: unknown): input is TemplateListResponse {
  if (!input || typeof input !== "object") {
    return false;
  }

  const candidate = input as Partial<TemplateListResponse>;
  return (
    candidate.success === true &&
    Array.isArray(candidate.items) &&
    candidate.items.every(isTemplateItem)
  );
}

function buildLocalFallbackCatalog(): TemplateCatalogItem[] {
  return templateList.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    category: template.category,
    defaultProps: {
      backgroundColor:
        typeof template.defaultProps.backgroundColor === "string"
          ? template.defaultProps.backgroundColor
          : null,
      textColor:
        typeof template.defaultProps.textColor === "string"
          ? template.defaultProps.textColor
          : null,
      accentColor:
        typeof template.defaultProps.accentColor === "string"
          ? template.defaultProps.accentColor
          : null,
      backgroundMode:
        template.defaultProps.backgroundMode === "color" ||
        template.defaultProps.backgroundMode === "photo" ||
        template.defaultProps.backgroundMode === "upload"
          ? template.defaultProps.backgroundMode
          : null,
      backgroundId:
        typeof template.defaultProps.backgroundId === "string"
          ? template.defaultProps.backgroundId
          : null,
      overlayOpacity:
        typeof template.defaultProps.overlayOpacity === "number"
          ? template.defaultProps.overlayOpacity
          : null,
    },
  }));
}

async function loadCatalog(): Promise<TemplateCatalogItem[]> {
  try {
    const response = await fetch("/api/templates", {
      cache: "default",
    });

    if (!response.ok) {
      return buildLocalFallbackCatalog();
    }

    const json = (await response.json()) as unknown;
    if (!isTemplateListResponse(json)) {
      return buildLocalFallbackCatalog();
    }

    return json.items;
  } catch {
    return buildLocalFallbackCatalog();
  }
}

export async function getTemplateCatalog(): Promise<TemplateCatalogItem[]> {
  if (!catalogPromise) {
    catalogPromise = loadCatalog();
  }
  return catalogPromise;
}

export async function getTemplateCatalogItem(
  id: string
): Promise<TemplateCatalogItem | null> {
  const items = await getTemplateCatalog();
  return items.find((item) => item.id === id) ?? null;
}
