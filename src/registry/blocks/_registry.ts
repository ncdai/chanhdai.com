import { getRegistryItemUrl, getRegistryItemUrls } from "@/utils/registry"
import type { Registry } from "shadcn/schema"

export const blocks: Registry["items"] = [
  {
    name: "login-01",
    title: "Login 01",
    description: "A simple login form.",
    type: "registry:block",
    registryDependencies: ["button", "card", "input", "label", "field"],
    files: [
      {
        path: "blocks/login-01/page.tsx",
        target: "app/login/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/login-01/components/login-form.tsx",
        type: "registry:component",
        target: "@components/login-form.tsx",
      },
    ],
    categories: ["application"],
    meta: { createdAt: "2026-02-22" },
  },
  {
    name: "hero-01",
    title: "Hero 01",
    description: "A hero section with a golden spiral background.",
    type: "registry:block",
    registryDependencies: ["button", getRegistryItemUrl("style")],
    files: [
      {
        path: "blocks/hero-01/hero-01.tsx",
        type: "registry:component",
        target: "@components/hero-01.tsx",
      },
      {
        path: "blocks/hero-01/components/hero-01-icons.tsx",
        type: "registry:component",
        target: "@components/hero-01-icons.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-03-12",
    },
  },
  {
    name: "blog-01",
    title: "Blog 01",
    description: "A blog section with a grid layout.",
    type: "registry:block",
    dependencies: ["date-fns"],
    registryDependencies: ["button"],
    files: [
      {
        path: "blocks/blog-01/blog-01.tsx",
        type: "registry:component",
        target: "@components/blog-01.tsx",
      },
      {
        path: "blocks/blog-01/components/article-item.tsx",
        type: "registry:component",
        target: "@components/article-item.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-03-13",
    },
  },
  {
    name: "blog-02",
    title: "Blog 02",
    description: "A blog section with a lined grid layout.",
    type: "registry:block",
    dependencies: ["date-fns"],
    registryDependencies: ["button", getRegistryItemUrl("style")],
    files: [
      {
        path: "blocks/blog-02/blog-02.tsx",
        type: "registry:component",
        target: "@components/blog-02.tsx",
      },
      {
        path: "blocks/blog-02/components/article-item.tsx",
        type: "registry:component",
        target: "@components/article-item.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-03-18",
    },
  },
  {
    name: "testimonials-01",
    title: "Testimonials 01",
    description: "A testimonials section with dual marquees.",
    type: "registry:block",
    registryDependencies: [
      "https://www.kibo-ui.com/r/marquee.json",
      getRegistryItemUrl("testimonial-spotlight"),
    ],
    files: [
      {
        path: "blocks/testimonials-01/testimonials-01.tsx",
        type: "registry:component",
        target: "@components/testimonials-01.tsx",
      },
      {
        path: "blocks/testimonials-01/components/testimonial-list.tsx",
        type: "registry:component",
        target: "@components/testimonial-list.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-03-20",
      previewClassName: "container mx-auto min-h-svh content-center-safe",
    },
  },
  {
    name: "testimonials-02",
    title: "Testimonials 02",
    description: "A testimonials section with a lined layout.",
    type: "registry:block",
    registryDependencies: [
      "https://www.kibo-ui.com/r/marquee.json",
      ...getRegistryItemUrls("style", "testimonial"),
    ],
    files: [
      {
        path: "blocks/testimonials-02/testimonials-02.tsx",
        type: "registry:component",
        target: "@components/testimonials-02.tsx",
      },
      {
        path: "blocks/testimonials-02/components/testimonial-list.tsx",
        type: "registry:component",
        target: "@components/testimonial-list.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-03-29",
      previewClassName: "min-h-svh content-center-safe",
    },
  },
  {
    name: "experience-01",
    title: "Experience 01",
    description: "A work experience section with a lined layout.",
    type: "registry:block",
    registryDependencies: [...getRegistryItemUrls("style", "work-experience")],
    files: [
      {
        path: "blocks/experience-01/experience-01.tsx",
        type: "registry:component",
        target: "@components/experience-01.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-03-28",
    },
  },
  {
    name: "team-01",
    title: "Team 01",
    description: "A team section with glowing cards.",
    type: "registry:block",
    registryDependencies: [getRegistryItemUrl("glow-card-grid")],
    files: [
      {
        path: "blocks/team-01/team-01.tsx",
        type: "registry:component",
        target: "@components/team-01.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-03-30",
      previewClassName: "min-h-svh place-items-center-safe content-center-safe",
    },
  },
  {
    name: "metrics-01",
    title: "Metrics 01",
    description: "A metrics section with a line chart.",
    type: "registry:block",
    dependencies: ["date-fns"],
    registryDependencies: ["@bklit/line-chart", getRegistryItemUrl("style")],
    files: [
      {
        path: "blocks/metrics-01/metrics-01.tsx",
        type: "registry:component",
        target: "@components/metrics-01.tsx",
      },
      {
        path: "blocks/metrics-01/components/metric.tsx",
        type: "registry:component",
        target: "@components/metric.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-05-24",
      previewClassName: "min-h-svh content-center-safe",
    },
  },
  {
    name: "social-links-01",
    title: "Social Links 01",
    description: "A social links section with a lined grid layout.",
    type: "registry:block",
    registryDependencies: [getRegistryItemUrl("style")],
    files: [
      {
        path: "blocks/social-links-01/social-links-01.tsx",
        type: "registry:component",
        target: "@components/social-links-01.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-06-16",
      previewClassName: "min-h-svh content-center-safe",
    },
  },
  {
    name: "social-proof-01",
    title: "Social Proof 01",
    description: "A social proof section with a logos carousel.",
    type: "registry:block",
    registryDependencies: [getRegistryItemUrl("logos-carousel")],
    files: [
      {
        path: "blocks/social-proof-01/social-proof-01.tsx",
        type: "registry:component",
        target: "@components/social-proof-01.tsx",
      },
    ],
    categories: ["marketing"],
    meta: {
      createdAt: "2026-06-26",
      previewClassName: "min-h-svh content-center-safe",
    },
  },
  {
    name: "not-found-01",
    title: "Not Found 01",
    description: "A 404 page with a playable brick breaker game.",
    type: "registry:block",
    // p5 2.x is a breaking rewrite (no `preload`), so the range stays on 1.x.
    dependencies: ["p5@^1.9.4", "motion", "next-themes"],
    devDependencies: ["@types/p5@^1.7.7"],
    registryDependencies: ["button", "empty"],
    files: [
      {
        path: "blocks/not-found-01/page.tsx",
        type: "registry:page",
        target: "app/not-found.tsx",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/index.tsx",
        type: "registry:component",
        target: "@components/daikanoid/index.tsx",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/component.tsx",
        type: "registry:component",
        target: "@components/daikanoid/component.tsx",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/ball.ts",
        type: "registry:component",
        target: "@components/daikanoid/ball.ts",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/brick.ts",
        type: "registry:component",
        target: "@components/daikanoid/brick.ts",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/paddle.ts",
        type: "registry:component",
        target: "@components/daikanoid/paddle.ts",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/logos.ts",
        type: "registry:component",
        target: "@components/daikanoid/logos.ts",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/colors.ts",
        type: "registry:component",
        target: "@components/daikanoid/colors.ts",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/constants.ts",
        type: "registry:component",
        target: "@components/daikanoid/constants.ts",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/types.ts",
        type: "registry:component",
        target: "@components/daikanoid/types.ts",
      },
      {
        path: "blocks/not-found-01/components/daikanoid/ui.ts",
        type: "registry:component",
        target: "@components/daikanoid/ui.ts",
      },
    ],
    cssVars: {
      light: {
        "dk-background": "#ffffff",
        "dk-foreground": "#09090b",
        "dk-muted-foreground": "#a1a1aa",
        "dk-brick": "#a1a1aa",
        "dk-brick-highlight": "rgba(255, 255, 255, 0.5)",
        "dk-brick-shadow": "#71717a",
      },
      dark: {
        "dk-background": "#09090b",
        "dk-foreground": "#fafafa",
        "dk-muted-foreground": "#71717a",
        "dk-brick": "#71717a",
        "dk-brick-highlight": "rgba(255, 255, 255, 0.3)",
        "dk-brick-shadow": "#3f3f46",
      },
    },
    categories: ["application"],
    meta: {
      createdAt: "2026-08-09",
    },
  },
]
