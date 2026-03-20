import type { Doc } from "@/features/doc/types/document"

import { PostItem } from "./post-item"

export function PostList({ posts }: { posts: Doc[] }) {
  return (
    <div className="relative pt-4">
      <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
        <div className="border-r border-line" />
        <div className="border-l border-line" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post, index) => (
          <PostItem
            key={post.slug}
            post={post}
            shouldPreloadImage={index <= 4}
          />
        ))}

        {posts.length === 0 && (
          <div className="screen-line-top screen-line-bottom p-4">
            <p className="font-mono text-sm">No posts found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
