import type React from "react"
import { useEffect, useMemo, useState } from "react"

export function useIsInViewport(ref: React.RefObject<HTMLElement | null>) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  const observer = useMemo(
    () =>
      typeof window !== "undefined"
        ? new IntersectionObserver(([entry]) =>
            setIsIntersecting(entry.isIntersecting)
          )
        : null,
    []
  )

  useEffect(() => {
    if (!ref.current || !observer) {
      return
    }

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, observer])

  return isIntersecting
}
