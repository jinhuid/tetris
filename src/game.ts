import CanvasWithMapCtx from "./canvasWithMapCtx"
import { gameParam } from "./gameConfig"
import Renderer from "./renderer"
import { Scorer, scorer } from "./scorer"
import { ICanvasWithMapCtx, IGame, IRenderer } from "./types"
import { customRaf } from "./utils"

export default class Game implements IGame {
  private canvasWithMapCtx: ICanvasWithMapCtx
  private renderer: IRenderer
  private Scorer: Scorer
  private startWithEnd: readonly [IGame["startGame"], IGame["cancelGame"]]
  constructor() {
    this.canvasWithMapCtx = new CanvasWithMapCtx()
    this.Scorer = scorer
    this.renderer = new Renderer(this.canvasWithMapCtx)
    this.startWithEnd = customRaf((time: number = performance.now()) => {
      this.renderer.render(time)
    }, gameParam.FPS)
  }
  get score() {
    return this.Scorer.score
  }
  get over() {
    return this.renderer.over
  }
  get pause() {
    return this.renderer.pause
  }
  startGame() {
    this.startWithEnd[0]()
  }
  cancelGame() {
    this.startWithEnd[1]()
  }
  restartGame() {
    this.canvasWithMapCtx.cleanUpCanvas()
    this.canvasWithMapCtx = new CanvasWithMapCtx()
    this.renderer = new Renderer(this.canvasWithMapCtx)
  }
  playGame() {
    this.renderer.playGame()
  }
  pauseGame() {
    this.renderer.pauseGame()
  }
}
