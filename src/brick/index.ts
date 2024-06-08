import { drawBrick } from "../draw"
import { gameParam } from "../gameConfig"
import { BrickColor, BrickStruct, Bricks, IBrick } from "../types/brick"
import { bricks } from "./brickConfig"

const getY = (structure: Readonly<number[]>) => {
  const index = structure.findLastIndex((s) => s !== 0)
  if (index === -1) return -structure.length
  return -index - 1
}

const getStructureVal = (structure: BrickStruct): number[] => {
  return structure.map((s) => parseInt(s, 2))
}

const eliminateTarget = 2 ** gameParam.column - 1

export class Brick implements IBrick {
  static readonly height = gameParam.brickHeight
  static readonly width = gameParam.brickWidth
  readonly color: BrickColor
  readonly width: number
  readonly height: number
  structure: Readonly<number[]>
  x: number
  y: number
  isRecycle = false
  constructor(
    public letter: keyof Bricks,
    public lastTime: number = performance.now()
  ) {
    this.color = bricks[this.letter].color
    this.width = Brick.width
    this.height = Brick.height
    this.structure = getStructureVal(bricks[this.letter].struct)
    this.x = gameParam.column / 2 - 1
    this.y = getY(this.structure)
  }
  draw(ctx: CanvasRenderingContext2D) {
    drawBrick(ctx, this)
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
  downToBottom(mapBinary: number[]) {
    while (!this.isOverlap(mapBinary, this.getBinary(), this.x, this.y + 1)) {
      this.y++
    }
    return true
  }
  rotate(mapBinary: number[]) {
    const len = this.structure.length
    const newStructure: number[] = new Array(len).fill(0)
    let i = 0,
      j = 0
    while (i < len) {
      if (this.structure[i] & (1 << (len - 1 - j))) {
        const x = i
        const y = len - 1 - j
        //边界检测
        if (
          x + this.x >= gameParam.column ||
          x + this.x < 0 ||
          y + this.y >= gameParam.row
        ) {
          return
        }
        newStructure[y] += 1 << (len - 1 - x)
      }
      j++
      if (j === len) {
        i++
        j = 0
      }
    }
    const newBinary = this.getBinary(newStructure)
    if (this.isOverlap(mapBinary, newBinary)) return
    this.structure = newStructure
  }
  getBinary(structure = this.structure, x: number = this.x) {
    const carry = gameParam.column - x - structure.length
    return structure.map((v) => {
      if (carry >= 0) {
        return v << carry
      }
      return v >> -carry
    })
  }
  correctLastTime(time: number) {
    this.lastTime = time
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
      //mapBinary[y + i] 可能的情况为0 或者 undefined(因为brick.structure有全0排列)
      if (binary[i] & (mapBinary[y + i] ?? eliminateTarget)) {
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
    const maxBorderBinaryValue = { left: (eliminateTarget + 1) / 2, right: 1 }
    for (let i = binary.length - 1; i >= 0; i--) {
      if (binary[i] & maxBorderBinaryValue[direction]) {
        return true
      }
    }
    return false
  }
}
