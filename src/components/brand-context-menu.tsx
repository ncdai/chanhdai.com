"use client"

import Link from "next/link"
import { copyText } from "@/utils/copy"
import { useTiks } from "@rexa-developer/tiks/react"
import { ArrowUpRight, Download, SquareDashed, Type } from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "@/components/ui/toast"

import { ChanhDaiMark, getMarkSVG } from "./chanhdai-mark"
import { getWordmarkSVG } from "./chanhdai-wordmark"

export function BrandContextMenu({ children }: { children: React.ReactNode }) {
  const { success } = useTiks()

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-fit">
        <ContextMenuItem render={<a href="/" target="_blank" />}>
          <ArrowUpRight />
          Open Link in New Tab
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => {
            copyText(getMarkSVG())
            toast.add({ type: "success", title: "Mark as SVG copied" })
            success()
          }}
        >
          <ChanhDaiMark />
          Copy Mark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            copyText(getWordmarkSVG())
            toast.add({ type: "success", title: "Logotype as SVG copied" })
            success()
          }}
        >
          <Type />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem render={<Link href="/blog/chanhdai-brand" />}>
          <SquareDashed />
          Brand Guidelines
        </ContextMenuItem>

        <ContextMenuItem
          render={
            <a href="https://assets.chanhdai.com/chanhdai-brand.zip" download />
          }
        >
          <Download />
          Download Brand Assets
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default BrandContextMenu
