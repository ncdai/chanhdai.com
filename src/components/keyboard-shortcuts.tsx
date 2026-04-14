"use client"

import { useRouter } from "@bprogress/next/app"
import { useHotkeys } from "react-hotkeys-hook"

import { trackEvent } from "@/lib/events"

export function KeyboardShortcuts() {
  const router = useRouter()

  const navigate = (path: string, keys: string) => {
    trackEvent({
      name: "keyboard_shortcut_navigate",
      properties: { path, keys },
    })
    router.push(path)
  }

  useHotkeys("g>h", () => navigate("/", "g>h"))
  useHotkeys("g>c", () => navigate("/components", "g>c"))
  useHotkeys("g>b", () => navigate("/blocks", "g>b"))
  useHotkeys("g>l", () => navigate("/blog", "g>l"))
  useHotkeys("g>s", () => navigate("/sponsors", "g>s"))
  useHotkeys("g>t", () => navigate("/testimonials", "g>t"))

  return null
}
