import { Brick } from "./brick"
import { BrickColor, gameParam } from "./config"

// 记录方块在地图上的位置
export const record = (
  mapBinary: number[],
  bg: BrickColor[][],
  brick: Brick
) => {
  if (isGameOver(mapBinary, brick)) {
    alert("Game Over")
    return
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
}

// 消除行和颜色
export const eliminate = (mapBinary: number[], bg: BrickColor[][]) => {
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

// 游戏是否结束
const isGameOver = (mapBinary: number[], brick: Brick) => {
  // 这里只需要判断方块是否超出顶部即可 判断方块的每一行下标是不是越界(及y小于0)
  const len = brick.structure.length
  for (let i = 0; i < len; i++) {
    if (brick.y + i < 0) return true
  }
  return false
}
