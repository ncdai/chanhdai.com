import type { CurveFactory } from "d3-shape"
import { line as d3Line } from "d3-shape"

import { fastShapePath } from "./fast-path"

export interface SeriesPathPoint {
  x: number
  y: number
  key: string
}

export function computeSeriesPathPoints(
  data: Record<string, unknown>[],
  xAccessor: (datum: Record<string, unknown>) => Date,
  xScale: (value: Date) => number | undefined,
  yScale: (value: number) => number | undefined,
  dataKey: string
): SeriesPathPoint[] {
  return data.map((datum, index) => {
    const xValue = xAccessor(datum)
    const yValue = datum[dataKey]
    return {
      x: xScale(xValue) ?? 0,
      y: typeof yValue === "number" ? (yScale(yValue) ?? 0) : 0,
      key: String(xValue.getTime?.() ?? index),
    }
  })
}

export function interpolateSeriesPathPoints(
  from: SeriesPathPoint[],
  to: SeriesPathPoint[],
  progress: number
): SeriesPathPoint[] {
  if (progress >= 1) {
    return to
  }
  if (progress <= 0) {
    return from.length > 0 ? from : to
  }

  const fromByKey = new Map(from.map((point) => [point.key, point]))

  return to.map((target, index) => {
    const source = fromByKey.get(target.key)
    if (source) {
      return {
        key: target.key,
        x: source.x + (target.x - source.x) * progress,
        y: source.y + (target.y - source.y) * progress,
      }
    }

    const previousTarget = index > 0 ? to[index - 1] : undefined
    const previousSource = previousTarget
      ? fromByKey.get(previousTarget.key)
      : undefined
    const nextTarget = index < to.length - 1 ? to[index + 1] : undefined
    const nextSource = nextTarget ? fromByKey.get(nextTarget.key) : undefined
    const anchor = previousSource ?? nextSource ?? from[0] ?? target

    return {
      key: target.key,
      x: anchor.x + (target.x - anchor.x) * progress,
      y: anchor.y + (target.y - anchor.y) * progress,
    }
  })
}

export function seriesPathFromPoints(
  points: SeriesPathPoint[],
  curve: CurveFactory
): string {
  if (points.length === 0) {
    return ""
  }

  const generator = d3Line<SeriesPathPoint>()
    .x((point) => point.x)
    .y((point) => point.y)
    .curve(curve)

  return fastShapePath(generator, points)
}

const CURVE_SEGMENT_STEPS = 12

/**
 * Records a d3 curve as a dense polyline (beziers subdivided) so the rendered
 * curve can be sampled as y(x).
 */
class PolylineRecorder {
  points: SeriesPathPoint[] = []
  private x = 0
  private y = 0

  private push(x: number, y: number) {
    this.points.push({ x, y, key: "" })
    this.x = x
    this.y = y
  }

  moveTo(x: number, y: number) {
    this.push(x, y)
  }

  lineTo(x: number, y: number) {
    this.push(x, y)
  }

  bezierCurveTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number
  ) {
    const x0 = this.x
    const y0 = this.y
    for (let step = 1; step <= CURVE_SEGMENT_STEPS; step++) {
      const t = step / CURVE_SEGMENT_STEPS
      const u = 1 - t
      const a = u * u * u
      const b = 3 * u * u * t
      const c = 3 * u * t * t
      const d = t * t * t
      this.push(
        a * x0 + b * x1 + c * x2 + d * x,
        a * y0 + b * y1 + c * y2 + d * y
      )
    }
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number) {
    const x0 = this.x
    const y0 = this.y
    for (let step = 1; step <= CURVE_SEGMENT_STEPS; step++) {
      const t = step / CURVE_SEGMENT_STEPS
      const u = 1 - t
      this.push(
        u * u * x0 + 2 * u * t * x1 + t * t * x,
        u * u * y0 + 2 * u * t * y1 + t * t * y
      )
    }
  }

  closePath() {
    // Open series paths only.
  }
}

