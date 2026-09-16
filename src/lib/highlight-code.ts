import { createHash } from "crypto"
import { LRUCache } from "lru-cache"
import type { ShikiTransformer } from "shiki"
import { codeToHtml } from "shiki"

// LRU cache for cross-request caching of highlighted code.
// Shiki highlighting is CPU-intensive and deterministic, so caching is safe.
const highlightCache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 hour.
})

export const transformers = [
  {
    code(node) {
      if (node.tagName === "code") {
        const raw = this.source
        node.properties["__raw__"] = raw

        if (raw.startsWith("npm install")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm install", "yarn add")
          node.properties["__pnpm__"] = raw.replace("npm install", "pnpm add")
          node.properties["__bun__"] = raw.replace("npm install", "bun add")
        }

        if (raw.startsWith("npx create-")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace(
            "npx create-",
            "yarn create "
          )
          node.properties["__pnpm__"] = raw.replace(
            "npx create-",
            "pnpm create "
          )
          node.properties["__bun__"] = raw.replace("npx", "bunx --bun")
        }

        // npm create.
        if (raw.startsWith("npm create")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm create", "yarn create")
          node.properties["__pnpm__"] = raw.replace("npm create", "pnpm create")
          node.properties["__bun__"] = raw.replace("npm create", "bun create")
        }

        // npx.
        if (raw.startsWith("npx")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npx", "yarn")
          node.properties["__pnpm__"] = raw.replace("npx", "pnpm dlx")
          node.properties["__bun__"] = raw.replace("npx", "bunx --bun")
        }

        // npm run.
        if (raw.startsWith("npm run")) {
          node.properties["__npm__"] = raw
          node.properties["__yarn__"] = raw.replace("npm run", "yarn")
          node.properties["__pnpm__"] = raw.replace("npm run", "pnpm")
          node.properties["__bun__"] = raw.replace("npm run", "bun")
        }
      }
    },
  },
] as ShikiTransformer[]

export const CODE_THEMES = {
  dark: "vesper",
  light: "github-light-default",
} as const

export type HighlightCodeOptions = {
  showLineNumbers?: boolean
  /** 1-based line numbers. */
  highlightedLines?: number[]
}

export async function highlightCode(
  code: string,
  language: string = "tsx",
  { showLineNumbers = false, highlightedLines = [] }: HighlightCodeOptions = {}
) {
  const cacheKey = createHash("sha256")
    .update(JSON.stringify([language, showLineNumbers, highlightedLines, code]))
    .digest("hex")

  const cached = highlightCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // A trailing newline would render as an empty last line
  const html = await codeToHtml(code.replace(/\n$/, ""), {
    lang: language,
    themes: CODE_THEMES,
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          delete node.properties["class"]
          delete node.properties["style"]
          node.properties["data-language"] = language
        },
        code(node) {
          if (showLineNumbers) {
            node.properties["data-line-numbers"] = ""
          }
          node.properties["data-language"] = language
          node.properties["style"] = "display: grid"
        },
        line(node, line) {
          delete node.properties["class"]
          node.properties["data-line"] = ""

          if (highlightedLines.includes(line)) {
            node.properties["data-highlighted-line"] = ""
          }

          // Empty lines would collapse in `display: grid` and get lost on copy
          if (node.children.length === 0) {
            node.children = [{ type: "text", value: " " }]
          }
        },
      },
    ],
  })

  highlightCache.set(cacheKey, html)

  return html
}
