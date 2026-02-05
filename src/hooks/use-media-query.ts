import { useSyncExternalStore } from "react"

export function useMediaQuery(query: string) {
  const subscribe = (callback: () => void) => {
    const matchQueryList = matchMedia(query)
    matchQueryList.addEventListener("change", callback)
    return () => {
      matchQueryList.removeEventListener("change", callback)
    }
  }

  const getSnapshot = () => {
    return matchMedia(query).matches
  }

  const getServerSnapshot = () => {
    return false
  }

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
