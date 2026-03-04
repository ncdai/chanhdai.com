"use client"

import { useWebHaptics } from "web-haptics/react"

import type { Event } from "@/lib/events"
import { trackEvent } from "@/lib/events"
import type { CopyButtonProps } from "@/registry/components/copy-button"
import { CopyButton as CopyButtonPrimitive } from "@/registry/components/copy-button"

export function CopyButton({
  size = "icon-xs",
  event,
  ...props
}: CopyButtonProps & {
  event?: Event["name"]
}) {
  const { trigger } = useWebHaptics({ debug: true })

  return (
    <CopyButtonPrimitive
      variant="secondary"
      size={size}
      onCopySuccess={(copiedValue) => {
        trigger("success")
        if (event) {
          trackEvent({
            name: event,
            properties: {
              code: copiedValue,
            },
          })
        }
      }}
      onCopyError={() => trigger("error")}
      {...props}
    />
  )
}
