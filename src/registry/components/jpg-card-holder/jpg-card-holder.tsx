"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, PointerEvent } from "react"
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

// 320x424 pocket with a 120px dog-ear cut from the top-right corner.
const POCKET_PATH =
  "M12 0H196.69A8 8 0 0 1 202.34 2.34L317.66 117.66A8 8 0 0 1 320 123.31V408A16 16 0 0 1 304 424H16A16 16 0 0 1 0 408V12A12 12 0 0 1 12 0Z"

// The dog-ear folded down onto the pocket, mirroring the cut.
const FLAP_PATH =
  "M0 4.83V104A16 16 0 0 0 16 120H115.17A2 2 0 0 0 116.59 116.59L3.41 3.41A2 2 0 0 0 0 4.83Z"

// Open along the top and the upper right side, where the flap sits.
const STITCH_PATH = "M10 8V414H310V328"

// 150x120 image icon; even-odd cuts the sky out of the frame and mountains.
const IMAGE_ICON_PATH =
  "M15.5 0H134.5A15.5 15.5 0 0 1 150 15.5V104.5A15.5 15.5 0 0 1 134.5 120H15.5A15.5 15.5 0 0 1 0 104.5V15.5A15.5 15.5 0 0 1 15.5 0Z" +
  "M7 95V15.5A8.5 8.5 0 0 1 15.5 7H134.5A8.5 8.5 0 0 1 143 15.5V98L101.03 57.37Q96 52.5 90.45 56.76L59.34 80.63Q53 85.5 46.27 81.17L37.05 75.25Q32 72 27.58 76.06Z"

/** Card width the pull distances below are measured against (px). */
const CARD_WIDTH = 240

/** How far a card follows the pointer 1:1 before it starts to resist (px). */
const MAX_PULL = 220

type DragState = {
  card: number
  pointerId: number
  startX: number
  startY: number
  startOffset: number
  angle: number
  scale: number
}

// Overshoot shrinks as it grows and never exceeds `dimension`.
function rubberBand(overshoot: number, dimension: number) {
  return (overshoot * dimension * 0.55) / (dimension + 0.55 * overshoot)
}

// Tracking stays 1:1; only the limits follow the rendered size.
function resistPull(offset: number, scale: number) {
  const maxPull = MAX_PULL * scale

  if (offset < -maxPull) {
    return -maxPull - rubberBand(-maxPull - offset, 80 * scale)
  }

  // The pocket has a bottom, so pushing a card in barely moves it.
  if (offset > 0) {
    return rubberBand(offset, 24 * scale)
  }

  return offset
}

