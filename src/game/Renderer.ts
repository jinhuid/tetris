import { Brick } from "../brick"
import CanvasWithMapCtx from "./CanvasWithMapCtx"
import { GameHelper, gameHelper } from "./Helper"
import gameState from "./State"
import { userActions } from "../inputHandler"
import Operation from "../inputHandler/Operation"
import { ICanvasWithMapCtx, IGameState, IGameRenderer } from "../types"

export default class Renderer implements IGameRenderer {
  public _canvasWithMapCtx: ICanvasWithMapCtx
  private operation: Operation
  private gameHelper: GameHelper
  private lastTime = 0
  private pauseTime = 0
  private _gameState: IGameState
  private _brick: Brick
  private _nextBrick: Brick
  private over: boolean = false
  private pause: boolean = false
  constructor() {
    this._canvasWithMapCtx = new CanvasWithMapCtx()
    this.gameHelper = gameHelper
    this._gameState = gameState
    this._brick = new Brick(this.gameHelper.getRandomLetter())
    this._nextBrick = new Brick(this.gameHelper.getRandomLetter())
    this.operation = new Operation(this, this._canvasWithMapCtx, this.brick, {
      playGame: this.playGame.bind(this),
      pauseGame: this.pauseGame.bind(this),
      togglePause: this.togglePause.bind(this),
    })
  }
  get canvasWithMapCtx() {
    return this._canvasWithMapCtx
  }
  get gameState() {
    return this._gameState
  }
  get brick() {
    return this._brick
  }
  get nextBrick() {
    return this._nextBrick
  }
  render(time: number) {
    this.userActions()
    if (this.pause) {
      this.cachePauseTime(time)
      return
    }
    if (this.over) {
      return
    }
    this.clearCanvas(this._canvasWithMapCtx.brickCtx)
    this.lastTime = time
    this.draw()
    this.update(time - this.pauseTime)
    this.checkBrickState(time - this.pauseTime)
  }
  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
  private draw() {
    this.operation.brick.draw(this._canvasWithMapCtx.brickCtx)
  }
  private update(time: number) {
    const shouldNextOne = this.operation.brick.update(
      time,
      this._canvasWithMapCtx.mapBinary
    )
    if (shouldNextOne) {
      this.operation.brick.isRecycle = true
    }
  }
  private checkBrickState(time: number) {
    if (this.operation.brick.isRecycle) {
      this.replaceNextOne(time)
    }
  }
  /**
   * @dec 先检查是否能记录下来，然后消除行，计算得分，更新游戏状态,最后替换下一个方块
   */
  private replaceNextOne(time: number) {
    const isSuccess = this.gameHelper.record(
      this._canvasWithMapCtx.mapBinary,
      this._canvasWithMapCtx.bg,
      this.brick
    )
    if (!isSuccess) {
      this.over = true
      this.gameState.setOver()
      return
    }
    const eliminateNum = this.gameHelper.eliminate(
      this._canvasWithMapCtx.mapBinary,
      this._canvasWithMapCtx.bg,
      this.brick.y,
      Math.min(
        this.brick.y + this.brick.structure.length,
        this._canvasWithMapCtx.mapBinary.length
      )
    )
    this.gameHelper.drawBg(
      this._canvasWithMapCtx.bgCtx,
      this._canvasWithMapCtx.bg,
      Brick.width,
      Brick.height
    )
    const score = this.gameHelper.computeScore(eliminateNum)
    this._brick = this.nextBrick
    this._nextBrick = new Brick(this.gameHelper.getRandomLetter(), time)
    this.brick.correctLastTime(time)
    this.operation.takeTurns(this.brick)
    this.gameState.setNextBrick(this.nextBrick, this)
    this.gameState.setScore(score + this.gameState.score)
    this.gameState.setEliminateNum(eliminateNum + this.gameState.eliminateNum)
  }
  private cachePauseTime(time: number) {
    this.pauseTime += time - this.lastTime
    this.lastTime = time
  }
  playGame() {
    this.gameState.setPause(false)
    this.pause = false
  }
  pauseGame() {
    this.gameState.setPause(true)
    this.pause = true
  }
  togglePause() {
    this.gameState.setPause(!this.gameState.pause)
    this.pause = !this.pause
  }
  private userActions() {
    userActions(this.pause, this.over, this.operation)
  }
}
