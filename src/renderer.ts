import { Brick } from "./brick"
import { drawBg } from "./draw/index"
import { GameHelper, gameHelper } from "./gameHelper"
import { userActions } from "./inputHandler"
import Operation from "./operate"
import Scorer from "./scorer"
import { ICanvasWithMapCtx, IRenderer } from "./types"

export default class Renderer implements IRenderer {
  private canvasWithMapCtx: ICanvasWithMapCtx
  private operation: Operation
  private scorer: Scorer
  private gameHelper: GameHelper
  private brick: Brick
  private newBrick: Brick
  constructor(canvasWithMapCtx: ICanvasWithMapCtx) {
    this.canvasWithMapCtx = canvasWithMapCtx
    this.scorer = new Scorer()
    this.gameHelper = gameHelper
    this.brick = new Brick()
    this.newBrick = new Brick()
    this.operation = new Operation(this, this.canvasWithMapCtx, this.brick, {
      playGame: this.playGame.bind(this),
      pauseGame: this.pauseGame.bind(this),
    })
  }
  private lastTime = 0
  private pauseTime = 0
  private _over: boolean = false
  private _pause: boolean = false
  get over() {
    return this._over
  }
  get pause() {
    return this._pause
  }
  render(time: number) {
    this.userActions()
    if (this._pause) {
      this.cachePauseTime(time)
      return
    }
    this.clearCanvas(this.canvasWithMapCtx.ctx)
    this.lastTime = time
    this.draw()
    this.update(time - this.pauseTime)
    this.canNextOne(time - this.pauseTime)
  }
  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
  private draw() {
    this.operation.brick.draw(this.canvasWithMapCtx.ctx)
  }
  private update(time: number) {
    // console.log(time)
    const shouldNextOne = this.operation.brick.update(
      time,
      this.canvasWithMapCtx.mapBinary
    )
    if (shouldNextOne) {
      this.operation.brick.isRecycle = true
    }
  }
  private canNextOne(time: number) {
    if (this.operation.brick.isRecycle) {
      this.newNextOne(time)
    }
  }
  private newNextOne(time: number) {
    const isSuccess = !this.gameHelper.record(
      this.canvasWithMapCtx.mapBinary,
      this.canvasWithMapCtx.bg,
      this.brick
    )
    if (isSuccess) {
      this._over = true
      return
    }
    const row = this.gameHelper.eliminate(
      this.canvasWithMapCtx.mapBinary,
      this.canvasWithMapCtx.bg
    )
    const score = this.gameHelper.computeScore(row)
    this.scorer.bonusPoint(score)
    drawBg(this.canvasWithMapCtx.bgCtx, this.canvasWithMapCtx.bg)
    this.brick = this.newBrick
    this.newBrick = new Brick(time)
    this.operation.takeTurns(this.brick)
  }
  private cachePauseTime(time: number) {
    this.pauseTime += time - this.lastTime
    this.lastTime = time
  }
  playGame() {
    this._pause = false
  }
  pauseGame() {
    this._pause = true
  }
  private userActions() {
    userActions(this._pause, this.operation)
  }
}
