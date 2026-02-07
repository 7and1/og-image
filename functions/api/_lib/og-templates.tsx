import type { ReactElement } from "react";
import type { OgRequestParams } from "./og-types";
import type { TemplateProps } from "../../../types";

import { GradientTemplate } from "../../../templates/gradient";
import { MinimalTemplate } from "../../../templates/minimal";
import { ModernTemplate } from "../../../templates/modern";
import { BoldTemplate } from "../../../templates/bold";
import { SplitTemplate } from "../../../templates/split";
import { GlassTemplate } from "../../../templates/glass";
import { StartupTemplate } from "../../../templates/startup";
import { BlogTemplate } from "../../../templates/blog";
import { PhotoHeroTemplate } from "../../../templates/photo-hero";
import { PhotoGlassTemplate } from "../../../templates/photo-glass";
import { PhotoCaptionTemplate } from "../../../templates/photo-caption";
import { PhotoSplitTemplate } from "../../../templates/photo-split";
import { PhotoDuotoneTemplate } from "../../../templates/photo-duotone";
import { PhotoFrameTemplate } from "../../../templates/photo-frame";

const TEMPLATE_COMPONENTS = {
  gradient: GradientTemplate,
  minimal: MinimalTemplate,
  modern: ModernTemplate,
  bold: BoldTemplate,
  split: SplitTemplate,
  glass: GlassTemplate,
  startup: StartupTemplate,
  blog: BlogTemplate,
  "photo-hero": PhotoHeroTemplate,
  "photo-glass": PhotoGlassTemplate,
  "photo-caption": PhotoCaptionTemplate,
  "photo-split": PhotoSplitTemplate,
  "photo-duotone": PhotoDuotoneTemplate,
  "photo-frame": PhotoFrameTemplate,
} as const;

export type OgTemplateId = keyof typeof TEMPLATE_COMPONENTS;

export const DEFAULT_TEMPLATE: OgTemplateId = "gradient";

export function isOgTemplateId(value: string): value is OgTemplateId {
  return Object.prototype.hasOwnProperty.call(TEMPLATE_COMPONENTS, value);
}

export function renderTemplate(params: OgRequestParams): ReactElement {
  const templateId = isOgTemplateId(params.template)
    ? params.template
    : DEFAULT_TEMPLATE;
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId];

  const props: TemplateProps = {
    title: params.title,
    description: params.description,
    icon: params.icon,
    backgroundColor: params.backgroundColor,
    textColor: params.textColor,
    accentColor: params.accentColor,
    backgroundMode: params.backgroundMode,
    backgroundId: params.backgroundId,
    backgroundImageSrc: params.backgroundImageSrc,
    overlayOpacity: params.overlayOpacity,
  };

  return <TemplateComponent {...props} />;
}
