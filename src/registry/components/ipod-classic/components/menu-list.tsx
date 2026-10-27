"use client"

import { useLayoutEffect, useRef } from "react"
import { useAtomValue } from "jotai"

import styles from "../ipod-classic.module.css"
import { settingsAtom } from "../lib/atoms"
import { settingValue, type MenuItem } from "../lib/menu"

/** Scrolls only the list, never the page, to show the row. */
function revealRow(list: HTMLElement, row: HTMLElement) {
  const top = row.offsetTop
  const bottom = top + row.offsetHeight
  if (top < list.scrollTop) list.scrollTop = top
  else if (bottom > list.scrollTop + list.clientHeight) {
    list.scrollTop = bottom - list.clientHeight
  }
}

export function MenuList({
  items,
  selectedIndex,
  idPrefix,
  labelledBy,
  shouldFocus,
  restoredScrollTop,
  listRef,
}: {
  items: MenuItem[]
  selectedIndex: number
  idPrefix: string
  labelledBy: string
  shouldFocus: boolean
  restoredScrollTop: number | undefined
  /** Returns a cleanup, so an outgoing list cannot unregister the new one. */
  listRef: (element: HTMLUListElement) => () => void
}) {
  const ref = useRef<HTMLUListElement>(null)
  const settings = useAtomValue(settingsAtom)

  // Mount only: restore where the list was left, or reveal the selection.
  useLayoutEffect(() => {
    const list = ref.current
    if (!list) return
    if (restoredScrollTop !== undefined) list.scrollTop = restoredScrollTop
    if (shouldFocus) list.focus({ preventScroll: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const list = ref.current
    const row = list?.children[selectedIndex]
    if (list && row instanceof HTMLElement) revealRow(list, row)
  }, [selectedIndex, items.length])

  return (
    <ul
      ref={(element) => {
        if (!element) return
        ref.current = element
        return listRef(element)
      }}
      className={styles.menuItems}
      role="listbox"
      tabIndex={0}
      aria-activedescendant={`${idPrefix}-${selectedIndex}`}
      aria-labelledby={labelledBy}
    >
      {items.map((item, index) => {
        const isInfo = item.action === "info"
        const isSelected = index === selectedIndex
        const value = settingValue(item, settings)
        return (
          <li
            key={item.id}
            id={`${idPrefix}-${index}`}
            className={styles.menuItem}
            data-action={item.action}
            data-selected={isSelected || undefined}
            data-centered={(isInfo && item.centered) || undefined}
            role={isInfo ? undefined : "option"}
            aria-selected={isInfo ? undefined : isSelected}
          >
            <span className={styles.itemTitle} dir="auto">
              {item.title}
            </span>
            {value !== undefined && (
              <span className={styles.itemValue} dir="auto">
                {value}
              </span>
            )}
            {item.action === "navigate" && (
              <span className={styles.chevron} aria-hidden />
            )}
          </li>
        )
      })}
    </ul>
  )
}
