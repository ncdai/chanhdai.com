import { scaleLinear } from "d3-scale"

import type { LineConfig } from "./chart-context"
import { Y_DOMAIN_TWEEN_SKIP_THRESHOLD, type ChartPhase } from "./chart-phase"
import { groupLinesByYAxisId, normalizeYAxisId } from "./y-axis-scales"

export type YDomain = [number, number]

/**
 * Per-axis y-domain override: a fixed `[min, max]`, or a function that
 * receives the auto domain (before `nice()`) and returns the one to use —
 * e.g. `([, max]) => [0, max * 3]` to push volume bars into the bottom third.
 */
export type YDomainOverride = YDomain | ((auto: YDomain) => YDomain)

export function applyYDomainOverride(
  auto: YDomain,
  override: YDomainOverride | undefined
): YDomain {
  if (!override) {
    return auto
  }
  return typeof override === "function" ? override(auto) : override
}

export interface NumericExtents {
  minValue: number
  maxValue: number
}

/** Min / max over every numeric `dataKeys` value. `{ 0, 100 }` when none are numeric. */
export function collectNumericExtents(
  data: Record<string, unknown>[],
  dataKeys: string[]
): NumericExtents {
  let minValue = Number.POSITIVE_INFINITY
  let maxValue = Number.NEGATIVE_INFINITY

  for (const d of data) {
    for (const key of dataKeys) {
      const value = d[key]
      if (typeof value === "number") {
        if (value < minValue) {
          minValue = value
        }
        if (value > maxValue) {
          maxValue = value
        }
      }
    }
  }

  if (minValue === Number.POSITIVE_INFINITY) {
    return { minValue: 0, maxValue: 100 }
  }

  return { minValue, maxValue }
}

/**
 * Line / area y-domain: zero-anchored while every value is >= 0, padded
 * min..max once any value is negative.
 */
export function resolveTimeSeriesYDomain(
  data: Record<string, unknown>[],
  dataKeys: string[],
  yScaleDomainMax: number | undefined
): YDomain {
  if (yScaleDomainMax != null && yScaleDomainMax > 0) {
    return [0, yScaleDomainMax * 1.1]
  }

  const { minValue, maxValue } = collectNumericExtents(data, dataKeys)

  if (minValue >= 0) {
    const top = maxValue <= 0 ? 100 : maxValue * 1.1
    return [0, top]
  }

  const padding = (maxValue - minValue) * 0.05 || 1
  return [minValue - padding, maxValue + padding]
}

/**
 * Floating y-domain (no zero anchor): padded min..max. For price-like series
 * such as candlesticks, where a zero baseline would flatten every candle.
 */
export function resolveFloatingYDomain(
  data: Record<string, unknown>[],
  dataKeys: string[]
): YDomain {
  const { minValue, maxValue } = collectNumericExtents(data, dataKeys)
  const padding = (maxValue - minValue) * 0.05 || 1
  return [minValue - padding, maxValue + padding]
}

/**
 * Value extents for bar series. Stacked bars use the running totals (always
 * including the zero baseline) so the domain reaches every segment end;
 * grouped bars use the individual values.
 */
export function collectBarValueExtents(
  data: Record<string, unknown>[],
  dataKeys: string[],
  stacked: boolean
): NumericExtents {
  if (!stacked) {
    return collectNumericExtents(data, dataKeys)
  }
  let minValue = 0
  let maxValue = 0
  for (const d of data) {
    let sum = 0
    for (const key of dataKeys) {
      const value = d[key]
      if (typeof value === "number") {
        sum += value
        minValue = Math.min(minValue, sum)
        maxValue = Math.max(maxValue, sum)
      }
    }
  }
  return { minValue, maxValue }
}

/**
 * Bar value-axis domain. Bars grow from zero, so the domain always includes
 * 0: `[0, max * 1.1]` while every value is >= 0 (falls back to `[0, 110]`
 * when there is no positive value), and a padded min..max stretched to
 * include zero once any value is negative.
 */
export function resolveBarValueDomain({
  minValue,
  maxValue,
}: NumericExtents): YDomain {
  if (minValue >= 0) {
    return [0, (maxValue > 0 ? maxValue : 100) * 1.1]
  }

  const padding = (maxValue - minValue) * 0.05 || 1
  return [Math.min(0, minValue - padding), Math.max(0, maxValue + padding)]
}

/** Apply d3 `nice()` to raw domain endpoints for stable grid ticks. */
export function niceYDomain(domain: YDomain): YDomain {
  const scale = scaleLinear().domain(domain).nice().range([0, 1])
  const niceDomain = scale.domain()
  return [niceDomain[0] ?? domain[0], niceDomain[1] ?? domain[1]]
}

