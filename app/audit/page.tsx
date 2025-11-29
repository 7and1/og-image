import type { Metadata } from "next";
import AuditContent from "./AuditContent";

export const metadata: Metadata = {
  title: "Site Audit - Check OG Tags Across Your Website | og-image.org",
  description:
    "Free bulk Open Graph tag checker. Audit your entire website for OG tags. Check title, description, and image tags across all pages. Export results to CSV.",
  openGraph: {
    title: "Site Audit - Check OG Tags Across Your Website",
    description:
      "Free bulk Open Graph tag checker. Audit your entire website for OG tags.",
    url: "https://og-image.org/audit",
  },
};

export default function AuditPage() {
  return <AuditContent />;
}
