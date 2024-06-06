import { gameParam } from "../gameConfig"
import { IBrick } from "../types/brick"
import { drawStyle } from "./brickStyle"

const offsetCanvas = document.createElement("canvas")
const offsetCtx = offsetCanvas.getContext("2d")!
queueMicrotask(() => {
  //最多缓存20个砖块
  // 为了防止模块同步加载时 而gameParam.brickWidth还未初始化 所以放置异步任务
  
})
offsetCanvas.height = gameParam.brickHeight * 20
  offsetCanvas.width = gameParam.brickWidth
let index = 0
const cache: Record<string, number> = {}

export const drawBrickPiece = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, color }: IBrick
) => {
  if (color in cache) {
    ctx.drawImage(
      offsetCanvas,
      0,
      height * cache[color],
      width,
      height,
      x,
      y,
      width,
      height
    )
    return
  }
  drawStyle(offsetCtx, {
    x: 0,
    y: index * height,
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
    x,
    y,
    width,
    height
  )
}
