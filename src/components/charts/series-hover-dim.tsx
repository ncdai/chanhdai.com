"use client"

import type { ReactNode } from "react"
import { m } from "motion/react"

import { selectIsChartHovering, useChartHoverSelector } from "./chart-context"
import { useChartLegendHover } from "./chart-legend-hover"

interface SeriesHoverDimProps {
  /** Skip the dim entirely. */
  enabled?: boolean
  /** Opacity to fade to while the chart is being hovered. */
  dimOpacity?: number
  /** Tween duration in seconds. */
  durationSec?: number
  /** Series index for multi-series legend hover dimming. */
  seriesIndex?: number
  /** Stable chart visuals — area fill, stroke line, dashed tail, etc. */
  children: ReactNode
}

/**
 * Wraps stable series visuals with a hover-driven opacity animation.
 *
 * The wrapper subscribes to chart hover state internally so the parent (Area /
 * Line) can stay on the stable context slice. Children come in as a React prop:
 * because the parent is not re-rendering on hover, the children element
 * reference stays identical and React skips re-rendering them when this
 * wrapper re-renders. That keeps expensive subtrees (`SeriesDashTailOverlay`
 * and its `getPointAtLength` binary search) quiescent on cursor motion.
 */
export function SeriesHoverDim({
  enabled = true,
  dimOpacity = 0.5,
  durationSec = 0.4,
  seriesIndex,
  children,
}: SeriesHoverDimProps) {
  // Boolean selector: re-renders on hover enter / leave, not on every move.
  const isChartHovering = useChartHoverSelector(selectIsChartHovering)
  const { hoveredIndex: legendHoveredIndex } = useChartLegendHover()
  const isLegendDimmed =
    legendHoveredIndex !== null &&
    seriesIndex !== undefined &&
    legendHoveredIndex !== seriesIndex
  const opacity =
    enabled && (isChartHovering || isLegendDimmed) ? dimOpacity : 1
  return (
    <m.g
      animate={{ opacity }}
      initial={{ opacity: 1 }}
      transition={{ duration: durationSec, ease: "easeInOut" }}
    >
      {children}
    </m.g>
  )
}

SeriesHoverDim.displayName = "SeriesHoverDim"

export default SeriesHoverDim
