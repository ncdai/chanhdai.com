"use client"

import { useRouter } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"

export function PostKeyboardShortcuts({
  previous,
  next,
}: {
  previous: string | null
  next: string | null
}) {
  const router = useRouter()

  const navigate = (href: string | null) => {
    if (href) {
      router.push(href)
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
