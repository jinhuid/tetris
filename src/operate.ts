import { Brick } from "./brick"
import Game from "./game"
import { OperateImpl } from "./types"

export default class Operate implements OperateImpl {
  constructor(
    private game: Game,
    private mapBinary: number[],
    public brick: Brick
  ) {}
  left() {
    this.brick.left(this.mapBinary)
  }
  right() {
    this.brick.right(this.mapBinary)
  }
  downOne() {
    const shouldNextOne = this.brick.downOne(this.mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  downBottom() {
    const shouldNextOne = this.brick.downBottom(this.mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  rotate() {
    this.brick.rotate(this.mapBinary)
  }
  pauseGame() {
    this.game.pause = !this.game.pause
  }
}
