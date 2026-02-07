import type { TemplateId, TemplateConfig, TemplateProps } from "../types";

// Re-export types for convenience
export type { TemplateId, TemplateConfig, TemplateProps };
import { GradientTemplate } from "./gradient";
import { MinimalTemplate } from "./minimal";
import { ModernTemplate } from "./modern";
import { BoldTemplate } from "./bold";
import { SplitTemplate } from "./split";
import { GlassTemplate } from "./glass";
import { StartupTemplate } from "./startup";
import { BlogTemplate } from "./blog";
import { PhotoHeroTemplate } from "./photo-hero";
import { PhotoGlassTemplate } from "./photo-glass";
import { PhotoCaptionTemplate } from "./photo-caption";
import { PhotoSplitTemplate } from "./photo-split";
import { PhotoDuotoneTemplate } from "./photo-duotone";
import { PhotoFrameTemplate } from "./photo-frame";

import backgroundCatalog from "../public/catalog/backgrounds.json";

const defaultPhotoByCategory = new Map<string, { id: string; url: string }>();

function pickDefaultPhoto(categoryId: string): { id: string; url: string } | null {
  const cached = defaultPhotoByCategory.get(categoryId);
  if (cached) {
    return cached;
  }

  const item = backgroundCatalog.items.find((candidate) => candidate.category === categoryId);
  if (!item) {
    return null;
  }

  const value = { id: item.id, url: item.urls.og };
  defaultPhotoByCategory.set(categoryId, value);
  return value;
}

const defaultPhotoAbstract = pickDefaultPhoto("abstract");
const defaultPhotoTechnology = pickDefaultPhoto("technology");
const defaultPhotoNature = pickDefaultPhoto("nature");
const defaultPhotoCity = pickDefaultPhoto("city");
const defaultPhotoSpace = pickDefaultPhoto("space");
const defaultPhotoArchitecture = pickDefaultPhoto("architecture");

/**
 * Template registry with all available templates
 */
