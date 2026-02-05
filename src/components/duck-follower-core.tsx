"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Position = {
  x: number
  y: number
}

type AnimationConfig = {
  row: number
  frames: number
  duration: number
  loop?: boolean
  loopCount?: number
}

type AnimationName = "walking" | "sitting" | "quack"

const CONFIG = {
  frameWidth: 128,
  frameHeight: 128,
  gutter: 5,
  renderedWidth: 64,
  renderedHeight: 64,
  spriteSheet: "https://assets.chanhdai.com/images/sprites/duck.webp?v=2",
  animations: {
    walking: {
      row: 0,
      frames: 5,
      duration: 0.5,
      loop: true,
    },
    sitting: {
      row: 1,
      frames: 6,
      duration: 2,
      loop: false,
    },
    quack: {
      row: 2,
      frames: 6,
      duration: 2,
      loopCount: 3,
    },
  } as const satisfies Record<AnimationName, AnimationConfig>,
  walkSpeed: 0.8,
  cursorOffset: {
    x: -12,
    y: 32,
  },
  idleThreshold: 500,
  maxSpeedMultiplier: 5,
  maxBoostClicks: 10,
  boostDecayInterval: 300,
  idleDeadZone: 50,
} as const

const IDLE_ANIMATIONS: AnimationName[] = ["sitting", "quack"]

const SCALED_SPRITE_SIZE = (() => {
  const {
    frameWidth,
    frameHeight,
    renderedWidth,
    renderedHeight,
    gutter,
    animations,
  } = CONFIG

  const maxFrames = Math.max(...Object.values(animations).map((a) => a.frames))
  const maxRows = Math.max(...Object.values(animations).map((a) => a.row)) + 1

  return {
    width:
      (maxFrames * frameWidth + (maxFrames - 1) * gutter) *
      (renderedWidth / frameWidth),
    height:
      (maxRows * frameHeight + (maxRows - 1) * gutter) *
      (renderedHeight / frameHeight),
  }
})()

function clampToViewport(position: Position): Position {
  const maxX = window.innerWidth - CONFIG.renderedWidth
  const maxY = window.innerHeight - CONFIG.renderedHeight
  return {
    x: Math.max(0, Math.min(position.x, maxX)),
    y: Math.max(0, Math.min(position.y, maxY)),
  }
}

const ANIMATION_STYLES: Record<
  AnimationName,
  ReturnType<typeof generateAnimationStyle>
> = {
  walking: generateAnimationStyle("walking"),
  sitting: generateAnimationStyle("sitting"),
  quack: generateAnimationStyle("quack"),
}

function generateAnimationStyle(animationName: AnimationName) {
  const animation = CONFIG.animations[animationName]

  const { frameHeight, renderedWidth, renderedHeight, gutter } = CONFIG

  const yOffset = animation.row * (frameHeight + gutter)

  let iterationCount: string | number = "infinite"

  const animConfig = animation as AnimationConfig

  if ("loop" in animConfig && !animConfig.loop) {
    iterationCount =
      "loopCount" in animConfig && typeof animConfig.loopCount === "number"
        ? animConfig.loopCount
        : 1
  }

  return {
    width: renderedWidth,
    height: renderedHeight,
    backgroundImage: `url(${CONFIG.spriteSheet})`,
    backgroundSize: `${SCALED_SPRITE_SIZE.width}px ${SCALED_SPRITE_SIZE.height}px`,
    backgroundPosition: `0 -${yOffset * (renderedHeight / frameHeight)}px`,
    animation: `sprite-${animationName} ${animation.duration}s steps(${animation.frames}) ${iterationCount}`,
  }
}

