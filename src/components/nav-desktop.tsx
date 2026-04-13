"use client"

import { usePathname } from "next/navigation"

import { Nav } from "@/components/nav"
import type { NavItem } from "@/types/nav"

export function NavDesktop({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return <Nav className="max-sm:hidden" items={items} activeId={pathname} />
}
