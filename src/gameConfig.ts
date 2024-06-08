import { GameParam } from "./types"

let width: number
let height: number

export const initConfig = (w: number, h: number) => {
  width = w
  height = h
}
export const gameParam: GameParam = {
  column: 16,
  row: 32,
  FPS: null,
  speed: 2,
  keySpeed: 20,
  devicePixelRatio: window.devicePixelRatio,
  // 给方块计算出整数值宽高，避免小数情况可能会出现方块间的间隙及渲染时小数造成的影响
  get brickWidth() {
    return Math.round((width * this.devicePixelRatio) / this.column)
  },
  get brickHeight() {
    return Math.round((height * this.devicePixelRatio) / this.row)
  },
  // 以方块的整数值加上行列算出整个画布的宽高
  get windowWidth() {
    return this.brickWidth * this.column
  },
  get windowHeight() {
    return this.brickHeight * this.row
  },
}
