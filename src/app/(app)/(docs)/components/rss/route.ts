import { SITE_INFO } from "@/config/site"
import { getPostsByCategory } from "@/features/blog/data/posts"

export const dynamic = "force-static"

export function GET() {
  const allPosts = getPostsByCategory("components")

  const itemsXml = allPosts
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title}</title>
          <link>${SITE_INFO.url}/components/${post.slug}</link>
          <description>${post.metadata.description || ""}</description>
          <pubDate>${new Date(post.metadata.createdAt).toISOString()}</pubDate>
        </item>`
    )
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Components | ${SITE_INFO.name}</title>
      <link>${SITE_INFO.url}</link>
      <description>A collection of reusable components.</description>
      ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  })
}
