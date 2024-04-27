import { gameParam, bricks } from "./config"
import { drawLetter } from "./draw"
import { BinaryString, BrickColor, BrickLetter, BrickStruct } from "./types"

export interface BrickImpl {
  color: BrickColor
  structure: BinaryString<BrickStruct>
  x: number
  y: number
  width: number
  height: number
  isRecycle: boolean
  draw(ctx: CanvasRenderingContext2D): void
  update(time: number, mapBinary: number[]): boolean
  left(mapBinary: number[]): void
  right(mapBinary: number[]): void
  downOne(mapBinary: number[]): boolean
  downBottom(mapBinary: number[]): boolean
  rotate(mapBinary: number[]): void
}

const getRandomLetter = (): BrickLetter => {
  const letters = Object.keys(bricks) as BrickLetter[]
  return letters[(Math.random() * letters.length) >> 0]
}
const getY = (structure: BinaryString<BrickStruct>) => {
  const index = structure.findLastIndex((s) => +s !== 0)
  if (index === -1) return -structure.length
  return -index - 1
}

export class Brick implements BrickImpl {
  private letter: BrickLetter
  private lastTime: number
  public color: BrickColor
  public structure: BinaryString<BrickStruct>
  public x: number
  public y: number
  public width = gameParam.brickWidth
  public height = gameParam.brickHeight
  public isRecycle = false
  constructor(time = performance.now()) {
    this.letter = getRandomLetter()
    this.color = bricks[this.letter].color
    this.structure = bricks[this.letter].struct
    this.x = gameParam.column / 2 - 1
    this.y = getY(this.structure)
    this.lastTime = time
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
      this.lastTime = time - ((time - this.lastTime) % (1000 / gameParam.speed))
      if (!this.isOverlap(mapBinary, this.getBinary(), this.x, this.y + 1)) {
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
   * @param mapBinary 已记录方块的二进制数据
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
    return true
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
    newStructure = newStructure.map((s) =>
      s.join("")
    ) as BinaryString<BrickStruct>
    const newBinary = this.getBinary(newStructure)
    if (this.isOverlap(mapBinary, newBinary)) return
    this.structure = newStructure
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
  /**
   *
   * @param mapBinary 已记录方块的二进制数据
   * @param binary 方块二进制数据
   * @param x 第几行
   * @param y 第几列
   * @returns 是不是有方块重叠
   */
  private isOverlap(
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
  private inBorder(direction: string) {
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
