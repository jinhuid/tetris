import { gameParam } from "../gameConfig"
import { IBrick, type BrickLetter, type IPoint } from "../types/brick"
import { bricks } from "./brickConfig"

const eliminateTarget = 2 ** gameParam.column - 1

class Point implements IPoint {
  constructor(public readonly x: number, public readonly y: number) {}
  withOffset(x: number, y: number) {
    return new Point(this.x + x, this.y + y)
  }
}

export class BaseBrick {
  static readonly height = gameParam.brickHeight
  static readonly width = gameParam.brickWidth
  private _letter: BrickLetter
  private _struct: Readonly<number[]>
  constructor(letter: BrickLetter) {
    this._letter = letter
    this._struct = this.getStructureVal()
  }
  get color() {
    return bricks[this._letter].color
  }
  get width() {
    return BaseBrick.width
  }
  get height() {
    return BaseBrick.height
  }
  get letter() {
    return this._letter
  }
  get struct() {
    return this._struct
  }
  setStruct(newStructure: Readonly<number[]>) {
    this._struct = newStructure
  }
  setLetter(letter: BrickLetter) {
    this._letter = letter
  }
  private getStructureVal() {
    return bricks[this._letter].struct.map(s => parseInt(s, 2))
  }
}

class BrickState extends BaseBrick {
  private _point: Readonly<Point>
  private _landingPoint!: Readonly<Point>
  private _isRecycle = false
  protected readonly mapBinary: Readonly<number[]>
  constructor(letter: BrickLetter, mapBinary: Readonly<number[]>) {
    super(letter)
    this._point = new Point(this.getInitX(), this.getInitY())
    this.mapBinary = mapBinary
    this.computeLandingPoint()
  }
  get landingPoint() {
    return this._landingPoint
  }
  get isRecycle() {
    return this._isRecycle
  }
  get point() {
    return this._point
  }
  get structure() {
    return this.struct
  }
  setStructure(newStructure: Readonly<number[]>) {
    this.setStruct(newStructure)
    this.computeLandingPoint()
  }
  setPoint(newPoint: Readonly<Point>) {
    let x = this._point.x
    this._point = newPoint
    if (x !== newPoint.x) {
      this.computeLandingPoint()
    }
  }
  setLandingPoint(newPoint: Readonly<Point>) {
    this._landingPoint = newPoint
  }
  setRecycle() {
    this._isRecycle = true
  }
  getStructWithOffset(structure = this.structure, x: number = this._point.x) {
    const carry = gameParam.column - x - structure.length
    return structure.map(v => {
      if (carry >= 0) {
        return v << carry
      }
      return v >> -carry
    })
  }
  private getInitX() {
    return (
      Math.floor(gameParam.column / 2) - Math.floor(this.structure.length / 2)
    )
  }
  private getInitY() {
    const index = this.structure.findLastIndex(s => s !== 0)
    if (index === -1) return -this.structure.length
    return -index - 1
  }
  protected computeLandingPoint() {
    let point = this._point.withOffset(0, 0)
    let y = 1
    while (!this.isOverlap(point.withOffset(0, y))) {
      y++
    }
    this.setLandingPoint(point.withOffset(0, y - 1))
  }
  protected isOverlap(
    { x, y }: IPoint = this._point,
    structure: number[] = this.getStructWithOffset(),
    mapBinary: Readonly<number[]> = this.mapBinary
  ): boolean {
    if (x !== this._point.x) {
      const shift = x - this.point.x
      // structure = this.computeStructure(structure, shift)
      if (shift > 0) {
        structure = structure.map(b => b >> shift)
      } else {
        structure = structure.map(b => b << -shift)
      }
    }
    //mapBinary[y + i] 可能超出下标 这时需要换成触底检测
    return structure.some((b, i) => {
      if (y + i < 0) return false
      return (b & (mapBinary[y + i] ?? eliminateTarget)) !== 0
    })
  }
}

export class Brick extends BrickState implements IBrick {
  private lastTime: number
  constructor(
    letter: BrickLetter,
    mapBinary: number[],
    lastTime: number = performance.now()
  ) {
    super(letter, mapBinary)
    this.lastTime = lastTime
  }
  /**
   * @param time 每帧调用时间戳
   * @returns 无法更新位置
   */
  update(time: number) {
    if (time - this.lastTime >= 1000 / gameParam.speed) {
      this.lastTime = time - ((time - this.lastTime) % (1000 / gameParam.speed))
      const point = this.point.withOffset(0, 1)
      const canUpdate = !this.isOverlap(point)
      if (canUpdate) this.setPoint(point)
      return !canUpdate
    }
    return false
  }
  left() {
    this.move(-1, 0)
  }
  right() {
    this.move(1, 0)
  }
  /**
   * @returns 是否无法继续下落
   */
  downOne() {
    return !this.move(0, 1)
  }
  /**
   * 一次性下落到底部
   * @returns 是否无法继续下落
   */
  downToBottom() {
    while (this.move(0, 1)) {}
    return true
  }
  rotate() {
    const len = this.structure.length
    const newStructure: number[] = new Array(len).fill(0)
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (this.structure[i] & (1 << (len - 1 - j))) {
          const x = i
          const y = len - 1 - j
          if (this.isOutOfBounds(x, y)) return
          newStructure[y] += 1 << (len - 1 - x)
        }
      }
    }
    if (!this.isOverlap(this.point, this.getStructWithOffset(newStructure))) {
      this.setStructure(newStructure)
    }
  }
  /**
   * 检查是否超出边界
   */
  private isOutOfBounds(x: number, y: number) {
    return (
      x + this.point.x >= gameParam.column ||
      x + this.point.x < 0 ||
      y + this.point.y >= gameParam.row
    )
  }
  private isAtBorder(right: boolean) {
    const target = right ? 1 : (eliminateTarget + 1) / 2
    const structure = this.getStructWithOffset()
    return structure.some(b => b & target)
  }
  /**
   * 移动方块
   * @param dx 横向位移
   * @param dy 纵向位移
   * @returns 是否成功移动
   */
  private move(dx: number, dy: number): boolean {
    const point = this.point.withOffset(dx, dy)
    if ((dx === 0 || !this.isAtBorder(dx > 0)) && !this.isOverlap(point)) {
      this.setPoint(point)
      return true
    }
    return false
  }
}
