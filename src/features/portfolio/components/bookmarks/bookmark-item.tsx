import { format } from "date-fns";
import { ArrowUpRightIcon } from "lucide-react";

import { Icons } from "@/components/icons";
import type { Bookmark } from "@/features/portfolio/types/bookmarks";
import { cn } from "@/lib/utils";

export function BookmarkItem({
  className,
  bookmark,
}: {
  className?: string;
  bookmark: Bookmark;
}) {
  return (
    <a
      className={cn(
        "group/bookmark flex items-center pr-2 hover:bg-accent2",
        className
      )}
      href={bookmark.url}
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
        <Icons.bookmarks />
      </div>

      <div className="flex-1 space-y-1 border-l border-dashed border-edge p-4 pr-2">
        <h3 className="leading-snug font-medium text-balance underline-offset-4 group-hover/bookmark:underline">
          {bookmark.title}
        </h3>

        <div className="text-sm text-muted-foreground">
          <dl>
            <dt className="sr-only">Created on</dt>
            <dd>
              <time dateTime={new Date(bookmark.createdAt).toISOString()}>
                {format(new Date(bookmark.createdAt), "dd.MM.yyyy")}
              </time>
            </dd>
          </dl>
        </div>
      </div>

      <ArrowUpRightIcon className="size-4 text-muted-foreground" aria-hidden />
    </a>
  );
}
