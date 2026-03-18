import type { RegistryItem } from "shadcn/schema"

import {
  extractFontVarsFromTheme,
  FONT_VAR_KEYS,
} from "@/app/(preview)/lib/theme-fonts"

export const THEME_VARS_STYLE_ID = "theme-vars"

export function applyThemeCSSVars(
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

export function clearThemeCSSVars(doc: Document, styleId: string) {
  const el = doc.getElementById(styleId)
  if (el) {
    el.remove()
  }

  const html = doc.documentElement
  for (const key of FONT_VAR_KEYS) {
    html.style.removeProperty(`--${key}`)
  }
}
