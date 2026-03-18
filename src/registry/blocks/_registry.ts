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
      },
    ],
    categories: ["authentication", "login"],
  },
  {
    name: "hero-01",
    title: "Hero 01",
    description: "A hero section with a golden spiral background.",
    type: "registry:block",
    registryDependencies: ["button"],
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
    categories: ["layout", "hero"],
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
    categories: ["layout", "blog"],
  },
  {
    name: "blog-02",
    title: "Blog 02",
    description: "A blog section with a lined grid layout.",
    type: "registry:block",
    dependencies: ["date-fns"],
    registryDependencies: ["button"],
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
    css: {
      "@utility line-x-t": {
        "@apply relative before:absolute before:top-0 before:-left-[100vw] before:-z-1 before:h-px before:w-[200vw] before:bg-border/80":
          {},
      },
      "@utility line-x-b": {
        "@apply relative after:absolute after:bottom-0 after:-left-[100vw] after:-z-1 after:h-px after:w-[200vw] after:bg-border/80":
          {},
      },
    },
    categories: ["layout", "blog"],
  },
]
