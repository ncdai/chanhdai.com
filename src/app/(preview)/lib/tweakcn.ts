import type { RegistryItem } from "shadcn/schema"
import { registrySchema } from "shadcn/schema"

import { isRegistryThemeItem, withThemeSource } from "./theme-item"

export async function getTweakcnThemes(): Promise<RegistryItem[]> {
  try {
    const res = await fetch("https://tweakcn.com/r/themes/registry.json")
    if (!res.ok) return []

    const jsonData = await res.json()

    const parsed = registrySchema.safeParse(jsonData)
    if (!parsed.success) return []

    return parsed.data.items
      .filter(isRegistryThemeItem)
      .map((item) => withThemeSource(item, "tweakcn"))
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    return []
  }
}
