import Game from "../game"
import { $ } from "../utils"
import { EventEmitter, eventEmitter } from "./eventEmitter"

export default class Ui {
  game: Game
  dom: Record<string, HTMLElement>
  eventEmitter: EventEmitter
  constructor() {
    this.game = new Game()
    this.eventEmitter = eventEmitter
    this.dom = {
      brickCanvas: $(".brick")! as HTMLCanvasElement,
      bgCanvas: $(".bg")! as HTMLCanvasElement,
      start: $(".start")! as HTMLElement, // Cast the result to HTMLElement
      pause: $(".pause")! as HTMLElement,
      restart: $(".restart")! as HTMLElement,
      score: $(".score>span")! as HTMLElement,
    }
    this.init()
    this.addEvent()
  }
  init() {
    this.eventEmitter.on("scoreUpdate", (score: number) => {
      this.dom.score.innerText = score + ""
    })
  }
  addEvent() {
    this.dom.start.addEventListener("click", () => {
      this.game.startGame()
      this.dom.start.style.display = "none"
      this.dom.pause.style.display = "block"
    })
    this.dom.pause.addEventListener("click", () => {
      if (this.game.pause) {
        this.game.playGame()
        this.dom.pause.innerText = "暂停"
      } else {
        this.game.pauseGame()
        this.dom.pause.innerText = "继续"
      }
    })
  }
}
