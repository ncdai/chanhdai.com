/** The playfield, in LCD pixels. */
export const FIELD_WIDTH = 148
export const FIELD_HEIGHT = 101

const PADDLE_WIDTH = 30
const PADDLE_HEIGHT = 4
const BALL_RADIUS = 1.5
const BRICK_HEIGHT = 4
const BRICKS_PER_ROW = 12
const BRICK_GAP = 2
const ROW_GAP = 4
const SIDE_MARGIN = 3
const TOP_MARGIN = 3
const BRICK_WIDTH =
  (FIELD_WIDTH - SIDE_MARGIN * 2 - (BRICKS_PER_ROW - 1) * BRICK_GAP) /
  BRICKS_PER_ROW
const FIRST_LEVEL_ROWS = 2
const MAX_ROWS = 5
const STARTING_BALLS = 3
const SERVE_DELAY_MS = 1000
const BASE_TICK_MS = 40
const SPEEDUP_PER_LEVEL = 0.1
const MAX_SPEEDUP = 1.5
const BALL_COMPONENT_SPEED = 1.7
const BALL_SPEED = Math.hypot(BALL_COMPONENT_SPEED, BALL_COMPONENT_SPEED)
/** Edge hits come off faster... */
const EDGE_SPEED_BOOST = 0.25
/** ...and at a steeper angle. */
const EDGE_ANGLE = 0.8
const PADDLE_TRAVEL = FIELD_WIDTH - PADDLE_WIDTH
const PADDLE_TOP = FIELD_HEIGHT - PADDLE_HEIGHT

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export function tickMs(level: number) {
  return (
    BASE_TICK_MS / Math.min(1 + (level - 1) * SPEEDUP_PER_LEVEL, MAX_SPEEDUP)
  )
}

type Brick = { x: number; y: number; destroyed: boolean }

function createBricks(level: number) {
  const rows = Math.min(FIRST_LEVEL_ROWS + level - 1, MAX_ROWS)
  const bricks: Brick[] = []
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < BRICKS_PER_ROW; column += 1) {
      bricks.push({
        x: SIDE_MARGIN + column * (BRICK_WIDTH + BRICK_GAP),
        y: TOP_MARGIN + row * (BRICK_HEIGHT + ROW_GAP),
        destroyed: false,
      })
    }
  }
  return bricks
}

const serveBall = () => ({
  x: BALL_RADIUS,
  y: FIELD_HEIGHT / 2,
  dx: BALL_COMPONENT_SPEED,
  dy: BALL_COMPONENT_SPEED,
})

function initialState() {
  return {
    paddleX: PADDLE_TRAVEL / 2,
    ball: serveBall(),
    isBallInPlay: false,
    serveTicks: 0,
    bricks: createBricks(1),
    score: 0,
    balls: STARTING_BALLS,
    level: 1,
    isGameOver: false,
  }
}

type BrickState = ReturnType<typeof initialState>

/** What the title bar and the screen reader announce. */
export type BrickStatus = {
  score: number
  balls: number
  message: string
}

const LAUNCH_MESSAGE = "Press Center to Launch Ball"

export const INITIAL_BRICK_STATUS: BrickStatus = {
  score: 0,
  balls: STARTING_BALLS,
  message: LAUNCH_MESSAGE,
}

export function brickStatus(state: BrickState): BrickStatus {
  let message = LAUNCH_MESSAGE
  if (state.isGameOver) message = "GAME OVER"
  else if (state.isBallInPlay || state.serveTicks > 0) message = ""
  return { score: state.score, balls: state.balls, message }
}

