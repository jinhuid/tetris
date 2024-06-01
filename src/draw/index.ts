import { gameParam } from "../gameConfig"
import { DrawBrick, BrickColor } from "../types"
import { drawBrickPiece } from "./drawBrickPiece"

export const drawBrick = (
  ctx: CanvasRenderingContext2D,
{ x, y, width, height, color, structure }:DrawBrick
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
      } as DrawBrick)
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
      } as DrawBrick)
    }
  }
}
