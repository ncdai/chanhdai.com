import { cn } from "@/lib/utils"

import type { BookmarkClickSurface } from "../lib/analytics"
import { getBookmarkSize } from "../lib/size"
import type { Bookmark, BookmarkSize } from "../types"
import { BookmarkExternalLink } from "./bookmark-external-link"

const SIZE_CLASSES: Record<BookmarkSize, string> = {
  sm: "h-40 w-28",
  md: "h-45 w-32",
  lg: "h-51 w-36",
}

export function BookmarkBook({
  bookmark,
  surface,
}: {
  bookmark: Bookmark
  surface: BookmarkClickSurface
}) {
  return (
    <BookmarkExternalLink
      url={bookmark.url}
      surface={surface}
      className={cn(
        "group relative block focus-visible:z-2",
        SIZE_CLASSES[getBookmarkSize(bookmark)]
      )}
    >
      <span className="relative flex size-full flex-col justify-between gap-3 border border-muted-foreground bg-background p-3 transition-transform duration-200 ease-out group-hover:-translate-y-1 before:absolute before:inset-y-0 before:left-1 before:w-px before:bg-border motion-reduce:transition-none">
        <span className="font-serif text-sm/tight text-balance hyphens-auto">
          {bookmark.title}
        </span>

        {bookmark.author && (
          <span className="text-xs text-pretty text-muted-foreground">
            {bookmark.author}
          </span>
        )}
      </span>
    </BookmarkExternalLink>
  )
}
