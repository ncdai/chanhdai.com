"use client"

import { useEffect, useState } from "react"

import { Nav } from "@/components/nav"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { NavItem } from "@/types/nav"

export function NavScrollspy({
  items,
  className,
}: {
  items: NavItem[]
  className?: string
}) {
  const shouldObserve = useMediaQuery("(min-width: 48rem)") // 768px
  const itemIds = items.map((link) => link.href?.split("#")[1]).filter(Boolean)
  const activeItemId = useActiveItem(itemIds, shouldObserve)

  return (
    <Nav className={className} items={items} activeId={`#${activeItemId}`} />
  )
}

function useActiveItem(itemIds: string[], enabled = true) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: `0% 0% -80% 0%` }
    )

    itemIds?.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [itemIds, enabled])

  return activeId
}
