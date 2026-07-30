import { compareDesc, format } from "date-fns"

import { SITE_INFO } from "@/config/site"
import { BOOKMARKS } from "@/features/portfolio/data/bookmarks"
import { BookmarkCategory } from "@/features/portfolio/types/bookmarks"

const categorySections = Object.values(BookmarkCategory)
  .map((category) => {
    const items = BOOKMARKS.filter((item) => item.category === category).sort(
      (a, b) => compareDesc(new Date(a.bookmarkedAt), new Date(b.bookmarkedAt))
    )

    return { category, items }
  })
  .filter(({ items }) => items.length > 0)

const content = `# Bookmarks

> Articles, courses, books, references, and tools I keep coming back to.

${BOOKMARKS.length} bookmarks in total, grouped by category and newest first. They are also listed on ${SITE_INFO.url}/#bookmarks.

${categorySections
  .map(
    ({ category, items }) => `## ${category} (${items.length})

${items
  .map(
    (item) =>
      `- [${item.title}](${item.url})${item.author ? ` by ${item.author}` : ""} (${format(new Date(item.bookmarkedAt), "yyyy-MM-dd")})`
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
