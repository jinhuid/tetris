import { Brick } from "../brick"
import { drawBrick } from "../draw"
import Game from "../game"
import { gameParam } from "../gameConfig"
import { Scorer, scorer } from "../scorer"
import { $ } from "../utils"
import { EventEmitter, eventEmitter } from "./eventEmitter"

export default class Ui {
  game: Game
  dom
  eventEmitter: EventEmitter
  scorer: Scorer
  constructor() {
    this.game = new Game()
    this.eventEmitter = eventEmitter
    this.scorer = scorer
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
    this.dom.nextBrickCanvas.width = gameParam.brickWidth * 4
    this.dom.nextBrickCanvas.height = gameParam.brickHeight * 4
    this.init()
    this.addEvent()
  }
  init() {
    this.eventEmitter.clearAllListeners()
    this.eventEmitter.on("updateScore", () => {
      this.dom.score.innerText = this.scorer.score + ""
    })
    this.eventEmitter.on("updateEliminate", () => {
      this.dom.eliminate.innerText = this.scorer.eliminateNum + ""
    })
    this.eventEmitter.on("updateNextBrick", (brick: Brick) => {
      //清空画布
      this.dom.nextBrickCanvas
        .getContext("2d")!
        .clearRect(0, 0, this.dom.nextBrickCanvas.width, this.dom.nextBrickCanvas.height)
      drawBrick(this.dom.nextBrickCanvas.getContext("2d")!, {
        ...brick,
        x: 0,
        y: 0,
      } as Brick)
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
      this.scorer.reset()
      this.eventEmitter.emit("updateScore", this.scorer.score)
      this.game.restartGame()
      this.init()
    })
  }
}
