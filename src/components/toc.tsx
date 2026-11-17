// Thanks @fuma-nama
// https://github.com/fuma-nama/fumadocs/blob/dev/packages/core/src/toc.tsx

"use client"

import type { ReactNode } from "react"
import {
  createContext,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react"
import type { TOCItemInfo, TOCItemType } from "fumadocs-core/toc"

const ObserverContext = createContext<Observer | null>(null)

export type AnchorProviderProps = {
  toc: TOCItemType[]
  /**
   * Only accept one active item at most
   *
   * @defaultValue false
   */
  single?: boolean
  /**
   * Options for IntersectionObserver
   */
  options?: IntersectionObserverInit
  children?: ReactNode
}

export function AnchorProvider({
  toc,
  single = false,
  options = { threshold: 0.9 },
  children,
}: AnchorProviderProps) {
  const observer = useMemo(() => new Observer(), [])

  // eslint-disable-next-line react-hooks/immutability
  observer.single = single

  useEffect(() => {
    observer.setItems(toc)
  }, [observer, toc])

  useEffect(() => {
    observer.watch(options)

    return () => observer.unwatch()
  }, [observer, options])

  return <ObserverContext value={observer}>{children}</ObserverContext>
}

function useObserver() {
  const observer = use(ObserverContext)

  if (!observer) {
    throw new Error(
      `Component must be used under the <AnchorProvider /> component.`
    )
  }

  return observer
}

export function useTOCListener(listener: ChangeListener) {
  const observer = useObserver()
  const callback = useEffectEvent(listener)

  useEffect(() => {
    observer.listen(callback)
    return () => observer.unlisten(callback)
  }, [observer])
}

function isEqualShallow(a: unknown, b: unknown): boolean {
  if (a === b) return true

  if (Array.isArray(a) && Array.isArray(b)) {
    return b.length === a.length && a.every((v, i) => isEqualShallow(v, b[i]))
  }

  return false
}

export function useTOCSelector<T>(
  select: (items: TOCItemInfo[]) => T,
  isEqual: (a: T, b: T) => boolean = isEqualShallow
) {
  const observer = useObserver()

  const [value, setValue] = useState<T>(() => select(observer.items))

  useTOCListener((items) => {
    const next = select(items)
    if (!isEqual(value, next)) setValue(next)
  })

  return value
}

/**
 * The estimated active heading ID
 */
export function useActiveAnchor(): string | undefined {
  return useTOCSelector((items) => {
    let out: TOCItemInfo | undefined

    for (const item of items) {
      if (!item.active) continue

      if (!out || item.t > out.t) {
        out = item
      }
    }

    return out?.id
  })
}

export function useItems(): TOCItemInfo[] {
  return useTOCSelector((items) => items)
}

function getItemId(url: string) {
  if (url.startsWith("#")) return url.slice(1)
  return null
}

type ChangeListener = (items: TOCItemInfo[]) => void

class Observer {
  items: TOCItemInfo[] = []
  single = false

  private observer: IntersectionObserver | null = null
  private listeners = new Set<ChangeListener>()

  listen(listener: ChangeListener) {
    this.listeners.add(listener)
  }

  unlisten(listener: ChangeListener) {
    this.listeners.delete(listener)
  }

  setItems(newItems: TOCItemType[]) {
    const observer = this.observer
    if (observer) {
      for (const item of this.items) {
        const element = document.getElementById(item.id)
        if (!element) continue
        observer.unobserve(element)
      }
    }

    const next: TOCItemInfo[] = []

    for (const item of newItems) {
      const id = getItemId(item.url)
      if (!id) continue

      next.push({
        id,
        active: false,
        fallback: false,
        t: 0,
        original: item,
      })
    }

    this.update(next)
    this.observeItems()
  }

  watch(options?: IntersectionObserverInit) {
    if (this.observer) return

    this.observer = new IntersectionObserver(this.callback.bind(this), options)
    this.observeItems()
  }

  unwatch() {
    this.observer?.disconnect()
    this.observer = null
  }

  private callback(entries: IntersectionObserverEntry[]) {
    if (entries.length === 0) return

    let hasActive = false

    const updated = this.items.map((item) => {
      const entry = entries.find((entry) => entry.target.id === item.id)
      let active = entry ? entry.isIntersecting : item.active && !item.fallback
      if (this.single && hasActive) active = false

      if (item.active !== active) {
        item = {
          ...item,
          t: Date.now(),
          active,
          fallback: false,
        }
      }

      if (active) hasActive = true
      return item
    })

    if (!hasActive && entries[0].rootBounds) {
      const viewTop = entries[0].rootBounds.top
      let min = Number.MAX_VALUE
      let fallbackIdx = -1

      for (let i = 0; i < updated.length; i++) {
        const element = document.getElementById(updated[i].id)
        if (!element) continue

        const d = Math.abs(viewTop - element.getBoundingClientRect().top)
        if (d < min) {
          fallbackIdx = i
          min = d
        }
      }

      if (fallbackIdx !== -1) {
        updated[fallbackIdx] = {
          ...updated[fallbackIdx],
          active: true,
          fallback: true,
          t: Date.now(),
        }
      }
    }

    this.update(updated)
  }

  private observeItems() {
    if (!this.observer) return

    for (const item of this.items) {
      const element = document.getElementById(item.id)
      if (!element) continue

      this.observer.observe(element)
    }
  }

  private update(next: TOCItemInfo[]) {
    this.items = next
    for (const listener of this.listeners) listener(next)
  }
}
