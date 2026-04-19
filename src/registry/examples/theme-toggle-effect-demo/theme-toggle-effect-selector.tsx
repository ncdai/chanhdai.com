"use client"

import {
  Circle,
  CircleDashed,
  Diamond,
  Triangle,
  TriangleDashed,
} from "lucide-react"
import { useEffect, useLayoutEffect, useState } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EFFECT_STYLE_ID = "theme-toggle-effect-demo-style"

type EffectName = keyof typeof EFFECTS

export function ThemeToggleEffectSelector() {
  const [effectName, setEffectName] = useState<EffectName>("triangle")

  useLayoutEffect(() => {
    addEffectStyle(document, EFFECTS[effectName]?.css || "", EFFECT_STYLE_ID)
  }, [effectName])

  useEffect(() => {
    return () => {
      removeEffectStyle(document, EFFECT_STYLE_ID)
    }
  }, [])

  return (
    <Select
      value={effectName}
      onValueChange={(selectedEffect) =>
        setEffectName(selectedEffect as EffectName)
      }
    >
      <SelectTrigger className="w-50 *:data-[slot=select-value]:gap-2">
        <SelectValue placeholder="effect" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Effect</SelectLabel>
          {Object.entries(EFFECTS).map(([effectKey, effect]) => (
            <SelectItem key={effectKey} value={effectKey}>
              {effect.icon}
              {effect.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function removeEffectStyle(doc: Document, styleId: string) {
  doc.getElementById(styleId)?.remove()
}

function addEffectStyle(doc: Document, cssText: string, styleId: string) {
  let styleEl = doc.getElementById(styleId) as HTMLStyleElement | null

  if (!styleEl) {
    styleEl = doc.createElement("style")
    styleEl.id = styleId
    doc.head.appendChild(styleEl)
  }

  styleEl.textContent = cssText
}

const EFFECTS = {
  triangle: {
    title: "Triangle",
    icon: <Triangle />,
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        animation-fill-mode: both;
        z-index: -1;
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="m20 0 20 35H0z" fill="white"/></svg>')
          center / 0 no-repeat;
        animation: scale 0.7s;
        animation-fill-mode: both;
      }

      @keyframes scale {
        to {
          mask-size: 300vmax;
        }
      }
    `,
  },
  "triangle-blur": {
    title: "Triangle Blur",
    icon: <TriangleDashed />,
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        animation-fill-mode: both;
        z-index: -1;
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="m20 0 20 35H0z" fill="white" filter="url(%23blur)"/><defs><filter id="blur"><feGaussianBlur stdDeviation="1"/></filter></defs></svg>')
          center / 0 no-repeat;
        animation: scale 0.7s;
        animation-fill-mode: both;
      }

      @keyframes scale {
        to {
          mask-size: 300vmax;
        }
      }
    `,
  },
  circle: {
    title: "Circle",
    icon: <Circle />,
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        animation-fill-mode: both;
        z-index: -1;
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>')
          center / 0 no-repeat;
        animation: scale 1s;
        animation-fill-mode: both;
      }

      @keyframes scale {
        to {
          mask-size: 200vmax;
        }
      }
    `,
  },
  "circle-blur": {
    title: "Circle Blur",
    icon: <CircleDashed />,
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        animation-fill-mode: both;
        z-index: -1;
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>')
          center / 0 no-repeat;
        animation: scale 1s;
        animation-fill-mode: both;
      }
      .dark::view-transition-new(root) {
        animation: scale 1s;
        animation-fill-mode: both;
      }

      @keyframes scale {
        to {
          mask-size: 200vmax;
        }
      }
    `,
  },
  "circle-blur-top-left": {
    title: "Circle Blur Top Left",
    icon: <CircleDashed />,
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23blur)"/></svg>')
          top left / 0 no-repeat;
        mask-origin: content-box;
        animation: scale 1s;
        animation-fill-mode: both;
        transform-origin: top left;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 1s;
        animation-fill-mode: both;
        transform-origin: top left;
        z-index: -1;
      }

      @keyframes scale {
        to {
          mask-size: 350vmax;
        }
      }
    `,
  },
  polygon: {
    title: "Polygon",
    icon: <Diamond />,
    css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        animation-name: reveal-light;
        animation-fill-mode: both;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        animation-fill-mode: both;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark;
        animation-fill-mode: both;
      }

      @keyframes reveal-dark {
        from {
          clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
        }
        to {
          clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
        }
      }

      @keyframes reveal-light {
        from {
          clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
        }
        to {
          clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
        }
      }
    `,
  },
  "polygon-gradient": {
    title: "Polygon Gradient",
    icon: <Diamond />,
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0H40L0 40V0Z" fill="url(%23paint0_linear_16_14)"/><defs><linearGradient id="paint0_linear_16_14" x1="0" y1="0" x2="20.5" y2="20.5" gradientUnits="userSpaceOnUse"><stop stop-color="current"/><stop offset="0.84506" stop-color="current" stop-opacity="0.99"/><stop offset="0.9506" stop-color="current" stop-opacity="0"/><stop offset="1" stop-color="current" stop-opacity="0"/></linearGradient></defs></svg>')
          top left / 0 no-repeat;
        mask-origin: top left;
        animation: scale 1.5s;
        animation-fill-mode: both;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 1.5s;
        animation-fill-mode: both;
        z-index: -1;
        transform-origin: top left;
      }

      @keyframes scale {
        to {
          mask-size: 200vmax;
        }
      }
    `,
  },
}
