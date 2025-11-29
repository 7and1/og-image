import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LinkedIn OG Image Guide - Post Preview Specifications | og-image.org",
  description:
    "Complete LinkedIn post preview specifications. Learn optimal image dimensions, meta tag requirements, and professional best practices for B2B engagement.",
  openGraph: {
    title: "LinkedIn OG Image Guide - Post Preview Specifications",
    description:
      "Complete LinkedIn post preview specifications for professional engagement.",
    url: "https://og-image.org/docs/platforms/linkedin",
  },
};

export default function LinkedInGuidePage() {
  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
        LinkedIn Post Preview Image Guide
      </h1>

      <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
        LinkedIn is the world's largest professional network with over 900 million members.
        Unlike Twitter or Facebook, LinkedIn users are in business mode—they're looking for
        valuable content, industry insights, and professional opportunities. Your OG image
        needs to reflect that professionalism while still catching attention.
      </p>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
        <p className="text-blue-400 font-medium">
          Key insight: LinkedIn reports that posts with images get 2x more engagement than
          text-only posts. But quality matters—generic stock photos can actually hurt your
          credibility in the B2B space.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Image Specifications
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        LinkedIn has specific requirements for link preview images. Here's the complete breakdown:
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-white font-semibold">Specification</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Recommended</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Minimum</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Image Dimensions</td>
              <td className="py-3 px-4 text-neutral-400">1200 × 627 px</td>
              <td className="py-3 px-4 text-neutral-400">200 × 200 px</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Aspect Ratio</td>
              <td className="py-3 px-4 text-neutral-400">1.91:1</td>
              <td className="py-3 px-4 text-neutral-400">N/A</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Maximum File Size</td>
              <td className="py-3 px-4 text-neutral-400">5 MB</td>
              <td className="py-3 px-4 text-neutral-400">N/A</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Supported Formats</td>
              <td className="py-3 px-4 text-neutral-400">PNG, JPEG, GIF</td>
              <td className="py-3 px-4 text-neutral-400">N/A</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Title Length</td>
              <td className="py-3 px-4 text-neutral-400">Under 70 chars</td>
              <td className="py-3 px-4 text-neutral-400">N/A</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Description Length</td>
              <td className="py-3 px-4 text-neutral-400">Under 100 chars</td>
              <td className="py-3 px-4 text-neutral-400">N/A</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
        <p className="text-yellow-400 font-medium">
          Note: LinkedIn recommends 1200 × 627 (1.91:1), but 1200 × 630 works perfectly and
          is the universal standard. Use 1200 × 630 for consistency across all platforms.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Required Meta Tags
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        LinkedIn reads Open Graph tags directly—no special LinkedIn namespace needed. Here's the
        optimal setup:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- Essential Open Graph Tags for LinkedIn -->
<meta property="og:type" content="article" />
<meta property="og:url" content="https://yoursite.com/page" />
<meta property="og:title" content="Your Compelling Title" />
<meta property="og:description" content="A brief, value-focused description" />
<meta property="og:image" content="https://yoursite.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Additional Recommended Tags -->
<meta property="og:site_name" content="Your Company Name" />
<meta property="article:author" content="Author Name" />
<meta property="article:published_time" content="2024-01-15T08:00:00Z" />

<!-- LinkedIn-Specific (for articles) -->
<meta name="author" content="Author Name" />`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Tag Best Practices</h3>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:type</h4>
          <p className="text-neutral-400 text-sm">
            Use <code className="bg-neutral-800 px-1 rounded">article</code> for blog posts and content pieces,
            <code className="bg-neutral-800 px-1 rounded">website</code> for landing pages. LinkedIn respects
            this and may show publish dates for articles.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:title</h4>
          <p className="text-neutral-400 text-sm">
            LinkedIn truncates around 70 characters on desktop, fewer on mobile. Front-load your value proposition.
            Avoid clickbait—LinkedIn's professional audience sees through it.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:description</h4>
          <p className="text-neutral-400 text-sm">
            Aim for 100-120 characters. LinkedIn shows about 2-3 lines depending on the context.
            Focus on what readers will learn or gain—B2B audiences want ROI.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:image</h4>
          <p className="text-neutral-400 text-sm">
            Must be an absolute URL. LinkedIn caches images aggressively—use the Post Inspector to
            force a refresh when updating.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Design for Professional Audiences
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        LinkedIn is a different animal. Your OG images need to balance professionalism with
        visual appeal. Here's what works:
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">1. Professional Color Palettes</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        LinkedIn's interface is predominantly blue and white. Your images should complement,
        not clash:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li><strong className="text-white">Safe bets:</strong> Navy, dark gray, forest green, deep purple</li>
        <li><strong className="text-white">Accent sparingly:</strong> Bright colors for emphasis only</li>
        <li><strong className="text-white">Avoid:</strong> Neon colors, overly playful palettes</li>
        <li><strong className="text-white">Brand colors:</strong> Use them consistently for recognition</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">2. Typography That Commands Respect</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Font choice signals professionalism. What works on Instagram may look amateurish here:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li>Use clean, readable fonts (Inter, Plus Jakarta Sans, Poppins)</li>
        <li>Avoid decorative or script fonts for headlines</li>
        <li>Bold titles, regular weight for supporting text</li>
        <li>Minimum 48px for main titles to ensure mobile readability</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">3. Content That Signals Value</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        LinkedIn users are scanning for content worth their time. Your image should communicate
        value immediately:
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Do Include</h4>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Specific numbers ("5 Ways to...", "37% increase")</li>
            <li>• Industry-relevant terminology</li>
            <li>• Your company logo (subtle)</li>
            <li>• Author headshots for thought leadership</li>
          </ul>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Avoid</h4>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Generic stock photos</li>
            <li>• Clickbait headlines</li>
            <li>• Excessive emoji or symbols</li>
            <li>• Meme formats (save for Twitter)</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        LinkedIn Algorithm Insights
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Understanding how LinkedIn treats link posts helps you optimize effectively:
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-8">
        <ul className="text-neutral-400 text-sm space-y-3">
          <li>
            <strong className="text-white">Dwell time matters:</strong> LinkedIn tracks how long
            users spend looking at your post. A compelling image increases dwell time.
          </li>
          <li>
            <strong className="text-white">Native content wins:</strong> Like other platforms, LinkedIn
            prioritizes native content. Consider posting key insights directly with a link in comments.
          </li>
          <li>
            <strong className="text-white">First hour is critical:</strong> Engagement in the first
            60 minutes determines reach. Post when your audience is online.
          </li>
          <li>
            <strong className="text-white">Comments &gt; reactions:</strong> Meaningful comments signal
            quality content. Ask questions to drive discussion.
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Testing with LinkedIn Post Inspector
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        LinkedIn provides an official tool to validate and refresh your link previews:
      </p>

      <ol className="list-decimal list-inside text-neutral-300 mb-8 space-y-3">
        <li>
          Go to <span className="text-neutral-400">linkedin.com/post-inspector</span>
        </li>
        <li>
          Enter your URL and click "Inspect"
        </li>
        <li>
          Review the preview—check title, description, and image
        </li>
        <li>
          If you've updated your OG tags, click "Refresh" to clear LinkedIn's cache
        </li>
      </ol>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
        <p className="text-yellow-400 font-medium">
          LinkedIn cache tip: If the Post Inspector shows old data even after refresh, add a
          query parameter to your URL (?v=2) to force a new scrape.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Troubleshooting Common Issues
      </h2>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Image not appearing</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Verify og:image URL is absolute and accessible</li>
            <li>• Check image dimensions meet minimum (200×200)</li>
            <li>• Ensure server doesn't block LinkedIn's crawler</li>
            <li>• Use Post Inspector to force re-scrape</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Wrong image showing</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• LinkedIn cached an old version—use Post Inspector to refresh</li>
            <li>• Multiple og:image tags? LinkedIn uses the first one</li>
            <li>• Check for conflicting meta tags from plugins</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Image cropped incorrectly</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Use 1200×630 dimensions for optimal display</li>
            <li>• Keep important content in the center 80%</li>
            <li>• Avoid text near edges</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Description showing wrong text</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Check og:description meta tag is present</li>
            <li>• LinkedIn may fall back to page content if missing</li>
            <li>• Keep descriptions concise (under 120 chars)</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        LinkedIn-Specific Tips
      </h2>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">For Company Pages</h3>
          <p className="text-neutral-400 text-sm">
            Use consistent branding across all OG images. Include your logo but don't make it
            the focus—the content should be primary.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">For Personal Posts</h3>
          <p className="text-neutral-400 text-sm">
            Consider including your headshot for thought leadership content. It builds personal
            brand recognition in the feed.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">For Articles</h3>
          <p className="text-neutral-400 text-sm">
            LinkedIn Articles use the cover image as the OG image. Set it explicitly in the
            article editor for best results.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-12">
        <h3 className="font-semibold text-white mb-3">Create Professional OG Images</h3>
        <p className="text-neutral-400 mb-4">
          Use og-image.org to create LinkedIn-optimized images that command attention in the feed.
          Our templates are designed for professional audiences.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create LinkedIn Image
          </Link>
          <Link
            href="/validator"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Validate Preview
          </Link>
        </div>
      </div>
    </article>
  );
}
