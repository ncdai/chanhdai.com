import { format } from "date-fns"
import { ArrowUpRightIcon, BookmarkIcon } from "lucide-react"

import { getIcon } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { UTM_PARAMS } from "@/config/site"
import type { Bookmark } from "@/features/portfolio/types/bookmarks"
import { cn } from "@/lib/utils"
import { addQueryParams } from "@/utils/url"

export function BookmarkItem({
  className,
  bookmark,
}: {
  className?: string
  bookmark: Bookmark
}) {
  return (
    <a
      className={cn(
        "group flex items-center pr-2 hover:bg-accent-muted",
        className
      )}
      href={addQueryParams(bookmark.url, UTM_PARAMS)}
      target="_blank"
      rel="noopener"
    >
      <div
        className={cn(
          "mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg select-none",
          "border border-muted-foreground/15 ring-1 ring-edge ring-offset-1 ring-offset-background",
          "bg-muted text-muted-foreground [&_svg]:size-4"
        )}
        aria-hidden
      >
        {getIcon(bookmark.iconName) ?? <BookmarkIcon />}
      </div>

      <div className="flex-1 space-y-1 border-l border-dashed border-edge p-4 pr-2">
        <h3 className="leading-snug font-medium text-balance underline-offset-4 group-hover:underline">
          {bookmark.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {bookmark.author && (
            <>
              <dl>
                <dt className="sr-only">Author</dt>
                <dd>{bookmark.author}</dd>
              </dl>

              <Separator
                className="data-[orientation=vertical]:h-4"
                orientation="vertical"
              />
            </>
          )}

          <dl>
            <dt className="sr-only">Bookmarked on</dt>
            <dd>
              <time dateTime={new Date(bookmark.bookmarkedAt).toISOString()}>
                {format(new Date(bookmark.bookmarkedAt), "dd.MM.yyyy")}
              </time>
            </dd>
          </dl>
        </div>
      </div>

      <ArrowUpRightIcon
        className="size-4 text-muted-foreground transition-[rotate] duration-300 group-hover:rotate-45"
        aria-hidden
      />
    </a>
  )
}
