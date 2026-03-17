import "server-only"

import { unstable_cache } from "next/cache"
import { cache } from "react"
import type { RegistryItem } from "shadcn/schema"

import { getTweakcnThemes } from "@/app/(preview)/lib/tweakcn"

const getCachedTweakcnThemes = unstable_cache(
  getTweakcnThemes,
  ["tweakcn-themes"],
  {
    revalidate: 60 * 60 * 24, // 24 hours
  }
)

export const getCachedThemes = cache(
  async (): Promise<Map<string, RegistryItem>> => {
    const tweakcnThemes = await getCachedTweakcnThemes()
    return new Map(tweakcnThemes.map((theme) => [theme.name, theme]))
  }
)
