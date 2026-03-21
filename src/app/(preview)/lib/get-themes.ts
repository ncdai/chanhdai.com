import "server-only"

import { unstable_cache } from "next/cache"
import { cache } from "react"
import type { RegistryItem } from "shadcn/schema"

import { getShadcnThemes } from "./shadcn"
import { getTweakcnThemes } from "./tweakcn"

const getCachedTweakcnThemes = unstable_cache(
  getTweakcnThemes,
  ["tweakcn-themes"],
  {
    revalidate: 60 * 60 * 24, // 24 hours
  }
)

export const getCachedThemes = cache(
  async (): Promise<Map<string, RegistryItem>> => {
    const shadcnThemes = getShadcnThemes()
    const tweakcnThemes = await getCachedTweakcnThemes()
    const themes = [...shadcnThemes, ...tweakcnThemes]
    return new Map(themes.map((theme) => [theme.name, theme]))
  }
)
