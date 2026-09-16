"use client"

import { useTiks } from "@rexa-developer/tiks/react"
import { DownloadIcon, SquareDashedIcon, TypeIcon } from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "@/components/ui/toast"

export type BrandAssetsMenuProps = {
  logomark: React.ReactElement
  logomarkSVG: string
  logotypeSVG: string
  brandGuidelinesURL: string
  brandAssetsURL: string
  children: React.ReactElement
}

export function BrandAssetsMenu({
  logomark,
  logomarkSVG,
  logotypeSVG,
  brandGuidelinesURL,
  brandAssetsURL,
  children,
}: BrandAssetsMenuProps) {
  const { success } = useTiks()

  return (
    <ContextMenu>
      <ContextMenuTrigger render={children} />

      <ContextMenuContent className="w-fit">
        <ContextMenuItem
          onClick={() => {
            copyText(logomarkSVG)
            toast.add({ type: "success", title: "Logomark as SVG copied" })
            success()
          }}
        >
          {logomark}
          Copy Logomark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            copyText(logotypeSVG)
            toast.add({ type: "success", title: "Logotype as SVG copied" })
            success()
          }}
        >
          <TypeIcon />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          render={
            <a
              href={brandGuidelinesURL}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <SquareDashedIcon />
          Brand Guidelines
        </ContextMenuItem>

        <ContextMenuItem
          render={
            <a
              href={brandAssetsURL}
              target="_blank"
              rel="noopener noreferrer"
              download
            />
          }
        >
          <DownloadIcon />
          Download Brand Assets
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
