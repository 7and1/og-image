import { escapeString, escapeHtml } from "./utils";

interface CodeGenState {
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

/**
 * Generate Next.js App Router opengraph-image.tsx code
 */
export function generateNextJsCode(state: CodeGenState): string {
  const { title, description, icon, backgroundColor, textColor } = state;
  const titleFontSize = title.length > 50 ? 44 : title.length > 35 ? 52 : 60;

  return `// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '${escapeString(title)}';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // Load font - place Inter-Bold.ttf in app/ directory
  const interBold = await fetch(
    new URL('./Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '${backgroundColor}',
          fontFamily: 'Inter',
          padding: 60,
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 24, display: 'flex' }}>
          ${icon}
        </div>
        <div
          style={{
            fontSize: ${titleFontSize},
            fontWeight: 700,
            color: '${textColor}',
            textAlign: 'center',
            lineHeight: 1.2,
            display: 'flex',
          }}
        >
          ${escapeString(title)}
        </div>
        ${
          description
            ? `<div
          style={{
            fontSize: 26,
            color: '${textColor}',
            opacity: 0.85,
            marginTop: 20,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          ${escapeString(description)}
        </div>`
            : ""
        }
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}`;
}

/**
 * Generate HTML meta tags
 */
export function generateHtmlMetaTags(state: CodeGenState): string {
  const { title, description } = state;

  return `<!-- Primary Meta Tags -->
<title>${escapeHtml(title)}</title>
<meta name="title" content="${escapeHtml(title)}" />
<meta name="description" content="${escapeHtml(description)}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yoursite.com/" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="https://yoursite.com/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://yoursite.com/" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="https://yoursite.com/og-image.png" />`;
}

/**
 * Generate Vercel OG code (API route style)
 */
export function generateVercelOgCode(state: CodeGenState): string {
  const { title, icon, backgroundColor, textColor } = state;
  const titleFontSize = title.length > 50 ? 44 : title.length > 35 ? 52 : 60;

  return `// pages/api/og.tsx (or app/api/og/route.tsx)
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // Get dynamic content from URL params
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '${escapeString(title)}';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '${backgroundColor}',
          fontFamily: 'Inter',
          padding: 60,
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 24, display: 'flex' }}>
          ${icon}
        </div>
        <div
          style={{
            fontSize: ${titleFontSize},
            fontWeight: 700,
            color: '${textColor}',
            textAlign: 'center',
            lineHeight: 1.2,
            display: 'flex',
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// Usage: /api/og?title=Your%20Title`;
}

/**
 * Generate all code formats
 */
export function generateAllCode(state: CodeGenState): Record<string, string> {
  return {
    nextjs: generateNextJsCode(state),
    html: generateHtmlMetaTags(state),
    vercel: generateVercelOgCode(state),
  };
}
