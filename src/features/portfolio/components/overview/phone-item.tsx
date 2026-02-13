"use client"

import { PhoneIcon } from "lucide-react"
import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"

import { useIsClient } from "@/hooks/use-is-client"
import { CopyButton } from "@/registry/components/copy-button"
import { copyToClipboardWithEvent } from "@/utils/copy"
import { decodePhoneNumber, formatPhoneNumber } from "@/utils/string"

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"

type PhoneItemProps = {
  phoneNumber: string
}

export function PhoneItem({ phoneNumber }: PhoneItemProps) {
  const isClient = useIsClient()
  const phoneNumberDecoded = decodePhoneNumber(phoneNumber)
  const phoneNumberFormatted = formatPhoneNumber(phoneNumberDecoded)

  useHotkeys("shift+p", () => {
    copyToClipboardWithEvent(phoneNumberDecoded, {
      name: "copy_phone_number",
      properties: {
        method: "keyboard",
        key: "shift+p",
      },
    })
    toast.success("Phone number copied")
  })

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <PhoneIcon />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={isClient ? `tel:${phoneNumberDecoded}` : "#"}
          aria-label={
            isClient ? `Call ${phoneNumberFormatted}` : "Phone number"
          }
        >
          {isClient ? phoneNumberFormatted : "[Phone protected]"}
        </IntroItemLink>
      </IntroItemContent>

      <div className="-translate-x-2 translate-y-px opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton
          className="text-muted-foreground"
          variant="ghost"
          size="icon-xs"
          text={isClient ? phoneNumberDecoded : "[Phone protected]"}
        />
      </div>
    </IntroItem>
  )
}
