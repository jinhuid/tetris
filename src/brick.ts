import {
  gameParam,
  BrickColor,
  BrickStruct,
  BrickLetter,
  BinaryString,
  bricks,
} from "./config"
import { drawLetter } from "./draw"

export interface BrickType {
  width: number
  height: number
  letter: BrickLetter
  color: BrickColor
  structure: BinaryString<BrickStruct>
  x: number
  y: number
  lastTime: number
  isRecycle: boolean
  getBinary<T extends BrickStruct>(
    structure?: BinaryString<T>,
    x?: number
  ): number[]
  draw(ctx: CanvasRenderingContext2D): void
  update(time: number, mapBinary: number[]): boolean
  left(mapBinary: number[]): void
  right(mapBinary: number[]): void
  downOne(mapBinary: number[]): void
  downBottom(mapBinary: number[]): void
  rotate(mapBinary: number[]): void
  isOverlap(
    mapBinary: number[],
    binary?: number[],
    x?: number,
    y?: number
  ): boolean
  inBorder(direction: string): boolean
}

const getRandomLetter = (): BrickLetter => {
  const letters = Object.keys(bricks) as BrickLetter[]
  return letters[(Math.random() * letters.length) >> 0]
}

export class Brick implements BrickType {
  letter: BrickLetter
  color: BrickColor
  structure: BinaryString<BrickStruct>
  x: number
  y: number
  lastTime: number
  isRecycle = false
  width = gameParam.brickWidth
  height = gameParam.brickHeight
  constructor(time = 0) {
    this.letter = getRandomLetter()
    this.color = bricks[this.letter].color
    this.structure = bricks[this.letter].struct
    this.x = gameParam.column / 2 - 1
    this.y = (() => {
      const index = this.structure.findLastIndex((s) => +s !== 0)
      if (index === -1) return  - this.structure.length
      return -index - 1
    })()
    this.lastTime = time
  }
  getBinary<T extends BrickStruct>(
    structure: BinaryString<T> = this.structure as BinaryString<T>,
    x: number = this.x
  ) {
    const binary: number[] = []
    const len = structure[0].length
    for (let i = structure.length - 1; i >= 0; i--) {
      let r
      let carry = gameParam.column - x - len
      if (carry >= 0) {
        r = parseInt(structure[i], 2) << carry
      } else {
        r = parseInt(structure[i], 2) >> -carry
      }
      binary.unshift(r)
    }
    return binary
  }
  draw(ctx: CanvasRenderingContext2D) {
    drawLetter(ctx, this)
  }
  /**
   * @param time 每帧调用时间戳
   * @param canDown 能不能继续下落
   * @returns 是否无法继续下落
   */
  update(time: number, mapBinary: number[]) {
    if (time - this.lastTime >= 1000 / gameParam.speed) {
      if (!this.isOverlap(mapBinary, this.getBinary(), this.x, this.y + 1)) {
        this.lastTime =
          time - ((time - this.lastTime) % (1000 / gameParam.speed))
        this.y++
        return false
      } else {
        return true
      }
    }
    return false
  }
  left(mapBinary: number[]) {
    if (this.inBorder("left")) return
    if (!this.isOverlap(mapBinary, this.getBinary(), this.x - 1)) {
      this.x--
    }
  }
  right(mapBinary: number[]) {
    if (this.inBorder("right")) return
    if (!this.isOverlap(mapBinary, this.getBinary(), this.x + 1)) {
      this.x++
    }
  }
  /**
   *
   * @param mapBinary ui二进制数据
   * @returns 是否无法继续下落
   */
  downOne(mapBinary: number[]) {
    if (!this.isOverlap(mapBinary, this.getBinary(), this.x, this.y + 1)) {
      this.y++
      return false
    }
    return true
  }
  downBottom(mapBinary: number[]) {
    while (!this.isOverlap(mapBinary, this.getBinary(), this.x, this.y + 1)) {
      this.y++
    }
  }
  rotate(mapBinary: number[]) {
    const len = this.structure[0].length
    let newStructure: string[][] | BinaryString<BrickStruct> = Array.from(
      { length: len },
      () => new Array(len)
    )
    for (let i = 0; i < this.structure.length; i++) {
      for (let j = 0; j < this.structure[i].length; j++) {
        let x = i,
          y = len - 1 - j
        if (
          this.structure[i][j] === "1" &&
          (x + this.x >= gameParam.column ||
            x + this.x < 0 ||
            y + this.y >= gameParam.row)
        )
          return
        newStructure[y][x] = this.structure[i][j]
      }
    }
    console.log(newStructure)
    newStructure = newStructure.map((s) => s.join("")) as BrickStruct
    const newBinary = this.getBinary(newStructure, this.x)
    if (this.isOverlap(mapBinary, newBinary)) return
    this.structure = newStructure
  }
  /**
   *
   * @param mapBinary ui二进制数据
   * @param binary 方块二进制数据
   * @param x 第几行
   * @param y 第几列
   * @returns 是不是有方块重叠
   */
  isOverlap(
    mapBinary: number[],
    binary = this.getBinary(),
    x: number = this.x,
    y: number = this.y
  ) {
    if (x - this.x !== 0) {
      const shift = x - this.x
      if (shift > 0) {
        binary = binary.map((b) => b >> shift)
      } else {
        binary = binary.map((b) => b << -shift)
      }
    }
    for (let i = binary.length - 1; i >= 0; i--) {
      if (y + i < 0) continue
      if (binary[i] & (mapBinary[y + i] ?? 2 ** gameParam.column - 1)) {
        return true
      }
    }
    return false
  }
  inBorder(direction: string) {
    let binary = this.getBinary()
    let settle = direction == "left" ? 2 ** (gameParam.column - 1) : 1
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] & settle) {
        return true
      }
    }
    return false
  }
}
