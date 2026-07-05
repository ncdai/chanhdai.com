import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/base/ui/button"

import { V0Icon } from "./icons"

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
      nativeButton={false}
      render={
        <a
          href={`https://v0.app/chat/api/open?url=${url}`}
          target="_blank"
          rel="noopener"
          aria-label="Open in v0"
        >
          <V0Icon className="size-5" />
        </a>
      }
      {...props}
    />
  )
}
