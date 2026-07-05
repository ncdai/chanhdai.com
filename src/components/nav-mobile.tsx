"use client"

import { useCallback, useState } from "react"
import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavItem } from "@/types/nav"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/base/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/ui/popover"
import { haptic } from "@/registry/lib/haptic"

export function NavMobile({ items }: { items: NavItem<Route>[] }) {
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 40rem)") // sm breakpoint

  const pathname = usePathname()

  const handleOpenChange = useCallback((open: boolean) => {
    haptic()
    setOpen(open)
  }, [])

  if (isDesktop) {
    return <NavMobileTrigger />
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverTrigger render={<NavMobileTrigger />} />

      <PopoverContent
        className="w-48 rounded-xl p-1"
        side="top"
        align="center"
        sideOffset={8}
        finalFocus={false}
      >
        <div className="flex flex-col">
          {items.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/" // Home page
                ? ["/", "/index"].includes(pathname || "")
                : pathname?.startsWith(link.href))

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className="rounded-lg px-3 py-1.5 text-base aria-[current=page]:bg-accent"
                onClick={() => handleOpenChange(false)}
              >
                {link.title}
              </Link>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NavMobile

function NavMobileTrigger(
  props: Omit<React.ComponentProps<typeof Button>, "children">
) {
  return (
    <Button
      className="group relative flex touch-manipulation flex-col gap-1 border-none before:absolute before:-inset-x-2 before:-top-8 before:-bottom-1 active:scale-none aria-expanded:bg-accent"
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle Menu"
      {...props}
    >
      <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-aria-expanded:translate-y-0.75 group-aria-expanded:rotate-45" />
      <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-aria-expanded:-translate-y-0.75 group-aria-expanded:-rotate-45" />
    </Button>
  )
}
