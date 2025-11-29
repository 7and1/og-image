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
