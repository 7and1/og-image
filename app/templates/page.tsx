import type { Metadata } from "next";
import TemplatesContent from "./TemplatesContent";

export const metadata: Metadata = {
  title: "OG Image Templates - Professional Designs | og-image.org",
  description:
    "Browse 8 professionally designed Open Graph image templates. Gradient, minimal, modern, bold, and more. Free to use, fully customizable, instant preview.",
  openGraph: {
    title: "OG Image Templates - Professional Designs",
    description:
      "Browse 8 professionally designed Open Graph image templates. Free and customizable.",
    url: "https://og-image.org/templates",
  },
};

export default function TemplatesPage() {
  return <TemplatesContent />;
}
