"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type {
  ScaleLinear as D3ScaleLinear,
  ScaleTime as D3ScaleTime,
} from "d3-scale"

import {
  createChartHoverStore,
  type BandConfig,
  type ChartHoverStore,
  type LineConfig,
  type Margin,
  type TooltipData,
} from "./chart-context"
import { localPoint } from "./local-point"
import { useScheduledTooltip } from "./use-scheduled-tooltip"
import { normalizeYAxisId } from "./y-axis-scales"

type ScaleTime = D3ScaleTime<number, number>
type ScaleLinear = D3ScaleLinear<number, number>

export interface ChartSelection {
  startX: number
  endX: number
  startIndex: number
  endIndex: number
  active: boolean
}

interface UseChartInteractionParams {
  xScale: ScaleTime
  yScale: ScaleLinear
  yScales: Record<string, ScaleLinear>
  data: Record<string, unknown>[]
  lines: LineConfig[]
  /** `<Band>` configs — edge y-positions for tooltip dots. */
  bands?: BandConfig[]
  margin: Margin
  xAccessor: (d: Record<string, unknown>) => Date
  bisectDate: (
    data: Record<string, unknown>[],
    date: Date,
    lo: number
  ) => number
  canInteract: boolean
}

interface ChartInteractionResult {
  /**
   * Tooltip + selection state. Lives outside React state so a pointer move
   * re-renders only hover consumers (publish it with `ChartHoverStoreProvider`).
   */
  hoverStore: ChartHoverStore
  interactionHandlers: {
    onMouseMove?: (event: React.MouseEvent<SVGGElement>) => void
    onMouseLeave?: () => void
    onMouseDown?: (event: React.MouseEvent<SVGGElement>) => void
    onMouseUp?: () => void
    onTouchStart?: (event: React.TouchEvent<SVGGElement>) => void
    onTouchMove?: (event: React.TouchEvent<SVGGElement>) => void
    onTouchEnd?: () => void
  }
  interactionStyle: React.CSSProperties
}

/** Pixel y per line dataKey, plus band edge keys (line keys win on collisions). */
function resolveYPositions(
  d: Record<string, unknown>,
  lines: LineConfig[],
  bands: BandConfig[] | undefined,
  yScales: Record<string, ScaleLinear>,
  yScale: ScaleLinear
): Record<string, number> {
  const yPositions: Record<string, number> = {}
  const place = (key: string, yAxisId: string | number | undefined) => {
    const value = d[key]
    if (typeof value === "number") {
      const axisScale = yScales[normalizeYAxisId(yAxisId)] ?? yScale
      yPositions[key] = axisScale(value) ?? 0
    }
  }
  for (const band of bands ?? []) {
    if (band.showInTooltip) {
      place(band.upperKey, band.yAxisId)
      place(band.lowerKey, band.yAxisId)
    }
  }
  // Lines last so they win when a band edge shares a line's key.
  for (const line of lines) {
    place(line.dataKey, line.yAxisId)
  }
  return yPositions
}

