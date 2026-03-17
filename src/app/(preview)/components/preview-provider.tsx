"use client"

import { useLayoutEffect, useState } from "react"
import type { RegistryItem } from "shadcn/schema"

import { useIframeMessageListener } from "@/app/(preview)/hooks/use-iframe-sync"
import { usePreviewSearchParams } from "@/app/(preview)/lib/search-params"

const THEME_VARS_STYLE_ID = "theme-vars"
const THEME_FONT_LINK_ID = "theme-font"

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

function applyThemeCSSVars(
  doc: Document,
  theme: RegistryItem,
  styleId: string
) {
  if (!theme.name) {
    console.warn("Theme is missing required 'name' property")
    return
  }

  let el = doc.getElementById(styleId) as HTMLStyleElement | null
  if (!el) {
    el = doc.createElement("style")
    el.id = styleId
    doc.head.appendChild(el)
  }

  const cssContent = buildThemeCSSVars(theme)
  el.textContent = cssContent

  const fontVars = extractFontVarsFromTheme(theme)
  const html = doc.documentElement

  for (const key of FONT_VAR_KEYS) {
    if (fontVars.has(key)) {
      html.style.setProperty(`--${key}`, fontVars.get(key)!)
    } else {
      html.style.removeProperty(`--${key}`)
    }
  }
}

function buildThemeCSSVars(theme: RegistryItem): string {
  if (!theme.cssVars || Object.keys(theme.cssVars).length === 0) {
    console.warn(`Theme "${theme.name}" has no cssVars defined`)
    return ":root {}\n\n.dark {}\n"
  }

  const { light, dark, theme: themeVars } = theme.cssVars

  const parts = [":root {\n"]
  parts.push(toCSSVars(themeVars))
  parts.push(toCSSVars(light))
  parts.push("}\n\n.dark {\n")
  parts.push(toCSSVars(dark))
  parts.push("}\n")

  return parts.join("")
}

function toCSSVars(vars: Record<string, string> | undefined): string {
  if (!vars) return ""

  const entries = Object.entries(vars)
    .filter(
      ([k, v]) => v && typeof v === "string" && v.trim() && isValidCSSVarName(k)
    )
    .map(([k, v]) => `  --${k}: ${v.trim()};\n`)

  return entries.join("")
}

function isValidCSSVarName(name: string) {
  return /^[a-z0-9-]+$/i.test(name)
}

const FONT_VAR_KEYS = [
  "font-sans",
  "font-mono",
  "font-serif",
  "font-heading",
] as const

function extractFontVarsFromTheme(theme: RegistryItem): Map<string, string> {
  const result = new Map<string, string>()
  const cssVars = theme.cssVars ?? {}

  for (const source of [cssVars.theme, cssVars.light]) {
    if (!source) continue

    for (const key of FONT_VAR_KEYS) {
      const value = source[key]
      if (typeof value === "string" && value.trim() && !result.has(key)) {
        result.set(key, value)
      }
    }
  }
  return result
}

function clearThemeCSSVars(doc: Document, styleId: string) {
  const el = doc.getElementById(styleId)
  if (el) {
    el.remove()
  }

  const html = doc.documentElement
  for (const key of FONT_VAR_KEYS) {
    html.style.removeProperty(`--${key}`)
  }
}

function applyThemeFonts(
  doc: Document,
  theme: RegistryItem,
  linkId: string
): void {
  const families = extractFontFamilies(theme)

  if (families.length > 0) {
    const href = buildGoogleFontsUrl(families)
    let linkEl = doc.getElementById(linkId) as HTMLLinkElement | null
    if (!linkEl) {
      linkEl = doc.createElement("link")
      linkEl.id = linkId
      linkEl.rel = "stylesheet"
      doc.head.appendChild(linkEl)
    }
    linkEl.href = href
    return
  }

  const existing = doc.getElementById(linkId)
  if (existing) {
    existing.remove()
  }
}

function buildGoogleFontsUrl(families: string[]): string {
  if (families.length === 0) return ""
  const params = families
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join("&")
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

function extractFontFamilies(theme: RegistryItem): string[] {
  const seen = new Set<string>()
  const families: string[] = []

  const cssVars = theme.cssVars ?? {}
  const sources = [cssVars.theme, cssVars.light, cssVars.dark]

  for (const source of sources) {
    if (!source) continue

    for (const key of FONT_VAR_KEYS) {
      const value = source[key]

      if (typeof value === "string") {
        const family = parseFontFamily(value)

        if (family && !seen.has(family)) {
          seen.add(family)
          families.push(family)
        }
      }
    }
  }

  return families
}

const GENERIC_FONTS = [
  "sans-serif",
  "serif",
  "monospace",
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
] as const

function parseFontFamily(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const match = trimmed.match(/^["']?([^,"']+)/)
  const name = match ? match[1].trim() : trimmed.split(",")[0]?.trim()
  if (!name) return null

  if (GENERIC_FONTS.includes(name.toLowerCase())) return null

  return name
}
