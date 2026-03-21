import type { RegistryItem } from "shadcn/schema"

export const THEME_SOURCES = ["shadcn", "tweakcn"] as const

export type ThemeSource = (typeof THEME_SOURCES)[number]

export function isRegistryThemeItem(item: {
  type?: string
  cssVars?: unknown
}): item is RegistryItem & {
  type: "registry:style" | "registry:theme"
  cssVars: object
} {
  return (
    (item.type === "registry:style" || item.type === "registry:theme") &&
    typeof item.cssVars === "object" &&
    item.cssVars !== null
  )
}

export function withThemeSource(
  item: RegistryItem,
  source: ThemeSource
): RegistryItem {
  return {
    ...item,
    type: "registry:theme",
    meta: { ...item.meta, source },
  }
}
