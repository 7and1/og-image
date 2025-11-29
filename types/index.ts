/**
 * Template identifiers
 */
export type TemplateId =
  | "gradient"
  | "minimal"
  | "modern"
  | "bold"
  | "split"
  | "glass"
  | "startup"
  | "blog";

/**
 * Font family options
 */
export type FontFamily = "inter" | "roboto" | "space-grotesk";

/**
 * Font size presets
 */
export type FontSize = "small" | "medium" | "large";

/**
 * Layout options for templates
 */
export type Layout = "center" | "left" | "split";

/**
 * Export code format options
 */
export type ExportTab = "nextjs" | "html" | "vercel";

/**
 * Props passed to template components
 * All templates must accept these props
 */
export interface TemplateProps {
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  layout?: Layout;
}

/**
 * Template configuration for the registry
 */
export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  category: "general" | "startup" | "blog" | "product" | "event" | "social";
  component: React.FC<TemplateProps>;
  defaultProps: Partial<TemplateProps>;
}

/**
 * OG Meta tags structure
 */
export interface OGMeta {
  "og:title"?: string;
  "og:description"?: string;
  "og:image"?: string;
  "og:image:width"?: string;
  "og:image:height"?: string;
  "og:url"?: string;
  "og:type"?: string;
  "og:site_name"?: string;
  "twitter:card"?: string;
  "twitter:title"?: string;
  "twitter:description"?: string;
  "twitter:image"?: string;
  title?: string; // Fallback from <title> tag
  description?: string; // Fallback from <meta name="description">
  [key: string]: string | undefined; // Allow additional properties
}

/**
 * Validation result for a single URL
 */
export interface ValidationResult {
  url: string;
  meta: OGMeta;
  score: number;
  issues: Array<{
    type: "error" | "warning" | "info";
    message: string;
  }>;
}

/**
 * Audit result for site-wide checking
 */
export interface AuditResult {
  url: string;
  status: "ok" | "warning" | "error" | "pending";
  meta: OGMeta;
  issues: string[];
}

/**
 * Social platform preview configuration
 */
export interface SocialPlatform {
  id: "twitter" | "linkedin" | "facebook" | "discord" | "slack";
  name: string;
  imageRatio: string;
  maxTitleLength: number;
  maxDescriptionLength: number;
}
