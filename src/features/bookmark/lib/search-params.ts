import type { Options } from "nuqs"
import { useQueryStates } from "nuqs"
import { parseAsStringLiteral } from "nuqs/server"

export const BOOKMARK_CATEGORY_PARAMS = [
  "article",
  "course",
  "book",
  "reference",
  "ui-library",
  "software",
] as const

export type BookmarkCategoryParam = (typeof BOOKMARK_CATEGORY_PARAMS)[number]

const bookmarkSearchParams = {
  category: parseAsStringLiteral(BOOKMARK_CATEGORY_PARAMS),
}

export function useBookmarkFilters(options: Options = {}) {
  const [filters, setFilters] = useQueryStates(bookmarkSearchParams, options)

  return [filters, setFilters] as const
}
