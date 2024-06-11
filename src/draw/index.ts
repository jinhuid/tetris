import { IBrick } from "../types/brick"
import { drawBrickPiece } from "./drawBrickPiece"

export const drawBrick = (
  ctx: CanvasRenderingContext2D,
  { point, width, height, color, structure }: IBrick,
  globalAlpha: number
) => {
  let i = 0,
    j = 0
  while (i < structure.length) {
    if (structure[i] & (1 << (structure.length - 1 - j))) {
      drawBrickPiece(
        ctx,
        {
          point: {
            x: (point.x + j) * width,
            y: (point.y + i) * height,
          },
          width,
          height,
          color,
        } as IBrick,
        globalAlpha
      )
    }
    j++
    if (j === structure.length) {
      j = 0
      i++
    }
  }
}
