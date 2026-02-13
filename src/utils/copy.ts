import type { Event } from "@/lib/events"
import { trackEvent } from "@/lib/events"

export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function copyToClipboardWithEvent(value: string, event?: Event) {
  if (event) {
    trackEvent(event)
  }
  return copyText(value)
}
