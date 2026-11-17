import type { CSSProperties, ReactElement, SVGProps } from "react"

/**
 * Grid rows / columns that render what `@visx/grid` 4.0.0 `GridRows` and
 * `GridColumns` did (minus the `visx-group` / `visx-rows` / `visx-columns` /
 * `visx-line` classes), so charts keep identical markup without the dep.
 */

/** Any scale a grid can read: d3 linear / time / band / point. */
export interface GridScale<Value> {
  (value: Value): number | { valueOf(): number } | undefined
  domain(): Value[]
  ticks?: (count?: number) => Value[]
  bandwidth?: () => number
}

/**
 * Tick values the way visx resolves them: explicit `tickValues`, else
 * `scale.ticks(numTicks)`, else the domain thinned to about `numTicks`
 * entries (every `round((n - 1) / numTicks)`-th value) when it is longer.
 */
export function gridTickValues<Value>(
  scale: GridScale<Value>,
  numTicks: number | undefined = 10,
  tickValues?: Value[]
): Value[] {
  if (tickValues) {
    return tickValues
  }
  if ("ticks" in scale && scale.ticks) {
    return scale.ticks(numTicks)
  }
  return scale
    .domain()
    .filter(
      (_, index, all) =>
        numTicks == null ||
        all.length <= numTicks ||
        index % Math.round((all.length - 1) / numTicks) === 0
    )
}

/**
 * Pixel position of each grid line: `scale(tick)` (0 when unmapped) plus
 * `offset` plus half the band for band scales (visx `getScaleBandwidth`).
 */
export function gridLinePositions<Value>(
  scale: GridScale<Value>,
  {
    numTicks,
    offset,
    tickValues,
  }: { numTicks?: number; offset?: number; tickValues?: Value[] } = {}
): number[] {
  const bandOffset =
    "bandwidth" in scale && scale.bandwidth ? scale.bandwidth() / 2 : 0
  const scaleOffset = (offset ?? 0) + bandOffset
  return gridTickValues(scale, numTicks, tickValues).map((tick) => {
    const mapped = scale(tick)
    const value =
      mapped != null && typeof mapped === "object" ? mapped.valueOf() : mapped
    return (value ?? 0) + scaleOffset
  })
}

type GridLineSvgProps = Omit<
  SVGProps<SVGLineElement>,
  "x1" | "x2" | "y1" | "y2" | "ref" | "scale" | "offset" | "className"
>

interface GridLinesBaseProps<Value> extends GridLineSvgProps {
  scale: GridScale<Value>
  /** Group offsets (`translate(left, top)`). Default: 0 */
  top?: number
  left?: number
  /** Class on the wrapping `<g>`. */
  className?: string
  /** Default: 10 (ignored when `tickValues` is set). */
  numTicks?: number
  tickValues?: Value[]
  /** Extra pixel offset added to every line. */
  offset?: number
  lineStyle?: CSSProperties
  /** Default: `#eaf0f6` (visx). */
  stroke?: string
  /** Default: 1 */
  strokeWidth?: string | number
  strokeDasharray?: string
}

export interface GridRowsProps<Value> extends GridLinesBaseProps<Value> {
  /** Line length. */
  width: number
}

export interface GridColumnsProps<Value> extends GridLinesBaseProps<Value> {
  /** Line length. */
  height: number
}

/** visx `Line` attributes, in visx order; rest props come after. */
function gridLine(
  key: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  {
    stroke,
    strokeWidth,
    strokeDasharray,
    lineStyle,
    rest,
  }: {
    stroke: string
    strokeWidth: string | number
    strokeDasharray?: string
    lineStyle?: CSSProperties
    rest: GridLineSvgProps
  }
) {
  const rectilinear = x1 === x2 || y1 === y2
  // An object, not JSX attributes, so the formatter can't re-sort them.
  const props: SVGProps<SVGLineElement> = {
    x1,
    y1,
    x2,
    y2,
    fill: "transparent",
    shapeRendering: rectilinear ? "crispEdges" : "auto",
    stroke,
    strokeWidth,
    strokeDasharray,
    style: lineStyle,
    ...rest,
  }
  return <line key={key} {...props} />
}

/**
 * The visx group wrapper (`translate(left, top)` + `className`), skipped when
 * it would be an identity transform with no class — one less node per grid.
 */
function wrapGridLines(
  lines: ReactElement[],
  { className, left, top }: { className?: string; left: number; top: number }
) {
  if (left === 0 && top === 0 && !className) {
    return <>{lines}</>
  }
  return (
    <g className={className} transform={`translate(${left}, ${top})`}>
      {lines}
    </g>
  )
}

export function GridRows<Value>({
  top = 0,
  left = 0,
  scale,
  width,
  stroke = "#eaf0f6",
  strokeWidth = 1,
  strokeDasharray,
  className,
  numTicks = 10,
  lineStyle,
  offset,
  tickValues,
  ...rest
}: GridRowsProps<Value>) {
  const positions = gridLinePositions(scale, { numTicks, offset, tickValues })
  const lines = positions.map((y, index) =>
    gridLine(`row-line-${index}`, 0, y, width, y, {
      stroke,
      strokeWidth,
      strokeDasharray,
      lineStyle,
      rest,
    })
  )
  return wrapGridLines(lines, { className, left, top })
}

export function GridColumns<Value>({
  top = 0,
  left = 0,
  scale,
  height,
  stroke = "#eaf0f6",
  strokeWidth = 1,
  strokeDasharray,
  className,
  numTicks = 10,
  lineStyle,
  offset,
  tickValues,
  ...rest
}: GridColumnsProps<Value>) {
  const positions = gridLinePositions(scale, { numTicks, offset, tickValues })
  const lines = positions.map((x, index) =>
    gridLine(`column-line-${index}`, x, 0, x, height, {
      stroke,
      strokeWidth,
      strokeDasharray,
      lineStyle,
      rest,
    })
  )
  return wrapGridLines(lines, { className, left, top })
}
