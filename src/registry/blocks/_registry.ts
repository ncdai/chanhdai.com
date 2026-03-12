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
    registryDependencies: ["button", "tooltip"],
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
      {
        path: "blocks/hero-01/components/brand-pronunciation.tsx",
        type: "registry:component",
      },
    ],
    categories: ["layout", "hero"],
  },
]
