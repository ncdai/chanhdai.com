import type { Ref, SVGProps } from "react"
import { area, line, type CurveFactory } from "d3-shape"

import { fastShapePath } from "./fast-path"

/**
 * Line / closed-area path helpers that reproduce what `@visx/shape` 4.0.0
 * `LinePath` and `AreaClosed` rendered, on plain d3-shape generators:
 *
 * - Accessors (`x`, `y`, `defined`) and `curve` are only applied when given;
 *   otherwise d3's defaults stay in place (`d[0]` / `d[1]`, always defined,
 *   `curveLinear`).
 * - `AreaClosed`'s baseline is `yScale.range()[0]` (the FIRST range value, not
 *   the max) unless `y0` is passed; `y` becomes the area's top line (`y1`).
 * - An empty result (no data) becomes `""`, never `null`.
 */

export type PathAccessor<Datum> = (
  datum: Datum,
  index: number,
  data: Datum[]
) => number

export interface LinePathConfig<Datum> {
  x?: PathAccessor<Datum>
  y?: PathAccessor<Datum>
  defined?: (datum: Datum, index: number, data: Datum[]) => boolean
  curve?: CurveFactory
}

export interface AreaClosedConfig<Datum> extends LinePathConfig<Datum> {
  /** Baseline. Default: `yScale.range()[0]`. */
  y0?: number | PathAccessor<Datum>
  /** Only read when `y0` is omitted. */
  yScale?: { range(): number[] }
}

/** `d` of visx `<LinePath data={data} … />`. */
export function linePathD<Datum>(
  data: Datum[],
  { x, y, defined, curve }: LinePathConfig<Datum>
): string {
  const path = line<Datum>()
  if (x) {
    path.x(x)
  }
  if (y) {
    path.y(y)
  }
  if (defined) {
    path.defined(defined)
  }
  if (curve) {
    path.curve(curve)
  }
  return fastShapePath(path, data)
}

/** `d` of visx `<AreaClosed data={data} … />`. */
export function areaClosedD<Datum>(
  data: Datum[],
  { x, y, y0, yScale, defined, curve }: AreaClosedConfig<Datum>
): string {
  const path = area<Datum>()
  if (x) {
    path.x(x)
  }
  if (defined) {
    path.defined(defined)
  }
  if (curve) {
    path.curve(curve)
  }
  if (y0 == null) {
    const baseline = yScale?.range()[0]
    if (baseline !== undefined) {
      path.y0(baseline)
    }
  } else if (typeof y0 === "number") {
    path.y0(y0)
  } else {
    path.y0(y0)
  }
  if (y) {
    path.y1(y)
  }
  return fastShapePath(path, data)
}

export type LinePathProps = Omit<SVGProps<SVGPathElement>, "d" | "ref"> & {
  /** Path data, e.g. from {@link linePathD}. */
  d: string
  /** Ref to the `<path>` (React 18 compatible, like visx `innerRef`). */
  innerRef?: Ref<SVGPathElement>
}

/**
 * The `<path>` visx `LinePath` rendered, minus its `visx-linepath` class:
 * `d`, then `fill` (default `transparent`), then `strokeLinecap="round"` (so a
 * lone defined point between gaps stays visible), then every other prop in
 * the order given. Props that repeat an earlier key keep its position.
 */
export function LinePath({
  d,
  fill = "transparent",
  innerRef,
  ...rest
}: LinePathProps) {
  return (
    <path d={d} fill={fill} ref={innerRef} strokeLinecap="round" {...rest} />
  )
}
