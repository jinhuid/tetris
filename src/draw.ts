import { Brick } from "./brick"
import { gameParam } from "./config"
import { BrickColor } from "./types"

const offsetCanvas = document.createElement("canvas")
const offsetCtx = offsetCanvas.getContext("2d")!
//最多缓存20个砖块
offsetCanvas.height = gameParam.brickHeight * 20
offsetCanvas.width = gameParam.brickWidth
let index = 0
const cache: Record<string, number> = {}

export const drawBrickPiece = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, color }: Brick
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

  const radius = height / 10/**弧度比例 */ * gameParam.devicePixelRatio // 圆角半径
  const borderWidth = height / 25/**边框比例 */ * gameParam.devicePixelRatio // 边框宽度

  // 绘制填充图形
  offsetCtx.fillStyle = color
  console.log(height,width);
  offsetCtx.beginPath()
  offsetCtx.moveTo(0 + radius, index * height)
  offsetCtx.lineTo(0 + width - radius, index * height)
  offsetCtx.arcTo(
    0 + width,
    index * height,
    0 + width,
    index * height + radius,
    radius
  )
  offsetCtx.lineTo(0 + width, index * height + height - radius)
  offsetCtx.arcTo(
    0 + width,
    index * height + height,
    0 + width - radius,
    index * height + height,
    radius
  )
  offsetCtx.lineTo(0 + radius, index * height + height)
  offsetCtx.arcTo(
    0,
    index * height + height,
    0,
    index * height + height - radius,
    radius
  )
  offsetCtx.lineTo(0, index * height + radius)
  offsetCtx.arcTo(0, index * height, 0 + radius, index * height, radius)
  offsetCtx.fill()

  // 计算边框的位置
  const borderX = 0 + borderWidth / 2
  const borderY = index * height + borderWidth / 2
  const borderWidthAdjusted = width - borderWidth
  const borderHeightAdjusted = height - borderWidth

  // 绘制边框
  offsetCtx.strokeStyle = "#000000"
  offsetCtx.lineWidth = borderWidth
  offsetCtx.beginPath()
  offsetCtx.moveTo(borderX + radius, borderY)
  offsetCtx.lineTo(borderX + borderWidthAdjusted - radius, borderY)
  offsetCtx.arcTo(
    borderX + borderWidthAdjusted,
    borderY,
    borderX + borderWidthAdjusted,
    borderY + radius,
    radius
  )
  offsetCtx.lineTo(
    borderX + borderWidthAdjusted,
    borderY + borderHeightAdjusted - radius
  )
  offsetCtx.arcTo(
    borderX + borderWidthAdjusted,
    borderY + borderHeightAdjusted,
    borderX + borderWidthAdjusted - radius,
    borderY + borderHeightAdjusted,
    radius
  )
  offsetCtx.lineTo(borderX + radius, borderY + borderHeightAdjusted)
  offsetCtx.arcTo(
    borderX,
    borderY + borderHeightAdjusted,
    borderX,
    borderY + borderHeightAdjusted - radius,
    radius
  )
  offsetCtx.lineTo(borderX, borderY + radius)
  offsetCtx.arcTo(borderX, borderY, borderX + radius, borderY, radius)
  offsetCtx.stroke()

  // 关闭路径
  offsetCtx.closePath()
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

export const drawBrick = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, color, structure }: Brick
) => {
  for (let i = 0; i < structure.length; i++) {
    for (let j = 0; j < structure[i].length; j++) {
      if (structure[i][j] == "0") continue
      drawBrickPiece(ctx, {
        x: (x + j) * width,
        y: (y + i) * height,
        width,
        height,
        color,
      } as Brick)
    }
  }
}

export const drawBg = function (
  ctx: CanvasRenderingContext2D,
  colors: BrickColor[][],
  brickWidth: number = gameParam.brickWidth,
  brickHeight: number = gameParam.brickHeight
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let i = 0; i < colors.length; i++) {
    for (let j = 0; j < colors[i].length; j++) {
      if (colors[i][j] === void 0) continue
      drawBrickPiece(ctx, {
        x: j * brickWidth,
        y: i * brickHeight,
        width: brickWidth,
        height: brickHeight,
        color: colors[i][j],
      } as Brick)
    }
  }
}
