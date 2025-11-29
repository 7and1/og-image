// Cloudflare Pages Function: /api/sitemap
// Parses sitemap.xml and returns list of URLs

interface SitemapResponse {
  success: boolean;
  urls: string[];
  count: number;
  error?: string;
}

class SitemapExtractor {
  urls: string[] = [];
  currentLoc = "";
  inLoc = false;
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
  try {
    const parsedUrl = new URL(sitemapUrl);
    if (
      parsedUrl.pathname === "/" ||
      (!parsedUrl.pathname.includes("sitemap") &&
        !parsedUrl.pathname.endsWith(".xml"))
    ) {
      sitemapUrl = `${parsedUrl.origin}/sitemap.xml`;
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

    const extractor = new SitemapExtractor();

    // Use HTMLRewriter to parse XML sitemap
    const rewriter = new HTMLRewriter()
      .on("loc", {
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
      });

    await rewriter.transform(response).text();

    // Limit to 100 URLs
    const urls = extractor.urls.slice(0, 100);

    const result: SitemapResponse = {
      success: true,
      urls,
      count: urls.length,
    };

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