/** Flattens the curve through `points` into a dense polyline sorted by x. */
export function flattenSeriesPath(
  points: SeriesPathPoint[],
  curve: CurveFactory
): SeriesPathPoint[] {
  if (points.length < 2) {
    return points
  }
  const recorder = new PolylineRecorder()
  d3Line<SeriesPathPoint>()
    .x((point) => point.x)
    .y((point) => point.y)
    .curve(curve)
    // Minimal CanvasPath recorder — only implements the commands d3 curves emit.
    .context(recorder as unknown as CanvasRenderingContext2D)(points)
  return recorder.points.sort((a, b) => a.x - b.x)
}

/** y of a polyline (sorted by x) at `x`, clamped to its end points. */
export function samplePolylineY(polyline: SeriesPathPoint[], x: number) {
  const first = polyline[0]
  const last = polyline.at(-1)
  if (!(first && last)) {
    return 0
  }
  if (x <= first.x) {
    return first.y
  }
  if (x >= last.x) {
    return last.y
  }
  let low = 0
  let high = polyline.length - 1
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2)
    if ((polyline[mid]?.x ?? 0) <= x) {
      low = mid
    } else {
      high = mid
    }
  }
  const a = polyline[low] ?? first
  const b = polyline[high] ?? last
  const span = b.x - a.x
  return span > 0 ? a.y + ((b.y - a.y) * (x - a.x)) / span : a.y
}

/**
 * Vertical morph between two polylines: both are sampled on a shared x grid
 * spanning the target's extent, and only y is interpolated, so the line rises
 * and falls into its new shape instead of points sliding sideways.
 */
export function morphSeriesPolylines(
  from: SeriesPathPoint[],
  to: SeriesPathPoint[],
  progress: number,
  sampleSpacingPx = 2
): SeriesPathPoint[] {
  const first = to[0]
  const last = to.at(-1)
  if (!(first && last) || from.length === 0) {
    return to
  }
  const span = last.x - first.x
  const count = Math.max(2, Math.ceil(span / sampleSpacingPx) + 1)
  const result: SeriesPathPoint[] = new Array(count)
  for (let index = 0; index < count; index++) {
    const x = first.x + (span * index) / (count - 1)
    const fromY = samplePolylineY(from, x)
    const toY = samplePolylineY(to, x)
    result[index] = { x, y: fromY + (toY - fromY) * progress, key: "" }
  }
  return result
}

/** Data-only signature (x/y values), ignoring scale domain and width. */
export function seriesDataSignature(
  renderData: Record<string, unknown>[],
  xAccessor: (datum: Record<string, unknown>) => Date,
  dataKey: string
): string {
  return renderData
    .map((datum) => {
      const yValue = datum[dataKey]
      return `${xAccessor(datum).getTime()}:${typeof yValue === "number" ? yValue : ""}`
    })
    .join(",")
}

export function seriesPathTransitionSignature({
  renderData,
  xAccessor,
  dataKey,
  innerWidth,
  xDomainMin,
  xDomainMax,
}: {
  renderData: Record<string, unknown>[]
  xAccessor: (datum: Record<string, unknown>) => Date
  dataKey: string
  innerWidth: number
  xDomainMin: number
  xDomainMax: number
}): string {
  return seriesPathTransitionSignatureFromData(
    seriesDataSignature(renderData, xAccessor, dataKey),
    { innerWidth, xDomainMin, xDomainMax }
  )
}

/**
 * {@link seriesPathTransitionSignature} from an already-built
 * {@link seriesDataSignature}, so callers needing both walk the data once.
 */
export function seriesPathTransitionSignatureFromData(
  dataSignature: string,
  {
    innerWidth,
    xDomainMin,
    xDomainMax,
  }: { innerWidth: number; xDomainMin: number; xDomainMax: number }
): string {
  return `${innerWidth}|${xDomainMin}|${xDomainMax}|${dataSignature}`
}
