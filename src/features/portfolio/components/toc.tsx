"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { TOCMinimap } from "@/components/toc-minimap"

export function TOC() {
  const isDesktop = useMediaQuery("(min-width: 64rem)") // xl breakpoint

  if (!isDesktop) {
    return null
  }

  return (
    <div className="fixed top-[calc(var(--header-height)+var(--cover-height)+(--spacing(3))+1px)] right-0 z-50">
      <TOCMinimap
        className="transition-opacity duration-200 data-[active-anchor=components]:opacity-30"
        items={[
          { title: "Hello", url: "#hello", depth: 2 },
          { title: "Components", url: "#components", depth: 2 },
          { title: "Blog", url: "#blog", depth: 2 },
          { title: "Sponsors", url: "#sponsors", depth: 2 },
          { title: "Experience", url: "#experience", depth: 2 },
          { title: "Projects", url: "#projects", depth: 2 },
          { title: "Awards", url: "#awards", depth: 2 },
          { title: "Certifications", url: "#certs", depth: 2 },
          { title: "Intellectual property", url: "#ip", depth: 2 },
          { title: "Bookmarks", url: "#bookmarks", depth: 2 },
          { title: "Insights", url: "#insights", depth: 2 },
        ]}
        options={{
          threshold: 0,
          rootMargin: "-20% 0% -60% 0%",
        }}
      />
    </div>
  )
}

export default TOC
