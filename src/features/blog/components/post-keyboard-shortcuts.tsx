"use client"

import { useRouter } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"

import type { Post } from "@/features/blog/types/post"

export function PostKeyboardShortcuts({
  basePath,
  previous,
  next,
}: {
  basePath: string
  previous: Post | null
  next: Post | null
}) {
  const router = useRouter()

  const navigate = (post: Post | null) => {
    if (post) {
      router.push(`${basePath}/${post.slug}`)
    }
  }

  useHotkeys("ArrowRight", (event) => {
    // A native interaction was prevented on this event, someone else took ownership of it, ignore.
    if (event.defaultPrevented) {
      return
    }

    navigate(next)
  })
  useHotkeys("ArrowLeft", (event) => {
    // A native interaction was prevented on this event, someone else took ownership of it, ignore.
    if (event.defaultPrevented) {
      return
    }

    navigate(previous)
  })

  return null
}
