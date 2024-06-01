import { Brick } from "../brick"
import { gameParam } from "../config"
import { drawBrickPiece } from "../draw"
import { BrickColor } from "../types"

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
