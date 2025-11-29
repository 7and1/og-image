import type { Metadata } from "next";
import MetaTagsContent from "./MetaTagsContent";

export const metadata: Metadata = {
  title: "Meta Tag Generator - Create OG Tags | og-image.org",
  description:
    "Free Open Graph and Twitter Card meta tag generator. Create properly formatted meta tags for your website. Copy and paste ready HTML code.",
  openGraph: {
    title: "Meta Tag Generator - Create OG Tags",
    description:
      "Free Open Graph and Twitter Card meta tag generator for your website.",
    url: "https://og-image.org/meta-tags",
  },
};

export default function MetaTagsPage() {
  return <MetaTagsContent />;
}
