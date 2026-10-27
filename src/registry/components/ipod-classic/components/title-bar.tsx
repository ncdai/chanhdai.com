import { useAtomValue } from "jotai"

import styles from "../ipod-classic.module.css"
import {
  brickStatusAtom,
  playbackAtom,
  titleAtom,
  viewAtom,
} from "../lib/atoms"
import { PauseIcon, PlayIcon } from "./icons"

export function TitleBar({ id }: { id: string }) {
  const title = useAtomValue(titleAtom)
  const view = useAtomValue(viewAtom)
  const brick = useAtomValue(brickStatusAtom)
  const { hasLoadedItem, isPlaying } = useAtomValue(playbackAtom)

  return (
    <div id={id} className={styles.titleBar}>
      {hasLoadedItem &&
        (isPlaying ? (
          <PlayIcon className={styles.playIcon} />
        ) : (
          <PauseIcon className={styles.playIcon} data-paused="" />
        ))}
      <div className={styles.battery} aria-hidden />
      {/* Brick swaps the title for balls left and score. */}
      {view === "brick" ? (
        <div className={`${styles.title} ${styles.brickTitle}`} dir="ltr">
          <span>{brick.balls}</span>
          <span>{brick.score}</span>
        </div>
      ) : (
        <div className={styles.title} dir="auto">
          {title}
        </div>
      )}
    </div>
  )
}
