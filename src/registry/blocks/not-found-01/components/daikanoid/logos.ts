/**
 * A logo is authored as a grid of "pixels": "X" places a brick, any other
 * character leaves a gap. The board is built from this data in `resetGame`
 * (brick.ts). Brick width is per-logo (height stays `BRICK_HEIGHT`), so a
 * smaller width yields a finer grid for more detailed logos.
 */
export interface LogoDef {
  name: string
  /** Brick width in px (canvas is 800 wide → `800 / brickWidth` columns). */
  brickWidth: number
  pattern: string[]
  /** Bricks per pixel horizontally (default 1). */
  colScale?: number
  /** Bricks per pixel vertically (default 1). */
  rowScale?: number
  /** Left offset in bricks (default 0). */
  colOffset?: number
  /** Top offset in bricks (default 0). */
  rowOffset?: number
}

const chanhdai: LogoDef = {
  name: "ChanhDai",
  brickWidth: 80,
  rowScale: 3,
  colOffset: 1,
  rowOffset: 0,
  pattern: [".XX.XXX.", "X...X..X", "X...X..X", ".XX.XXX."],
}

const eve: LogoDef = {
  name: "eve",
  brickWidth: 40,
  colOffset: 2,
  rowOffset: 1,
  pattern: [
    "XXXXXXX...XXXXXX",
    "XXXXXXX...XXXXXX",
    ".........X......",
    "XXX......X...XXX",
    "XXX.....X....XXX",
    "........X.......",
    "XXXX...X....XXXX",
    "XXXX...X....XXXX",
  ],
}

const vercel: LogoDef = {
  name: "Vercel",
  brickWidth: 40,
  colOffset: 4,
  rowOffset: 0,
  pattern: [
    ".....XX.....",
    ".....XX.....",
    "....XXXX....",
    "....XXXX....",
    "...XXXXXX...",
    "...XXXXXX...",
    "..XXXXXXXX..",
    "..XXXXXXXX..",
    ".XXXXXXXXXX.",
    ".XXXXXXXXXX.",
    "XXXXXXXXXXXX",
    "XXXXXXXXXXXX",
  ],
}

export const LOGOS: LogoDef[] = [chanhdai, eve, vercel]

export function getLogoIndex(name?: string | null): number {
  if (!name) return 0
  const index = LOGOS.findIndex(
    (logo) => logo.name.toLowerCase() === name.toLowerCase()
  )
  return index === -1 ? 0 : index
}
