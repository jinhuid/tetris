import {
  ICanvasWithMapCtx,
  IGameRenderer,
  OperateEvents,
  PlayWithPause,
} from "../types"
import { IBrick } from "../types/brick"

export default class Operation implements OperateEvents {
  constructor(
    private renderer: IGameRenderer,
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
    const shouldNextOne = this.brick.downToBottom(this.canvasWithMapCtx.mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  rotate() {
    this.brick.rotate(this.canvasWithMapCtx.mapBinary)
  }
  pauseGame() {
    if (this.renderer.gameState.playing) {
      this.Player.playGame()
    } else {
      this.Player.pauseGame()
    }
  }
}
