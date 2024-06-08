import {
  ICanvasWithMapCtx,
  IGame,
  OperateEvents,
  PlayWithPause,
} from "../types"
import { IBrick } from "../types/brick"

export default class Operation implements OperateEvents {
  constructor(
    private game: IGame,
    private canvasWithMapCtx: ICanvasWithMapCtx,
    public brick: IBrick,
    private Player: PlayWithPause
  ) {}
  takeTurns(brick: IBrick) {
    this.brick = brick
  }
  left() {
    this.brick.left(this.canvasWithMapCtx.mapBinary)
  }
  right() {
    this.brick.right(this.canvasWithMapCtx.mapBinary)
  }
  downOne() {
    const shouldNextOne = this.brick.downOne(this.canvasWithMapCtx.mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  downToBottom() {
    const shouldNextOne = this.brick.downToBottom(
      this.canvasWithMapCtx.mapBinary
    )
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  rotate() {
    this.brick.rotate(this.canvasWithMapCtx.mapBinary)
  }
  pauseGame() {
    if (this.game.state.pause) {
      this.Player.playGame()
    } else {
      this.Player.pauseGame()
    }
  }
}