export function useChartInteraction({
  xScale,
  yScale,
  yScales,
  data,
  lines,
  bands,
  margin,
  xAccessor,
  bisectDate,
  canInteract,
}: UseChartInteractionParams): ChartInteractionResult {
  const [hoverStore] = useState(createChartHoverStore)
  const { setSelection } = hoverStore
  const { scheduleTooltip, clearTooltip, resetTooltipDedupe } =
    useScheduledTooltip<TooltipData>(hoverStore.setTooltipData)

  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef<number>(0)
  const lastHoveredXRef = useRef<number | null>(null)

  const resolveTooltipFromX = useCallback(
    (pixelX: number): TooltipData | null => {
      const x0 = xScale.invert(pixelX)
      const index = bisectDate(data, x0, 1)
      const d0 = data[index - 1]
      const d1 = data[index]

      if (!d0) {
        return null
      }

      let d = d0
      let finalIndex = index - 1
      if (d1) {
        const d0Time = xAccessor(d0).getTime()
        const d1Time = xAccessor(d1).getTime()
        if (x0.getTime() - d0Time > d1Time - x0.getTime()) {
          d = d1
          finalIndex = index
        }
      }

      return {
        point: d,
        index: finalIndex,
        x: xScale(xAccessor(d)) ?? 0,
        yPositions: resolveYPositions(d, lines, bands, yScales, yScale),
      }
    },
    [xScale, yScale, yScales, data, lines, bands, xAccessor, bisectDate]
  )

  const resolveIndexFromX = useCallback(
    (pixelX: number): number => {
      const x0 = xScale.invert(pixelX)
      const index = bisectDate(data, x0, 1)
      const d0 = data[index - 1]
      const d1 = data[index]
      if (!d0) {
        return 0
      }
      if (d1) {
        const d0Time = xAccessor(d0).getTime()
        const d1Time = xAccessor(d1).getTime()
        if (x0.getTime() - d0Time > d1Time - x0.getTime()) {
          return index
        }
      }
      return index - 1
    },
    [xScale, data, xAccessor, bisectDate]
  )

  const getChartX = useCallback(
    (
      event: React.MouseEvent<SVGGElement> | React.TouchEvent<SVGGElement>,
      touchIndex = 0
    ): number | null => {
      let point: { x: number; y: number } | null = null

      if ("touches" in event) {
        const touch = event.touches[touchIndex]
        if (!touch) {
          return null
        }
        const svg = event.currentTarget.ownerSVGElement
        if (!svg) {
          return null
        }
        point = localPoint(svg, touch)
      } else {
        point = localPoint(event)
      }

      if (!point) {
        return null
      }
      return point.x - margin.left
    },
    [margin.left]
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      const chartX = getChartX(event)
      if (chartX === null) {
        return
      }

      if (isDraggingRef.current) {
        const startX = Math.min(dragStartXRef.current, chartX)
        const endX = Math.max(dragStartXRef.current, chartX)
        setSelection({
          startX,
          endX,
          startIndex: resolveIndexFromX(startX),
          endIndex: resolveIndexFromX(endX),
          active: true,
        })
        return
      }

      lastHoveredXRef.current = chartX
      const tooltip = resolveTooltipFromX(chartX)
      if (tooltip) {
        scheduleTooltip(tooltip)
      }
    },
    [
      getChartX,
      resolveTooltipFromX,
      resolveIndexFromX,
      scheduleTooltip,
      setSelection,
    ]
  )

  const handleMouseLeave = useCallback(() => {
    lastHoveredXRef.current = null
    clearTooltip()
    if (isDraggingRef.current) {
      isDraggingRef.current = false
    }
    setSelection(null)
  }, [clearTooltip, setSelection])

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<SVGGElement>) => {
      const chartX = getChartX(event)
      if (chartX === null) {
        return
      }
      // Stop the drag from starting a native text selection across the page
      // (tooltip, labels, nearby copy).
      event.preventDefault()
      isDraggingRef.current = true
      dragStartXRef.current = chartX
      clearTooltip()
      setSelection(null)
    },
    [getChartX, clearTooltip, setSelection]
  )

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
    }
    setSelection(null)
  }, [setSelection])

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<SVGGElement>) => {
      if (event.touches.length === 1) {
        event.preventDefault()
        const chartX = getChartX(event, 0)
        if (chartX === null) {
          return
        }
        lastHoveredXRef.current = chartX
        const tooltip = resolveTooltipFromX(chartX)
        if (tooltip) {
          scheduleTooltip(tooltip)
        }
      } else if (event.touches.length === 2) {
        event.preventDefault()
        resetTooltipDedupe()
        clearTooltip()
        const x0 = getChartX(event, 0)
        const x1 = getChartX(event, 1)
        if (x0 === null || x1 === null) {
          return
        }
        const startX = Math.min(x0, x1)
        const endX = Math.max(x0, x1)
        setSelection({
          startX,
          endX,
          startIndex: resolveIndexFromX(startX),
          endIndex: resolveIndexFromX(endX),
          active: true,
        })
      }
    },
    [
      getChartX,
      resolveTooltipFromX,
      resolveIndexFromX,
      scheduleTooltip,
      resetTooltipDedupe,
      clearTooltip,
      setSelection,
    ]
  )

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<SVGGElement>) => {
      if (event.touches.length === 1) {
        event.preventDefault()
        const chartX = getChartX(event, 0)
        if (chartX === null) {
          return
        }
        lastHoveredXRef.current = chartX
        const tooltip = resolveTooltipFromX(chartX)
        if (tooltip) {
          scheduleTooltip(tooltip)
        }
      } else if (event.touches.length === 2) {
        event.preventDefault()
        const x0 = getChartX(event, 0)
        const x1 = getChartX(event, 1)
        if (x0 === null || x1 === null) {
          return
        }
        const startX = Math.min(x0, x1)
        const endX = Math.max(x0, x1)
        setSelection({
          startX,
          endX,
          startIndex: resolveIndexFromX(startX),
          endIndex: resolveIndexFromX(endX),
          active: true,
        })
      }
    },
    [
      getChartX,
      resolveTooltipFromX,
      resolveIndexFromX,
      scheduleTooltip,
      setSelection,
    ]
  )

  const handleTouchEnd = useCallback(() => {
    clearTooltip()
    setSelection(null)
  }, [clearTooltip, setSelection])

  // Re-anchor tooltip/crosshair when x-scale or visible data changes (e.g. brush zoom commit).
  useEffect(() => {
    if (!canInteract || lastHoveredXRef.current === null) {
      return
    }
    const tooltip = resolveTooltipFromX(lastHoveredXRef.current)
    if (tooltip) {
      scheduleTooltip(tooltip, `${tooltip.index}:${Math.round(tooltip.x)}`)
      return
    }
    clearTooltip()
  }, [canInteract, clearTooltip, resolveTooltipFromX, scheduleTooltip])

  const interactionHandlers = canInteract
    ? {
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
      }
    : {}

  const interactionStyle: React.CSSProperties = {
    cursor: canInteract ? "crosshair" : "default",
    touchAction: "none",
  }

  return {
    hoverStore,
    interactionHandlers,
    interactionStyle,
  }
}
