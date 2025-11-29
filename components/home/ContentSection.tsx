"use client";

export function ContentSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      {/* Why OG Images Matter */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">
          Why OG Images Matter More Than You Think
        </h2>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-lg text-neutral-300 leading-relaxed mb-4">
            Look, here's the deal. Your brain processes images 60,000 times faster than text.
            That's not marketing fluff—that's neuroscience. When someone scrolls through Twitter
            and sees your link, you have about 0.05 seconds to grab their attention. That's
            faster than a blink. So what do you do? You make that preview image absolutely
            impossible to ignore.
          </p>
          <p className="text-neutral-400 leading-relaxed mb-4">
            According to BuzzSumo's analysis of over 100 million articles, posts with images
            get 2.3x more engagement than those without. That's not a marginal improvement—that's
            more than double. INMA's 2024 research on Facebook content shows even more dramatic
            results: posts with images receive 100% more engagement and 114% more impressions
            compared to text-only posts.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            Think about it this way: every time you share a link without a proper OG image,
            you're essentially showing up to a party in your pajamas. Sure, you're there, but
            nobody's going to remember you. The OG image is your first impression, and on
            social media, first impressions are the only impressions that matter.
          </p>
        </div>
      </div>

      {/* The Science Behind Social Sharing */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">
          The Science Behind Social Sharing
        </h2>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-300 leading-relaxed mb-4">
            Here's something wild: humans are visual creatures. Our ancestors didn't survive
            by reading warning labels—they survived by instantly recognizing patterns and
            colors. That same neural wiring is still running the show when someone scrolls
            through their feed at 3 AM.
          </p>
          <p className="text-neutral-400 leading-relaxed mb-4">
            Visual content gets processed in the brain's occipital lobe almost instantaneously,
            while text has to go through multiple processing stages. This is why a compelling
            OG image can stop someone mid-scroll, while even the most brilliant headline might
            get lost in the noise.
          </p>
          <p className="text-neutral-400 leading-relaxed mb-4">
            The average social media click-through rate (CTR) in Q2 2024 was 0.66%, according
            to Statista. That might sound low, but consider this: e-commerce advertising
            averages around 1.75% CTR. The difference between these numbers often comes down
            to visual presentation. A well-designed OG image with clear messaging can push
            your CTR well above average.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            The key insight? People don't read on social media—they scan. Your OG image is
            the billboard on a highway. It needs to communicate value in the time it takes
            someone's thumb to swipe past it.
          </p>
        </div>
      </div>

      {/* Platform Dimensions */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">
          Platform-Specific Image Dimensions
        </h2>
        <div className="prose prose-invert prose-neutral max-w-none mb-6">
          <p className="text-neutral-400 leading-relaxed">
            Each social platform has its own preferred image dimensions. Using the wrong size
            means your carefully crafted image gets cropped, stretched, or compressed into
            something unrecognizable. Here's what you need to know:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="py-3 px-4 text-left text-sm font-semibold text-white">
                  Platform
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-white">
                  Image Size
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-white">
                  Aspect Ratio
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-white">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <tr className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 text-neutral-300">Facebook</td>
                <td className="py-3 px-4 text-neutral-400">1200 × 630 px</td>
                <td className="py-3 px-4 text-neutral-400">1.91:1</td>
                <td className="py-3 px-4 text-neutral-500 text-sm">Standard for feed posts</td>
              </tr>
              <tr className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 text-neutral-300">Twitter/X</td>
                <td className="py-3 px-4 text-neutral-400">1200 × 628 px</td>
                <td className="py-3 px-4 text-neutral-400">1.91:1</td>
                <td className="py-3 px-4 text-neutral-500 text-sm">Summary large image card</td>
              </tr>
              <tr className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 text-neutral-300">LinkedIn</td>
                <td className="py-3 px-4 text-neutral-400">1200 × 627 px</td>
                <td className="py-3 px-4 text-neutral-400">1.91:1</td>
                <td className="py-3 px-4 text-neutral-500 text-sm">Shared link preview</td>
              </tr>
              <tr className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 text-neutral-300">Discord</td>
                <td className="py-3 px-4 text-neutral-400">1200 × 630 px</td>
                <td className="py-3 px-4 text-neutral-400">1.91:1</td>
                <td className="py-3 px-4 text-neutral-500 text-sm">Embed preview</td>
              </tr>
              <tr className="hover:bg-neutral-900/50">
                <td className="py-3 px-4 text-neutral-300">Slack</td>
                <td className="py-3 px-4 text-neutral-400">1200 × 630 px</td>
                <td className="py-3 px-4 text-neutral-400">1.91:1</td>
                <td className="py-3 px-4 text-neutral-500 text-sm">Unfurled links</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-neutral-500">
          Source: Hootsuite Social Media Image Sizes Guide, Sprout Social 2024
        </p>

        <div className="mt-6 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-400 text-sm">
            <strong className="text-white">Pro tip:</strong> The universal safe zone is
            1200 × 630 pixels with a 1.91:1 aspect ratio. This works well across all major
            platforms and ensures your image displays correctly everywhere your content gets shared.
          </p>
        </div>
      </div>

      {/* How to Use This Tool */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">
          How to Use This Generator
        </h2>
        <div className="prose prose-invert prose-neutral max-w-none mb-6">
          <p className="text-neutral-400 leading-relaxed">
            Creating professional OG images doesn't require design skills or expensive
            software. Here's how to create stunning social preview images in three simple steps:
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-blue-400">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Enter Your Content</h3>
            <p className="text-neutral-400 text-sm">
              Add your title, description, and optional emoji icon. Keep your title under
              60 characters for optimal display across all platforms.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-blue-400">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Choose Your Style</h3>
            <p className="text-neutral-400 text-sm">
              Select from 8 professionally designed templates. Customize colors, fonts,
              and layout to match your brand identity.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-blue-400">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Export & Implement</h3>
            <p className="text-neutral-400 text-sm">
              Download your image as PNG or copy the ready-to-use code snippets for
              Next.js, HTML meta tags, or Vercel OG.
            </p>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-6">
          OG Image Best Practices
        </h2>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-400 leading-relaxed mb-6">
            After analyzing thousands of high-performing social posts, here are the
            principles that consistently drive engagement:
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Keep Text Large and Readable</h3>
                <p className="text-neutral-400 text-sm">
                  Your title should be readable even on mobile feeds. Most people view
                  social media on phones with 6-inch screens. If your text looks small
                  on your desktop preview, it'll be invisible on mobile.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Use High Contrast Colors</h3>
                <p className="text-neutral-400 text-sm">
                  The WCAG recommends a minimum contrast ratio of 4.5:1 for text. Dark
                  text on light backgrounds or light text on dark backgrounds ensures
                  your message cuts through the visual noise of crowded feeds.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Include Your Brand</h3>
                <p className="text-neutral-400 text-sm">
                  Use consistent colors, fonts, or a subtle logo. When people see your
                  content shared multiple times, brand recognition builds trust. They
                  start clicking because they recognize the source, not just the content.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Test Before Publishing</h3>
                <p className="text-neutral-400 text-sm">
                  Use our <a href="/validator" className="text-blue-400 hover:underline">OG Validator</a> to
                  preview how your image will appear on different platforms. What looks
                  perfect in your editor might get cropped differently on each social network.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Focus on the Value Proposition</h3>
                <p className="text-neutral-400 text-sm">
                  Don't just describe what the content is—tell people what they'll gain
                  from clicking. "How to Build a Startup" is decent. "Build a Profitable
                  Startup in 90 Days" is compelling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who Built This */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Who Built This Tool
        </h2>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p className="text-neutral-400 leading-relaxed mb-4">
            This OG image generator is an open-source project built by developers who got
            tired of paying for simple tools or wrestling with complex design software just
            to create preview images. We believe fundamental web tools should be free, fast,
            and respect user privacy.
          </p>
          <p className="text-neutral-400 leading-relaxed mb-4">
            The generator runs entirely in your browser using Satori and Resvg WASM. Your
            content never touches our servers—it's processed locally on your device. No
            accounts, no tracking, no hidden fees. Just paste your content and get a
            professional OG image.
          </p>
          <p className="text-neutral-400 leading-relaxed">
            The source code is available on GitHub. Found a bug? Want a new feature?
            Contributions are welcome. This is a community project, and the community
            decides where it goes next.
          </p>
        </div>

        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                Ready to create your first OG image?
              </h3>
              <p className="text-neutral-400 text-sm">
                Scroll back up and start designing. It takes less than 30 seconds.
              </p>
            </div>
            <a
              href="#generator"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Start Creating
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Schema-friendly section */}
      <div className="mt-16 pt-16 border-t border-neutral-800">
        <h2 className="text-3xl font-bold text-white mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800">
            <h3 className="text-lg font-medium text-white mb-2">
              What is an OG image?
            </h3>
            <p className="text-neutral-400">
              An OG (Open Graph) image is the preview image that appears when you share a
              link on social media platforms like Facebook, Twitter, LinkedIn, and Discord.
              It's defined using the og:image meta tag in your HTML and helps your content
              stand out in feeds.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800">
            <h3 className="text-lg font-medium text-white mb-2">
              What size should my OG image be?
            </h3>
            <p className="text-neutral-400">
              The recommended size is 1200 × 630 pixels with a 1.91:1 aspect ratio. This
              works optimally across all major social platforms including Facebook, Twitter,
              LinkedIn, and Discord without cropping or distortion.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800">
            <h3 className="text-lg font-medium text-white mb-2">
              Is this tool really free?
            </h3>
            <p className="text-neutral-400">
              Yes, completely free with no hidden costs. The generator runs in your browser,
              so there are no server costs for us to recoup. No accounts, no watermarks, no
              limits on how many images you create.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800">
            <h3 className="text-lg font-medium text-white mb-2">
              Do you store my content?
            </h3>
            <p className="text-neutral-400">
              No. All image generation happens locally in your browser using WebAssembly.
              Your titles, descriptions, and generated images never leave your device. We
              don't have servers that could store your data even if we wanted to.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContentSection;
