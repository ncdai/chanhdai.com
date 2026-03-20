import type { Registry } from "shadcn/schema"

import { getRegistryItemUrl } from "@/utils/registry"

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
      },
    ],
    categories: ["application", "login"],
  },
  {
    name: "hero-01",
    title: "Hero 01",
    description: "A hero section with a golden spiral background.",
    type: "registry:block",
    registryDependencies: ["button", getRegistryItemUrl("style")],
    files: [
      {
        path: "blocks/hero-01/page.tsx",
        target: "app/hero/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/hero-01/components/hero-block.tsx",
        type: "registry:component",
      },
    ],
    categories: ["marketing", "hero"],
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
        path: "blocks/blog-01/page.tsx",
        target: "app/blog/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/blog-01/components/article-item.tsx",
        type: "registry:component",
      },
    ],
    categories: ["content", "blog"],
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
        path: "blocks/blog-02/page.tsx",
        target: "app/blog/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/blog-02/components/article-item.tsx",
        type: "registry:component",
      },
    ],
    categories: ["content", "blog"],
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
      },
      {
        path: "blocks/testimonials-01/components/testimonial-list.tsx",
        type: "registry:component",
      },
    ],
    categories: ["marketing", "testimonials"],
    meta: {
      previewClassName:
        "container mx-auto flex min-h-svh flex-col justify-center",
    },
  },
]
