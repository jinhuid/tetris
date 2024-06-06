import { Brick } from "./brick"
import CanvasWithMapCtx from "./canvasWithMapCtx"
import { GameHelper, gameHelper } from "./gameHelper"
import { userActions } from "./inputHandler"
import Operation from "./operate"
import { Scorer } from "./scorer"
import { ICanvasWithMapCtx, IRenderer } from "./types"
import { EventEmitter, eventEmitter } from "./ui/eventEmitter"

export default class Renderer implements IRenderer {
  private canvasWithMapCtx: ICanvasWithMapCtx
  private operation: Operation
  private scorer: Scorer
  private eventEmitter: EventEmitter
  private gameHelper: GameHelper
  private lastTime = 0
  private pauseTime = 0
  private _brick: Brick
  private _nextBrick: Brick
  private _over: boolean = false
  private _pause: boolean = false
  constructor() {
    this.canvasWithMapCtx =new CanvasWithMapCtx()
    this.scorer = new Scorer()
    this.eventEmitter = eventEmitter
    this.gameHelper = gameHelper
    this._brick = new Brick(this.gameHelper.getRandomLetter())
    this._nextBrick = new Brick(this.gameHelper.getRandomLetter())
    this.operation = new Operation(this, this.canvasWithMapCtx, this.brick, {
      playGame: this.playGame.bind(this),
      pauseGame: this.pauseGame.bind(this),
    })
  }
  get brick() {
    return this._brick
  }
  get nextBrick() {
    return this._nextBrick
  }
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
    const isSuccess = this.gameHelper.record(
      this.canvasWithMapCtx.mapBinary,
      this.canvasWithMapCtx.bg,
      this.brick
    )
    if (!isSuccess) {
      this._over = true
      this.eventEmitter.emit("gameOver")
      return
    }
    const row = this.gameHelper.eliminate(
      this.canvasWithMapCtx.mapBinary,
      this.canvasWithMapCtx.bg,
      this.brick.y,
      Math.min(
        this.brick.y + this.brick.structure.length,
        this.canvasWithMapCtx.mapBinary.length
      )
    )
    this.gameHelper.drawBg(
      this.canvasWithMapCtx.bgCtx,
      this.canvasWithMapCtx.bg
    )
    const score = this.gameHelper.computeScore(row)
    this.scorer.scoreIncrease(score)
    this.scorer.eliminateNumIncrease(row)
    this._brick = this.nextBrick
    this._nextBrick = new Brick(this.gameHelper.getRandomLetter(), time)
    this.brick.correctLastTime(time)
    this.operation.takeTurns(this.brick)
    this.eventEmitter.emit("updateScore", this.scorer.score)
    this.eventEmitter.emit("updateEliminate", this.scorer.eliminateNum)
    this.eventEmitter.emit("updateNextBrick", this.nextBrick)
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
