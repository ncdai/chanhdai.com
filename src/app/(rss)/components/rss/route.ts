import { escapeXml, toISODateSafe } from "@/utils/string"

import { SITE_INFO } from "@/config/site"
import { getComponentDocs } from "@/features/doc/data/documents"

export const revalidate = false
export const dynamic = "force-static"

export function GET() {
  const itemsXml = getComponentDocs()
    .map((doc) => {
      const pubDate = toISODateSafe(doc.metadata.createdAt)
      if (!pubDate) return null
      return `<item>
          <title>${escapeXml(doc.metadata.title)}</title>
          <link>${SITE_INFO.url}/components/${doc.slug}</link>
          <description>${escapeXml(doc.metadata.description || "")}</description>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .filter(Boolean)
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Components | ${SITE_INFO.name}</title>
      <link>${SITE_INFO.url}/components</link>
      <description>Pixel-perfect, uniquely crafted.</description>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}
