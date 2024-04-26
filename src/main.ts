import { Brick } from "./brick"
import { BrickColor, gameParam } from "./config"
import { drawBg } from "./draw"
import { Operation, userAction } from "./inputHandler"
import { eliminate, record } from "./other"
import { $, customRaf } from "./utils"

const canvas = $(".canvas.brick") as HTMLCanvasElement
const bgCanvas = $(".canvas.bg") as HTMLCanvasElement

canvas.height = bgCanvas.height = window.innerHeight
canvas.width = bgCanvas.width = window.innerWidth

class Operate implements Operation {
  constructor(public mapBinary: number[], public brick: Brick) {}
  left() {
    this.brick.left(this.mapBinary)
  }
  right() {
    this.brick.right(this.mapBinary)
  }
  downOne() {
    const shouldNextOne = this.brick.downOne(this.mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  downBottom() {
    const shouldNextOne = this.brick.downBottom(this.mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  rotate() {
    this.brick.rotate(this.mapBinary)
  }
}

interface GameImpl {
  operate: Operate
  gameOver: boolean
  reStartGame: () => void
  start: (time: number) => void
  draw: () => void
  update: (time: number) => void
  canNextOne: (time: number) => void
  newNextOne: (time: number) => void
  userAction: (operate: Operation) => void
}

let timer = 0
class Game implements GameImpl {
  gameOver: boolean = false
  mapBinary = new Array(gameParam.row).fill(0) as number[]
  bg: BrickColor[][] = Array.from({ length: gameParam.row }, () =>
    Array.from({ length: gameParam.column })
  )
  operate = new Operate(this.mapBinary, new Brick())
  ctx = canvas.getContext("2d")!
  bgCtx = bgCanvas.getContext("2d")!
  raf = customRaf((time) => {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.draw()
    this.update(time)
    this.userAction(this.operate)
    this.canNextOne(time)
  }, 100)
  start = this.raf[0]
  cancel = this.raf[1]
  draw() {
    this.operate.brick.draw(this.ctx)
  }
  update(time: number) {
    const shouldNextOne = this.operate.brick.update(time, this.mapBinary)
    if (shouldNextOne) {
      this.operate.brick.isRecycle = true
    }
  }
  canNextOne(time: number) {
    if (this.operate.brick.isRecycle) {
      this.newNextOne(time)
    }
  }
  newNextOne(time: number) {
    // 是否成功记录 如果失败就是游戏结束
    this.gameOver = !record(this.mapBinary, this.bg, this.operate.brick)
    if (this.gameOver) {
      this.reStartGame()
      return
    }
    eliminate(this.mapBinary, this.bg)
    drawBg(this.bgCtx, this.bg)
    this.operate.brick = new Brick(time)
  }
  reStartGame() {
    this.cancel()
    game.ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
    game = new Game()
    game.start()
  }
  userAction: (operate: Operation) => void = userAction
}

let game = new Game()
game.start()