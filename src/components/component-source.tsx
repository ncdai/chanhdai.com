import fs from "node:fs/promises"
import path from "node:path"

import { highlightCode } from "@/lib/highlight-code"
import { fixImport } from "@/lib/registry"
import { Index } from "@/registry/__index__"

import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper"
import { CodeBlockCaption, CodeBlockFrame } from "./mdx-code-block"

export async function ComponentSource({
  name,
  src,
  title,
  collapsible = "true",
  "data-code-meta": codeMeta,
  className,
}: {
  name?: string
  src?: string
  title?: string
  collapsible?: "true" | "false"
  /** Line ranges to highlight, e.g. `{1,3-5}`. */
  "data-code-meta"?: string
  className?: string
}) {
  const filePath: string | undefined = src ?? Index[name ?? ""]?.files[0]?.path

  if (!filePath) {
    return null
  }

  const code = fixImport(
    await fs.readFile(
      path.join(/*turbopackIgnore: true*/ process.cwd(), filePath),
      "utf8"
    )
  )
  const language = path.extname(filePath).slice(1)

  const highlightedCode = await highlightCode(code, language, {
    highlightedLines: parseHighlightedLines(codeMeta),
  })

  const content = (
    <figure data-rehype-pretty-code-figure="" className="not-prose">
      {title && (
        <CodeBlockCaption
          data-rehype-pretty-code-title=""
          data-language={language}
        >
          {title}
        </CodeBlockCaption>
      )}

      <CodeBlockFrame code={code} hasTitle={!!title}>
        {/* An HTML string keeps the RSC payload small and mounts without
            reconciling every token */}
        <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </CodeBlockFrame>
    </figure>
  )

  if (collapsible === "false") {
    return <div className={className}>{content}</div>
  }

  return (
    <CodeCollapsibleWrapper className={className}>
      {content}
    </CodeCollapsibleWrapper>
  )
}

function parseHighlightedLines(meta?: string) {
  const ranges = meta?.match(/\{([\d,\s-]+)\}/)?.[1]

  if (!ranges) {
    return undefined
  }

  return ranges.split(",").flatMap((range) => {
    const [start, end = start] = range.split("-").map(Number)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  })
}
