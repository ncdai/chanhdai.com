"use client"

import { usePathname } from "next/navigation"

import { Nav } from "@/components/nav"
import { registryCategories } from "@/config/registry"
import type { NavItem } from "@/types/nav"

const NAV_ITEMS: NavItem[] = [
  {
    href: "/blocks",
    title: "Featured",
  },
  ...registryCategories.map((category) => ({
    href: `/blocks/${category.slug}`,
    title: category.name,
  })),
]

export function BlocksNav() {
  const pathname = usePathname()
  return <Nav items={NAV_ITEMS} activeId={pathname} exactMatch />
}
