import type { RegistryItem } from "shadcn/schema"

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
