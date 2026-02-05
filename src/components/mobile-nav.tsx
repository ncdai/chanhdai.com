"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { NavItem } from "@/types/nav"

export function MobileNav({ items }: { items: NavItem[] }) {
  const isDesktop = useMediaQuery("(min-width: 40rem)") // sm breakpoint

  const toggleMenuButton = (
    <Button
      className="group flex flex-col gap-1 data-[state=open]:bg-accent sm:hidden"
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{toggleMenuButton}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end" sideOffset={8}>
        {items.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href}>{link.title}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
