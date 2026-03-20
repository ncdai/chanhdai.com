import type { Registry } from "shadcn/schema"

export const styles: Registry["items"] = [
  {
    name: "style",
    type: "registry:style",
    cssVars: {
      theme: {
        "color-line":
          "color-mix(in oklab, var(--border) 64%, var(--background))",
      },
    },
    css: {
      "@utility screen-line-top": {
        "@apply relative before:absolute before:top-0 before:-left-[100vw] before:-z-1 before:h-px before:w-[200vw] before:bg-line":
          {},
      },
      "@utility screen-line-bottom": {
        "@apply relative after:absolute after:bottom-0 after:-left-[100vw] after:-z-1 after:h-px after:w-[200vw] after:bg-line":
          {},
      },
    },
  },
]
