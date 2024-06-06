import { gameParam } from "../gameConfig"
import Renderer from "./Renderer"
import { IGame, IGameRenderer, IGameState } from "../types"
import { customRaf } from "../utils"
import gameState from "./State"

export default class Game implements IGame {
  private renderer: IGameRenderer
  private _state: IGameState
  private startWithEnd!: readonly [IGame["startGame"], IGame["cancelGame"]]
  private startRaf!: () => void
  private cancelRaf!: () => void
  constructor() {
    this.renderer = new Renderer()
    this._state = gameState
    this.defineRaf(this.renderer)
  }

  get state() {
    return this._state
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
    this.state.setNextBrick(this.renderer.nextBrick, this.renderer)
  }
  cancelGame() {
    this.cancelRaf()
  }
  restartGame() {
    this.cancelRaf()
    this.state.initState()
    this.renderer = new Renderer()
    this.defineRaf(this.renderer)
    this.startRaf()
    this.state.setPlaying(true)
    this.state.setNextBrick(this.renderer.nextBrick, this.renderer)
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
