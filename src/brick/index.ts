import { gameParam } from "../gameConfig"
import { drawBrick } from "../draw"
import { BinaryString, BrickLetter, BrickStruct, IBrick } from "../types"
import { bricks } from "./brickConfig"

const getRandomLetter = (): BrickLetter => {
  const letters = Object.keys(bricks) as BrickLetter[]
  return letters[(Math.random() * letters.length) >> 0]
}
const getY = (structure: BinaryString<BrickStruct>) => {
  const index = structure.findLastIndex((s) => +s !== 0)
  if (index === -1) return -structure.length
  return -index - 1
}

export class Brick implements IBrick {
  private readonly letter = getRandomLetter()
  private readonly color = bricks[this.letter].color
  private readonly width = gameParam.brickWidth
  private readonly height = gameParam.brickHeight
  private structure: BinaryString<BrickStruct> = bricks[this.letter].struct
  private x = gameParam.column / 2 - 1
  private y = getY(this.structure)
  isRecycle = false
  constructor(private lastTime: number = performance.now()) {}
  draw(ctx: CanvasRenderingContext2D) {
    drawBrick(ctx, {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: this.color,
      structure: this.structure,
    })
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
    if (this.isAtBorder("left")) return
    if (!this.isOverlap(mapBinary, this.getBinary(), this.x - 1)) {
      this.x--
    }
  }
  right(mapBinary: number[]) {
    if (this.isAtBorder("right")) return
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
  getBinary(
    structure: BinaryString<BrickStruct> = this.structure,
    x: number = this.x
  ) {
    const binary: number[] = []
    const len = structure[0].length
    const carry = gameParam.column - x - len
    for (let i = len - 1; i >= 0; i--) {
      let r
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
  /**
   *
   * @param direction 方向
   * @returns 是否在左或右边无法移动
   */
  private isAtBorder(direction: "left" | "right") {
    const binary = this.getBinary()
    const maxBorderBinaryValue = { left: 2 ** (gameParam.column - 1), right: 1 }
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] & maxBorderBinaryValue[direction]) {
        return true
      }
    }
    return false
  }
}
