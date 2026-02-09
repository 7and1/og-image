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
  | "blog"
  | "photo-hero"
  | "photo-glass"
  | "photo-caption"
  | "photo-split"
  | "photo-duotone"
  | "photo-frame";

/**
 * Background mode options
 */
export type BackgroundMode = "color" | "photo" | "upload";

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
  backgroundMode?: BackgroundMode;
  backgroundId?: string | null;
  backgroundImageSrc?: string | null;
  overlayOpacity?: number;
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  layout?: Layout;
}

export interface BackgroundAttribution {
  photographerName: string | null;
  photographerUsername: string | null;
  photographerProfileUrl: string | null;
  unsplashPageUrl: string | null;
}

export interface BackgroundCatalogItem {
  id: string;
  provider: "unsplash";
  category: string;
  title: string | null;
  dominantColor: string | null;
  width: number | null;
  height: number | null;
  blurHash: string | null;
  urls: {
    og: string;
    small: string;
    thumb: string;
    raw: string;
  };
  attribution: BackgroundAttribution;
}

export interface BackgroundCatalogCategory {
  id: string;
  label: string;
  count: number;
  query: string;
}

export interface BackgroundCatalog {
  provider: "unsplash";
  app: string;
  generatedAt: string;
  categories: BackgroundCatalogCategory[];
  items: BackgroundCatalogItem[];
}

export interface TemplateCatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultProps: {
    backgroundColor: string | null;
    textColor: string | null;
    accentColor: string | null;
    backgroundMode: BackgroundMode | null;
    backgroundId: string | null;
    overlayOpacity: number | null;
  };
}

export interface MyTemplatePayload {
  title: string;
  description: string;
  icon: string;
  template: TemplateId;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundMode: BackgroundMode;
  backgroundId: string | null;
  backgroundImageSrc: string | null;
  overlayOpacity: number;
  fontFamily: FontFamily;
  fontSize: FontSize;
  layout: Layout;
}

export interface MyTemplateItem {
  id: string;
  userKey: string;
  name: string;
  templateId: string | null;
  payload: MyTemplatePayload;
  createdAt: string;
  updatedAt: string;
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
