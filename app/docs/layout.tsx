"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/getting-started" },
    ],
  },
  {
    title: "Framework Guides",
    items: [
      { title: "Next.js", href: "/docs/guides/nextjs" },
      { title: "React", href: "/docs/guides/react" },
      { title: "Vue.js", href: "/docs/guides/vue" },
    ],
  },
  {
    title: "Platform Specs",
    items: [
      { title: "Twitter/X", href: "/docs/platforms/twitter" },
      { title: "LinkedIn", href: "/docs/platforms/linkedin" },
      { title: "Facebook", href: "/docs/platforms/facebook" },
    ],
  },
  {
    title: "Reference",
    items: [{ title: "API Documentation", href: "/docs/api" }],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-[calc(100vh-112px)] bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block">
            <nav
              className="sticky top-8 space-y-6"
              aria-label="Documentation navigation"
            >
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold text-sm text-white mb-2">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                              isActive
                                ? "bg-blue-600/20 text-blue-400"
                                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Mobile Navigation */}
          <div className="lg:hidden mb-8">
            <details className="group">
              <summary className="flex items-center justify-between px-4 py-3 bg-neutral-900 rounded-lg cursor-pointer list-none">
                <span className="font-medium text-white">Documentation</span>
                <svg
                  className="w-5 h-5 text-neutral-400 group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <nav className="mt-2 p-4 bg-neutral-900 rounded-lg space-y-4">
                {navigation.map((section) => (
                  <div key={section.title}>
                    <h3 className="font-semibold text-sm text-white mb-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                                isActive
                                  ? "bg-blue-600/20 text-blue-400"
                                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                              }`}
                            >
                              {item.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </details>
          </div>

          {/* Main Content */}
          <main className="prose prose-invert prose-neutral max-w-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
