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
        "@apply relative before:absolute before:top-0 before:left-[-100vw] before:-z-1 before:h-px before:w-[200vw] before:bg-line":
          {},
      },
      "@utility screen-line-bottom": {
        "@apply relative after:absolute after:bottom-0 after:left-[-100vw] after:-z-1 after:h-px after:w-[200vw] after:bg-line":
          {},
      },
    },
  },
  {
    name: "theme-toggle-effect-triangle",
    type: "registry:style",
    cssVars: {
      theme: {
        "expo-out":
          "linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",
      },
    },
    css: {
      "@layer base": {
        "::view-transition-group(root)": {
          "animation-timing-function": "var(--expo-out)",
        },
        "::view-transition-old(root),.dark::view-transition-old(root)": {
          animation: "none",
          "animation-fill-mode": "both",
          "z-index": "-1",
        },
        "::view-transition-new(root)": {
          mask: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="m20 0 20 35H0z" fill="white"/></svg>') center / 0 no-repeat`,
          animation: "scale 0.7s",
          "animation-fill-mode": "both",
        },
        "@keyframes scale": {
          to: {
            "mask-size": "300vmax",
          },
        },
      },
    },
    docs: "https://chanhdai.com/components/theme-toggle-effect",
  },
  {
    name: "theme-toggle-effect-triangle-blur",
    type: "registry:style",
    cssVars: {
      theme: {
        "expo-out":
          "linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",
      },
    },
    css: {
      "@layer base": {
        "::view-transition-group(root)": {
          "animation-timing-function": "var(--expo-out)",
        },
        "::view-transition-old(root),.dark::view-transition-old(root)": {
          animation: "none",
          "animation-fill-mode": "both",
          "z-index": "-1",
        },
        "::view-transition-new(root)": {
          mask: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="m20 0 20 35H0z" fill="white" filter="url(%23blur)"/><defs><filter id="blur"><feGaussianBlur stdDeviation="1"/></filter></defs></svg>') center / 0 no-repeat`,
          animation: "scale 0.7s",
          "animation-fill-mode": "both",
        },
        "@keyframes scale": {
          to: {
            "mask-size": "300vmax",
          },
        },
      },
    },
    docs: "https://chanhdai.com/components/theme-toggle-effect",
  },
  {
    name: "theme-toggle-effect-circle",
    type: "registry:style",
    cssVars: {
      theme: {
        "expo-out":
          "linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",
      },
    },
    css: {
      "@layer base": {
        "::view-transition-group(root)": {
          "animation-timing-function": "var(--expo-out)",
        },
        "::view-transition-old(root),.dark::view-transition-old(root)": {
          animation: "none",
          "animation-fill-mode": "both",
          "z-index": "-1",
        },
        "::view-transition-new(root)": {
          mask: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>') center / 0 no-repeat`,
          animation: "scale 1s",
          "animation-fill-mode": "both",
        },
        "@keyframes scale": {
          to: {
            "mask-size": "200vmax",
          },
        },
      },
    },
    docs: "https://chanhdai.com/components/theme-toggle-effect",
  },
  {
    name: "theme-toggle-effect-circle-blur",
    type: "registry:style",
    cssVars: {
      theme: {
        "expo-out":
          "linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",
      },
    },
    css: {
      "@layer base": {
        "::view-transition-group(root)": {
          "animation-timing-function": "var(--expo-out)",
        },
        "::view-transition-old(root),.dark::view-transition-old(root)": {
          animation: "none",
          "animation-fill-mode": "both",
          "z-index": "-1",
        },
        "::view-transition-new(root)": {
          mask: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>') center / 0 no-repeat`,
          animation: "scale 1s",
          "animation-fill-mode": "both",
        },
        ".dark::view-transition-new(root)": {
          animation: "scale 1s",
          "animation-fill-mode": "both",
        },
        "@keyframes scale": {
          to: {
            "mask-size": "200vmax",
          },
        },
      },
    },
    docs: "https://chanhdai.com/components/theme-toggle-effect",
  },
  {
    name: "theme-toggle-effect-circle-blur-top-left",
    type: "registry:style",
    cssVars: {
      theme: {
        "expo-out":
          "linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",
      },
    },
    css: {
      "@layer base": {
        "::view-transition-group(root)": {
          "animation-timing-function": "var(--expo-out)",
        },
        "::view-transition-new(root)": {
          mask: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23blur)"/></svg>') top left / 0 no-repeat`,
          "mask-origin": "content-box",
          animation: "scale 1s",
          "animation-fill-mode": "both",
          "transform-origin": "top left",
        },
        "::view-transition-old(root),.dark::view-transition-old(root)": {
          animation: "scale 1s",
          "animation-fill-mode": "both",
          "transform-origin": "top left",
          "z-index": "-1",
        },
        "@keyframes scale": {
          to: {
            "mask-size": "350vmax",
          },
        },
      },
    },
    docs: "https://chanhdai.com/components/theme-toggle-effect",
  },
  {
    name: "theme-toggle-effect-polygon",
    type: "registry:style",
    cssVars: {
      theme: {
        "expo-out":
          "linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",
      },
    },
    css: {
      "@layer base": {
        "::view-transition-group(root)": {
          "animation-duration": "0.7s",
          "animation-timing-function": "var(--expo-out)",
        },
        "::view-transition-new(root)": {
          "animation-name": "reveal-light",
          "animation-fill-mode": "both",
        },
        "::view-transition-old(root),.dark::view-transition-old(root)": {
          animation: "none",
          "animation-fill-mode": "both",
          "z-index": "-1",
        },
        ".dark::view-transition-new(root)": {
          "animation-name": "reveal-dark",
          "animation-fill-mode": "both",
        },
        "@keyframes reveal-dark": {
          from: {
            "clip-path": "polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%)",
          },
          to: {
            "clip-path": "polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%)",
          },
        },
        "@keyframes reveal-light": {
          from: {
            "clip-path": "polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%)",
          },
          to: {
            "clip-path": "polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%)",
          },
        },
      },
    },
    docs: "https://chanhdai.com/components/theme-toggle-effect",
  },
  {
    name: "theme-toggle-effect-polygon-gradient",
    type: "registry:style",
    cssVars: {
      theme: {
        "expo-out":
          "linear(0 0%, 0.1684 2.66%, 0.3165 5.49%, 0.446 8.52%, 0.5581 11.78%, 0.6535 15.29%, 0.7341 19.11%, 0.8011 23.3%, 0.8557 27.93%, 0.8962 32.68%, 0.9283 38.01%, 0.9529 44.08%, 0.9711 51.14%, 0.9833 59.06%, 0.9915 68.74%, 1 100%)",
      },
    },
    css: {
      "@layer base": {
        "::view-transition-group(root)": {
          "animation-timing-function": "var(--expo-out)",
        },
        "::view-transition-new(root)": {
          mask: `url('data:image/svg+xml,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H40L0 40V0Z" fill="url(%23paint0_linear_16_14)"/><defs><linearGradient id="paint0_linear_16_14" x1="0" y1="0" x2="20.5" y2="20.5" gradientUnits="userSpaceOnUse"><stop stop-color="current"/><stop offset="0.84506" stop-color="current" stop-opacity="0.99"/><stop offset="0.9506" stop-color="current" stop-opacity="0"/><stop offset="1" stop-color="current" stop-opacity="0"/></linearGradient></defs></svg>') top left / 0 no-repeat`,
          "mask-origin": "top left",
          animation: "scale 1.5s",
          "animation-fill-mode": "both",
        },
        "::view-transition-old(root),.dark::view-transition-old(root)": {
          animation: "scale 1.5s",
          "animation-fill-mode": "both",
          "z-index": "-1",
          "transform-origin": "top left",
        },
        "@keyframes scale": {
          to: {
            "mask-size": "200vmax",
          },
        },
      },
    },
    docs: "https://chanhdai.com/components/theme-toggle-effect",
  },
]
