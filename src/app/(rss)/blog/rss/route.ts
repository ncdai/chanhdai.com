import { escapeXml, toISODateSafe } from "@/utils/string"

import { SITE_INFO } from "@/config/site"
import { getBlogPosts } from "@/features/doc/data/documents"

export const revalidate = false
export const dynamic = "force-static"

export function GET() {
  const itemsXml = getBlogPosts()
    .map((doc) => {
      const pubDate = toISODateSafe(doc.metadata.createdAt)
      if (!pubDate) return null
      return `<item>
          <title>${escapeXml(doc.metadata.title)}</title>
          <link>${SITE_INFO.url}/blog/${doc.slug}</link>
          <description>${escapeXml(doc.metadata.description || "")}</description>
          <pubDate>${pubDate}</pubDate>
        </item>`
    })
    .filter(Boolean)
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Blog | ${SITE_INFO.name}</title>
      <link>${SITE_INFO.url}/blog</link>
      <description>Writing about code, design, and everything in between.</description>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}
