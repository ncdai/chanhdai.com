"use client"

import { useId, type CSSProperties, type RefObject } from "react"
import { useAtomValue } from "jotai"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import styles from "../ipod-classic.module.css"
import { SAD_IPOD } from "../lib/assets"
import {
  isInertAtom,
  itemsAtom,
  navigationAtom,
  statusAtom,
  viewAtom,
} from "../lib/atoms"
import { BrickGame } from "./brick-game"
import { AppleLogo } from "./icons"
import { MenuList } from "./menu-list"
import { NowPlaying } from "./now-playing"
import { TitleBar } from "./title-bar"
import { useScreenKeyboard } from "./use-screen-keyboard"

const OFFLINE_MESSAGE = "You are not connected to the internet"

const slide = {
  enter: (back: boolean) => ({ x: back ? "-100%" : "100%" }),
  center: { x: 0 },
  exit: (back: boolean) => ({ x: back ? "100%" : "-100%" }),
}
const EASE_IN_OUT_SINE = [0.37, 0, 0.63, 1] as const

export function Screen({
  menuRef,
  registerList,
}: {
  menuRef: RefObject<HTMLDivElement | null>
  registerList: (element: HTMLUListElement) => () => void
}) {
  const status = useAtomValue(statusAtom)
  const isInert = useAtomValue(isInertAtom)
  const titleId = useId()

  return (
    <div className={styles.screen}>
      <p className={styles.visuallyHidden} role="status">
        {status.isOnline
          ? status.isBooting
            ? "Loading"
            : "Ready"
          : OFFLINE_MESSAGE}
      </p>

      {!status.isOnline ? (
        <OfflineOverlay />
      ) : (
        status.isBooting && (
          <div className={styles.overlay} aria-hidden>
            <AppleLogo className={styles.bootLogo} />
          </div>
        )
      )}

      <div className={styles.menuLayer} data-hidden={isInert || undefined}>
        <div ref={menuRef} className={styles.menu}>
          <TitleBar id={titleId} />
          <ScreenPages titleId={titleId} registerList={registerList} />
        </div>
      </div>
    </div>
  )
}

function OfflineOverlay() {
  return (
    <div className={styles.overlay} aria-hidden>
      <div className={styles.sadIpod}>
        <div
          className={styles.sadIpodIcon}
          style={{ "--mask": `url(${SAD_IPOD})` } as CSSProperties}
        />
        <p className={styles.errorMessage}>{OFFLINE_MESSAGE}</p>
      </div>
    </div>
  )
}

/** Each push or pop slides a new page in; the old one keeps its content. */
function ScreenPages({
  titleId,
  registerList,
}: {
  titleId: string
  registerList: (element: HTMLUListElement) => () => void
}) {
  const navigation = useAtomValue(navigationAtom)
  const view = useAtomValue(viewAtom)
  const items = useAtomValue(itemsAtom)
  const reduceMotion = useReducedMotion()
  const keyboard = useScreenKeyboard()

  return (
    <div className={styles.screenBody} {...keyboard}>
      <AnimatePresence initial={false} custom={navigation.back}>
        <motion.div
          key={navigation.navigationId}
          className={styles.screenPage}
          custom={navigation.back}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.24, ease: EASE_IN_OUT_SINE }
          }
        >
          {view === "list" && (
            <MenuList
              items={items}
              selectedIndex={navigation.selectedIndex}
              idPrefix={`${titleId}-${navigation.navigationId}`}
              labelledBy={titleId}
              shouldFocus={navigation.shouldFocus}
              restoredScrollTop={navigation.restoredScrollTop}
              listRef={registerList}
            />
          )}
          {view === "now-playing" && (
            <NowPlaying
              labelledBy={titleId}
              shouldFocus={navigation.shouldFocus}
            />
          )}
          {view === "brick" && <BrickGame />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
