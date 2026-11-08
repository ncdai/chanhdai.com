import { cn } from "@/lib/utils"
import type { Doc } from "@/features/doc/types/document"

import { PostItem } from "./post-item"

export function PostList({ posts }: { posts: Doc[] }) {
  return (
    <div className="relative -mx-px pt-4">
      <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
        <div className="border-r border-line" />
        <div className="border-l border-line" />
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post, index) => (
          <li
            key={post.slug}
            className={cn(
              "max-sm:screen-line-top max-sm:screen-line-bottom",
              "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom"
            )}
          >
            <PostItem
              post={post}
              imageLoading={index <= 3 ? "eager" : "lazy"}
            />
          </li>
        ))}

        {posts.length === 0 && (
          <li className="screen-line-top screen-line-bottom p-4">
            <p className="font-mono text-sm">No posts found.</p>
          </li>
        )}
      </ul>
    </div>
  )
}
