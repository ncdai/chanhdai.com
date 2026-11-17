"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * Whether a `ChartTooltip` date pill is mounted in a chart. `XAxis` reads it
 * to pick its hover effect: fade the labels the pill covers, or (with no
 * pill) highlight the labels near the crosshair instead.
 */
interface DatePillStore {
  /** Mounted tooltips with an enabled date pill. */
  count: number
  listeners: Set<() => void>
}

// Keyed by chart container: `ChartTooltip` and `XAxis` are siblings with no
// shared provider, but both portal into the same container element.
const stores = new WeakMap<HTMLElement, DatePillStore>()

function getStore(container: HTMLElement): DatePillStore {
  let store = stores.get(container)
  if (!store) {
    store = { count: 0, listeners: new Set() }
    stores.set(container, store)
  }
  return store
}

/** Marks a date pill as present until the returned cleanup runs. */
export function registerDatePill(container: HTMLElement): () => void {
  const store = getStore(container)
  store.count += 1
  for (const listener of store.listeners) {
    listener()
  }
  return () => {
    store.count -= 1
    for (const listener of store.listeners) {
      listener()
    }
  }
}

const noopUnsubscribe = () => undefined
const serverSnapshot = () => false

/** `true` while any `ChartTooltip` in `container` shows a date pill. */
export function useDatePillPresent(container: HTMLElement | null): boolean {
  const subscribe = useCallback(
    (listener: () => void) => {
      if (!container) {
        return noopUnsubscribe
      }
      const store = getStore(container)
      store.listeners.add(listener)
      return () => {
        store.listeners.delete(listener)
      }
    },
    [container]
  )
  const getSnapshot = useCallback(
    () => (container ? getStore(container).count > 0 : false),
    [container]
  )
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot)
}
