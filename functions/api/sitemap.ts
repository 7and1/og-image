// Cloudflare Pages Function: /api/sitemap
// Parses sitemap.xml and returns list of URLs

interface SitemapResponse {
  success: boolean;
  urls: string[];
  count: number;
  sitemapIndexUrls?: string[];
  error?: string;
}

const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB limit for sitemaps

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "metadata.google.internal",
  "169.254.169.254",
]);

const BLOCKED_HOSTNAME_PATTERNS = [
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,
  /^192\.168\.\d{1,3}\.\d{1,3}$/,
  /^fc00:/i,
  /^fd00:/i,
  /^fe80:/i,
  /\.local$/i,
  /\.internal$/i,
  /\.localhost$/i,
];

function isBlockedUrl(url: URL): boolean {
  const hostname = url.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return true;
  }

  for (const pattern of BLOCKED_HOSTNAME_PATTERNS) {
    if (pattern.test(hostname)) {
      return true;
    }
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return true;
  }

  return false;
}

class SitemapExtractor {
  urls: string[] = [];
  sitemapIndexUrls: string[] = [];
  currentLoc = "";
  currentSitemapLoc = "";
  inUrlSet = false;
  inSitemapIndex = false;
}

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  let sitemapUrl = url.searchParams.get("url");

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (!sitemapUrl) {
    return new Response(
      JSON.stringify({ success: false, error: "URL required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // If just a domain, try to fetch sitemap.xml
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(sitemapUrl);
    if (
      parsedUrl.pathname === "/" ||
      (!parsedUrl.pathname.includes("sitemap") &&
        !parsedUrl.pathname.endsWith(".xml"))
    ) {
      sitemapUrl = `${parsedUrl.origin}/sitemap.xml`;
      parsedUrl = new URL(sitemapUrl);
    }
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid URL" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // SSRF protection: block internal/private IPs
  if (isBlockedUrl(parsedUrl)) {
    return new Response(
      JSON.stringify({ success: false, error: "URL not allowed" }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const response = await fetch(sitemapUrl, {
      headers: {
        "User-Agent": "og-image.org/1.0 (Sitemap Parser)",
        Accept: "application/xml, text/xml",
      },
      cf: { cacheTtl: 3600 },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `HTTP ${response.status}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check content length to prevent memory exhaustion
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: "Sitemap too large" }),
        {
          status: 413,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const extractor = new SitemapExtractor();

    // Use HTMLRewriter to parse XML sitemap (handles both urlset and sitemapindex)
    const rewriter = new HTMLRewriter()
      .on("urlset", {
        element() {
          extractor.inUrlSet = true;
        },
      })
      .on("sitemapindex", {
        element() {
          extractor.inSitemapIndex = true;
        },
      })
      .on("url loc", {
        text(text) {
          extractor.currentLoc += text.text;
          if (text.lastInTextNode) {
            const trimmed = extractor.currentLoc.trim();
            if (trimmed) {
              extractor.urls.push(trimmed);
            }
            extractor.currentLoc = "";
          }
        },
      })
      .on("sitemap loc", {
        text(text) {
          extractor.currentSitemapLoc += text.text;
          if (text.lastInTextNode) {
            const trimmed = extractor.currentSitemapLoc.trim();
            if (trimmed) {
              extractor.sitemapIndexUrls.push(trimmed);
            }
            extractor.currentSitemapLoc = "";
          }
        },
      });

    await rewriter.transform(response).text();

    // Limit to 100 URLs
    const urls = extractor.urls.slice(0, 100);
    const sitemapIndexUrls = extractor.sitemapIndexUrls.slice(0, 20);

    const result: SitemapResponse = {
      success: true,
      urls,
      count: urls.length,
    };

    // Include sitemap index URLs if this is a sitemap index
    if (sitemapIndexUrls.length > 0) {
      result.sitemapIndexUrls = sitemapIndexUrls;
    }

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
