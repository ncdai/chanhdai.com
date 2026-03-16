"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { haptic } from "@/registry/lib/haptic"
import type { NavItem } from "@/types/nav"

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 40rem)") // sm breakpoint

  const pathname = usePathname()

  const handleOpenChange = useCallback((open: boolean) => {
    haptic()
    setOpen(open)
  }, [])

  if (isDesktop) {
    return <MobileNavTrigger />
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverTrigger asChild>
        <MobileNavTrigger />
      </PopoverTrigger>

      <PopoverContent
        className="w-48 rounded-xl p-1"
        side="top"
        align="center"
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
          {items.map((link) => {
            const active =
              pathname === link.href ||
              (link.href === "/" // Home page
                ? ["/", "/index"].includes(pathname || "")
                : pathname?.startsWith(link.href))

            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-base data-active:bg-accent",
                  link.className
                )}
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

function MobileNavTrigger(
  props: Omit<React.ComponentProps<typeof Button>, "children">
) {
  return (
    <Button
      className="group extend-touch-target flex flex-col gap-1 border-none data-open:bg-accent"
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle Menu"
      {...props}
    >
      <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]:translate-y-0.75 group-data-[state=open]:rotate-45" />
      <span className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]:-translate-y-0.75 group-data-[state=open]:-rotate-45" />
    </Button>
  )
}
