"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            Made with <Heart className="h-4 w-4 text-red-500" /> for developers
          </div>

          <nav className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <a
              href="mailto:hi@og-image.org"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="https://github.com/7and1/og-image"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-6 text-center text-xs text-neutral-600">
          Open source. Free forever. No tracking.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
