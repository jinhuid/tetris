import { gameParam } from "./gameConfig"
import { ICanvasWithMapCtx } from "./types"
import { $ } from "./utils"

const canvas = $(".canvas.brick") as HTMLCanvasElement
const bgCanvas = $(".canvas.bg") as HTMLCanvasElement

canvas.height = bgCanvas.height = gameParam.windowHeight
canvas.width = bgCanvas.width = gameParam.windowWidth

export default class CanvasWithMapCtx implements ICanvasWithMapCtx {
  static ctx = canvas.getContext("2d")!
  static bgCtx = bgCanvas.getContext("2d")!
  ctx: CanvasRenderingContext2D
  bgCtx: CanvasRenderingContext2D
  mapBinary: ICanvasWithMapCtx["mapBinary"]
  bg: ICanvasWithMapCtx["bg"]
  constructor() {
    this.ctx = CanvasWithMapCtx.ctx
    this.bgCtx = CanvasWithMapCtx.bgCtx
    this.mapBinary = new Array(gameParam.row).fill(0) as number[]
    this.bg = Array.from({ length: gameParam.row }, () =>
      Array.from({ length: gameParam.column }, () => void 0)
    )
    this.cleanUpCanvas()
  }
  private cleanUpCanvas() {
    this.clearCanvas(this.ctx)
    this.clearCanvas(this.bgCtx)
  }
  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}
