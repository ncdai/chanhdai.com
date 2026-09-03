"use client"

import { trackBookmarkClick, type BookmarkClickSurface } from "../lib/analytics"
import { getBookmarkExternalHref } from "../lib/bookmark-link"

export function BookmarkExternalLink({
  url,
  surface,
  onClick,
  ...props
}: Omit<React.ComponentProps<"a">, "href" | "target" | "rel"> & {
  url: string
  surface: BookmarkClickSurface
}) {
  return (
    <a
      href={getBookmarkExternalHref(url)}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      onClick={(event) => {
        onClick?.(event)
        trackBookmarkClick({ url, surface })
      }}
    />
  )
}
