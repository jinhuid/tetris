import { gameParam } from "./gameConfig"
import Renderer from "./renderer"
import { IGame, IRenderer } from "./types"
import { EventEmitter, eventEmitter } from "./ui/eventEmitter"
import { customRaf } from "./utils"

export default class Game implements IGame {
  private renderer: IRenderer
  private eventEmitter: EventEmitter = eventEmitter
  private startWithEnd!: readonly [IGame["startGame"], IGame["cancelGame"]]
  private startRaf!: () => void
  private cancelRaf!: () => void
  constructor() {
    this.renderer = new Renderer()
    this.defineRaf(this.renderer)
  }
  get over() {
    return this.renderer.over
  }
  get pause() {
    return this.renderer.pause
  }
  private defineRaf(renderer: IRenderer) {
    this.startWithEnd = customRaf((time: number = performance.now()) => {
      renderer.render(time)
    }, gameParam.FPS)
    this.startRaf = this.startWithEnd[0]
    this.cancelRaf = this.startWithEnd[1]
  }
  startGame() {
    this.startRaf()
    this.eventEmitter.emit("startGame", this.renderer)
  }
  cancelGame() {
    this.cancelRaf()
  }
  restartGame() {
    this.cancelRaf()
    this.renderer = new Renderer()
    this.eventEmitter.emit("startGame", this.renderer)
    this.defineRaf(this.renderer)
    this.startRaf()
  }
  playGame() {
    this.renderer.playGame()
  }
  pauseGame() {
    this.renderer.pauseGame()
  }
}
