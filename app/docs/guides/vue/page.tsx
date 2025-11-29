import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vue.js OG Image Guide - Open Graph for Vue Apps | og-image.org",
  description:
    "Complete guide to implementing Open Graph images in Vue.js applications. Covers Vue 3, Nuxt 3, and Vite setups with best practices for social sharing.",
  openGraph: {
    title: "Vue.js OG Image Guide - Open Graph for Vue Apps",
    description:
      "Complete guide to implementing Open Graph images in Vue.js applications.",
    url: "https://og-image.org/docs/guides/vue",
  },
};

export default function VueGuidePage() {
  return (
    <article>
      <h1 className="text-4xl font-bold tracking-tight text-white mb-6">
        Vue.js Open Graph Image Guide
      </h1>

      <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
        Vue.js has come a long way. With Vue 3 and Nuxt 3, handling OG images is more elegant than
        ever. Whether you're building a simple SPA or a full-stack app with Nuxt, this guide shows
        you exactly how to make your social shares look professional.
      </p>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
        <p className="text-blue-400 font-medium">
          This guide covers Vue 3 with Composition API. If you're using Nuxt 3, skip ahead to the
          Nuxt section—it has built-in features that make OG images trivial to implement.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        The Vue Ecosystem: Your Options
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Just like React, Vue itself doesn't handle meta tags. But the ecosystem has solid solutions.
        Here's the landscape:
      </p>

      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-white font-semibold">Setup</th>
              <th className="text-left py-3 px-4 text-white font-semibold">Best Solution</th>
              <th className="text-left py-3 px-4 text-white font-semibold">SEO Score</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Nuxt 3</td>
              <td className="py-3 px-4 text-neutral-400">useHead() composable</td>
              <td className="py-3 px-4 text-green-400">Excellent</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Vue 3 + Vite</td>
              <td className="py-3 px-4 text-neutral-400">@unhead/vue + vite-ssg</td>
              <td className="py-3 px-4 text-yellow-400">Good with SSG</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 px-4 text-neutral-300">Vue 3 SPA</td>
              <td className="py-3 px-4 text-neutral-400">Static HTML or prerender</td>
              <td className="py-3 px-4 text-orange-400">Requires work</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Nuxt 3: The Easy Path
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        If you're using Nuxt 3, you've already won. Nuxt has first-class support for meta tags
        through the <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">useHead()</code> and <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">useSeoMeta()</code> composables.
        Since Nuxt server-renders by default, crawlers see your meta tags immediately.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Global Configuration</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Your Site Name',
      meta: [
        { name: 'description', content: 'Your site description' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Your Site Name' },
        { property: 'og:image', content: 'https://yoursite.com/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
    },
  },
})`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Page-Specific Meta Tags</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- pages/about.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'About Us',
  ogTitle: 'About Us | Your Site Name',
  description: 'Learn about our mission and team.',
  ogDescription: 'Learn about our mission and team.',
  ogImage: 'https://yoursite.com/og-about.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <h1>About Us</h1>
    <!-- content -->
  </div>
</template>`}</code>
      </pre>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        The <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">useSeoMeta()</code> composable is type-safe and
        covers all standard OG and Twitter tags. Nuxt handles the server-rendering, so crawlers
        see everything correctly.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Dynamic Routes with Async Data</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { data: post } = await useFetch(\`/api/posts/\${route.params.slug}\`)

useSeoMeta({
  title: () => post.value?.title,
  ogTitle: () => \`\${post.value?.title} | Your Blog\`,
  description: () => post.value?.excerpt,
  ogDescription: () => post.value?.excerpt,
  ogImage: () => \`https://yoursite.com/og/blog/\${route.params.slug}.png\`,
  ogType: 'article',
  articlePublishedTime: () => post.value?.publishedAt,
  articleAuthor: () => post.value?.author,
})
</script>

<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <div v-html="post.content" />
  </article>
</template>`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        Notice how we pass functions to <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">useSeoMeta()</code>?
        This makes the values reactive—they update as your data loads. Perfect for dynamic content.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Vue 3 + Vite: Static Site Generation
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        If you're not using Nuxt, you can still get excellent SEO with Vite's SSG plugins.
        The approach: use <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">@unhead/vue</code> for meta management and <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">vite-ssg</code> for
        pre-rendering at build time.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Installation</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`npm install @unhead/vue vite-ssg`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Setup</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// src/main.ts
import { ViteSSG } from 'vite-ssg'
import { createHead } from '@unhead/vue'
import App from './App.vue'
import routes from './routes'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    const head = createHead()
    app.use(head)
  }
)`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Using in Components</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- src/pages/About.vue -->
<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'

useHead({
  title: 'About Us | Your Site',
})

useSeoMeta({
  description: 'Learn about our mission and team.',
  ogTitle: 'About Us | Your Site',
  ogDescription: 'Learn about our mission and team.',
  ogImage: 'https://yoursite.com/og-about.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <h1>About Us</h1>
  </div>
</template>`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Build Configuration</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    // Specify routes to pre-render
    includedRoutes(paths) {
      return paths.filter(p => !p.includes(':'))
    },
  },
})`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        When you build, vite-ssg generates static HTML for each route with all meta tags baked in.
        Crawlers get exactly what they need.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Plain Vue 3 SPA: The Manual Approach
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Running a pure Vue SPA without SSG or Nuxt? You'll need to work a bit harder. Here's the
        most practical approach:
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Static Meta Tags in index.html</h3>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Your App Name</title>
  <meta name="description" content="Your app description" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://yoursite.com" />
  <meta property="og:title" content="Your App Name" />
  <meta property="og:description" content="Your app description" />
  <meta property="og:image" content="https://yoursite.com/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Your App Name" />
  <meta name="twitter:description" content="Your app description" />
  <meta name="twitter:image" content="https://yoursite.com/og-image.png" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        This works for your main pages. For dynamic routes, you'll need either pre-rendering
        or server-side handling. Honestly, at that point, consider Nuxt—it's built exactly for this.
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Generating OG Images for Vue Apps
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Now let's talk about the images themselves. You've got the same options as any other framework:
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Option 1: Manual Creation</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Use <Link href="/" className="text-blue-400 hover:text-blue-300">og-image.org</Link> to create
        images for each page. Drop them in your <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">public</code> folder and reference them in your meta tags.
      </p>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Option 2: Build-Time Generation with Nuxt</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Nuxt Image module can generate OG images at build time:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`npm install @nuxt/image`}</code>
      </pre>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // Configuration for OG image generation
  },
})`}</code>
      </pre>

      <h3 className="text-lg font-semibold text-white mt-8 mb-3">Option 3: Nuxt OG Image Module</h3>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        For full dynamic generation, the <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">nuxt-og-image</code> module is
        incredibly powerful:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`npm install nuxt-og-image`}</code>
      </pre>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-og-image'],
})`}</code>
      </pre>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
defineOgImage({
  component: 'BlogPost',
  props: {
    title: post.value?.title,
    description: post.value?.excerpt,
    author: post.value?.author,
  },
})
</script>`}</code>
      </pre>

      <p className="text-neutral-300 mb-8 leading-relaxed">
        The module generates images on-demand using Vue components. You design the OG image layout
        in Vue, and Nuxt handles the rendering. Same technology we use at og-image.org (Satori).
      </p>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Complete Nuxt 3 Blog Example
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Let's put together a complete blog with proper OG images:
      </p>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'nuxt-og-image'],

  app: {
    head: {
      titleTemplate: '%s | My Blog',
      meta: [
        { property: 'og:site_name', content: 'My Blog' },
        { name: 'twitter:site', content: '@yourusername' },
      ],
    },
  },

  ogImage: {
    defaults: {
      component: 'OgImageTemplate',
    },
  },
})`}</code>
      </pre>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- components/OgImageTemplate.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  publishedAt?: string
}>()
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-16">
    <h1 class="text-6xl font-bold text-white text-center mb-8 leading-tight">
      {{ title }}
    </h1>
    <p v-if="description" class="text-2xl text-gray-300 text-center max-w-3xl">
      {{ description }}
    </p>
    <div v-if="publishedAt" class="absolute bottom-8 text-gray-500">
      {{ new Date(publishedAt).toLocaleDateString() }}
    </div>
  </div>
</template>`}</code>
      </pre>

      <pre className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6 overflow-x-auto">
        <code className="text-sm text-neutral-300">{`<!-- pages/blog/[slug].vue -->
<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(\`blog-\${route.params.slug}\`, () =>
  queryContent('blog', route.params.slug as string).findOne()
)

if (!post.value) {
  throw createError({ statusCode: 404, message: 'Post not found' })
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogType: 'article',
  articlePublishedTime: post.value.publishedAt,
})

defineOgImage({
  props: {
    title: post.value.title,
    description: post.value.description,
    publishedAt: post.value.publishedAt,
  },
})
</script>

<template>
  <article class="prose prose-lg mx-auto py-12">
    <h1>{{ post.title }}</h1>
    <ContentRenderer :value="post" />
  </article>
</template>`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Testing in Vue/Nuxt
      </h2>

      <p className="text-neutral-300 mb-4 leading-relaxed">
        Before deploying, verify your OG setup:
      </p>

      <ol className="list-decimal list-inside text-neutral-300 mb-8 space-y-3">
        <li>Run <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">nuxi generate</code> and inspect the generated HTML files</li>
        <li>Check that each page has the correct og:image meta tag</li>
        <li>Use <Link href="/validator" className="text-blue-400 hover:text-blue-300">our validator</Link> to test how platforms see your pages</li>
        <li>If using nuxt-og-image, visit <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-sm">/__og-image__/image/your-path</code> to see the generated image</li>
      </ol>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">
        Common Issues and Fixes
      </h2>

      <div className="space-y-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Meta tags not showing in source</h3>
          <p className="text-neutral-400 text-sm">
            If you're using SPA mode, crawlers won't see dynamic meta tags. Switch to SSR or SSG mode
            in your Nuxt config: <code className="bg-neutral-800 px-1 rounded">ssr: true</code>
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">OG images not updating on social platforms</h3>
          <p className="text-neutral-400 text-sm">
            Social platforms cache OG images aggressively. Use platform debuggers to force a refresh,
            or add a cache-busting query parameter during development.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
          <h3 className="font-semibold text-white mb-2">Relative URLs not working</h3>
          <p className="text-neutral-400 text-sm">
            OG image URLs must be absolute. In Nuxt, set the <code className="bg-neutral-800 px-1 rounded">site.url</code> in
            your runtime config, and use <code className="bg-neutral-800 px-1 rounded">useRuntimeConfig().public.siteUrl</code> to build absolute URLs.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mt-12">
        <h3 className="font-semibold text-white mb-3">Summary</h3>
        <p className="text-neutral-400 mb-4">
          For Vue apps, Nuxt 3 is the path of least resistance. It handles SSR, meta tags, and
          even OG image generation out of the box. For plain Vue SPAs, use static images or
          add pre-rendering with vite-ssg.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Create OG Image
          </Link>
          <Link
            href="/docs/platforms/twitter"
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Twitter Optimization
          </Link>
        </div>
      </div>
    </article>
  );
}
