import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Facebook OG Image Guide - Share Preview Specifications | og-image.org",
  description:
    "Complete Facebook Open Graph image specifications. Learn optimal dimensions, meta tag requirements, and best practices for maximum reach on Facebook.",
  openGraph: {
    title: "Facebook OG Image Guide - Share Preview Specifications",
    description:
      "Complete Facebook Open Graph image specifications for maximum reach.",
    url: "https://og-image.org/docs/platforms/facebook",
  },
};

export default function FacebookGuidePage() {
  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
        Facebook Open Graph Image Guide
      </h1>

      <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
        Facebook literally invented the Open Graph protocol back in 2010. With nearly 3 billion
        monthly active users, it remains the largest social platform in the world. When your
        content gets shared on Facebook, the OG image is your first (and often only) chance
        to capture attention. Let's make it count.
      </p>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
        <p className="text-blue-400 font-medium">
          Fun fact: The "og:" prefix in OG tags stands for "Open Graph"—Facebook's protocol for
          turning web pages into rich social objects. Today it's the universal standard.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Image Specifications
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Facebook has detailed requirements for OG images. Hit these specs and your content
        displays perfectly across desktop, mobile, and Messenger:
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
              <td className="py-3 px-4 text-neutral-400">1200 × 630 px</td>
              <td className="py-3 px-4 text-neutral-400">600 × 315 px</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Aspect Ratio</td>
              <td className="py-3 px-4 text-neutral-400">1.91:1</td>
              <td className="py-3 px-4 text-neutral-400">1.91:1</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Maximum File Size</td>
              <td className="py-3 px-4 text-neutral-400">8 MB</td>
              <td className="py-3 px-4 text-neutral-400">N/A</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Supported Formats</td>
              <td className="py-3 px-4 text-neutral-400">PNG, JPEG, GIF, WebP</td>
              <td className="py-3 px-4 text-neutral-400">N/A</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">High Resolution</td>
              <td className="py-3 px-4 text-neutral-400">1200 × 630 px+</td>
              <td className="py-3 px-4 text-neutral-400">N/A</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
        <p className="text-yellow-400 font-medium">
          Image size matters: Facebook displays higher-resolution images more prominently in the
          feed. Always use 1200 × 630 or larger for maximum visual impact.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Required Meta Tags
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        As the creator of Open Graph, Facebook supports the full spec. Here's the complete setup
        for optimal sharing:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- Required Tags -->
<meta property="og:url" content="https://yoursite.com/page" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Your Page Title" />
<meta property="og:description" content="Your page description" />
<meta property="og:image" content="https://yoursite.com/og-image.png" />

<!-- Strongly Recommended -->
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Image description for accessibility" />
<meta property="og:site_name" content="Your Site Name" />
<meta property="og:locale" content="en_US" />

<!-- For Articles -->
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2024-01-15T08:00:00Z" />
<meta property="article:author" content="https://facebook.com/authorpage" />
<meta property="article:section" content="Technology" />
<meta property="article:tag" content="web development" />

<!-- Facebook-Specific -->
<meta property="fb:app_id" content="your_app_id" />`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Tag Details</h3>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:url</h4>
          <p className="text-neutral-400 text-sm">
            The canonical URL of your page. Use this to consolidate likes and shares when you
            have multiple URLs pointing to the same content.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:type</h4>
          <p className="text-neutral-400 text-sm">
            Defaults to "website" if not specified. Use "article" for blog posts—Facebook
            may display additional info like publish date.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:title</h4>
          <p className="text-neutral-400 text-sm">
            Maximum ~60-70 characters before truncation. Facebook shows titles prominently—make
            every word count.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:description</h4>
          <p className="text-neutral-400 text-sm">
            Facebook typically shows 2-3 lines (~155 characters). Provide context that complements
            the title without repeating it.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">og:image</h4>
          <p className="text-neutral-400 text-sm">
            Must be an absolute URL (https://). Facebook recommends serving images over HTTPS for
            better performance and security.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-1">fb:app_id</h4>
          <p className="text-neutral-400 text-sm">
            Optional but recommended. Ties shares to your Facebook app, enabling analytics and
            improved debugging. Get one at developers.facebook.com.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Design Best Practices for Facebook
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Facebook's feed is competitive. Users scroll fast. Here's how to stop the scroll:
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">1. Bold, Readable Text</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Text on images gets attention—but only if people can read it. The Facebook feed
        compresses images significantly on mobile:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li>Use large, bold fonts (minimum 48px for headlines)</li>
        <li>High contrast between text and background</li>
        <li>Limit to 20% text coverage (Facebook's old ad rule, still good practice)</li>
        <li>Sans-serif fonts render better at small sizes</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">2. Face-Forward Content</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Facebook's algorithm and human psychology both favor images with faces:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li>Images with faces get 38% more likes and 32% more comments</li>
        <li>Direct eye contact creates connection</li>
        <li>Emotions trigger emotional responses</li>
        <li>People relate to people, not abstract graphics</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">3. Color That Pops</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Facebook's interface is blue and white. Stand out with complementary colors:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li>Orange and red tones contrast well with Facebook's blue</li>
        <li>Avoid blue-heavy images—they blend into the interface</li>
        <li>Bright, saturated colors catch the eye</li>
        <li>Dark backgrounds make content feel premium</li>
      </ul>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">4. Mobile-First Design</h3>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        Over 98% of Facebook users access via mobile. Design for small screens first:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-8 space-y-2">
        <li>Test at 50% zoom—if you can't read it, increase font size</li>
        <li>Simple compositions work better than complex ones</li>
        <li>Keep key elements in the center (avoid edges)</li>
        <li>Minimize fine details—they get lost on small screens</li>
      </ul>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Multiple Images
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Facebook supports multiple OG images, displaying the highest-resolution one:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- Multiple images (Facebook uses the best resolution) -->
<meta property="og:image" content="https://yoursite.com/og-1200.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta property="og:image" content="https://yoursite.com/og-600.png" />
<meta property="og:image:width" content="600" />
<meta property="og:image:height" content="315" />`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        In practice, just use one high-resolution image (1200×630). Multiple images are rarely necessary.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Facebook Sharing Debugger
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Facebook's official tool for testing and refreshing OG previews:
      </p>

      <ol className="list-decimal list-inside text-neutral-300 mb-8 space-y-3">
        <li>
          Go to <span className="text-neutral-400">developers.facebook.com/tools/debug</span>
        </li>
        <li>
          Enter your URL and click "Debug"
        </li>
        <li>
          Review "Link Preview" section—this shows exactly how shares will appear
        </li>
        <li>
          Click "Scrape Again" to refresh cached data
        </li>
        <li>
          Check "Warnings" for any issues with your tags
        </li>
      </ol>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
        <p className="text-yellow-400 font-medium">
          Cache tip: Facebook caches OG data aggressively. After updating your tags, always
          use the Sharing Debugger to scrape the new version before sharing.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Troubleshooting Guide
      </h2>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Image not showing</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Check og:image URL is absolute (https://)</li>
            <li>• Verify image is publicly accessible (not behind auth)</li>
            <li>• Ensure image meets minimum size (600×315)</li>
            <li>• Use Sharing Debugger to see Facebook's view</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Old image still showing</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Use Sharing Debugger and click "Scrape Again"</li>
            <li>• May need to scrape 2-3 times for stubborn cache</li>
            <li>• Change the image filename to force new scrape</li>
            <li>• Wait 24 hours—Facebook's CDN cache is persistent</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Image appears cropped</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Use exactly 1200×630 pixels</li>
            <li>• Include og:image:width and og:image:height tags</li>
            <li>• Keep important content in center safe zone</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Title/description wrong</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• Check meta tags are in the &lt;head&gt; section</li>
            <li>• Verify no duplicate tags from plugins</li>
            <li>• Use Sharing Debugger to see what Facebook reads</li>
            <li>• Check JavaScript isn't overwriting tags (Facebook doesn't execute JS)</li>
          </ul>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">"Error parsing input URL"</h3>
          <ul className="text-neutral-400 text-sm space-y-1">
            <li>• URL must be publicly accessible</li>
            <li>• Check robots.txt isn't blocking Facebook</li>
            <li>• Verify SSL certificate is valid</li>
            <li>• Remove URL encoding issues</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Facebook vs. Instagram
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Since Meta owns both, you might wonder about Instagram. Here's the key difference:
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-8">
        <p className="text-neutral-400 text-sm">
          <strong className="text-white">Instagram doesn't support OG images.</strong> Instagram
          is a closed ecosystem—links in posts aren't clickable, and Stories/Reels with link stickers
          use their own preview system. OG images are purely for Facebook shares, Messenger shares,
          and Facebook posts.
        </p>
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
            <span className="text-neutral-300">og:image uses absolute HTTPS URL</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">og:image:width and og:image:height included</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">og:title under 70 characters</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">og:description under 155 characters</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">og:url points to canonical URL</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">Tested with Sharing Debugger</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 mt-0.5">✓</span>
            <span className="text-neutral-300">Text readable at mobile sizes</span>
          </li>
        </ul>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-12">
        <h3 className="font-semibold text-white mb-3">Create Facebook-Optimized Images</h3>
        <p className="text-neutral-400 mb-4">
          Use og-image.org to generate Facebook-ready images in seconds. All templates are
          optimized for 1200×630 dimensions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create OG Image
          </Link>
          <Link
            href="/validator"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Test Your Image
          </Link>
        </div>
      </div>
    </article>
  );
}
