import type { Registry } from "shadcn/schema";

export const components: Registry["items"] = [
  {
    name: "theme-switcher",
    type: "registry:component",
    description:
      "A theme switcher component for Next.js apps with next-themes and Tailwind CSS, supporting system, light, and dark modes.",
    title: "Theme Switcher",
    author: "ncdai <dai@chanhdai.com>",
    dependencies: ["next-themes", "lucide-react", "motion"],
    registryDependencies: ["@ncdai/utils"],
    files: [
      {
        path: "theme-switcher/theme-switcher.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/theme-switcher-component",
  },
  {
    name: "flip-sentences",
    type: "registry:component",
    title: "Flip Sentences",
    author: "ncdai <dai@chanhdai.com>",
    dependencies: ["motion"],
    registryDependencies: ["@ncdai/utils"],
    files: [
      {
        path: "flip-sentences/flip-sentences.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "apple-hello-effect",
    type: "registry:component",
    description:
      "Create a Xin chào and Hello writing effect inspired by Apple using Motion for React.",
    title: "Apple Hello Effect",
    author: "ncdai <dai@chanhdai.com>",
    dependencies: ["motion"],
    registryDependencies: ["@ncdai/utils"],
    files: [
      {
        path: "apple-hello-effect/apple-hello-effect.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/apple-hello-effect",
  },
  {
    name: "wheel-picker",
    type: "registry:component",
    description:
      "iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support.",
    title: "Wheel Picker",
    author: "ncdai <dai@chanhdai.com>",
    dependencies: ["@ncdai/react-wheel-picker"],
    registryDependencies: ["@ncdai/utils"],
    files: [
      {
        path: "wheel-picker/wheel-picker.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/react-wheel-picker",
  },
  {
    name: "work-experience",
    type: "registry:component",
    description:
      "Displays a list of work experiences with role details and durations.",
    title: "Work Experience",
    author: "ncdai <dai@chanhdai.com>",
    dependencies: ["react-markdown", "lucide-react"],
    devDependencies: ["@tailwindcss/typography", "tw-animate-css"],
    registryDependencies: ["@ncdai/utils", "collapsible", "separator"],
    files: [
      {
        path: "work-experience/work-experience.tsx",
        type: "registry:component",
      },
    ],
    cssVars: {
      light: {
        background: "oklch(1 0 0)",
        muted: "oklch(0.967 0.001 286.375)",
        "muted-foreground": "oklch(0.552 0.016 285.938)",
        border: "oklch(0.92 0.004 286.32)",
      },
      dark: {
        background: "oklch(0.141 0.005 285.823)",
        muted: "oklch(0.274 0.006 286.033)",
        "muted-foreground": "oklch(0.705 0.015 286.067)",
        border: "oklch(0.274 0.006 286.033)",
      },
    },
    css: {
      '@import "tw-animate-css"': {},
      "@plugin @tailwindcss/typography": {},
    },
    docs: "https://chanhdai.com/components/work-experience-component",
  },
  {
    name: "shimmering-text",
    type: "registry:component",
    description: "Smooth shimmering text animation built with Motion.",
    title: "Shimmering Text",
    author: "ncdai <dai@chanhdai.com>",
    dependencies: ["motion"],
    registryDependencies: ["@ncdai/utils"],
    files: [
      {
        path: "shimmering-text/shimmering-text.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "slide-to-unlock",
    type: "registry:component",
    description:
      "A sleek, interactive slider inspired by the classic iPhone OS 'slide to unlock' gesture.",
    title: "Slide to Unlock",
    author: "ncdai <dai@chanhdai.com>",
    dependencies: ["motion"],
    registryDependencies: ["@ncdai/utils", "@ncdai/shimmering-text"],
    files: [
      {
        path: "slide-to-unlock/slide-to-unlock.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/slide-to-unlock",
  },
  {
    name: "testimonials-marquee",
    type: "registry:component",
    description:
      "A testimonials marquee component for showcasing user feedback in a scrolling format.",
    title: "Testimonials Marquee",
    author: "ncdai <dai@chanhdai.com>",
    registryDependencies: ["@ncdai/utils", "@kibo-ui/marquee"],
    files: [
      {
        path: "testimonials-marquee/testimonials-marquee.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/testimonials-marquee",
  },
  {
    name: "github-stars",
    type: "registry:component",
    description:
      "Display GitHub repository star count with formatted numbers and a tooltip showing the full count.",
    title: "GitHub Stars",
    author: "ncdai <dai@chanhdai.com>",
    registryDependencies: ["button", "tooltip"],
    files: [
      {
        path: "github-stars/github-stars.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "scroll-fade-effect",
    type: "registry:component",
    description:
      "A React component that adds a fade effect to content as you scroll.",
    title: "Scroll Fade Effect",
    author: "ncdai <dai@chanhdai.com>",
    registryDependencies: ["@ncdai/utils"],
    files: [
      {
        path: "scroll-fade-effect/scroll-fade-effect.tsx",
        type: "registry:component",
      },
    ],
    css: {
      "@property --top-mask-height": {
        syntax: '"<length>"',
        inherits: "true",
        "initial-value": "0px",
      },
      "@property --bottom-mask-height": {
        syntax: '"<length>"',
        inherits: "true",
        "initial-value": "64px",
      },
      "@property --left-mask-width": {
        syntax: '"<length>"',
        inherits: "true",
        "initial-value": "0px",
      },
      "@property --right-mask-width": {
        syntax: '"<length>"',
        inherits: "true",
        "initial-value": "64px",
      },
      "@layer base": {
        "@keyframes show-top-mask": {
          to: {
            "--top-mask-height": "var(--mask-height)",
          },
        },
        "@keyframes hide-bottom-mask": {
          to: {
            "--bottom-mask-height": "0px",
          },
        },
        "@keyframes show-left-mask": {
          to: {
            "--left-mask-width": "var(--mask-width)",
          },
        },
        "@keyframes hide-right-mask": {
          to: {
            "--right-mask-width": "0px",
          },
        },
      },
      "@utility scroll-fade-effect-y": {
        "--mask-height": "64px",
        "--mask-offset-top": "0px",
        "--mask-offset-bottom": "0px",
        "--scroll-buffer": "2rem",
        "mask-image":
          "linear-gradient(to top, transparent, black 90%), linear-gradient(to bottom, transparent 0%, black 100%), linear-gradient(black, black)",
        "mask-size":
          "100% var(--top-mask-height), 100% var(--bottom-mask-height), 100% 100%",
        "mask-repeat": "no-repeat, no-repeat, no-repeat",
        "mask-position":
          "0 var(--mask-offset-top), 0 calc(100% - var(--mask-offset-bottom)), 0 0",
        "mask-composite": "exclude",
        "animation-name": "show-top-mask, hide-bottom-mask",
        "animation-timeline": "scroll(self), scroll(self)",
        "animation-range":
          "0 var(--scroll-buffer), calc(100% - var(--scroll-buffer)) 100%",
        "animation-fill-mode": "both",
      },
      "@utility scroll-fade-effect-x": {
        "--mask-width": "64px",
        "--mask-offset-left": "0px",
        "--mask-offset-right": "0px",
        "--scroll-buffer": "2rem",
        "mask-image":
          "linear-gradient(to left, transparent, black 90%), linear-gradient(to right, transparent 0%, black 100%), linear-gradient(black, black)",
        "mask-size":
          "var(--left-mask-width) 100%, var(--right-mask-width) 100%, 100% 100%",
        "mask-repeat": "no-repeat, no-repeat, no-repeat",
        "mask-position":
          "var(--mask-offset-left) 0, calc(100% - var(--mask-offset-right)) 0, 0 0",
        "mask-composite": "exclude",
        "animation-name": "show-left-mask, hide-right-mask",
        "animation-timeline": "scroll(self inline), scroll(self inline)",
        "animation-range":
          "0 var(--scroll-buffer), calc(100% - var(--scroll-buffer)) 100%",
        "animation-fill-mode": "both",
      },
    },
  },
  {
    name: "consent-manager",
    type: "registry:component",
    description:
      "A React component for managing user consent for cookies and tracking in Next.js applications.",
    title: "Consent Manager",
    author: "ncdai <dai@chanhdai.com>",
    dependencies: ["@c15t/nextjs"],
    registryDependencies: ["@ncdai/utils", "button"],
    files: [
      {
        path: "src/components/consent-manager.tsx",
        type: "registry:component",
      },
      {
        path: "consent-manager/consent-manager-client.tsx",
        type: "registry:component",
      },
    ],
    cssVars: {
      light: {
        "popover-border":
          "color-mix(in oklab, var(--color-black) 15%, transparent)",
        "shadow-popover": "0 6px 24px rgba(0, 0, 0, 0.25)",
      },
      dark: {
        "popover-border": "oklch(0.37 0.013 285.805)",
        "shadow-popover": "0 0 24px rgba(0, 0, 0, 0.5)",
      },
      theme: {
        "color-popover-border": "var(--popover-border)",
        "shadow-popover": "var(--shadow-popover)",
      },
    },
  },
];
