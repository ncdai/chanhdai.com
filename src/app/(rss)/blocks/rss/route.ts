import { escapeXml, toISODateSafe } from "@/utils/string"

import { blockCategories } from "@/config/registry"
import { SITE_INFO } from "@/config/site"

export const revalidate = false
export const dynamic = "force-static"

type BlockItem = {
  category: string
  name: string
  description: string
  createdAt: string | undefined
}

export async function GET() {
  const { Index } = await import("@/registry/__index__")

  const blocks: BlockItem[] = []

  for (const category of blockCategories) {
    for (const itemName in Index) {
      const item = Index[itemName]
      if (
        item.type === "registry:block" &&
        item.categories?.includes(category.name)
      ) {
        blocks.push({
          category: category.name,
          name: itemName,
          description: item.description,
          createdAt: item?.meta?.createdAt,
        })
      }
    }
  }

  const blocksXml = blocks
    .map((block) => {
      const pubDate = toISODateSafe(block.createdAt)
      if (!pubDate) return null
      return `<item>
          <title>${escapeXml(block.name)}</title>
          <link>${SITE_INFO.url}/blocks/${block.category}/${block.name}</link>
          <description>${escapeXml(block.description || "")}</description>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .filter(Boolean)
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Blocks | ${SITE_INFO.name}</title>
      <link>${SITE_INFO.url}/blocks</link>
      <description>Beautifully designed, production-ready.</description>
      ${blocksXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}