function useDuckState() {
  const [position, setPosition] = useState<Position>(() => ({
    x: window.innerWidth - CONFIG.renderedWidth - 20,
    y: 20,
  }))
  const [targetPosition, setTargetPosition] = useState<Position>(position)
  const [animation, setAnimation] = useState<AnimationName>("sitting")
  const [direction, setDirection] = useState<"left" | "right">("left")
  const [isIdle, setIsIdle] = useState(true)
  const [hasReachedTarget, setHasReachedTarget] = useState(true)
  const [clickBoost, setClickBoost] = useState(0)

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastIdleAnimationRef = useRef<AnimationName | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isPlayingIdleRef = useRef(false)
  const boostDecayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const currentPositionRef = useRef(position)
  const targetPositionRef = useRef(targetPosition)
  const hasReachedTargetRef = useRef(hasReachedTarget)
  const clickBoostRef = useRef(clickBoost)

  useEffect(() => {
    currentPositionRef.current = position
  }, [position])

  useEffect(() => {
    targetPositionRef.current = targetPosition
  }, [targetPosition])

  useEffect(() => {
    hasReachedTargetRef.current = hasReachedTarget
  }, [hasReachedTarget])

  useEffect(() => {
    clickBoostRef.current = clickBoost
  }, [clickBoost])

  const getRandomIdleAnimation = useCallback((): AnimationName => {
    const availableAnimations = IDLE_ANIMATIONS.filter(
      (a) => a !== lastIdleAnimationRef.current
    )
    const randomAnimation =
      availableAnimations[
        Math.floor(Math.random() * availableAnimations.length)
      ]
    lastIdleAnimationRef.current = randomAnimation
    return randomAnimation
  }, [])

  useEffect(() => {
    let rafId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        rafId = null

        const newTarget = clampToViewport({
          x: e.clientX - CONFIG.cursorOffset.x,
          y: e.clientY - CONFIG.cursorOffset.y,
        })

        if (isPlayingIdleRef.current) {
          const dx = newTarget.x - currentPositionRef.current.x
          const dy = newTarget.y - currentPositionRef.current.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < CONFIG.idleDeadZone) return

          isPlayingIdleRef.current = false
          setAnimation("walking")
        }

        setTargetPosition(newTarget)
        setIsIdle(false)
        setHasReachedTarget(false)

        if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
        idleTimerRef.current = setTimeout(() => {
          setIsIdle(true)
        }, CONFIG.idleThreshold)
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)

      if (rafId) cancelAnimationFrame(rafId)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const handleClick = () => {
      setClickBoost((prev) => Math.min(prev + 1, CONFIG.maxBoostClicks))
    }

    window.addEventListener("click", handleClick, { passive: true })

    return () => window.removeEventListener("click", handleClick)
  }, [])

  useEffect(() => {
    if (clickBoost === 0) return

    boostDecayTimerRef.current = setTimeout(() => {
      setClickBoost((prev) => Math.max(prev - 1, 0))
    }, CONFIG.boostDecayInterval)

    return () => {
      if (boostDecayTimerRef.current) clearTimeout(boostDecayTimerRef.current)
    }
  }, [clickBoost])

  useEffect(() => {
    const updatePosition = () => {
      const boostFactor = clickBoostRef.current / CONFIG.maxBoostClicks
      const speedMultiplier = 1 + boostFactor * (CONFIG.maxSpeedMultiplier - 1)
      const speed = CONFIG.walkSpeed * speedMultiplier

      setPosition((currentPos) => {
        const dx = targetPositionRef.current.x - currentPos.x
        const dy = targetPositionRef.current.y - currentPos.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < speed) {
          if (!hasReachedTargetRef.current) {
            queueMicrotask(() => {
              setHasReachedTarget(true)
              setClickBoost(0)
              setDirection(CONFIG.cursorOffset.x < 0 ? "left" : "right")
            })
            hasReachedTargetRef.current = true
          }

          return clampToViewport(targetPositionRef.current)
        }

        if (Math.abs(dx) > 0.5) {
          const newDirection = dx > 0 ? "right" : "left"
          queueMicrotask(() => setDirection(newDirection))
        }

        const ratio = speed / distance
        return clampToViewport({
          x: currentPos.x + dx * ratio,
          y: currentPos.y + dy * ratio,
        })
      })

      animationFrameRef.current = requestAnimationFrame(updatePosition)
    }

    animationFrameRef.current = requestAnimationFrame(updatePosition)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let nextAnimation: AnimationName | null = null

    if (!isIdle || !hasReachedTarget) {
      if (isPlayingIdleRef.current) {
        isPlayingIdleRef.current = false
      }
      if (animation !== "walking") {
        nextAnimation = "walking"
      }
    } else if (!isPlayingIdleRef.current) {
      isPlayingIdleRef.current = true
      const randomAnimation = getRandomIdleAnimation()
      if (animation !== randomAnimation) {
        nextAnimation = randomAnimation
      }
    }

    if (nextAnimation) {
      queueMicrotask(() => setAnimation(nextAnimation))
    }
  }, [isIdle, hasReachedTarget, animation, getRandomIdleAnimation])

  const handleAnimationEnd = useCallback(() => {
    if (!isPlayingIdleRef.current) return

    if (isIdle && hasReachedTarget) {
      setAnimation(getRandomIdleAnimation())
    } else {
      isPlayingIdleRef.current = false
      setAnimation("walking")
    }
  }, [isIdle, hasReachedTarget, getRandomIdleAnimation])

  return {
    position,
    animation,
    direction,
    onAnimationEnd: handleAnimationEnd,
  }
}

const KEYFRAMES_CSS = (() => {
  const {
    frameWidth,
    frameHeight,
    renderedWidth,
    renderedHeight,
    gutter,
    animations,
  } = CONFIG

  const scaleX = renderedWidth / frameWidth
  const scaleY = renderedHeight / frameHeight

  return Object.entries(animations)
    .map(([name, anim]) => {
      const frameWidthWithGutter = (frameWidth + gutter) * anim.frames
      const yPos = anim.row * (frameHeight + gutter)
      const scaledYPos = yPos * scaleY

      return `
        @keyframes sprite-${name} {
          from { background-position: 0 -${scaledYPos}px; }
          to { background-position: -${frameWidthWithGutter * scaleX}px -${scaledYPos}px; }
        }
      `
    })
    .join("\n")
})()

export default function DuckFollowerCore() {
  const { position, animation, direction, onAnimationEnd } = useDuckState()

  const animationStyle = ANIMATION_STYLES[animation]
  const transform =
    direction === "left"
      ? `translate3d(${position.x}px, ${position.y}px, 0) scaleX(-1)`
      : `translate3d(${position.x}px, ${position.y}px, 0)`

  return (
    <>
      <style>{KEYFRAMES_CSS}</style>
      <div
        className="duck-follower dark:drop-shadow-sm dark:drop-shadow-amber-300"
        style={{ ...animationStyle, transform }}
        onAnimationEnd={onAnimationEnd}
        aria-hidden="true"
      />
    </>
  )
}
