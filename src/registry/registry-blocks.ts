import type { Registry } from "shadcn/schema";

export const blocks: Registry["items"] = [
  {
    name: "wheel-picker-block-01",
    type: "registry:block",
    registryDependencies: ["@ncdai/wheel-picker"],
    files: [
      {
        path: "examples/wheel-picker-demo.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "wheel-picker-block-02",
    type: "registry:block",
    dependencies: ["react-hook-form", "@hookform/resolvers", "zod"],
    registryDependencies: ["@ncdai/wheel-picker", "form", "button", "sonner"],
    files: [
      {
        path: "examples/wheel-picker-form-demo.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "work-experience-block-01",
    type: "registry:block",
    registryDependencies: ["@ncdai/work-experience"],
    files: [
      {
        path: "examples/work-experience-demo.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "shimmering-text-block-01",
    type: "registry:block",
    registryDependencies: ["@ncdai/shimmering-text"],
    files: [
      {
        path: "examples/shimmering-text-demo-01.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "shimmering-text-block-02",
    type: "registry:block",
    registryDependencies: ["@ncdai/shimmering-text"],
    files: [
      {
        path: "examples/shimmering-text-demo-02.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "slide-to-unlock-block-01",
    type: "registry:block",
    registryDependencies: ["@ncdai/slide-to-unlock", "@ncdai/use-sound"],
    files: [
      {
        path: "examples/slide-to-unlock-demo-01.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "slide-to-unlock-block-02",
    type: "registry:block",
    registryDependencies: ["@ncdai/slide-to-unlock"],
    files: [
      {
        path: "examples/slide-to-unlock-demo-02.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "slide-to-unlock-block-03",
    type: "registry:block",
    registryDependencies: ["@ncdai/slide-to-unlock"],
    files: [
      {
        path: "examples/slide-to-unlock-demo-03.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "testimonials-marquee-block-01",
    type: "registry:block",
    registryDependencies: ["@ncdai/testimonials-marquee"],
    files: [
      {
        path: "examples/testimonials-marquee-demo-01.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "testimonials-marquee-block-02",
    type: "registry:block",
    registryDependencies: ["@ncdai/testimonials-marquee"],
    files: [
      {
        path: "examples/testimonials-marquee-demo-02.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "scroll-fade-effect-block-01",
    type: "registry:block",
    registryDependencies: ["@ncdai/scroll-fade-effect"],
    files: [
      {
        path: "examples/scroll-fade-effect-demo-01.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "scroll-fade-effect-block-02",
    type: "registry:block",
    registryDependencies: ["@ncdai/scroll-fade-effect"],
    files: [
      {
        path: "examples/scroll-fade-effect-demo-02.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "scroll-fade-effect-block-03",
    type: "registry:block",
    registryDependencies: [
      "@ncdai/scroll-fade-effect",
      "scroll-area",
      "separator",
    ],
    files: [
      {
        path: "examples/scroll-fade-effect-demo-03.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "scroll-fade-effect-block-04",
    type: "registry:block",
    registryDependencies: ["@ncdai/scroll-fade-effect", "scroll-area"],
    files: [
      {
        path: "examples/scroll-fade-effect-demo-04.tsx",
        type: "registry:component",
      },
    ],
  },
];
