import { BaseBrick, Brick } from "../brick"
import CanvasWithMapCtx from "./CanvasWithMapCtx"
import { GameHelper, gameHelper } from "./Helper"
import { userActions } from "../inputHandler"
import Operation from "../inputHandler/Operation"
import { ICanvasWithMapCtx, IGameRenderer, IGame } from "../types"
import { gameParam } from "../gameConfig"
import type { BrickLetter } from "../types/brick"

export default class Renderer implements IGameRenderer {
  private operation: Operation
  private gameHelper: GameHelper
  private lastTime = 0
  private pauseTime = 0
  private game: IGame
  private over: boolean = false
  private pause: boolean = false
  public canvasWithMapCtx: ICanvasWithMapCtx
  public brick: Brick
  public nextBrickLetter: BrickLetter
  constructor(game: IGame) {
    this.gameHelper = gameHelper
    this.game = game
    this.canvasWithMapCtx = new CanvasWithMapCtx()
    this.brick = new Brick(
      this.gameHelper.getRandomLetter(),
      this.canvasWithMapCtx.mapBinary
    )
    this.nextBrickLetter = this.gameHelper.getRandomLetter()
    this.operation = new Operation(
      this.game,
      this.canvasWithMapCtx,
      this.brick,
      {
        playGame: this.playGame.bind(this),
        pauseGame: this.pauseGame.bind(this),
        togglePause: this.togglePause.bind(this),
      }
    )
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
    this.clearCanvas(this.canvasWithMapCtx.brickCtx)
    this.lastTime = time
    this.draw()
    this.update(time - this.pauseTime)
    this.checkBrickState(time - this.pauseTime)
  }
  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
  private draw() {
    if (gameParam.showLandingPoint) {
      this.draw = this.drawWithLandingPoint
    } else {
      this.draw = this.drawWithoutLandingPoint
    }
    this.draw()
  }
  private drawWithoutLandingPoint() {
    this.gameHelper.drawBrick(
      this.canvasWithMapCtx.brickCtx,
      this.brick,
      this.brick.point,
      1
    )
  }
  private drawWithLandingPoint() {
    this.drawWithoutLandingPoint()
    this.gameHelper.drawBrick(
      this.canvasWithMapCtx.brickCtx,
      this.brick,
      this.brick.landingPoint,
      0.3
    )
  }
  private update(time: number) {
    const shouldNextOne = this.operation.brick.update(
      time,
      this.canvasWithMapCtx.mapBinary
    )
    if (shouldNextOne) {
      this.operation.brick.setRecycle()
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
      this.canvasWithMapCtx.mapBinary,
      this.canvasWithMapCtx.bg,
      this.brick
    )
    if (!isSuccess) {
      this.over = true
      this.game.state.setOver()
      return
    }
    const eliminateNum = this.gameHelper.eliminate(
      this.canvasWithMapCtx.mapBinary,
      this.canvasWithMapCtx.bg,
      this.brick.point.y,
      Math.min(
        this.brick.point.y + this.brick.structure.length,
        this.canvasWithMapCtx.mapBinary.length
      )
    )
    console.time("drawBg")
    this.gameHelper.drawBg(
      this.canvasWithMapCtx.bgCtx,
      this.canvasWithMapCtx.bg,
      Brick.width,
      Brick.height
    )
    console.timeEnd("drawBg")
    const score = this.gameHelper.computeScore(eliminateNum)
    this.brick = new Brick(
      this.nextBrickLetter,
      this.canvasWithMapCtx.mapBinary,
      time
    )
    this.nextBrickLetter = this.gameHelper.getRandomLetter()
    this.operation.takeTurns(this.brick)
    this.game.state.setNextBrick(new BaseBrick(this.nextBrickLetter), this)
    this.game.state.setScore(score + this.game.state.score)
    this.game.state.setEliminateNum(eliminateNum + this.game.state.eliminateNum)
  }
  private cachePauseTime(time: number) {
    this.pauseTime += time - this.lastTime
    this.lastTime = time
  }
  playGame() {
    this.game.state.setPause(false)
    this.pause = false
  }
  pauseGame() {
    this.game.state.setPause(true)
    this.pause = true
  }
  togglePause() {
    this.game.state.setPause(!this.game.state.pause)
    this.pause = !this.pause
  }
  private userActions() {
    userActions(this.pause, this.over, this.operation)
  }
}
