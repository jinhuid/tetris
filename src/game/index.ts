import { gameParam } from "../gameConfig"
import Renderer from "./Renderer"
import { IGame, IGameRenderer, IGameState } from "../types"
import { customRaf } from "../utils"
import gameState from "./State"
import { BaseBrick } from "../brick"

export default class Game implements IGame {
  private renderer: IGameRenderer
  private startWithEnd!: readonly [IGame["startGame"], IGame["cancelGame"]]
  private startRaf!: () => void
  private cancelRaf!: () => void
  public state: IGameState
  constructor() {
    this.renderer = new Renderer(this)
    this.state = gameState
    this.defineRaf(this.renderer)
  }
  private defineRaf(renderer: IGameRenderer) {
    this.startWithEnd = customRaf((time: number = performance.now()) => {
      renderer.render(time)
    }, gameParam.FPS)
    this.startRaf = this.startWithEnd[0]
    this.cancelRaf = this.startWithEnd[1]
  }
  startGame() {
    this.startRaf()
    this.state.setPlaying(true)
    this.state.setNextBrick(
      new BaseBrick(this.renderer.nextBrickLetter),
      this.renderer
    )
  }
  cancelGame() {
    this.cancelRaf()
  }
  restartGame() {
    this.cancelRaf()
    this.state.initState()
    this.renderer = new Renderer(this)
    this.defineRaf(this.renderer)
    this.startRaf()
    this.state.setPlaying(true)
    this.state.setNextBrick(
      new BaseBrick(this.renderer.nextBrickLetter),
      this.renderer
    )
  }
  playGame() {
    this.renderer.playGame()
  }
  pauseGame() {
    this.renderer.pauseGame()
  }
  togglePause() {
    this.renderer.togglePause()
  }
}