export function createBrickGame() {
  const state = initialState()

  function serve() {
    state.ball = serveBall()
    state.isBallInPlay = false
    state.serveTicks = Math.round(SERVE_DELAY_MS / tickMs(state.level))
  }

  function loseBall() {
    state.balls -= 1
    if (state.balls > 0) {
      serve()
      return
    }
    state.isBallInPlay = false
    state.isGameOver = true
  }

  function nextLevel() {
    state.level += 1
    state.bricks = createBricks(state.level)
    serve()
  }

  /** Where the ball lands on the paddle sets its angle and speed. */
  function bounceOffPaddle() {
    const { ball } = state
    const half = PADDLE_WIDTH / 2
    const offset = clamp((ball.x - (state.paddleX + half)) / half, -1, 1)
    const speed = BALL_SPEED * (1 + Math.abs(offset) * EDGE_SPEED_BOOST)
    const x = offset * EDGE_ANGLE
    const length = Math.hypot(x, 1)
    ball.dx = (x / length) * speed
    ball.dy = -speed / length
  }

  function hitSide(index: number): "side" | "face" | null {
    const { ball, bricks } = state
    const { x, y, destroyed } = bricks[index]
    const neighbor = index - Math.sign(ball.dx)
    if (
      destroyed ||
      ball.x + BALL_RADIUS < x ||
      ball.x - BALL_RADIUS > x + BRICK_WIDTH ||
      ball.y + BALL_RADIUS < y ||
      ball.y - BALL_RADIUS > y + BRICK_HEIGHT
    ) {
      return null
    }
    const overlapX =
      ball.dx > 0
        ? ball.x + BALL_RADIUS - x
        : x + BRICK_WIDTH - ball.x + BALL_RADIUS
    const overlapY =
      ball.dy > 0
        ? ball.y + BALL_RADIUS - y
        : y + BRICK_HEIGHT - ball.y + BALL_RADIUS
    // A side hit is impossible when a live brick sits right beside it.
    const hasNeighbor =
      Math.floor(neighbor / BRICKS_PER_ROW) ===
        Math.floor(index / BRICKS_PER_ROW) &&
      bricks[neighbor]?.destroyed === false

    if (
      !hasNeighbor &&
      overlapX * Math.abs(ball.dy) < overlapY * Math.abs(ball.dx)
    ) {
      return (x + BRICK_WIDTH / 2 - ball.x) * ball.dx > 0 ? "side" : null
    }
    return (y + BRICK_HEIGHT / 2 - ball.y) * ball.dy > 0 ? "face" : null
  }

  function collideBricks() {
    const { ball } = state
    for (const [index, brick] of state.bricks.entries()) {
      const hit = hitSide(index)
      if (!hit) continue
      brick.destroyed = true
      state.score += 1
      if (hit === "face") ball.dy = -ball.dy
      else ball.dx = -ball.dx
      return true
    }
    return false
  }

  function tick() {
    const { ball } = state
    if (state.serveTicks > 0) {
      state.serveTicks -= 1
      state.isBallInPlay = state.serveTicks === 0
    }
    if (!state.isBallInPlay) return

    const wasAbovePaddle = ball.y + BALL_RADIUS < PADDLE_TOP
    ball.x += ball.dx
    ball.y += ball.dy
    if (
      (ball.x <= BALL_RADIUS && ball.dx < 0) ||
      (ball.x >= FIELD_WIDTH - BALL_RADIUS && ball.dx > 0)
    ) {
      ball.dx = -ball.dx
    }
    if (ball.y <= BALL_RADIUS && ball.dy < 0) ball.dy = -ball.dy
    if (ball.y >= FIELD_HEIGHT) {
      loseBall()
      return
    }
    if (
      ball.dy > 0 &&
      wasAbovePaddle &&
      ball.y + BALL_RADIUS >= PADDLE_TOP &&
      ball.x + BALL_RADIUS >= state.paddleX &&
      ball.x - BALL_RADIUS <= state.paddleX + PADDLE_WIDTH
    ) {
      bounceOffPaddle()
    }
    if (collideBricks() && state.bricks.every((brick) => brick.destroyed)) {
      nextLevel()
    }
  }

  /** `fraction` of the paddle's full travel; a whole turn crosses the field. */
  function movePaddle(fraction: number) {
    if (state.isGameOver) return
    state.paddleX = clamp(
      state.paddleX + fraction * PADDLE_TRAVEL,
      0,
      PADDLE_TRAVEL
    )
  }

  function launchBall() {
    if (state.isGameOver) {
      Object.assign(state, initialState())
      return
    }
    state.isBallInPlay = true
    state.serveTicks = 0
  }

  return { state, tick, movePaddle, launchBall }
}

const INK = 1
const PADDLE_INK = 2

/** Pixels driven by `ink` light up per `drive`, with the LCD's smear. */
export function drawField(state: BrickState, drive: Uint8Array) {
  drive.fill(0)
  const fill = (
    x: number,
    y: number,
    width: number,
    height: number,
    value = INK
  ) => {
    const left = Math.max(Math.round(x), 0)
    const right = Math.min(Math.round(x) + width, FIELD_WIDTH)
    const bottom = Math.min(Math.round(y) + height, FIELD_HEIGHT)
    for (let row = Math.max(Math.round(y), 0); row < bottom; row += 1) {
      drive.fill(value, row * FIELD_WIDTH + left, row * FIELD_WIDTH + right)
    }
  }

  for (const brick of state.bricks) {
    if (!brick.destroyed) fill(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT)
  }
  fill(state.paddleX, PADDLE_TOP, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_INK)
  fill(
    state.ball.x - BALL_RADIUS,
    state.ball.y - BALL_RADIUS,
    BALL_RADIUS * 2,
    BALL_RADIUS * 2
  )
}

const RISE_MS = 20
const FALL_MS = 70
/** The paddle clears faster so steering does not leave a long trail. */
const PADDLE_FALL_MS = 25
const SETTLED = 1 / 255

/**
 * Slow LCD crystals: each pixel eases toward its drive through two stages,
 * rising fast and fading slow, which leaves the ball a short ghost trail.
 */
