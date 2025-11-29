import type { Metadata } from "next";
import ValidatorContent from "./ValidatorContent";

export const metadata: Metadata = {
  title: "OG Tag Validator - Check Open Graph Meta Tags | og-image.org",
  description:
    "Free Open Graph validator. Check how your website appears on Twitter, LinkedIn, and Facebook. Analyze OG tags, get a validation score, and preview social shares.",
  openGraph: {
    title: "OG Tag Validator - Check Open Graph Meta Tags",
    description:
      "Free Open Graph validator. Check how your website appears on social media.",
    url: "https://og-image.org/validator",
  },
};

export default function ValidatorPage() {
  return <ValidatorContent />;
}
