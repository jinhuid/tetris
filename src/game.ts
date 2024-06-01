import { Brick } from "./brick"
import { gameParam } from "./config"
import { drawBg } from "./draw"
import { eliminate, record } from "./helper"
import { userActions } from "./inputHandler"
import Operate from "./operate"
import { BrickColor, IGame } from "./types"
import { $ } from "./utils"

const canvas = $(".canvas.brick") as HTMLCanvasElement
const bgCanvas = $(".canvas.bg") as HTMLCanvasElement

canvas.height = bgCanvas.height = gameParam.windowHeight
canvas.width = bgCanvas.width = gameParam.windowWidth

export default class Game implements IGame {
  private mapBinary = new Array(gameParam.row).fill(0) as number[]
  private bg: BrickColor[][] = Array.from({ length: gameParam.row }, () =>
    Array.from({ length: gameParam.column })
  )
  private ctx = canvas.getContext("2d")!
  private bgCtx = bgCanvas.getContext("2d")!
  private operate = new Operate(this, this.mapBinary, new Brick())
  private lastTime = 0
  private pauseTime = 0
  isOver: boolean = false
  isPause: boolean = false
  render(time: number) {
    this.userActions()
    if (this.isPause) {
      this.cachePauseTime(time)
      return
    }
    this.clearBrick()
    this.lastTime = time
    this.draw()
    this.update(time - this.pauseTime)
    this.canNextOne(time - this.pauseTime)
  }
  clearBrick() {
    this.clearCanvas(this.ctx)
  }
  clearBg() {
    this.clearCanvas(this.bgCtx)
  }
  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
  private draw() {
    this.operate.brick.draw(this.ctx)
  }
  private update(time: number) {
    // console.log(time)
    const shouldNextOne = this.operate.brick.update(time, this.mapBinary)
    if (shouldNextOne) {
      this.operate.brick.isRecycle = true
    }
  }
  private canNextOne(time: number) {
    if (this.operate.brick.isRecycle) {
      this.newNextOne(time)
    }
  }
  private newNextOne(time: number) {
    // 是否成功记录 如果失败就是游戏结束
    if (!record(this.mapBinary, this.bg, this.operate.brick)) {
      this.isOver = true
      return
    }
    eliminate(this.mapBinary, this.bg)
    drawBg(this.bgCtx, this.bg)
    this.operate.brick = new Brick(time)
  }
  private cachePauseTime(time: number) {
    this.pauseTime += time - this.lastTime
    this.lastTime = time
  }
  private userActions() {
    userActions(this.isPause, this.operate)
  }
}
