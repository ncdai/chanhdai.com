"use client"

import {
  useId,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react"

/**
 * Liquid glass for small capsules (the date pill): the backdrop is refracted
 * at the rim through an SVG displacement map, with the red, green and blue
 * channels displaced by slightly different amounts for a thin chromatic
 * fringe, then saturated. Specular highlights come from inset shadows on the
 * surface (see {@link DATE_TICKER_GLASS_CLASS}).
 *
 * SVG filters in `backdrop-filter` only render in Chromium. Elsewhere the
 * surface falls back to a frosted blur with the same highlights.
 */

/** Displacement map size — stretched to the surface, so only the aspect matters. */
const MAP_WIDTH = 128
const MAP_HEIGHT = 32
/** Rim thickness as a fraction of the short side. */
const MAP_BORDER = 0.07
/** Softness of the neutral (undisplaced) centre — larger = wider refracting rim. */
const MAP_BLUR = 4
/** Base displacement (px); negative pulls the backdrop inward like a lens. */
const DISPLACEMENT_SCALE = -48
/** Extra displacement per channel for the chromatic fringe. */
const CHANNEL_OFFSETS = { r: 0, g: 6, b: 12 } as const
const SATURATION = 1.6

/**
 * Red ramps left → right (x displacement), blue top → bottom (y), combined
 * with `difference`; a blurred mid-grey capsule on top zeroes the centre so
 * only the rim bends the backdrop.
 */
function displacementMapUri(): string {
  const radius = MAP_HEIGHT / 2
  const inset = Math.min(MAP_WIDTH, MAP_HEIGHT) * (MAP_BORDER / 2)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" width="${MAP_WIDTH}" height="${MAP_HEIGHT}">
<defs>
<linearGradient id="r" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#000"/><stop offset="100%" stop-color="#f00"/></linearGradient>
<linearGradient id="b" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#000"/><stop offset="100%" stop-color="#00f"/></linearGradient>
<filter id="s"><feGaussianBlur stdDeviation="${MAP_BLUR}"/></filter>
</defs>
<rect width="${MAP_WIDTH}" height="${MAP_HEIGHT}" fill="#000"/>
<rect width="${MAP_WIDTH}" height="${MAP_HEIGHT}" rx="${radius}" fill="url(#r)"/>
<rect width="${MAP_WIDTH}" height="${MAP_HEIGHT}" rx="${radius}" fill="url(#b)" style="mix-blend-mode:difference"/>
<rect x="${inset}" y="${inset}" width="${MAP_WIDTH - inset * 2}" height="${MAP_HEIGHT - inset * 2}" rx="${radius - inset}" fill="hsl(0 0% 50% / 0.93)" filter="url(#s)"/>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

let cachedMapUri: string | null = null
function getDisplacementMapUri(): string {
  cachedMapUri ??= displacementMapUri()
  return cachedMapUri
}

let cachedSupport: boolean | null = null

/** `true` when the browser renders SVG filters in `backdrop-filter` (Chromium). */
export function supportsSvgBackdropFilter(): boolean {
  if (cachedSupport !== null) {
    return cachedSupport
  }
  if (typeof window === "undefined" || typeof CSS === "undefined") {
    return false
  }
  const brands = (
    navigator as Navigator & {
      userAgentData?: { brands?: { brand: string }[] }
    }
  ).userAgentData?.brands
  const isChromium = brands?.some((b) => b.brand === "Chromium") ?? false
  cachedSupport =
    isChromium && CSS.supports("backdrop-filter", "url(#bklit-glass)")
  return cachedSupport
}

/** Specular rim + soft drop shadow, tuned for light and dark. */
export const DATE_TICKER_GLASS_CLASS =
  "relative overflow-hidden rounded-full px-4 py-1 text-zinc-900 dark:text-white " +
  "bg-white/15 dark:bg-white/[0.06] " +
  "shadow-[inset_0_0_0_1px_rgb(255_255_255/0.35),inset_1.5px_2px_0_-1px_rgb(255_255_255/0.9),inset_-1.5px_-2px_0_-1px_rgb(255_255_255/0.5),inset_0_-8px_12px_-8px_rgb(255_255_255/0.4),0_6px_20px_rgb(0_0_0/0.12),0_1px_3px_rgb(0_0_0/0.1)] " +
  "dark:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14),inset_1.5px_2px_0_-1px_rgb(255_255_255/0.45),inset_-1.5px_-2px_0_-1px_rgb(255_255_255/0.2),inset_0_-8px_12px_-8px_rgb(255_255_255/0.12),0_6px_20px_rgb(0_0_0/0.4)]"

const FALLBACK_BACKDROP = `blur(6px) saturate(${SATURATION})`

/**
 * Filter id + inline backdrop style for a glass surface. Render
 * `<LiquidGlassFilter>` inside the surface with the same id and ref.
 */
export function useLiquidGlass(): {
  filterId: string
  svgFilter: boolean
  style: CSSProperties
} {
  // CSS `url(#…)` is happiest with a plain id.
  const filterId = `bklit-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const svgFilter = supportsSvgBackdropFilter()
  const backdrop = svgFilter
    ? `url(#${filterId}) saturate(${SATURATION})`
    : FALLBACK_BACKDROP
  return {
    filterId,
    svgFilter,
    style: { backdropFilter: backdrop, WebkitBackdropFilter: backdrop },
  }
}

/**
 * The SVG filter behind a glass surface. Keeps the displacement map sized to
 * `surfaceRef` (the pill's width springs between labels) by writing the
 * `feImage` size from a `ResizeObserver` — no React re-render.
 */
export function LiquidGlassFilter({
  id,
  surfaceRef,
}: {
  id: string
  surfaceRef: RefObject<HTMLElement | null>
}) {
  const imageRef = useRef<SVGFEImageElement>(null)

  useLayoutEffect(() => {
    const surface = surfaceRef.current
    const image = imageRef.current
    if (!(surface && image)) {
      return
    }
    const sync = () => {
      image.setAttribute("width", `${surface.offsetWidth}`)
      image.setAttribute("height", `${surface.offsetHeight}`)
    }
    sync()
    if (typeof ResizeObserver === "undefined") {
      return
    }
    const observer = new ResizeObserver(sync)
    observer.observe(surface)
    return () => observer.disconnect()
  }, [surfaceRef])

  const channel = (
    key: keyof typeof CHANNEL_OFFSETS,
    matrix: string,
    result: string
  ) => (
    <>
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        result={`${result}-displaced`}
        scale={DISPLACEMENT_SCALE + CHANNEL_OFFSETS[key]}
        xChannelSelector="R"
        yChannelSelector="B"
      />
      <feColorMatrix
        in={`${result}-displaced`}
        result={result}
        type="matrix"
        values={matrix}
      />
    </>
  )

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute"
      height="0"
      width="0"
    >
      <defs>
        <filter colorInterpolationFilters="sRGB" id={id}>
          <feImage
            height={MAP_HEIGHT}
            href={getDisplacementMapUri()}
            preserveAspectRatio="none"
            ref={imageRef}
            result="map"
            width={MAP_WIDTH}
            x="0"
            y="0"
          />
          {channel("r", "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0", "red")}
          {channel("g", "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0", "green")}
          {channel("b", "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0", "blue")}
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="rgb" />
          <feGaussianBlur in="rgb" stdDeviation="0.3" />
        </filter>
      </defs>
    </svg>
  )
}
