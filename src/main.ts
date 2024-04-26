import { Brick } from "./brick"
import { BrickColor, gameParam } from "./config"
import { drawBg } from "./draw"
import { Operation, userAction } from "./inputHandler"
import { eliminate, record } from "./other"
import { $ } from "./utils"

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
  start: (time: number) => void
  draw: () => void
  update: (time: number) => void
  newNextOne: () => void
  userAction: (operate: Operation) => void
}

class Game implements GameImpl {
  mapBinary = new Array(gameParam.row).fill(0) as number[]
  bg: BrickColor[][] = Array.from({ length: gameParam.row }, () =>
    Array.from({ length: gameParam.column })
  )
  operate = new Operate(this.mapBinary, new Brick())
  ctx = canvas.getContext("2d")!
  bgCtx = bgCanvas.getContext("2d")!
  start(time: number = 0) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.draw()
    this.update(time)
    this.userAction(this.operate)
    this.newNextOne()
    requestAnimationFrame(this.start.bind(this))
  }
  draw() {
    this.operate.brick.draw(this.ctx)
  }
  update(time: number) {
    const shouldNextOne = this.operate.brick.update(time, this.mapBinary)
    if (shouldNextOne) {
      this.operate.brick.isRecycle = true
    }
  }
  newNextOne() {
    if (!this.operate.brick.isRecycle) return
    record(this.mapBinary, this.bg, this.operate.brick)
    eliminate(this.mapBinary, this.bg)
    drawBg(this.bgCtx, this.bg)
    this.operate.brick = new Brick(0)
  }
  userAction: (operate: Operation) => void = userAction
}

const game = new Game()
game.start()
