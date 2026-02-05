import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"

import type { Post } from "@/features/blog/types/post"
import { cn } from "@/lib/utils"

export function PostItem({
  post,
  shouldPreloadImage,
}: {
  post: Post
  shouldPreloadImage?: boolean
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col gap-2 p-2",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
    >
      {post.metadata.image && (
        <div className="relative select-none [&_img]:aspect-1200/630 [&_img]:rounded-xl">
          <Image
            src={post.metadata.image}
            alt={post.metadata.title}
            width={1200}
            height={630}
            quality={100}
            priority={shouldPreloadImage}
            unoptimized
          />

          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />

          {/* {post.metadata.pinned && (
            <span className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-md bg-secondary">
              <PinIcon className="size-4 rotate-45 text-secondary-foreground" />
              <span className="sr-only">Pinned</span>
            </span>
          )} */}
        </div>
      )}

      <div className="flex flex-col gap-1 p-2">
        <h3 className="text-lg leading-snug font-medium text-balance underline-offset-4 group-hover:underline">
          {post.metadata.title}
          {post.metadata.new && (
            <span className="ml-2 inline-block size-2 -translate-y-px rounded-full bg-info">
              <span className="sr-only">New</span>
            </span>
          )}
        </h3>

        <dl>
          <dt className="sr-only">Published on</dt>
          <dd className="text-sm text-muted-foreground">
            <time dateTime={new Date(post.metadata.createdAt).toISOString()}>
              {format(new Date(post.metadata.createdAt), "dd.MM.yyyy")}
            </time>
          </dd>
        </dl>
      </div>
    </Link>
  )
}
