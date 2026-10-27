"use client"

import { useEffect, useRef, useState } from "react"
import { useAtomValue } from "jotai"

import styles from "../ipod-classic.module.css"
import {
  engineAtom,
  isAdjustingVolumeAtom,
  playbackAtom,
  seekAtom,
  settingsAtom,
} from "../lib/atoms"
import {
  RepeatAllIcon,
  RepeatOneIcon,
  ShuffleIcon,
  VolumeHighIcon,
  VolumeLowIcon,
} from "./icons"
import { Marquee } from "./marquee"
import { ProgressBar } from "./progress-bar"

const integer = new Intl.NumberFormat("en-US")
const units = {
  hour: new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: "hour",
    unitDisplay: "long",
  }),
  minute: new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: "minute",
    unitDisplay: "long",
  }),
  second: new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: "second",
    unitDisplay: "long",
  }),
}
const list = new Intl.ListFormat("en-US")

function formatTime(seconds: number) {
  const value = Math.max(0, Math.floor(seconds))
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`
}

/** "1 minute and 5 seconds", for the scrubber's spoken value. */
function spokenDuration(seconds: number) {
  const value = Math.max(0, Math.floor(seconds))
  const parts = (
    [
      ["hour", Math.floor(value / 3600)],
      ["minute", Math.floor(value / 60) % 60],
      ["second", value % 60],
    ] as const
  )
    .filter(([, amount]) => amount > 0)
    .map(([unit, amount]) => units[unit].format(amount))
  return parts.length ? list.format(parts) : units.second.format(0)
}

const PLAY_MODE_LABELS: Record<string, string> = {
  "shuffle-off": "Shuffle on",
  "shuffle-one": "Shuffle on, Repeat one",
  "shuffle-all": "Shuffle on, Repeat all",
  "ordered-one": "Repeat one",
  "ordered-all": "Repeat all",
}

export function NowPlaying({
  labelledBy,
  shouldFocus,
}: {
  labelledBy: string
  shouldFocus: boolean
}) {
  const playback = useAtomValue(playbackAtom)
  const seek = useAtomValue(seekAtom)
  const isAdjustingVolume = useAtomValue(isAdjustingVolumeAtom)
  const { shuffle, repeat } = useAtomValue(settingsAtom)
  const sliders = useAtomValue(engineAtom)?.sliders
  const ref = useRef<HTMLDivElement>(null)

  const song = playback.queue[playback.currentTrackIndex]
  const { duration } = playback
  const time =
    seek.isSeeking && seek.previewTime !== undefined
      ? seek.previewTime
      : playback.currentTime
  const hasDuration = Number.isFinite(duration) && duration > 0
  const elapsed = hasDuration ? formatTime(time) : ""
  const remaining = hasDuration
    ? `-${formatTime(Math.ceil(duration - time))}`
    : ""
  const scrubValue = hasDuration ? Math.floor(time) : 0
  const volume = Math.round(playback.volume * 100)
  const isShuffled = shuffle === "songs"
  const playModesLabel =
    PLAY_MODE_LABELS[`${isShuffled ? "shuffle" : "ordered"}-${repeat}`]

  const mode = isAdjustingVolume
    ? "volume"
    : seek.isSeeking
      ? "scrubbing"
      : "progress"
  // The pane sliding out keeps its content until it is off screen.
  const [pane, setPane] = useState<"volume" | "scrubbing">("volume")
  const shownPane = mode === "progress" ? pane : mode
  if (shownPane !== pane) setPane(shownPane)

  useEffect(() => {
    if (shouldFocus) ref.current?.focus({ preventScroll: true })
    // Focus only when this page arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const labels = (
    <>
      <span>{elapsed}</span>
      <span>{remaining}</span>
    </>
  )

  return (
    <div
      ref={ref}
      className={styles.nowPlaying}
      role="group"
      aria-labelledby={labelledBy}
      tabIndex={0}
    >
      <div className={styles.nowPlayingIndex}>
        <span>
          {integer.format(playback.queuePosition + 1)} of{" "}
          {integer.format(playback.queue.length)}
        </span>
        {playModesLabel && (
          <>
            <div className={styles.playModifier} aria-hidden>
              {repeat === "one" && <RepeatOneIcon />}
              {repeat === "all" && <RepeatAllIcon />}
              {isShuffled && <ShuffleIcon />}
            </div>
            <span className={styles.visuallyHidden}>{playModesLabel}</span>
          </>
        )}
      </div>

      {song && (
        <div className={styles.nowPlayingInfo}>
          <div className={styles.songTitle}>
            {song.url ? (
              <a
                className={styles.songTitleLink}
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Marquee text={song.name} resetKey={song.id} />
              </a>
            ) : (
              <Marquee text={song.name} resetKey={song.id} />
            )}
          </div>
          <div className={styles.artist} dir="auto">
            {song.artistName}
          </div>
          {song.albumName && (
            <div className={styles.album} dir="auto">
              {song.albumName}
            </div>
          )}
        </div>
      )}

      <div className={styles.progressPanes} data-mode={mode}>
        <div className={styles.timeAndProgress} aria-hidden>
          <ProgressBar value={time} max={duration} />
          <div className={styles.progressLabels}>{labels}</div>
        </div>

        <div
          className={styles.scrubber}
          data-inactive={shownPane !== "scrubbing" || undefined}
        >
          <ProgressBar
            variant="marker"
            value={scrubValue}
            max={duration}
            disabled={!playback.hasLoadedItem}
            label="Playback Progress"
            valueText={spokenDuration(scrubValue)}
            onFocus={sliders?.focusScrub}
            onInput={sliders?.scrub}
            onCommit={sliders?.commitScrub}
            onBlur={sliders?.blurScrub}
          />
          <div className={styles.progressLabels} aria-hidden>
            {labels}
          </div>
        </div>

        <div
          className={styles.volume}
          data-inactive={shownPane !== "volume" || undefined}
        >
          <VolumeLowIcon />
          <ProgressBar
            value={volume}
            max={100}
            label="Volume"
            valueText={`${volume}%`}
            onFocus={sliders?.focusVolume}
            onInput={sliders?.setVolume}
            onBlur={sliders?.blurVolume}
          />
          <VolumeHighIcon />
        </div>
      </div>
    </div>
  )
}