/**
 * Skip Y tween when both endpoints move less than the threshold relative to span.
 * When in doubt callers should tween — beauty wins over micro-optimization.
 */
export function shouldTweenYDomain(from: YDomain, to: YDomain): boolean {
  const span = Math.max(Math.abs(to[1] - to[0]), Math.abs(from[1] - from[0]), 1)
  const deltaMin = Math.abs(to[0] - from[0]) / span
  const deltaMax = Math.abs(to[1] - from[1]) / span
  return (
    deltaMin >= Y_DOMAIN_TWEEN_SKIP_THRESHOLD ||
    deltaMax >= Y_DOMAIN_TWEEN_SKIP_THRESHOLD
  )
}

/** Phases where the chart shows loading chrome (shimmer, pulse, label). */
export function isLoadingChromePhase(phase: ChartPhase): boolean {
  return phase === "loading" || phase === "revealingLoading"
}

/** Phases where grid lines use loading stroke styling (muted / dashed chrome). */
export function isLoadingGridChromePhase(phase: ChartPhase): boolean {
  return (
    phase === "loading" || phase === "exiting" || phase === "gridTweenLoading"
  )
}

/** Phases where Y-domain tween runs after the series has exited. */
export function isYDomainTweenPhase(phase: ChartPhase): boolean {
  return phase === "gridTweenLoading" || phase === "gridTweenReady"
}

/** Phases where {@link ReferenceArea} bands are shown (fade in/out on transitions). */
export function isReferenceAreaVisiblePhase(phase: ChartPhase): boolean {
  return (
    phase === "ready" || phase === "revealing" || phase === "gridTweenReady"
  )
}

export function resolveAnimatedYDestinationDomains(
  chartPhase: ChartPhase,
  skeletonByAxis: Record<string, YDomain>,
  targetByAxis: Record<string, YDomain>
): Record<string, YDomain> {
  switch (chartPhase) {
    case "loading":
    case "exiting":
    case "gridTweenLoading":
      return skeletonByAxis
    case "exitingReady":
    case "gridTweenReady":
    case "revealing":
    case "ready":
      return targetByAxis
    default:
      return targetByAxis
  }
}

export function computeYDomainsByAxis({
  lines,
  resolveDomain,
  extraKeysByAxis,
}: {
  lines: LineConfig[]
  /** Raw domain for one axis; `axisId` is normalised (`"left"` by default). */
  resolveDomain: (dataKeys: string[], axisId: string) => YDomain
  /**
   * Additional value keys per axis that extend the domain without being
   * series (e.g. `<Band>` upper/lower keys). Axes with only extra keys still
   * get a domain.
   */
  extraKeysByAxis?: Record<string, string[]>
}): Record<string, YDomain> {
  const keysByAxis = new Map<string, string[]>()
  for (const [axisId, axisLines] of groupLinesByYAxisId(lines)) {
    keysByAxis.set(
      normalizeYAxisId(axisId),
      axisLines.map((line) => line.dataKey)
    )
  }
  for (const [axisId, extraKeys] of Object.entries(extraKeysByAxis ?? {})) {
    const id = normalizeYAxisId(axisId)
    const keys = keysByAxis.get(id) ?? []
    keysByAxis.set(id, [
      ...keys,
      ...extraKeys.filter((key) => !keys.includes(key)),
    ])
  }

  const domains: Record<string, YDomain> = {}
  for (const [axisId, dataKeys] of keysByAxis) {
    domains[axisId] = niceYDomain(resolveDomain(dataKeys, axisId))
  }

  if (!domains.left) {
    domains.left = niceYDomain([0, 100])
  }

  return domains
}

/** Merge domain maps, normalizing axis ids to strings. */
export function mergeYDomainRecords(
  ...records: Record<string, YDomain>[]
): Record<string, YDomain> {
  const merged: Record<string, YDomain> = {}
  for (const record of records) {
    for (const [axisId, domain] of Object.entries(record)) {
      merged[normalizeYAxisId(axisId)] = domain
    }
  }
  return merged
}

export function domainsEqual(
  left: Record<string, YDomain>,
  right: Record<string, YDomain>
): boolean {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  if (leftKeys.length !== rightKeys.length) {
    return false
  }

  for (const axisId of leftKeys) {
    const from = left[axisId]
    const to = right[axisId]
    if (!(from && to) || from[0] !== to[0] || from[1] !== to[1]) {
      return false
    }
  }

  return true
}
