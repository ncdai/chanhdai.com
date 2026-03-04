"use client"

import { MailIcon } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"
import { useWebHaptics } from "web-haptics/react"

import { useIsClient } from "@/hooks/use-is-client"
import { trackEvent } from "@/lib/events"
import { CopyButton } from "@/registry/components/copy-button"
import { copyToClipboardWithEvent } from "@/utils/copy"
import { decodeEmail } from "@/utils/string"

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"

type EmailItemProps = {
  email: string
}

export function EmailItem({ email }: EmailItemProps) {
  const isClient = useIsClient()
  const emailDecoded = decodeEmail(email)

  useHotkeys("shift+e", () => {
    copyToClipboardWithEvent(emailDecoded, {
      name: "copy_email",
      properties: {
        method: "keyboard",
        key: "shift+e",
      },
    })
    toast.success("Email copied")
  })

  const { trigger } = useWebHaptics({ debug: true })

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <MailIcon />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={isClient ? `mailto:${emailDecoded}` : "#"}
          aria-label={
            isClient ? `Send email to ${emailDecoded}` : "Email address"
          }
        >
          {isClient ? emailDecoded : "[Email protected]"}
        </IntroItemLink>
      </IntroItemContent>

      <div className="-translate-x-3 translate-y-px opacity-0 transition-opacity ease-out group-hover:opacity-100">
        <CopyButton
          className="text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5"
          variant="ghost"
          size="icon-xs"
          text={isClient ? emailDecoded : "[Email protected]"}
          onCopySuccess={() => {
            trigger("success")
            trackEvent({
              name: "copy_email",
              properties: {
                method: "button",
              },
            })
          }}
          onCopyError={() => trigger("error")}
        />
      </div>
    </IntroItem>
  )
}
