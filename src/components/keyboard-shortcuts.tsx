"use client"

import { useRouter } from "@bprogress/next/app"
import { useHotkeys } from "react-hotkeys-hook"

export function KeyboardShortcuts() {
  const router = useRouter()

  useHotkeys("g>h", () => router.push("/"))
  useHotkeys("g>c", () => router.push("/components"))
  useHotkeys("g>b", () => router.push("/blocks"))
  useHotkeys("g>l", () => router.push("/blog"))
  useHotkeys("g>s", () => router.push("/sponsors"))
  useHotkeys("g>w", () => router.push("/wall-of-love"))

  return null
}
