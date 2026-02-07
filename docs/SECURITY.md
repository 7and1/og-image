# Security Documentation

This document outlines the security measures implemented in og-image.org.

## SSRF Protection

The `/api/parse` and `/api/sitemap` endpoints fetch external URLs. To prevent Server-Side Request Forgery (SSRF) attacks, we implement strict URL validation.

### Blocked Addresses

The following are blocked to prevent access to internal resources:

#### Localhost and Loopback
- `localhost`
- `127.0.0.1`
- `0.0.0.0`
- `[::1]` (IPv6 loopback)

#### Private IP Ranges (RFC 1918)
- `10.0.0.0/8` - Class A private network
- `172.16.0.0/12` - Class B private network
- `192.168.0.0/16` - Class C private network

#### IPv6 Private Ranges
- `fc00::/7` - Unique local addresses
- `fe80::/10` - Link-local addresses

#### Cloud Metadata Endpoints
- `169.254.169.254` - AWS/GCP/Azure metadata service
- `metadata.google.internal` - GCP metadata hostname

#### Internal Domain Patterns
- `*.local`
- `*.internal`
- `*.localhost`

### Protocol Restrictions

Only `http://` and `https://` protocols are allowed. The following are blocked:
- `file://`
- `ftp://`
- `gopher://`
- Custom protocols

## Rate Limiting

The `/api/og` endpoint implements multi-window rate limiting:

| Window | Limit | Duration |
|--------|-------|----------|
| Burst  | 2     | 10s      |
| Minute | 5     | 60s      |
| Hour   | 25    | 3600s    |

Rate limit headers are included in all responses:
- `X-RateLimit-Limit` - Maximum requests allowed
- `X-RateLimit-Remaining` - Requests remaining in window
- `X-RateLimit-Reset` - Unix timestamp when window resets

## Response Size Limits

To prevent memory exhaustion attacks:

| Endpoint | Max Size |
|----------|----------|
| `/api/parse` | 5 MB |
| `/api/sitemap` | 10 MB |

## Content Type Validation

The `/api/parse` endpoint validates that responses are HTML:
- Accepts: `text/html`, `application/xhtml+xml`
- Rejects: All other content types

## Input Validation

### OG Image Parameters

| Parameter | Max Length | Validation |
|-----------|------------|------------|
| `title` | 80 chars | Unicode-aware |
| `description` | 200 chars | Unicode-aware |
| `icon` | 12 chars | Unicode-aware |
| `textColor` | 7 chars | Hex color format |
| `accentColor` | 7 chars | Hex color format |
| `overlay` | - | Float 0-1 |

### URL Parameters

All URL parameters are validated:
- Must be valid URL format
- Must pass SSRF checks
- Query strings are sanitized

## Cache Security

### Cache Key Normalization

Cache keys are normalized to prevent cache poisoning:
- Parameters are sorted alphabetically
- Only relevant parameters are included
- Version string prevents stale cache issues

### Cache Headers

```
Cache-Control: public, max-age=0, s-maxage=86400, stale-while-revalidate=604800
X-Robots-Tag: noindex, nofollow
```

## CORS Configuration

All API endpoints include CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

## Client-Side Security

### No Data Upload

The OG image generator runs entirely client-side:
- WASM rendering in browser
- No user data sent to servers
- Images generated locally

### Blob URL Management

Generated images use Blob URLs that are:
- Revoked after use to prevent memory leaks
- Not accessible from other origins
- Automatically cleaned up on page unload

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. Do not create public GitHub issues for security vulnerabilities
2. Email security concerns to the maintainers
3. Allow reasonable time for fixes before disclosure

## Security Checklist

- [x] SSRF protection on all fetch endpoints
- [x] Rate limiting on resource-intensive endpoints
- [x] Response size limits
- [x] Content type validation
- [x] Input length validation
- [x] Cache key normalization
- [x] CORS headers configured
- [x] No sensitive data in logs
- [x] Client-side rendering (no data upload)
