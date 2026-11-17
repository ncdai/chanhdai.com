"use client"

import { useCallback, useLayoutEffect, useRef } from "react"
import { useSpring } from "motion/react"

import { useChartConfig } from "./chart-config-context"
import {
  DISCRETE_INTERACTION_LABEL_THRESHOLD,
  useChartHoverSelector,
  useChartHoverStore,
  useChartStable,
  type ChartHoverContextValue,
} from "./chart-context"
import {
  computeSegmentBounds,
  INACTIVE_SEGMENT,
  type SegmentBounds,
} from "./highlight-segment-bounds"

// Hover-highlight band for `line.tsx` and `area.tsx`. Computes the segment
// bounds and springs its x/width; `<HighlightSegment>` renders the clipped
// re-stroke. Spring tuning comes from `ChartConfigProvider.highlightSpring`.
//
// The springs are driven straight from the hover store, so a pointer move
// retargets them without a React render. Callers re-render only when the band
// shows or hides (`isActive`), or when their own props / the stable slice
// change.

export interface HighlightSegmentResult {
  xSpring: ReturnType<typeof useSpring>
  widthSpring: ReturnType<typeof useSpring>
  isActive: boolean
}

/**
 * @param enabled set false when there is no stroke to highlight (e.g. an area
 *   with `showLine={false}`); defaults true.
 * @param span data points either side of the hovered point the band covers;
 *   defaults 1.
 */
export function useHighlightSegment({
  enabled = true,
  span = 1,
}: {
  enabled?: boolean
  span?: number
} = {}): HighlightSegmentResult {
  const { data, xScale, xAccessor, dateLabels } = useChartStable()
  const snap = dateLabels.length > DISCRETE_INTERACTION_LABEL_THRESHOLD
  const store = useChartHoverStore()
  const { highlightSpring } = useChartConfig()

  const resolveBounds = useCallback(
    (hover: ChartHoverContextValue): SegmentBounds =>
      enabled
        ? computeSegmentBounds(
            data,
            xScale,
            xAccessor,
            hover.tooltipData,
            hover.selection,
            span
          )
        : INACTIVE_SEGMENT,
    [enabled, data, xScale, xAccessor, span]
  )

  const isActive = useChartHoverSelector(
    (hover) => resolveBounds(hover).isActive
  )

  const xSpring = useSpring(0, highlightSpring)
  const widthSpring = useSpring(0, highlightSpring)

  const wasActive = useRef(false)
  // Runs on every hover change (store subscription) and whenever the bounds
  // inputs change (data / scale / span), like the old per-render effect.
  useLayoutEffect(() => {
    if (!store) {
      return
    }
    const drive = () => {
      const bounds = resolveBounds(store.getSnapshot())
      if (!bounds.isActive) {
        wasActive.current = false
        return
      }
      if (!wasActive.current || snap) {
        xSpring.jump(bounds.x)
        widthSpring.jump(bounds.width)
      }
      xSpring.set(bounds.x)
      widthSpring.set(bounds.width)
      wasActive.current = true
    }
    drive()
    return store.subscribe(drive)
  }, [resolveBounds, snap, store, xSpring, widthSpring])

  return { xSpring, widthSpring, isActive }
}
