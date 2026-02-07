// Cloudflare Pages Function: /api/parse
// Fetches any URL and extracts OG meta tags

interface MetaData {
  [key: string]: string;
}

interface ParseResponse {
  success: boolean;
  url: string;
  meta: MetaData;
  links?: string[];
  error?: string;
}

const MAX_RESPONSE_SIZE = 5 * 1024 * 1024; // 5MB limit

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

class MetaExtractor {
  meta: MetaData = {};
  links: string[] = [];
  baseUrl: string;
  titleText = "";

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
}

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get("url");
  const includeLinks = url.searchParams.get("links") === "true";

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (!targetUrl) {
    return new Response(
      JSON.stringify({ success: false, error: "URL required" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
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
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "og-image.org/1.0 (Social Preview Bot)",
        Accept: "text/html,application/xhtml+xml",
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
        JSON.stringify({ success: false, error: "Response too large" }),
        {
          status: 413,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify content type is HTML
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return new Response(
        JSON.stringify({ success: false, error: "URL does not return HTML" }),
        {
          status: 415,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const extractor = new MetaExtractor(targetUrl);

    // Use HTMLRewriter to parse meta tags
    const rewriter = new HTMLRewriter()
      .on("meta", {
        element(el) {
          const property = el.getAttribute("property");
          const name = el.getAttribute("name");
          const content = el.getAttribute("content");

          if (content) {
            if (property) extractor.meta[property] = content;
            if (name) extractor.meta[name] = content;
          }
        },
      })
      .on("title", {
        text(text) {
          extractor.titleText += text.text;
        },
      });

    // Add link extraction if requested
    if (includeLinks) {
      rewriter.on("a[href]", {
        element(el) {
          const href = el.getAttribute("href");
          if (href && !href.startsWith("#") && !href.startsWith("mailto:")) {
            try {
              const linkUrl = new URL(href, extractor.baseUrl);
              if (linkUrl.origin === parsedUrl.origin) {
                extractor.links.push(linkUrl.href);
              }
            } catch {
              // Invalid URL, skip
            }
          }
        },
      });
    }

    // Transform and consume the response
    await rewriter.transform(response).text();

    // Add title to meta if not already present
    if (extractor.titleText && !extractor.meta["title"]) {
      extractor.meta["title"] = extractor.titleText.trim();
    }

    const result: ParseResponse = {
      success: true,
      url: targetUrl,
      meta: extractor.meta,
    };

    if (includeLinks) {
      result.links = [...new Set(extractor.links)].slice(0, 50);
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

// Handle OPTIONS for CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
