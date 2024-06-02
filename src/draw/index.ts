import { IBrick } from "../types/brick"
import { drawBrickPiece } from "./drawBrickPiece"

export const drawBrick = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, color, structure }: IBrick
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
      } as IBrick)
    }
  }
}


