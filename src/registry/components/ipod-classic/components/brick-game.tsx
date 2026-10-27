"use client"

import { useEffect, useRef } from "react"
import { useAtomValue, useStore } from "jotai"

import styles from "../ipod-classic.module.css"
import { brickStatusAtom, engineAtom, isInertAtom } from "../lib/atoms"
import {
  brickStatus,
  createBrickGame,
  createLcdInk,
  createLcdRenderer,
  drawField,
  FIELD_HEIGHT,
  FIELD_WIDTH,
  INITIAL_BRICK_STATUS,
  tickMs,
} from "../lib/brick-engine"
import { BRICK_PADDLE_STEER } from "../lib/constants"

/** Catching up after a stall is capped, so the ball never teleports. */
const MAX_CATCH_UP_TICKS = 10

export function BrickGame() {
  const store = useStore()
  const engine = useAtomValue(engineAtom)
  const { message } = useAtomValue(brickStatusAtom)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !engine) return
    const game = createBrickGame()
    const lcd = createLcdInk(FIELD_WIDTH, FIELD_HEIGHT)
    const { state } = game
    const isPaused = () => store.get(isInertAtom)
    let frame: number | undefined
    let lastTime: number | undefined
    let backlog = 0
    let needsDraw = false
    let steer = 0
    let hasSteered = false

    function draw() {
      drawField(state, lcd.drive)
      needsDraw = false
    }

    // Fixed ticks keep the physics identical at any frame rate.
    function step(now: number) {
      const elapsed = lastTime === undefined ? 0 : now - lastTime
      const interval = tickMs(state.level)
      const paused = isPaused()
      lastTime = now
      backlog = Math.min(backlog + elapsed, interval * MAX_CATCH_UP_TICKS)

      let ticked = false
      while (backlog >= interval) {
        backlog -= interval
        ticked = true
        if (paused) continue
        game.movePaddle(steer * BRICK_PADDLE_STEER)
        hasSteered ||= steer !== 0
        game.tick()
      }
      if (ticked) {
        draw()
        store.set(brickStatusAtom, brickStatus(state))
      }
      const isFading = lcd.fade(elapsed)
      if (ticked || isFading) renderer.paint()

      const isMoving =
        !paused && (state.isBallInPlay || state.serveTicks > 0 || steer !== 0)
      frame =
        isMoving || needsDraw || isFading
          ? requestAnimationFrame(step)
          : undefined
    }

    function start() {
      if (frame !== undefined) return
      lastTime = undefined
      frame = requestAnimationFrame(step)
    }

    function movePaddle(fraction: number) {
      game.movePaddle(fraction)
      needsDraw = true
      start()
    }

    draw()
    lcd.settle()
    const renderer = createLcdRenderer(canvas, lcd)
    store.set(brickStatusAtom, INITIAL_BRICK_STATUS)
    const unsubscribe = store.sub(isInertAtom, () => {
      if (!isPaused()) start()
    })

    engine.menu.registerBrick({
      movePaddle,
      steerPaddle(direction) {
        // A tap too short to reach a tick still nudges the paddle once.
        if (direction === 0 && !hasSteered && !isPaused()) {
          movePaddle(steer * BRICK_PADDLE_STEER)
        }
        steer = direction
        hasSteered = false
        start()
      },
      launchBall() {
        game.launchBall()
        needsDraw = true
        store.set(brickStatusAtom, brickStatus(state))
        start()
      },
    })

    return () => {
      engine.menu.registerBrick(null)
      unsubscribe()
      if (frame !== undefined) cancelAnimationFrame(frame)
      renderer.destroy()
    }
  }, [store, engine])

  return (
    <div className={styles.brickScreen}>
      <canvas
        ref={canvasRef}
        className={styles.brickCanvas}
        width={FIELD_WIDTH}
        height={FIELD_HEIGHT}
        aria-hidden
      />
      <p className={styles.visuallyHidden} role="status">
        {message}
      </p>
    </div>
  )
}
