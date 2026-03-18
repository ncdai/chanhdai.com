"use client"

import { useLayoutEffect, useState } from "react"
import type { RegistryItem } from "shadcn/schema"

import { useIframeMessageListener } from "@/app/(preview)/hooks/use-iframe-sync"
import { usePreviewSearchParams } from "@/app/(preview)/lib/search-params"
import {
  applyThemeCSSVars,
  clearThemeCSSVars,
  THEME_VARS_STYLE_ID,
} from "@/app/(preview)/lib/theme-css-vars"
import {
  applyThemeFonts,
  THEME_FONT_LINK_ID,
} from "@/app/(preview)/lib/theme-fonts"

export function PreviewProvider({
  themes,
  children,
}: {
  themes: Map<string, RegistryItem>
  children: React.ReactNode
}) {
  const [previewParams, setPreviewParams] = usePreviewSearchParams()

  const themeParam = previewParams?.theme

  const themeItem = themeParam ? themes.get(themeParam) : null

  const [themeApplied, setThemeApplied] = useState(false)

  // Ready when no theme or theme is applied.
  const isReady = !themeParam || (!!themeItem && themeApplied)

  useIframeMessageListener("preview-params", (nextParams) => {
    setPreviewParams(nextParams)
    if (!nextParams.theme) {
      clearThemeCSSVars(document, THEME_VARS_STYLE_ID)
      setThemeApplied(false)
    }
  })

  useLayoutEffect(() => {
    if (typeof document === "undefined" || !themeItem) {
      return
    }

    applyThemeFonts(document, themeItem, THEME_FONT_LINK_ID)
    applyThemeCSSVars(document, themeItem, THEME_VARS_STYLE_ID)

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeApplied(true)
  }, [themeItem])

  if (!isReady) {
    return null
  }

  return <>{children}</>
}
