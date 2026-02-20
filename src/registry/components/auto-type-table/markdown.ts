import { configDefault } from "fumadocs-core/highlight"
import { highlightHast } from "fumadocs-core/highlight/core"
import type { ElementContent, Nodes } from "hast"
import rehypeExternalLinks from "rehype-external-links"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"

import {
  rehypeCodeRawString,
  rehypeHighlightCode,
  rehypeHighlightCodeRawString,
} from "@/lib/rehype-code-block"

export interface MarkdownRenderer {
  renderTypeToHast: (type: string) => Nodes | Promise<Nodes>
  renderMarkdownToHast: (md: string) => Nodes | Promise<Nodes>
}

export function markdownRenderer(shiki = configDefault): MarkdownRenderer {
  const processor = remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: "nofollow noopener noreferrer",
    })
    // Code highlighting and raw string extraction for copy button
    .use(rehypeCodeRawString)
    .use(rehypeHighlightCode)
    .use(rehypeHighlightCodeRawString)

  return {
    async renderTypeToHast(type) {
      const nodes = await highlightHast(type, {
        config: shiki,
        lang: "ts",
        structure: "inline",
      })

      return {
        type: "element",
        tagName: "code",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "span",
            properties: {
              "data-line": "",
            },
            children: nodes.children as ElementContent[],
          },
        ],
      }
    },
    renderMarkdownToHast(md) {
      md = md.replace(/{@link ([^}]*)}/g, "$1") // replace jsdoc links
      return processor.run(processor.parse(md))
    },
  }
}