export function createLcdInk(width: number, height: number) {
  const size = width * height
  const drive = new Uint8Array(size)
  const stage = new Float32Array(size)
  const ink = new Float32Array(size)
  const lastDrive = new Uint8Array(size)

  function fade(elapsedMs: number) {
    const rise = 1 - Math.exp(-elapsedMs / RISE_MS)
    const fall = 1 - Math.exp(-elapsedMs / FALL_MS)
    const paddleFall = 1 - Math.exp(-elapsedMs / PADDLE_FALL_MS)
    let changed = false

    for (let i = 0; i < size; i += 1) {
      const target = drive[i] === 0 ? 0 : 1
      lastDrive[i] = drive[i] || lastDrive[i]
      if (
        Math.abs(target - stage[i]) > SETTLED ||
        Math.abs(target - ink[i]) > SETTLED
      ) {
        const falloff = lastDrive[i] === PADDLE_INK ? paddleFall : fall
        const toStage = target - stage[i]
        stage[i] += toStage * (toStage > 0 ? rise : falloff)
        const toInk = stage[i] - ink[i]
        ink[i] += toInk * (toInk > 0 ? rise : falloff)
        changed = true
      } else {
        changed ||= stage[i] !== target || ink[i] !== target
        stage[i] = target
        ink[i] = target
      }
    }
    return changed
  }

  function settle() {
    for (let i = 0; i < size; i += 1) {
      lastDrive[i] = drive[i] || lastDrive[i]
      stage[i] = drive[i] === 0 ? 0 : 1
      ink[i] = stage[i]
    }
  }

  return { width, height, drive, ink, fade, settle }
}

type LcdInk = ReturnType<typeof createLcdInk>

/** Pixel edges dim to this, drawing the LCD's grid between cells. */
const GRID_SHADE = 0.7
const MIN_SCALE_FOR_GRID = 3

function gridShade(position: number, scale: number) {
  const edge = Math.round((position + 0.5) / scale) * scale
  return 1 - (1 - GRID_SHADE) * Math.max(0, 1 - Math.abs(position + 0.5 - edge))
}

/** Paints the ink buffer onto a canvas at device resolution. */
export function createLcdRenderer(canvas: HTMLCanvasElement, lcd: LcdInk) {
  const context = canvas.getContext("2d")
  let image: ImageData | undefined
  let sourceIndex = new Int32Array(0)
  let shade = new Float32Array(0)
  let resolution: MediaQueryList | undefined

  function buildMaps() {
    const { width, height } = canvas
    const scale = width / lcd.width
    const showGrid = scale > 1
    sourceIndex = new Int32Array(width * height)
    shade = new Float32Array(width * height)
    for (let y = 0; y < height; y += 1) {
      const row = Math.min(Math.floor((y + 0.5) / scale), lcd.height - 1)
      const rowShade = showGrid ? gridShade(y, scale) : 1
      for (let x = 0; x < width; x += 1) {
        const column = Math.floor((x + 0.5) / scale)
        const index = y * width + x
        sourceIndex[index] = row * lcd.width + column
        shade[index] = rowShade * (showGrid ? gridShade(x, scale) : 1) * 255
      }
    }
  }

  function paint() {
    if (!context || !image) return
    for (let i = 0; i < sourceIndex.length; i += 1) {
      image.data[i * 4 + 3] = lcd.ink[sourceIndex[i]] * shade[i]
    }
    context.putImageData(image, 0, 0)
  }

  function resize() {
    const style = getComputedStyle(canvas)
    const scale = Number(style.getPropertyValue("--ipod-scale")) || 1
    const deviceWidth = Math.round(
      canvas.clientWidth * scale * devicePixelRatio
    )
    const width =
      deviceWidth >= lcd.width * MIN_SCALE_FOR_GRID ? deviceWidth : lcd.width
    if (image && width === canvas.width) return

    canvas.width = width
    canvas.height = Math.round((width * lcd.height) / lcd.width)
    buildMaps()
    image = context?.createImageData(canvas.width, canvas.height)
    applyInk()
  }

  /** Ink is the canvas's CSS color, which follows the site theme. */
  function applyInk() {
    if (!context || !image) return
    // The canvas resolves any CSS color (e.g. oklch) to RGB for us.
    context.fillStyle = getComputedStyle(canvas).color
    context.fillRect(0, 0, 1, 1)
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data
    for (let i = 0; i < image.data.length; i += 4) {
      image.data.set([r, g, b], i)
    }
    paint()
  }

  function watchResolution() {
    resolution?.removeEventListener("change", watchResolution)
    resolution = matchMedia(`(resolution: ${devicePixelRatio}dppx)`)
    resolution.addEventListener("change", watchResolution)
    resize()
  }

  // The iPod scales with its container, which a resize of either can change.
  const observer = new ResizeObserver(resize)
  observer.observe(document.documentElement)
  observer.observe(canvas)
  watchResolution()
  // Switching theme swaps the class on <html>.
  const themeObserver = new MutationObserver(applyInk)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })

  return {
    paint,
    destroy() {
      observer.disconnect()
      themeObserver.disconnect()
      resolution?.removeEventListener("change", watchResolution)
    },
  }
}
