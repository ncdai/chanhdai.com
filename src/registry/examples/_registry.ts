import { getRegistryItemUrl } from "@/utils/registry"
import type { Registry } from "shadcn/schema"

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
    name: "apple-hello-effect-english-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("apple-hello-effect")],
    files: [
      {
        path: "examples/apple-hello-effect-english-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "apple-hello-effect-hindi-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("apple-hello-effect-hindi")],
    files: [
      {
        path: "examples/apple-hello-effect-hindi-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "apple-hello-effect-spanish-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("apple-hello-effect-spanish")],
    files: [
      {
        path: "examples/apple-hello-effect-spanish-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "apple-hello-effect-vietnamese-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("apple-hello-effect-vietnamese")],
    files: [
      {
        path: "examples/apple-hello-effect-vietnamese-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "apple-hello-effect-languages-demo",
    type: "registry:example",
    registryDependencies: [
      getRegistryItemUrl("apple-hello-effect-english"),
      getRegistryItemUrl("apple-hello-effect-hindi"),
      getRegistryItemUrl("apple-hello-effect-spanish"),
      getRegistryItemUrl("apple-hello-effect-vietnamese"),
    ],
    files: [
      {
        path: "examples/apple-hello-effect-languages-demo.tsx",
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
    name: "shimmering-text-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("shimmering-text")],
    files: [
      {
        path: "examples/shimmering-text-demo.tsx",
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
    name: "slide-to-unlock-demo",
    type: "registry:example",
    registryDependencies: [
      getRegistryItemUrl("slide-to-unlock"),
      getRegistryItemUrl("use-sound"),
    ],
    files: [
      {
        path: "examples/slide-to-unlock-demo.tsx",
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
    name: "testimonials-marquee-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("testimonials-marquee")],
    files: [
      {
        path: "examples/testimonials-marquee-demo.tsx",
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
    name: "scroll-fade-effect-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("scroll-fade-effect")],
    files: [
      {
        path: "examples/scroll-fade-effect-demo.tsx",
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
    name: "code-block-command-convert",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("code-block-command")],
    files: [
      {
        path: "examples/code-block-command-convert.tsx",
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
  {
    name: "haptic-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("haptic")],
    files: [
      {
        path: "examples/haptic-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "testimonial-spotlight-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("testimonial-spotlight")],
    files: [
      {
        path: "examples/testimonial-spotlight-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "glow-card-grid-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("glow-card-grid")],
    files: [
      {
        path: "examples/glow-card-grid-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "glow-card-grid-dialkit",
    type: "registry:example",
    dependencies: ["dialkit"],
    registryDependencies: [getRegistryItemUrl("glow-card-grid")],
    files: [
      {
        path: "examples/glow-card-grid-dialkit.tsx",
        type: "registry:example",
      },
    ],
    meta: {
      previewClassName: "min-h-svh place-items-center-safe content-center-safe",
    },
  },
  {
    name: "middle-truncation-demo",
    type: "registry:example",
    registryDependencies: [
      "resizable",
      getRegistryItemUrl("middle-truncation"),
    ],
    files: [
      {
        path: "examples/middle-truncation-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "twemoji-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("twemoji")],
    files: [
      {
        path: "examples/twemoji-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "theme-toggle-effect-demo",
    type: "registry:example",
    files: [
      {
        path: "examples/theme-toggle-effect-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "elastic-slider-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("elastic-slider")],
    files: [
      {
        path: "examples/elastic-slider-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "github-contributions-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("github-contributions")],
    files: [
      {
        path: "examples/github-contributions-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "github-contributions-default-theme",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("github-contributions")],
    files: [
      {
        path: "examples/github-contributions-default-theme.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "github-contributions-winter-theme",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("github-contributions")],
    files: [
      {
        path: "examples/github-contributions-winter-theme.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "github-contributions-halloween-theme",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("github-contributions")],
    files: [
      {
        path: "examples/github-contributions-halloween-theme.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "toc-minimap-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("toc-minimap")],
    files: [
      {
        path: "examples/toc-minimap-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "fluid-gradient-text-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("fluid-gradient-text")],
    files: [
      {
        path: "examples/fluid-gradient-text-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "fluid-gradient-text-dialkit",
    type: "registry:example",
    dependencies: ["dialkit"],
    registryDependencies: [getRegistryItemUrl("fluid-gradient-text")],
    files: [
      {
        path: "examples/fluid-gradient-text-dialkit.tsx",
        type: "registry:example",
      },
    ],
    meta: {
      previewClassName: "min-h-svh place-items-center-safe content-center-safe",
    },
  },
  {
    name: "brand-assets-menu-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("brand-assets-menu")],
    files: [
      {
        path: "examples/brand-assets-menu-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "icon-swap-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("icon-swap")],
    files: [
      {
        path: "examples/icon-swap-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "dot-grid-spotlight-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("dot-grid-spotlight")],
    files: [
      {
        path: "examples/dot-grid-spotlight-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinning-circular-text-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("spinning-circular-text")],
    files: [
      {
        path: "examples/spinning-circular-text-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spinning-circular-text-demo-2",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("spinning-circular-text")],
    files: [
      {
        path: "examples/spinning-circular-text-demo-2.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "mobius-loop-icon-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("mobius-loop-icon")],
    files: [
      {
        path: "examples/mobius-loop-icon-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "chevrons-up-down-icon-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("chevrons-up-down-icon")],
    files: [
      {
        path: "examples/chevrons-up-down-icon-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "logos-carousel-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("logos-carousel")],
    files: [
      {
        path: "examples/logos-carousel-demo.tsx",
        type: "registry:example",
      },
    ],
    meta: {
      previewClassName: "min-h-svh place-items-center-safe content-center-safe",
    },
  },
  {
    name: "testimonial-2-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("testimonial-2")],
    files: [
      {
        path: "examples/testimonial-2-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "line-nav-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("line-nav")],
    files: [
      {
        path: "examples/line-nav-demo.tsx",
        type: "registry:example",
      },
    ],
    meta: {
      previewClassName: "min-h-svh place-items-center-safe content-center-safe",
    },
  },
  {
    name: "share-menu-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("share-menu")],
    files: [
      {
        path: "examples/share-menu-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "spotlight-logo-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("spotlight-logo")],
    files: [
      {
        path: "examples/spotlight-logo-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "timescale-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("timescale")],
    files: [
      {
        path: "examples/timescale-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "status-button-demo",
    type: "registry:example",
    registryDependencies: [getRegistryItemUrl("status-button")],
    files: [
      {
        path: "examples/status-button-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "status-button-form-demo",
    type: "registry:example",
    registryDependencies: [
      "field",
      "input",
      getRegistryItemUrl("status-button"),
    ],
    files: [
      {
        path: "examples/status-button-form-demo.tsx",
        type: "registry:example",
      },
    ],
  },
]
