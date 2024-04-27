import { Brick } from "./brick"
import { gameParam } from "./config"
import { BrickColor } from "./types"

export const drawBrick = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, color }: Brick
) => {
  var radius = 8 * gameParam.devicePixelRatio // 圆角半径
  var borderWidth = 4 * gameParam.devicePixelRatio // 边框宽度

  ctx.fillStyle = color // 设置填充颜色
  ctx.beginPath() // 开始路径
  ctx.moveTo(x + radius, y) // 移动到左上角顶点
  ctx.lineTo(x + width - radius, y) // 绘制顶部直线
  ctx.arcTo(x + width, y, x + width, y + radius, radius) // 绘制右上角圆弧
  ctx.lineTo(x + width, y + height - radius) // 绘制右侧直线
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius) // 绘制右下角圆弧
  ctx.lineTo(x + radius, y + height) // 绘制底部直线
  ctx.arcTo(x, y + height, x, y + height - radius, radius) // 绘制左下角圆弧
  ctx.lineTo(x, y + radius) // 绘制左侧直线
  ctx.arcTo(x, y, x + radius, y, radius) // 绘制左上角圆弧
  ctx.fill() // 填充颜色

  // 绘制边框
  ctx.strokeStyle = "#000000" // 设置边框颜色
  ctx.lineWidth = borderWidth // 设置边框宽度
  ctx.beginPath() // 开始路径
  ctx.moveTo(x + radius, y) // 移动到左上角顶点
  ctx.lineTo(x + width - radius, y) // 绘制顶部直线
  ctx.arcTo(x + width, y, x + width, y + radius, radius) // 绘制右上角圆弧
  ctx.lineTo(x + width, y + height - radius) // 绘制右侧直线
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius) // 绘制右下角圆弧
  ctx.lineTo(x + radius, y + height) // 绘制底部直线
  ctx.arcTo(x, y + height, x, y + height - radius, radius) // 绘制左下角圆弧
  ctx.lineTo(x, y + radius) // 绘制左侧直线
  ctx.arcTo(x, y, x + radius, y, radius) // 绘制左上角圆弧
  ctx.stroke() // 绘制边框

  // 关闭路径
  ctx.closePath()
}

export const drawLetter = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, color, structure }: Brick
) => {
  for (let i = 0; i < structure.length; i++) {
    for (let j = 0; j < structure[i].length; j++) {
      if (structure[i][j] == "0") continue
      drawBrick(ctx, {
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
      drawBrick(ctx, {
        x: j * brickWidth,
        y: i * brickHeight,
        width: brickWidth,
        height: brickHeight,
        color: colors[i][j],
      } as Brick)
    }
  }
}
