import type p5 from "p5"

import type { Brick } from "./brick"
import { BALL_SIZE, BALL_SPEED, BRICK_SCORE, uncheckedClamp } from "./constants"
import type { GameState } from "./types"

export class Ball {
  p: p5
  state: GameState
  radius: number
  x: number
  y: number
  xSpeed: number
  ySpeed: number

  constructor(p: p5, state: GameState) {
    this.p = p
    this.state = state
    this.radius = BALL_SIZE / 2
    this.x = p.width * 0.5
    this.y = p.height * 0.6
    this.xSpeed = 5
    this.ySpeed = 5
  }

  show() {
    this.p.imageMode(this.p.CENTER)
    this.p.image(this.state.ballImage!, this.x, this.y, BALL_SIZE, BALL_SIZE)
  }

  move() {
    this.x += this.xSpeed
    this.y += this.ySpeed
  }

  checkEdges() {
    if (this.x < this.radius || this.x > this.p.width - this.radius) {
      this.x = uncheckedClamp(this.radius, this.p.width - this.radius, this.x)
      this.xSpeed *= -1

      if (this.state.enableSounds) {
        playSound(this.state.soundBounce!)
      }
    }

    if (this.y < this.radius) {
      this.y = uncheckedClamp(this.radius, this.p.height - this.radius, this.y)
      this.ySpeed *= -1

      if (this.state.enableSounds) {
        playSound(this.state.soundBounce!)
      }
    }

    if (this.y > this.p.height) {
      this.state.enableGame = false

      if (this.state.enableSounds) {
        playSound(this.state.soundGameOver!)
      }

      this.reset()
    }
  }

  checkPaddle(paddle: { x: number; y: number; width: number }) {
    if (
      this.y + this.radius > paddle.y &&
      this.x > paddle.x &&
      this.x < paddle.x + paddle.width
    ) {
      this.ySpeed *= -1
      this.y = paddle.y - this.radius

      if (this.state.enableSounds) {
        playSound(this.state.soundBounce!)
      }
    }
  }

  reset() {
    this.x = this.p.width * 0.5
    this.y = this.p.height * 0.6

    const vector = this.p
      .createVector(Math.random() * 2 - 1, Math.random())
      .normalize()
      .mult(BALL_SPEED)

    this.xSpeed = vector.x
    this.ySpeed = vector.y
  }

  checkBricks(bricks: Brick[]) {
    let collision = false

    for (let i = bricks.length - 1; i >= 0; --i) {
      const brick = bricks[i]

      if (
        this.x + this.radius > brick.x &&
        this.x - this.radius < brick.x + brick.w &&
        this.y - this.radius < brick.y + brick.h &&
        this.y + this.radius > brick.y
      ) {
        collision ||= true
        this.state.score += BRICK_SCORE
        bricks.splice(i, 1)

        if (this.state.enableSounds) {
          playSound(this.state.soundBreak!)
        }
      }
    }

    if (collision) this.ySpeed *= -1
  }
}

function playSound(sound: p5.MediaElement) {
  const el = sound.elt as HTMLAudioElement
  el.currentTime = 0
  el.volume = 0.3
  el.play().catch(() => {})
}
