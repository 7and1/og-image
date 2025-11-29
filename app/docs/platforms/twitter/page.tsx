import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Twitter/X Card Guide - OG Image Specifications | og-image.org",
  description:
    "Complete Twitter/X card specifications for 2024. Learn image dimensions, meta tag requirements, and best practices for maximum engagement on X.",
  openGraph: {
    title: "Twitter/X Card Guide - OG Image Specifications",
    description:
      "Complete Twitter/X card specifications for 2024. Image dimensions, meta tags, and best practices.",
    url: "https://og-image.org/docs/platforms/twitter",
  },
};

export default function TwitterGuidePage() {
  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
        Twitter/X Card Image Guide
      </h1>

      <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
        Twitter (now X) is where news breaks and ideas spread. With over 500 million monthly active
        users and 6,000 tweets per second, standing out in the feed is crucial. Your card image is
        often the difference between a scroll-past and a click. Let me show you exactly how to
        optimize for maximum engagement.
      </p>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
        <p className="text-blue-400 font-medium">
          Updated for 2024: X has maintained Twitter's card specifications, but the algorithm now
          heavily favors native content. Cards still work, but pair them with engaging text.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Twitter Card Types
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Twitter supports four card types, but for link sharing, only two matter:
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Summary Card</h3>
          <p className="text-neutral-400 text-sm mb-2">
            Small square thumbnail on the left, title and description on the right.
          </p>
          <div className="text-xs text-neutral-500">
            Best for: Articles, blog posts where text is primary
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 ring-2 ring-blue-500/50">
          <h3 className="font-semibold text-white mb-2">Summary Large Image</h3>
          <p className="text-neutral-400 text-sm mb-2">
            Large image above title and description. Maximum visual impact.
          </p>
          <div className="text-xs text-blue-400">
            Recommended: 150% more engagement than summary cards
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Image Specifications
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Twitter is specific about image requirements. Get these wrong and your image either won't
        show or will be cropped awkwardly:
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-white font-semibold">Specification</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Summary Large Image</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Recommended Size</td>
              <td className="py-3 px-4 text-neutral-400">1200 × 630 px</td>
              <td className="py-3 px-4 text-neutral-400">800 × 800 px</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Minimum Size</td>
              <td className="py-3 px-4 text-neutral-400">600 × 314 px</td>
              <td className="py-3 px-4 text-neutral-400">144 × 144 px</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Maximum Size</td>
              <td className="py-3 px-4 text-neutral-400">4096 × 4096 px</td>
              <td className="py-3 px-4 text-neutral-400">4096 × 4096 px</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Aspect Ratio</td>
              <td className="py-3 px-4 text-neutral-400">1.91:1</td>
              <td className="py-3 px-4 text-neutral-400">1:1</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">File Size Limit</td>
              <td className="py-3 px-4 text-neutral-400">5 MB</td>
              <td className="py-3 px-4 text-neutral-400">5 MB</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Supported Formats</td>
              <td className="py-3 px-4 text-neutral-400">JPG, PNG, GIF, WEBP</td>
              <td className="py-3 px-4 text-neutral-400">JPG, PNG, GIF, WEBP</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
        <p className="text-yellow-400 font-medium">
          Pro tip: Always use 1200 × 630 for summary_large_image. It's the OG standard and works
          across all platforms, not just Twitter.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Required Meta Tags
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Twitter has its own meta tag namespace (<code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">twitter:</code>),
        but it will fall back to Open Graph tags if Twitter-specific ones aren't present.
        Here's the complete setup:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- Essential Twitter Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Your Title Here" />
<meta name="twitter:description" content="Your description here" />
<meta name="twitter:image" content="https://yoursite.com/og-image.png" />

<!-- Optional but Recommended -->
<meta name="twitter:image:alt" content="Description of the image" />
<meta name="twitter:site" content="@yourusername" />
<meta name="twitter:creator" content="@authorusername" />

<!-- Open Graph Fallbacks (if Twitter tags missing) -->
<meta property="og:title" content="Your Title Here" />
<meta property="og:description" content="Your description here" />
<meta property="og:image" content="https://yoursite.com/og-image.png" />`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Tag Breakdown</h3>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">twitter:card</h4>
          <p className="text-neutral-400 text-sm">
            Required. Set to <code className="bg-neutral-800 px-1 rounded">summary_large_image</code> for
            the full-width image, or <code className="bg-neutral-800 px-1 rounded">summary</code> for the small thumbnail.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">twitter:title</h4>
          <p className="text-neutral-400 text-sm">
            Maximum 70 characters. Goes above the description. Make it compelling—this is your headline.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">twitter:description</h4>
          <p className="text-neutral-400 text-sm">
            Maximum 200 characters. Supports the title with context. Gets truncated on mobile, so front-load key info.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">twitter:image</h4>
          <p className="text-neutral-400 text-sm">
            Must be an absolute URL (https://). Relative paths won't work. The image is cached, so use
            cache-busting for updates.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">twitter:image:alt</h4>
          <p className="text-neutral-400 text-sm">
            Accessibility description for screen readers. Maximum 420 characters. Required for WCAG compliance.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Design Best Practices
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Technically correct isn't enough. Here's what actually drives engagement:
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">1. Text Size and Readability</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Mobile feeds are ruthless. If users can't read your text while scrolling, you've lost.
        Rule of thumb: if the text looks big in your design tool, it's probably right.
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li>Title text: minimum 48px for visibility on mobile</li>
        <li>Secondary text: minimum 24px</li>
        <li>High contrast: dark text on light backgrounds (or vice versa)</li>
        <li>Sans-serif fonts: easier to read at small sizes</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">2. Safe Zones</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Twitter crops images differently on desktop vs mobile, and in timeline vs expanded view.
        Keep important content centered and away from edges:
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <p className="text-neutral-400 text-sm">
          <strong className="text-white">Safe zone:</strong> Keep all critical content within the
          center 80% of the image. That means 120px padding on each side for a 1200px wide image.
        </p>
      </div>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">3. Brand Recognition</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Consistent visual branding builds trust and recognition. Users who recognize your brand
        are more likely to click:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li>Use consistent colors across all your OG images</li>
        <li>Include your logo, but don't let it dominate</li>
        <li>Develop a template style and stick to it</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">4. Emotional Appeal</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Data shows that images triggering emotional responses get more engagement:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-8 space-y-2">
        <li>Human faces increase engagement by up to 38%</li>
        <li>Bright, saturated colors catch attention in a sea of muted content</li>
        <li>Curiosity gaps (partial information) drive clicks</li>
        <li>Numbers and statistics signal value</li>
      </ul>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        The Algorithm Factor
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Here's what the data tells us about X's algorithm and link cards:
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6">
        <ul className="text-neutral-400 text-sm space-y-2">
          <li>• External links get reduced reach compared to native content</li>
          <li>• Cards with images still outperform text-only tweets with links</li>
          <li>• Engagement (replies, quotes) matters more than likes for reach</li>
          <li>• First 30 minutes of engagement determines viral potential</li>
        </ul>
      </div>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        Strategy: Post the link, but add context that invites discussion. A great OG image
        captures attention; your tweet copy drives the conversation.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Testing Your Twitter Cards
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Before sharing, validate your cards. Twitter's Card Validator was deprecated, but you can
        still test by:
      </p>

      <ol className="list-decimal list-inside text-neutral-300 mb-8 space-y-3">
        <li>
          <strong className="text-white">Compose a tweet</strong>: Paste your URL in the composer. Twitter will
          attempt to load the card preview.
        </li>
        <li>
          <strong className="text-white">Use our validator</strong>: <Link href="/validator" className="text-blue-400 hover:text-blue-300">og-image.org/validator</Link> shows
          exactly how Twitter will render your card.
        </li>
        <li>
          <strong className="text-white">Check the cache</strong>: Twitter caches cards. If you updated your image,
          you might need to wait or use a different URL to see changes.
        </li>
      </ol>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Troubleshooting Common Issues
      </h2>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Card not showing at all</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Check that twitter:card meta tag is present</li>
            <li>• Verify image URL is absolute (starts with https://)</li>
            <li>• Ensure image is accessible (not behind auth or firewall)</li>
            <li>• Check robots.txt isn't blocking Twitterbot</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Image appears cropped wrong</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Use exactly 1200 × 630 pixels</li>
            <li>• Keep content centered (avoid edges)</li>
            <li>• Don't rely on the full height—Twitter may crop</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Old image still showing</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Twitter caches cards for ~7 days</li>
            <li>• Add a query param to force refresh: ?v=2</li>
            <li>• Wait and retry—cache eventually clears</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Summary instead of summary_large_image</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• twitter:card must be exactly "summary_large_image"</li>
            <li>• Image must meet minimum size requirements</li>
            <li>• Check for typos in meta tag names</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Quick Implementation Checklist
      </h2>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8">
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">Image is 1200 × 630 pixels</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">File size under 5 MB (ideally under 1 MB)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">twitter:card set to "summary_large_image"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">twitter:image uses absolute HTTPS URL</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">twitter:image:alt included for accessibility</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">Title under 70 characters</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">Description under 200 characters</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">Important content in center safe zone</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">Text readable on mobile screens</span>
          </li>
        </ul>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-12">
        <h3 className="font-semibold text-white mb-3">Ready to Create?</h3>
        <p className="text-neutral-400 mb-4">
          Use og-image.org to generate Twitter-optimized cards in seconds. All our templates
          are designed with Twitter's specifications in mind.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create Twitter Card
          </Link>
          <Link
            href="/validator"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Test Your Card
          </Link>
        </div>
      </div>
    </article>
  );
}
