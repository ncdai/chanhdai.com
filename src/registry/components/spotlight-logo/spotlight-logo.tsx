"use client"

import { useEffect, useId, useRef } from "react"
import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { metalClickSound } from "@/lib/soundcn/metal-click"
import { useSound } from "@/hooks/soundcn/use-sound"

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

/**
 * An SVG mark whose outline is traced by a gradient highlight that follows the
 * cursor, paired with a springy press effect and a tactile click sound.
 *
 * Swap the SVG paths below for your own artwork. The interaction is driven by:
 * - a `radialGradient` whose center springs toward the pointer (the spotlight),
 *   reused as a second stroke layered over the base outline.
 * - `whileTap="pressed"` morphing the path `d` values between two states.
 *
 * The demo mark was designed by ncdai on Figma with the
 * [Fast Isometric Plugin](https://www.figma.com/community/plugin/1249759048471403961).
 * Inspired by tailwindcss.com.
 */
export function SpotlightLogo() {
  const id = useId()
  const ids = {
    facePattern: `spotlight-logo-face-pattern-${id}`,
    faceFill: `spotlight-logo-face-fill-${id}`,
    stroke: `spotlight-logo-stroke-${id}`,
    radialGradient: `spotlight-logo-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)

  const [play] = useSound(metalClickSound)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, 556]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, 354]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  })

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return
    }

    if (window.matchMedia("(hover: none)").matches) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className="h-auto w-full touch-manipulation [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
      viewBox="0 0 556 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        <motion.g
          id={ids.faceFill}
          variants={{
            normal: {
              transform: "translate(0px, 0px)",
            },
            pressed: {
              transform: "translate(0px, 16px)",
            },
          }}
          transition={transition}
        >
          <path d="M333.05 256.58L222.20 320.58L166.78 288.58L277.63 224.58L333.05 256.58Z" />
          <path d="M388.48 32.58L277.63 96.58L388.48 160.58L499.33 96.58L554.76 128.58L388.48 224.58L166.78 96.58L333.05 0.58L388.48 32.58Z" />
          <path d="M166.78 288.58L111.35 320.58L0.50 256.58L55.93 224.58L166.78 288.58Z" />
          <path d="M554.76 64.58L499.33 96.58L388.48 32.58L443.90 0.58L554.76 64.58Z" />
          <path d="M166.78 160.58L55.93 224.58L0.50 192.58L111.35 128.58L166.78 160.58Z" />
        </motion.g>

        <motion.path
          id={ids.stroke}
          variants={{
            normal: {
              d: [
                // C
                "M28.21 240.58 L0.50 224.58 V192.58 L111.35 128.58 L166.78 160.58 V192.58 L83.64 240.58",
                "M166.78 160.58 L0.50 256.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V256.58 L277.63 224.58 L166.78 288.58 L0.50 192.58",
                "M0.50 256.58 L111.35 320.58 L166.78 288.58 L222.20 320.58 L333.05 256.58",
                "M111.35 320.58 V352.58",
                "M166.78 288.58 V320.58",
                "M222.20 320.58 V352.58",
                // D
                "M499.33 96.58 L554.76 128.58 V160.58 L388.48 256.58 L166.78 128.58 V96.58 L333.05 0.58 L499.33 96.58",
                "M166.78 96.58 L388.48 224.58 L554.76 128.58",
                "M527.04 112.58 L554.76 96.58 V64.58 L443.90 0.58 L277.63 96.58 L388.48 160.58 L554.76 64.58",
                "M305.34 112.58 L388.48 64.58 L471.62 112.58",
                "M388.48 224.58 V256.58",
                "M388.48 32.58 V64.58",
              ].join(""),
            },
            pressed: {
              d: [
                // C
                "M42.07 248.58 L0.50 224.58 V208.58 L111.35 144.58 L166.78 176.58 V192.58 L69.78 248.58",
                "M166.78 176.58 L0.5 272.58 V288.58 L111.35 352.58 L166.78 320.58 L222.20 352.58 L333.05 288.58 V272.58 L277.63 240.58 L166.78 304.58 L0.5 208.58",
                "M0.5 272.58 L111.35 336.58 L166.78 304.58 L222.20 336.58 L333.05 272.58",
                "M111.35 336.58 V352.58",
                "M166.78 304.58 V320.58",
                "M222.20 336.58 V352.58",
                // D
                "M499.33 112.58 L554.76 144.58 V160.58 L388.48 256.58 L166.78 128.58 V112.58 L333.05 16.58 L499.33 112.58",
                "M166.78 112.58 L388.48 240.58 L554.76 144.58",
                "M513.19 120.58 L554.76 96.58 V80.58 L443.90 16.58 L277.63 112.58 L388.48 176.58 L554.76 80.58",
                "M291.48 120.58 L388.48 64.58 L485.47 120.58",
                "M388.48 240.58 V256.58",
                "M388.48 48.58 V64.58",
              ].join(""),
            },
          }}
          transition={transition}
        />

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      <g className="fill-background" fillRule="evenodd" clipRule="evenodd">
        <motion.path
          variants={{
            normal: {
              d: "M166.78 160.58L55.93 224.58L0.50 192.58V224.58L55.93 256.58L166.78 192.58V160.58Z",
            },
            pressed: {
              d: "M166.78 176.58L55.93 240.58L0.50 208.58V224.58L55.93 256.58L166.78 192.58V176.58Z",
            },
          }}
          transition={transition}
        />
        <motion.path
          variants={{
            normal: {
              d: "M166.78 288.58L111.35 320.58L0.50 256.58V288.58L111.35 352.58L166.78 320.58L222.20 352.58L333.05 288.58V256.58L222.20 320.58L166.78 288.58Z",
            },
            pressed: {
              d: "M166.78 304.58L111.35 336.58L0.50 272.58V288.58L111.35 352.58L166.78 320.58L222.20 352.58L333.05 288.58V272.58L222.20 336.58L166.78 304.58Z",
            },
          }}
          transition={transition}
        />
        <motion.path
          variants={{
            normal: {
              d: "M388.48 224.58L166.78 96.58V128.58L388.48 256.58L554.76 160.58V128.58L388.48 224.58Z",
            },
            pressed: {
              d: "M388.48 240.58L166.78 112.58V128.58L388.48 256.58L554.76 160.58V144.58L388.48 240.58Z",
            },
          }}
          transition={transition}
        />
        <motion.path
          variants={{
            normal: {
              d: "M388.48 32.58L277.63 96.58V128.58L388.48 64.58L499.33 128.58L554.75 96.58V64.58L499.33 96.58L388.48 32.58Z",
            },
            pressed: {
              d: "M388.48 48.58L277.63 112.58V128.58L388.48 64.58L499.33 128.58L554.75 96.58V80.58L499.33 112.58L388.48 48.58Z",
            },
          }}
          transition={transition}
        />
      </g>

      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      <use href={`#${ids.stroke}`} stroke="var(--stroke)" />
      <use href={`#${ids.stroke}`} stroke={`url(#${ids.radialGradient})`} />
    </motion.svg>
  )
}
