import { gameParam } from "../gameConfig"
import { ICanvasWithMapCtx } from "../types"

export default class CanvasWithMapCtx implements ICanvasWithMapCtx {
  private static canvas: HTMLCanvasElement
  private static bgCanvas: HTMLCanvasElement
  private static ctx: CanvasRenderingContext2D
  private static bgCtx: CanvasRenderingContext2D
  static nextBrickCanvas: HTMLCanvasElement
  static nextBrickCtx: CanvasRenderingContext2D
  static initContext(
    brickCanvas: HTMLCanvasElement,
    bgCanvas: HTMLCanvasElement,
    nextBrickCanvas: HTMLCanvasElement
  ) {
    this.canvas = brickCanvas
    this.bgCanvas = bgCanvas
    this.nextBrickCanvas = nextBrickCanvas
    this.ctx = brickCanvas.getContext("2d") as CanvasRenderingContext2D
    this.bgCtx = bgCanvas.getContext("2d") as CanvasRenderingContext2D
    this.nextBrickCtx = nextBrickCanvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D
    this.canvas.height = this.bgCanvas.height = gameParam.windowHeight
    this.canvas.width = this.bgCanvas.width = gameParam.windowWidth
    this.nextBrickCanvas.height = gameParam.brickHeight * 4
    this.nextBrickCanvas.width = gameParam.brickWidth * 4
  }
  brickCtx: CanvasRenderingContext2D
  bgCtx: CanvasRenderingContext2D
  nextBrickCtx: CanvasRenderingContext2D
  mapBinary: ICanvasWithMapCtx["mapBinary"]
  bg: ICanvasWithMapCtx["bg"]
  constructor() {
    this.brickCtx = CanvasWithMapCtx.ctx
    this.bgCtx = CanvasWithMapCtx.bgCtx
    this.nextBrickCtx = CanvasWithMapCtx.nextBrickCtx
    this.mapBinary = new Array(gameParam.row).fill(0) as number[]
    this.bg = Array.from({ length: gameParam.row }, () =>
      Array.from({ length: gameParam.column }, () => void 0)
    )
    this.cleanUpCanvas()
  }
  private cleanUpCanvas() {
    this.clearCanvas(this.brickCtx)
    this.clearCanvas(this.bgCtx)
  }
  private clearCanvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}
