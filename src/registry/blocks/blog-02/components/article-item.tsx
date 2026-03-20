import { format } from "date-fns"

import { cn } from "@/lib/utils"

export type ArticleItemProps = {
  url: string
  title: string
  coverUrl: string
  createdAt: string
}

export function ArticleItem({
  url,
  title,
  coverUrl,
  createdAt,
}: ArticleItemProps) {
  return (
    <a
      href={url}
      className={cn(
        "flex flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent/30",
        "max-sm:screen-line-top max-sm:screen-line-bottom",
        "sm:max-md:nth-[2n+1]:screen-line-top sm:max-md:nth-[2n+1]:screen-line-bottom",
        "md:nth-[3n+1]:screen-line-top md:nth-[3n+1]:screen-line-bottom"
      )}
    >
      <div className="relative aspect-video">
        <img
          src={coverUrl}
          alt={title}
          className="size-full rounded-xl object-cover"
        />
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
      </div>

      <div className="flex flex-col gap-2 p-2">
        <h3 className="text-lg leading-tight font-medium text-balance">
          {title}
        </h3>

        <dl>
          <dt className="sr-only">Published on</dt>
          <dd className="text-sm text-muted-foreground">
            <time dateTime={new Date(createdAt).toISOString()}>
              {format(new Date(createdAt), "MMMM d, yyyy")}
            </time>
          </dd>
        </dl>
      </div>
    </a>
  )
}
