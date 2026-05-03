"use client"

import { useMotionValueEvent, useScroll } from "motion/react"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { ChanhDaiMark } from "./chanhdai-mark"

const calcDistance = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  const scrollTop = document.documentElement.scrollTop
  const headerHeight = 56
  return scrollTop + rect.top + rect.height - headerHeight
}

function ChanhDaiMarkMotion() {
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)
  const distanceRef = useRef(160)

  useMotionValueEvent(scrollY, "change", (latestValue) => {
    setVisible(latestValue >= distanceRef.current)
  })

  useEffect(() => {
    const coverMark = document.getElementById("js-cover-mark")
    if (!coverMark) return

    distanceRef.current = calcDistance(coverMark)

    const resizeObserver = new ResizeObserver(() => {
      distanceRef.current = calcDistance(coverMark)
    })
    resizeObserver.observe(coverMark)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div data-visible={visible} className="group/mark-motion flex">
      <ChanhDaiMark className="-translate-y-1 opacity-0 transition-[opacity,translate] duration-300 group-data-[visible=true]/mark-motion:translate-y-0 group-data-[visible=true]/mark-motion:opacity-100" />
    </div>
  )
}

export function SiteHeaderMark() {
  const pathname = usePathname()
  const isHome = ["/", "/index"].includes(pathname)
  return isHome ? <ChanhDaiMarkMotion /> : <ChanhDaiMark />
}
