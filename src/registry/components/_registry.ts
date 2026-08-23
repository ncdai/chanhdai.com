import { getRegistryItemUrl } from "@/utils/registry"
import type { Registry } from "shadcn/schema"

export const components: Registry["items"] = [
  {
    name: "theme-switcher",
    type: "registry:component",
    title: "Theme Switcher",
    description:
      "Toggle between system, light, and dark themes in Next.js apps.",
    dependencies: ["next-themes", "motion"],
    files: [
      {
        path: "components/theme-switcher/theme-switcher.tsx",
        type: "registry:component",
        target: "@components/theme-switcher.tsx",
      },
    ],
    categories: ["controls"],
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
        target: "@components/text-flip.tsx",
      },
    ],
    categories: ["text-effects"],
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
        target: "@components/apple-hello-effect-english.tsx",
      },
    ],
    categories: ["text-effects"],
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
        target: "@components/apple-hello-effect-hindi.tsx",
      },
    ],
    categories: ["text-effects"],
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
        target: "@components/apple-hello-effect-spanish.tsx",
      },
    ],
    categories: ["text-effects"],
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
        target: "@components/apple-hello-effect-vietnamese.tsx",
      },
    ],
    categories: ["text-effects"],
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
        target: "@components/wheel-picker.tsx",
      },
    ],
    categories: ["controls"],
    docs: "https://chanhdai.com/components/react-wheel-picker",
  },
  {
    name: "chevrons-up-down-icon",
    type: "registry:component",
    description:
      "Animated chevrons icon that morphs between up and down directions.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/chevrons-up-down-icon/chevrons-up-down-icon.tsx",
        type: "registry:component",
        target: "@components/chevrons-up-down-icon.tsx",
      },
    ],
    categories: ["effects"],
    docs: "https://chanhdai.com/components/chevrons-up-down-icon",
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
      "@custom-variant retina": {
        "@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2x)": {
          "@slot": {},
        },
      },
      "@utility link": {
        "@apply decoration-1 underline-offset-3 hover:underline": {},
      },
      "@utility link-underline": {
        "@apply underline decoration-current/30 decoration-1 underline-offset-3 transition-colors hover:decoration-current":
          {},
      },
      "@utility prose-ncdai": {
        "@apply prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-pretty md:prose-headings:text-balance":
          {},
        "@apply prose-a:font-normal prose-a:wrap-break-word prose-a:text-foreground prose-a:link-underline":
          {},
        "@apply prose-code:rounded-md prose-code:border prose-code:bg-muted/50 prose-code:px-1 prose-code:py-px prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none retina:prose-code:border-[0.5px]":
          {},
        "@apply prose-strong:font-medium": {},
        "@apply prose-blockquote:border-l prose-blockquote:font-normal prose-blockquote:text-muted-foreground prose-blockquote:not-italic prose-blockquote:[&_p:first-of-type]:before:content-none prose-blockquote:[&_p:last-of-type]:after:content-none":
          {},
      },
    },
    categories: ["typography"],
  },
  {
    name: "work-experience",
    type: "registry:component",
    title: "Work Experience",
    description:
      "Display work experiences with role details, company logos, and durations.",
    dependencies: ["react-markdown", "date-fns"],
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
        target: "@components/work-experience.tsx",
      },
    ],
    categories: ["marketing"],
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
        target: "@components/shimmering-text.tsx",
      },
    ],
    categories: ["text-effects"],
    docs: "https://chanhdai.com/components/shimmering-text",
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
        target: "@components/slide-to-unlock.tsx",
      },
    ],
    categories: ["controls"],
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
    categories: ["marketing"],
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
        target: "@components/testimonial.tsx",
      },
    ],
    categories: ["marketing"],
    docs: "https://chanhdai.com/components/testimonial",
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
        target: "@components/github-stars.tsx",
      },
    ],
    categories: ["data-display"],
    docs: "https://chanhdai.com/components/github-stars",
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
        target: "@components/scroll-fade-effect.tsx",
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
    categories: ["effects"],
    docs: "https://chanhdai.com/components/scroll-fade-effect",
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
        target: "@components/consent-manager.tsx",
      },
    ],
    categories: ["utilities"],
    docs: "https://chanhdai.com/components/consent-manager",
  },
  {
    name: "copy-button",
    type: "registry:component",
    title: "Copy Button",
    description:
      "Copy text to clipboard with visual, haptic, and audio feedback.",
    dependencies: ["motion", "@rexa-developer/tiks", "web-haptics"],
    registryDependencies: ["button", getRegistryItemUrl("icon-swap")],
    files: [
      {
        path: "components/copy-button/copy-button.tsx",
        type: "registry:component",
        target: "@components/copy-button.tsx",
      },
      {
        path: "src/hooks/use-copy-to-clipboard.ts",
        type: "registry:hook",
        target: "@hooks/use-copy-to-clipboard.ts",
      },
    ],
    categories: ["utilities"],
    docs: "https://chanhdai.com/components/copy-button",
  },
  {
    name: "code-block-command",
    type: "registry:component",
    title: "Code Block Command",
    description:
      "Display install commands with package manager switcher and copy button.",
    dependencies: ["@base-ui/react", "motion", "jotai"],
    registryDependencies: [
      getRegistryItemUrl("icon-swap"),
      getRegistryItemUrl("copy-button"),
    ],
    files: [
      {
        path: "components/code-block-command/code-block-command.tsx",
        type: "registry:component",
        target: "@components/code-block-command.tsx",
      },
      {
        path: "src/components/base/ui/tabs.tsx",
        type: "registry:component",
        target: "@components/tabs.tsx",
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
    categories: ["data-display"],
    docs: "https://chanhdai.com/components/code-block-command",
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
        target: "@components/testimonial-spotlight.tsx",
      },
    ],
    categories: ["marketing"],
    docs: "https://chanhdai.com/components/testimonial-spotlight",
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
        target: "@components/glow-card-grid.tsx",
      },
    ],
    categories: ["effects"],
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
        target: "@components/middle-truncation.tsx",
      },
    ],
    categories: ["typography"],
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
        target: "@components/twemoji.tsx",
      },
      {
        path: "components/twemoji/lib/twemoji-regex.ts",
        type: "registry:lib",
        target: "@lib/twemoji-regex.ts",
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
    categories: ["typography"],
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
        target: "@components/elastic-slider.tsx",
      },
    ],
    categories: ["controls"],
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
        target: "@components/contribution-graph.tsx",
      },
    ],
    categories: ["data-display"],
    docs: "https://www.kibo-ui.com/components/contribution-graph",
  },
  {
    name: "github-contributions",
    type: "registry:component",
    title: "GitHub Contributions",
    description:
      "Visualize year-long GitHub contribution activity with daily counts, tooltips, and a profile link.",
    dependencies: ["date-fns"],
    registryDependencies: [
      "tooltip",
      "spinner",
      getRegistryItemUrl("contribution-graph"),
    ],
    files: [
      {
        path: "components/github-contributions/github-contributions.tsx",
        type: "registry:component",
        target: "@components/github-contributions.tsx",
      },
      {
        path: "components/github-contributions/lib/get-cached-contributions.ts",
        type: "registry:lib",
        target: "@lib/get-cached-contributions.ts",
      },
    ],
    css: {
      "@utility link-underline": {
        "@apply underline decoration-current/30 decoration-1 underline-offset-3 transition-colors hover:decoration-current":
          {},
      },
    },
    categories: ["data-display"],
    docs: "https://chanhdai.com/components/github-contributions",
  },
  {
    name: "toc-minimap",
    type: "registry:component",
    title: "TOC Minimap",
    description:
      "Navigate page sections with a compact, hoverable TOC minimap.",
    registryDependencies: ["hover-card", "@soundcn/u-mini-map-open"],
    files: [
      {
        path: "components/toc-minimap/toc-minimap.tsx",
        type: "registry:component",
        target: "@components/toc-minimap.tsx",
      },
    ],
    categories: ["navigation"],
    docs: "https://chanhdai.com/components/toc-minimap",
  },
  {
    name: "fluid-gradient-text",
    type: "registry:component",
    title: "Fluid Gradient Text",
    description:
      "Render text with a fluid gradient that shifts with pointer movement.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/fluid-gradient-text/fluid-gradient-text.tsx",
        type: "registry:component",
        target: "@components/fluid-gradient-text.tsx",
      },
    ],
    categories: ["text-effects"],
    docs: "https://chanhdai.com/components/fluid-gradient-text",
  },
  {
    name: "brand-assets-menu",
    type: "registry:component",
    title: "Brand Assets Menu",
    description: "Context menu for copying brand SVGs and opening asset links.",
    registryDependencies: ["context-menu", "sonner"],
    dependencies: ["@rexa-developer/tiks"],
    files: [
      {
        path: "components/brand-assets-menu/brand-assets-menu.tsx",
        type: "registry:component",
        target: "@components/brand-assets-menu.tsx",
      },
    ],
    categories: ["menus"],
    docs: "https://chanhdai.com/components/brand-assets-menu",
  },
  {
    name: "icon-swap",
    type: "registry:component",
    title: "Icon Swap",
    description: "Animate icon swaps with scale, blur, and fade transitions.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/icon-swap/icon-swap.tsx",
        type: "registry:component",
        target: "@components/icon-swap.tsx",
      },
    ],
    categories: ["effects"],
    docs: "https://chanhdai.com/components/icon-swap",
  },
  {
    name: "dot-grid-spotlight",
    type: "registry:component",
    title: "Dot Grid Spotlight",
    description:
      "Interactive dot grid with a cursor-tracking spotlight effect.",
    files: [
      {
        path: "components/dot-grid-spotlight/dot-grid-spotlight.tsx",
        type: "registry:component",
        target: "@components/dot-grid-spotlight.tsx",
      },
    ],
    categories: ["effects"],
    docs: "https://chanhdai.com/components/dot-grid-spotlight",
  },
  {
    name: "spinning-circular-text",
    type: "registry:component",
    title: "Spinning Circular Text",
    description:
      "Text arranged in a circle with a continuous spinning animation.",
    files: [
      {
        path: "components/spinning-circular-text/spinning-circular-text.tsx",
        type: "registry:component",
        target: "@components/spinning-circular-text.tsx",
      },
    ],
    cssVars: {
      theme: {
        "--animate-spin-ccw":
          "spin-ccw var(--tw-animation-duration, var(--tw-duration, 6s)) linear infinite",
      },
    },
    css: {
      "@keyframes spin-ccw": {
        to: {
          rotate: "-360deg",
        },
      },
    },
    categories: ["text-effects"],
    docs: "https://chanhdai.com/components/spinning-circular-text",
  },
  {
    name: "mobius-loop-icon",
    type: "registry:component",
    title: "Mobius Loop Icon",
    description:
      "Animated Mobius loop icon that morphs between circles and infinity shape.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/mobius-loop-icon/mobius-loop-icon.tsx",
        type: "registry:component",
        target: "@components/mobius-loop-icon.tsx",
      },
    ],
    categories: ["effects"],
    docs: "https://chanhdai.com/components/mobius-loop-icon",
  },
  {
    name: "logos-carousel",
    type: "registry:component",
    title: "Logos Carousel",
    description: "Cycle through logos column by column in a staggered wave.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/logos-carousel/logos-carousel.tsx",
        type: "registry:component",
        target: "@components/logos-carousel.tsx",
      },
    ],
    categories: ["marketing"],
    docs: "https://chanhdai.com/components/logos-carousel",
  },
  {
    name: "testimonial-2",
    type: "registry:component",
    title: "Testimonial 2",
    description:
      "Display a testimonial quote with author attribution and source link.",
    files: [
      {
        path: "components/testimonial-2/testimonial-2.tsx",
        type: "registry:component",
        target: "@components/testimonial-2.tsx",
      },
    ],
    categories: ["marketing"],
    docs: "https://chanhdai.com/components/testimonial-2",
  },
  {
    name: "line-nav",
    type: "registry:component",
    title: "Line Nav",
    description:
      "Vertical navigation with a line marker that expands on hover and active state.",
    dependencies: ["motion"],
    files: [
      {
        path: "components/line-nav/line-nav.tsx",
        type: "registry:component",
        target: "@components/line-nav.tsx",
      },
    ],
    categories: ["navigation"],
    docs: "https://chanhdai.com/components/line-nav",
  },
  {
    name: "share-menu",
    type: "registry:component",
    title: "Share Menu",
    description:
      "Share menu to copy a link or post to X, LinkedIn, and the native share sheet.",
    registryDependencies: ["button", "dropdown-menu", "sonner"],
    files: [
      {
        path: "components/share-menu/share-menu.tsx",
        type: "registry:component",
        target: "@components/share-menu.tsx",
      },
    ],
    categories: ["menus"],
    docs: "https://chanhdai.com/components/share-menu",
  },
  {
    name: "spotlight-logo",
    type: "registry:component",
    title: "Spotlight Logo",
    description:
      "SVG logo with a cursor-tracking gradient highlight and tactile press.",
    dependencies: ["motion"],
    registryDependencies: ["@soundcn/metal-click"],
    files: [
      {
        path: "components/spotlight-logo/spotlight-logo.tsx",
        type: "registry:component",
        target: "@components/spotlight-logo.tsx",
      },
    ],
    categories: ["effects"],
    docs: "https://chanhdai.com/components/spotlight-logo",
  },
  {
    name: "timescale",
    type: "registry:component",
    title: "Timescale",
    description:
      "Ruler-style timeline for plotting milestones along a horizontal or vertical axis.",
    files: [
      {
        path: "components/timescale/timescale.tsx",
        type: "registry:component",
        target: "@components/timescale.tsx",
      },
    ],
    categories: ["data-display"],
    docs: "https://chanhdai.com/components/timescale",
  },
  {
    name: "status-button",
    type: "registry:component",
    title: "Status Button",
    description:
      "Button that shows loading and success feedback for async actions.",
    dependencies: ["motion", "radix-ui"],
    registryDependencies: ["button"],
    files: [
      {
        path: "components/status-button/status-button.tsx",
        type: "registry:component",
        target: "@components/status-button.tsx",
      },
    ],
    cssVars: {
      theme: {
        "--animate-spinner-opacity":
          "spinner-opacity var(--tw-animation-duration, var(--tw-duration, 1s)) linear infinite",
      },
    },
    css: {
      "@keyframes spinner-opacity": {
        from: {
          opacity: "1",
        },
        to: {
          opacity: "0.15",
        },
      },
    },
    categories: ["controls"],
    docs: "https://chanhdai.com/components/status-button",
  },
]
