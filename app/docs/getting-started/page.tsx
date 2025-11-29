import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Getting Started with OG Images - Complete Guide | og-image.org",
  description:
    "Learn how to create your first Open Graph image in under 60 seconds. A beginner-friendly guide to making your social media shares look professional.",
  openGraph: {
    title: "Getting Started with OG Images - Complete Guide",
    description:
      "Create your first Open Graph image in under 60 seconds. A beginner-friendly guide.",
    url: "https://og-image.org/docs/getting-started",
  },
};

export default function GettingStartedPage() {
  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
        Getting Started with Open Graph Images
      </h1>

      <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
        Look, here's the deal: when you share a link on social media without a proper OG image,
        you're basically showing up to a job interview in pajamas. Your content might be incredible,
        but nobody's going to click on a boring gray box with a URL. Let me show you how to fix that
        in literally 60 seconds.
      </p>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
        <p className="text-blue-400 font-medium">
          Quick fact: Posts with images get 2.3x more engagement than those without, according to
          BuzzSumo's analysis of over 100 million articles. That's not opinion—that's data.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        What Are Open Graph Images, Really?
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Think of Open Graph (OG) images as the movie poster for your content. When someone shares your
        link on Twitter, LinkedIn, Facebook, or pretty much any platform, the OG image is what people
        see first. It's your 1200×630 pixel billboard in an endless scroll of content.
      </p>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        The protocol was created by Facebook back in 2010, and it's become the universal standard. Every
        major platform reads these meta tags to create link previews. Without them? You get whatever the
        platform decides to scrape—usually something terrible.
      </p>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        Here's what happens behind the scenes: when you share a URL, the platform sends a request to that
        URL and looks for specific meta tags in the HTML. The most important one is <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">og:image</code>.
        If it finds one, it displays that image. If not, it might grab a random image from your page or
        show nothing at all.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Why This Matters (The Numbers Don't Lie)
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        I'm not here to sell you on theory. Let's talk real numbers:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li>Twitter cards with images see <strong className="text-white">150% more retweets</strong> than text-only tweets</li>
        <li>LinkedIn posts with images get <strong className="text-white">98% more comments</strong> than those without</li>
        <li>Facebook posts with images see <strong className="text-white">2.3x more engagement</strong></li>
        <li>Articles with relevant images get <strong className="text-white">94% more views</strong></li>
      </ul>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        The math is simple: better OG images = more clicks = more traffic = more success. Whatever you're
        building—a blog, a product, a portfolio—you're leaving engagement on the table without proper
        social images.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Your First OG Image in 60 Seconds
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Alright, enough talk. Let's actually build something. Here's the fastest way to create a
        professional OG image:
      </p>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Step 1: Open the Generator</h3>
        <p className="text-neutral-400 mb-3">
          Head to <Link href="/" className="text-blue-400 hover:text-blue-300">og-image.org</Link> and
          you'll see the editor. No signup, no account creation, no credit card. Just start creating.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Step 2: Enter Your Content</h3>
        <p className="text-neutral-400 mb-3">
          Type your title and description. The title is the big, bold text—make it punchy. The description
          adds context. Keep both concise; you've got limited space and people scroll fast.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Step 3: Pick a Template</h3>
        <p className="text-neutral-400 mb-3">
          We've got 8 professionally designed templates. Each one is optimized for different vibes:
          Gradient for modern SaaS, Minimal for clean blogs, Bold for statements, and more. Try a few—the
          preview updates instantly.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Step 4: Customize Colors</h3>
        <p className="text-neutral-400 mb-3">
          Match your brand colors. Pick background, text, and accent colors. If you're not sure, stick
          with the defaults—they're designed to work well together.
        </p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Step 5: Download and Deploy</h3>
        <p className="text-neutral-400 mb-3">
          Hit the download button. You get a 1200×630 PNG file—the exact dimensions recommended by all
          major platforms. Upload it to your site and add the meta tags.
        </p>
      </div>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        That's it. Five steps, maybe 60 seconds if you're being thoughtful about it. Your content now
        has a professional face for social media.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Adding the Meta Tags to Your Site
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Once you've got your image, you need to tell browsers and social platforms where to find it.
        Add these tags to the <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">&lt;head&gt;</code> section of your HTML:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<meta property="og:image" content="https://yoursite.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Description of your image" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://yoursite.com/og-image.png" />`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        The <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">og:image</code> tag is the main one. The width and height help platforms
        render the image correctly. The <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">twitter:card</code> tag tells Twitter to show
        the large image format. Always use absolute URLs—relative paths don't work.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Why og-image.org is Different
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        There are plenty of OG image tools out there. So why use this one? Three reasons:
      </p>

      <div className="grid gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">100% Client-Side</h3>
          <p className="text-neutral-400 text-sm">
            Your images are rendered entirely in your browser. Nothing gets uploaded to any server.
            Your data stays on your machine. This isn't just a privacy feature—it means the tool
            works offline too.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Zero Cost, Forever</h3>
          <p className="text-neutral-400 text-sm">
            No freemium model, no "upgrade to remove watermark," no 5-image-per-month limits.
            It's free because the rendering happens on your device. There's no server cost to pass on.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Open Source</h3>
          <p className="text-neutral-400 text-sm">
            The entire codebase is available on GitHub. You can inspect it, modify it, self-host it,
            or contribute improvements. Transparency builds trust.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Common Mistakes to Avoid
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        After seeing thousands of OG images, here are the mistakes that kill engagement:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-8 space-y-3">
        <li>
          <strong className="text-white">Text too small</strong>: People scroll fast on mobile. If they
          can't read your title in a glance, they're moving on.
        </li>
        <li>
          <strong className="text-white">Wrong dimensions</strong>: Using a square image when platforms
          expect 1200×630? Your image gets cropped randomly. Not a good look.
        </li>
        <li>
          <strong className="text-white">No contrast</strong>: Light gray text on white background?
          Nobody can read that. Make sure your text pops against the background.
        </li>
        <li>
          <strong className="text-white">Missing alt text</strong>: Screen readers need the og:image:alt
          tag. It's also good for SEO. Don't skip it.
        </li>
        <li>
          <strong className="text-white">Outdated images</strong>: Changed your article title but not
          the OG image? The mismatch looks sloppy. Keep them in sync.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Testing Your OG Images
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Before you ship, test. Each platform has its own validator:
      </p>

      <ul className="list-disc list-inside text-neutral-300 mb-6 space-y-2">
        <li>Twitter: <span className="text-neutral-400">Card Validator (tweets.x.com)</span></li>
        <li>Facebook: <span className="text-neutral-400">Sharing Debugger (developers.facebook.com)</span></li>
        <li>LinkedIn: <span className="text-neutral-400">Post Inspector (linkedin.com/post-inspector)</span></li>
      </ul>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        Or use our built-in <Link href="/validator" className="text-blue-400 hover:text-blue-300">Validator tool</Link> to
        check all platforms at once. It'll show you exactly what each platform sees and flag any issues.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Next Steps
      </h2>

      <p className="text-neutral-300 mb-6 leading-relaxed">
        You've got the basics. Now level up:
      </p>

      <div className="grid gap-3 mb-8">
        <Link
          href="/docs/guides/nextjs"
          className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-blue-500/50 transition-colors group"
        >
          <div>
            <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Next.js Integration</span>
            <p className="text-sm text-neutral-400">Dynamic OG images with the App Router</p>
          </div>
          <svg className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/docs/platforms/twitter"
          className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-blue-500/50 transition-colors group"
        >
          <div>
            <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Twitter/X Optimization</span>
            <p className="text-sm text-neutral-400">Platform-specific best practices</p>
          </div>
          <svg className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="/docs/api"
          className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-blue-500/50 transition-colors group"
        >
          <div>
            <span className="font-medium text-white group-hover:text-blue-400 transition-colors">API Documentation</span>
            <p className="text-sm text-neutral-400">Programmatic image generation</p>
          </div>
          <svg className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-12">
        <p className="text-neutral-300">
          <strong className="text-white">Ready to create?</strong> Head to the{" "}
          <Link href="/" className="text-blue-400 hover:text-blue-300">generator</Link> and make
          your first OG image. It's free, it's fast, and your social shares will thank you.
        </p>
      </div>
    </article>
  );
}
