import { isBinaryString } from "./helper"

export type BinaryString<T extends BrickStruct> = {
  [K in keyof T]: isBinaryString<T[K]>
}

// type a = BinaryString<("00" | "10" | "01" | "11")[]>

export type Binary<
  T extends number,
  R extends string = "",
  Arr extends string[] = []
> = Arr["length"] extends T ? R : Binary<T, `${R}${"0" | "1"}`, [...Arr, ""]>

export type Struct<
  T extends number,
  R extends any[] = []
> = R["length"] extends T ? R : Struct<T, [...R, Binary<T>]>

export type BrickLetter = keyof Bricks

export type BrickColor = Bricks[BrickLetter]["color"]

export type BrickStruct = Bricks[BrickLetter]["struct"]

export type GameParam = {
  readonly windowWidth: number
  readonly windowHeight: number
  readonly row: number
  readonly column: number
  readonly devicePixelRatio: number
  readonly brickWidth: number
  readonly brickHeight: number
  readonly FPS: number
  speed: number
  keySpeed: number
  score: number
}

export type OperateEvents = {
  left: () => void
  right: () => void
  downOne: () => void
  downBottom: () => void
  rotate: () => void
  pauseGame: () => void
}

export type Bricks = {
  [key: string]: {
    color: string
    struct: Struct<1> | Struct<2> | Struct<3> | Struct<4>
  }
  o: {
    color: "#FADADD"
    struct: Struct<2>
  }
  i: {
    color: "#F7E9D4"
    struct: Struct<4>
  }
  s: {
    color: "#C8E6C9"
    struct: Struct<3>
  }
  z: {
    color: "#B3E5FC"
    struct: Struct<3>
  }
  l: {
    color: "#FFCC80"
    struct: Struct<3>
  }
  j: {
    color: "#FFEE58"
    struct: Struct<3>
  }
  t: {
    color: "#CE93D8"
    struct: Struct<3>
  }
}

export type DrawBrick = {
  x: number
  y: number
  width: number
  height: number
  color: BrickColor
  structure: BinaryString<BrickStruct>
}

export interface IBrick {
  isRecycle: boolean
  draw(ctx: CanvasRenderingContext2D): void
  update(time: number, mapBinary: number[]): boolean
  getBinary(): number[]
  left(mapBinary: number[]): void
  right(mapBinary: number[]): void
  downOne(mapBinary: number[]): boolean
  downBottom(mapBinary: number[]): boolean
  rotate(mapBinary: number[]): void
}

export interface ICanvasWithMapCtx {
  ctx: CanvasRenderingContext2D
  bgCtx: CanvasRenderingContext2D
  cleanUpCanvas: () => void
  mapBinary: number[]
  bg: BrickColor[][]
}

export interface PlayWithPause {
  playGame: () => void
  pauseGame: () => void
}

export interface IRenderer extends PlayWithPause {
  over: boolean
  pause: boolean
  render: (time: number) => void
}

export interface IGame extends PlayWithPause {
  over: boolean
  pause: boolean
  startGame: () => void
  restartGame: () => void
  cancelGame: () => void
}
