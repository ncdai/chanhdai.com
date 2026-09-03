import { trackEvent } from "@/lib/events"

export type BookmarkClickSurface = "home" | "list" | "palette"

/** Client-only: OpenPanel is a browser SDK. */
export function trackBookmarkClick(input: {
  /** Canonical bookmark URL, without the render-time utm params. */
  url: string
  surface: BookmarkClickSurface
}) {
  trackEvent({ name: "bookmark_click", properties: input })
}
