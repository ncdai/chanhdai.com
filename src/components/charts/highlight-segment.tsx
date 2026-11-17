"use client"

import { useId, useLayoutEffect, useRef, type RefObject } from "react"
import { m, type MotionValue } from "motion/react"

// Hover-highlight overlay: re-strokes the base path `d`, clipped to a vertical
// band whose x/width spring to track the hovered point, so only the segment
// around the dot shows brighter. The band comes from `useHighlightSegment`;
// because the bright stroke reuses the base `d`, it follows whatever curve is
// drawn (see `highlight-segment-bounds.ts` for the band-extent caveat).

/** Soft glow behind the highlight segment: a blurred copy of its stroke. */
export interface HighlightSegmentGlow {
  /** `url(#…)` reference to an `feGaussianBlur` filter. */
  filter: string
  opacity: number
  strokeWidth: number
}

export interface HighlightSegmentProps {
  /** Ref to the rendered base stroke `<path>` — its `d` is re-used verbatim. */
  pathRef: RefObject<SVGPathElement | null>
  /** Whether to render (caller gates on showHighlight + active + loaded). */
  visible: boolean
  stroke: string
  strokeWidth: number
  /** Plot height — the clip band spans it fully. */
  height: number
  /** Spring-eased left edge of the clip band (px). */
  x: MotionValue<number>
  /** Spring-eased width of the clip band (px). */
  width: MotionValue<number>
  /**
   * Soft ends: fade the segment in / out over this percentage (0–50) of the
   * band width at each side, via a mask. `0` = hard-edged clip. Default: 0
   */
  fadeLength?: number
  /** Optional glow drawn behind the segment, inside the same band. */
  glow?: HighlightSegmentGlow
}

export function HighlightSegment({
  pathRef,
  visible,
  stroke,
  strokeWidth,
  height,
  x,
  width,
  fadeLength = 0,
  glow,
}: HighlightSegmentProps) {
  const bandId = useId()
  const fadeId = `${bandId}-fade`
  const highlightRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)

  // Last `d` written, and the elements it was written to (they remount when
  // the band hides / the glow toggles).
  const appliedRef = useRef<{
    d: string
    highlight: SVGPathElement | null
    glow: SVGPathElement | null
  } | null>(null)

  // Copy the base stroke's `d` after commit (before paint) instead of reading
  // `pathRef.current` during render — same frame, and it picks up the base
  // path's `d` from this commit rather than the previous one. Runs on every
  // commit (hover moves included) but only writes when the base `d` or the
  // target elements changed: re-setting a long `d` re-parses the path.
  useLayoutEffect(() => {
    if (!visible) {
      return
    }
    const d = pathRef.current?.getAttribute("d") || ""
    const highlight = highlightRef.current
    const glowPath = glowRef.current
    const applied = appliedRef.current
    if (
      applied &&
      applied.d === d &&
      applied.highlight === highlight &&
      applied.glow === glowPath
    ) {
      return
    }
    highlight?.setAttribute("d", d)
    glowPath?.setAttribute("d", d)
    appliedRef.current = { d, highlight, glow: glowPath }
  })

  if (!visible) {
    return null
  }

  const fade = Math.min(50, Math.max(0, fadeLength))
  const soft = fade > 0
  // Bleed by the widest stroke so a stroke at the min/max value keeps its
  // full width (and the glow isn't cropped vertically).
  const bleed = Math.max(strokeWidth, glow ? glow.strokeWidth * 2 : 0)
  const band = (
    <m.rect
      fill={soft ? `url(#${fadeId})` : undefined}
      height={height + bleed * 2}
      width={width}
      x={x}
      y={-bleed}
    />
  )

  return (
    <>
      <defs>
        {soft ? (
          // Horizontal luminance ramp over the band (objectBoundingBox is fine:
          // the band rect always has area). White = visible.
          <>
            <linearGradient id={fadeId} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="white" stopOpacity={0} />
              <stop offset={fade / 100} stopColor="white" stopOpacity={1} />
              <stop offset={1 - fade / 100} stopColor="white" stopOpacity={1} />
              <stop offset="1" stopColor="white" stopOpacity={0} />
            </linearGradient>
            {/* userSpaceOnUse region: a near-flat path has a thin bbox, so the
                default objectBoundingBox region would crop the stroke. */}
            <mask
              height="300%"
              id={bandId}
              maskUnits="userSpaceOnUse"
              width="300%"
              x="-100%"
              y="-100%"
            >
              {band}
            </mask>
          </>
        ) : (
          <clipPath id={bandId}>{band}</clipPath>
        )}
      </defs>
      <m.g
        animate={{ opacity: 1 }}
        clipPath={soft ? undefined : `url(#${bandId})`}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        mask={soft ? `url(#${bandId})` : undefined}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {glow ? (
          <path
            fill="none"
            filter={glow.filter}
            ref={glowRef}
            stroke={stroke}
            strokeLinecap="round"
            strokeOpacity={glow.opacity}
            strokeWidth={glow.strokeWidth}
          />
        ) : null}
        <path
          fill="none"
          ref={highlightRef}
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </m.g>
    </>
  )
}

HighlightSegment.displayName = "HighlightSegment"

export default HighlightSegment
