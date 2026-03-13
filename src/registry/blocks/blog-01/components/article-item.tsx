import { format } from "date-fns"

export type ArticleItemProps = {
  title: string
  coverUrl: string
  createdAt: string
}

export function ArticleItem({ title, coverUrl, createdAt }: ArticleItemProps) {
  return (
    <article className="h-full rounded-2xl bg-card text-card-foreground shadow-xs ring-1 ring-foreground/10 dark:ring-border">
      <div className="p-1 pb-0">
        <div className="relative aspect-video">
          <img
            className="size-full rounded-xl object-cover"
            src={coverUrl}
            alt={title}
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/15" />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pt-4 pb-6">
        <time
          className="block text-sm text-muted-foreground"
          dateTime={new Date(createdAt).toISOString()}
        >
          {format(new Date(createdAt), "MMMM d, yyyy")}
        </time>

        <h3 className="text-lg leading-tight font-medium text-balance">
          {title}
        </h3>
      </div>
    </article>
  )
}
