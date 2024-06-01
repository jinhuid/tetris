import {
  IBrick,
  ICanvasWithMapCtx,
  IRenderer,
  OperateEvents,
  PlayWithPause,
} from "./types"

export default class Operation implements OperateEvents {
  constructor(
    private renderer: IRenderer,
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
  downBottom() {
    const shouldNextOne = this.brick.downBottom(this.canvasWithMapCtx.mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  rotate() {
    this.brick.rotate(this.canvasWithMapCtx.mapBinary)
  }
  pauseGame() {
    if (this.renderer.pause) {
      this.Player.playGame()
    } else {
      this.Player.pauseGame()
    }
  }
}
