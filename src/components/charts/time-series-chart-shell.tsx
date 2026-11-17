"use client"

import {
  Children,
  cloneElement,
  isValidElement,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react"
import { bisector, extent } from "d3-array"
import { scaleLinear, scaleTime } from "d3-scale"
import type { Transition } from "motion/react"

import {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_CHART_ENTER_TRANSITION,
} from "./animation"
import {
  bandKeysByAxis,
  extractBandConfigs,
  type BandConfig,
} from "./band-config"
import {
  isClipExcludedComponent,
  isPostOverlayComponent,
  isUnderlayComponent,
  isUnresolvedLazyChartChild,
  renderableChartChild,
  resolveChartChildElement,
} from "./chart-child-passthrough"
import {
  ChartHoverStoreProvider,
  ChartStableContextProvider,
  type ChartStableContextValue,
  type LineConfig,
  type Margin,
} from "./chart-context"
import { isGradientDefComponent, isPatternDefComponent } from "./chart-defs"
import { lazyLabels, shortDateFmt } from "./chart-formatters"
import {
  DEFAULT_CHART_STATUS,
  DEFAULT_Y_DOMAIN_TWEEN_MS,
  isChartInteractionPhase,
  type ChartPhase,
  type ChartStatus,
} from "./chart-phase"
import { ChartRevealClip } from "./chart-reveal-clip"
import {
  decimateTimeSeries,
  maxRenderPointsForWidth,
} from "./decimate-time-series"
import { filterDataByXDomain } from "./filter-data-by-x-domain"
import {
  generateChartSkeletonData,
  generateChartSkeletonFromTarget,
} from "./generate-chart-skeleton-data"
import {
  extractProjectionLineConfigs,
  mergeProjectionXDomainMax,
  mergeProjectionYDomain,
} from "./projection-config"
import {
  extractReferenceAreaConfigs,
  type ReferenceAreaConfig,
} from "./reference-area-config"
import { ReferenceAreaRegistrationContext } from "./reference-area-registration-context"
import {
  computeSeriesBarRevealClipPadding,
  computeSeriesBarWidth,
} from "./series-bar-layout"
import { useStaticChartPreview } from "./static-chart-preview-context"
import { useAnimatedYDomains } from "./use-animated-y-domains"
import { useChartInteraction } from "./use-chart-interaction"
import { useChartPhaseOrchestrator } from "./use-chart-phase-orchestrator"
import {
  buildYScalesFromDomains,
  DEFAULT_Y_AXIS_ID,
  getPrimaryYScale,
  groupLinesByYAxisId,
} from "./y-axis-scales"
import {
  applyYDomainOverride,
  collectBarValueExtents,
  collectNumericExtents,
  computeYDomainsByAxis,
  resolveFloatingYDomain,
  resolveTimeSeriesYDomain,
  type YDomain,
  type YDomainOverride,
} from "./y-domain-utils"

/**
 * Y-domain for an axis that carries stacked `SeriesBar` series: stack totals
 * for the bar keys, raw values for everything else, zero-anchored like
 * {@link resolveTimeSeriesYDomain}.
 */
function resolveStackedComposedYDomain(
  data: Record<string, unknown>[],
  barKeys: string[],
  otherKeys: string[]
): YDomain {
  const bars = collectBarValueExtents(data, barKeys, true)
  const others =
    otherKeys.length > 0 ? collectNumericExtents(data, otherKeys) : bars
  const minValue = Math.min(bars.minValue, others.minValue)
  const maxValue = Math.max(bars.maxValue, others.maxValue)
  if (minValue >= 0) {
    return [0, maxValue <= 0 ? 100 : maxValue * 1.1]
  }
  const padding = (maxValue - minValue) * 0.05 || 1
  return [minValue - padding, maxValue + padding]
}

/**
 * Bleed around the series reveal clip so glyphs centred on the plot edge
 * (point markers, active rings, round stroke caps at min/max values) are not
 * cut in half once the reveal settles. The reveal only animates x, so the
 * vertical bleed is always applied; horizontal bleed is skipped while an
 * `xDomain` viewport is set because series then extend past the plot edges.
 */
const SERIES_CLIP_EDGE_BLEED = 24

function ensureChildKey(child: ReactElement, index: number): ReactElement {
  if (child.key != null) {
    return child
  }
  return cloneElement(child, { key: `chart-child-${index}` })
}

/** `<defs>` only when it has children (an empty one is a wasted node). */
function OptionalDefs({ children }: { children: ReactNode }) {
  return Children.toArray(children).length > 0 ? <defs>{children}</defs> : null
}

interface ClassifiedChartChildren {
  defsChildren: ReactElement[]
  clipExcludedChildren: ReactElement[]
  underlayChildren: ReactElement[]
  preOverlayChildren: ReactElement[]
  postOverlayChildren: ReactElement[]
  /** A lazy child had not loaded yet — classification is provisional. */
  hasPendingLazyChild: boolean
}

/**
 * Sort chart children into SVG layers. Memoised on `children` by the caller:
 * `ensureChildKey` / lazy resolution create new elements, and fresh element
 * identities on every hover re-render would re-render every layer (Grid,
 * series, …) instead of only the hover subscribers.
 */
function classifyChartChildren(children: ReactNode): ClassifiedChartChildren {
  const layers: ClassifiedChartChildren = {
    defsChildren: [],
    clipExcludedChildren: [],
    underlayChildren: [],
    preOverlayChildren: [],
    postOverlayChildren: [],
    hasPendingLazyChild: false,
  }

  Children.forEach(children, (child, index) => {
    if (!isValidElement(child)) {
      return
    }

    const keyedChild = ensureChildKey(child, index)
    const resolvedChild = resolveChartChildElement(keyedChild)
    const renderChild = renderableChartChild(keyedChild)
    if (isUnresolvedLazyChartChild(resolvedChild)) {
      layers.hasPendingLazyChild = true
    }

    if (isGradientDefComponent(resolvedChild)) {
      layers.defsChildren.push(renderChild)
    } else if (isPatternDefComponent(resolvedChild)) {
      layers.preOverlayChildren.push(renderChild)
    } else if (isPostOverlayComponent(resolvedChild)) {
      layers.postOverlayChildren.push(renderChild)
    } else if (isClipExcludedComponent(resolvedChild)) {
      layers.clipExcludedChildren.push(renderChild)
    } else if (isUnderlayComponent(resolvedChild)) {
      layers.underlayChildren.push(renderChild)
    } else {
      layers.preOverlayChildren.push(renderChild)
    }
  })

  return layers
}

export interface TimeSeriesChartInnerProps {
  width: number
  height: number
  data: Record<string, unknown>[]
  xDataKey: string
  margin: Margin
  animationDuration: number
  animationEasing?: string
  enterTransition?: Transition
  /** Signature of motion URL state — triggers reveal replay when it changes. */
  revealSignature?: string
  children: ReactNode
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Series keys driving y-domain and tooltip (Line / Area / SeriesBar configs). */
  lines: LineConfig[]
  /**
   * Base SVG clipPath id for grow animation. Uniquified per chart instance so
   * multiple charts on one page do not share a clipPath (#226).
   */
  clipPathId: string
  /** Optional ComposedChart bar layout (forwarded into context). */
  composedBarDataKeys?: string[]
  composedBarSize?: number
  composedMaxBarSize?: number
  composedBarGap?: number
  composedStacked?: boolean
  composedStackOffsets?: Map<number, Map<string, number>>
  composedStackGap?: number
  /** Inset the x range by half a slot when `composedBarDataKeys` is non-empty. */
  composedBarEdgeInset?: boolean
  /** When set, drives the y-axis max instead of scanning `lines` (e.g. stacked bar totals). */
  yScaleDomainMax?: number
  /**
   * Value keys per y-axis that extend the domain without becoming series or
   * tooltip rows (e.g. candlestick `high` / `low`). Keep the reference stable.
   */
  extraDomainKeysByAxis?: Record<string, string[]>
  /**
   * Y-axis ids whose domain floats around the data (padded min..max) instead
   * of anchoring at zero — e.g. the axis a `<Candlestick>` draws on.
   */
  floatingYAxisIds?: readonly string[]
  /** Per-axis domain overrides applied on top of the auto domain. */
  yDomainOverrides?: Record<string, YDomainOverride>
  /** Loading vs ready — drives chart phase until transition orchestration lands. */
  chartStatus?: ChartStatus
  loadingLabel?: string
  /** Animate y-domain on status / data transitions. Default: true */
  yDomainTween?: boolean
  yDomainTweenDuration?: number
  /** Visible x-domain for brush zoom. When set, y-domain and series use data in this range. */
  xDomain?: [Date, Date]
  /** Full dataset length for x-scale padding when `xDomain` is set. */
  xDomainSlotCount?: number
  /** Tween y-domain when the visible x-range changes during the ready phase. */
  tweenYDomainOnXDomainChange?: boolean
  onPhaseChange?: (phase: ChartPhase) => void
}

/**
 * Whether a measured box is big enough to draw a time-series chart. Callers
 * render {@link TimeSeriesChartInner} only when it is, so the chart core is
 * the first component below the public chart that receives `data` (in dev,
 * React diffs the props of every component that re-renders).
 */
export function timeSeriesChartHasRoom(width: number, height: number) {
  return width >= 10 && height >= 10
}

/** X slots: the full dataset while brushing, else the visible rows. */
function resolveSlotCount(
  xDomain: [Date, Date] | undefined,
  xDomainSlotCount: number | undefined,
  visibleCount: number
): number {
  return xDomain && xDomainSlotCount != null ? xDomainSlotCount : visibleCount
}

/**
 * Half a slot on each side (band-scale style) so edge bars stay inside the
 * plot. With n slots the step becomes `innerWidth / n`.
 */
function resolveXEdgeInset(
  enabled: boolean,
  innerWidth: number,
  slotCount: number
): number {
  return enabled && slotCount >= 2 ? innerWidth / (2 * slotCount) : 0
}

export const TimeSeriesChartInner = memo(function TimeSeriesChartCore({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  animationEasing = DEFAULT_ANIMATION_EASING,
  enterTransition,
  revealSignature = "",
  children,
  containerRef,
  lines,
  clipPathId,
  composedBarDataKeys,
  composedBarSize,
  composedMaxBarSize,
  composedBarGap,
  composedStacked,
  composedStackOffsets,
  composedStackGap,
  composedBarEdgeInset = false,
  yScaleDomainMax,
  extraDomainKeysByAxis,
  floatingYAxisIds,
  yDomainOverrides,
  chartStatus = DEFAULT_CHART_STATUS,
  loadingLabel,
  yDomainTween = true,
  yDomainTweenDuration = DEFAULT_Y_DOMAIN_TWEEN_MS,
  xDomain,
  xDomainSlotCount,
  tweenYDomainOnXDomainChange = false,
  onPhaseChange,
}: TimeSeriesChartInnerProps) {
  // Unique per instance — shared clipPath ids crop later charts (#226).
  const uniqueClipPathId = `${clipPathId}-${useId().replace(/:/g, "")}`
  const staticPreview = useStaticChartPreview()
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const resolveAutoYDomain = useCallback(
    (
      sourceData: Record<string, unknown>[],
      dataKeys: string[],
      axisId: string
    ): YDomain => {
      if (floatingYAxisIds?.includes(axisId)) {
        return resolveFloatingYDomain(sourceData, dataKeys)
      }
      const axisGroups = groupLinesByYAxisId(lines)
      const usesDefaultOnly =
        axisGroups.size === 1 && axisGroups.has(DEFAULT_Y_AXIS_ID)
      if (usesDefaultOnly && yScaleDomainMax != null) {
        return resolveTimeSeriesYDomain(sourceData, dataKeys, yScaleDomainMax)
      }
      if (composedStacked && composedBarDataKeys?.length) {
        const barKeys = dataKeys.filter((key) =>
          composedBarDataKeys.includes(key)
        )
        if (barKeys.length > 0) {
          return resolveStackedComposedYDomain(
            sourceData,
            barKeys,
            dataKeys.filter((key) => !barKeys.includes(key))
          )
        }
      }
      return resolveTimeSeriesYDomain(sourceData, dataKeys, undefined)
    },
    [
      composedBarDataKeys,
      composedStacked,
      floatingYAxisIds,
      lines,
      yScaleDomainMax,
    ]
  )

  const resolveYDomain = useCallback(
    (
      sourceData: Record<string, unknown>[],
      dataKeys: string[],
      axisId: string
    ): YDomain =>
      applyYDomainOverride(
        resolveAutoYDomain(sourceData, dataKeys, axisId),
        yDomainOverrides?.[axisId]
      ),
    [resolveAutoYDomain, yDomainOverrides]
  )

  const skeletonData = useMemo(() => {
    const primaryKey = lines[0]?.dataKey ?? "value"
    if (data.length === 0) {
      return generateChartSkeletonData({ dataKey: primaryKey })
    }
    return generateChartSkeletonFromTarget(data, primaryKey)
  }, [data, lines])

  const {
    chartPhase,
    plotData,
    revealEpoch,
    concealEpoch,
    isLoaded,
    notifyLoadingPulseComplete,
    notifyRevealConcealComplete,
    notifyYDomainTweenComplete,
  } = useChartPhaseOrchestrator({
    animationDuration,
    chartStatus,
    revealSignature,
    skeletonData,
    skipEnterReveal: staticPreview,
    targetData: data,
    yDomainTweenDuration,
  })

  useEffect(() => {
    onPhaseChange?.(chartPhase)
  }, [chartPhase, onPhaseChange])

  const xAccessor = useCallback(
    (d: Record<string, unknown>): Date => {
      const value = d[xDataKey]
      return value instanceof Date ? value : new Date(value as string | number)
    },
    [xDataKey]
  )

  const bisectDate = useMemo(
    () => bisector<Record<string, unknown>, Date>((d) => xAccessor(d)).left,
    [xAccessor]
  )

  const visiblePlotData = useMemo(() => {
    if (!xDomain) {
      return plotData
    }
    return filterDataByXDomain(plotData, xDomain, xAccessor)
  }, [plotData, xDomain, xAccessor])

  const projectionConfigs = useMemo(
    () => extractProjectionLineConfigs(children),
    [children]
  )

  // `<Band>` edges extend the y-domain and survive decimation, but are not
  // series: they never enter `lines`. The tooltip reads `bands` separately for
  // range rows / edge dots. Keyed by a string signature so new `children`
  // identities don't redo decimation; the walk itself is memoised on
  // `children` so hover re-renders skip it.
  const bandConfigsSignature = useMemo(
    () => JSON.stringify(extractBandConfigs(children)),
    [children]
  )
  const bandConfigs = useMemo(
    () => JSON.parse(bandConfigsSignature) as BandConfig[],
    [bandConfigsSignature]
  )
  const bandKeysByAxisId = useMemo(() => {
    const byAxis = bandKeysByAxis(bandConfigs)
    if (!extraDomainKeysByAxis) {
      return byAxis
    }
    const merged: Record<string, string[]> = { ...byAxis }
    for (const [axisId, keys] of Object.entries(extraDomainKeysByAxis)) {
      const existing = merged[axisId] ?? []
      merged[axisId] = [
        ...existing,
        ...keys.filter((key) => !existing.includes(key)),
      ]
    }
    return merged
  }, [bandConfigs, extraDomainKeysByAxis])

  const slotCount = resolveSlotCount(
    xDomain,
    xDomainSlotCount,
    visiblePlotData.length
  )
  const xEdgeInset = resolveXEdgeInset(
    composedBarEdgeInset && (composedBarDataKeys?.length ?? 0) > 0,
    innerWidth,
    slotCount
  )

  const xScale = useMemo(() => {
    const minTime = xDomain
      ? xDomain[0].getTime()
      : (extent(plotData, (d) => xAccessor(d).getTime())[0] ?? 0)
    let maxTime = xDomain
      ? xDomain[1].getTime()
      : (extent(plotData, (d) => xAccessor(d).getTime())[1] ?? minTime)
    // Brush defines the viewport — projection horizon is included via brush
    // track extent, not by extending past the selection on the main chart.
    if (!xDomain) {
      maxTime = mergeProjectionXDomainMax(maxTime, projectionConfigs)
    }

    return scaleTime()
      .domain([minTime, maxTime])
      .range([xEdgeInset, innerWidth - xEdgeInset])
  }, [innerWidth, plotData, projectionConfigs, xAccessor, xDomain, xEdgeInset])

  // When brushing, keep the full series for path rendering so edge fades stay
  // anchored to the viewport while the line pans through them. Y-domain and
  // interaction still use the filtered visible slice.
  const seriesSourceData = xDomain ? plotData : visiblePlotData

  const renderData = useMemo(() => {
    const valueKeys = lines.map((line) => line.dataKey)
    for (const keys of Object.values(bandKeysByAxisId)) {
      for (const key of keys) {
        if (!valueKeys.includes(key)) {
          valueKeys.push(key)
        }
      }
    }
    return decimateTimeSeries(
      seriesSourceData,
      maxRenderPointsForWidth(innerWidth),
      valueKeys
    )
  }, [seriesSourceData, innerWidth, lines, bandKeysByAxisId])

  const columnWidth = useMemo(() => {
    if (slotCount < 2) {
      return 0
    }
    return (innerWidth - 2 * xEdgeInset) / (slotCount - 1)
  }, [innerWidth, slotCount, xEdgeInset])

  const yDomainSkeletonByAxis = useMemo(
    () =>
      computeYDomainsByAxis({
        lines,
        resolveDomain: (dataKeys, axisId) =>
          resolveYDomain(skeletonData, dataKeys, axisId),
      }),
    [lines, resolveYDomain, skeletonData]
  )

  const yDomainTargetByAxis = useMemo(() => {
    const base = computeYDomainsByAxis({
      extraKeysByAxis: bandKeysByAxisId,
      lines,
      resolveDomain: (dataKeys, axisId) =>
        resolveYDomain(xDomain ? visiblePlotData : data, dataKeys, axisId),
    })
    if (projectionConfigs.length === 0) {
      return base
    }
    const merged: Record<string, [number, number]> = { ...base }
    for (const axisId of Object.keys(base)) {
      merged[axisId] = mergeProjectionYDomain(
        base[axisId] ?? [0, 100],
        projectionConfigs,
        axisId
      )
    }
    for (const config of projectionConfigs) {
      if (!merged[config.yAxisId]) {
        merged[config.yAxisId] = mergeProjectionYDomain(
          [0, 100],
          projectionConfigs,
          config.yAxisId
        )
      }
    }
    return merged
  }, [
    bandKeysByAxisId,
    data,
    lines,
    projectionConfigs,
    resolveYDomain,
    visiblePlotData,
    xDomain,
  ])

  const animatedYDomainsByAxis = useAnimatedYDomains({
    chartPhase,
    durationMs: yDomainTweenDuration,
    enabled: yDomainTween,
    onSettled: notifyYDomainTweenComplete,
    skeletonByAxis: yDomainSkeletonByAxis,
    targetByAxis: yDomainTargetByAxis,
    tweenOnTargetChange:
      yDomainTween || (tweenYDomainOnXDomainChange && xDomain != null),
  })

  const yDomainsForScales = animatedYDomainsByAxis

  const yScales = useMemo(
    () =>
      buildYScalesFromDomains({
        domainsByAxis: yDomainsForScales,
        innerHeight,
        lines,
      }),
    [yDomainsForScales, innerHeight, lines]
  )

  const fallbackYScale = useMemo(
    () => scaleLinear().domain([0, 100]).nice().range([innerHeight, 0]),
    [innerHeight]
  )
  const yScale = getPrimaryYScale(yScales, fallbackYScale)

  const dateLabels = useMemo(
    () =>
      lazyLabels(visiblePlotData.length, (index) =>
        shortDateFmt.format(
          xAccessor(visiblePlotData[index] as Record<string, unknown>)
        )
      ),
    [visiblePlotData, xAccessor]
  )

  const canInteract = isLoaded && isChartInteractionPhase(chartPhase)

  // Hover lives in `hoverStore`, not state: pointer moves re-render only the
  // hover consumers below `ChartHoverStoreProvider`, not this shell.
  const { hoverStore, interactionHandlers, interactionStyle } =
    useChartInteraction({
      bisectDate,
      canInteract,
      bands: bandConfigs,
      data: visiblePlotData,
      lines,
      margin,
      xAccessor,
      xScale,
      yScale,
      yScales,
    })

  const memoizedLayers = useMemo(
    () => classifyChartChildren(children),
    [children]
  )
  // A lazy child that hasn't loaded can't be classified yet: re-classify on
  // every render until it resolves (the pre-memo behaviour).
  const {
    defsChildren,
    clipExcludedChildren,
    underlayChildren,
    preOverlayChildren,
    postOverlayChildren,
  } = memoizedLayers.hasPendingLazyChild
    ? classifyChartChildren(children)
    : memoizedLayers

  const [registeredReferenceAreas, setRegisteredReferenceAreas] = useState(
    () => new Map<string, ReferenceAreaConfig>()
  )

  const registerReferenceArea = useCallback(
    (id: string, config: ReferenceAreaConfig) => {
      setRegisteredReferenceAreas((prev) => {
        const existing = prev.get(id)
        if (
          existing &&
          existing.yAxisId === config.yAxisId &&
          existing.y1 === config.y1 &&
          existing.y2 === config.y2 &&
          existing.axisLabelColor === config.axisLabelColor
        ) {
          return prev
        }
        const next = new Map(prev)
        next.set(id, config)
        return next
      })
    },
    []
  )

  const unregisterReferenceArea = useCallback((id: string) => {
    setRegisteredReferenceAreas((prev) => {
      if (!prev.has(id)) {
        return prev
      }
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const referenceAreaRegistration = useMemo(
    () => ({ registerReferenceArea, unregisterReferenceArea }),
    [registerReferenceArea, unregisterReferenceArea]
  )

  const referenceAreas = useMemo(() => {
    const extracted = extractReferenceAreaConfigs(children)
    const registered = [...registeredReferenceAreas.values()]
    if (registered.length === 0) {
      return extracted
    }
    if (extracted.length === 0) {
      return registered
    }
    return [...extracted, ...registered]
  }, [children, registeredReferenceAreas])

  const contextValue = useMemo<ChartStableContextValue>(
    () => ({
      data: visiblePlotData,
      renderData,
      xScale,
      yScale,
      yScales,
      width,
      height,
      innerWidth,
      innerHeight,
      margin,
      columnWidth,
      containerRef,
      lines,
      bands: bandConfigs,
      referenceAreas,
      chartPhase,
      chartStatus,
      loadingLabel,
      yDomainTweenDuration,
      yDomainSkeletonByAxis,
      yDomainTargetByAxis,
      isLoaded,
      animationDuration,
      animationEasing,
      enterTransition,
      revealEpoch,
      notifyLoadingPulseComplete,
      xAccessor,
      dateLabels,
      xDomain,
      xDomainSlotCount,
      composedBarDataKeys,
      composedBarSize,
      composedMaxBarSize,
      composedBarGap,
      composedStacked,
      composedStackOffsets,
      composedStackGap,
    }),
    [
      visiblePlotData,
      renderData,
      xScale,
      yScale,
      yScales,
      width,
      height,
      innerWidth,
      innerHeight,
      margin,
      columnWidth,
      containerRef,
      lines,
      bandConfigs,
      referenceAreas,
      chartPhase,
      chartStatus,
      loadingLabel,
      yDomainTweenDuration,
      yDomainSkeletonByAxis,
      yDomainTargetByAxis,
      isLoaded,
      animationDuration,
      animationEasing,
      enterTransition,
      revealEpoch,
      notifyLoadingPulseComplete,
      xAccessor,
      dateLabels,
      xDomain,
      xDomainSlotCount,
      composedBarDataKeys,
      composedBarSize,
      composedMaxBarSize,
      composedBarGap,
      composedStacked,
      composedStackOffsets,
      composedStackGap,
    ]
  )

  const useClipReveal =
    !staticPreview &&
    renderData.length > 1 &&
    innerWidth > 0 &&
    animationDuration > 0
  const isRevealAnimating = chartPhase === "revealing"
  const isRevealConcealing =
    chartPhase === "exitingReady" && animationDuration > 0

  const effectiveEnterTransition = useMemo<Transition>(
    () =>
      enterTransition ??
      ({
        ...DEFAULT_CHART_ENTER_TRANSITION,
        duration: animationDuration / 1000,
      } satisfies Transition),
    [animationDuration, enterTransition]
  )

  const barRevealClipPadding = useMemo(() => {
    if (!composedBarDataKeys?.length) {
      return 0
    }
    const barWidth = computeSeriesBarWidth({
      columnWidth,
      composedBarGap,
      composedBarSize,
      composedMaxBarSize,
      dataLength: plotData.length,
      innerWidth,
      seriesCount: composedBarDataKeys.length,
      stacked: composedStacked,
    })
    return computeSeriesBarRevealClipPadding({
      barWidth,
      gap: composedBarGap,
      seriesCount: composedBarDataKeys.length,
      stacked: composedStacked,
    })
  }, [
    columnWidth,
    composedBarDataKeys,
    composedBarGap,
    composedBarSize,
    composedMaxBarSize,
    composedStacked,
    innerWidth,
    plotData.length,
  ])

  const revealClipPadding = xDomain
    ? barRevealClipPadding
    : Math.max(barRevealClipPadding, SERIES_CLIP_EDGE_BLEED)
  const revealClipPaddingY = Math.max(
    barRevealClipPadding,
    SERIES_CLIP_EDGE_BLEED
  )

  return (
    <ReferenceAreaRegistrationContext.Provider
      value={referenceAreaRegistration}
    >
      <ChartStableContextProvider value={contextValue}>
        <ChartHoverStoreProvider store={hoverStore}>
          <svg
            aria-hidden="true"
            className="overflow-visible"
            height={height}
            width={width}
          >
            <OptionalDefs>
              {defsChildren}
              {useClipReveal ? (
                <ChartRevealClip
                  animating={isRevealAnimating || isRevealConcealing}
                  clipPathId={uniqueClipPathId}
                  enterTransition={effectiveEnterTransition}
                  height={innerHeight}
                  mode={isRevealConcealing ? "conceal" : "reveal"}
                  onComplete={
                    isRevealConcealing ? notifyRevealConcealComplete : undefined
                  }
                  padding={revealClipPadding}
                  paddingY={revealClipPaddingY}
                  revealEpoch={isRevealConcealing ? concealEpoch : revealEpoch}
                  targetWidth={innerWidth}
                />
              ) : null}
            </OptionalDefs>

            <rect
              fill="transparent"
              height={height}
              width={width}
              x={0}
              y={0}
            />

            <g
              {...interactionHandlers}
              style={interactionStyle}
              transform={`translate(${margin.left},${margin.top})`}
            >
              <rect
                fill="transparent"
                height={innerHeight}
                width={innerWidth}
                x={0}
                y={0}
              />

              {clipExcludedChildren}
              {underlayChildren}
              {useClipReveal ? (
                <g clipPath={`url(#${uniqueClipPathId})`}>
                  {preOverlayChildren}
                </g>
              ) : (
                preOverlayChildren
              )}
              {postOverlayChildren}
            </g>
          </svg>
        </ChartHoverStoreProvider>
      </ChartStableContextProvider>
    </ReferenceAreaRegistrationContext.Provider>
  )
})
