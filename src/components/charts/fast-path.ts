import type { Area, Line } from "d3-shape"

/**
 * Formats like d3-path's `appendRound(3)`: `String(Math.round(v * 1000) / 1000)`.
 * Builds the decimal from the rounded integer instead of formatting a
 * fractional double, which is the bulk of the cost of a long path `d`.
 * For |v| below 1e9 the result is identical: a decimal with at most 12
 * significant digits is the shortest round-trip form of its double.
 */
function formatCoordinate(value: number): string {
  const scaled = Math.round(value * 1000)
  if (!(scaled > -1e12 && scaled < 1e12)) {
    // NaN, ±Infinity and huge values: keep d3's exact formatting.
    return String(scaled / 1000)
  }
  if (scaled === 0) {
    return "0"
  }
  const negative = scaled < 0
  const abs = negative ? -scaled : scaled
  const whole = Math.floor(abs / 1000)
  const fraction = abs - whole * 1000
  const head = negative ? `-${whole}` : `${whole}`
  if (fraction === 0) {
    return head
  }
  if (fraction % 100 === 0) {
    return `${head}.${fraction / 100}`
  }
  if (fraction % 10 === 0) {
    return `${head}.${fraction < 100 ? "0" : ""}${fraction / 10}`
  }
  let pad = ""
  if (fraction < 10) {
    pad = "00"
  } else if (fraction < 100) {
    pad = "0"
  }
  return `${head}.${pad}${fraction}`
}

/**
 * Path context for d3 shape generators that emits the same `d` string as
 * d3-path with 3 digits (d3-shape's default), but faster. Curves only call
 * moveTo / lineTo / bezierCurveTo / quadraticCurveTo / closePath; anything
 * else marks the result unsupported so the caller falls back to d3-path.
 */
class FastPath {
  d = ""
  unsupported = false
  private open = false

  moveTo(x: number, y: number) {
    this.d += `M${formatCoordinate(+x)},${formatCoordinate(+y)}`
    this.open = true
  }

  lineTo(x: number, y: number) {
    this.d += `L${formatCoordinate(+x)},${formatCoordinate(+y)}`
    this.open = true
  }

  closePath() {
    if (this.open) {
      this.d += "Z"
    }
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number) {
    this.d += `Q${formatCoordinate(+x1)},${formatCoordinate(+y1)},${formatCoordinate(+x)},${formatCoordinate(+y)}`
    this.open = true
  }

  bezierCurveTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x: number,
    y: number
  ) {
    this.d += `C${formatCoordinate(+x1)},${formatCoordinate(+y1)},${formatCoordinate(+x2)},${formatCoordinate(+y2)},${formatCoordinate(+x)},${formatCoordinate(+y)}`
    this.open = true
  }

  arcTo() {
    this.unsupported = true
  }

  arc() {
    this.unsupported = true
  }

  rect() {
    this.unsupported = true
  }
}

type Generator<Datum> = Line<Datum> | Area<Datum>

/**
 * `generator(data) || ""` for a d3 `line()` / `area()` that uses the default
 * 3-digit rounding and no context of its own — same string, built faster.
 */
export function fastShapePath<Datum>(
  generator: Generator<Datum>,
  data: Datum[]
): string {
  const context = new FastPath()
  // The path context type is a CanvasRenderingContext2D-like interface;
  // FastPath implements the subset d3 shapes call.
  generator.context(context as unknown as CanvasRenderingContext2D)
  ;(generator as (data: Datum[]) => unknown)(data)
  generator.context(null)
  if (context.unsupported) {
    return ((generator as (data: Datum[]) => string | null)(data) ?? "") || ""
  }
  return context.d
}
