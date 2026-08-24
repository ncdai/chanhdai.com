"use client"

import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// getOnInit makes the first client render match the value the blocking
// script in the root layout already applied to <html> before first paint.
const sidebarOpenAtom = atomWithStorage<boolean>(
  "sidebarOpen",
  true,
  undefined,
  {
    getOnInit: true,
  }
)

export function useSidebarOpen() {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom)

  const toggleSidebar = () => {
    const nextOpen = !isOpen
    document.documentElement.dataset.sidebarOpen = String(nextOpen)
    setIsOpen(nextOpen)
  }

  return { isOpen, toggleSidebar }
}
