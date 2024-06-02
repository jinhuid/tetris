import { gameParam } from "./gameConfig"
import { ICanvasWithMapCtx } from "./types"
import { IBrick } from "./types/brick"
import { SinglePattern } from "./utils"

class GameHelper {
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
    const binary = brick.getBinary()
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] === 0) continue
      mapBinary[brick.y + i] |= binary[i]
      for (let j = gameParam.column - 1, r = binary[i]; r !== 0; j--, r >>= 1) {
        if (r & 1) {
          bg[brick.y + i][j] = brick.color
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
    bg: ICanvasWithMapCtx["bg"]
  ) {
    let count = 0
    for (let i = gameParam.row - 1; i >= 0; i--) {
      if (mapBinary[i] === 2 ** gameParam.column - 1) {
        count++
        mapBinary.splice(i, 1)
        mapBinary.unshift(0)
        bg.splice(i, 1)
        bg.unshift(Array.from({ length: gameParam.column }))
        i++
      }
    }
    return count
  }
  isGameOver(brick: IBrick) {
    // 这里只需要判断方块是否超出顶部即可 判断方块的每一行下标是不是越界(及y小于0)
    const len = brick.structure.length
    for (let i = 0; i < len; i++) {
      if (brick.y + i < 0) return true
    }
    return false
  }
  computeScore(row: number) {
    switch (row) {
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

const SingleGameHelper = SinglePattern(GameHelper)
const gameHelper = new SingleGameHelper()

export { gameHelper }
export type { GameHelper }