import fs from "node:fs"
import path from "node:path"
import { parseArgs } from "node:util"
import puppeteer from "puppeteer"

import { coverScenarios } from "./lib/cover-scenarios.mts"

const baseUrl = process.env.URL || "https://ncdai.localhost"

// `capture:sync` uploads this as `images/blog/{slug}.webp`, the cover URL in docs.
const outputDir = path.join(process.cwd(), ".ncdai/screenshots/blog")

const COVER = { width: 1200, height: 630 } as const

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    example: { type: "string" },
    theme: { type: "string", default: "dark" },
    zoom: { type: "string", default: "2" },
    dpr: { type: "string", default: "1" },
  },
})

const slug = positionals[0]
const example = values.example ?? `${slug}-demo`
const theme = values.theme as "light" | "dark"
const zoom = Number(values.zoom)
const dpr = Number(values.dpr)

if (!slug) {
  console.error(
    "Usage: pnpm capture:cover <slug> [--example name] [--theme dark|light] [--zoom 2] [--dpr 1]"
  )
  process.exit(1)
}

async function main() {
  await fs.promises.mkdir(outputDir, { recursive: true })

  const browser = await puppeteer.launch({
    args: ["--ignore-certificate-errors"],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ ...COVER, deviceScaleFactor: dpr })
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: theme },
    ])

    const response = await page.goto(`${baseUrl}/preview/${example}`, {
      waitUntil: "networkidle0",
    })

    if (!response?.ok()) {
      throw new Error(
        `Preview "${example}" responded with ${response?.status()}`
      )
    }

    const preview = await page.waitForSelector("div.style-preview")

    if (!preview) {
      throw new Error(`No preview rendered for "${example}"`)
    }

    await preview.evaluate((el, zoom) => {
      el.style.minHeight = "100vh"
      el.style.display = "grid"
      el.style.placeItems = "center"

      for (const child of Array.from(el.children)) {
        if (child instanceof HTMLElement) {
          child.style.zoom = String(zoom)
        }
      }
    }, zoom)

    await coverScenarios[slug]?.({ page, preview })

    const filePath = path.join(outputDir, `${slug}.webp`) as `${string}.webp`
    await page.screenshot({ path: filePath, type: "webp", quality: 90 })

    console.log(`✅ Cover saved:`, filePath)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error("⛔️ Error capturing cover:", error)
  process.exit(1)
})