export function JpgCardHolder({
  className,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onClick,
  ...props
}: ComponentProps<"div">) {
  const grainId = useId()
  const shouldReduceMotion = useReducedMotion()

  // Each card's travel along its own tilt: negative is out of the pocket.
  const backOffset = useMotionValue(0)
  const frontOffset = useMotionValue(0)
  const offsets = [backOffset, frontOffset]

  const [isPeeking, setIsPeeking] = useState(false)
  const [draggingCard, setDraggingCard] = useState<number | null>(null)

  const dragRef = useRef<DragState | null>(null)
  const pointerTypeRef = useRef("")

  function handleCardPointerDown(
    card: number,
    event: PointerEvent<HTMLDivElement>
  ) {
    // Touch scrolls the page instead; a tap on the root peeks.
    if (event.pointerType === "touch" || event.button !== 0) return

    event.currentTarget.setPointerCapture(event.pointerId)
    // Catches a card that is still springing back.
    offsets[card].stop()

    dragRef.current = {
      card,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsets[card].get(),
      // The tilt lives in the card's `rotate-*` class.
      angle:
        (parseFloat(getComputedStyle(event.currentTarget).rotate) || 0) *
        (Math.PI / 180),
      // Layout width, so the rotation doesn't inflate it.
      scale: event.currentTarget.offsetWidth / CARD_WIDTH,
    }
    setDraggingCard(card)
  }

  function handleCardPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    // Project the pointer's travel onto the card's tilted axis.
    const along =
      (event.clientY - drag.startY) * Math.cos(drag.angle) -
      (event.clientX - drag.startX) * Math.sin(drag.angle)

    offsets[drag.card].set(resistPull(drag.startOffset + along, drag.scale))
  }

  function handleCardPointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    setDraggingCard(null)

    animate(
      offsets[drag.card],
      0,
      shouldReduceMotion
        ? { duration: 0.15, ease: "easeOut" }
        : { type: "spring", visualDuration: 0.35, bounce: 0.1 }
    )
  }

  function getCardProps(card: number) {
    return {
      "data-dragging": draggingCard === card || undefined,
      style: { y: offsets[card] },
      onPointerDown: (event: PointerEvent<HTMLDivElement>) =>
        handleCardPointerDown(card, event),
      onPointerMove: handleCardPointerMove,
      onPointerUp: handleCardPointerUp,
      onPointerCancel: handleCardPointerUp,
    }
  }

  const foil = (
    <>
      <g transform="translate(83 142) scale(1.025)">
        <path d={IMAGE_ICON_PATH} fillRule="evenodd" />
        <circle cx={44} cy={45} r={16.5} />
      </g>
      <text
        x={160}
        y={381}
        fontSize={62}
        textAnchor="middle"
        className="font-sans font-medium"
      >
        JPG
      </text>
    </>
  )

  return (
    <div
      data-slot="jpg-card-holder"
      data-peek={isPeeking || undefined}
      className={cn(
        "group/jpg-card-holder @container relative aspect-320/424 w-80 select-none",
        className
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)
        if (event.pointerType !== "touch") setIsPeeking(true)
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        // Keep peeking while a dragged card is outside the root.
        if (event.pointerType !== "touch" && !dragRef.current) {
          setIsPeeking(false)
        }
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        pointerTypeRef.current = event.pointerType
      }}
      onClick={(event) => {
        onClick?.(event)
        if (pointerTypeRef.current === "touch") setIsPeeking((value) => !value)
      }}
      {...props}
    >
      {/* Every length inside is a spacing step, so this scales with the root.
          Card radius is `cqw`: lint folds a spacing radius into `rounded-xl`. */}
      <div className="absolute inset-0 drop-shadow-[0_--spacing(2.25)_--spacing(1.75)_rgb(0_0_0/0.1)] [--spacing:calc(100cqw/80)] perspective-distant">
        {/* The outer box drags; the inner card peeks, so the hit area stays put. */}
        <motion.div
          aria-hidden
          className="absolute -top-18 left-20 h-95 w-60 origin-top-left rotate-6 cursor-grab data-dragging:cursor-grabbing"
          {...getCardProps(0)}
        >
          <div className="size-full origin-bottom rounded-[3.75cqw] bg-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-peek/jpg-card-holder:duration-400 motion-safe:group-data-peek/jpg-card-holder:-translate-y-4 motion-safe:group-data-peek/jpg-card-holder:-rotate-3 motion-safe:group-data-peek/jpg-card-holder:delay-40" />
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute -top-13.5 left-30 h-95 w-60 origin-top-left rotate-14 cursor-grab data-dragging:cursor-grabbing"
          {...getCardProps(1)}
        >
          <div className="size-full origin-bottom rounded-[3.75cqw] bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-peek/jpg-card-holder:duration-400 motion-safe:group-data-peek/jpg-card-holder:-translate-y-7 motion-safe:group-data-peek/jpg-card-holder:rotate-3" />
        </motion.div>

        <svg
          aria-hidden
          viewBox="0 0 320 424"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          <defs>
            {/* Lit noise becomes alpha, so the grain takes the fill's color. */}
            <filter id={grainId} x="0" y="0" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.7"
                numOctaves="3"
                seed="7"
              />
              <feDiffuseLighting surfaceScale="0.6" lightingColor="#fff">
                <feDistantLight azimuth="235" elevation="55" />
              </feDiffuseLighting>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 0 0 0 1"
              />
              <feComposite in="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* Only the pocket shape blocks the cards, not the SVG's cut corner. */}
          <path
            d={POCKET_PATH}
            className="pointer-events-auto fill-card stroke-foreground/10"
          />
          <path
            d={POCKET_PATH}
            filter={`url(#${grainId})`}
            className="fill-foreground opacity-15"
          />

          <path
            d={STITCH_PATH}
            fill="none"
            strokeWidth={1.5}
            className="stroke-foreground/10"
          />
          <path
            d={STITCH_PATH}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="2.5 10.5"
            strokeLinecap="round"
            className="stroke-foreground/40"
          />

          {/* The foil is smooth, so an opaque base hides the grain beneath it. */}
          <g className="fill-card">{foil}</g>
          <g
            strokeWidth={0.75}
            className="fill-foreground/15 stroke-foreground/10"
          >
            {foil}
          </g>
        </svg>

        {/* Static shadows crossfade, so the lift animates only opacity. */}
        <svg
          aria-hidden
          viewBox="0 0 120 120"
          className="pointer-events-none absolute top-0 right-0 size-30 -translate-x-px translate-y-px overflow-visible blur-[--spacing(0.25)] transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-peek/jpg-card-holder:duration-400 motion-safe:group-data-peek/jpg-card-holder:opacity-0"
        >
          <path d={FLAP_PATH} fill="rgb(0 0 0 / 0.12)" />
        </svg>
        <svg
          aria-hidden
          viewBox="0 0 120 120"
          className="pointer-events-none absolute top-0 right-0 size-30 -translate-x-0.75 translate-y-1 overflow-visible opacity-0 blur-[--spacing(0.75)] transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-peek/jpg-card-holder:duration-400 motion-safe:group-data-peek/jpg-card-holder:opacity-100"
        >
          <path d={FLAP_PATH} fill="rgb(0 0 0 / 0.16)" />
        </svg>

        {/* Rotates about the crease: the 1 1 0 axis from the top-left corner. */}
        <svg
          aria-hidden
          viewBox="0 0 120 120"
          className="pointer-events-none absolute top-0 right-0 size-30 origin-top-left overflow-visible transition-[rotate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-peek/jpg-card-holder:duration-400 motion-safe:group-data-peek/jpg-card-holder:rotate-[1_1_0_25deg]"
        >
          <path
            d={FLAP_PATH}
            className="pointer-events-auto fill-card stroke-foreground/10"
          />
        </svg>
      </div>
    </div>
  )
}
