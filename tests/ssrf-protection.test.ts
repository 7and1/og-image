import { describe, expect, it } from "vitest";

/**
 * SSRF Protection Tests
 * Tests the URL validation logic used in parse.ts and sitemap.ts
 */

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

describe("SSRF Protection", () => {
  describe("blocks localhost and loopback addresses", () => {
    it("blocks localhost", () => {
      expect(isBlockedUrl(new URL("http://localhost/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://localhost:8080/"))).toBe(true);
    });

    it("blocks 127.0.0.1", () => {
      expect(isBlockedUrl(new URL("http://127.0.0.1/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://127.0.0.1:3000/api"))).toBe(true);
    });

    it("blocks 0.0.0.0", () => {
      expect(isBlockedUrl(new URL("http://0.0.0.0/"))).toBe(true);
    });

    it("blocks IPv6 loopback", () => {
      expect(isBlockedUrl(new URL("http://[::1]/"))).toBe(true);
    });
  });

  describe("blocks private IP ranges", () => {
    it("blocks 10.x.x.x range", () => {
      expect(isBlockedUrl(new URL("http://10.0.0.1/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://10.255.255.255/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://10.10.10.10/"))).toBe(true);
    });

    it("blocks 172.16-31.x.x range", () => {
      expect(isBlockedUrl(new URL("http://172.16.0.1/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://172.31.255.255/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://172.20.10.5/"))).toBe(true);
    });

    it("allows 172.x outside private range", () => {
      expect(isBlockedUrl(new URL("http://172.15.0.1/"))).toBe(false);
      expect(isBlockedUrl(new URL("http://172.32.0.1/"))).toBe(false);
    });

    it("blocks 192.168.x.x range", () => {
      expect(isBlockedUrl(new URL("http://192.168.0.1/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://192.168.1.1/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://192.168.255.255/"))).toBe(true);
    });
  });

  describe("blocks cloud metadata endpoints", () => {
    it("blocks AWS/GCP metadata IP", () => {
      expect(isBlockedUrl(new URL("http://169.254.169.254/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://169.254.169.254/latest/meta-data/"))).toBe(true);
    });

    it("blocks GCP metadata hostname", () => {
      expect(isBlockedUrl(new URL("http://metadata.google.internal/"))).toBe(true);
    });
  });

  describe("blocks internal domain patterns", () => {
    it("blocks .local domains", () => {
      expect(isBlockedUrl(new URL("http://myserver.local/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://db.local/"))).toBe(true);
    });

    it("blocks .internal domains", () => {
      expect(isBlockedUrl(new URL("http://api.internal/"))).toBe(true);
      expect(isBlockedUrl(new URL("http://service.internal/"))).toBe(true);
    });

    it("blocks .localhost domains", () => {
      expect(isBlockedUrl(new URL("http://app.localhost/"))).toBe(true);
    });
  });

  describe("blocks non-HTTP protocols", () => {
    it("blocks file protocol", () => {
      expect(isBlockedUrl(new URL("file:///etc/passwd"))).toBe(true);
    });

    it("blocks ftp protocol", () => {
      expect(isBlockedUrl(new URL("ftp://example.com/"))).toBe(true);
    });
  });

  describe("allows valid public URLs", () => {
    it("allows public HTTPS URLs", () => {
      expect(isBlockedUrl(new URL("https://example.com/"))).toBe(false);
      expect(isBlockedUrl(new URL("https://google.com/"))).toBe(false);
      expect(isBlockedUrl(new URL("https://github.com/"))).toBe(false);
    });

    it("allows public HTTP URLs", () => {
      expect(isBlockedUrl(new URL("http://example.com/"))).toBe(false);
    });

    it("allows public IP addresses", () => {
      expect(isBlockedUrl(new URL("http://8.8.8.8/"))).toBe(false);
      expect(isBlockedUrl(new URL("http://1.1.1.1/"))).toBe(false);
    });
  });
});
