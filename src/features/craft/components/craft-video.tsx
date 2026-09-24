"use client"

import { useEffect, useRef, useState } from "react"
import type { Transition } from "motion/react"
import { motion, useInView } from "motion/react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

// `auto` holds back under reduced motion. Pressing play is an explicit opt-in,
// so `playing` ignores that preference.
type Playback = "auto" | "playing" | "paused"

export function CraftVideo({
  src,
  poster,
  width,
  height,
  className,
}: {
  src: string
  poster?: string
  width: number
  height: number
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(videoRef, { amount: 0.5 })
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

  const [playback, setPlayback] = useState<Playback>("auto")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  const shouldPlay =
    isInView &&
    (playback === "playing" || (playback === "auto" && !prefersReducedMotion))

  // Whenever the video won't play on its own, the button stays visible so
  // there is always a way to start it.
  const isHeldBack =
    playback === "paused" ||
    (playback === "auto" && prefersReducedMotion) ||
    isBlocked

  const play = (video: HTMLVideoElement) => {
    video.play().catch((error: DOMException) => {
      // Autoplay was refused (e.g. iOS Low Power Mode). An AbortError only
      // means a pause() landed before playback started.
      if (error.name === "NotAllowedError") setIsBlocked(true)
    })
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (shouldPlay) play(video)
    else video.pause()
  }, [shouldPlay])

  return (
    <div
      className={cn("group/craft-video relative overflow-hidden", className)}
    >
      {/* The recordings start with a row of black pixels. Pulling the video up
      1px under the clip hides it: the videos are wider than they display, so
      1px always covers at least one source row. */}
      <video
        ref={videoRef}
        className="-mt-px h-auto w-full rounded-[inherit] bg-muted"
        style={{ aspectRatio: `${width} / ${height}` }}
        src={src}
        poster={poster}
        width={width}
        height={height}
        preload={poster ? "none" : "metadata"}
        muted
        loop
        playsInline
        onPlay={() => {
          setIsPlaying(true)
          setIsBlocked(false)
        }}
        onPause={() => setIsPlaying(false)}
      />

      <button
        type="button"
        aria-label={isPlaying ? "Pause video" : "Play video"}
        data-held-back={isHeldBack ? "" : undefined}
        className={cn(
          "absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-muted/80 text-foreground backdrop-blur-md",
          "transition-[opacity,background-color,scale] duration-150 ease-out hover:bg-muted active:scale-97 motion-reduce:active:scale-100",
          "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring",
          "opacity-0 group-hover/craft-video:opacity-100 focus-visible:opacity-100 data-held-back:opacity-100 pointer-coarse:opacity-100"
        )}
        onClick={() => {
          const video = videoRef.current
          if (!video) return

          if (isPlaying) {
            setPlayback("paused")
            video.pause()
          } else {
            setPlayback("playing")
            // Inside the click, so browsers that refused autoplay count it as
            // a user gesture.
            play(video)
          }
        }}
      >
        <PlayPauseIcon
          isPlaying={isPlaying}
          prefersReducedMotion={prefersReducedMotion}
        />
      </button>
    </div>
  )
}

// Points sit half a stroke inside the outline, so the round joins soften the
// corners without growing the icon. Changing the width means re-insetting them.
const ICON_STROKE_WIDTH = 2.5

// Matching M L L L Z commands let motion morph `d`: the play triangle is split
// at x = 13, one half per pause bar.
const PAUSE_ICON = {
  left: "M5.5 5.5L8.5 5.5L8.5 18.5L5.5 18.5Z",
  right: "M15.5 5.5L18.5 5.5L18.5 18.5L15.5 18.5Z",
} as const

const PLAY_ICON = {
  left: "M7.5 5.87L13 9.08L13 14.92L7.5 18.13Z",
  right: "M13 9.08L18.01 12L18.01 12L13 14.92Z",
} as const

const ICON_TRANSITION: Transition = {
  type: "spring",
  visualDuration: 0.3,
  bounce: 0,
}

const INSTANT_TRANSITION: Transition = { duration: 0 }

function PlayPauseIcon({
  isPlaying,
  prefersReducedMotion,
}: {
  isPlaying: boolean
  prefersReducedMotion: boolean
}) {
  // The icon names the action, so a playing video shows pause.
  const icon = isPlaying ? PAUSE_ICON : PLAY_ICON
  const transition = prefersReducedMotion ? INSTANT_TRANSITION : ICON_TRANSITION

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={ICON_STROKE_WIDTH}
      strokeLinejoin="round"
      className="size-4"
    >
      <motion.path
        initial={false}
        animate={{ d: icon.left }}
        transition={transition}
      />
      <motion.path
        initial={false}
        animate={{ d: icon.right }}
        transition={transition}
      />
    </svg>
  )
}
