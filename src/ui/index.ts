import { Brick } from "../brick"
import { drawBrick } from "../draw"
import Game from "../game"
import { gameParam } from "../gameConfig"
import { IEventEmitter } from "../types"
import { $ } from "../utils"
import { eventEmitter } from "./eventEmitter"

export default class Ui {
  game: Game
  dom
  eventEmitter: IEventEmitter = eventEmitter
  constructor() {
    this.dom = {
      brickCanvas: $(".brick")! as HTMLCanvasElement,
      bgCanvas: $(".bg")! as HTMLCanvasElement,
      nextBrickCanvas: $(".next_brick")! as HTMLCanvasElement,
      start: $(".start")! as HTMLElement, // Cast the result to HTMLElement
      pause: $(".pause")! as HTMLElement,
      regame: $(".regame")! as HTMLElement,
      restart: $(".restart")! as HTMLElement,
      score: $(".score>span")! as HTMLElement,
      eliminate: $(".eliminate>span")! as HTMLElement,
    }
    this.addEventEmitter()
    this.addEvent()
    this.dom.nextBrickCanvas.width = gameParam.brickWidth * 4
    this.dom.nextBrickCanvas.height = gameParam.brickHeight * 4
    this.game = new Game()
  }
  addEventEmitter() {
    this.eventEmitter.emit("resetDom")
    this.eventEmitter.clearAllListeners()
    this.eventEmitter.on("updateScore", (score) => {
      this.dom.score.innerText = score + ""
    })
    this.eventEmitter.on("updateEliminate", (num) => {
      this.dom.eliminate.innerText = num + ""
    })
    this.eventEmitter.on("updateNextBrick", (brick) => {
      //清空画布
      this.dom.nextBrickCanvas
        .getContext("2d")!
        .clearRect(
          0,
          0,
          this.dom.nextBrickCanvas.width,
          this.dom.nextBrickCanvas.height
        )
      if (brick) {
        drawBrick(this.dom.nextBrickCanvas.getContext("2d")!, {
          ...brick,
          x: 0,
          y: 0,
        } as Brick)
      }
    })
    this.eventEmitter.on("startGame", (renderer) => {
      this.eventEmitter.emit("updateNextBrick", renderer.nextBrick)
    })
    this.eventEmitter.on("gameOver", () => {
      this.game.cancelGame()
      this.dom.restart.style.display = "block"
      this.dom.pause.style.display = "none"
    })
    this.eventEmitter.on("resetDom", () => {
      this.eventEmitter.emit("updateScore", 0)
      this.eventEmitter.emit("updateEliminate", 0)
      this.eventEmitter.emit("updateNextBrick", null)
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
    this.dom.regame.addEventListener("click", () => {
      this.addEventEmitter()
      this.game.restartGame()
    })
    this.dom.restart.addEventListener("click", () => {
      this.game.restartGame()
      this.dom.restart.style.display = "none"
      this.dom.pause.style.display = "block"
    })
  }
}
