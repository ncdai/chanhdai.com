"use client"

import { useEffect, useRef } from "react"

export function DocPageRoot({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const docTitle = container.querySelector<HTMLElement>(
      '[data-slot="doc-title"]'
    )

    const update = () => {
      if (!docTitle) {
        document.documentElement.style.removeProperty("--doc-cols-top")
        container.removeAttribute("data-doc-cols-ready")
        return
      }
      const bottom = docTitle.getBoundingClientRect().bottom + window.scrollY
      document.documentElement.style.setProperty(
        "--doc-cols-top",
        `${bottom}px`
      )
      container.setAttribute("data-doc-cols-ready", "")
    }

    update()

    return () => {
      document.documentElement.style.removeProperty("--doc-cols-top")
      container.removeAttribute("data-doc-cols-ready")
    }
  }, [])

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
}
