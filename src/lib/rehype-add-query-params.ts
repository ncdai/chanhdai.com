import { visit } from "unist-util-visit"

import type { UnistNode, UnistTree } from "@/types/unist"
import { addQueryParams } from "@/utils/url"

export function rehypeAddQueryParams(params: Record<string, string>) {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (
        node.type !== "element" ||
        node?.tagName !== "a" ||
        !node?.properties?.href
      ) {
        return
      }

      const href = node.properties?.href as string | undefined

      if (
        !href ||
        href.startsWith("/") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        return
      }

      node.properties.href = addQueryParams(href, params)
    })
  }
}
