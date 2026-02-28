"use client"

import { useRouter } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"

import type { Doc } from "@/features/doc/types/document"

export function PostKeyboardShortcuts({
  basePath,
  previous,
  next,
}: {
  basePath: string
  previous: Doc | null
  next: Doc | null
}) {
  const router = useRouter()

  const navigate = (post: Doc | null) => {
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
