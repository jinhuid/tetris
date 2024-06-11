import { gameParam } from "../gameConfig"
import { IBrick } from "../types/brick"
import { drawStyle } from "./brickStyle"

const offsetCanvas = document.createElement("canvas")
const offsetCtx = offsetCanvas.getContext("2d")!
//最多缓存20个砖块
offsetCanvas.height = gameParam.brickHeight * 20
offsetCanvas.width = gameParam.brickWidth
let index = 0
const cache: Record<string, number> = {}

export const drawBrickPiece = (
  ctx: CanvasRenderingContext2D,
  { point, width, height, color }: IBrick,
  globalAlpha: number = 1
) => {
  if (color in cache) {
    ctx.globalAlpha = globalAlpha
    ctx.drawImage(
      offsetCanvas,
      0,
      height * cache[color],
      width,
      height,
      point.x,
      point.y,
      width,
      height
    )
    ctx.globalAlpha = 1
    return
  }
  drawStyle(offsetCtx, {
    point: {
      x: 0,
      y: index * height,
    },
    width,
    height,
    color,
  } as IBrick)
  cache[color] = index++
  ctx.drawImage(
    offsetCanvas,
    0,
    height * cache[color],
    width,
    height,
    point.x,
    point.y,
    width,
    height
  )
}
