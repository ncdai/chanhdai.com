"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { NavItem } from "@/types/nav"

export function MobileNavV2({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 40rem)") // sm breakpoint

  const toggleMenuButton = (
    <Button
      className="group flex touch-manipulation flex-col gap-1 sm:hidden data-open:bg-accent"
      variant="ghost"
      size="icon"
    >
      <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]:translate-y-0.75 group-data-[state=open]:rotate-45" />
      <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]:-translate-y-0.75 group-data-[state=open]:-rotate-45" />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  )

  if (isDesktop) {
    return toggleMenuButton
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{toggleMenuButton}</PopoverTrigger>

      <PopoverContent
        className="h-(--radix-popper-available-height) w-(--radix-popper-available-width) rounded-none bg-background px-2 py-0 shadow-none ring-0 data-open:animate-none"
        sideOffset={8}
      >
        <div className="flex h-full flex-col items-center justify-center gap-4 border-x border-edge mask-b-from-80% mask-b-to-100% px-2 py-6">
          {items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl font-medium"
              onClick={() => setOpen(false)}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
