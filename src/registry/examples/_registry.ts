import type { Registry } from "shadcn/schema"

import { getRegistryItemUrl } from "@/utils/registry"

export const examples: Registry["items"] = [
  {
    name: "text-flip-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("text-flip")],
    files: [
      {
        path: "examples/text-flip-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "apple-hello-effect-vi-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("apple-hello-effect")],
    files: [
      {
        path: "examples/apple-hello-effect-vi-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "apple-hello-effect-en-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("apple-hello-effect")],
    files: [
      {
        path: "examples/apple-hello-effect-en-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "theme-switcher-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("theme-switcher")],
    files: [
      {
        path: "examples/theme-switcher-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "wheel-picker-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("wheel-picker")],
    files: [
      {
        path: "examples/wheel-picker-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "wheel-picker-form-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("wheel-picker"), "form"],
    files: [
      {
        path: "examples/wheel-picker-form-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "work-experience-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("work-experience")],
    files: [
      {
        path: "examples/work-experience-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "shimmering-text-demo-01",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("shimmering-text")],
    files: [
      {
        path: "examples/shimmering-text-demo-01.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "shimmering-text-demo-02",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("shimmering-text")],
    files: [
      {
        path: "examples/shimmering-text-demo-02.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "slide-to-unlock-demo-01",
    type: "registry:example",
    registryDependencies: [
      getRegistryItemUrl("slide-to-unlock"),
      getRegistryItemUrl("use-sound"),
    ],
    files: [
      {
        path: "examples/slide-to-unlock-demo-01.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "slide-to-unlock-demo-02",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("slide-to-unlock")],
    files: [
      {
        path: "examples/slide-to-unlock-demo-02.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "slide-to-unlock-demo-03",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("slide-to-unlock")],
    files: [
      {
        path: "examples/slide-to-unlock-demo-03.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "testimonial-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("testimonial")],
    files: [
      {
        path: "examples/testimonial-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "testimonials-marquee-demo-01",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("testimonials-marquee")],
    files: [
      {
        path: "examples/testimonials-marquee-demo-01.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "testimonials-marquee-demo-02",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("testimonials-marquee")],
    files: [
      {
        path: "examples/testimonials-marquee-demo-02.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "github-stars-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("github-stars")],
    files: [
      {
        path: "examples/github-stars-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-fade-effect-demo-01",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("scroll-fade-effect")],
    files: [
      {
        path: "examples/scroll-fade-effect-demo-01.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-fade-effect-demo-02",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("scroll-fade-effect")],
    files: [
      {
        path: "examples/scroll-fade-effect-demo-02.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-fade-effect-demo-03",
    type: "registry:example",
    registryDependencies: [
      getRegistryItemUrl("scroll-fade-effect"),
      "scroll-area",
      "separator",
    ],
    files: [
      {
        path: "examples/scroll-fade-effect-demo-03.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "scroll-fade-effect-demo-04",
    type: "registry:example",
    registryDependencies: [
      getRegistryItemUrl("scroll-fade-effect"),
      "scroll-area",
    ],
    files: [
      {
        path: "examples/scroll-fade-effect-demo-04.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "code-block-command-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("code-block-command")],
    files: [
      {
        path: "examples/code-block-command-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "code-block-command-convert-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("code-block-command")],
    files: [
      {
        path: "examples/code-block-command-convert-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "copy-button-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("copy-button")],
    files: [
      {
        path: "examples/copy-button-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]
