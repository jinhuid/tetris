import { Brick } from "./brick"
import { gameParam } from "./config"
import { drawBg } from "./draw"
import { userAction } from "./inputHandler"
import Operate from "./operate"
import { eliminate, record } from "./other"
import { BrickColor } from "./types"
import { $ } from "./utils"

const canvas = $(".canvas.brick") as HTMLCanvasElement
const bgCanvas = $(".canvas.bg") as HTMLCanvasElement

canvas.height = bgCanvas.height = window.innerHeight
canvas.width = bgCanvas.width = window.innerWidth

interface GameImpl {
  isOver: boolean
  pause: boolean
  render: (time: number) => void
  reSetCanvas: () => void
}

export default class Game implements GameImpl {
  private mapBinary = new Array(gameParam.row).fill(0) as number[]
  private bg: BrickColor[][] = Array.from({ length: gameParam.row }, () =>
    Array.from({ length: gameParam.column })
  )
  private ctx = canvas.getContext("2d")!
  private bgCtx = bgCanvas.getContext("2d")!
  private operate = new Operate(this, this.mapBinary, new Brick())
  isOver: boolean = false
  pause: boolean = false
  render(time: number) {
    console.log(this.pause)
    this.userAction()
    if (this.pause) return
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.draw()
    this.update(time)
    this.canNextOne(time)
  }
  reSetCanvas() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
  }
  private draw() {
    this.operate.brick.draw(this.ctx)
  }
  private update(time: number) {
    console.log(time)
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
  private userAction() {
    userAction(this.pause, this.operate)
  }
}
