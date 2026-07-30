import type { NextConfig } from "next"

/**
 * Component slugs that used to also render under /blog/<slug> (a shared MDX
 * pool) and were indexed there. After splitting content into category folders
 * they live only at /components/<slug>, so the legacy /blog URLs are permanently
 * redirected below to avoid 404s.
 *
 * This is a fixed snapshot of the previously-indexed slugs — components added
 * after the split were never on /blog and don't need an entry.
 */
const LEGACY_BLOG_COMPONENT_SLUGS = [
  "apple-hello-effect",
  "brand-assets-menu",
  "chevrons-up-down-icon",
  "code-block-command",
  "consent-manager",
  "copy-button",
  "dot-grid-spotlight",
  "elastic-slider",
  "fluid-gradient-text",
  "github-contributions",
  "github-stars",
  "glow-card-grid",
  "haptic",
  "icon-swap",
  "middle-truncation",
  "mobius-loop-icon",
  "react-wheel-picker",
  "scroll-fade-effect",
  "shimmering-text",
  "slide-to-unlock",
  "spinning-circular-text",
  "testimonial-spotlight",
  "testimonial",
  "testimonials-marquee",
  "text-flip",
  "theme-switcher",
  "theme-toggle-effect",
  "toc-minimap",
  "twemoji",
  "work-experience-component",
] as const

const legacyBlogComponentRedirects = LEGACY_BLOG_COMPONENT_SLUGS.map(
  (slug) => ({
    source: `/blog/${slug}`,
    destination: `/components/${slug}`,
    permanent: true,
  })
)

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["next-mdx-remote"],
  allowedDevOrigins: ["ncdai.localhost", "ncdai.local"],
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.chanhdai.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
    qualities: [75, 100],
  },
  compiler:
    process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error"],
          },
        }
      : undefined,
  async redirects() {
    return [
      {
        source: "/:section(blog|components)/writing-effect-inspired-by-apple",
        destination: "/:section/apple-hello-effect",
        permanent: true,
      },
      {
        source: "/:section(blog|components)/work-experience",
        destination: "/:section/work-experience-component",
        permanent: true,
      },
      {
        source: "/:section(blog|components)/theme-switcher-component",
        destination: "/:section/theme-switcher",
        permanent: true,
      },
      {
        source: "/wall-of-love",
        destination: "/testimonials",
        permanent: true,
      },
      /**
       * /llms-full.txt used to serve the whole site as one document. It is now
       * covered by /llms.txt plus the per-section .md routes, so agents probing
       * the conventional URL land on the index instead of a 404.
       */
      {
        source: "/llms-full.txt",
        destination: "/llms.txt",
        permanent: true,
      },
      {
        source: "/blocks/content",
        destination: "/blocks/marketing",
        permanent: true,
      },
      {
        source: "/blocks/content/blog-01",
        destination: "/blocks/marketing/blog-01",
        permanent: true,
      },
      {
        source: "/blocks/content/blog-02",
        destination: "/blocks/marketing/blog-02",
        permanent: true,
      },
      {
        source: "/blocks/content/experience-01",
        destination: "/blocks/marketing/experience-01",
        permanent: true,
      },
      {
        source: "/blocks/content/team-01",
        destination: "/blocks/marketing/team-01",
        permanent: true,
      },
      ...legacyBlogComponentRedirects,
    ]
  },
  async rewrites() {
    return [
      {
        source: "/:section(blog|components)/:slug.mdx",
        destination: "/doc.mdx/:slug",
      },
      {
        source: "/:section(blog|components)/:slug",
        destination: "/doc.mdx/:slug",
        has: [
          {
            type: "header",
            key: "accept",
            value: "(?<accept>.*text/markdown.*)",
          },
        ],
      },
      {
        source: "/rss",
        destination: "/blog/rss",
      },
      {
        source: "/registry/rss",
        destination: "/components/rss",
      },
    ]
  },
}

export default nextConfig
