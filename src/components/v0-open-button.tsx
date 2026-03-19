import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Icons } from "./icons"

export function OpenInV0Button({
  url,
  className,
  ...props
}: ComponentProps<typeof Button> & { url: string }) {
  return (
    <Button
      className={cn("not-prose border-none px-2", className)}
      variant="ghost"
      size="sm"
      asChild
      {...props}
    >
      <a
        href={`https://v0.app/chat/api/open?url=${url}`}
        target="_blank"
        rel="noopener"
        aria-label="Open in v0"
      >
        <Icons.v0 className="size-5" />
      </a>
    </Button>
  )
}
