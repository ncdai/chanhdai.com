"use client"

import { useRouter } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"

export function PostKeyboardShortcuts({
  previous,
  next,
}: {
  previous: string | null
  next: string | null
}) {
  const router = useRouter()

  const navigate = (
    href: string | null,
    direction: "previous" | "next",
    keys: string
  ) => {
    if (href) {
      trackEvent({
        name: "keyboard_shortcut_navigate",
        properties: { path: href, keys, direction },
      })
      router.push(href)
    }
  }

  useHotkeys("ArrowRight", (event) => {
    // A native interaction was prevented on this event, someone else took ownership of it, ignore.
    if (event.defaultPrevented) {
      return
    }

    navigate(next, "next", "ArrowRight")
  })
  useHotkeys("ArrowLeft", (event) => {
    // A native interaction was prevented on this event, someone else took ownership of it, ignore.
    if (event.defaultPrevented) {
      return
    }

    navigate(previous, "previous", "ArrowLeft")
  })

  return null
}