export const templates: Record<TemplateId, TemplateConfig> = {
  gradient: {
    id: "gradient",
    name: "Gradient",
    description: "Beautiful gradient backgrounds with centered content",
    category: "general",
    component: GradientTemplate,
    defaultProps: {
      backgroundMode: "color",
      backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design with lots of whitespace",
    category: "general",
    component: MinimalTemplate,
    defaultProps: {
      backgroundMode: "color",
      backgroundColor: "#ffffff",
      textColor: "#171717",
      accentColor: "#3b82f6",
    },
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Sleek dark design with neon accent colors",
    category: "startup",
    component: ModernTemplate,
    defaultProps: {
      backgroundMode: "color",
      backgroundColor: "#0f172a",
      textColor: "#f8fafc",
      accentColor: "#38bdf8",
    },
  },
  bold: {
    id: "bold",
    name: "Bold",
    description: "High contrast, attention-grabbing design",
    category: "event",
    component: BoldTemplate,
    defaultProps: {
      backgroundMode: "color",
      backgroundColor: "#dc2626",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
    },
  },
  split: {
    id: "split",
    name: "Split",
    description: "Two-column layout with icon on one side",
    category: "product",
    component: SplitTemplate,
    defaultProps: {
      backgroundMode: "color",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      accentColor: "#22c55e",
      layout: "split",
    },
  },
  glass: {
    id: "glass",
    name: "Glass",
    description: "Glassmorphism-inspired design with frosted effect",
    category: "startup",
    component: GlassTemplate,
    defaultProps: {
      backgroundMode: "color",
      backgroundColor: "linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)",
      textColor: "#ffffff",
      accentColor: "#60a5fa",
    },
  },
  startup: {
    id: "startup",
    name: "Startup",
    description: "Clean, professional startup vibe with subtle branding",
    category: "startup",
    component: StartupTemplate,
    defaultProps: {
      backgroundMode: "color",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      accentColor: "#22c55e",
    },
  },
  blog: {
    id: "blog",
    name: "Blog",
    description: "Clean reading-focused design for articles",
    category: "blog",
    component: BlogTemplate,
    defaultProps: {
      backgroundMode: "color",
      backgroundColor: "#fafafa",
      textColor: "#171717",
      accentColor: "#8b5cf6",
    },
  },
  "photo-hero": {
    id: "photo-hero",
    name: "Photo Hero",
    description: "Full-bleed photo background with bold headline",
    category: "social",
    component: PhotoHeroTemplate,
    defaultProps: {
      backgroundMode: "photo",
      backgroundColor: "#0b1220",
      textColor: "#ffffff",
      accentColor: "#38bdf8",
      backgroundId: defaultPhotoAbstract?.id ?? null,
      backgroundImageSrc: defaultPhotoAbstract?.url ?? null,
      overlayOpacity: 0.55,
    },
  },
  "photo-glass": {
    id: "photo-glass",
    name: "Photo Glass",
    description: "Glassmorphism card on top of a photo background",
    category: "startup",
    component: PhotoGlassTemplate,
    defaultProps: {
      backgroundMode: "photo",
      backgroundColor: "#0b1220",
      textColor: "#ffffff",
      accentColor: "#a78bfa",
      backgroundId: defaultPhotoTechnology?.id ?? null,
      backgroundImageSrc: defaultPhotoTechnology?.url ?? null,
      overlayOpacity: 0.55,
    },
  },
  "photo-caption": {
    id: "photo-caption",
    name: "Photo Caption",
    description: "Photo background with a strong caption bar",
    category: "blog",
    component: PhotoCaptionTemplate,
    defaultProps: {
      backgroundMode: "photo",
      backgroundColor: "#0b1220",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
      backgroundId: defaultPhotoNature?.id ?? null,
      backgroundImageSrc: defaultPhotoNature?.url ?? null,
      overlayOpacity: 0.65,
    },
  },
  "photo-split": {
    id: "photo-split",
    name: "Photo Split",
    description: "Photo left, information panel right",
    category: "product",
    component: PhotoSplitTemplate,
    defaultProps: {
      backgroundMode: "photo",
      backgroundColor: "#0b1220",
      textColor: "#ffffff",
      accentColor: "#22c55e",
      backgroundId: defaultPhotoCity?.id ?? null,
      backgroundImageSrc: defaultPhotoCity?.url ?? null,
      overlayOpacity: 0.55,
    },
  },
  "photo-duotone": {
    id: "photo-duotone",
    name: "Photo Duotone",
    description: "Duotone overlay photo background for brand cohesion",
    category: "social",
    component: PhotoDuotoneTemplate,
    defaultProps: {
      backgroundMode: "photo",
      backgroundColor: "#050b16",
      textColor: "#ffffff",
      accentColor: "#06b6d4",
      backgroundId: defaultPhotoSpace?.id ?? null,
      backgroundImageSrc: defaultPhotoSpace?.url ?? null,
      overlayOpacity: 0.7,
    },
  },
  "photo-frame": {
    id: "photo-frame",
    name: "Photo Frame",
    description: "Magazine-style framed photo cover",
    category: "event",
    component: PhotoFrameTemplate,
    defaultProps: {
      backgroundMode: "photo",
      backgroundColor: "#0b1220",
      textColor: "#ffffff",
      accentColor: "#f472b6",
      backgroundId: defaultPhotoArchitecture?.id ?? null,
      backgroundImageSrc: defaultPhotoArchitecture?.url ?? null,
      overlayOpacity: 0.5,
    },
  },
};

/**
 * Get all templates as an array
 */
export const templateList = Object.values(templates);

/**
 * Get templates grouped by category
 */
export const templatesByCategory = templateList.reduce(
  (acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  },
  {} as Record<string, TemplateConfig[]>
);

/**
 * Get a specific template by ID
 */
export function getTemplate(id: TemplateId): TemplateConfig {
  return templates[id] || templates.gradient;
}

/**
 * Get the template component by ID
 */
export function getTemplateComponent(
  id: TemplateId
): React.FC<TemplateProps> {
  return templates[id]?.component || templates.gradient.component;
}

/**
 * Get all template IDs
 */
export const templateIds: TemplateId[] = Object.keys(templates) as TemplateId[];

/**
 * Category labels for UI
 */
export const categoryLabels: Record<string, string> = {
  general: "General",
  startup: "Startup",
  blog: "Blog",
  product: "Product",
  event: "Event",
  social: "Social",
};

export default templates;
