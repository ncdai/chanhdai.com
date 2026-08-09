import type p5 from "p5"

import { Colors } from "./colors"
import type { GameState } from "./types"

export class UI {
  p: p5
  state: GameState

  constructor(p: p5, state: GameState) {
    this.p = p
    this.state = state
  }

  show() {
    this.p.fill(Colors.foreground)
    this.p.textSize(16)
    this.p.textAlign(this.p.LEFT, this.p.TOP)
    this.p.text(this.state.score.toString().padStart(3, "0"), 3, 0)

    this.p.fill(Colors.mutedForeground)
    this.p.textSize(12)
    this.p.textAlign(this.p.RIGHT, this.p.TOP)
    this.p.text("FIG_404", this.p.width - 3, 0)
  }
}
