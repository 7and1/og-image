import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://og-image.org"),
  title: "OG Image Generator - Create Open Graph Images | og-image.org",
  description:
    "Free, open-source Open Graph image generator. Create beautiful social media preview images for Twitter, LinkedIn, and Facebook. Client-side rendering, zero data upload.",
  keywords: [
    "og image generator",
    "open graph image",
    "social media preview",
    "twitter card",
    "linkedin preview",
    "facebook share image",
    "meta tags",
    "seo",
  ],
  authors: [{ name: "og-image.org" }],
  openGraph: {
    title: "OG Image Generator - Create Open Graph Images",
    description:
      "Free, open-source Open Graph image generator. Create beautiful social media preview images.",
    url: "https://og-image.org",
    siteName: "og-image.org",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OG Image Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OG Image Generator - Create Open Graph Images",
    description:
      "Free, open-source Open Graph image generator. Create beautiful social media preview images.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://og-image.org",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "OG Image Generator",
  url: "https://og-image.org",
  description:
    "Free, open-source Open Graph image generator. Create beautiful social media preview images for Twitter, LinkedIn, and Facebook.",
  applicationCategory: "DesignApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Create OG images for social media",
    "Multiple templates",
    "Custom backgrounds",
    "Client-side rendering",
    "No data upload required",
    "Export as PNG or SVG",
  ],
  screenshot: "https://og-image.org/og-image.png",
  softwareHelp: {
    "@type": "CreativeWork",
    url: "https://og-image.org/docs",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "og-image.org",
  url: "https://og-image.org",
  logo: "https://og-image.org/logo.png",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preload critical assets for faster first render */}
        <link
          rel="preload"
          href="/resvg.wasm"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-neutral-950 text-white min-h-screen flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#171717",
              border: "1px solid #262626",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
