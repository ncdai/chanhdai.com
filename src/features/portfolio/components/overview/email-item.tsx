"use client"

import { MailIcon } from "lucide-react"

import { useIsClient } from "@/hooks/use-is-client"
import { CopyButton } from "@/registry/components/copy-button"
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

      <div className="-translate-x-2 translate-y-px opacity-0 transition-opacity group-hover:opacity-100">
        <CopyButton
          className="text-muted-foreground"
          variant="ghost"
          size="icon-xs"
          text={isClient ? emailDecoded : "[Email protected]"}
        />
      </div>
    </IntroItem>
  )
}
