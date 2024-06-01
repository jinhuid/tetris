import { Brick } from "../brick"
import { gameParam } from "../gameConfig"

export const drawStyle = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, color }: Brick
) => {
  const radius = height / 10/**弧度比例 */ * gameParam.devicePixelRatio // 圆角半径
  const borderWidth = height / 25/**边框比例 */ * gameParam.devicePixelRatio // 边框宽度
  // 绘制填充图形
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.arcTo(x + width, y, x + width, y + radius, radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
  ctx.lineTo(x + radius, y + height)
  ctx.arcTo(x, y + height, x, y + height - radius, radius)
  ctx.lineTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.fill()

  // 计算边框的位置
  const borderX = x + borderWidth / 2
  const borderY = y + borderWidth / 2
  const borderWidthAdjusted = width - borderWidth
  const borderHeightAdjusted = height - borderWidth

  // 绘制边框
  ctx.strokeStyle = "#000000"
  ctx.lineWidth = borderWidth
  ctx.beginPath()
  ctx.moveTo(borderX + radius, borderY)
  ctx.lineTo(borderX + borderWidthAdjusted - radius, borderY)
  ctx.arcTo(
    borderX + borderWidthAdjusted,
    borderY,
    borderX + borderWidthAdjusted,
    borderY + radius,
    radius
  )
  ctx.lineTo(
    borderX + borderWidthAdjusted,
    borderY + borderHeightAdjusted - radius
  )
  ctx.arcTo(
    borderX + borderWidthAdjusted,
    borderY + borderHeightAdjusted,
    borderX + borderWidthAdjusted - radius,
    borderY + borderHeightAdjusted,
    radius
  )
  ctx.lineTo(borderX + radius, borderY + borderHeightAdjusted)
  ctx.arcTo(
    borderX,
    borderY + borderHeightAdjusted,
    borderX,
    borderY + borderHeightAdjusted - radius,
    radius
  )
  ctx.lineTo(borderX, borderY + radius)
  ctx.arcTo(borderX, borderY, borderX + radius, borderY, radius)
  ctx.stroke()

  // 关闭路径
  ctx.closePath()
}
