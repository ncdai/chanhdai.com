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

    const update = () => {
      const docTitle = container.querySelector<HTMLElement>(
        '[data-slot="doc-title"]'
      )
      if (!docTitle) {
        document.documentElement.style.removeProperty("--doc-cols-top")
        container.removeAttribute("data-doc-cols-ready")
        return
      }
      const bottom = docTitle.getBoundingClientRect().bottom + window.scrollY
      if (!isFinite(bottom)) {
        document.documentElement.style.removeProperty("--doc-cols-top")
        container.removeAttribute("data-doc-cols-ready")
        return
      }
      document.documentElement.style.setProperty(
        "--doc-cols-top",
        `${bottom}px`
      )
      container.setAttribute("data-doc-cols-ready", "")
    }

    update()

    const docTitle = container.querySelector('[data-slot="doc-title"]')
    const resizeObserver = new ResizeObserver(update)
    if (docTitle) resizeObserver.observe(docTitle)
    window.addEventListener("resize", update)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", update)
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
