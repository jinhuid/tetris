import { IBrick } from "../types/brick"
import { drawBrickPiece } from "./drawBrickPiece"

export const drawBrick = (
  ctx: CanvasRenderingContext2D,
  { x, y, width, height, color, structure }: IBrick
) => {
  let i = 0,
    j = 0
  while (i < structure.length) {
    if (structure[i] & (1 << (structure.length - 1 - j))) {
      drawBrickPiece(ctx, {
        x: (x + j) * width,
        y: (y + i) * height,
        width,
        height,
        color,
      } as IBrick)
    }
    j++
    if (j === structure.length) {
      j = 0
      i++
    }
  }
}
