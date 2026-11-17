import { format } from "date-fns"

// Site-wide date style (`d MMM`), kept call-compatible with Intl's `.format()`
export const shortDateFmt = {
  format: (date: Date | number) => format(date, "d MMM"),
}

export const weekdayDateFmt = {
  format: (date: Date | number) => format(date, "EEE, d MMM"),
}

export const hmsTimeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
})

// `Intl.NumberFormat.prototype.format` is a bound getter — safe to extract.
export const intFmt = new Intl.NumberFormat("en-US").format
export const valueLabelFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
}).format

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

/**
 * Tooltip value for a `<Band>` row: `"low – high"` (ordered), the value itself
 * when both edges read the same key, or `null` when either edge is missing
 * (e.g. Bollinger warm-up rows).
 */
export function formatBandRange(
  point: Record<string, unknown>,
  upperKey: string,
  lowerKey: string,
  format: (value: number) => string = intFmt
): string | number | null {
  const upper = point[upperKey]
  const lower = point[lowerKey]
  if (!(isFiniteNumber(upper) && isFiniteNumber(lower))) {
    return null
  }
  if (upperKey === lowerKey) {
    return upper
  }
  return `${format(Math.min(lower, upper))} – ${format(Math.max(lower, upper))}`
}

/** Below this many rows labels are formatted up front (cheap, no proxy). */
const EAGER_LABEL_LIMIT = 64

/** `prop` as an array index below `length`, or -1. */
function toArrayIndex(prop: string | symbol, length: number): number {
  if (typeof prop !== "string" || prop.length === 0) {
    return -1
  }
  const first = prop.charCodeAt(0)
  if (first < 48 || first > 57) {
    return -1
  }
  const index = Number(prop)
  return Number.isInteger(index) && index < length && String(index) === prop
    ? index
    : -1
}

/**
 * A `string[]` of per-row labels formatted on first read. Charts expose one
 * label per row (date pill, axis ticks) but usually read only a handful, and
 * `Intl.DateTimeFormat#format` costs ~1 µs per call, so formatting 10k rows up
 * front would add ~10 ms to every mount and data update. Behaves like a
 * regular array (length, indexing, iteration, `map`, `Array.isArray`).
 */
export function lazyLabels(
  length: number,
  format: (index: number) => string
): string[] {
  if (length <= EAGER_LABEL_LIMIT) {
    return Array.from({ length }, (_, index) => format(index))
  }
  const cache: string[] = new Array(length)
  return new Proxy(cache, {
    get(target, prop, receiver) {
      const index = toArrayIndex(prop, length)
      if (index === -1) {
        return Reflect.get(target, prop, receiver)
      }
      let label = target[index]
      if (label === undefined) {
        label = format(index)
        target[index] = label
      }
      return label
    },
    has(target, prop) {
      return toArrayIndex(prop, length) !== -1 || Reflect.has(target, prop)
    },
  })
}
