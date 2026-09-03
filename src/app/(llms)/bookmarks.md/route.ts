import { format } from "date-fns"

import { SITE_INFO } from "@/config/site"
import { BOOKMARKS } from "@/features/bookmark/data"
import { sortBookmarksNewestFirst } from "@/features/bookmark/lib/sort"
import { BookmarkCategory } from "@/features/bookmark/types"

const categorySections = Object.values(BookmarkCategory)
  .map((category) => {
    const items = sortBookmarksNewestFirst(
      BOOKMARKS.filter((item) => item.category === category)
    )

    return { category, items }
  })
  .filter(({ items }) => items.length > 0)

const content = `# Bookmarks

> Hand-picked articles, courses, books, references, and tools worth your time.

${BOOKMARKS.length} bookmarks in total, grouped by category and newest first. They are also listed on ${SITE_INFO.url}/bookmarks, filterable by category.

${categorySections
  .map(
    ({ category, items }) => `## ${category} (${items.length})

${items
  .map(
    (item) =>
      `- [${item.title}](${item.url})${item.author ? ` by ${item.author}` : ""} (${format(new Date(item.bookmarkedAt), "yyyy-MM-dd")})${item.why ? `\n  ${item.why}` : ""}`
  )
  .join("\n")}`
  )
  .join("\n\n")}
`

export const revalidate = false
export const dynamic = "force-static"

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  })
}
