"use client"

import { useFilteredPosts } from "../hooks/use-filtered-posts"
import type { Post } from "../types/post"
import { PostList } from "./post-list"

export function PostListWithSearch({ posts }: { posts: Post[] }) {
  const filteredPosts = useFilteredPosts(posts)
  return <PostList posts={filteredPosts} />
}
