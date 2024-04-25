import { Brick } from "./brick"
import { BrickColor, gameParam } from "./config"
import { drawBg } from "./draw"
import { Operation, userAction } from "./inputHandler"
import { eliminate, record } from "./other"
import { $ } from "./utils"

const canvas = $(".canvas.brick") as HTMLCanvasElement
const ctx = canvas.getContext("2d")!
const bgCanvas = $(".canvas.bg") as HTMLCanvasElement
const bgCtx = bgCanvas.getContext("2d")!

canvas.height = bgCanvas.height = window.innerHeight
canvas.width = bgCanvas.width = window.innerWidth

const mapBinary = new Array(gameParam.row).fill(0) as number[]
const bg: BrickColor[][] = Array.from({ length: gameParam.row }, () =>
  Array.from({ length: gameParam.column })
)

class Operate implements Operation {
  constructor(private brick: Brick) {}
  left() {
    this.brick.left(mapBinary)
  }
  right() {
    this.brick.right(mapBinary)
  }
  downOne() {
    const shouldNextOne = this.brick.downOne(mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  downBottom() {
    this.brick.downBottom(mapBinary)
    this.brick.isRecycle = true
  }
  rotate() {
    this.brick.rotate(mapBinary)
  }
  update(time: number) {
    const shouldNextOne = this.brick.update(time, mapBinary)
    if (shouldNextOne) {
      this.brick.isRecycle = true
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    this.brick.draw(ctx)
  }
  updateNext(time: number) {
    if (!this.brick.isRecycle) return
    record(mapBinary, bg, this.brick)
    eliminate(mapBinary, bg)
    drawBg(bgCtx, bg)
    this.brick = new Brick(time)
  }
}

let operate = new Operate(new Brick())
console.log(operate)

const run = (time: number) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  operate.draw(ctx)
  operate.update(time)
  userAction(operate)
  operate.updateNext(time)
  requestAnimationFrame(run)
}
run(0)
console.log(mapBinary, bg)
