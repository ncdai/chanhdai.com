"use client"

import { useOptimistic, useTransition } from "react"

export type CopyState = "idle" | "copied" | "failed"

export type UseCopyToClipboardOptions = {
  onCopySuccess?: (text: string) => void
  onCopyError?: (error: Error) => void
  resetDelay?: number
}

export function useCopyToClipboard({
  onCopySuccess,
  onCopyError,
  resetDelay = 1500,
}: UseCopyToClipboardOptions = {}) {
  const [state, setState] = useOptimistic<CopyState>("idle")
  const [, startTransition] = useTransition()

  const copy = (text: string | (() => string)) => {
    startTransition(async () => {
      try {
        setState("copied")
        const finalText = typeof text === "function" ? text() : text
        await navigator.clipboard.writeText(finalText)
        onCopySuccess?.(finalText)
      } catch (error) {
        setState("failed")
        onCopyError?.(error instanceof Error ? error : new Error("Copy failed"))
      }
      await new Promise((resolve) => setTimeout(resolve, resetDelay))
    })
  }

  return { state, copy } as const
}
