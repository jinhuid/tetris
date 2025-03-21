import type { BaseBrick } from "../brick"
import { bricks } from "../brick/brickConfig"
import { drawBrick } from "../draw"
import { drawBrickPiece } from "../draw/drawBrickPiece"
import { gameParam } from "../gameConfig"
import { ICanvasWithMapCtx } from "../types"
import { BrickLetter, IBrick, type IPoint } from "../types/brick"
import { SinglePattern } from "../utils"

class Helper {
  private eliminateTarget = 2 ** gameParam.column - 1
  getRandomLetter(): BrickLetter {
    const letters = Object.keys(bricks) as BrickLetter[]
    return letters[(Math.random() * letters.length) >> 0]
  }
  /**
   * @dec 记录方块的落点位置 以及它的颜色
   * @returns 是否成功记录 如果失败就是游戏结束
   */
  record(
    mapBinary: ICanvasWithMapCtx["mapBinary"],
    bg: ICanvasWithMapCtx["bg"],
    brick: IBrick
  ) {
    // 记录失败返回会false
    if (this.isGameOver(brick)) {
      return false
    }
    const binary = brick.getStructWithOffset()
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] === 0) continue
      mapBinary[brick.point.y + i] |= binary[i]
      for (let j = gameParam.column - 1, r = binary[i]; r !== 0; j--, r >>= 1) {
        if (r & 1) {
          bg[brick.point.y + i][j] = brick.color
        }
      }
    }
    return true
  }
  /**
   * 消除行和颜色
   */
  eliminate(
    mapBinary: ICanvasWithMapCtx["mapBinary"],
    bg: ICanvasWithMapCtx["bg"],
    from: number,
    to: number
  ) {
    let count = 0
    while (from < to) {
      if (mapBinary[from] === this.eliminateTarget) {
        mapBinary.splice(from, 1)
        mapBinary.unshift(0)
        bg.splice(from, 1)
        bg.unshift(new Array(bg[0].length))
        count++
        continue
      }
      from++
    }
    return count
  }
  isGameOver(brick: IBrick) {
    // 这里只需要判断方块是否超出顶部即可 判断方块的每一行下标是不是越界(及y小于0)
    const len = brick.structure.length
    for (let i = 0; i < len; i++) {
      if (brick.point.y + i < 0) return true
    }
    return false
  }
  drawBg(
    ctx: CanvasRenderingContext2D,
    colors: ICanvasWithMapCtx["bg"],
    brickWidth: number,
    brickHeight: number
  ) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < colors[i].length; j++) {
        if (colors[i][j] === void 0) continue
        drawBrickPiece(ctx, {
          point: {
            x: j * brickWidth,
            y: i * brickHeight,
          },
          width: brickWidth,
          height: brickHeight,
          color: colors[i][j],
        } as IBrick)
      }
    }
  }
  drawBrick(
    ctx: CanvasRenderingContext2D,
    brick: BaseBrick,
    position: IPoint,
    globalAlpha: number
  ) {
    drawBrick(ctx, brick, globalAlpha, position)
  }

  drawNextBrick(ctx: CanvasRenderingContext2D, brick: BaseBrick) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    this.drawBrick(ctx, brick, { x: 0, y: 0 }, 1)
  }
  computeScore(eliminateNum: number) {
    switch (eliminateNum) {
      case 0:
        return 20
      case 1:
        return 120
      case 2:
        return 320
      case 3:
        return 720
      case 4:
        return 1520
      default:
        return 20
    }
  }
}

const SingleGameHelper = SinglePattern(Helper)
const gameHelper = new SingleGameHelper()

export { gameHelper }
export type { Helper as GameHelper }
