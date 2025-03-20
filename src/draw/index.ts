import type { BaseBrick } from "../brick"
import { IBrick, type IPoint } from "../types/brick"
import { drawBrickPiece } from "./drawBrickPiece"

export const drawBrick = (
  ctx: CanvasRenderingContext2D,
  { width, height, color, struct }: BaseBrick,
  globalAlpha: number,
  position: IPoint
) => {
  const len = struct.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      if (struct[i] & (1 << (len - 1 - j))) {
        drawBrickPiece(
          ctx,
          {
            point: {
              x: (position.x + j) * width,
              y: (position.y + i) * height,
            },
            width,
            height,
            color,
          } as IBrick,
          globalAlpha
        )
      }
    }
  }
}

