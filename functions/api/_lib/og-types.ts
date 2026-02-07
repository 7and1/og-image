export type OutputFormat = "png" | "svg";

export interface OgRequestParams {
  template: string;
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  backgroundMode: "color" | "photo";
  backgroundId: string | null;
  backgroundImageSrc: string | null;
  overlayOpacity: number;
  format: OutputFormat;
}

export type CatalogSource = "d1" | "static";

export interface TemplateCatalogItem {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultProps: {
    backgroundColor: string | null;
    textColor: string | null;
    accentColor: string | null;
    backgroundMode: "color" | "photo" | "upload" | null;
    backgroundId: string | null;
    overlayOpacity: number | null;
  };
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
  attribution: {
    photographerName: string | null;
    photographerUsername: string | null;
    photographerProfileUrl: string | null;
    unsplashPageUrl: string | null;
  };
}

export interface BackgroundCatalog {
  provider: "unsplash";
  app: string;
  generatedAt: string;
  categories: Array<{
    id: string;
    label: string;
    count: number;
    query: string;
  }>;
  items: BackgroundCatalogItem[];
}
