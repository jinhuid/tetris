import { gameParam } from "../gameConfig"
import { ICanvasWithMapCtx } from "../types"

// const canvas = $(".canvas.brick") as HTMLCanvasElement
// const bgCanvas = $(".canvas.bg") as HTMLCanvasElement

// canvas.height = bgCanvas.height = gameParam.windowHeight
// canvas.width = bgCanvas.width = gameParam.windowWidth

export default class CanvasWithMapCtx implements ICanvasWithMapCtx {
  private static canvas: HTMLCanvasElement
  private static bgCanvas: HTMLCanvasElement
  private static ctx: CanvasRenderingContext2D
  private static bgCtx: CanvasRenderingContext2D
  static initContext(canvas: HTMLCanvasElement, bgCanvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.bgCanvas = bgCanvas
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    this.bgCtx = bgCanvas.getContext("2d") as CanvasRenderingContext2D
    this.canvas.height = this.bgCanvas.height = gameParam.windowHeight
    this.canvas.width = this.bgCanvas.width = gameParam.windowWidth
  }
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
