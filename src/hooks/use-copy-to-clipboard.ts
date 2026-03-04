"use client"

import { useCallback, useRef, useState } from "react"

export type CopyState = "idle" | "done" | "error"

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
  const [state, setState] = useState<CopyState>("idle")
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(
    async (text: string | (() => string)) => {
      // Clear any pending reset
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }

      try {
        const finalText = typeof text === "function" ? text() : text
        await navigator.clipboard.writeText(finalText)
        setState("done")
        onCopySuccess?.(finalText)
      } catch (error) {
        setState("error")
        onCopyError?.(error instanceof Error ? error : new Error("Copy failed"))
      } finally {
        // Schedule reset to idle
        resetTimeoutRef.current = setTimeout(() => {
          setState("idle")
        }, resetDelay)
      }
    },
    [onCopyError, onCopySuccess, resetDelay]
  )

  return { state, copy } as const
}
