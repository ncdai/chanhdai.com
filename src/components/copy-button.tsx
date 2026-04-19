"use client"

import { useTiks } from "@rexa-developer/tiks/react"
import { useWebHaptics } from "web-haptics/react"

import type { Event } from "@/lib/events"
import { trackEvent } from "@/lib/events"
import type { CopyButtonProps } from "@/registry/components/copy-button"
import { CopyButton as CopyButtonPrimitive } from "@/registry/components/copy-button"

export function CopyButton({
  size = "icon-sm",
  event,
  ...props
}: CopyButtonProps & {
  event?: Event["name"]
}) {
  const { trigger } = useWebHaptics()
  const { success, error } = useTiks()

  return (
    <CopyButtonPrimitive
      variant="secondary"
      size={size}
      onCopySuccess={(copiedValue) => {
        success()
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
      onCopyError={() => {
        error()
        trigger("error")
      }}
      {...props}
    />
  )
}
