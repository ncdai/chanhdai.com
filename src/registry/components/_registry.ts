import type { Registry } from "shadcn/schema"

import { getRegistryItemUrl } from "@/utils/registry"

export const components: Registry["items"] = [
  {
    name: "theme-switcher",
    type: "registry:component",
    title: "Theme Switcher",
    description:
      "Toggle between system, light, and dark themes in Next.js apps.",
    dependencies: ["next-themes", "lucide-react", "motion"],
    files: [
      {
        path: "components/theme-switcher/theme-switcher.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/theme-switcher",
  },
  {
    name: "text-flip",
    type: "registry:component",
    title: "Text Flip",
    description:
      "Animated text that cycles through items with a smooth flip transition.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/text-flip/text-flip.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/text-flip",
  },
  {
    name: "apple-hello-effect",
    type: "registry:component",
    title: "Apple Hello Effect",
    description: "SVG writing animation inspired by Apple’s Hello screen.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/apple-hello-effect/apple-hello-effect-english.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/apple-hello-effect",
  },
  {
    name: "apple-hello-effect-hindi",
    type: "registry:component",
    title: "Apple Hello Effect - Hindi",
    description: "SVG writing animation inspired by Apple’s Hello screen.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/apple-hello-effect/apple-hello-effect-hindi.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/apple-hello-effect",
  },
  {
    name: "apple-hello-effect-spanish",
    type: "registry:component",
    title: "Apple Hello Effect - Spanish",
    description: "SVG writing animation inspired by Apple’s Hello screen.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/apple-hello-effect/apple-hello-effect-spanish.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/apple-hello-effect",
  },
  {
    name: "apple-hello-effect-vietnamese",
    type: "registry:component",
    title: "Apple Hello Effect - Vietnamese",
    description: "SVG writing animation inspired by Apple’s Hello screen.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/apple-hello-effect/apple-hello-effect-vietnamese.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/apple-hello-effect",
  },
  {
    name: "wheel-picker",
    type: "registry:component",
    title: "Wheel Picker",
    description:
      "iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support.",
    dependencies: ["@ncdai/react-wheel-picker"],
    files: [
      {
        path: "components/wheel-picker/wheel-picker.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/react-wheel-picker",
  },
  {
    name: "chevrons-up-down-icon",
    type: "registry:component",
    description: "TBD",
    dependencies: ["motion"],
    files: [
      {
        path: "components/chevrons-up-down-icon/chevrons-up-down-icon.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "typography",
    type: "registry:component",
    title: "Typography",
    description:
      "Custom prose styles for headings, links, inline code, and emphasis.",
    devDependencies: ["@tailwindcss/typography"],
    css: {
      "@plugin @tailwindcss/typography": {},
      "@utility link": {
        "@apply decoration-1 underline-offset-3 hover:underline": {},
      },
      "@utility link-underline": {
        "@apply underline decoration-current/30 decoration-1 underline-offset-3 transition-colors hover:decoration-current":
          {},
      },
      "@utility prose-ncdai": {
        "@apply prose-headings:tracking-tight prose-headings:text-balance prose-h2:font-semibold":
          {},
        "@apply prose-a:font-normal prose-a:wrap-break-word prose-a:text-foreground prose-a:link-underline":
          {},
        "@apply prose-code:rounded-md prose-code:border prose-code:bg-muted/50 prose-code:px-[0.3rem] prose-code:py-[0.2rem] prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none":
          {},
        "@apply prose-strong:font-medium": {},
      },
    },
  },
  {
    name: "work-experience",
    type: "registry:component",
    title: "Work Experience",
    description:
      "Display work experiences with role details, company logos, and durations.",
    dependencies: ["react-markdown", "lucide-react"],
    registryDependencies: [
      "collapsible",
      "separator",
      getRegistryItemUrl("chevrons-up-down-icon"),
      getRegistryItemUrl("typography"),
    ],
    files: [
      {
        path: "components/work-experience/work-experience.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/work-experience-component",
  },
  {
    name: "shimmering-text",
    type: "registry:component",
    title: "Shimmering Text",
    description: "Smooth, light-sweeping shimmer animation for text.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/shimmering-text/shimmering-text.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "slide-to-unlock",
    type: "registry:component",
    title: "Slide to Unlock",
    description:
      "Interactive slider inspired by the classic iPhone “slide to unlock” gesture.",
    dependencies: ["motion"],
    registryDependencies: [getRegistryItemUrl("shimmering-text")],
    files: [
      {
        path: "components/slide-to-unlock/slide-to-unlock.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/slide-to-unlock",
  },
  {
    name: "testimonials-marquee",
    type: "registry:component",
    title: "Testimonials Marquee",
    description: "Scrolling marquee to showcase user testimonials.",
    registryDependencies: [
      "@kibo-ui/marquee",
      getRegistryItemUrl("testimonial"),
    ],
    docs: "https://chanhdai.com/components/testimonials-marquee",
  },
  {
    name: "testimonial",
    type: "registry:component",
    title: "Testimonial",
    description:
      "Display user feedback with author info, avatar, and verified badge.",
    files: [
      {
        path: "components/testimonial/testimonial.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "github-stars",
    type: "registry:component",
    title: "GitHub Stars",
    description:
      "Display GitHub repo star count with formatted numbers and full-count tooltip.",
    registryDependencies: ["button", "tooltip"],
    files: [
      {
        path: "components/github-stars/github-stars.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "scroll-fade-effect",
    type: "registry:component",
    title: "Scroll Fade Effect",
    description:
      "Fade content edges as you scroll, for both vertical and horizontal layouts.",
    files: [
      {
        path: "components/scroll-fade-effect/scroll-fade-effect.tsx",
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
    title: "Consent Manager",
    description:
      "Cookie and tracking consent banner for Next.js, built on c15t.",
    dependencies: ["@c15t/nextjs"],
    registryDependencies: ["button"],
    files: [
      {
        path: "components/consent-manager/consent-manager.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "copy-button",
    type: "registry:component",
    title: "Copy Button",
    description:
      "Copy text to clipboard with visual, haptic, and audio feedback.",
    dependencies: [
      "lucide-react",
      "motion",
      "@rexa-developer/tiks",
      "web-haptics",
    ],
    registryDependencies: ["button"],
    files: [
      {
        path: "components/copy-button/copy-button.tsx",
        type: "registry:component",
      },
      {
        path: "src/hooks/use-copy-to-clipboard.ts",
        type: "registry:hook",
      },
    ],
  },
  {
    name: "code-block-command",
    type: "registry:component",
    title: "Code Block Command",
    description:
      "Display install commands with package manager switcher and copy button.",
    dependencies: ["@base-ui/react", "lucide-react", "motion", "jotai"],
    registryDependencies: [getRegistryItemUrl("copy-button")],
    files: [
      {
        path: "components/code-block-command/code-block-command.tsx",
        type: "registry:component",
      },
      {
        path: "src/components/base/ui/tabs.tsx",
        type: "registry:component",
      },
    ],
    cssVars: {
      light: {
        code: "oklch(0.985 0 0)",
        "code-foreground": "oklch(0.141 0.005 285.823)",
      },
      dark: {
        code: "oklch(0.21 0.006 285.885)",
        "code-foreground": "oklch(0.985 0 0)",
      },
      theme: {
        "color-code": "var(--code)",
        "color-code-foreground": "var(--code-foreground)",
      },
    },
  },
  {
    name: "testimonial-spotlight",
    type: "registry:component",
    title: "Testimonial Spotlight",
    description: "Testimonial card with spotlight effect on hover.",
    registryDependencies: [getRegistryItemUrl("testimonial")],
    files: [
      {
        path: "components/testimonial-spotlight/testimonial-spotlight.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "glow-card-grid",
    type: "registry:component",
    title: "Glow Card Grid",
    description: "Display cards with glowing border and background effects.",
    files: [
      {
        path: "components/glow-card-grid/glow-card-grid.tsx",
        type: "registry:component",
      },
      {
        path: "components/glow-card-grid/glow-card.tsx",
        type: "registry:component",
      },
    ],
  },
  {
    name: "middle-truncation",
    type: "registry:component",
    title: "Middle Truncation",
    description: "Truncate text in the middle while preserving start and end.",
    files: [
      {
        path: "components/middle-truncation/middle-truncation.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/middle-truncation",
  },
  {
    name: "twemoji",
    type: "registry:component",
    title: "Twemoji",
    description: "Render Unicode emoji as Twemoji SVG images inline with text.",
    files: [
      {
        path: "components/twemoji/twemoji.tsx",
        type: "registry:component",
      },
      {
        path: "components/twemoji/lib/twemoji-regex.ts",
        type: "registry:lib",
      },
    ],
    css: {
      "@layer base": {
        ".twemoji": {
          display: "inline-block",
          height: "1em",
          width: "1em",
          margin: "0 0.05em 0 0.1em",
          "vertical-align": "-0.1em",
        },
      },
    },
    docs: "https://chanhdai.com/components/twemoji",
  },
  {
    name: "elastic-slider",
    type: "registry:component",
    title: "Elastic Slider",
    description:
      "Slider with elastic rubber-band drag and magnetic snap feedback.",
    dependencies: ["motion"],
    registryDependencies: [getRegistryItemUrl("use-controllable-state")],
    files: [
      {
        path: "components/elastic-slider/elastic-slider.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://chanhdai.com/components/elastic-slider",
  },
  {
    name: "contribution-graph",
    type: "registry:component",
    title: "Contribution Graph",
    description:
      "A GitHub-style contribution graph component that displays activity levels over time.",
    dependencies: ["date-fns"],
    files: [
      {
        path: "components/contribution-graph/contribution-graph.tsx",
        type: "registry:component",
      },
    ],
    docs: "https://www.kibo-ui.com/components/contribution-graph",
  },
  {
    name: "github-contributions",
    type: "registry:component",
    title: "GitHub Contributions",
    description:
      "Visualize year-long GitHub contribution activity with daily counts, tooltips, and a profile link.",
    dependencies: ["date-fns"],
    registryDependencies: ["tooltip", getRegistryItemUrl("contribution-graph")],
    files: [
      {
        path: "components/github-contributions/github-contributions.tsx",
        type: "registry:component",
      },
      {
        path: "components/github-contributions/lib/get-cached-contributions.ts",
        type: "registry:lib",
      },
    ],
    css: {
      "@utility link-underline": {
        "@apply underline decoration-current/30 decoration-1 underline-offset-3 transition-colors hover:decoration-current":
          {},
      },
    },
    docs: "https://chanhdai.com/components/github-contributions",
  },
]
