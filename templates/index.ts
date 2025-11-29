import type { TemplateId, TemplateConfig, TemplateProps } from "@/types";

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
      backgroundColor: "#000000",
      textColor: "#ffffff",
      accentColor: "#22c55e",
    },
  },
  glass: {
    id: "glass",
    name: "Glass",
    description: "Glassmorphism-inspired design with frosted effect",
    category: "startup",
    component: GlassTemplate,
    defaultProps: {
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
      backgroundColor: "#fafafa",
      textColor: "#171717",
      accentColor: "#8b5cf6",
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
