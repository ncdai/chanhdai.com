import type { RegistryItem } from "shadcn/schema"

export const THEME_FONT_LINK_ID = "theme-font"

export const FONT_VAR_KEYS = [
  "font-sans",
  "font-mono",
  "font-serif",
  "font-heading",
] as const

const GENERIC_FONTS = [
  "sans-serif",
  "serif",
  "monospace",
  "system-ui",
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
] as const

export function extractFontVarsFromTheme(
  theme: RegistryItem
): Map<string, string> {
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

export function applyThemeFonts(
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

function parseFontFamily(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const match = trimmed.match(/^["']?([^,"']+)/)
  const name = match ? match[1].trim() : trimmed.split(",")[0]?.trim()
  if (!name) return null

  if (GENERIC_FONTS.includes(name.toLowerCase())) return null

  return name
}

function buildGoogleFontsUrl(families: string[]): string {
  if (families.length === 0) return ""
  const params = families
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
    .join("&")
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}
