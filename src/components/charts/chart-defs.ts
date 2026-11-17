import type { ReactElement } from "react"

export function getChartChildComponentName(child: ReactElement): string {
  const childType = child.type as { displayName?: string; name?: string }
  return typeof child.type === "function"
    ? childType.displayName || childType.name || ""
    : ""
}

const VISX_PATTERN_COMPONENT_NAMES = new Set([
  "Lines",
  "Circles",
  "Waves",
  "Hexagons",
  "Path",
  "Pattern",
])

/** @visx/pattern default exports use short names (e.g. `Lines`); also match *Pattern* displayNames. */
export function isPatternDefComponent(child: ReactElement): boolean {
  const name = getChartChildComponentName(child)
  return name.includes("Pattern") || VISX_PATTERN_COMPONENT_NAMES.has(name)
}

export function isGradientDefComponent(child: ReactElement): boolean {
  const name = getChartChildComponentName(child)
  return (
    name.includes("Gradient") ||
    name === "LinearGradient" ||
    name === "RadialGradient"
  )
}
